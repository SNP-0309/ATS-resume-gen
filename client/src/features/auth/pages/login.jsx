import React from 'react'
import "../auth.form.scss"
const login = () => {
  return (
    <div>
    <main>
        
        <form>
            <div className='input-container'>
                <h1>Login</h1>
        <input className='input-field' type="text" placeholder='email' />
        <input className='input-field' type="password" placeholder='password' />
        <button className='btn-primary' type='submit'>Login</button>
        </div>
        </form>
    </main>

    </div>
  )
}

export default login
