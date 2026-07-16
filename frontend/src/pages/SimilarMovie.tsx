import { useState } from "react";
import { recommendByMovie } from "../api/cinemoodApi";
import type { Movie } from "../api/cinemoodApi";
import MovieCard from "../components/MovieCard";

const SAMPLE_SUGGESTIONS = [
  "The Dark Knight",
  "Avatar",
  "The Matrix",
  "Interstellar",
  "Inception",
  "Titanic"
];

function SimilarMovie() {
  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (searchTitle: string) => {
    const query = searchTitle.trim();
    if (!query) return;

    setLoading(true);
    setSearched(true);
    setMessage("");

    try {
      const data = await recommendByMovie(query, 9);
      setMessage(data.message);
      setMovies(data.recommendations);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while searching.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setTitle(name);
    handleSearch(name);
  };

  return (
    <div className="page similar-page">
      <div className="page-header">
        <h1 className="page-title">🔍 Similar Movie Finder</h1>
        <p className="page-description">Enter a movie you love and we'll suggest titles with similar plots and metadata.</p>
      </div>

      <div className="filter-card">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(title); }} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Dark Knight, Inception, Avatar..."
              className="search-input"
              required
            />
          </div>
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? "Searching..." : "Find Similar"}
          </button>
        </form>

        <div className="suggestions-bar">
          <span className="suggestion-label">Try searching:</span>
          <div className="suggestion-tags">
            {SAMPLE_SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(s)}
                className="suggestion-tag"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Analyzing plot keywords and cast similarity...</p>
        </div>
      ) : (
        searched && (
          <div className="results-section">
            {movies.length > 0 ? (
              <>
                <div className="status-indicator success">
                  <span>✓</span> {message || "Similar titles found successfully."}
                </div>
                <div className="movie-grid">
                  {movies.map((movie) => (
                    <MovieCard key={movie.title} {...movie} />
                  ))}
                </div>
              </>
            ) : (
              <div className="status-indicator error">
                <span>✗</span> Movie "{title}" not found in our database. Please double-check spelling or try a sample suggestion.
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}

export default SimilarMovie;
