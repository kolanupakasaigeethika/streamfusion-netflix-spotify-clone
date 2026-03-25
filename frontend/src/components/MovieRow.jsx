import { useRef } from "react";

import MovieCard from "./MovieCard";

function MovieRow({
  id,
  title,
  movies,
  favoritesMap,
  onToggleFavorite,
  emptyMessage = "No titles available right now.",
}) {
  const scrollRef = useRef(null);

  const scrollRow = (direction) => {
    if (!scrollRef.current) {
      return;
    }

    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollBy({
      left: direction * Math.max(clientWidth * 0.82, 320),
      behavior: "smooth",
    });
  };

  return (
    <section id={id} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-netflix-mist">Curated for long-session browsing and quick preview selection.</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-netflix-mist">{movies.length} titles</span>
      </div>

      {movies.length ? (
        <div className="group relative">
          <button
            type="button"
            onClick={() => scrollRow(-1)}
            className="absolute left-0 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/65 text-3xl text-white/85 shadow-xl backdrop-blur transition hover:border-white/20 hover:bg-black/80 lg:flex"
            aria-label={`Scroll ${title} left`}
          >
            &#8249;
          </button>

          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pr-6 scroll-smooth"
          >
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={Boolean(favoritesMap[movie.id])}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollRow(1)}
            className="absolute right-0 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/65 text-3xl text-white/85 shadow-xl backdrop-blur transition hover:border-white/20 hover:bg-black/80 lg:flex"
            aria-label={`Scroll ${title} right`}
          >
            &#8250;
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-5 py-6 text-sm text-netflix-mist">{emptyMessage}</div>
      )}
    </section>
  );
}

export default MovieRow;
