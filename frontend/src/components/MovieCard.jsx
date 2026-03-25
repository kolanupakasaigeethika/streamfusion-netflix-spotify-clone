import { Link } from "react-router-dom";

const movieLinkState = { playWithIntro: true };

function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  return (
    <article className="group relative h-[24.5rem] w-[240px] min-w-[240px] snap-start overflow-hidden rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] transition duration-300 hover:-translate-y-2 hover:border-netflix-red/40 hover:shadow-glow">
      <Link to={`/movie/${movie.id}`} state={movieLinkState} className="block">
        <div className="relative">
          <img src={movie.thumbnail_image} alt={movie.title} className="h-36 w-full object-cover transition duration-300 group-hover:scale-105" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
            {movie.maturity_rating}
          </div>
        </div>
      </Link>

      <div className="flex h-[calc(24.5rem-9rem)] flex-col space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/movie/${movie.id}`} state={movieLinkState} className="line-clamp-1 text-lg font-bold text-white">
              {movie.title}
            </Link>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-netflix-mist">{movie.category}</p>
          </div>
          <span className="rounded-full bg-netflix-red/15 px-2 py-1 text-xs font-semibold text-netflix-red">{movie.rating.toFixed(1)}</span>
        </div>
        <p className="line-clamp-3 min-h-[3.75rem] text-sm text-netflix-mist">{movie.description}</p>
        <div className="flex items-center justify-between text-xs text-netflix-mist">
          <div className="flex gap-2 text-xs text-netflix-mist">
            <span>{movie.year}</span>
            <span className="truncate">{movie.duration}</span>
          </div>
          <button
            onClick={() => onToggleFavorite(movie)}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-label={isFavorite ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              isFavorite ? "bg-netflix-red text-white" : "border border-white/10 bg-white/5 text-netflix-mist hover:text-white"
            }`}
          >
            {isFavorite ? "Saved" : "+ My List"}
          </button>
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          {(movie.tags || []).slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-netflix-mist">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
