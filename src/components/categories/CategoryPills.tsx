import React from "react";
import {
  AlertTriangle,
  Sliders,
  ArrowDownLeft,
  Home,
  CreditCard as CardIcon,
  Repeat,
  TrendingUp,
  Sparkles,
} from "lucide-react";
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
  icon: React.ElementType;
  borderColor: string;
  hoverBorder: string;
  textColor: string;
  bgLight: string;
  iconBg: string;
  hasLimit: boolean;
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: "entradas",
    label: "Entradas",
    icon: ArrowDownLeft,
    borderColor: "border-emerald-200",
    hoverBorder: "hover:border-emerald-400",
    textColor: "text-emerald-800",
    bgLight: "bg-emerald-50/25 hover:bg-emerald-50/60",
    iconBg: "bg-emerald-100 text-emerald-700",
    hasLimit: false,
  },
  {
    key: "despesas_fixas",
    label: "Despesas Fixas",
    icon: Home,
    borderColor: "border-orange-200",
    hoverBorder: "hover:border-orange-400",
    textColor: "text-orange-800",
    bgLight: "bg-orange-50/25 hover:bg-orange-50/60",
    iconBg: "bg-orange-100 text-orange-700",
    hasLimit: true,
  },
  {
    key: "cartao_credito",
    label: "Cartão de Crédito",
    icon: CardIcon,
    borderColor: "border-rose-200",
    hoverBorder: "hover:border-rose-400",
    textColor: "text-rose-900",
    bgLight: "bg-rose-50/25 hover:bg-rose-50/60",
    iconBg: "bg-rose-100 text-rose-800",
    hasLimit: true,
  },
  {
    key: "assinaturas",
    label: "Assinaturas",
    icon: Repeat,
    borderColor: "border-amber-200",
    hoverBorder: "hover:border-amber-400",
    textColor: "text-amber-900",
    bgLight: "bg-amber-50/25 hover:bg-amber-50/60",
    iconBg: "bg-amber-100 text-amber-800",
    hasLimit: true,
  },
  {
    key: "investimentos",
    label: "Investimentos",
    icon: TrendingUp,
    borderColor: "border-sky-200",
    hoverBorder: "hover:border-sky-400",
    textColor: "text-sky-800",
    bgLight: "bg-sky-50/25 hover:bg-sky-50/60",
    iconBg: "bg-sky-100 text-sky-700",
    hasLimit: false,
  },
  {
    key: "diversao",
    label: "Diversão",
    icon: Sparkles,
    borderColor: "border-pink-200",
    hoverBorder: "hover:border-pink-400",
    textColor: "text-pink-800",
    bgLight: "bg-pink-50/25 hover:bg-pink-50/60",
    iconBg: "bg-pink-100 text-pink-700",
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
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 pt-1">
      {CATEGORIES.map((cat) => {
        const total = categoryTotals[cat.key] || 0;
        const limitObj = limits.find((l) => l.category === cat.key);
        const limit = limitObj?.monthlyLimit || 0;
        const isLimitBreached = cat.hasLimit && limit > 0 && total > limit;
        const IconComponent = cat.icon;

        return (
          <div
            key={cat.key}
            onClick={() => onOpenCategory(cat.key)}
            className={`cursor-pointer w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-[1.5px] bg-white shadow-2xs hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 ${cat.borderColor} ${cat.hoverBorder} ${cat.bgLight}`}
          >
            {/* Lado Esquerdo: Ícone + Nome da Categoria + Subtítulo Teto */}
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105 ${cat.iconBg}`}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-black text-sm tracking-tight truncate ${cat.textColor}`}
                  >
                    {cat.label}
                  </span>
                  {isLimitBreached && (
                    <span
                      title={`Atenção! Gasto de ${formatCurrency(
                        total
                      )} ultrapassou o teto de ${formatCurrency(limit)}`}
                      className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-600 text-white shrink-0 animate-pulse"
                    >
                      <AlertTriangle className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {cat.hasLimit ? (
                  <span className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {limit > 0 ? (
                      <span>
                        Teto: <strong>{formatCurrency(limit)}</strong>
                      </span>
                    ) : (
                      "Sem teto definido"
                    )}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                    {cat.key === "entradas" ? "Receitas extras" : "Patrimônio & Futuro"}
                  </span>
                )}
              </div>
            </div>

            {/* Lado Direito: Valor Total + Botão de Limites FIXO */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Badge do Valor do Mês */}
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Este mês
                </span>
                <span
                  className={`text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-xl border shadow-2xs whitespace-nowrap ${
                    total > 0
                      ? isLimitBreached
                        ? "bg-red-50 border-red-200 text-red-700 font-black"
                        : "bg-white/95 border-slate-200 text-slate-900"
                      : "bg-slate-50 border-slate-200/60 text-slate-400 font-semibold"
                  }`}
                >
                  {formatCurrency(total)}
                </span>
              </div>

              {/* Botão de Limites: FIXO E SEMPRE VISÍVEL */}
              {cat.hasLimit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenLimitModal(cat.key);
                  }}
                  title={
                    limit > 0
                      ? `Teto: ${formatCurrency(limit)}. Clique para ajustar.`
                      : "Definir teto de gastos para esta categoria"
                  }
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs transition-all active:scale-95"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
