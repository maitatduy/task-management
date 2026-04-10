import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { authService } from "../../../services/authService";
import { useAuthStore } from "../../../store/authStore";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data);
      navigate("/");
    },
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    loginMutation.mutate(form);
  };

  const errorMessage = loginMutation.error?.response?.data?.message || loginMutation.error?.message;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background gradient accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            TaskFlow
          </span>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-slate-100">Chào mừng trở lại</h1>
            <p className="mt-2 text-sm text-slate-400">
              Đăng nhập để tiếp tục quản lý công việc của bạn
            </p>
          </div>

          {/* Error */}
          {loginMutation.isError && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMessage || "Đăng nhập thất bại. Vui lòng thử lại."}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <label htmlFor="login-email" className="text-sm font-medium text-slate-300 block mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="input-base pl-10"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="login-password" className="text-sm font-medium text-slate-300 block mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="input-base pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loginMutation.isPending}
              className="w-full mt-2"
            >
              {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
