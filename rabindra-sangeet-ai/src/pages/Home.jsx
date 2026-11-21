
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Music2,
  BrainCircuit,
  ShieldCheck,
  Heart,
  Leaf,
  Flower2,
  Globe2
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "পূজা",
    english: "Devotion",
    description: "Songs expressing devotion, prayer and spiritual reflection.",
    icon: Flower2,
    number: "01"
  },
  {
    name: "প্রকৃতি",
    english: "Nature",
    description: "Songs inspired by seasons, landscapes and the natural world.",
    icon: Leaf,
    number: "02"
  },
  {
    name: "প্রেম",
    english: "Love",
    description: "Songs exploring love, longing and human emotions.",
    icon: Heart,
    number: "03"
  },
  {
    name: "বিচিত্র",
    english: "Miscellaneous",
    description: "Songs belonging to the diverse and varied musical collection.",
    icon: Globe2,
    number: "04"
  }
];

export default function Home() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <main>

      {/* HERO SECTION */}

      <section className="hero" id="home">
        <div className="hero-decoration decoration-one" />
        <div className="hero-decoration decoration-two" />

        <div className="container hero-grid">

          <div className="hero-content">

            <div className="hero-tag">
              <Sparkles size={14} />
              ARTIFICIAL INTELLIGENCE MEETS BENGALI HERITAGE
            </div>

            <p className="hero-overline">
              A JOURNEY THROUGH THE WORLD OF
            </p>

            <h1>
              The Poetry of
              <br />
              <span>Rabindra Sangeet.</span>
            </h1>

            <h2 className="hero-bengali bengali">
              রবীন্দ্রসঙ্গীতের ভাব ও পর্যায়
            </h2>

            <p className="hero-description">
              Explore the world of Rabindra Sangeet through
              Bengali lyrics and machine learning. Discover
              how the words of a song can reveal its
              musical Parjaay.
            </p>

            <div className="hero-actions">

              <button
                className="primary-btn"
                onClick={() => navigate("/classify")}
              >
                Explore the Classifier
                <ArrowRight size={17} />
              </button>

              <button
                className="secondary-btn"
                onClick={() => scrollTo("about")}
              >
                Discover the Project
              </button>

            </div>

            <div className="hero-note">
              <BookOpen size={16} />
              A Bengali NLP and Machine Learning Project
            </div>

          </div>

          <div className="hero-art">

            <div className="art-frame">

              <div className="art-top-label">
                THE WORLD OF RABINDRA SANGEET
              </div>

              <div className="art-circle">
                <Music2 size={70} strokeWidth={1} />
              </div>

              <div className="art-bengali bengali">
                আমার পরান যাহা চায়
              </div>

              <div className="art-divider" />

              <div className="art-bottom">
                <span>LYRICS</span>
                <span>EMOTION</span>
                <span>PARJAAY</span>
              </div>

              <div className="art-number">01 — 04</div>

            </div>

            <div className="floating-note note-one">♪</div>
            <div className="floating-note note-two">♫</div>

          </div>

        </div>

        <div className="hero-bottom container">
          <span>01 / INTRODUCTION</span>
          <span>EXPLORE THE MUSICAL HERITAGE OF BENGAL</span>
        </div>

      </section>


      {/* INTRODUCTION */}

      <section className="intro-section" id="about">
        <div className="container intro-grid">

          <div>
            <span className="section-label">
              THE IDEA BEHIND THE PROJECT
            </span>

            <h2 className="section-title">
              Understanding music
              <br />
              through its <span>words.</span>
            </h2>
          </div>

          <div className="intro-description">
            <p>
              Rabindra Sangeet is a remarkable collection of
              songs that explores devotion, love, nature,
              patriotism and many other dimensions of human life.
            </p>

            <p>
              This project explores whether machine learning
              can identify a song's Parjaay by analyzing
              its Bengali lyrics.
            </p>
          </div>

        </div>

        <div className="container feature-grid">

          <div className="feature-card">
            <div className="feature-icon">
              <BookOpen />
            </div>

            <h3>Lyrics Analysis</h3>

            <p>
              Analyze Bengali song lyrics using natural
              language processing.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <BrainCircuit />
            </div>

            <h3>Machine Learning</h3>

            <p>
              Use trained language models and classical
              machine learning techniques.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <ShieldCheck />
            </div>

            <h3>Category Reference</h3>

            <p>
              Explore the relationship between model
              predictions and the original song categories.
            </p>
          </div>

        </div>
      </section>


      {/* CATEGORY SECTION */}

      <section className="category-section" id="explore">

        <div className="container">

          <div className="category-heading">
            <div>
              <span className="section-label">
                EXPLORE THE CATEGORIES
              </span>

              <h2 className="section-title">
                The Four Musical Worlds
              </h2>
            </div>

            <p>
              The current trained model supports
              four major Parjaay categories.
            </p>
          </div>

          <div className="category-grid">

            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  className="category-card"
                  key={category.name}
                >
                  <div className="category-card-top">
                    <span>{category.number}</span>
                    <Icon size={25} />
                  </div>

                  <h3 className="bengali">
                    {category.name}
                  </h3>

                  <span className="category-english">
                    {category.english}
                  </span>

                  <p>{category.description}</p>
                </div>
              );
            })}

          </div>

          <p className="category-footnote">
            These are the four categories supported by the
            current classification experiment. They do not
            represent every Parjaay in Gitabitan.
          </p>

        </div>

      </section>


      {/* MODEL INSIGHTS */}

      <section className="insights-section" id="insights">
        <div className="container insights-inner">

          <div>
            <span className="section-label">
              MODEL EVALUATION
            </span>

            <h2 className="section-title">
              Research backed by
              <br />
              measurable results.
            </h2>

            <p>
              Explore the machine learning methodology,
              experimental evaluation and performance
              of the trained classification models.
            </p>
          </div>

          <div className="insights-placeholder">
            <BrainCircuit size={42} />

            <h3>Model Insights</h3>

            <p>
              Evaluation charts, accuracy, macro-F1 and
              confusion matrix will be presented using
              the actual notebook results.
            </p>

          </div>

        </div>
      </section>


      {/* FINAL CALL TO ACTION */}

      <section className="classify-section">
        <div className="container">
          <div className="cta-content">

            <span className="section-label">
              DISCOVER THE PARJAAY
            </span>

            <h2 className="section-title">
              Let the lyrics reveal
              <br />
              their <span>musical identity.</span>
            </h2>

            <p>
              Have a Rabindra Sangeet song in mind?
              Explore its Parjaay through our Bengali
              lyrics classification model.
            </p>

            <button
              className="primary-btn"
              onClick={() => navigate("/classify")}
            >
              Classify Lyrics
              <ArrowRight size={17} />
            </button>

          </div>
        </div>
      </section>

    </main>
  );
}
