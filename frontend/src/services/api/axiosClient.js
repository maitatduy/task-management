import axios from "axios";

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: "/api", // Requires backend server proxy setup in vite.config.js
  withCredentials: true, // IMPORTANT: Allows cookies (like HTTP-Only JWT) to be sent over cross-origin requests or to be stored
});

// Response interceptor for error handling globally
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Optionally handle generic errors like 401 Unauthorized here
    return Promise.reject(error.response?.data?.message || "An error occurred");
  }
);

export default axiosClient;
