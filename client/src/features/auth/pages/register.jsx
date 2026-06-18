import React from 'react'
import "../auth.form.scss"
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useauth.js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const navigate = useNavigate();
  const { handleRegister, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  const handleSubmit =async (e) => {
    e.preventDefault();
     await handleRegister({name, email, password});
    useNavigate("/")
  }
  if (isLoading) {
    return <p>Loading...</p>
  }
  return (
    <div>
    <main>
        <form onSubmit={handleSubmit}>
            <div className='input-container'>
                  <h1 className="header">Register</h1>
               <h1 className="input-label">Name</h1>
        <input className='input-field' type="text" placeholder='name' value={name} onChange={(e) => setName(e.target.value)} />
        <h1 className="input-label">Email</h1>
        <input className='input-field' type="text" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <h1 className="input-label">Password</h1>
        <input className='input-field' type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className='btn-primary' onClick={handleSubmit} type='submit'>Register</button>
        </div>
        </form>
        <p>Already have an account? <Link className='btn-link' to="/login">Login</Link></p>
    </main>

    </div>
  )
}

export default Register
