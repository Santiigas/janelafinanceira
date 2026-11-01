import React from "react";
import { DollarSign, Edit3 } from "lucide-react";
import { formatCurrency } from "../../lib/utils";

interface SalaryButtonProps {
  salary: number;
  onClick: () => void;
}

export const SalaryButton: React.FC<SalaryButtonProps> = ({ salary, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm border border-slate-700 active:scale-95"
      title="Clique para cadastrar ou alterar seu salário fixo mensal"
    >
      <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
        <DollarSign className="w-4 h-4" />
      </div>
      <div className="text-left">
        <span className="block text-[10px] font-black tracking-widest text-slate-400 uppercase">
          SÁLARIO FIXO
        </span>
        <span className="block text-xs sm:text-sm font-extrabold text-white">
          {salary > 0 ? formatCurrency(salary) : "DEFINIR SÁLARIO"}
        </span>
      </div>
      <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors ml-1" />
    </button>
  );
};

