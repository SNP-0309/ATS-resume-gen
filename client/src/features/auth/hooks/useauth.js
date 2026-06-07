import { AuthContext } from "../auth.context.jsx";
import { useContext } from "react";
import { loginUser, registerUser, logoutUser, getUser } from '../services/auth.api.js';


export const useAuth = () => {
    const {user, setUser, isLoading, setIsLoading} = useContext(AuthContext);

 const handleLogin = async ({email, password}) => {
    setIsLoading(true);
    try {
        const userData = await loginUser({email, password});
        setUser(userData);
    }
    catch (error) {
        console.error("Login failed:", error);
    }
    finally {
        setIsLoading(false);
    }
};
    const handleRegister = async ({email, password, name}) => {
        setIsLoading(true);
        try {
            const userData = await registerUser({email, password, name});
            setUser(userData);
        }
        catch (error) {
            console.error("Registration failed:", error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logoutUser();
            setUser(null);
        }
        catch (error) {
            console.error("Logout failed:", error);
        }
        finally {
            setIsLoading(false);
        }
    };

    return {user, setUser, isLoading, setIsLoading, handleLogin, handleRegister, handleLogout};
}
