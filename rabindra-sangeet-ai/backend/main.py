
import json
import re
import unicodedata
from pathlib import Path

import joblib
import numpy as np
import torch

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification
)

from normalizer import normalize


# ============================================================
# 1. PATHS AND CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

METADATA_PATH = BASE_DIR / "metadata.json"
TFIDF_PATH = BASE_DIR / "tfidf_lr.joblib"
BERT_DIR = BASE_DIR / "banglabert"

SEEDS = [42, 7, 2024]

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Using device:", DEVICE)


# ============================================================
# 2. LOAD METADATA
# ============================================================

with open(METADATA_PATH, "r", encoding="utf-8") as f:
    metadata = json.load(f)

LABELS = metadata["labels"]

ENSEMBLE_WEIGHT = float(metadata["ensemble_weight"])

ID2LABEL = {
    int(k): v
    for k, v in metadata["id2label"].items()
}

print("Labels:", LABELS)
print("Ensemble weight:", ENSEMBLE_WEIGHT)


# ============================================================
# 3. LOAD TF-IDF MODEL
# ============================================================

print("Loading TF-IDF model...")

tfidf_model = joblib.load(TFIDF_PATH)

tfidf_classes = list(tfidf_model.classes_)

# Match TF-IDF probability columns with metadata labels.

tfidf_label_indices = [
    tfidf_classes.index(label)
    for label in LABELS
]

print("TF-IDF model loaded successfully.")


# ============================================================
# 4. LOAD BANGLABERT MODELS
# ============================================================

print("Loading BanglaBERT tokenizer...")

first_model_path = BERT_DIR / f"seed_{SEEDS[0]}"

tokenizer = AutoTokenizer.from_pretrained(
    str(first_model_path)
)

bert_models = []

for seed in SEEDS:

    model_path = BERT_DIR / f"seed_{seed}"

    print(f"Loading BanglaBERT seed {seed}...")

    model = AutoModelForSequenceClassification.from_pretrained(
        str(model_path)
    )

    model.to(DEVICE)
    model.eval()

    bert_models.append(model)

print("All BanglaBERT models loaded successfully.")


# ============================================================
# 5. ORIGINAL NOTEBOOK TEXT CLEANING
# ============================================================

def clean(text):

    text = unicodedata.normalize("NFC", str(text))

    text = text.replace("\\\n", " ").replace("\n", " ")

    text = re.sub(
        r"[॥।|–—*\-,;:!?\"'‘’“”()\[\].]",
        " ",
        text
    )

    text = re.sub(
        r"[0-9০-৯]+",
        " ",
        text
    )

    return re.sub(r"\s+", " ", text).strip()


# ============================================================
# 6. BERT PREDICTION
# ============================================================

def get_bert_probabilities(text):

    normalized_text = normalize(text)

    inputs = tokenizer(
        normalized_text,
        return_tensors="pt",
        truncation=True,
        max_length=256
    )

    inputs = {
        key: value.to(DEVICE)
        for key, value in inputs.items()
    }

    all_probabilities = []

    with torch.no_grad():

        for model in bert_models:

            outputs = model(**inputs)

            probabilities = torch.softmax(
                outputs.logits,
                dim=1
            )

            all_probabilities.append(
                probabilities.cpu().numpy()[0]
            )

    # Average probabilities from all three models.

    average_probabilities = np.mean(
        all_probabilities,
        axis=0
    )

    return average_probabilities


# ============================================================
# 7. TF-IDF PREDICTION
# ============================================================

def get_tfidf_probabilities(text):

    probabilities = tfidf_model.predict_proba([text])[0]

    # Match the notebook's label ordering.

    probabilities = probabilities[tfidf_label_indices]

    return probabilities


# ============================================================
# 8. FINAL ENSEMBLE PREDICTION
# ============================================================

def predict_parjaay(lyrics):

    cleaned_lyrics = clean(lyrics)

    if not cleaned_lyrics:

        raise ValueError(
            "Please enter valid Bengali song lyrics."
        )

    # BanglaBERT uses cleaned text followed by normalizer.

    bert_probabilities = get_bert_probabilities(
        cleaned_lyrics
    )

    # TF-IDF uses the original cleaned text.

    tfidf_probabilities = get_tfidf_probabilities(
        cleaned_lyrics
    )

    # Same ensemble formula used in the notebook.

    final_probabilities = (
        ENSEMBLE_WEIGHT * bert_probabilities
        +
        (1 - ENSEMBLE_WEIGHT) * tfidf_probabilities
    )

    predicted_index = int(
        np.argmax(final_probabilities)
    )

    predicted_label = LABELS[predicted_index]

    confidence = float(
        final_probabilities[predicted_index]
    )

    probability_details = {
        label: round(float(probability) * 100, 2)
        for label, probability in zip(
            LABELS,
            final_probabilities
        )
    }

    return {
        "parjaay": predicted_label,
        "confidence": round(confidence * 100, 2),
        "probabilities": probability_details
    }


# ============================================================
# 9. FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Rabindra Sangeet Parjaay Classification API",
    description="Classifies Rabindra Sangeet lyrics into Parjaay categories.",
    version="1.0.0"
)


# ============================================================
# 10. FRONTEND CONNECTION (CORS)
# ============================================================

app.add_middleware(
    CORSMiddleware,

    # Allow local Vite development servers.
    # The regex permits localhost and 127.0.0.1
    # with different development ports.

    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ============================================================
# 11. REQUEST FORMAT
# ============================================================

class LyricsRequest(BaseModel):

    lyrics: str = Field(
        ...,
        min_length=1,
        description="Bengali Rabindra Sangeet lyrics"
    )


# ============================================================
# 12. HOME / HEALTH CHECK
# ============================================================

@app.get("/")
def home():

    return {
        "message": "Rabindra Sangeet Classification API is running!",
        "status": "active",
        "device": str(DEVICE),
        "labels": LABELS
    }


# ============================================================
# 13. PREDICTION ENDPOINT
# ============================================================

@app.post("/predict")
def predict(request: LyricsRequest):

    try:

        result = predict_parjaay(request.lyrics)

        return {
            "success": True,
            "result": result
        }

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        print("Prediction error:", str(error))

        raise HTTPException(
            status_code=500,
            detail="An error occurred while classifying the lyrics."
        )
