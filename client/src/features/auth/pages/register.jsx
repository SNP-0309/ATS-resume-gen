import React from 'react'
import "../auth.form.scss"

const register = () => {
  return (
    <div>
    <main>
        <form>
            <div className='input-container'>
                <h1>Register</h1>
        <input className='input-field' type="text" placeholder='name' />
        <input className='input-field' type="text" placeholder='email' />
        <input className='input-field' type="password" placeholder='password' />
        <button className='btn-primary' type='submit'>Register</button>
        </div>
        </form>
    </main>

    </div>
  )
}

export default register
