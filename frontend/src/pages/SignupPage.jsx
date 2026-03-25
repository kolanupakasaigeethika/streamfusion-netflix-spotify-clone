import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { getApiErrorMessage } from "../utils/apiError";

const initialForm = { full_name: "", email: "", password: "" };

function SignupPage() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    if (!form.full_name.trim()) {
      setError("Enter your full name.");
      setSubmitting(false);
      return;
    }

    if (!form.email.trim()) {
      setError("Enter your email address.");
      setSubmitting(false);
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      setSubmitting(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/register", form);
      login(data);
      navigate("/browse", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to create your account."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-black/55 p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
        <div className="mb-8 space-y-3 text-center">
          <p className="font-display text-2xl font-extrabold tracking-[0.2em] text-netflix-red">NETFLIX</p>
          <h1 className="font-display text-4xl font-bold text-white">Create your account</h1>
          <p className="text-sm text-netflix-mist">Join to save favorites, search titles, and watch instantly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Full name"
            autoComplete="name"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-netflix-red"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            autoComplete="email"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-netflix-red"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="new-password"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-netflix-red"
            required
          />

          {error ? <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-netflix-red px-4 py-4 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-netflix-mist">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-white hover:text-netflix-red">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default SignupPage;
