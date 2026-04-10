import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  User,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/authService";
import { boardService } from "../../services/boardService";
import CreateBoardModal from "../../features/boards/components/CreateBoardModal";

const Sidebar = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, clearAuth } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: boards = [] } = useQuery({
    queryKey: ["boards"],
    queryFn: boardService.getBoards,
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login");
    },
  });

  return (
    <>
      <aside
        className={`relative flex flex-col h-screen bg-slate-900/80 border-r border-slate-800 transition-all duration-300 ease-in-out ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800">
          {!collapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent whitespace-nowrap">
              TaskFlow
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {/* Dashboard */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`
            }
            title="Dashboard"
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Dashboard</span>}
          </NavLink>

          {/* Boards section */}
          {!collapsed && (
            <div className="pt-3 pb-1 px-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Boards
                </span>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="p-0.5 rounded text-slate-500 hover:text-indigo-400 transition-colors"
                  title="Tạo board mới"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Board list */}
          <div className="space-y-0.5">
            {boards.map((board) => (
              <NavLink
                key={board._id}
                to={`/b/${board._id}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                  }`
                }
                title={board.name}
              >
                <div className="w-2 h-2 rounded-sm bg-indigo-500 shrink-0" />
                {!collapsed && (
                  <span className="text-sm truncate">{board.name}</span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User & Logout */}
        <div className="border-t border-slate-800 p-3 space-y-1">
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:bg-rose-600/20 hover:text-rose-400 transition-all duration-200 ${
              collapsed ? "justify-center" : ""
            }`}
            title="Đăng xuất"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm">Đăng xuất</span>}
          </button>
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="absolute -right-3.5 top-20 w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-100 transition-colors shadow-lg z-10"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </aside>

      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

const MainLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
