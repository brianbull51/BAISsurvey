import { useState, useId, FormEvent } from "react";
import { Link } from "wouter";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import {
  SurveyFormValues,
  FREQUENCY_OPTIONS,
  GENRE_OPTIONS,
  PREFERENCE_OPTIONS,
} from "@/lib/types";

interface FormErrors {
  favorite_movie?: string;
  watch_frequency?: string;
  favorite_genre?: string;
  preferences?: string;
}

function validate(values: SurveyFormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.favorite_movie.trim()) {
    errors.favorite_movie = "Please enter your favorite movie.";
  }
  if (!values.watch_frequency) {
    errors.watch_frequency = "Please select how often you watch movies.";
  }
  if (!values.favorite_genre) {
    errors.favorite_genre = "Please select your favorite genre.";
  }
  if (values.preferences.length === 0) {
    errors.preferences = "Please select at least one preference.";
  }
  return errors;
}

function ThankYou({
  values,
  onRetake,
}: {
  values: SurveyFormValues;
  onRetake: () => void;
}) {
  return (
    <div
      className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div className="mb-4 flex justify-center">
        <span
          className="inline-flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "#f3edfb" }}
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="#8A3BDB"
            className="h-7 w-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </span>
      </div>
      <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
        Thank you!
      </h2>
      <p className="mb-6 text-center text-gray-600">
        Your response has been recorded. Here's a summary of your answers:
      </p>

      <dl className="mb-6 space-y-4 rounded-xl bg-gray-50 p-5 text-sm">
        <div>
          <dt className="font-semibold text-gray-700">Favorite movie</dt>
          <dd className="mt-0.5 text-gray-900">{values.favorite_movie}</dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-700">Watch frequency</dt>
          <dd className="mt-0.5 text-gray-900">{values.watch_frequency}</dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-700">Favorite genre</dt>
          <dd className="mt-0.5 text-gray-900">{values.favorite_genre}</dd>
        </div>
        <div>
          <dt className="font-semibold text-gray-700">What you care about most</dt>
          <dd className="mt-0.5 text-gray-900">{values.preferences.join(", ")}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/results"
          className="inline-flex items-center justify-center rounded-lg px-7 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ backgroundColor: "#8A3BDB" }}
        >
          View Results
        </Link>
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex items-center justify-center rounded-lg border-2 px-7 py-2.5 text-sm font-semibold transition-colors hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ color: "#8A3BDB", borderColor: "#8A3BDB" }}
        >
          Take Again
        </button>
      </div>
    </div>
  );
}

const EMPTY_FORM: SurveyFormValues = {
  favorite_movie: "",
  watch_frequency: "",
  favorite_genre: "",
  preferences: [],
};

