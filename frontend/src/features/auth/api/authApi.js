import axiosClient from "../../../services/api/axiosClient.js";

export const loginFn = async (credentials) => {
  return await axiosClient.post("/auth/login", credentials);
};

export const registerFn = async (userInfo) => {
  return await axiosClient.post("/auth/register", userInfo);
};

export const logoutFn = async () => {
  return await axiosClient.post("/auth/logout");
};
