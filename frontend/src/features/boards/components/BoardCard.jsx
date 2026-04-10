import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Trash2, ArrowRight } from "lucide-react";
import { boardService } from "../../../services/boardService";

const BOARD_COLORS = [
  "from-indigo-600 to-violet-600",
  "from-sky-600 to-cyan-500",
  "from-emerald-600 to-teal-500",
  "from-rose-600 to-pink-500",
  "from-amber-500 to-orange-500",
];

const BoardCard = ({ board, colorIndex }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => boardService.deleteBoard(board._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc muốn xóa board "${board.name}"?`)) {
      deleteMutation.mutate();
    }
  };

  const gradient = BOARD_COLORS[colorIndex % BOARD_COLORS.length];

  return (
    <div
      onClick={() => navigate(`/b/${board._id}`)}
      className="glass-card p-5 cursor-pointer hover:border-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden"
    >
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />

      <div className="flex items-start justify-between gap-4">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg`}>
          <span className="text-white text-lg font-bold">
            {board.name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
          aria-label="Xóa board"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-slate-100 truncate text-base">
          {board.name}
        </h3>
        {board.description && (
          <p className="mt-1 text-sm text-slate-400 line-clamp-2">
            {board.description}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {new Date(board.createdAt).toLocaleDateString("vi-VN")}
        </span>
        <span className="text-xs text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
          Mở <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};

export default BoardCard;
