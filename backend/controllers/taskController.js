import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Task from "../models/Task.js";
import Board from "../models/Board.js";

// @desc    Get all tasks for a specific board
// @route   GET /api/tasks/board/:boardId
// @access  Private
export const getTasksByBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    res.status(400);
    throw new Error("Invalid board ID");
  }

  // Ensure the board belongs to the user
  const board = await Board.findById(boardId);
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }
  if (board.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to access this board");
  }

  const tasks = await Task.find({ board: boardId }).sort({ createdAt: 1 });
  res.status(200).json(tasks);
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, boardId } = req.body;

  if (!title || !title.trim()) {
    res.status(400);
    throw new Error("Please provide a task title");
  }

  if (!boardId) {
    res.status(400);
    throw new Error("Please provide a boardId");
  }

  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    res.status(400);
    throw new Error("Invalid board ID");
  }

  // Ensure board belongs to user before creating task inside it
  const board = await Board.findById(boardId);
  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }
  if (board.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to add tasks to this board");
  }

  // Auto-calculate position (append to end of the column)
  const lastTask = await Task.findOne({ board: boardId, status: status || "todo" })
    .sort({ position: -1 })
    .select("position");
  const position = lastTask ? lastTask.position + 1 : 0;

  const task = await Task.create({
    title: title.trim(),
    description: description?.trim(),
    status: status || "todo",
    priority: priority || "medium",
    position,
    board: boardId,
    user: req.user.id,
  });

  res.status(201).json(task);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid task ID");
  }

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to update this task");
  }

  // Sanitize allowed fields only (prevent mass-assignment)
  const { title, description, status, priority, position } = req.body;
  const updates = {};
  if (title !== undefined) updates.title = title.trim();
  if (description !== undefined) updates.description = description.trim();
  if (status !== undefined) updates.status = status;
  if (priority !== undefined) updates.priority = priority;
  if (position !== undefined) updates.position = position;

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedTask);
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid task ID");
  }

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to delete this task");
  }

  await task.deleteOne();

  res.status(200).json({ id: req.params.id });
});
