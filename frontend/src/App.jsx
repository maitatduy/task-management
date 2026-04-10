import React, { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import DashboardPage from "./features/boards/pages/DashboardPage";
import BoardPage from "./features/boards/pages/BoardPage";
import MainLayout from "./components/layout/MainLayout";
import { useAuthStore } from "./store/authStore";
import { authService } from "./services/authService";
import { Loader2 } from "lucide-react";

// Server-side session verification on app load
// This syncs client state with real cookie validity.
const useSessionVerify = () => {
  const { setUser, clearAuth, isAuthenticated } = useAuthStore();

  const { isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: authService.getMe,
    enabled: isAuthenticated, // Only call if we think we're logged in
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: (data) => setUser(data),
    onError: () => clearAuth(), // Cookie expired/invalid → log out
  });

  return isLoading;
};

// Protected route wrapper
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isVerifying = useSessionVerify();

  // Show a loading spinner while verifying the session
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" replace />}
      />

      {/* Protected routes under MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/b/:boardId" element={<BoardPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
