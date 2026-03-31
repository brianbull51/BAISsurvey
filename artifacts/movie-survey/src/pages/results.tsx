import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { SurveyResponse, FREQUENCY_OPTIONS, GENRE_OPTIONS, PREFERENCE_OPTIONS } from "@/lib/types";

const ACCENT = "#8A3BDB";
const ACCENT_LIGHT = "#c49ef0";

interface ChartItem {
  name: string;
  count: number;
}

function aggregateFrequency(responses: SurveyResponse[]): ChartItem[] {
  const counts: Record<string, number> = {};
  for (const option of FREQUENCY_OPTIONS) counts[option] = 0;
  for (const r of responses) {
    if (r.watch_frequency in counts) counts[r.watch_frequency]++;
  }
  return FREQUENCY_OPTIONS.map((name) => ({ name, count: counts[name] }));
}

function aggregateGenres(responses: SurveyResponse[]): ChartItem[] {
  const counts: Record<string, number> = {};
  for (const option of GENRE_OPTIONS) counts[option] = 0;
  for (const r of responses) {
    if (r.favorite_genre in counts) counts[r.favorite_genre]++;
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .filter((item) => item.count > 0);
}

function aggregatePreferences(responses: SurveyResponse[]): ChartItem[] {
  const counts: Record<string, number> = {};
  for (const option of PREFERENCE_OPTIONS) counts[option] = 0;
  for (const r of responses) {
    for (const pref of r.preferences) {
      if (pref in counts) counts[pref]++;
    }
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .filter((item) => item.count > 0);
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-md">
        <p className="font-medium text-gray-900">{label}</p>
        <p style={{ color: ACCENT }}>
          {payload[0].value} response{payload[0].value !== 1 ? "s" : ""}
        </p>
      </div>
    );
  }
  return null;
};

export default function Results() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error: fetchError } = await supabase
          .from("survey_responses")
          .select("*");

        if (fetchError) throw new Error(fetchError.message);
        setResponses((data as SurveyResponse[]) ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load results.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const frequencyData = aggregateFrequency(responses);
  const genreData = aggregateGenres(responses);
  const preferenceData = aggregatePreferences(responses);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold text-gray-900">Survey Results</h1>
          <Link
            href="/"
            className="rounded text-sm font-medium underline underline-offset-2 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ color: ACCENT }}
          >
            Home
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-10">
        <div className="mx-auto max-w-3xl space-y-10">
          {loading && (
            <div
              className="flex items-center justify-center py-20"
              aria-busy="true"
              aria-label="Loading results"
            >
              <div
                className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200"
                style={{ borderTopColor: ACCENT }}
              />
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <strong>Error loading results:</strong> {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Total responses */}
              <section aria-labelledby="total-heading">
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                  <p
                    id="total-heading"
                    className="text-sm font-semibold uppercase tracking-widest"
                    style={{ color: ACCENT }}
                  >
                    Total Responses
                  </p>
                  <p
                    className="mt-2 text-7xl font-extrabold leading-none"
                    style={{ color: ACCENT }}
                  >
                    {responses.length}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {responses.length === 1
                      ? "person has taken the survey"
                      : "people have taken the survey"}
                  </p>
                </div>
              </section>

              {responses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-14 text-center">
                  <p className="text-base font-medium text-gray-600">No responses yet.</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Be the first to{" "}
                    <Link href="/survey" style={{ color: ACCENT }} className="underline">
                      take the survey
                    </Link>
                    !
                  </p>
                </div>
              ) : (
                <>
                  {/* Chart 1: Watch Frequency — vertical bar chart */}
                  <section aria-labelledby="frequency-heading">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h2 id="frequency-heading" className="mb-6 text-base font-semibold text-gray-900">
                        Movie Watching Frequency
                      </h2>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={frequencyData}
                          margin={{ top: 5, right: 20, left: 0, bottom: 70 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: "#374151" }}
                            angle={-35}
                            textAnchor="end"
                            interval={0}
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 12, fill: "#374151" }}
                            label={{
                              value: "Responses",
                              angle: -90,
                              position: "insideLeft",
                              offset: 10,
                              style: { fontSize: 12, fill: "#6B7280" },
                            }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {frequencyData.map((_, index) => (
                              <Cell key={index} fill={index % 2 === 0 ? ACCENT : ACCENT_LIGHT} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </section>

                  {/* Chart 2: Movie Preferences — horizontal bar chart, sorted desc */}
                  {preferenceData.length > 0 && (
                    <section aria-labelledby="preferences-heading">
                      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 id="preferences-heading" className="mb-6 text-base font-semibold text-gray-900">
                          Most Popular Movie Preferences
                        </h2>
                        <ResponsiveContainer width="100%" height={Math.max(280, preferenceData.length * 40)}>
                          <BarChart
                            data={preferenceData}
                            layout="vertical"
                            margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                            <XAxis
                              type="number"
                              allowDecimals={false}
                              tick={{ fontSize: 12, fill: "#374151" }}
                            />
                            <YAxis
                              type="category"
                              dataKey="name"
                              width={110}
                              tick={{ fontSize: 12, fill: "#374151" }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" fill={ACCENT} radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </section>
                  )}

                  {/* Chart 3: Favorite Genres — horizontal bar chart */}
                  {genreData.length > 0 && (
                    <section aria-labelledby="genres-heading">
                      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 id="genres-heading" className="mb-6 text-base font-semibold text-gray-900">
                          Favorite Genres
                        </h2>
                        <ResponsiveContainer width="100%" height={Math.max(280, genreData.length * 40)}>
                          <BarChart
                            data={genreData}
                            layout="vertical"
                            margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                            <XAxis
                              type="number"
                              allowDecimals={false}
                              tick={{ fontSize: 12, fill: "#374151" }}
                            />
                            <YAxis
                              type="category"
                              dataKey="name"
                              width={110}
                              tick={{ fontSize: 12, fill: "#374151" }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" fill={ACCENT} radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </section>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
