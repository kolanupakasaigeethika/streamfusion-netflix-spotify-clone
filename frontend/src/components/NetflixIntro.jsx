import { useEffect } from "react";

function NetflixIntro({ onComplete, duration = 2500, fullscreen = false }) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => window.clearTimeout(timeoutId);
  }, [duration, onComplete]);

  return (
    <div
      className={`netflix-intro ${fullscreen ? "fixed inset-0 z-[100]" : "absolute inset-0 z-20"} flex items-center justify-center overflow-hidden bg-black`}
    >
      <div className="netflix-intro__backdrop" />
      <div className="netflix-intro__beam netflix-intro__beam--left" />
      <div className="netflix-intro__beam netflix-intro__beam--right" />

      <div className="netflix-intro__logo-wrap">
        <div className="netflix-intro__glow" />
        <div className="netflix-intro__logo" aria-label="Netflix intro logo">
          <span className="netflix-intro__bar netflix-intro__bar--left" />
          <span className="netflix-intro__bar netflix-intro__bar--middle" />
          <span className="netflix-intro__bar netflix-intro__bar--right" />
        </div>
      </div>
    </div>
  );
}

export default NetflixIntro;
