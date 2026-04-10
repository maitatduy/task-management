import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Flag, MoreVertical, Edit2, Check } from "lucide-react";
import { taskService } from "../../../services/taskService";

const PRIORITY_CONFIG = {
  low: { label: "Thấp", className: "text-emerald-400 bg-emerald-400/10 border-emerald-500/30" },
  medium: { label: "TB", className: "text-amber-400 bg-amber-400/10 border-amber-500/30" },
  high: { label: "Cao", className: "text-rose-400 bg-rose-400/10 border-rose-500/30" },
};

const TaskCard = ({ task, boardId }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const deleteMutation = useMutation({
    mutationFn: () => taskService.deleteTask(task._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => taskService.updateTask(task._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId] });
      setIsEditing(false);
    },
  });

  const handleDelete = () => {
    if (window.confirm(`Xóa task "${task.title}"?`)) {
      deleteMutation.mutate();
    }
  };

  const handleTitleSave = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      updateMutation.mutate({ title: editTitle });
    } else {
      setIsEditing(false);
    }
  };

  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  return (
    <div className="p-3.5 bg-slate-800/80 border border-slate-700/60 rounded-xl hover:border-slate-600 transition-all duration-200 group animate-fade-in">
      {/* Title */}
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleSave();
              if (e.key === "Escape") setIsEditing(false);
            }}
            autoFocus
            className="input-base text-sm py-1.5 flex-1"
          />
          <button
            onClick={handleTitleSave}
            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-400/10 transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <p className="text-sm font-medium text-slate-200 leading-snug pr-6">
          {task.title}
        </p>
      )}

      {/* Description */}
      {task.description && !isEditing && (
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        {/* Priority badge */}
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${priority.className}`}>
          <Flag className="w-2.5 h-2.5" />
          {priority.label}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 transition-colors"
            aria-label="Chỉnh sửa"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
            aria-label="Xóa"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
