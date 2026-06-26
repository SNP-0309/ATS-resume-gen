import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

import Register from "./features/auth/pages/register.jsx";
import Login from "./features/auth/pages/login.jsx";
import ProtectedRoute from "./features/auth/components/protected.jsx";
import Navbar from "./features/auth/components/Navbar.jsx";
import Home from "./features/interview/pages/home.jsx";
import Interview from "./features/interview/pages/interview.jsx";
import Reports from "./features/interview/pages/reports.jsx";

// Layout that wraps authenticated pages with the Navbar
const AuthLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

export const router = createBrowserRouter([
  // Public routes (no navbar)
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  // Protected routes (with navbar)
  {
    element: (
      <ProtectedRoute>
        <AuthLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/interview/:interviewId",
        element: <Interview />,
      },
    ],
  },
]);