export default function Survey() {
  const [values, setValues] = useState<SurveyFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedValues, setSubmittedValues] = useState<SurveyFormValues | null>(null);

  const movieId = useId();
  const frequencyId = useId();
  const genreId = useId();
  const preferencesId = useId();

  const handlePreferenceChange = (option: string, checked: boolean) => {
    setValues((prev) => ({
      ...prev,
      preferences: checked
        ? [...prev.preferences, option]
        : prev.preferences.filter((p) => p !== option),
    }));
    if (errors.preferences) {
      setErrors((prev) => ({ ...prev, preferences: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorField = document.querySelector("[aria-invalid='true']") as HTMLElement;
      firstErrorField?.focus();
      return;
    }

    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("survey_responses").insert([
        {
          favorite_movie: values.favorite_movie.trim(),
          watch_frequency: values.watch_frequency,
          favorite_genre: values.favorite_genre,
          preferences: values.preferences,
        },
      ]);

      if (error) throw new Error(error.message);

      setSubmittedValues(values);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setValues(EMPTY_FORM);
    setErrors({});
    setSubmitError(null);
    setSubmitted(false);
    setSubmittedValues(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold text-gray-900">
            Movie Preferences Survey
          </h1>
          <Link
            href="/results"
            className="rounded text-sm font-medium underline underline-offset-2 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ color: "#8A3BDB" }}
          >
            View Results
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-10">
        {submitted && submittedValues ? (
          <ThankYou values={submittedValues} onRetake={handleRetake} />
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto max-w-2xl space-y-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10"
            aria-label="Movie preferences survey"
          >
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Tell us about your movie preferences
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                All questions are required.
              </p>
            </div>

            {submitError && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                <strong>Submission failed:</strong> {submitError}
              </div>
            )}

            {/* Q1: Favorite Movie */}
            <div>
              <label
                htmlFor={movieId}
                className="block text-sm font-semibold text-gray-900"
              >
                1. What is your favorite movie?
              </label>
              <input
                id={movieId}
                type="text"
                name="favorite_movie"
                placeholder="e.g. Inception"
                autoFocus
                required
                aria-required="true"
                aria-describedby={errors.favorite_movie ? `${movieId}-error` : undefined}
                aria-invalid={errors.favorite_movie ? true : undefined}
                value={values.favorite_movie}
                onChange={(e) => {
                  setValues((prev) => ({ ...prev, favorite_movie: e.target.value }));
                  if (errors.favorite_movie) setErrors((prev) => ({ ...prev, favorite_movie: undefined }));
                }}
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.favorite_movie && (
                <p
                  id={`${movieId}-error`}
                  role="alert"
                  className="mt-1.5 flex items-center gap-1 text-sm text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-shrink-0" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  {errors.favorite_movie}
                </p>
              )}
            </div>

            {/* Q2: Watch Frequency */}
            <fieldset>
              <legend className="block text-sm font-semibold text-gray-900">
                2. How often do you watch movies?
              </legend>
              <div
                className="mt-3 space-y-2"
                aria-describedby={errors.watch_frequency ? `${frequencyId}-error` : undefined}
              >
                {FREQUENCY_OPTIONS.map((option) => {
                  const radioId = `${frequencyId}-${option.replace(/\s+/g, "-")}`;
                  return (
                    <label
                      key={option}
                      htmlFor={radioId}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-800 transition-colors hover:bg-gray-50 has-[:checked]:border-purple-400 has-[:checked]:bg-purple-50"
                    >
                      <input
                        type="radio"
                        id={radioId}
                        name="watch_frequency"
                        value={option}
                        required
                        aria-required="true"
                        checked={values.watch_frequency === option}
                        onChange={() => {
                          setValues((prev) => ({ ...prev, watch_frequency: option }));
                          if (errors.watch_frequency) setErrors((prev) => ({ ...prev, watch_frequency: undefined }));
                        }}
                        className="h-4 w-4 focus:outline-none"
                        style={{ accentColor: "#8A3BDB" }}
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
              {errors.watch_frequency && (
                <p
                  id={`${frequencyId}-error`}
                  role="alert"
                  className="mt-1.5 flex items-center gap-1 text-sm text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-shrink-0" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  {errors.watch_frequency}
                </p>
              )}
            </fieldset>

            {/* Q3: Favorite Genre */}
            <div>
              <label
                htmlFor={genreId}
                className="block text-sm font-semibold text-gray-900"
              >
                3. What is your favorite movie genre?
              </label>
              <select
                id={genreId}
                name="favorite_genre"
                required
                aria-required="true"
                aria-describedby={errors.favorite_genre ? `${genreId}-error` : undefined}
                aria-invalid={errors.favorite_genre ? true : undefined}
                value={values.favorite_genre}
                onChange={(e) => {
                  setValues((prev) => ({ ...prev, favorite_genre: e.target.value }));
                  if (errors.favorite_genre) setErrors((prev) => ({ ...prev, favorite_genre: undefined }));
                }}
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="" disabled>
                  Select a genre…
                </option>
                {GENRE_OPTIONS.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              {errors.favorite_genre && (
                <p
                  id={`${genreId}-error`}
                  role="alert"
                  className="mt-1.5 flex items-center gap-1 text-sm text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-shrink-0" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  {errors.favorite_genre}
                </p>
              )}
            </div>

            {/* Q4: Preferences */}
            <fieldset>
              <legend className="block text-sm font-semibold text-gray-900">
                4. What do you care about most in a movie?{" "}
                <span className="font-normal text-gray-500">(select all that apply)</span>
              </legend>
              <div
                className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2"
                aria-describedby={errors.preferences ? `${preferencesId}-error` : undefined}
              >
                {PREFERENCE_OPTIONS.map((option) => {
                  const checkId = `${preferencesId}-${option.replace(/\s+/g, "-")}`;
                  const isChecked = values.preferences.includes(option);
                  return (
                    <label
                      key={option}
                      htmlFor={checkId}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-800 transition-colors hover:bg-gray-50 has-[:checked]:border-purple-400 has-[:checked]:bg-purple-50"
                    >
                      <input
                        type="checkbox"
                        id={checkId}
                        name="preferences"
                        value={option}
                        checked={isChecked}
                        onChange={(e) => handlePreferenceChange(option, e.target.checked)}
                        className="h-4 w-4 rounded focus:outline-none"
                        style={{ accentColor: "#8A3BDB" }}
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
              {errors.preferences && (
                <p
                  id={`${preferencesId}-error`}
                  role="alert"
                  className="mt-1.5 flex items-center gap-1 text-sm text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 flex-shrink-0" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  {errors.preferences}
                </p>
              )}
            </fieldset>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                style={{ backgroundColor: "#8A3BDB" }}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
