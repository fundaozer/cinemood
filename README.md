# CineMood

CineMood is a full-stack, machine learning and NLP-powered movie recommendation and sentiment analysis platform. It provides personalized movie suggestions based on user feelings (moods), finds similar titles, and classifies audience reviews.

---

## Project Structure

```text
cinemood/
│
├── backend/                  # FastAPI Backend & ML Models
│   ├── app/
│   │   ├── main.py           # FastAPI entry point & routes
│   │   ├── schemas.py        # Pydantic request models
│   │   ├── services/
│   │   │   ├── recommender.py # Content & mood recommendation logic
│   │   │   └── sentiment.py  # Review sentiment evaluation
│   │   └── models/           # Trained pickle models & vectorizers (included in repo)
│   │
│   ├── data/
│   │   └── movies.csv        # Processed movie dataset (included in repo)
│   ├── prepare_data.py       # Data cleaning & ETL script (optional, for retraining)
│   ├── train_sentiment.py    # Sentiment classifier training (optional, for retraining)
│   ├── train_recommender.py  # Recommendation system training (optional, for retraining)
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── cinemoodApi.ts # Axios client wrapper
│   │   ├── components/       # Reusable React components (Navbar, MovieCard)
│   │   ├── pages/            # Page views (Home, Mood, Similar, Sentiment)
│   │   ├── App.tsx           # Routes & core layout
│   │   ├── style.css         # Premium glassmorphic styles
│   │   └── main.tsx          # React entry point
│   └── package.json          # Node dependencies
│
└── .gitignore                # Git exclusions (raw datasets, virtualenv)
```

---

## Dataset

The raw datasets used in this project were originally sourced from [Kaggle (TMDB 5000 Movie Dataset)](https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata). The raw data files are **not** included in this repository due to their size.

The **processed dataset** (`backend/data/movies.csv`) and **trained ML models** (`backend/app/models/*.pkl`) are included in the repo, so you can run the application directly without any extra setup.

---

## Features

- **Mood-Based Recommendation**: Suggests movies matching selected emotions (Happy, Sad, Excited, etc.) with custom rating thresholds.
- **Similar Movie Finder**: Computes cosine similarities based on movie plots, genres, cast, and directors to recommend similar titles.
- **Sentiment Analysis**: Evaluates movie reviews in real time using a Logistic Regression model with n-gram TF-IDF representations.
- **Dynamic Stats Dashboard**: Showcases overall database statistics (total movies, average rating, popularity) and high-rated content.

---

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Axios, React Router, Vanilla CSS (Glassmorphism)
- **Backend**: FastAPI, Uvicorn, Python
- **Machine Learning & NLP**: Scikit-learn, Pandas, NumPy, TF-IDF Vectorization, Cosine Similarity, Logistic Regression

---

## Installation & Running

### 1. Backend Setup
Open a terminal in the `backend/` directory:

```bash
# Navigate to backend and activate virtualenv
cd backend
python -m venv venv

# Activate on Windows:
venv\Scripts\activate
# Activate on Mac/Linux:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Start FastAPI dev server
uvicorn app.main:app --reload
```
The interactive Swagger API documentation will be available at: `http://127.0.0.1:8000/docs`

> **Note**: The processed dataset and trained models are already included in the repository. No data preparation or model training steps are needed to run the application.

### 2. Frontend Setup
Open a second terminal in the `frontend/` directory:

```bash
# Navigate to frontend
cd frontend

# Install package dependencies
npm install

# Run Vite dev server
npm run dev
```
The React web application will be active at: `http://localhost:5173/`

---

## API Endpoints

- `GET  /` - Root verification message.
- `GET  /dashboard/stats` - Pulls movie database statistics.
- `POST /sentiment/predict` - Submits a review block to compute sentiment and confidence levels.
- `POST /recommend/movie` - Submits a movie title to search for highly similar recommendations.
- `POST /recommend/mood` - Submits a mood value (e.g. happy) and min rating to query movie lists.

---
