import asyncHandler from "express-async-handler";
import Task from "../models/Task.js";
import Board from "../models/Board.js";

// @desc    Get all tasks for a specific board
// @route   GET /api/tasks/board/:boardId
// @access  Private
export const getTasksByBoard = asyncHandler(async (req, res) => {
  const boardId = req.params.boardId;

  // Ensure the board belongs to the user
  const board = await Board.findById(boardId);
  if (!board || board.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error("Board not found or you don't have access");
  }

  const tasks = await Task.find({ board: boardId }).sort({ position: 1 });
  res.status(200).json(tasks);
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, position, boardId } = req.body;

  if (!title || !boardId) {
    res.status(400);
    throw new Error("Please provide title and boardId");
  }

  // Ensure board belongs to user before creating task inside it
  const board = await Board.findById(boardId);
  if (!board || board.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error("Board not found or you don't have access");
  }

  const task = await Task.create({
    title,
    description,
    status,
    priority,
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
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check user authorization
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedTask);
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check user authorization
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await task.deleteOne();

  res.status(200).json({ id: req.params.id });
});
