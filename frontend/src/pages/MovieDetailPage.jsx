import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import Loader from "../components/Loader";
import NetflixIntro from "../components/NetflixIntro";
import { useMusic } from "../context/MusicContext";
import api from "../services/api";

function MovieDetailPage() {
  const { movieId } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showIntro, setShowIntro] = useState(Boolean(location.state?.playWithIntro));
  const [isPlayerFullscreen, setIsPlayerFullscreen] = useState(false);
  const videoRef = useRef(null);
  const playerShellRef = useRef(null);
  const skipNextPlayIntroRef = useRef(false);
  const soundtrackStartedRef = useRef(false);

  const { loadPlaylistForCategory } = useMusic();

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get(`/movies/${movieId}`);
        setMovie(data);
        soundtrackStartedRef.current = false;

        if (!location.state?.playWithIntro) {
          await loadPlaylistForCategory(data.category, { autoplay: true });
          soundtrackStartedRef.current = true;
        }
      } catch (requestError) {
        setError(requestError.response?.data?.detail || "Unable to load the selected movie.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [loadPlaylistForCategory, location.state?.playWithIntro, movieId]);

  useEffect(() => {
    setShowIntro(Boolean(location.state?.playWithIntro));
  }, [location.state, movieId]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !movie) {
      return undefined;
    }

    const syncProgress = async () => {
      try {
        await api.post("/continue-watching", {
          movie_id: movie.id,
          progress_seconds: Math.floor(videoElement.currentTime || 0),
        });
      } catch (requestError) {
        console.error("Unable to sync progress", requestError);
      }
    };

    const intervalId = setInterval(syncProgress, 15000);
    return () => clearInterval(intervalId);
  }, [movie]);

  useEffect(() => {
    if (showIntro || !movie || !videoRef.current) {
      return;
    }

    skipNextPlayIntroRef.current = true;
    videoRef.current.play().catch(() => {
      // Browsers may still block autoplay depending on user settings.
    });
  }, [showIntro, movie]);

  const handleIntroComplete = async () => {
    if (movie?.category && !soundtrackStartedRef.current) {
      await loadPlaylistForCategory(movie.category, { autoplay: true });
      soundtrackStartedRef.current = true;
    }

    skipNextPlayIntroRef.current = true;
    setShowIntro(false);

    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Browsers may still block autoplay depending on user settings.
      });
    }
  };

  const handleVideoPlay = () => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      return;
    }

    if (skipNextPlayIntroRef.current) {
      skipNextPlayIntroRef.current = false;
      return;
    }

    if (videoElement.currentTime <= 0.35) {
      videoElement.pause();
      setShowIntro(true);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement;
      const playerShell = playerShellRef.current;
      const videoElement = videoRef.current;

      setIsPlayerFullscreen(
        Boolean(
          fullscreenElement &&
            (fullscreenElement === playerShell ||
              fullscreenElement === videoElement ||
              playerShell?.contains(fullscreenElement))
        )
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (loading) {
    return <Loader fullScreen label="Loading player" />;
  }

  if (error || !movie) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-lg font-semibold text-white">{error || "Movie not found."}</p>
          <Link to="/browse" className="mt-5 inline-flex rounded-full bg-netflix-red px-5 py-3 font-semibold text-white">
            Back to Browse
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050507] pb-32">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/browse" className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
          Back to Browse
        </Link>

        <section className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <div ref={playerShellRef} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/60 shadow-2xl">
            {showIntro ? <NetflixIntro fullscreen={isPlayerFullscreen} onComplete={handleIntroComplete} /> : null}
            <video
              ref={videoRef}
              controls
              autoPlay={!showIntro}
              onPlay={handleVideoPlay}
              poster={movie.thumbnail_image}
              className="aspect-video w-full bg-black"
              src={movie.video_url}
            />
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <span className="rounded-full border border-netflix-red/30 bg-netflix-red/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-netflix-red">
              {movie.category}
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold text-white">{movie.title}</h1>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-netflix-mist">
              <span>{movie.year}</span>
              <span>{movie.duration}</span>
              <span>{movie.maturity_rating}</span>
              <span>{movie.rating.toFixed(1)} / 10</span>
            </div>
            <p className="mt-6 text-sm leading-7 text-netflix-mist">{movie.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {movie.tags?.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-netflix-mist">
                  {tag}
                </span>
              ))}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default MovieDetailPage;
