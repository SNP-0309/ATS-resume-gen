import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context.jsx";
import {
  loginUser,
  registerUser,
  logoutUser,
  getUser,
} from "../services/auth.api.js";


export const useAuth = () => {
  const { user, setUser, isLoading, setIsLoading } =
    useContext(AuthContext);

  const handleLogin = async ({ email, password }) => {
    setIsLoading(true);

    try {
      const userData = await loginUser({ email, password });
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async ({ name, email, password }) => {
    setIsLoading(true);

    try {
      const userData = await registerUser({
        name,
        email,
        password,
      });

      setUser(userData);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getUser();
        setUser(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getAndSetUser();
  }, []);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};