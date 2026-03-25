from datetime import datetime

from django.conf import settings
from django.contrib.auth.hashers import check_password
from rest_framework import generics, permissions, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .models import ContinueWatching, Favorite, Movie, Music, Playlist, User
from .serializers import (
    ContinueWatchingSerializer,
    FavoriteSerializer,
    LoginSerializer,
    MovieSerializer,
    MusicSerializer,
    PlaylistSerializer,
    RegisterSerializer,
    UserSerializer,
)


def build_tokens_for_user(user):
    refresh = RefreshToken()
    refresh["user_id"] = str(user.id)
    refresh["email"] = user.email

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


def set_auth_cookies(response, tokens):
    access_lifetime = int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds())
    refresh_lifetime = int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())

    response.set_cookie(
        settings.JWT_ACCESS_COOKIE_NAME,
        tokens["access"],
        max_age=access_lifetime,
        httponly=True,
        secure=settings.JWT_COOKIE_SECURE,
        samesite=settings.JWT_COOKIE_SAMESITE,
        domain=settings.JWT_COOKIE_DOMAIN,
        path="/",
    )
    response.set_cookie(
        settings.JWT_REFRESH_COOKIE_NAME,
        tokens["refresh"],
        max_age=refresh_lifetime,
        httponly=True,
        secure=settings.JWT_COOKIE_SECURE,
        samesite=settings.JWT_COOKIE_SAMESITE,
        domain=settings.JWT_COOKIE_DOMAIN,
        path="/api/auth/",
    )
    return response


def clear_auth_cookies(response):
    response.delete_cookie(
        settings.JWT_ACCESS_COOKIE_NAME,
        domain=settings.JWT_COOKIE_DOMAIN,
        path="/",
        samesite=settings.JWT_COOKIE_SAMESITE,
    )
    response.delete_cookie(
        settings.JWT_REFRESH_COOKIE_NAME,
        domain=settings.JWT_COOKIE_DOMAIN,
        path="/api/auth/",
        samesite=settings.JWT_COOKIE_SAMESITE,
    )
    return response


class MongoPagination(PageNumberPagination):
    page_size_query_param = "page_size"
    max_page_size = 24

    def paginate_queryset(self, queryset, request, view=None):
        self.count = queryset.count()
        self.page_size = self.get_page_size(request) or self.page_size
        self.page_number = self.get_page_number(request, None)
        self.request = request

        try:
            page_number = int(self.page_number)
        except (TypeError, ValueError):
            page_number = 1

        start = (page_number - 1) * self.page_size
        end = start + self.page_size
        self.current_page = page_number
        self.page = list(queryset.skip(start).limit(end - start))
        return self.page

    def get_paginated_response(self, data):
        has_next = (self.current_page * self.page_size) < self.count
        has_previous = self.current_page > 1
        return Response(
            {
                "count": self.count,
                "next": self.current_page + 1 if has_next else None,
                "previous": self.current_page - 1 if has_previous else None,
                "page": self.current_page,
                "page_size": self.page_size,
                "results": data,
            }
        )


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "detail": "Please check your registration details.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = serializer.save()
        tokens = build_tokens_for_user(user)
        response = Response(
            {
                "message": "User registered successfully.",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )
        return set_auth_cookies(response, tokens)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "detail": "Email and password are required.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"].lower()
        password = serializer.validated_data["password"]

        user = User.objects(email=email).first()
        if not user or not check_password(password, user.password):
            return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        tokens = build_tokens_for_user(user)
        response = Response(
            {
                "message": "Login successful.",
                "user": UserSerializer(user).data,
            }
        )
        return set_auth_cookies(response, tokens)


