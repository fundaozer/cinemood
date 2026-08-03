import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    SentimentRequest,
    MovieRecommendationRequest,
    MoodRecommendationRequest
)

from app.services.sentiment import predict_sentiment
from app.services.recommender import (
    recommend_by_movie,
    recommend_by_mood,
    get_dashboard_stats
)


app = FastAPI(
    title="CineMood API",
    description="Movie Recommendation and Sentiment Analysis API",
    version="1.0.0"
)

# Allow localhost for dev + Vercel URL for production
allowed_origins = ["http://localhost:5173"]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "CineMood API is running."
    }


@app.post("/sentiment/predict")
def sentiment_predict(request: SentimentRequest):
    return predict_sentiment(request.text)


@app.post("/recommend/movie")
def movie_recommendation(request: MovieRecommendationRequest):
    return recommend_by_movie(request.title, request.top_n)


@app.post("/recommend/mood")
def mood_recommendation(request: MoodRecommendationRequest):
    return recommend_by_mood(
        request.mood,
        request.min_rating,
        request.top_n
    )


@app.get("/dashboard/stats")
def dashboard_stats():
    return get_dashboard_stats()