import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MoodRecommend from "./pages/MoodRecommend";
import SimilarMovie from "./pages/SimilarMovie";
import Sentiment from "./pages/Sentiment";

import "./style.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mood" element={<MoodRecommend />} />
            <Route path="/similar" element={<SimilarMovie />} />
            <Route path="/sentiment" element={<Sentiment />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
