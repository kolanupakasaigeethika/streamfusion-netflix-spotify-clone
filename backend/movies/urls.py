from django.urls import path

from .views import (
    ContinueWatchingUpsertView,
    DashboardStatsView,
    FavoriteDeleteView,
    FavoriteListCreateView,
    LoginView,
    LogoutView,
    MovieDetailView,
    MovieListView,
    MusicDetailView,
    MusicListView,
    PlaylistListView,
    ProfileView,
    RefreshCookieView,
    RegisterView,
)

urlpatterns = [
    path("auth/register", RegisterView.as_view(), name="register"),
    path("auth/login", LoginView.as_view(), name="login"),
    path("auth/refresh", RefreshCookieView.as_view(), name="refresh"),
    path("auth/logout", LogoutView.as_view(), name="logout"),
    path("auth/profile", ProfileView.as_view(), name="profile"),
    path("movies", MovieListView.as_view(), name="movie-list"),
    path("movies/<str:movie_id>", MovieDetailView.as_view(), name="movie-detail"),
    path("favorites", FavoriteListCreateView.as_view(), name="favorites"),
    path("favorites/<str:movie_id>", FavoriteDeleteView.as_view(), name="favorite-delete"),
    path("continue-watching", ContinueWatchingUpsertView.as_view(), name="continue-watching"),
    path("dashboard", DashboardStatsView.as_view(), name="dashboard"),
    path("music", MusicListView.as_view(), name="music-list"),
    path("music/<str:music_id>", MusicDetailView.as_view(), name="music-detail"),
    path("playlists", PlaylistListView.as_view(), name="playlist-list"),
]
