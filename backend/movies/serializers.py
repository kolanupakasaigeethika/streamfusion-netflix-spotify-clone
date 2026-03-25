from rest_framework import serializers
from mongoengine.errors import ValidationError as MongoValidationError

from .models import ContinueWatching, Favorite, Movie, Music, Playlist, User


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        if User.objects(email=value.lower()).first():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        user = User(
            full_name=validated_data["full_name"].strip(),
            email=validated_data["email"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    full_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        return {
            "id": str(instance.id),
            "full_name": instance.full_name,
            "email": instance.email,
            "created_at": instance.created_at,
        }


class MovieSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField()
    description = serializers.CharField()
    thumbnail_image = serializers.CharField()
    video_url = serializers.CharField()
    category = serializers.CharField()
    rating = serializers.FloatField()
    maturity_rating = serializers.CharField()
    year = serializers.IntegerField()
    duration = serializers.CharField()
    tags = serializers.ListField(child=serializers.CharField(), required=False)

    def to_representation(self, instance):
        return {
            "id": str(instance.id),
            "title": instance.title,
            "description": instance.description,
            "thumbnail_image": instance.thumbnail_image,
            "video_url": instance.video_url,
            "category": instance.category,
            "rating": instance.rating,
            "maturity_rating": instance.maturity_rating,
            "year": instance.year,
            "duration": instance.duration,
            "tags": instance.tags or [],
        }

    def create(self, validated_data):
        movie = Movie(**validated_data)
        movie.save()
        return movie


class FavoriteSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    movie = MovieSerializer(read_only=True)
    movie_id = serializers.CharField(write_only=True, required=True)
    created_at = serializers.DateTimeField(read_only=True)

    def validate_movie_id(self, value):
        try:
            movie = Movie.objects(id=value).first()
        except MongoValidationError as exc:
            raise serializers.ValidationError("Invalid movie id.") from exc
        if not movie:
            raise serializers.ValidationError("Movie not found.")
        return value

    def create(self, validated_data):
        user = self.context["request"].user
        movie = Movie.objects(id=validated_data["movie_id"]).first()
        favorite = Favorite.objects(user=user, movie=movie).first()
        if favorite:
            return favorite
        favorite = Favorite(user=user, movie=movie)
        favorite.save()
        return favorite

    def to_representation(self, instance):
        return {
            "id": str(instance.id),
            "movie": MovieSerializer(instance.movie).data,
            "created_at": instance.created_at,
        }


class ContinueWatchingSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    movie = MovieSerializer(read_only=True)
    progress_seconds = serializers.IntegerField()
    updated_at = serializers.DateTimeField(read_only=True)

    def to_representation(self, instance):
        return {
            "id": str(instance.id),
            "movie": MovieSerializer(instance.movie).data,
            "progress_seconds": instance.progress_seconds,
            "updated_at": instance.updated_at,
        }


class MusicSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField()
    artist = serializers.CharField()
    audio_url = serializers.CharField()
    thumbnail = serializers.CharField()
    category = serializers.CharField()
    duration = serializers.IntegerField()

    def to_representation(self, instance):
        return {
            "id": str(instance.id),
            "title": instance.title,
            "artist": instance.artist,
            "audio_url": instance.audio_url,
            "thumbnail": instance.thumbnail,
            "category": instance.category,
            "duration": instance.duration,
        }


class PlaylistSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField()
    description = serializers.CharField(required=False)
    songs = MusicSerializer(many=True, read_only=True)
    category = serializers.CharField()

    def to_representation(self, instance):
        songs = [MusicSerializer(song).data for song in instance.songs]
        return {
            "id": str(instance.id),
            "name": instance.name,
            "description": instance.description,
            "songs": songs,
            "category": instance.category,
            "song_count": len(songs),
            "cover_image": songs[0]["thumbnail"] if songs else "",
        }
