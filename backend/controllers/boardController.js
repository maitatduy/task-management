import asyncHandler from "express-async-handler";
import Board from "../models/Board.js";
import Task from "../models/Task.js";

// @desc    Get all boards for user
// @route   GET /api/boards
// @access  Private
export const getBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(boards);
});

// @desc    Get a single board
// @route   GET /api/boards/:id
// @access  Private
export const getBoardById = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  if (board.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to access this board");
  }

  res.status(200).json(board);
});

// @desc    Create a new board
// @route   POST /api/boards
// @access  Private
export const createBoard = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error("Please add a board name");
  }

  if (name.trim().length > 100) {
    res.status(400);
    throw new Error("Board name cannot exceed 100 characters");
  }

  const board = await Board.create({
    name: name.trim(),
    description: description?.trim(),
    user: req.user.id,
  });

  res.status(201).json(board);
});

// @desc    Update a board
// @route   PUT /api/boards/:id
// @access  Private
export const updateBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  if (board.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to update this board");
  }

  const { name, description } = req.body;

  if (name !== undefined && !name.trim()) {
    res.status(400);
    throw new Error("Board name cannot be empty");
  }

  const updatedBoard = await Board.findByIdAndUpdate(
    req.params.id,
    {
      ...(name && { name: name.trim() }),
      ...(description !== undefined && { description: description.trim() }),
    },
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedBoard);
});

// @desc    Delete a board (cascade deletes all its tasks)
// @route   DELETE /api/boards/:id
// @access  Private
export const deleteBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  if (board.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Not authorized to delete this board");
  }

  // Cascade delete: remove all tasks belonging to this board
  await Task.deleteMany({ board: board._id });

  await board.deleteOne();

  res.status(200).json({ id: req.params.id, message: "Board and all its tasks deleted" });
});
