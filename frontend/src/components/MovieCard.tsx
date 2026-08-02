import { useState } from "react";

interface MovieCardProps {
  title: string;
  genres: string;
  overview: string;
  vote_average: number;
  popularity: number;
}

// Genre-based gradient and icon mapping
const GENRE_STYLES: Record<string, { gradient: string; icon: string }> = {
  action:      { gradient: "linear-gradient(135deg, #dc2626, #f97316)", icon: "💥" },
  adventure:   { gradient: "linear-gradient(135deg, #059669, #34d399)", icon: "🧭" },
  animation:   { gradient: "linear-gradient(135deg, #7c3aed, #c084fc)", icon: "✨" },
  comedy:      { gradient: "linear-gradient(135deg, #eab308, #facc15)", icon: "😂" },
  crime:       { gradient: "linear-gradient(135deg, #334155, #64748b)", icon: "🔫" },
  documentary: { gradient: "linear-gradient(135deg, #0284c7, #38bdf8)", icon: "📹" },
  drama:       { gradient: "linear-gradient(135deg, #6366f1, #818cf8)", icon: "🎭" },
  family:      { gradient: "linear-gradient(135deg, #ec4899, #f9a8d4)", icon: "👨‍👩‍👧‍👦" },
  fantasy:     { gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)", icon: "🔮" },
  history:     { gradient: "linear-gradient(135deg, #92400e, #d97706)", icon: "📜" },
  horror:      { gradient: "linear-gradient(135deg, #1c1917, #991b1b)", icon: "👻" },
  music:       { gradient: "linear-gradient(135deg, #db2777, #f472b6)", icon: "🎵" },
  mystery:     { gradient: "linear-gradient(135deg, #1e293b, #475569)", icon: "🔍" },
  romance:     { gradient: "linear-gradient(135deg, #e11d48, #fb7185)", icon: "❤️" },
  "science fiction": { gradient: "linear-gradient(135deg, #0f172a, #6366f1)", icon: "🚀" },
  "sci-fi":    { gradient: "linear-gradient(135deg, #0f172a, #6366f1)", icon: "🚀" },
  thriller:    { gradient: "linear-gradient(135deg, #0f172a, #dc2626)", icon: "⚡" },
  war:         { gradient: "linear-gradient(135deg, #422006, #78716c)", icon: "⚔️" },
  western:     { gradient: "linear-gradient(135deg, #a16207, #ca8a04)", icon: "🤠" },
};

const DEFAULT_STYLE = { gradient: "linear-gradient(135deg, #1e293b, #334155)", icon: "🎬" };

function getGenreStyle(genres: string) {
  if (!genres) return DEFAULT_STYLE;
  const genreList = genres.toLowerCase().split(",").map((g) => g.trim());
  for (const genre of genreList) {
    if (GENRE_STYLES[genre]) return GENRE_STYLES[genre];
  }
  return DEFAULT_STYLE;
}

function MovieCard({
  title,
  genres,
  overview,
  vote_average,
  popularity,
}: MovieCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Convert comma separated genres to list of tags
  const genreList = genres ? genres.split(",").map((g) => g.trim()) : [];
  const style = getGenreStyle(genres);

  return (
    <div 
      className={`movie-card ${isExpanded ? "expanded" : ""}`}
      onClick={() => setIsExpanded(!isExpanded)}
      style={{ cursor: "pointer" }}
      title={isExpanded ? "Click to collapse" : "Click to view full description"}
    >
      <div
        className="movie-poster-wrapper genre-poster"
        style={{ background: style.gradient }}
      >
        <span className="genre-poster-icon">{style.icon}</span>
        <span className="genre-poster-title">{title}</span>
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
