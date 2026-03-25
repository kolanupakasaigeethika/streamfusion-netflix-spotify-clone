import { useMemo, useState } from "react";

import AudioVisualizer from "./AudioVisualizer";
import { useMusic } from "../context/MusicContext";

const FALLBACK_MUSIC_ART =
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80";

function MusicPlayer() {
  const {
    currentSong,
    activePlaylist,
    recommendedPlaylist,
    isPlaying,
    isShuffle,
    isRepeat,
    isExpanded,
    isBuffering,
    playbackError,
    togglePlayPause,
    nextSong,
    prevSong,
    progress,
    volume,
    setVolume,
    seekTo,
    duration,
    currentTime,
    setIsShuffle,
    setIsRepeat,
    setIsExpanded,
    playPlaylist,
  } = useMusic();

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const artSrc = currentSong?.thumbnail || activePlaylist?.cover_image || FALLBACK_MUSIC_ART;

  const formattedProgress = useMemo(() => `${progress}%`, [progress]);

  if (!currentSong) {
    return null;
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    seekTo(percentage * duration);
  };

  const stopExpandOnControl = (event, handler) => {
    event.stopPropagation();
    handler();
  };

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#121212]/95 px-4 py-3 backdrop-blur-2xl"
        onClick={() => setIsExpanded(true)}
      >
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.15fr_1.3fr_0.95fr] lg:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative">
              <img
                src={artSrc}
                alt={currentSong.title}
                className="h-14 w-14 rounded-xl object-cover shadow-[0_0_28px_rgba(29,185,84,0.18)]"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = FALLBACK_MUSIC_ART;
                }}
              />
              {isPlaying ? (
                <span className="absolute inset-0 rounded-xl bg-[#1db954]/10 shadow-[0_0_24px_rgba(29,185,84,0.28)]" />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{currentSong.title}</p>
              <p className="truncate text-xs text-[#b3b3b3]">{currentSong.artist}</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="truncate text-[11px] uppercase tracking-[0.24em] text-[#1db954]">
                  {activePlaylist?.name || currentSong.category}
                </p>
                <AudioVisualizer isPlaying={isPlaying && !isBuffering} compact className="hidden md:flex" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-3">
              <button
                onClick={(event) => stopExpandOnControl(event, () => setIsShuffle((value) => !value))}
                className={`rounded-full px-2 py-1 text-xs transition ${isShuffle ? "bg-[#1db954]/20 text-[#1db954]" : "text-white/60 hover:text-white"}`}
                aria-label="Toggle shuffle"
              >
                Shuffle
              </button>

              <button
                onClick={(event) => stopExpandOnControl(event, () => prevSong())}
                className="text-white/70 transition-colors hover:text-white"
                aria-label="Previous song"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>

              <button
                onClick={(event) => stopExpandOnControl(event, togglePlayPause)}
                className="rounded-full bg-[#1db954] p-3 text-black transition-transform hover:scale-105"
                aria-label={isPlaying ? "Pause song" : "Play song"}
              >
                {isBuffering ? (
                  <span className="block h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                ) : isPlaying ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 4a1 1 0 00-1 1v10a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1H6zM12 4a1 1 0 00-1 1v10a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1h-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v6l7 5V2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              <button
                onClick={(event) => stopExpandOnControl(event, () => nextSong())}
                className="text-white/70 transition-colors hover:text-white"
                aria-label="Next song"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                </svg>
              </button>

              <button
                onClick={(event) => stopExpandOnControl(event, () => setIsRepeat((value) => !value))}
                className={`rounded-full px-2 py-1 text-xs transition ${isRepeat ? "bg-[#1db954]/20 text-[#1db954]" : "text-white/60 hover:text-white"}`}
                aria-label="Toggle repeat"
              >
                Repeat
              </button>
            </div>

            <div className="flex w-full max-w-xl items-center gap-2">
              <span className="w-10 text-right text-[11px] text-[#b3b3b3]">{formatTime(currentTime)}</span>
              <div
                className="group relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/15"
                onClick={(event) => {
                  event.stopPropagation();
                  handleProgressClick(event);
                }}
              >
                <div
                  className="music-progress__bar relative h-full rounded-full bg-gradient-to-r from-[#1db954] to-[#4ade80]"
                  style={{ width: formattedProgress }}
                >
                  <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover:opacity-100" />
                </div>
              </div>
              <span className="w-10 text-[11px] text-[#b3b3b3]">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <div className="hidden max-w-[12rem] text-right lg:block">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Up Next</p>
              <p className="truncate text-sm text-white">
                {recommendedPlaylist?.name || activePlaylist?.category || currentSong.category}
              </p>
            </div>
            <div className="relative">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setShowVolumeSlider(true);
                }}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
                className="text-white/70 transition-colors hover:text-white"
                aria-label="Adjust volume"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.414 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.414l3.969-3.816a1 1 0 011.616 0zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {showVolumeSlider ? (
                <div
                  className="absolute bottom-full right-0 mb-2 rounded-xl border border-white/10 bg-[#181818] p-3 shadow-2xl"
                  onClick={(event) => event.stopPropagation()}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(event) => setVolume(parseFloat(event.target.value))}
                    className="slider h-1 w-28 cursor-pointer appearance-none rounded-lg bg-white/20"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {playbackError ? <p className="mx-auto mt-2 max-w-7xl text-xs text-red-300">{playbackError}</p> : null}
      </div>

      {isExpanded ? (
        <div className="fixed inset-0 z-[70] bg-[radial-gradient(circle_at_top,rgba(29,185,84,0.2),transparent_24%),linear-gradient(180deg,#121212_0%,#09090d_100%)] p-6 backdrop-blur-3xl">
          <div className="mx-auto flex h-full max-w-5xl flex-col">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#1db954]">Now Playing</p>
                <h2 className="mt-2 font-display text-3xl font-bold text-white">{activePlaylist?.name || "Active Mix"}</h2>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="mt-10 grid flex-1 items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
              <div className="mx-auto w-full max-w-md">
                <img
                  src={artSrc}
                  alt={currentSong.title}
                  className="aspect-square w-full rounded-[2.5rem] object-cover shadow-[0_0_90px_rgba(29,185,84,0.18)]"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = FALLBACK_MUSIC_ART;
                  }}
                />
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/40">{currentSong.category}</p>
                <h3 className="mt-3 font-display text-5xl font-bold text-white">{currentSong.title}</h3>
                <p className="mt-3 text-xl text-[#b3b3b3]">{currentSong.artist}</p>

                <AudioVisualizer isPlaying={isPlaying && !isBuffering} className="mt-8 h-24" />

                <div className="mt-8 flex items-center gap-3">
                  <button
                    onClick={() => setIsShuffle((value) => !value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isShuffle ? "bg-[#1db954] text-black" : "border border-white/10 bg-white/5 text-white hover:bg-white/10"}`}
                  >
                    Shuffle
                  </button>
                  <button
                    onClick={() => prevSong()}
                    className="rounded-full border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                    </svg>
                  </button>
                  <button
                    onClick={togglePlayPause}
                    className="rounded-full bg-[#1db954] p-4 text-black transition hover:scale-105"
                  >
                    {isPlaying ? (
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 4a1 1 0 00-1 1v10a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1H6zM12 4a1 1 0 00-1 1v10a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1h-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2L3 7v6l7 5V2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => nextSong()}
                    className="rounded-full border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsRepeat((value) => !value)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isRepeat ? "bg-[#1db954] text-black" : "border border-white/10 bg-white/5 text-white hover:bg-white/10"}`}
                  >
                    Repeat
                  </button>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <span className="w-10 text-right text-sm text-[#b3b3b3]">{formatTime(currentTime)}</span>
                  <div className="group relative h-2 flex-1 cursor-pointer rounded-full bg-white/15" onClick={handleProgressClick}>
                    <div className="music-progress__bar h-full rounded-full bg-gradient-to-r from-[#1db954] to-[#4ade80]" style={{ width: formattedProgress }} />
                  </div>
                  <span className="w-10 text-sm text-[#b3b3b3]">{formatTime(duration)}</span>
                </div>

                {recommendedPlaylist?.id && recommendedPlaylist.id !== activePlaylist?.id ? (
                  <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-[#1db954]">Recommended Next</p>
                    <h4 className="mt-2 text-2xl font-bold text-white">{recommendedPlaylist.name}</h4>
                    <p className="mt-2 text-sm text-[#b3b3b3]">{recommendedPlaylist.description}</p>
                    <button
                      onClick={() => playPlaylist(recommendedPlaylist)}
                      className="mt-4 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                    >
                      Start This Mix
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default MusicPlayer;
