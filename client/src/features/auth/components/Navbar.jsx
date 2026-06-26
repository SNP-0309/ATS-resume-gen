import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useauth.js'
import './navbar.scss'

const Navbar = () => {
    const { user, handleLogout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const onLogout = async () => {
        await handleLogout()
        navigate('/login')
    }

    return (
        <nav className='navbar'>
            {/* Brand */}
            <Link to='/' className='navbar__brand'>
                <span className='brand-icon'>⚡</span>
                <span className='brand-name'>InterviewAI</span>
            </Link>

            {/* Center nav */}
            <div className='navbar__nav'>
                <Link
                    to='/'
                    className={location.pathname === '/' ? 'active' : ''}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    New Report
                </Link>
                <Link
                    to='/reports'
                    className={location.pathname === '/reports' ? 'active' : ''}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                    </svg>
                    My Reports
                </Link>
            </div>

            {/* Right: user + logout */}
            <div className='navbar__right'>
                {user && (
                    <span className='user-name'>{user.name || user.email}</span>
                )}
                <button className='logout-btn' onClick={onLogout}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Navbar
