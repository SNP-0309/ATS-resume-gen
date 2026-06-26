import React, { useState } from "react";
import "../auth.form.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useauth.js";

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const success = await handleRegister({ name, email, password });
      if (success) {
        navigate("/");
      } else {
        setError("Registration failed. Email may already be in use.");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
            <h2 className="header">Create account</h2>

            {error && <div className="error-msg">{error}</div>}

            <div className="input-group">
              <label className="input-label" htmlFor="name">Full Name</label>
              <input
                id="name"
                className="input-field"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

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
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link className="btn-link" to="/login">
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Register;