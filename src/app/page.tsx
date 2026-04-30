import Link from "next/link";

// Root URL is intentionally minimal. Each prospect gets their own URL at /p/[slug].
// Random visitors see this generic page. We can replace with redirect to rebelzai.com later.

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-gray-950 text-white">
      <div className="max-w-xl text-center">
        <div className="text-sm uppercase tracking-widest text-gray-500 mb-4">
          Rebelz AI · Demo Engine
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Diese Seite hat keinen öffentlichen Inhalt.
        </h1>
        <p className="text-gray-400 mb-8">
          Wenn du einen personalisierten Demo-Link erhalten hast, findest du ihn in
          deiner E-Mail oder LinkedIn-Nachricht.
        </p>
        <Link
          href="https://rebelzai.com"
          className="inline-block px-6 py-3 bg-white text-gray-900 rounded-md font-semibold hover:bg-gray-200 transition"
        >
          Mehr über Rebelz AI →
        </Link>
      </div>
    </main>
  );
}
