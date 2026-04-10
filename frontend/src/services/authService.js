import apiClient from "./apiClient";

export const authService = {
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },
  login: async (userData) => {
    const response = await apiClient.post("/auth/login", userData);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};

