import ast
import pandas as pd


def parse_json_list(text: str, key: str = "name", limit: int | None = None) -> str:
   
    if pd.isna(text) or text == "":
        return ""

    try:
        items = ast.literal_eval(text)
    except (ValueError, SyntaxError):
        return ""

    names = [item.get(key, "") for item in items if isinstance(item, dict)]
    names = [n for n in names if n]

    if limit is not None:
        names = names[:limit]

    return ", ".join(names)


def extract_director(crew_text: str) -> str:
  
    if pd.isna(crew_text) or crew_text == "":
        return ""

    try:
        crew_list = ast.literal_eval(crew_text)
    except (ValueError, SyntaxError):
        return ""

    for person in crew_list:
        if isinstance(person, dict) and person.get("job") == "Director":
            return person.get("name", "")

    return ""


def main():
    print("Ham veriler okunuyor...")
    movies = pd.read_csv("data/movies_raw.csv")
    credits = pd.read_csv("data/credits_raw.csv")

    # credits.csv'deki film id kolonunun adı bazı sürümlerde "movie_id" bazılarında "id" olabilir.
    credits_id_col = "movie_id" if "movie_id" in credits.columns else "id"

    # credits içindeki title kolonu çakışmasın diye kaldırıyoruz (movies.csv'de zaten var)
    credits = credits.drop(columns=["title"], errors="ignore")

    print("Movies ve credits birleştiriliyor...")
    merged = movies.merge(
        credits,
        left_on="id",
        right_on=credits_id_col,
        how="left",
        suffixes=("", "_credits"),
    )

    print("Genres, keywords, cast, director alanları temizleniyor...")
    merged["genres"] = merged["genres"].apply(lambda x: parse_json_list(x))
    merged["keywords"] = merged["keywords"].apply(lambda x: parse_json_list(x))
    merged["cast"] = merged["cast"].apply(lambda x: parse_json_list(x, limit=5))
    merged["director"] = merged["crew"].apply(extract_director)

    # Eksik overview/vote_average/popularity gibi alanları düzelt
    merged["overview"] = merged["overview"].fillna("")
    merged["vote_average"] = merged["vote_average"].fillna(0)
    merged["popularity"] = merged["popularity"].fillna(0)

    # Proje şablonundaki kolon sırasına göre son hali oluştur
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

    # Başlığı olmayan / tamamen boş satırları at
    final_df = final_df.dropna(subset=["title"])
    final_df = final_df.drop_duplicates(subset=["title"])

    output_path = "data/movies.csv"
    final_df.to_csv(output_path, index=False)

    print(f"Tamamlandı: {len(final_df)} film '{output_path}' dosyasına yazıldı.")


if __name__ == "__main__":
    main()