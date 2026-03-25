import { useMemo } from "react";

function AudioVisualizer({ isPlaying, compact = false, className = "" }) {
  const bars = useMemo(() => Array.from({ length: compact ? 12 : 24 }, (_, index) => index), [compact]);

  return (
    <div className={`flex items-end gap-1 ${className}`}>
      {bars.map((bar) => (
        <span
          key={bar}
          className={`music-visualizer__bar ${isPlaying ? "music-visualizer__bar--active" : ""}`}
          style={{
            height: compact ? `${10 + (bar % 4) * 4}px` : `${18 + (bar % 6) * 10}px`,
            animationDelay: `${bar * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

export default AudioVisualizer;
