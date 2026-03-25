import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar({ search, onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/browse" className="font-display text-2xl font-extrabold tracking-[0.2em] text-netflix-red">
            NETFLIX
          </Link>
          <nav className="hidden gap-5 text-sm text-netflix-mist md:flex">
            <a href="#trending" className="transition hover:text-white">
              Trending
            </a>
            <a href="#top-rated" className="transition hover:text-white">
              Top Rated
            </a>
            <Link to="/playlists" className="transition hover:text-white">
              Music
            </Link>
            <a href="#my-list" className="transition hover:text-white">
              My List
            </a>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="hidden w-full max-w-xs items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 md:flex">
            <input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-netflix-mist"
              placeholder="Search titles..."
            />
          </div>
          <div className="hidden text-right text-sm sm:block">
            <p className="font-semibold text-white">{user?.full_name}</p>
            <p className="text-netflix-mist">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-netflix-red/40 bg-netflix-red px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 md:hidden">
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-netflix-mist"
          placeholder="Search titles..."
        />
      </div>
    </header>
  );
}

export default Navbar;
