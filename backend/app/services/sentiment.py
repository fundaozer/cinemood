import re
import joblib


model = joblib.load("app/models/sentiment_model.pkl")
vectorizer = joblib.load("app/models/sentiment_vectorizer.pkl")


def clean_text(text: str) -> str:
    text = str(text).lower()
    text = re.sub(r"<.*?>", " ", text)
    text = re.sub(r"[^a-zA-Z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def predict_sentiment(text: str):
    cleaned_text = clean_text(text)
    vectorized_text = vectorizer.transform([cleaned_text])

    prediction = model.predict(vectorized_text)[0]

    probabilities = model.predict_proba(vectorized_text)[0]
    confidence = max(probabilities)

    # Treat low-confidence predictions as neutral
    if confidence < 0.60:
        prediction = "neutral"

    return {
        "text": text,
        "sentiment": prediction,
        "confidence": round(float(confidence), 3)
    }