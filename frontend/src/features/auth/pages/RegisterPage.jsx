import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { registerFn } from "../api/authApi";
import { useAuthStore } from "../../../store/authStore";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const registerMutation = useMutation({
    mutationFn: registerFn,
    onSuccess: (data) => {
      setUser(data);
      navigate("/"); // Redirect to dashboard
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    registerMutation.mutate({ name, email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Create an account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign up to start managing your tasks efficiently.
          </p>
        </div>

        {registerMutation.isError && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {registerMutation.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Create a password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {registerMutation.isPending ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
