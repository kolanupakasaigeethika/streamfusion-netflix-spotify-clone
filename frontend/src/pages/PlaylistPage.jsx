import { useEffect, useState } from "react";

import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useMusic } from "../context/MusicContext";
import api from "../services/api";

const FALLBACK_MUSIC_ART =
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80";

function PlaylistPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { activePlaylist, currentSong, playPlaylist, playSong } = useMusic();

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get("/playlists");
        setPlaylists(data);
      } catch (requestError) {
        setError(requestError.response?.data?.detail || "Unable to load playlists.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlaySong = (song, playlist) => {
    playSong(
      song,
      playlist.songs,
      playlist.songs.findIndex((entry) => entry.id === song.id),
      playlist
    );
  };

  return (
    <main className="min-h-screen pb-32">
      <Navbar />

      <section className="border-b border-white/5 bg-[radial-gradient(circle_at_top_left,rgba(29,185,84,0.25),transparent_22%),linear-gradient(180deg,#191414_0%,#121212_58%,#0b0b0f_100%)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1db954]">Netflix Music</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
              A soundtrack layer that lives inside your streaming app.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b3b3b3]">
              Pick a curated vibe manually, or let movie genres auto-switch the background score while the player stays pinned across the app.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">Currently active</p>
            <div className="mt-4 flex items-center gap-4">
              <img
                src={
                  currentSong?.thumbnail ||
                  activePlaylist?.cover_image ||
                  FALLBACK_MUSIC_ART
                }
                alt={currentSong?.title || activePlaylist?.name || "Playlist artwork"}
                className="h-20 w-20 rounded-2xl object-cover shadow-2xl shadow-black/30"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = FALLBACK_MUSIC_ART;
                }}
              />
              <div className="min-w-0">
                <p className="truncate text-xs uppercase tracking-[0.24em] text-[#1db954]">
                  {activePlaylist?.category || "Always on"}
                </p>
                <h2 className="truncate text-2xl font-bold text-white">
                  {activePlaylist?.name || "Choose a playlist"}
                </h2>
                <p className="truncate text-sm text-[#b3b3b3]">
                  {currentSong ? `${currentSong.title} | ${currentSong.artist}` : "Start a mix below"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error ? (
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {loading ? (
          <Loader label="Loading playlists" />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#181818] transition hover:-translate-y-1 hover:border-[#1db954]/40 hover:shadow-2xl hover:shadow-black/30"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={playlist.cover_image || FALLBACK_MUSIC_ART}
                    alt={playlist.name}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_MUSIC_ART;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/55 to-transparent" />
                  <button
                    onClick={() => playPlaylist(playlist)}
                    className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1db954] text-black shadow-lg transition hover:scale-105"
                    aria-label={`Play ${playlist.name}`}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v6l7 5V2z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="p-6">
                  <span className="rounded-full border border-[#1db954]/30 bg-[#1db954]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#1db954]">
                    {playlist.category}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-bold text-white">{playlist.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#b3b3b3]">{playlist.description}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/40">
                    {playlist.song_count} tracks
                  </p>
                </div>

                <div className="space-y-2 px-4 pb-4">
                  {playlist.songs.slice(0, 4).map((song, index) => (
                    <div
                      key={song.id}
                      className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-white/5"
                      onClick={() => handlePlaySong(song, playlist)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-white/70">
                        {index + 1}
                      </div>
                      <img
                        src={song.thumbnail || FALLBACK_MUSIC_ART}
                        alt={song.title}
                        className="h-10 w-10 rounded-xl object-cover"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = FALLBACK_MUSIC_ART;
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{song.title}</p>
                        <p className="truncate text-xs text-[#b3b3b3]">{song.artist}</p>
                      </div>
                      <button className="text-[#b3b3b3] transition hover:text-white">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2L3 7v6l7 5V2z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {playlist.songs.length > 4 ? (
                    <p className="pt-1 text-center text-xs text-[#b3b3b3]">
                      +{playlist.songs.length - 4} more songs in queue
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default PlaylistPage;
