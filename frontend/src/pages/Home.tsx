import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/cinemoodApi";
import type { DashboardStats } from "../api/cinemoodApi";
import MovieCard from "../components/MovieCard";
import { Link } from "react-router-dom";

function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Could not load dashboard statistics. Please ensure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="page home-page">
      <div className="hero-section">
        <h1 className="hero-title">🎬 <span className="gradient-text">CineMood</span></h1>
        <p className="hero-subtitle">
          Movie Recommendation & Sentiment Analysis Platform powered by Machine Learning
        </p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard stats...</p>
        </div>
      ) : error ? (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      ) : (
        stats && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">📚</span>
                <div className="stat-info">
                  <h3>{stats.total_movies.toLocaleString()}</h3>
                  <p>Total Movies</p>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-icon">⭐</span>
                <div className="stat-info">
                  <h3>{stats.average_rating.toFixed(2)}</h3>
                  <p>Average Rating</p>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-icon">🔥</span>
                <div className="stat-info">
                  <h3>{stats.average_popularity.toFixed(1)}</h3>
                  <p>Avg Popularity</p>
                </div>
              </div>
            </div>

            <div className="features-section">
              <h2 className="section-title">Explore Features</h2>
              <div className="hero-boxes">
                <Link to="/mood" className="feature-box">
                  <div className="feature-icon">🎭</div>
                  <h3>Mood Recommendation</h3>
                  <p>Find movies that match your current emotional state.</p>
                </Link>

                <Link to="/similar" className="feature-box">
                  <div className="feature-icon">🔍</div>
                  <h3>Similar Movie Finder</h3>
                  <p>Search for a movie to get recommendations based on similarity.</p>
                </Link>

                <Link to="/sentiment" className="feature-box">
                  <div className="feature-icon">🧠</div>
                  <h3>Sentiment Analyzer</h3>
                  <p>Input reviewer comments to classify feelings as positive or negative.</p>
                </Link>
              </div>
            </div>

            <div className="top-movies-section">
              <h2 className="section-title">⭐ Top Rated Movies</h2>
              <div className="movie-grid">
                {stats.top_rated_movies.map((movie) => (
                  <MovieCard key={movie.title} {...movie} />
                ))}
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}

export default Home;
