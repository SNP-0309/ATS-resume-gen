import {createBrowserRouter} from "react-router-dom";
import Register from "./features/auth/pages/register.jsx";
import Login from "./features/auth/pages/login.jsx";
import ProtectedRoute from "./features/auth/components/protected.jsx"





export const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute><h1>home page</h1></ProtectedRoute>
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    }
 
])

