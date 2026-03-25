from django.core.management.base import BaseCommand

from movies.models import Music, Playlist


SAMPLE_MUSIC = [
    {
        "title": "Dark Alley Pursuit",
        "artist": "Shadow Soundtrack",
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "thumbnail": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80",
        "category": "Thriller",
        "duration": 180,
    },
    {
        "title": "Midnight Tension",
        "artist": "Noir Beats",
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        "thumbnail": "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80",
        "category": "Thriller",
        "duration": 240,
    },
    {
        "title": "Urban Chase",
        "artist": "City Pulse",
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        "thumbnail": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80",
        "category": "Action",
        "duration": 200,
    },
    {
        "title": "Adrenaline Rush",
        "artist": "Action Heroes",
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        "thumbnail": "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80",
        "category": "Action",
        "duration": 190,
    },
    {
        "title": "Romantic Sunset",
        "artist": "Love Strings",
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        "thumbnail": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
        "category": "Romance",
        "duration": 220,
    },
    {
        "title": "Whispers of Love",
        "artist": "Gentle Melodies",
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        "thumbnail": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
        "category": "Romance",
        "duration": 210,
    },
    {
        "title": "Mystery in the Fog",
        "artist": "Enigma Sounds",
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        "thumbnail": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80",
        "category": "Mystery",
        "duration": 250,
    },
    {
        "title": "Sci-Fi Horizons",
        "artist": "Future Waves",
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        "thumbnail": "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?auto=format&fit=crop&w=400&q=80",
        "category": "Sci-Fi",
        "duration": 230,
    },
    {
        "title": "Epic Adventure",
        "artist": "Quest Masters",
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        "thumbnail": "https://images.unsplash.com/photo-1464822759033-c1dd00b620c0?auto=format&fit=crop&w=400&q=80",
        "category": "Adventure",
        "duration": 260,
    },
    {
        "title": "Comedy Groove",
        "artist": "Funny Beats",
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        "thumbnail": "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=400&q=80",
        "category": "Comedy",
        "duration": 180,
    },
    {
        "title": "Glass Heart Echoes",
        "artist": "Velvet Avenue",
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        "thumbnail": "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=400&q=80",
        "category": "Drama",
        "duration": 214,
    },
    {
        "title": "Orbit Afterglow",
        "artist": "Neon Atlas",
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        "thumbnail": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
        "category": "Fantasy",
        "duration": 236,
    },
]


SAMPLE_PLAYLISTS = [
    {
        "name": "Thriller Soundtrack",
        "description": "Suspenseful music for thriller movies",
        "category": "Thriller",
        "song_titles": ["Dark Alley Pursuit", "Midnight Tension"],
    },
    {
        "name": "Action Heroes",
        "description": "High-energy tracks for action-packed scenes",
        "category": "Action",
        "song_titles": ["Urban Chase", "Adrenaline Rush"],
    },
    {
        "name": "Romantic Moments",
        "description": "Soft melodies for romantic scenes",
        "category": "Romance",
        "song_titles": ["Romantic Sunset", "Whispers of Love"],
    },
    {
        "name": "Mystery Vibes",
        "description": "Atmospheric music for mystery and suspense",
        "category": "Mystery",
        "song_titles": ["Mystery in the Fog"],
    },
    {
        "name": "Sci-Fi Journey",
        "description": "Futuristic sounds for sci-fi adventures",
        "category": "Sci-Fi",
        "song_titles": ["Sci-Fi Horizons"],
    },
    {
        "name": "Adventure Awaits",
        "description": "Epic music for adventure stories",
        "category": "Adventure",
        "song_titles": ["Epic Adventure"],
    },
    {
        "name": "Comedy Central",
        "description": "Fun and upbeat tracks for comedies",
        "category": "Comedy",
        "song_titles": ["Comedy Groove"],
    },
    {
        "name": "Deep Drama Sessions",
        "description": "Moody and emotional tracks for grounded stories",
        "category": "Drama",
        "song_titles": ["Glass Heart Echoes", "Romantic Sunset"],
    },
    {
        "name": "Fantasy Atmospheres",
        "description": "Dreamlike ambient soundscapes for magical worlds",
        "category": "Fantasy",
        "song_titles": ["Orbit Afterglow", "Sci-Fi Horizons"],
    },
]


class Command(BaseCommand):
    help = "Seed the database with sample music and playlists for the music system."

    def handle(self, *args, **options):
        # Create music
        created_music = 0
        for payload in SAMPLE_MUSIC:
            music = Music.objects(title=payload["title"]).first()
            if music:
                for key, value in payload.items():
                    setattr(music, key, value)
                music.save()
            else:
                Music(**payload).save()
                created_music += 1

        # Create playlists
        created_playlists = 0
        for payload in SAMPLE_PLAYLISTS:
            playlist = Playlist.objects(name=payload["name"]).first()
            if playlist:
                for key, value in payload.items():
                    if key != "song_titles":
                        setattr(playlist, key, value)
                # Update songs
                songs = []
                for title in payload["song_titles"]:
                    song = Music.objects(title=title).first()
                    if song:
                        songs.append(song)
                playlist.songs = songs
                playlist.save()
            else:
                songs = []
                for title in payload["song_titles"]:
                    song = Music.objects(title=title).first()
                    if song:
                        songs.append(song)
                payload_copy = payload.copy()
                del payload_copy["song_titles"]
                payload_copy["songs"] = songs
                Playlist(**payload_copy).save()
                created_playlists += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Music seed complete. Added {created_music} songs and {created_playlists} playlists."
            )
        )
