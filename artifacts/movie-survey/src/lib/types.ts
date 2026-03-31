export interface SurveyFormValues {
  favorite_movie: string;
  watch_frequency: string;
  favorite_genre: string;
  preferences: string[];
}

export interface SurveyResponse extends SurveyFormValues {
  id: string;
  created_at: string;
}

export const FREQUENCY_OPTIONS = [
  "Every day",
  "A few times a week",
  "Once a week",
  "A few times a month",
  "Rarely",
] as const;

export const GENRE_OPTIONS = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Animation",
  "Thriller",
  "Other",
] as const;

export const PREFERENCE_OPTIONS = [
  "Storyline",
  "Acting",
  "Visual effects",
  "Comedy",
  "Action scenes",
  "Characters",
  "Soundtrack",
  "Ending",
] as const;
