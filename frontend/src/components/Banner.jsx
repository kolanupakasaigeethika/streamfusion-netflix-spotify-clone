import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function Banner({ movies = [], stats }) {
  const featuredMovies = useMemo(() => movies.filter(Boolean), [movies]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [featuredMovies.length]);

  useEffect(() => {
    if (featuredMovies.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCurrentIndex((current) => (current + 1) % featuredMovies.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [featuredMovies.length]);

  if (!featuredMovies.length) {
    return null;
  }

  const currentMovie = featuredMovies[currentIndex];
  const goToSlide = (index) => setCurrentIndex(index);
  const showPrevious = () => setCurrentIndex((current) => (current - 1 + featuredMovies.length) % featuredMovies.length);
  const showNext = () => setCurrentIndex((current) => (current + 1) % featuredMovies.length);

  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0">
        {featuredMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              index === currentIndex ? "scale-100 opacity-100" : "scale-[1.035] opacity-0"
            }`}
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(5,5,7,0.94) 0%, rgba(5,5,7,0.7) 38%, rgba(5,5,7,0.28) 100%), url(${movie.thumbnail_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(229,9,20,0.22),transparent_22%),linear-gradient(180deg,rgba(5,5,7,0.18),rgba(5,5,7,0.94))]" />

      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 sm:px-6">
        <button
          type="button"
          onClick={showPrevious}
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/35 text-2xl text-white/85 backdrop-blur transition hover:border-white/20 hover:bg-black/55"
          aria-label="Previous featured title"
        >
          ‹
        </button>
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 sm:px-6">
        <button
          type="button"
          onClick={showNext}
          className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/35 text-2xl text-white/85 backdrop-blur transition hover:border-white/20 hover:bg-black/55"
          aria-label="Next featured title"
        >
          ›
        </button>
      </div>

      <div className="relative mx-auto grid min-h-[76vh] max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="flex items-end">
          <div className="max-w-2xl space-y-5 transition-all duration-700">
            <span className="inline-flex rounded-full border border-netflix-red/40 bg-netflix-red/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-netflix-red">
              Featured Top Rated
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">{currentMovie.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-netflix-mist">
              <span className="rounded-full bg-white/10 px-3 py-1 text-white">{currentMovie.rating.toFixed(1)} Rating</span>
              <span>{currentMovie.year}</span>
              <span>{currentMovie.duration}</span>
              <span>{currentMovie.maturity_rating}</span>
            </div>
            <p className="max-w-xl text-sm leading-7 text-netflix-mist sm:text-base">{currentMovie.description}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/movie/${currentMovie.id}`}
                state={{ playWithIntro: true }}
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
              >
                Play Now
              </Link>
              <a
                href="#my-list"
                className="rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                View My List
              </a>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {(currentMovie.tags || []).slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-netflix-mist">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-end lg:justify-end">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-netflix-red">Tonight's Spotlight</p>
                <h2 className="mt-3 font-display text-2xl font-bold text-white">Premium streaming dashboard</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white">HD</div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-netflix-mist">Titles</p>
                <p className="mt-2 text-2xl font-bold text-white">{stats?.totalTitles || 0}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-netflix-mist">Genres</p>
                <p className="mt-2 text-2xl font-bold text-white">{stats?.genres || 0}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-netflix-mist">My List</p>
                <p className="mt-2 text-2xl font-bold text-white">{stats?.myList || 0}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-netflix-red/20 bg-netflix-red/10 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-netflix-red">Why it feels premium</p>
              <p className="mt-3 text-sm leading-6 text-netflix-mist">
                Curated rows, persistent favorites, progress tracking, fast search, and a catalog that mixes films, originals, and series.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center gap-2">
          {featuredMovies.map((movie, index) => (
            <button
              key={movie.id}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to featured title ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex ? "h-3 w-8 bg-white shadow-[0_0_12px_rgba(255,255,255,0.35)]" : "h-2.5 w-2.5 bg-white/35 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Banner;
