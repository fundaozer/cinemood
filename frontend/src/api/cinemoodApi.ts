import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

// Interface for Movie schema
export interface Movie {
  title: string;
  genres: string;
  overview: string;
  vote_average: number;
  popularity: number;
}

// Interface for Sentiment response
export interface SentimentResponse {
  text: string;
  sentiment: string;
  confidence: number;
}

// Interface for Recommendation response
export interface RecommendationResponse {
  found: boolean;
  message: string;
  recommendations: Movie[];
}

// Interface for Dashboard statistics
export interface DashboardStats {
  total_movies: number;
  average_rating: number;
  average_popularity: number;
  top_rated_movies: Movie[];
}

// Predict review sentiment
export const predictSentiment = async (text: string): Promise<SentimentResponse> => {
  const response = await axios.post(`${API_URL}/sentiment/predict`, { text });
  return response.data;
};

// Get recommendations by similar movie title
export const recommendByMovie = async (title: string, topN: number = 10): Promise<RecommendationResponse> => {
  const response = await axios.post(`${API_URL}/recommend/movie`, { title, top_n: topN });
  return response.data;
};

// Get recommendations filtered by user mood
export const recommendByMood = async (
  mood: string,
  minRating: number = 6.5,
  topN: number = 10
): Promise<RecommendationResponse> => {
  const response = await axios.post(`${API_URL}/recommend/mood`, {
    mood,
    min_rating: minRating,
    top_n: topN,
  });
  return response.data;
};

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axios.get(`${API_URL}/dashboard/stats`);
  return response.data;
};
