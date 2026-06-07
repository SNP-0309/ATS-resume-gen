import {createBrowserRouter} from "react-router";
import Register from "./features/auth/pages/register.jsx";
import Login from "./features/auth/pages/login.jsx";

const Home = () => <div><h1>Welcome</h1><a href="/login">Login</a></div>;



export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
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

