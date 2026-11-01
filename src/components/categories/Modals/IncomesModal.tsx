import React, { useState } from "react";
import { Modal } from "../../ui/Modal";
import { Income } from "../../../lib/types";
import { formatCurrency, getCurrentYearMonth, generateId } from "../../../lib/utils";
import { Plus, Trash2, Check, Calendar } from "lucide-react";

interface IncomesModalProps {
  isOpen: boolean;
  onClose: () => void;
  incomes: Income[];
  onSaveIncome: (income: Income) => void;
  onDeleteIncome: (id: string) => void;
}

export const IncomesModal: React.FC<IncomesModalProps> = ({
  isOpen,
  onClose,
  incomes,
  onSaveIncome,
  onDeleteIncome,
}) => {
  const currentMonth = getCurrentYearMonth();
  const [showAdd, setShowAdd] = useState(false);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [yearMonth, setYearMonth] = useState(currentMonth);
  const [isRecurring, setIsRecurring] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const parsedAmount = parseFloat(amount.replace(",", ".")) || 0;
    const today = new Date().toISOString().split("T")[0];

    onSaveIncome({
      id: generateId(),
      description: description.trim(),
      amount: parsedAmount,
      date: today,
      yearMonth,
      isRecurring,
    });

    setDescription("");
    setAmount("");
    setIsRecurring(false);
    setShowAdd(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Entradas Extras & Rendas Adicionais"
      subtitle="Cadastre bonificações, freelances, 13º salário ou qualquer dinheiro a mais"
      maxWidth="lg"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-500 uppercase">
          {incomes.length} {incomes.length === 1 ? "entrada lançada" : "entradas lançadas"}
        </span>
        {!showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#16a34a] text-white hover:bg-[#15803d] text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Lançar Entrada Extra
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleSave} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#16a34a] uppercase">Nova Entrada Extra</h4>
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
                Descrição da Entrada
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Freelance de design, Restituição IR, Bônus semestral"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
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
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Mês em que Caiu/Cairá
              </label>
              <input
                type="month"
                value={yearMonth}
                onChange={(e) => setYearMonth(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16a34a] bg-white font-semibold"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="rounded text-[#16a34a] focus:ring-[#16a34a]"
              />
              <label htmlFor="isRecurring" className="text-xs text-slate-700 font-medium cursor-pointer">
                Essa entrada se repete todos os meses?
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-2 bg-[#16a34a] text-white text-xs font-bold rounded-lg hover:bg-[#15803d]"
            >
              <Check className="w-3.5 h-3.5" />
              Salvar Entrada
            </button>
          </div>
        </form>
      )}

      {incomes.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          Nenhuma entrada extra cadastrada. Use esse botão apenas para registrar rendas extras (freelas, bônus, etc.). Sua renda fixa principal fica no botão "SÁLARIO".
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {incomes.map((income) => (
            <div
              key={income.id}
              className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 transition-colors flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">
                    {income.description}
                  </span>
                  {income.isRecurring && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Mensal Recorrente
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                  <span className="text-[#16a34a] font-extrabold">
                    +{formatCurrency(income.amount)}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" /> Mês: {income.yearMonth}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onDeleteIncome(income.id)}
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

