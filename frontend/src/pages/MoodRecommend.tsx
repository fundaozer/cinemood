import { useState } from "react";
import { recommendByMood } from "../api/cinemoodApi";
import type { Movie } from "../api/cinemoodApi";
import MovieCard from "../components/MovieCard";

// Define structured mood list with emojis and labels
const MOODS = [
  { id: "happy", label: "Happy", emoji: "😄", color: "#eab308" },
  { id: "sad", label: "Sad", emoji: "😢", color: "#3b82f6" },
  { id: "excited", label: "Excited", emoji: "⚡", color: "#ec4899" },
  { id: "relaxed", label: "Relaxed", emoji: "☕", color: "#10b981" },
  { id: "curious", label: "Curious", emoji: "🤔", color: "#a855f7" },
  { id: "scared", label: "Scared", emoji: "👻", color: "#f97316" },
];

function MoodRecommend() {
  const [selectedMood, setSelectedMood] = useState<string>("happy");
  const [minRating, setMinRating] = useState<number>(6.5);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);

  const handleRecommend = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const data = await recommendByMood(selectedMood, minRating, 9);
      if (data.found) {
        setMovies(data.recommendations);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error(error);
      alert("Error getting mood recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page mood-page">
      <div className="page-header">
        <h1 className="page-title">🎭 Mood-Based Recommendation</h1>
        <p className="page-description">Select how you feel and find the perfect movie to watch.</p>
      </div>

      <div className="filter-card">
        <div className="mood-select-section">
          <label className="filter-label">How are you feeling today?</label>
          <div className="mood-chips">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`mood-chip ${selectedMood === m.id ? "active" : ""}`}
                style={{
                  "--accent-color": m.color,
                } as React.CSSProperties}
                onClick={() => setSelectedMood(m.id)}
              >
                <span className="mood-emoji">{m.emoji}</span>
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rating-slider-section">
          <div className="slider-header">
            <span className="filter-label">Minimum Rating</span>
            <span className="slider-value">⭐ {minRating.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="9.0"
            step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="rating-slider"
          />
        </div>

        <button onClick={handleRecommend} className="recommend-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="btn-spinner"></span>
              Generating...
            </>
          ) : (
            "Get Recommendations"
          )}
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Analyzing matching movie genres...</p>
        </div>
      ) : (
        searched && (
          <div className="results-section">
            <h2 className="section-title">
              🍿 Recommendations for your "{selectedMood.toUpperCase()}" mood
            </h2>
            {movies.length > 0 ? (
              <div className="movie-grid">
                {movies.map((movie) => (
                  <MovieCard key={movie.title} {...movie} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No movies match your criteria. Try lowering the minimum rating.</p>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}

export default MoodRecommend;
