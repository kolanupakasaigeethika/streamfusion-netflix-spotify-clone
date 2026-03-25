import { Navigate, Route, Routes } from "react-router-dom";

import MusicPlayer from "./components/MusicPlayer";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { MusicProvider } from "./context/MusicContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import PlaylistPage from "./pages/PlaylistPage";
import SignupPage from "./pages/SignupPage";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <MusicProvider>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/browse" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:movieId"
          element={
            <ProtectedRoute>
              <MovieDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <PlaylistPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <MusicPlayer />
    </MusicProvider>
  );
}

export default App;
