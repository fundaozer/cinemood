import { useState } from "react";
import { predictSentiment } from "../api/cinemoodApi";
import type { SentimentResponse } from "../api/cinemoodApi";

function Sentiment() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<SentimentResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const data = await predictSentiment(text);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error occurred during sentiment analysis.");
    } finally {
      setLoading(false);
    }
  };

  const getSentimentDetails = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return {
          emoji: "😊",
          label: "Positive Review",
          class: "positive",
          desc: "The audience highly appreciated this movie!"
        };
      case "negative":
        return {
          emoji: "😢",
          label: "Negative Review",
          class: "negative",
          desc: "The audience was generally disappointed or critical."
        };
      default:
        return {
          emoji: "😐",
          label: "Neutral Review",
          class: "neutral",
          desc: "The review has mixed opinions or a neutral tone."
        };
    }
  };

  const details = result ? getSentimentDetails(result.sentiment) : null;

  return (
    <div className="page sentiment-page">
      <div className="page-header">
        <h1 className="page-title">🧠 Review Sentiment Analysis</h1>
        <p className="page-description">Paste any audience movie review below and our Logistic Regression model will evaluate its sentiment.</p>
      </div>

      <div className="sentiment-container">
        <div className="input-card">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste a movie review here (in English for best results)..."
            rows={6}
            className="review-textarea"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="analyze-btn"
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Analyzing Text...
              </>
            ) : (
              "Analyze Sentiment"
            )}
          </button>
        </div>

        {result && details && (
          <div className={`result-card ${details.class}-glow`}>
            <div className="result-header">
              <span className="result-emoji">{details.emoji}</span>
              <div className="result-title-wrapper">
                <span className={`sentiment-badge ${details.class}`}>
                  {details.label}
                </span>
                <p className="result-explanation">{details.desc}</p>
              </div>
            </div>

            <div className="confidence-section">
              <div className="confidence-label-row">
                <span>Model Confidence</span>
                <strong>{(result.confidence * 100).toFixed(1)}%</strong>
              </div>
              <div className="progress-bar-bg">
                <div
                  className={`progress-bar-fill ${details.class}`}
                  style={{ width: `${result.confidence * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="analyzed-quote">
              <span className="quote-mark">“</span>
              <p className="quote-text">{result.text}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sentiment;
