import { useAuth } from "../hooks/useauth";
import { useNavigate } from "react-router-dom";

import React, { Children } from 'react'

const ProtectedRoute = ({ children }) => {
    const {loading, user} = useAuth();
    const navigate =  useNavigate();

    if(loading){
        return (<main><h1>Loading.......</h1></main>)
    }
    if(!user){
         navigate("/login")
    }
    return children
}

export default ProtectedRoute
