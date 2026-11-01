import React, { useState } from "react";
import { Modal } from "../../ui/Modal";
import { CategoryKey, CategoryLimit } from "../../../lib/types";
import { formatCurrency } from "../../../lib/utils";
import { Sliders, AlertTriangle, Check } from "lucide-react";

interface CategoryLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryKey | null;
  currentLimit: number;
  currentTotal: number;
  onSaveLimit: (category: CategoryKey, limit: number) => void;
}

const CATEGORY_NAMES: Record<CategoryKey, string> = {
  despesas_fixas: "Despesas Fixas Mensais",
  cartao_credito: "Cartão de Crédito",
  assinaturas: "Assinaturas",
  diversao: "Diversão",
  investimentos: "Investimentos",
  entradas: "Entradas Extras",
};

export const CategoryLimitModal: React.FC<CategoryLimitModalProps> = ({
  isOpen,
  onClose,
  category,
  currentLimit,
  currentTotal,
  onSaveLimit,
}) => {
  if (!category) return null;

  const [limit, setLimit] = useState(currentLimit > 0 ? String(currentLimit) : "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLimit = parseFloat(limit.replace(",", ".")) || 0;
    onSaveLimit(category, parsedLimit);
    onClose();
  };

  const isExceeded = currentLimit > 0 && currentTotal > currentLimit;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Teto de Gastos: ${CATEGORY_NAMES[category]}`}
      subtitle="Defina o valor limite máximo que você aceita gastar nesta categoria por mês"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {isExceeded && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>
              Atenção: Seu gasto atual nesta categoria ({formatCurrency(currentTotal)}) já ultrapassou o teto anterior de {formatCurrency(currentLimit)}!
            </span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Valor Máximo Permitido no Mês (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
              R$
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 500.00 (ou 0 para sem teto)"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-slate-900"
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Gasto atual registrado no mês: <strong>{formatCurrency(currentTotal)}</strong>. Se ultrapassar o teto, um ícone de atenção piscará no botão.
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
            Salvar Teto
          </button>
        </div>
      </form>
    </Modal>
  );
};

