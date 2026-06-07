import {createContext, useState, useEffect} from 'react';
import { getUser } from './services/auth.api.js';

export const AuthContext = createContext();
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await getUser();
                setUser(userData);
            } catch (error) {
                console.log("User not authenticated");
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    return (    
        <AuthContext.Provider value={{user, setUser, isLoading, setIsLoading}}>
            {children}
        </AuthContext.Provider>
    );
}