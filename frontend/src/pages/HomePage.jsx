import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Banner from "../components/Banner";
import Loader from "../components/Loader";
import MovieRow from "../components/MovieRow";
import Navbar from "../components/Navbar";
import api from "../services/api";

function HomePage() {
  const [payload, setPayload] = useState({ rows: {}, featured: null, continue_watching: [] });
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchDashboard = async (searchTerm = "") => {
    setLoading(true);
    setError("");

    try {
      const [moviesResponse, favoritesResponse] = await Promise.all([
        api.get("/movies", { params: searchTerm ? { search: searchTerm, page_size: 24 } : { page_size: 24 } }),
        api.get("/favorites"),
      ]);
      setPayload(moviesResponse.data);
      setFavorites(favoritesResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to load your dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDashboard(search);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const favoritesMap = useMemo(
    () =>
      favorites.reduce((accumulator, favorite) => {
        accumulator[favorite.movie.id] = favorite;
        return accumulator;
      }, {}),
    [favorites]
  );

  const handleToggleFavorite = async (movie) => {
    const existing = favoritesMap[movie.id];
    try {
      if (existing) {
        await api.delete(`/favorites/${movie.id}`);
        setFavorites((current) => current.filter((favorite) => favorite.movie.id !== movie.id));
      } else {
        const { data } = await api.post("/favorites", { movie_id: movie.id });
        setFavorites((current) => [data, ...current]);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Unable to update your list.");
    }
  };

  const myList = favorites.map((favorite) => favorite.movie);
  const searchResults = search.trim() ? payload.results || [] : [];
  const rowEntries = Object.entries(payload.rows || {});
  const allTitles = rowEntries.flatMap(([, movies]) => movies);
  const spotlightTitles = [...allTitles].sort((left, right) => right.rating - left.rating).slice(0, 3);
  const recentlyAdded = [...allTitles].sort((left, right) => right.year - left.year).slice(0, 6);
  const featuredMovies = [...allTitles]
    .sort((left, right) => {
      if (right.rating !== left.rating) {
        return right.rating - left.rating;
      }
      return right.year - left.year;
    })
    .filter((movie, index, array) => array.findIndex((candidate) => candidate.id === movie.id) === index)
    .slice(0, 5);
  const stats = {
    totalTitles: allTitles.length,
    genres: rowEntries.length,
    myList: myList.length,
  };

  return (
    <main className="min-h-screen pb-32">
      <Navbar search={search} onSearch={setSearch} />
      <Banner movies={featuredMovies.length ? featuredMovies : payload.featured ? [payload.featured] : []} stats={stats} />

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        {error ? <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">{error}</div> : null}

        {loading ? (
          <Loader label="Loading your catalog" />
        ) : (
          <>
            {!search.trim() ? (
              <section className="grid items-start gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="self-start rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-netflix-red">Editorial Picks</p>
                      <h2 className="mt-2 font-display text-3xl font-bold text-white">Best of the platform</h2>
                    </div>
                    <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-netflix-mist">Updated live</span>
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-netflix-mist">
                    Handpicked titles with the highest ratings across your catalog.
                  </div>
                  <div className="mt-5 grid gap-4">
                    {spotlightTitles.map((movie) => (
                      <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        state={{ playWithIntro: true }}
                        className="block rounded-2xl border border-white/10 bg-black/25 p-4 transition hover:border-netflix-red/30 hover:bg-black/35"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-white">{movie.title}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-netflix-mist">{movie.category}</p>
                          </div>
                          <span className="rounded-full bg-netflix-red/15 px-2 py-1 text-xs font-semibold text-netflix-red">
                            {movie.rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="mt-3 line-clamp-2 text-sm text-netflix-mist">{movie.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-black/30 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-netflix-red">Fresh this week</p>
                  <h2 className="mt-2 font-display text-3xl font-bold text-white">New arrivals and returning series</h2>
                  <div className="mt-6 space-y-3">
                    {recentlyAdded.map((movie, index) => (
                      <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        state={{ playWithIntro: true }}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:border-netflix-red/30 hover:bg-white/10"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-netflix-red/15 text-sm font-bold text-netflix-red">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <img src={movie.thumbnail_image} alt={movie.title} className="h-14 w-24 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">{movie.title}</p>
                          <p className="text-xs text-netflix-mist">{movie.year} | {movie.duration} | {movie.category}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {!search.trim() ? (
              <div className="rounded-[1.6rem] border border-white/10 bg-white/5 px-5 py-4 text-sm text-netflix-mist">
                Scroll sideways on each row to browse more titles. Click <span className="font-semibold text-white">+ My List</span> on any card to add it to favorites.
              </div>
            ) : null}

            {search.trim() ? (
              <MovieRow
                id="search-results"
                title={`Search Results for "${search}"`}
                movies={searchResults}
                favoritesMap={favoritesMap}
                onToggleFavorite={handleToggleFavorite}
                emptyMessage="No matching titles found."
              />
            ) : null}

            <MovieRow
              id="my-list"
              title="My List"
              movies={myList}
              favoritesMap={favoritesMap}
              onToggleFavorite={handleToggleFavorite}
              emptyMessage="Save titles here and they will show up in your personal list."
            />

            {payload.continue_watching?.length ? (
              <MovieRow
                id="continue-watching"
                title="Continue Watching"
                movies={payload.continue_watching.map((entry) => entry.movie)}
                favoritesMap={favoritesMap}
                onToggleFavorite={handleToggleFavorite}
              />
            ) : null}

            {Object.entries(payload.rows || {}).map(([category, movies]) => (
              <MovieRow
                key={category}
                id={category.toLowerCase().replace(/\s+/g, "-")}
                title={category}
                movies={movies}
                favoritesMap={favoritesMap}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </>
        )}
      </div>
    </main>
  );
}

export default HomePage;
