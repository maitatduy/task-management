import apiClient from "./apiClient";

export const taskService = {
  getTasksByBoard: async (boardId) => {
    const response = await apiClient.get(`/tasks/board/${boardId}`);
    return response.data;
  },
  createTask: async (taskData) => {
    const response = await apiClient.post("/tasks", taskData);
    return response.data;
  },
  updateTask: async (taskId, taskData) => {
    const response = await apiClient.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },
  deleteTask: async (taskId) => {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  },
};
