import React from 'react'
import "../auth.form.scss"
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useauth.js';
import { useState } from 'react';
const Login = () => {
  const navigate = useNavigate();
  
  const { handleLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit =async (e) => {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate("/");
  }
  if (isLoading) {
    return <p>Loading...</p>
  }
  return (
    <div>
    <main>
        
        <form onSubmit={handleSubmit}>
            <div className='input-container'>
                  <h1 className="header">Login</h1>
       <h1 className="input-label">Email</h1>
        <input className='input-field' type="text" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
    <h1 className="input-label">Password</h1>
        <input className='input-field' type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className='btn-primary' type='submit'>Login</button>
        </div>
        </form>
        <p>Don't have an account? <Link className='btn-link' to="/register">Register</Link></p>
    </main>

    </div>
  )
}

export default Login
