import joblib
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer


# Load preprocessed movie dataset
movies = pd.read_csv("data/movies.csv")

# Clean duplicate title rows and fill missing basic fields
movies = movies.drop_duplicates(subset=["title"])
movies["title"] = movies["title"].fillna("")
movies["genres"] = movies["genres"].fillna("")
movies["overview"] = movies["overview"].fillna("")

# Safely handle missing keywords column or rows
if "keywords" not in movies.columns:
    movies["keywords"] = ""
else:
    movies["keywords"] = movies["keywords"].fillna("")

# Safely handle missing cast column or rows
if "cast" not in movies.columns:
    movies["cast"] = ""
else:
    movies["cast"] = movies["cast"].fillna("")

# Safely handle missing director column or rows
if "director" not in movies.columns:
    movies["director"] = ""
else:
    movies["director"] = movies["director"].fillna("")

# Safely handle numeric rating and popularity defaults
if "vote_average" not in movies.columns:
    movies["vote_average"] = 0

if "popularity" not in movies.columns:
    movies["popularity"] = 0

# Concatenate all metadata fields to build the corpus for content-based matching
movies["content"] = (
    movies["title"].astype(str) + " " +
    movies["genres"].astype(str) + " " +
    movies["overview"].astype(str) + " " +
    movies["keywords"].astype(str) + " " +
    movies["cast"].astype(str) + " " +
    movies["director"].astype(str)
)

# Convert movie text descriptions into TF-IDF vector matrix
vectorizer = TfidfVectorizer(
    stop_words="english",
    max_features=5000
)

tfidf_matrix = vectorizer.fit_transform(movies["content"])

# Save movies dataframe, vectorizer, and similarity matrix artifacts
joblib.dump(movies, "app/models/movies.pkl")
joblib.dump(vectorizer, "app/models/movie_vectorizer.pkl")
joblib.dump(tfidf_matrix, "app/models/tfidf_matrix.pkl")

print("Recommendation files saved successfully.")