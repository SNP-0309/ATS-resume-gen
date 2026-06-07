import axios from "axios";

const API_URL = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true,
});
export const registerUser = async ({ email, password, name }) => {
    try {
        const response = await API_URL.post("/register", {
            email,
            password,
            name
        },{ withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const loginUser = async ({ email, password }) => {
    try {
        const response = await API_URL.post("/login", {
            email,
            password
        },{ withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const logoutUser = async () => {
    try {
        await API_URL.post("/logout", {}, { withCredentials: true });
    } catch (error) {
        throw new Error(error.response.data.message);
    }

};
export const getUser = async () => {
    try {
        const response = await API_URL.get("/user", { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};