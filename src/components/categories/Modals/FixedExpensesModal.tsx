import React, { useState } from "react";
import { Modal } from "../../ui/Modal";
import { FixedExpense, ExpenseType } from "../../../lib/types";
import { formatCurrency, getCurrentYearMonth, generateId } from "../../../lib/utils";
import { Plus, Trash2, Edit2, Calendar, TrendingUp, Check } from "lucide-react";

interface FixedExpensesModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: FixedExpense[];
  onSaveExpense: (expense: FixedExpense) => void;
  onDeleteExpense: (id: string) => void;
  onUpdateMonthValue: (expenseId: string, yearMonth: string, amount: number) => void;
}

export const FixedExpensesModal: React.FC<FixedExpensesModalProps> = ({
  isOpen,
  onClose,
  expenses,
  onSaveExpense,
  onDeleteExpense,
  onUpdateMonthValue,
}) => {
  const currentMonth = getCurrentYearMonth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [expenseType, setExpenseType] = useState<ExpenseType>("fixa");
  const [baseAmount, setBaseAmount] = useState("");
  const [dueDay, setDueDay] = useState("10");

  // State to update specific month
  const [updatingMonthExpenseId, setUpdatingMonthExpenseId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [monthSpecificAmount, setMonthSpecificAmount] = useState("");

  const resetForm = () => {
    setName("");
    setExpenseType("fixa");
    setBaseAmount("");
    setDueDay("10");
    setEditingExpenseId(null);
    setShowAddForm(false);
  };

  const handleEditClick = (expense: FixedExpense) => {
    setName(expense.name);
    setExpenseType(expense.expenseType);
    setBaseAmount(String(expense.baseAmount));
    setDueDay(String(expense.dueDay || 10));
    setEditingExpenseId(expense.id);
    setShowAddForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedAmount = parseFloat(baseAmount.replace(",", ".")) || 0;
    const existing = expenses.find((exp) => exp.id === editingExpenseId);

    const expenseToSave: FixedExpense = {
      id: editingExpenseId || generateId(),
      name: name.trim(),
      expenseType,
      baseAmount: parsedAmount,
      dueDay: parseInt(dueDay) || 10,
      entries: existing ? existing.entries : [],
    };

    onSaveExpense(expenseToSave);
    resetForm();
  };

  const handleSaveMonthValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingMonthExpenseId) return;

    const parsedAmount = parseFloat(monthSpecificAmount.replace(",", ".")) || 0;
    onUpdateMonthValue(updatingMonthExpenseId, selectedMonth, parsedAmount);
    setUpdatingMonthExpenseId(null);
    setMonthSpecificAmount("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Despesas Fixas & Contas Mensais"
      subtitle="Cadastre e gerencie suas despesas fixas (aluguel, internet) e variáveis com média (água, luz, mercado)"
      maxWidth="xl"
    >
      {/* Top Action Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-500 uppercase">
          {expenses.length} {expenses.length === 1 ? "despesa cadastrada" : "despesas cadastradas"}
        </span>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ea580c] text-white hover:bg-[#c2410c] text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Cadastrar Nova Despesa
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSave} className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
              {editingExpenseId ? "Editar Despesa" : "Nova Despesa Mensal"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Nome da Conta
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Aluguel, Luz, Água, Internet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Tipo de Despesa
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setExpenseType("fixa")}
                  className={`py-2 text-xs font-bold rounded-lg border text-center transition-all ${
                    expenseType === "fixa"
                      ? "bg-[#ea580c] text-white border-[#ea580c]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Fixa (Mesmo valor)
                </button>
                <button
                  type="button"
                  onClick={() => setExpenseType("variavel")}
                  className={`py-2 text-xs font-bold rounded-lg border text-center transition-all ${
                    expenseType === "variavel"
                      ? "bg-[#ea580c] text-white border-[#ea580c]"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Variável (Média)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                {expenseType === "fixa" ? "Valor Mensal (R$)" : "Valor Base / Inicial (R$)"}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                value={baseAmount}
                onChange={(e) => setBaseAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Dia do Vencimento
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-2 bg-[#ea580c] text-white text-xs font-bold rounded-lg hover:bg-[#c2410c]"
            >
              <Check className="w-3.5 h-3.5" />
              {editingExpenseId ? "Atualizar Despesa" : "Adicionar Despesa"}
            </button>
          </div>
        </form>
      )}

      {/* Modal / Popover to Update Value for a specific Month */}
      {updatingMonthExpenseId && (
        <form
          onSubmit={handleSaveMonthValue}
          className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-3 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-900 uppercase">
              Atualizar valor de mês específico (Conta Variável)
            </h4>
            <button
              type="button"
              onClick={() => setUpdatingMonthExpenseId(null)}
              className="text-xs text-amber-600 hover:text-amber-800"
            >
              Cancelar
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Mês de Referência (YYYY-MM)
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Valor Real da Conta Neste Mês (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="Ex: 65.00"
                value={monthSpecificAmount}
                onChange={(e) => setMonthSpecificAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs"
            >
              Gravar Valor do Mês & Recalcular Média
            </button>
          </div>
        </form>
      )}

      {/* List of Registered Expenses */}
      {expenses.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          Nenhuma despesa fixa cadastrada ainda. Clique em "Cadastrar Nova Despesa" acima para adicionar aluguel, condomínio, internet, água, luz, etc.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {expenses.map((expense) => {
            const isVariable = expense.expenseType === "variavel";
            const entriesCount = expense.entries?.length || 0;
            const average =
              entriesCount > 0
                ? expense.entries.reduce((acc, curr) => acc + curr.actualAmount, 0) / entriesCount
                : expense.baseAmount;

            return (
              <div
                key={expense.id}
                className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      {expense.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isVariable
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {isVariable ? "Variável (Média)" : "Fixa"}
                    </span>
                    {expense.dueDay && (
                      <span className="text-[11px] text-slate-400">
                        Vence dia {expense.dueDay}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 mt-1">
                    {isVariable ? (
                      <span className="flex items-center gap-1.5 text-amber-800 font-medium">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                        Média projetada: <strong>{formatCurrency(average)}</strong>
                        <span className="text-[11px] text-slate-500">
                          ({entriesCount} {entriesCount === 1 ? "mês registrado" : "meses registrados"})
                        </span>
                      </span>
                    ) : (
                      <span>Valor mensal: <strong>{formatCurrency(expense.baseAmount)}</strong></span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isVariable && (
                    <button
                      onClick={() => {
                        setUpdatingMonthExpenseId(expense.id);
                        setSelectedMonth(currentMonth);
                        const existingEntry = expense.entries?.find((e) => e.yearMonth === currentMonth);
                        setMonthSpecificAmount(existingEntry ? String(existingEntry.actualAmount) : "");
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center gap-1"
                      title="Lançar valor real deste mês"
                    >
                      <Calendar className="w-3 h-3" />
                      Lançar este mês
                    </button>
                  )}

                  <button
                    onClick={() => handleEditClick(expense)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
};

