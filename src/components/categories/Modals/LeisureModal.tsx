import React, { useState } from "react";
import { Modal } from "../../ui/Modal";
import { LeisureExpense } from "../../../lib/types";
import { formatCurrency, getCurrentYearMonth, generateId } from "../../../lib/utils";
import { Plus, Trash2, Check, Sparkles } from "lucide-react";

interface LeisureModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: LeisureExpense[];
  onSaveExpense: (expense: LeisureExpense) => void;
  onDeleteExpense: (id: string) => void;
}

export const LeisureModal: React.FC<LeisureModalProps> = ({
  isOpen,
  onClose,
  expenses,
  onSaveExpense,
  onDeleteExpense,
}) => {
  const currentMonth = getCurrentYearMonth();
  const [showAdd, setShowAdd] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [yearMonth, setYearMonth] = useState(currentMonth);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const parsedAmount = parseFloat(amount.replace(",", ".")) || 0;
    const today = new Date().toISOString().split("T")[0];

    onSaveExpense({
      id: generateId(),
      description: description.trim(),
      amount: parsedAmount,
      date: today,
      yearMonth,
    });

    setDescription("");
    setAmount("");
    setShowAdd(false);
  };

  const totalMonth = expenses
    .filter((e) => e.yearMonth === currentMonth)
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gastos com Diversão & Lazer"
      subtitle="Restaurantes, saídas de fim de semana, viagens, cinema e hobbies"
      maxWidth="lg"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase">
            {expenses.length} {expenses.length === 1 ? "gasto registrado" : "gastos registrados"}
          </span>
          {totalMonth > 0 && (
            <span className="ml-2 text-xs font-black text-[#db2777]">
              Mês atual: {formatCurrency(totalMonth)}
            </span>
          )}
        </div>
        {!showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#db2777] text-white hover:bg-[#be185d] text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Lançar Diversão
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleSave} className="p-4 bg-pink-50/50 rounded-2xl border border-pink-200 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#db2777] uppercase">Novo Gasto com Diversão</h4>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Descrição
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Jantar restaurante, Passeio parque, Cinema com amigos"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#db2777]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#db2777]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Mês de Referência
              </label>
              <input
                type="month"
                value={yearMonth}
                onChange={(e) => setYearMonth(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#db2777] bg-white font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-2 bg-[#db2777] text-white text-xs font-bold rounded-lg hover:bg-[#be185d]"
            >
              <Check className="w-3.5 h-3.5" />
              Salvar Gasto
            </button>
          </div>
        </form>
      )}

      {expenses.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          Nenhum gasto de diversão lançado ainda. Registre passeios, restaurantes, viagens e lazer aqui.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 transition-colors flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">
                    {expense.description}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Mês: {expense.yearMonth}
                  </span>
                </div>
                <div className="text-xs font-extrabold text-[#db2777] mt-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {formatCurrency(expense.amount)}
                </div>
              </div>

              <button
                onClick={() => onDeleteExpense(expense.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                title="Excluir"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

