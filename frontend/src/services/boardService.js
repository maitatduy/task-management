import apiClient from "./apiClient";

export const boardService = {
  getBoards: async () => {
    const response = await apiClient.get("/boards");
    return response.data;
  },
  getBoardById: async (boardId) => {
    const response = await apiClient.get(`/boards/${boardId}`);
    return response.data;
  },
  createBoard: async (boardData) => {
    const response = await apiClient.post("/boards", boardData);
    return response.data;
  },
  updateBoard: async (boardId, boardData) => {
    const response = await apiClient.put(`/boards/${boardId}`, boardData);
    return response.data;
  },
  deleteBoard: async (boardId) => {
    const response = await apiClient.delete(`/boards/${boardId}`);
    return response.data;
  },
};
