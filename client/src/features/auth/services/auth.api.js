import axios from "axios";

const API_URL = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth`,
  withCredentials: true,
});

export const registerUser = async ({ name, email, password }) => {
  try {
    const response = await API_URL.post("/register", {
      name,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Registration failed"
    );
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const response = await API_URL.post("/login", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Login failed"
    );
  }
};

export const logoutUser = async () => {
  try {
    const response = await API_URL.post("/logout");

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Logout failed"
    );
  }
};

export const getUser = async () => {
  try {
    const response = await API_URL.get("/user");

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user"
    );
  }
};