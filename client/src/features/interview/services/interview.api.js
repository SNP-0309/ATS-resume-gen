import axios from "axios";

const API_URL = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/interview`,
  withCredentials: true,
});

// Attach token from localStorage to every request
API_URL.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const generateInterviewReport = async (formData) => {
  try {
    const response = await API_URL.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to generate interview report"
    );
  }
};

export const getInterviewReportById = async (interviewId) => {
  try {
    const response = await API_URL.get(`/${interviewId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch interview report"
    );
  }
};

export const getUserInterviewReports = async () => {
  try {
    const response = await API_URL.get("/");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user interview reports"
    );
  }
};
