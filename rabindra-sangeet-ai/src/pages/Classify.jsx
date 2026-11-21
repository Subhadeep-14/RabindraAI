
import { useState } from "react";

import {
  Music2,
  Sparkles,
  RotateCcw,
  FileText,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  Flower2,
  Leaf,
  Heart,
  Globe2,
  BookOpen
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

const PARJAAY_DETAILS = {
  "পূজা": {
    english: "Devotion",
    subtitle: "ভক্তি, প্রার্থনা ও আত্মিক অনুভব",
    description:
      "The Puja Parjaay brings together songs expressing devotion, prayer, surrender and a spiritual connection with the divine.",
    reflection:
      "Your lyrics have been classified under Puja. This category is associated with expressions of devotion, spiritual longing and the search for a deeper connection.",
    icon: Flower2
  },

  "প্রকৃতি": {
    english: "Nature",
    subtitle: "ঋতু, সৌন্দর্য ও প্রকৃতির অনুভব",
    description:
      "The Prakriti Parjaay celebrates the natural world through songs inspired by seasons, changing landscapes, flowers, rain and the beauty of nature.",
    reflection:
      "Your lyrics have been classified under Prakriti. This category is associated with nature, seasonal changes and the many moods of the world around us.",
    icon: Leaf
  },

  "প্রেম": {
    english: "Love",
    subtitle: "প্রেম, আকাঙ্ক্ষা ও হৃদয়ের অনুভূতি",
    description:
      "The Prem Parjaay explores the many dimensions of love, affection, longing, separation and the emotional experiences of the human heart.",
    reflection:
      "Your lyrics have been classified under Prem. This category is associated with love and the different emotions that accompany human relationships.",
    icon: Heart
  },

  "বিচিত্র": {
    english: "Miscellaneous",
    subtitle: "বৈচিত্র্য ও বহুমাত্রিক ভাবনা",
    description:
      "The Bichitra Parjaay brings together songs with varied themes and expressions that do not fall neatly into the other three categories supported by this model.",
    reflection:
      "Your lyrics have been classified under Bichitra. This category represents a diverse range of themes and expressions within the model's classification system.",
    icon: Globe2
  }
};

const PARJAAY_LABELS = Object.keys(PARJAAY_DETAILS);

export default function Classify() {
  const [lyrics, setLyrics] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submittedLyrics = lyrics.trim();

    if (!submittedLyrics) {
      setMessage("Please enter some Bengali song lyrics first.");
      setResult(null);
      return;
    }

    if (submittedLyrics.length < 10) {
      setMessage("Please enter a longer lyrics passage for analysis.");
      setResult(null);
      return;
    }

    setLoading(true);
    setMessage("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          lyrics: submittedLyrics
        })
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(
          data?.detail || "Unable to classify the lyrics."
        );
      }

      if (
        !data ||
        data.success !== true ||
        !data.result ||
        !data.result.parjaay
      ) {
        throw new Error("The model returned an unexpected response.");
      }

      const predictedParjaay = data.result.parjaay;

      if (!PARJAAY_LABELS.includes(predictedParjaay)) {
        throw new Error("The model returned an unrecognized Parjaay.");
      }

      setResult({
        parjaay: predictedParjaay
      });

    } catch (error) {
      console.error("Classification error:", error);

      setMessage(
        error.message === "Failed to fetch"
          ? "Unable to connect to the classification server. Please make sure the backend is running."
          : error.message || "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  const clearLyrics = () => {
    setLyrics("");
    setMessage("");
    setResult(null);
  };

  const selectedDetails = result
    ? PARJAAY_DETAILS[result.parjaay]
    : null;

  const ResultIcon = selectedDetails?.icon;

  return (
    <main className="classify-page">

      {/* PAGE HERO */}

      <section className="classify-hero">
        <div className="container">

          <div className="classify-breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Classify Lyrics</span>
          </div>

          <div className="classify-hero-content">

            <div className="classify-icon">
              <Music2 size={25} />
            </div>

            <span className="section-label">
              THE ART OF RABINDRA SANGEET
            </span>

            <h1>
              Discover the
              <br />
              <span>Parjaay</span> of a Song.
            </h1>

            <p className="bengali classify-subtitle">
              গানের কথায় খুঁজে নিন তার পর্যায়
            </p>

            <p className="classify-hero-description">
              Every song carries its own world of emotions.
              Enter Bengali Rabindra Sangeet lyrics and
              discover the Parjaay suggested by our classifier.
            </p>

          </div>
        </div>
      </section>


      {/* LYRICS INPUT */}

      <section className="classify-workspace">
        <div className="container">

          <div className="workspace-heading">
            <div>
              <span className="section-label">
                BEGIN YOUR EXPLORATION
              </span>

              <h2 className="section-title">
                Enter Your Lyrics
              </h2>

              <p>
                Paste or type a passage from a Rabindra Sangeet composition.
              </p>
            </div>
          </div>


          <form
            className="lyrics-form"
            onSubmit={handleSubmit}
          >

            <div className="lyrics-form-header">

              <div className="form-heading">
                <FileText size={19} />
                <span>Song Lyrics</span>
              </div>

              <span className="language-label">
                বাংলা · BENGALI
              </span>

            </div>


            <textarea
              className="main-lyrics-input bengali"
              value={lyrics}
              onChange={(e) => {
                setLyrics(e.target.value);
                setMessage("");
                setResult(null);
              }}
              placeholder={
                "এখানে রবীন্দ্রসঙ্গীতের বাংলা লিরিক্স লিখুন বা পেস্ট করুন...\n\nআপনার পছন্দের রবীন্দ্রসঙ্গীতের কয়েকটি লাইন এখানে লিখতে পারেন।"
              }
              maxLength={10000}
              disabled={loading}
            />


            <div className="lyrics-input-footer">

              <span>
                {lyrics.length.toLocaleString()} / 10,000 characters
              </span>

              <button
                type="button"
                className="clear-btn"
                onClick={clearLyrics}
                disabled={loading || !lyrics}
              >
                <RotateCcw size={14} />
                Clear lyrics
              </button>

            </div>


            <div className="form-divider" />


            <div className="submit-area">

              <div className="submit-info">
                <BookOpen size={18} />
                <span>Discover the musical category</span>
              </div>

              <button
                type="submit"
                className="primary-btn classify-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    Analyzing...
                    <LoaderCircle
                      size={17}
                      className="loading-icon"
                    />
                  </>
                ) : (
                  <>
                    Analyze Lyrics
                    <Sparkles size={17} />
                  </>
                )}
              </button>

            </div>


            {message && (
              <div className="classify-message" role="alert">
                <AlertCircle size={18} />
                <p>{message}</p>
              </div>
            )}

          </form>


          {/* CLASSIFICATION RESULT */}

          {result && selectedDetails && (
            <section className="classification-result">

              <div className="result-heading">
                <span className="section-label">
                  YOUR CLASSIFICATION
                </span>

                <h2 className="section-title">
                  A World Within the Song
                </h2>

                <p>
                  The classifier has identified a Parjaay for your lyrics.
                </p>
              </div>


              {/* MAIN RESULT */}

              <div className="result-main-card">

                <div className="result-success-icon">
                  <CheckCircle2 size={24} />
                </div>

                <span className="result-label">
                  PREDICTED PARJAAY
                </span>

                <h3 className="bengali result-parjaay">
                  {result.parjaay}
                </h3>

                <span className="result-english">
                  {selectedDetails.english}
                </span>

                <p className="result-subtitle bengali">
                  {selectedDetails.subtitle}
                </p>

              </div>


              {/* PARJAAY DETAILS */}

              <div className="parjaay-details">

                <div className="parjaay-details-heading">
                  <span className="section-label">
                    UNDERSTANDING THE PARJAAY
                  </span>

                  <h3>
                    The meaning behind
                    <span className="bengali">
                      {" "}{result.parjaay}
                    </span>
                  </h3>
                </div>


                <div className="parjaay-detail-card">

                  <div className="parjaay-detail-icon">
                    <ResultIcon size={27} />
                  </div>

                  <div>
                    <span className="detail-overline">
                      ABOUT THIS CATEGORY
                    </span>

                    <p>
                      {selectedDetails.description}
                    </p>
                  </div>

                </div>


                <div className="lyrics-reflection">

                  <span className="detail-overline">
                    YOUR LYRICS, THEIR MUSICAL WORLD
                  </span>

                  <p>
                    {selectedDetails.reflection}
                  </p>

                </div>

                <p className="result-note">
                  This is a model prediction based on the lyrics
                  you provided. It is a category suggestion, not
                  confirmation of the song's original Gitabitan
                  classification.
                </p>

              </div>

            </section>
          )}

        </div>
      </section>

    </main>
  );
}
