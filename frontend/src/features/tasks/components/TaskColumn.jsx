import React, { useState } from "react";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModal";

const COLUMN_CONFIG = {
  todo: {
    label: "Chưa bắt đầu",
    accentColor: "bg-slate-400",
    borderColor: "border-slate-600/50",
    headerBg: "bg-slate-700/40",
    dotColor: "bg-slate-400",
  },
  "in-progress": {
    label: "Đang thực hiện",
    accentColor: "bg-indigo-500",
    borderColor: "border-indigo-600/30",
    headerBg: "bg-indigo-600/10",
    dotColor: "bg-indigo-500",
  },
  done: {
    label: "Hoàn thành",
    accentColor: "bg-emerald-500",
    borderColor: "border-emerald-600/30",
    headerBg: "bg-emerald-600/10",
    dotColor: "bg-emerald-500",
  },
};

const TaskColumn = ({ status, tasks, boardId }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const config = COLUMN_CONFIG[status] || COLUMN_CONFIG.todo;

  return (
    <>
      <div className={`flex flex-col w-72 shrink-0 bg-slate-900/60 border ${config.borderColor} rounded-2xl overflow-hidden`}>
        {/* Column Header */}
        <div className={`flex items-center justify-between px-4 py-3 ${config.headerBg}`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
            <span className="text-sm font-semibold text-slate-200">
              {config.label}
            </span>
            <span className="text-xs text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded-md font-mono">
              {tasks.length}
            </span>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-100 hover:bg-slate-700/60 transition-colors"
            title="Thêm task"
            aria-label={`Thêm task vào ${config.label}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[120px] max-h-[calc(100vh-220px)]">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-600 text-sm">
              <span>Chưa có task nào</span>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task._id} task={task} boardId={boardId} />
            ))
          )}
        </div>

        {/* Add Task Button Footer */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors border-t border-slate-800"
        >
          <Plus className="w-4 h-4" />
          Thêm task
        </button>
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        boardId={boardId}
        defaultStatus={status}
      />
    </>
  );
};

export default TaskColumn;