class RefreshCookieView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        raw_refresh = request.COOKIES.get(settings.JWT_REFRESH_COOKIE_NAME)
        if not raw_refresh:
            return Response({"detail": "Refresh session not found."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(raw_refresh)
        except (InvalidToken, TokenError):
            response = Response({"detail": "Refresh token is invalid or expired."}, status=status.HTTP_401_UNAUTHORIZED)
            return clear_auth_cookies(response)

        user_id = refresh.get("user_id")
        user = User.objects(id=user_id).first()
        if not user:
            response = Response({"detail": "User not found."}, status=status.HTTP_401_UNAUTHORIZED)
            return clear_auth_cookies(response)

        tokens = build_tokens_for_user(user)
        response = Response(
            {
                "message": "Session refreshed.",
                "user": UserSerializer(user).data,
            }
        )
        return set_auth_cookies(response, tokens)


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        response = Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
        return clear_auth_cookies(response)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class MovieListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MovieSerializer
    pagination_class = MongoPagination

    def get_queryset(self):
        queryset = Movie.objects
        search = self.request.query_params.get("search")
        category = self.request.query_params.get("category")

        if search:
            queryset = queryset.filter(title__icontains=search)
        if category:
            queryset = queryset.filter(category=category)

        return queryset.order_by("-rating", "-created_at")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)

        categories = Movie.objects.distinct("category")
        featured = Movie.objects.order_by("-rating").first()
        continue_watching = ContinueWatching.objects(user=request.user).order_by("-updated_at")[:12]

        base_response = self.get_paginated_response(serializer.data).data
        base_response["categories"] = categories
        base_response["featured"] = MovieSerializer(featured).data if featured else None
        base_response["rows"] = {
            category_name: MovieSerializer(Movie.objects(category=category_name).order_by("-rating")[:24], many=True).data
            for category_name in categories
        }
        base_response["continue_watching"] = ContinueWatchingSerializer(continue_watching, many=True).data
        return Response(base_response)


class MovieDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, movie_id):
        movie = Movie.objects(id=movie_id).first()
        if not movie:
            return Response({"detail": "Movie not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(MovieSerializer(movie).data)


class FavoriteListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        favorites = Favorite.objects(user=request.user).order_by("-created_at")
        return Response(FavoriteSerializer(favorites, many=True).data)

    def post(self, request):
        serializer = FavoriteSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        favorite = serializer.save()
        return Response(FavoriteSerializer(favorite).data, status=status.HTTP_201_CREATED)


class FavoriteDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, movie_id):
        movie = Movie.objects(id=movie_id).first()
        if not movie:
            return Response({"detail": "Movie not found."}, status=status.HTTP_404_NOT_FOUND)

        favorite = Favorite.objects(user=request.user, movie=movie).first()
        if not favorite:
            return Response({"detail": "Favorite not found."}, status=status.HTTP_404_NOT_FOUND)
        favorite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ContinueWatchingUpsertView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        movie_id = request.data.get("movie_id")
        progress_seconds = int(request.data.get("progress_seconds", 0))

        if not movie_id:
            return Response({"detail": "movie_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        movie = Movie.objects(id=movie_id).first()
        if not movie:
            return Response({"detail": "Movie not found."}, status=status.HTTP_404_NOT_FOUND)

        entry = ContinueWatching.objects(user=request.user, movie=movie).first()
        if not entry:
            entry = ContinueWatching(user=request.user, movie=movie)
        entry.progress_seconds = progress_seconds
        entry.updated_at = datetime.utcnow()
        entry.save()

        return Response(ContinueWatchingSerializer(entry).data)


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "total_movies": Movie.objects.count(),
                "favorite_count": Favorite.objects(user=request.user).count(),
                "categories": Movie.objects.distinct("category"),
            }
        )


class MusicListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        category = request.query_params.get("category")
        if category:
            music = Music.objects(category__iexact=category)
        else:
            music = Music.objects
        music = music.order_by("category", "title")
        return Response(MusicSerializer(music, many=True).data)


class MusicDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, music_id):
        music = Music.objects(id=music_id).first()
        if not music:
            return Response({"detail": "Music not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(MusicSerializer(music).data)


class PlaylistListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        category = request.query_params.get("category")
        if category:
            playlists = Playlist.objects(category__iexact=category)
        else:
            playlists = Playlist.objects
        playlists = playlists.order_by("category", "name")
        return Response(PlaylistSerializer(playlists, many=True).data)
