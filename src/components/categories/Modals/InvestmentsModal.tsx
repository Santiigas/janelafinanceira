import React, { useState } from "react";
import { Modal } from "../../ui/Modal";
import { Investment, InvestmentType } from "../../../lib/types";
import { formatCurrency, getCurrentYearMonth, generateId } from "../../../lib/utils";
import { Plus, Trash2, Check, TrendingUp } from "lucide-react";

interface InvestmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  investments: Investment[];
  onSaveInvestment: (inv: Investment) => void;
  onDeleteInvestment: (id: string) => void;
}

export const InvestmentsModal: React.FC<InvestmentsModalProps> = ({
  isOpen,
  onClose,
  investments,
  onSaveInvestment,
  onDeleteInvestment,
}) => {
  const currentMonth = getCurrentYearMonth();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [investmentType, setInvestmentType] = useState<InvestmentType>("tesouro_direto");
  const [amount, setAmount] = useState("");
  const [yearMonth, setYearMonth] = useState(currentMonth);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedAmount = parseFloat(amount.replace(",", ".")) || 0;
    const today = new Date().toISOString().split("T")[0];

    onSaveInvestment({
      id: generateId(),
      name: name.trim(),
      investmentType,
      amount: parsedAmount,
      date: today,
      yearMonth,
    });

    setName("");
    setAmount("");
    setShowAdd(false);
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

  const getTypeLabel = (type: InvestmentType) => {
    switch (type) {
      case "tesouro_direto":
        return "Tesouro Direto";
      case "acoes":
        return "Ações";
      case "fiis":
        return "Fundos Imobiliários (FIIs)";
      default:
        return "Outros";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Aportes & Investimentos"
      subtitle="Registre seus aportes em Tesouro Direto, Ações, FIIs e construção de patrimônio"
      maxWidth="lg"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase">
            {investments.length} {investments.length === 1 ? "aporte registrado" : "aportes registrados"}
          </span>
          {totalInvested > 0 && (
            <span className="ml-2 text-xs font-black text-[#0284c7]">
              Total Aportado: {formatCurrency(totalInvested)}
            </span>
          )}
        </div>
        {!showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0284c7] text-white hover:bg-[#0369a1] text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Lançar Aporte
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleSave} className="p-4 bg-sky-50/50 rounded-2xl border border-sky-200 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#0284c7] uppercase">Novo Aporte de Investimento</h4>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Ativo / Aplicação
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Tesouro Selic 2029, MXRF11, IVVB11"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Tipo de Investimento
              </label>
              <select
                value={investmentType}
                onChange={(e) => setInvestmentType(e.target.value as InvestmentType)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0284c7] bg-white font-semibold"
              >
                <option value="tesouro_direto">Tesouro Direto</option>
                <option value="acoes">Ações</option>
                <option value="fiis">Fundos Imobiliários (FIIs)</option>
                <option value="outros">Outros Investimentos</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Valor Aportado (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Mês do Aporte
              </label>
              <input
                type="month"
                value={yearMonth}
                onChange={(e) => setYearMonth(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0284c7] bg-white font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-2 bg-[#0284c7] text-white text-xs font-bold rounded-lg hover:bg-[#0369a1]"
            >
              <Check className="w-3.5 h-3.5" />
              Salvar Aporte
            </button>
          </div>
        </form>
      )}

      {investments.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          Nenhum investimento registrado ainda. Registre aqui tudo que você coloca em tesouro direto, ações, fundos imobiliários, etc.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {investments.map((inv) => (
            <div
              key={inv.id}
              className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 transition-colors flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">
                    {inv.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    {getTypeLabel(inv.investmentType)}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Mês: {inv.yearMonth}
                  </span>
                </div>
                <div className="text-xs font-extrabold text-[#0284c7] mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {formatCurrency(inv.amount)}
                </div>
              </div>

              <button
                onClick={() => onDeleteInvestment(inv.id)}
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

