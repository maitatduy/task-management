import express from "express";
import {
  getTasksByBoard,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createTask);
router.route("/board/:boardId").get(protect, getTasksByBoard);
router
  .route("/:id")
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;
