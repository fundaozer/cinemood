import { useState, useEffect } from "react";

interface MovieCardProps {
  title: string;
  genres: string;
  overview: string;
  vote_average: number;
  popularity: number;
}

function MovieCard({
  title,
  genres,
  overview,
  vote_average,
  popularity,
}: MovieCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [posterLoading, setPosterLoading] = useState(true);

  // Convert comma separated genres to list of tags
  const genreList = genres ? genres.split(",").map((g) => g.trim()) : [];

  useEffect(() => {
    let active = true;
    const fetchPoster = async () => {
      try {
        const response = await fetch(`https://imdb.iamidiotareyoutoo.com/search?q=${encodeURIComponent(title)}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (active && data.ok && data.description && data.description.length > 0) {
          const match = data.description.find(
            (item: any) => item["#TITLE"]?.toLowerCase() === title.toLowerCase()
          ) || data.description[0];
          
          if (match && match["#IMG_POSTER"]) {
            setPosterUrl(match["#IMG_POSTER"]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch poster for:", title, err);
      } finally {
        if (active) setPosterLoading(false);
      }
    };

    fetchPoster();
    return () => {
      active = false;
    };
  }, [title]);

  return (
    <div 
      className={`movie-card ${isExpanded ? "expanded" : ""}`}
      onClick={() => setIsExpanded(!isExpanded)}
      style={{ cursor: "pointer" }}
      title={isExpanded ? "Click to collapse" : "Click to view full description"}
    >
      <div className="movie-poster-wrapper">
        {posterLoading ? (
          <div className="poster-placeholder loading">
            <span className="spinner-mini"></span>
          </div>
        ) : posterUrl ? (
          <img src={posterUrl} alt={title} className="movie-poster" loading="lazy" />
        ) : (
          <div className="poster-placeholder">🎬</div>
        )}
      </div>

      <div className="movie-card-content">
        <div className="movie-card-header">
          <h3 className="movie-title">{title}</h3>
        </div>
        
        {genreList.length > 0 && (
          <div className="genre-tags">
            {genreList.map((genre, idx) => (
              <span key={idx} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
        )}

        <p className="movie-overview">{overview || "No overview available for this movie."}</p>

        <div className="movie-meta">
          <span className="meta-badge rating-badge">
            <span className="star-icon">⭐</span> {vote_average ? vote_average.toFixed(1) : "0.0"}
          </span>
          <span className="meta-badge popularity-badge">
            <span className="fire-icon">🔥</span> {popularity ? popularity.toFixed(1) : "0.0"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
