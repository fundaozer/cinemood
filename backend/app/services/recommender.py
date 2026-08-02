import joblib
import pandas as pd

from sklearn.metrics.pairwise import cosine_similarity


movies = joblib.load("app/models/movies.pkl")
tfidf_matrix = joblib.load("app/models/tfidf_matrix.pkl")

cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

indices = pd.Series(
    movies.index,
    index=movies["title"].str.lower()
)
indices = indices[~indices.index.duplicated(keep='first')]


mood_genre_map = {
    "happy": ["Comedy", "Animation", "Family"],
    "sad": ["Drama", "Romance"],
    "excited": ["Action", "Adventure", "Thriller"],
    "relaxed": ["Romance", "Family", "Comedy"],
    "curious": ["Documentary", "Sci-Fi", "Mystery"],
    "scared": ["Horror", "Mystery", "Thriller"]
}


def format_movies(df):
    result = []

    for _, row in df.iterrows():
        overview = str(row.get("overview", ""))
        if len(overview) > 1000:
            truncated = overview[:1000]
            last_space = truncated.rfind(" ")
            if last_space != -1:
                overview = truncated[:last_space] + "..."
            else:
                overview = truncated + "..."

        result.append({
            "title": str(row.get("title", "")),
            "genres": str(row.get("genres", "")),
            "overview": overview,
            "vote_average": float(row.get("vote_average", 0)),
            "popularity": float(row.get("popularity", 0))
        })

    return result


def recommend_by_movie(title: str, top_n: int = 10):
    title = title.lower()

    if title not in indices:
        return {
            "found": False,
            "message": "Movie not found.",
            "recommendations": []
        }

    idx = indices[title]

    similarity_scores = list(enumerate(cosine_sim[idx]))
    similarity_scores = sorted(
        similarity_scores,
        key=lambda x: x[1],
        reverse=True
    )

    similarity_scores = similarity_scores[1:top_n + 1]
    movie_indices = [i[0] for i in similarity_scores]

    recommended_movies = movies.iloc[movie_indices]

    return {
        "found": True,
        "message": "Recommendations generated successfully.",
        "recommendations": format_movies(recommended_movies)
    }


def recommend_by_mood(mood: str, min_rating: float = 6.5, top_n: int = 10):
    mood = mood.lower()

    if mood not in mood_genre_map:
        return {
            "found": False,
            "message": "Mood not supported.",
            "recommendations": []
        }

    genres = mood_genre_map[mood]
    pattern = "|".join(genres)

    filtered = movies[
        movies["genres"].str.contains(pattern, case=False, na=False)
    ].copy()

    filtered = filtered[filtered["vote_average"] >= min_rating]

    filtered = filtered.sort_values(
        by=["vote_average", "popularity"],
        ascending=False
    )

    return {
        "found": True,
        "message": "Mood recommendations generated successfully.",
        "recommendations": format_movies(filtered.head(top_n))
    }


def get_dashboard_stats():
    total_movies = len(movies)

    avg_rating = float(movies["vote_average"].mean())
    avg_popularity = float(movies["popularity"].mean())

    # Filter for well-known movies (popularity > 10) to ensure poster availability
    popular_movies = movies[movies["popularity"] >= 10]

    top_movies = popular_movies.sort_values(
        by=["vote_average", "popularity"],
        ascending=[False, False]
    ).head(10)

    return {
        "total_movies": total_movies,
        "average_rating": round(avg_rating, 2),
        "average_popularity": round(avg_popularity, 2),
        "top_rated_movies": format_movies(top_movies)
    }