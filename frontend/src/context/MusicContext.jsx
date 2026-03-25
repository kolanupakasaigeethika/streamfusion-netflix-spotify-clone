import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import api from "../services/api";

const MusicContext = createContext(null);
const PLAYER_VOLUME_KEY = "netflix-player-volume";
const LAST_CATEGORY_KEY = "netflix-last-played-category";
const CROSSFADE_MS = 1400;

const categoryFallbacks = {
  thriller: ["mystery", "action"],
  action: ["thriller", "adventure"],
  romance: ["drama"],
  drama: ["romance"],
  mystery: ["thriller"],
  "sci-fi": ["fantasy", "adventure"],
  fantasy: ["sci-fi", "adventure"],
  adventure: ["action", "fantasy"],
  comedy: ["drama"],
};

const normalizeCategory = (value = "") => value.trim().toLowerCase();

export function MusicProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [musicLibrary, setMusicLibrary] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [recommendedPlaylist, setRecommendedPlaylist] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(() => {
    const savedVolume = window.localStorage.getItem(PLAYER_VOLUME_KEY);
    const parsedValue = savedVolume ? Number(savedVolume) : 0.7;
    return Number.isFinite(parsedValue) ? parsedValue : 0.7;
  });
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackError, setPlaybackError] = useState("");
  const [lastPlayedCategory, setLastPlayedCategory] = useState(
    () => window.localStorage.getItem(LAST_CATEGORY_KEY) || ""
  );
  const [hasUnlockedAudio, setHasUnlockedAudio] = useState(false);

  const audioRef = useRef(null);
  const catalogPromiseRef = useRef(null);
  const fadeFrameRef = useRef(null);
  const transitionTokenRef = useRef(0);
  const playlistRef = useRef([]);
  const currentIndexRef = useRef(0);
  const volumeRef = useRef(volume);
  const isShuffleRef = useRef(isShuffle);
  const isRepeatRef = useRef(isRepeat);
  const currentSongRef = useRef(currentSong);
  const hasUnlockedAudioRef = useRef(false);

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    isShuffleRef.current = isShuffle;
  }, [isShuffle]);

  useEffect(() => {
    isRepeatRef.current = isRepeat;
  }, [isRepeat]);

  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  useEffect(() => {
    hasUnlockedAudioRef.current = hasUnlockedAudio;
  }, [hasUnlockedAudio]);

  const cancelFade = useCallback(() => {
    if (fadeFrameRef.current) {
      window.cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  }, []);

  const animateVolume = useCallback(
    (fromValue, toValue, durationMs, token) =>
      new Promise((resolve) => {
        const audio = audioRef.current;
        if (!audio) {
          resolve();
          return;
        }

        cancelFade();

        if (!durationMs || Math.abs(fromValue - toValue) < 0.001) {
          audio.volume = toValue;
          resolve();
          return;
        }

        const startTime = performance.now();

        const tick = (now) => {
          if (transitionTokenRef.current !== token) {
            resolve();
            return;
          }

          const progressRatio = Math.min((now - startTime) / durationMs, 1);
          const easedRatio = 1 - Math.pow(1 - progressRatio, 3);
          audio.volume = fromValue + (toValue - fromValue) * easedRatio;

          if (progressRatio < 1) {
            fadeFrameRef.current = window.requestAnimationFrame(tick);
          } else {
            fadeFrameRef.current = null;
            resolve();
          }
        };

        fadeFrameRef.current = window.requestAnimationFrame(tick);
      }),
    [cancelFade]
  );

  const ensureCatalogLoaded = useCallback(async () => {
    if (catalogPromiseRef.current) {
      return catalogPromiseRef.current;
    }

    catalogPromiseRef.current = Promise.all([api.get("/music"), api.get("/playlists")])
      .then(([musicResponse, playlistResponse]) => {
        setMusicLibrary(musicResponse.data);
        setPlaylists(playlistResponse.data);
        setIsReady(true);
        return {
          music: musicResponse.data,
          playlists: playlistResponse.data,
        };
      })
      .catch((error) => {
        console.error("Failed to preload music catalog:", error);
        setIsReady(true);
        throw error;
      });

    return catalogPromiseRef.current;
  }, []);

  useEffect(() => {
    ensureCatalogLoaded().catch(() => {
      // The UI already surfaces loading and error states where needed.
    });
  }, [ensureCatalogLoaded]);

  useEffect(() => {
    window.localStorage.setItem(PLAYER_VOLUME_KEY, String(volume));
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (lastPlayedCategory) {
      window.localStorage.setItem(LAST_CATEGORY_KEY, lastPlayedCategory);
    }
  }, [lastPlayedCategory]);

  useEffect(() => () => cancelFade(), [cancelFade]);

  const syncRecommendations = useCallback(
    (category, availablePlaylists = playlists) => {
      const normalizedCategory = normalizeCategory(category);
      if (!normalizedCategory) {
        setRecommendedPlaylist(null);
        return;
      }

      const match = availablePlaylists.find(
        (playlistItem) =>
          normalizeCategory(playlistItem.category) === normalizedCategory && playlistItem.songs?.length
      );
      setRecommendedPlaylist(match || null);
    },
    [playlists]
  );

  const transitionToSong = useCallback(
    async (song, { shouldPlay = true, crossfade = true, preserveTime = false } = {}) => {
      const audio = audioRef.current;
      if (!audio || !song) {
        return;
      }

      const token = ++transitionTokenRef.current;
      const hasActiveSource = Boolean(audio.currentSrc);
      const isDifferentTrack = !audio.currentSrc || !audio.currentSrc.includes(song.audio_url);

      setPlaybackError("");
      setIsBuffering(shouldPlay);

      if (crossfade && hasActiveSource && !audio.paused && isDifferentTrack) {
        await animateVolume(audio.volume, 0, CROSSFADE_MS / 2, token);
      } else {
        cancelFade();
      }

      if (transitionTokenRef.current !== token) {
        return;
      }

      if (isDifferentTrack) {
        audio.pause();
        audio.src = song.audio_url;
        audio.load();
      } else if (!preserveTime) {
        audio.currentTime = 0;
      }

      if (!preserveTime) {
        setCurrentTime(0);
        setProgress(0);
      }

      setDuration(song.duration || 0);

      if (!shouldPlay) {
        audio.pause();
        audio.volume = volumeRef.current;
        setIsPlaying(false);
        setIsBuffering(false);
        return;
      }

      audio.volume = crossfade ? 0 : volumeRef.current;

      try {
        await audio.play();
        setIsPlaying(true);
        if (crossfade) {
          await animateVolume(0, volumeRef.current, CROSSFADE_MS / 2, token);
        } else {
          audio.volume = volumeRef.current;
        }
      } catch (error) {
        console.error("Unable to start audio playback:", error);
        setPlaybackError("Playback was blocked. Try pressing play again.");
        setIsPlaying(false);
      } finally {
        if (transitionTokenRef.current === token) {
          setIsBuffering(false);
        }
      }
    },
    [animateVolume, cancelFade]
  );

  const startTrackImmediately = useCallback(
    (song) => {
      const audio = audioRef.current;
      if (!audio || !song) {
        return Promise.resolve(false);
      }

      ++transitionTokenRef.current;
      cancelFade();
      setPlaybackError("");
      setIsBuffering(true);

      audio.pause();
      audio.src = song.audio_url;
      audio.load();
      audio.currentTime = 0;
      audio.volume = volumeRef.current;

      setCurrentTime(0);
      setProgress(0);
      setDuration(song.duration || 0);

      return audio
        .play()
        .then(() => {
          hasUnlockedAudioRef.current = true;
          setHasUnlockedAudio(true);
          setIsPlaying(true);
          setIsBuffering(false);
          return true;
        })
        .catch((error) => {
          console.error("Direct playback start failed:", error);
          setPlaybackError("Playback was blocked. Try one more click on play.");
          setIsPlaying(false);
          setIsBuffering(false);
          return false;
        });
    },
    [cancelFade]
  );

  const unlockAudio = useCallback(() => {
    if (!hasUnlockedAudioRef.current) {
      hasUnlockedAudioRef.current = true;
      setHasUnlockedAudio(true);
    }

    setPlaybackError("");
    return true;
  }, []);

  const buildPlaylistMeta = useCallback((song, playlistMeta = null) => {
    if (playlistMeta) {
      return playlistMeta;
    }

    return {
      id: `single-${song.id}`,
      name: song.category ? `${song.category} Single` : "Single",
      category: song.category || "",
      cover_image: song.thumbnail || "",
    };
  }, []);

  const setQueue = useCallback(
    async (songs = [], startIndex = 0, playlistMeta = null, shouldPlay = true, options = {}) => {
      if (!songs.length) {
        return;
      }

      const safeIndex = Math.max(0, Math.min(startIndex, songs.length - 1));
      const song = songs[safeIndex];
      const resolvedPlaylistMeta = buildPlaylistMeta(song, playlistMeta);

      setPlaylist(songs);
      setCurrentIndex(safeIndex);
      setCurrentSong(song);
      setActivePlaylist(resolvedPlaylistMeta);
      setDuration(song?.duration || 0);
      setLastPlayedCategory(song?.category || resolvedPlaylistMeta.category || "");
      syncRecommendations(song?.category || resolvedPlaylistMeta.category || "");

      if (shouldPlay && options.immediateStart) {
        const started = await startTrackImmediately(song);
        if (started) {
          return;
        }
      }

      await transitionToSong(song, {
        shouldPlay,
        crossfade: options.crossfade ?? true,
        preserveTime: false,
      });
    },
    [buildPlaylistMeta, startTrackImmediately, syncRecommendations, transitionToSong]
  );

  const playSong = useCallback(
    async (song, songList = null, startIndex = 0, playlistMeta = null) => {
      if (!song) {
        return;
      }

      const unlocked = unlockAudio();
      if (!unlocked) {
        return;
      }

      if (songList?.length) {
        await setQueue(songList, startIndex, playlistMeta, true, {
          crossfade: hasUnlockedAudioRef.current,
          immediateStart: !hasUnlockedAudioRef.current,
        });
        return;
      }

      await setQueue([song], 0, buildPlaylistMeta(song, playlistMeta), true, {
        crossfade: hasUnlockedAudioRef.current,
        immediateStart: !hasUnlockedAudioRef.current,
      });
    },
    [buildPlaylistMeta, setQueue, unlockAudio]
  );

  const pauseTrack = useCallback(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const resumeTrack = useCallback(async () => {
    if (!audioRef.current || !currentSongRef.current) {
      return;
    }

    const unlocked = unlockAudio();
    if (!unlocked) {
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setPlaybackError("");
    } catch (error) {
      console.error("Unable to resume playback:", error);
      setPlaybackError("Playback was blocked. Try pressing play again.");
    }
  }, [unlockAudio]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  }, [isPlaying, pauseTrack, resumeTrack]);

  const getNextIndex = useCallback(
    (direction = 1) => {
      const songs = playlistRef.current;
      if (!songs.length) {
        return -1;
      }

      if (isShuffleRef.current && songs.length > 1) {
        let randomIndex = currentIndexRef.current;
        while (randomIndex === currentIndexRef.current) {
          randomIndex = Math.floor(Math.random() * songs.length);
        }
        return randomIndex;
      }

      if (direction === -1) {
        return currentIndexRef.current === 0 ? songs.length - 1 : currentIndexRef.current - 1;
      }

      return (currentIndexRef.current + 1) % songs.length;
    },
    []
  );

  const moveToIndex = useCallback(
    async (index, options = {}) => {
      const songs = playlistRef.current;
      if (!songs.length || index < 0 || !songs[index]) {
        return;
      }

      setCurrentIndex(index);
      setCurrentSong(songs[index]);
      setLastPlayedCategory(songs[index].category || "");
      syncRecommendations(songs[index].category || "");

      await transitionToSong(songs[index], {
        shouldPlay: options.shouldPlay ?? true,
        crossfade: options.crossfade ?? true,
        preserveTime: false,
      });
    },
    [syncRecommendations, transitionToSong]
  );

  const nextSong = useCallback(
    async (options = {}) => {
      const nextIndex = getNextIndex(1);
      if (nextIndex === -1) {
        return;
      }
      await moveToIndex(nextIndex, options);
    },
    [getNextIndex, moveToIndex]
  );

  const prevSong = useCallback(
    async (options = {}) => {
      const audio = audioRef.current;
      if (audio && audio.currentTime > 4) {
        audio.currentTime = 0;
        setCurrentTime(0);
        setProgress(0);
        return;
      }

      const prevIndex = getNextIndex(-1);
      if (prevIndex === -1) {
        return;
      }
      await moveToIndex(prevIndex, options);
    },
    [getNextIndex, moveToIndex]
  );

  const seekTo = useCallback(
    (time) => {
      if (!audioRef.current) {
        return;
      }

      audioRef.current.currentTime = time;
      setCurrentTime(time);
      setProgress(duration ? (time / duration) * 100 : 0);
    },
    [duration]
  );

  const playPlaylist = useCallback(
    async (playlistData, startIndex = 0, shouldPlay = true) => {
      if (!playlistData?.songs?.length) {
        return;
      }

      if (shouldPlay) {
        const unlocked = unlockAudio();
        if (!unlocked) {
          return;
        }
      }

      await setQueue(
        playlistData.songs,
        startIndex,
        {
          id: playlistData.id,
          name: playlistData.name,
          category: playlistData.category,
          cover_image: playlistData.cover_image,
        },
        shouldPlay,
        {
          crossfade: hasUnlockedAudioRef.current,
          immediateStart: shouldPlay && !hasUnlockedAudioRef.current,
        }
      );
    },
    [setQueue, unlockAudio]
  );

  const loadPlaylistForCategory = useCallback(
    async (category, options = {}) => {
      const normalizedCategory = normalizeCategory(category);
      if (!normalizedCategory) {
        return null;
      }

      let catalog = {
        music: musicLibrary,
        playlists,
      };

      if (!isReady) {
        try {
          catalog = await ensureCatalogLoaded();
        } catch {
          catalog = {
            music: musicLibrary,
            playlists,
          };
        }
      }

      const categoryPool = [normalizedCategory, ...(categoryFallbacks[normalizedCategory] || [])];

      let matchedPlaylist =
        catalog.playlists.find(
          (playlistItem) =>
            playlistItem.songs?.length &&
            categoryPool.includes(normalizeCategory(playlistItem.category))
        ) || null;

      if (!matchedPlaylist && catalog.music.length) {
        const fallbackSongs = catalog.music.filter((song) =>
          categoryPool.includes(normalizeCategory(song.category))
        );

        if (fallbackSongs.length) {
          matchedPlaylist = {
            id: `generated-${normalizedCategory}`,
            name: `${category} Mix`,
            category,
            cover_image: fallbackSongs[0]?.thumbnail || "",
            songs: fallbackSongs,
          };
        }
      }

      if (matchedPlaylist) {
        if (options.autoplay ?? true) {
          await playPlaylist(matchedPlaylist, 0, true);
        } else {
          setPlaylist(matchedPlaylist.songs);
          setCurrentIndex(0);
          setCurrentSong(matchedPlaylist.songs[0]);
          setActivePlaylist({
            id: matchedPlaylist.id,
            name: matchedPlaylist.name,
            category: matchedPlaylist.category,
            cover_image: matchedPlaylist.cover_image,
          });
          setDuration(matchedPlaylist.songs[0]?.duration || 0);
          setLastPlayedCategory(matchedPlaylist.category || category);
          syncRecommendations(matchedPlaylist.category || category, catalog.playlists);
        }
      }

      return matchedPlaylist;
    },
    [ensureCatalogLoaded, isReady, musicLibrary, playPlaylist, playlists, syncRecommendations]
  );

  useEffect(() => {
    if (!playlists.length && !lastPlayedCategory) {
      setRecommendedPlaylist(null);
      return;
    }

    syncRecommendations(lastPlayedCategory);
  }, [lastPlayedCategory, playlists, syncRecommendations]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return undefined;
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || currentSongRef.current?.duration || 0);
      setIsBuffering(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };

    const handleEnded = () => {
      if (isRepeatRef.current && currentSongRef.current) {
        transitionToSong(currentSongRef.current, {
          shouldPlay: true,
          crossfade: false,
          preserveTime: false,
        });
        return;
      }

      nextSong({ crossfade: true });
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
    };

    const handleError = () => {
      console.error("Audio error");
      setPlaybackError("This track could not be loaded.");
      setIsPlaying(false);
      setIsBuffering(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("playing", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("playing", handleCanPlay);
      audio.removeEventListener("error", handleError);
    };
  }, [nextSong, transitionToSong]);

  const value = useMemo(
    () => ({
      currentSong,
      currentTrack: currentSong,
      isPlaying,
      playlist,
      playlists,
      musicLibrary,
      activePlaylist,
      recommendedPlaylist,
      currentIndex,
      progress,
      volume,
      duration,
      currentTime,
      isReady,
      isShuffle,
      isRepeat,
      isExpanded,
      isBuffering,
      playbackError,
      lastPlayedCategory,
      audioRef,
      playSong,
      playTrack: playSong,
      playPlaylist,
      pauseTrack,
      togglePlayPause,
      nextSong,
      prevSong,
      seekTo,
      setVolume,
      setIsShuffle,
      setIsRepeat,
      setIsExpanded,
      loadPlaylistForCategory,
    }),
    [
      activePlaylist,
      currentIndex,
      currentSong,
      currentTime,
      duration,
      isBuffering,
      isExpanded,
      isPlaying,
      isReady,
      isRepeat,
      isShuffle,
      lastPlayedCategory,
      loadPlaylistForCategory,
      musicLibrary,
      nextSong,
      pauseTrack,
      playbackError,
      playPlaylist,
      playSong,
      playlist,
      playlists,
      prevSong,
      progress,
      recommendedPlaylist,
      seekTo,
      togglePlayPause,
      volume,
    ]
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
