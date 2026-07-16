import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  // Helper function to check if the path is active
  const isActive = (path: string) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-emoji">🎬</span> <span className="logo-highlight">CineMood</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={isActive("/")}>Home</Link>
          <Link to="/mood" className={isActive("/mood")}>Mood Filter</Link>
          <Link to="/similar" className={isActive("/similar")}>Similar Movies</Link>
          <Link to="/sentiment" className={isActive("/sentiment")}>Sentiment Analysis</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
