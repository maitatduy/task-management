import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { boardService } from "../../../services/boardService";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

const CreateBoardModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({ name: "", description: "" });
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: boardService.createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      setForm({ name: "", description: "" });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    createMutation.mutate(form);
  };

  const errorMessage =
    createMutation.error?.response?.data?.message ||
    createMutation.error?.message;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo Board mới">
      {createMutation.isError && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMessage || "Không thể tạo board. Vui lòng thử lại."}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="board-name" className="text-sm font-medium text-slate-300 block mb-1.5">
            Tên Board <span className="text-rose-400">*</span>
          </label>
          <input
            id="board-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="VD: Dự án Website 2024"
            required
            autoFocus
            className="input-base"
          />
        </div>

        <div>
          <label htmlFor="board-description" className="text-sm font-medium text-slate-300 block mb-1.5">
            Mô tả <span className="text-slate-500">(tùy chọn)</span>
          </label>
          <textarea
            id="board-description"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Mô tả ngắn về board này..."
            rows={3}
            className="input-base resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" isLoading={createMutation.isPending}>
            Tạo Board
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateBoardModal;
