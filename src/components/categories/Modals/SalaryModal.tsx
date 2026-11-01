import React, { useState } from "react";
import { Modal } from "../../ui/Modal";
import { UserProfile } from "../../../lib/types";
import { DollarSign, Percent, Check } from "lucide-react";

interface SalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSave: (updated: UserProfile) => void;
}

export const SalaryModal: React.FC<SalaryModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSave,
}) => {
  const [salary, setSalary] = useState(userProfile.salary ? String(userProfile.salary) : "");
  const [safetyMargin, setSafetyMargin] = useState(
    userProfile.safetyMarginPercent ? String(userProfile.safetyMarginPercent) : "25"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSalary = parseFloat(salary.replace(",", ".")) || 0;
    const parsedMargin = Math.min(100, Math.max(0, parseFloat(safetyMargin) || 25));

    onSave({
      ...userProfile,
      salary: parsedSalary,
      safetyMarginPercent: parsedMargin,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cadastro de Salário Fixo Mensal"
      subtitle="Sua base de renda garantida que cai todos os meses"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Salário Líquido Mensal (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
              R$
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="Ex: 5000.00"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-slate-900"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Esse valor será replicado como base para os 12 meses da projeção financeira.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Margem de Segurança / Folga Desejada (%)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
              %
            </span>
            <input
              type="number"
              step="1"
              min="5"
              max="60"
              required
              value={safetyMargin}
              onChange={(e) => setSafetyMargin(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-slate-900"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Porcentagem da renda que você deseja reservar livre de aperto (Padrão: 25% a 30%).
          </p>
        </div>

        <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-xs"
          >
            <Check className="w-4 h-4" />
            Salvar Salário
          </button>
        </div>
      </form>
    </Modal>
  );
};

