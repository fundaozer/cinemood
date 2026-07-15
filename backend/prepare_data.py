import ast
import pandas as pd

def parse_json_list(text, key="name", limit=None):
    # Check if text is empty or NaN
    if pd.isna(text) or text == "":
        return ""

    try:
        # Convert string of lists to actual Python list
        items = ast.literal_eval(text)
    except (ValueError, SyntaxError):
        return ""

    names = [item.get(key, "") for item in items if isinstance(item, dict)]
    names = [n for n in names if n]

    if limit is not None:
        names = names[:limit]

    # Return as comma separated values
    return ", ".join(names)


def extract_director(crew_text):
    # Check if crew text is empty or NaN
    if pd.isna(crew_text) or crew_text == "":
        return ""

    try:
        # Convert string of crew to Python list
        crew_list = ast.literal_eval(crew_text)
    except (ValueError, SyntaxError):
        return ""

    # Iterate over crew members to locate the director
    for person in crew_list:
        if isinstance(person, dict) and person.get("job") == "Director":
            return person.get("name", "")

    return ""


def main():
    print("Reading raw datasets...")
    # Load raw movies and credits files
    movies = pd.read_csv("data/movies_raw.csv")
    credits = pd.read_csv("data/credits_raw.csv")

    # Detect name of the ID column in credits table
    credits_id_col = "movie_id" if "movie_id" in credits.columns else "id"

    # Drop title column from credits to avoid duplicate columns during merge
    credits = credits.drop(columns=["title"], errors="ignore")

    print("Merging movies and credits datasets...")
    # Merge movies and credits using left join on ID columns
    merged = movies.merge(
        credits,
        left_on="id",
        right_on=credits_id_col,
        how="left",
        suffixes=("", "_credits"),
    )

    print("Cleaning genres, keywords, cast, and director columns...")
    # Transform JSON columns into readable strings
    merged["genres"] = merged["genres"].apply(lambda x: parse_json_list(x))
    merged["keywords"] = merged["keywords"].apply(lambda x: parse_json_list(x))
    merged["cast"] = merged["cast"].apply(lambda x: parse_json_list(x, limit=5))
    merged["director"] = merged["crew"].apply(extract_director)

    # Fill missing values with defaults
    merged["overview"] = merged["overview"].fillna("")
    merged["vote_average"] = merged["vote_average"].fillna(0)
    merged["popularity"] = merged["popularity"].fillna(0)

    final_columns = [
        "title",
        "genres",
        "overview",
        "vote_average",
        "popularity",
        "keywords",
        "cast",
        "director",
    ]

    final_df = merged[final_columns].copy()

    # Drop movies without titles and filter out duplicate entries
    final_df = final_df.dropna(subset=["title"])
    final_df = final_df.drop_duplicates(subset=["title"])

    output_path = "data/movies.csv"
    final_df.to_csv(output_path, index=False)

    print(f"Completed: {len(final_df)} movies successfully saved to '{output_path}'.")


if __name__ == "__main__":
    main()