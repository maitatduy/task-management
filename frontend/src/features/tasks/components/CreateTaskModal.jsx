import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Flag } from "lucide-react";
import { taskService } from "../../../services/taskService";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

const STATUS_OPTIONS = [
  { value: "todo", label: "📋 Chưa bắt đầu" },
  { value: "in-progress", label: "🔄 Đang thực hiện" },
  { value: "done", label: "✅ Hoàn thành" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Thấp", color: "text-emerald-400" },
  { value: "medium", label: "Trung bình", color: "text-amber-400" },
  { value: "high", label: "Cao", color: "text-rose-400" },
];

const CreateTaskModal = ({ isOpen, onClose, boardId, defaultStatus = "todo" }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: defaultStatus,
    priority: "medium",
  });

  const createMutation = useMutation({
    mutationFn: (data) => taskService.createTask({ ...data, boardId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId] });
      setForm({ title: "", description: "", status: defaultStatus, priority: "medium" });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    createMutation.mutate(form);
  };

  const errorMessage =
    createMutation.error?.response?.data?.message ||
    createMutation.error?.message;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm Task mới">
      {createMutation.isError && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMessage || "Không thể tạo task. Vui lòng thử lại."}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="task-title" className="text-sm font-medium text-slate-300 block mb-1.5">
            Tiêu đề <span className="text-rose-400">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="VD: Thiết kế màn hình đăng nhập"
            required
            autoFocus
            className="input-base"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="task-description" className="text-sm font-medium text-slate-300 block mb-1.5">
            Mô tả <span className="text-slate-500">(tùy chọn)</span>
          </label>
          <textarea
            id="task-description"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Mô tả chi tiết về task này..."
            rows={3}
            className="input-base resize-none"
          />
        </div>

        {/* Status & Priority row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-status" className="text-sm font-medium text-slate-300 block mb-1.5">
              Trạng thái
            </label>
            <select
              id="task-status"
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              className="input-base"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="task-priority" className="text-sm font-medium text-slate-300 block mb-1.5">
              Độ ưu tiên
            </label>
            <select
              id="task-priority"
              value={form.priority}
              onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
              className="input-base"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" isLoading={createMutation.isPending}>
            Thêm Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
