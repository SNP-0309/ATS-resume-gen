import { createBrowserRouter } from "react-router-dom";

import Register from "./features/auth/pages/register.jsx";
import Login from "./features/auth/pages/login.jsx";
import ProtectedRoute from "./features/auth/components/protected.jsx";
import Home from "./features/interview/pages/home.jsx";
import Interview from "./features/interview/pages/interview.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/interview/:interviewId",
    element: (
      <ProtectedRoute>
        <Interview />
      </ProtectedRoute>
    ),
  },
]);