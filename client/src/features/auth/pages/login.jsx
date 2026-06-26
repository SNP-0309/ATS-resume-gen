import React, { useState } from "react";
import "../auth.form.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useauth.js";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const success = await handleLogin({ email, password });
      if (success) {
        navigate("/");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="auth-container">
        <main>
          <div className="input-container">
            <p style={{ color: "#aaa", textAlign: "center" }}>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <main>
        <div className="brand">
          <span className="brand-icon">⚡</span>
          <h1>InterviewAI</h1>
          <p>Your AI-powered interview preparation engine</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <h2 className="header">Welcome back</h2>

            {error && <div className="error-msg">{error}</div>}

            <div className="input-group">
              <label className="input-label" htmlFor="email">Email</label>
              <input
                id="email"
                className="input-field"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link className="btn-link" to="/register">
            Create one
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Login;