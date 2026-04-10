import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, LayoutGrid, Loader2, FolderOpen } from "lucide-react";
import { boardService } from "../../../services/boardService";
import { useAuthStore } from "../../../store/authStore";
import BoardCard from "../components/BoardCard";
import CreateBoardModal from "../components/CreateBoardModal";
import Button from "../../../components/ui/Button";

const DashboardPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const { data: boards = [], isLoading, isError } = useQuery({
    queryKey: ["boards"],
    queryFn: boardService.getBoards,
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-sm text-indigo-400 font-medium mb-1">{greeting()}, {user?.name} 👋</p>
          <h1 className="text-3xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Quản lý tất cả các board dự án của bạn
          </p>
        </div>
        <Button
          id="create-board-btn"
          onClick={() => setIsCreateModalOpen(true)}
          className="shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tạo Board mới
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <div className="glass-card p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Tổng Boards</p>
          <p className="text-3xl font-bold text-slate-100">{boards.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Đang hoạt động</p>
          <p className="text-3xl font-bold text-indigo-400">{boards.length}</p>
        </div>
        <div className="glass-card p-4 col-span-2 sm:col-span-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Tháng này</p>
          <p className="text-3xl font-bold text-violet-400">
            {boards.filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth()).length}
          </p>
        </div>
      </div>

      {/* Board Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm">Đang tải danh sách board...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-rose-400">
          <p className="text-sm">Không thể tải dữ liệu. Vui lòng thử lại.</p>
        </div>
      ) : boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="font-medium text-slate-300">Chưa có board nào</p>
            <p className="text-sm mt-1">Hãy tạo board đầu tiên để bắt đầu!</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Tạo Board đầu tiên
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-5">
            <LayoutGrid className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Boards của bạn ({boards.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {boards.map((board, index) => (
              <BoardCard key={board._id} board={board} colorIndex={index} />
            ))}
            {/* Quick create card */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="glass-card p-5 border-dashed border-slate-600 flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200 min-h-[160px]"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Thêm Board</span>
            </button>
          </div>
        </>
      )}

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
