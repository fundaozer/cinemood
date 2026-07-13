import re
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score


def clean_text(text: str) -> str:
    text = str(text).lower()
    text = re.sub(r"<.*?>", " ", text)
    text = re.sub(r"[^a-zA-Z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


reviews = pd.read_csv("data/reviews.csv")

reviews = reviews.dropna(subset=["review", "sentiment"])
reviews = reviews.drop_duplicates()

reviews["clean_review"] = reviews["review"].apply(clean_text)

X = reviews["clean_review"]
y = reviews["sentiment"]

vectorizer = TfidfVectorizer(
    stop_words="english",
    max_features=10000,
    ngram_range=(1, 2)
)

X_vectorized = vectorizer.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X_vectorized,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

predictions = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, predictions))
print(classification_report(y_test, predictions))

joblib.dump(model, "app/models/sentiment_model.pkl")
joblib.dump(vectorizer, "app/models/sentiment_vectorizer.pkl")

print("Sentiment model saved successfully.")