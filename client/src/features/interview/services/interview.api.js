import axios from "axios";

const API_URL = axios.create({
  baseURL: "http://localhost:3000/api/interview",
  withCredentials: true,
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
