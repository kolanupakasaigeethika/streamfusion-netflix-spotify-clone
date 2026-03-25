from datetime import datetime

from django.contrib.auth.hashers import check_password, make_password
from mongoengine import DateTimeField, Document, EmailField, FloatField, IntField, ListField, ReferenceField, StringField


class User(Document):
    full_name = StringField(required=True, max_length=120)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "users",
        "indexes": ["email"],
    }

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    @property
    def id(self):
        return str(self.pk)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)


class Movie(Document):
    title = StringField(required=True, max_length=255)
    description = StringField(required=True)
    thumbnail_image = StringField(required=True)
    video_url = StringField(required=True)
    category = StringField(required=True, max_length=120)
    rating = FloatField(required=True, min_value=0, max_value=10)
    maturity_rating = StringField(default="13+")
    year = IntField(default=datetime.utcnow().year)
    duration = StringField(default="2h 00m")
    tags = ListField(StringField(max_length=50), default=list)
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "movies",
        "indexes": ["title", "category", "-rating"],
        "ordering": ["-created_at"],
    }


class Favorite(Document):
    user = ReferenceField(User, required=True, reverse_delete_rule=2)
    movie = ReferenceField(Movie, required=True, reverse_delete_rule=2)
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "favorites",
        "indexes": [
            {"fields": ["user", "movie"], "unique": True},
        ],
    }


class ContinueWatching(Document):
    user = ReferenceField(User, required=True, reverse_delete_rule=2)
    movie = ReferenceField(Movie, required=True, reverse_delete_rule=2)
    progress_seconds = IntField(default=0)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "continue_watching",
        "indexes": [
            {"fields": ["user", "movie"], "unique": True},
            "-updated_at",
        ],
    }


class Music(Document):
    title = StringField(required=True, max_length=255)
    artist = StringField(required=True, max_length=255)
    audio_url = StringField(required=True)
    thumbnail = StringField(required=True)
    category = StringField(required=True, max_length=120)  # Action, Thriller, Romance, etc.
    duration = IntField(default=0)  # in seconds
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "music",
        "indexes": ["title", "artist", "category"],
        "ordering": ["-created_at"],
    }


class Playlist(Document):
    name = StringField(required=True, max_length=255)
    description = StringField(default="")
    songs = ListField(ReferenceField(Music, reverse_delete_rule=4))  # CASCADE delete
    category = StringField(required=True, max_length=120)  # Matches movie categories
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "playlists",
        "indexes": ["name", "category"],
        "ordering": ["-created_at"],
    }
