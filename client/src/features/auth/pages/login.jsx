import React, { useState } from "react";
import "../auth.form.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useauth.js";

const Login = () => {
  const navigate = useNavigate();

  const { handleLogin, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = await handleLogin({
        email,
        password,
      });

      if (success) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="auth-container">
      <main>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <h1 className="header">Login</h1>

            <h1 className="input-label">Email</h1>
            <input
              className="input-field"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <h1 className="input-label">Password</h1>
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn-primary" type="submit">
              Login
            </button>
          </div>
        </form>

        <p>
          Don't have an account?{" "}
          <Link className="btn-link" to="/register">
            Register
          </Link>
        </p>
      </main>
    </div>
  );
};

export default Login;