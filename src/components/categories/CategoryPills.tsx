import React from "react";
import { AlertTriangle, Plus, Sliders } from "lucide-react";
import { CategoryKey, CategoryLimit } from "../../lib/types";
import { formatCurrency } from "../../lib/utils";

interface CategoryPillsProps {
  categoryTotals: Record<CategoryKey, number>;
  limits: CategoryLimit[];
  onOpenCategory: (category: CategoryKey) => void;
  onOpenLimitModal: (category: CategoryKey) => void;
}

interface CategoryConfig {
  key: CategoryKey;
  label: string;
  borderColor: string;
  textColor: string;
  hoverBg: string;
  hasLimit: boolean;
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: "entradas",
    label: "ENTRADAS +",
    borderColor: "border-[#16a34a]", // Verde
    textColor: "text-[#16a34a]",
    hoverBg: "hover:bg-emerald-50",
    hasLimit: false,
  },
  {
    key: "despesas_fixas",
    label: "DESPESAS FIXAS MENSAIS -",
    borderColor: "border-[#ea580c]", // Laranja
    textColor: "text-[#ea580c]",
    hoverBg: "hover:bg-orange-50",
    hasLimit: true,
  },
  {
    key: "cartao_credito",
    label: "CARTAO DE CREDITO -",
    borderColor: "border-[#881337]", // Vinho / Marrom escuro
    textColor: "text-[#881337]",
    hoverBg: "hover:bg-rose-50",
    hasLimit: true,
  },
  {
    key: "assinaturas",
    label: "ASSINATURAS -",
    borderColor: "border-[#854d0e]", // Oliva / Mostarda
    textColor: "text-[#854d0e]",
    hoverBg: "hover:bg-yellow-50",
    hasLimit: true,
  },
  {
    key: "investimentos",
    label: "INVESTIMENTOS -",
    borderColor: "border-[#0284c7]", // Azul ciano
    textColor: "text-[#0284c7]",
    hoverBg: "hover:bg-sky-50",
    hasLimit: false,
  },
  {
    key: "diversao",
    label: "DIVERSÃO",
    borderColor: "border-[#db2777]", // Rosa / Pink
    textColor: "text-[#db2777]",
    hoverBg: "hover:bg-pink-50",
    hasLimit: true,
  },
];

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categoryTotals,
  limits,
  onOpenCategory,
  onOpenLimitModal,
}) => {
  return (
    <div className="w-full flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 my-4">
      {CATEGORIES.map((cat) => {
        const total = categoryTotals[cat.key] || 0;
        const limitObj = limits.find((l) => l.category === cat.key);
        const limit = limitObj?.monthlyLimit || 0;
        const isLimitBreached = cat.hasLimit && limit > 0 && total > limit;

        return (
          <div key={cat.key} className="relative group">
            <button
              onClick={() => onOpenCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border-[2.5px] bg-white shadow-xs transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0 ${cat.borderColor} ${cat.textColor} ${cat.hoverBg}`}
            >
              {/* Category Label */}
              <span className="font-black text-xs sm:text-sm tracking-tight whitespace-nowrap">
                {cat.label}
              </span>

              {/* Total Badge */}
              {total > 0 && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {formatCurrency(total)}
                </span>
              )}

              {/* Limit Alert Warning Icon */}
              {isLimitBreached && (
                <span
                  title={`Atenção! Gasto de ${formatCurrency(total)} ultrapassou o teto de ${formatCurrency(limit)}`}
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white animate-pulse"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
              )}
            </button>

            {/* Quick Limit Settings Icon button (only for categories with limit) */}
            {cat.hasLimit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLimitModal(cat.key);
                }}
                title={
                  limit > 0
                    ? `Teto configurado: ${formatCurrency(limit)}. Clique para alterar.`
                    : "Definir teto de gastos para esta categoria"
                }
                className="absolute -top-2 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white p-1 rounded-full shadow-md hover:bg-slate-900"
              >
                <Sliders className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

