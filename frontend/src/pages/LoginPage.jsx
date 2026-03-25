import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { getApiErrorMessage } from "../utils/apiError";

const initialForm = { email: "", password: "" };

function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    if (!form.email.trim() || !form.password.trim()) {
      setError("Enter both your email and password.");
      setSubmitting(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      navigate(location.state?.from?.pathname || "/browse", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to log in right now."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-black/45 shadow-2xl backdrop-blur-2xl lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden min-h-[680px] flex-col justify-between bg-[linear-gradient(160deg,rgba(229,9,20,0.85),rgba(56,8,10,0.65)),url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center p-12 lg:flex">
          <div>
            <p className="font-display text-3xl font-extrabold tracking-[0.2em] text-white">NETFLIX</p>
          </div>
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
              Unlimited movies, shows and more
            </span>
            <h1 className="font-display text-5xl font-extrabold leading-tight">Your next binge starts here.</h1>
            <p className="max-w-md text-white/80">
              Sign in to explore curated rows, save favorites, and jump into a seamless streaming-style experience.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-3">
              <p className="font-display text-3xl font-bold text-white">Sign In</p>
              <p className="text-sm text-netflix-mist">Use your account to continue watching.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-netflix-red"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-netflix-red"
                required
              />
              {error ? <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p> : null}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-netflix-red px-4 py-4 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-sm text-netflix-mist">
              New to Netflix?{" "}
              <Link to="/signup" className="font-semibold text-white hover:text-netflix-red">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
