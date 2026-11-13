import React from "react";
import { DollarSign, Edit3, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "../../lib/utils";

interface SalaryButtonProps {
  salary: number;
  onClick: () => void;
}

export const SalaryButton: React.FC<SalaryButtonProps> = ({ salary, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950 text-white hover:bg-slate-900 transition-all duration-200 shadow-xs hover:shadow-md border border-slate-800 active:scale-98 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
      title="Clique para cadastrar ou alterar seu salário fixo mensal"
    >
      <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
        <DollarSign className="w-4 h-4" />
      </div>
      
      <div className="text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Salário Mensal
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
        <div className="text-xs sm:text-sm font-black text-white tracking-tight">
          {salary > 0 ? formatCurrency(salary) : "Definir Salário Fixo"}
        </div>
      </div>

      <div className="p-1 rounded-lg text-slate-400 group-hover:text-white group-hover:bg-slate-800 transition-colors ml-1">
        <Edit3 className="w-3.5 h-3.5" />
      </div>
    </button>
  );
};
