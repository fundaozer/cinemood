from pydantic import BaseModel


class SentimentRequest(BaseModel):
    text: str


class MovieRecommendationRequest(BaseModel):
    title: str
    top_n: int = 10


class MoodRecommendationRequest(BaseModel):
    mood: str
    min_rating: float = 6.5
    top_n: int = 10