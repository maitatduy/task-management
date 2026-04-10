import asyncHandler from "express-async-handler";
import Board from "../models/Board.js";

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

  // Check for user
  if (board.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  res.status(200).json(board);
});

// @desc    Create a new board
// @route   POST /api/boards
// @access  Private
export const createBoard = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Please add a board name");
  }

  const board = await Board.create({
    name,
    description,
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

  // Check for user ownership
  if (board.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedBoard = await Board.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // Create if doesn't exist
  );

  res.status(200).json(updatedBoard);
});

// @desc    Delete a board
// @route   DELETE /api/boards/:id
// @access  Private
export const deleteBoard = asyncHandler(async (req, res) => {
  const board = await Board.findById(req.params.id);

  if (!board) {
    res.status(404);
    throw new Error("Board not found");
  }

  // Check for user ownership
  if (board.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await board.deleteOne();

  res.status(200).json({ id: req.params.id });
});
