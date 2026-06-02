import {createBrowserRouter} from "react-router";
import Register from "./features/auth/pages/register.jsx";
import Login from "./features/auth/pages/login.jsx";





export const router = createBrowserRouter([
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    }
])

