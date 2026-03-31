import { Link } from "wouter";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-6xl font-extrabold" style={{ color: "#8A3BDB" }}>404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-2 text-sm text-gray-500">
          Sorry, we couldn't find the page you were looking for.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ backgroundColor: "#8A3BDB" }}
        >
          Back to home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
