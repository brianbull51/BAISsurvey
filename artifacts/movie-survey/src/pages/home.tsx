import { Link } from "wouter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mx-auto max-w-lg">
          <div className="mb-6 flex justify-center">
            <span
              className="inline-flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: "#f3edfb" }}
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#8A3BDB"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125L3 4.5m0 0a1.125 1.125 0 0 1 1.125-1.125h15.75A1.125 1.125 0 0 1 21 4.5m0 0v13.875M6 18.375V4.5m0 0h12m0 0v13.875m0 0c0 .621.504 1.125 1.125 1.125h1.5m-15-1.125C6 18.996 5.496 19.5 4.875 19.5M21 18.375c0 .621-.504 1.125-1.125 1.125M21 4.5v.375A.375.375 0 0 1 20.625 5.25h-1.5A.375.375 0 0 1 18.75 4.875V4.5m-12 0V4.875A.375.375 0 0 1 6.375 5.25h-1.5A.375.375 0 0 1 4.5 4.875V4.5"
                />
              </svg>
            </span>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Movie Preferences Survey
          </h1>
          <p className="mb-10 text-base text-gray-600 sm:text-lg">
            Share your favorite movies and viewing habits! This short survey
            takes just a minute to complete and helps us understand what people
            love about movies.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/survey"
              className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ backgroundColor: "#8A3BDB" }}
            >
              Take the Survey
            </Link>
            <Link
              href="/results"
              className="inline-flex items-center justify-center rounded-lg border-2 px-8 py-3 text-base font-semibold transition-colors hover:bg-purple-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ color: "#8A3BDB", borderColor: "#8A3BDB" }}
            >
              View Results
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
