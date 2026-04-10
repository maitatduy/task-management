import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus, Loader2, AlertCircle } from "lucide-react";
import { boardService } from "../../../services/boardService";
import { taskService } from "../../../services/taskService";
import TaskColumn from "../../tasks/components/TaskColumn";
import CreateTaskModal from "../../tasks/components/CreateTaskModal";
import Button from "../../../components/ui/Button";

const STATUSES = ["todo", "in-progress", "done"];

const BoardPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data: board,
    isLoading: boardLoading,
    isError: boardError,
  } = useQuery({
    queryKey: ["board", boardId],
    queryFn: () => boardService.getBoardById(boardId),
    enabled: !!boardId,
  });

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    isError: tasksError,
  } = useQuery({
    queryKey: ["tasks", boardId],
    queryFn: () => taskService.getTasksByBoard(boardId),
    enabled: !!boardId,
  });

  const isLoading = boardLoading || tasksLoading;
  const isError = boardError || tasksError;

  const tasksByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {});

  const totalTasks = tasks.length;
  const doneTasks = tasksByStatus["done"]?.length || 0;
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-rose-400">
        <AlertCircle className="w-10 h-10" />
        <p>Không thể tải board này.</p>
        <Button variant="ghost" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4" /> Về Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Board Header */}
      <div className="px-8 py-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              {boardLoading ? (
                <div className="h-7 w-48 bg-slate-800 rounded-lg animate-pulse" />
              ) : (
                <h1 className="text-xl font-bold text-slate-100">{board?.name}</h1>
              )}
              {board?.description && (
                <p className="text-sm text-slate-400 mt-0.5">{board.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress */}
            {!isLoading && totalTasks > 0 && (
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Tiến độ</p>
                  <p className="text-sm font-semibold text-slate-200">{progress}%</p>
                </div>
                <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <Button id="board-add-task-btn" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4" />
              Thêm Task
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="flex items-center justify-center flex-1 gap-3 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm">Đang tải board...</span>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto p-6">
          <div className="flex gap-5 h-full items-start">
            {STATUSES.map((status) => (
              <TaskColumn
                key={status}
                status={status}
                tasks={tasksByStatus[status]}
                boardId={boardId}
              />
            ))}
          </div>
        </div>
      )}

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        boardId={boardId}
      />
    </div>
  );
};

export default BoardPage;
