function Loader({ fullScreen = false, label = "Loading" }) {
  return (
    <div className={fullScreen ? "flex min-h-screen items-center justify-center" : "flex items-center justify-center py-10"}>
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 shadow-glow backdrop-blur">
        <div className="h-3 w-3 animate-pulse rounded-full bg-netflix-red" />
        <span className="text-sm font-medium text-netflix-mist">{label}</span>
      </div>
    </div>
  );
}

export default Loader;
