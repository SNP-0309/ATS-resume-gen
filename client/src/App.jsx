import React from 'react'
import { RouterProvider } from 'react-router';
import { router } from './app.routes.jsx';

const App = () => {
  return (
    <div>
      <h1>ATS Resume Generator</h1>
      <RouterProvider router={router} />  

    </div>
  )
}

export default App
