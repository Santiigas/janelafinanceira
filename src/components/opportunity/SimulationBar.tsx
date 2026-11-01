import React, { useState } from "react";
import { SimulatedPurchase, MonthFinancialSummary } from "../../lib/types";
import { formatCurrency, getCurrentYearMonth } from "../../lib/utils";
import { Sparkles, ToggleLeft, ToggleRight, Info, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

interface SimulationBarProps {
  simulation: SimulatedPurchase | null;
  onSaveSimulation: (sim: SimulatedPurchase | null) => void;
  projections: MonthFinancialSummary[];
}

export const SimulationBar: React.FC<SimulationBarProps> = ({
  simulation,
  onSaveSimulation,
  projections,
}) => {
  const currentMonth = getCurrentYearMonth();
  const [isOpen, setIsOpen] = useState(false);

  const [title, setTitle] = useState(simulation?.title || "Cadeira de Escritório");
  const [totalAmount, setTotalAmount] = useState(
    simulation?.totalAmount ? String(simulation.totalAmount) : "1200"
  );
  const [installments, setInstallments] = useState(
    simulation?.installmentsCount ? String(simulation.installmentsCount) : "10"
  );
  const [startMonth, setStartMonth] = useState(
    simulation?.startYearMonth || currentMonth
  );

  const isActive = simulation?.isActive ?? false;

  const handleToggle = () => {
    if (!simulation) {
      handleApply(true);
      return;
    }
    onSaveSimulation({
      ...simulation,
      isActive: !simulation.isActive,
    });
  };

  const handleApply = (activeState = true) => {
    const total = parseFloat(totalAmount.replace(",", ".")) || 0;
    const count = parseInt(installments) || 1;

    onSaveSimulation({
      id: simulation?.id || "sim_1",
      title: title.trim() || "Nova Aquisição",
      totalAmount: total,
      installmentsCount: count,
      startYearMonth: startMonth,
      isActive: activeState,
    });
  };

  // Análise da Janela de Oportunidade: Encontra o melhor mês para comprar sem aperto
  const bestMonth = projections.find((p) => p.statusColor === "verde");
  const parsedTotal = parseFloat(totalAmount.replace(",", ".")) || 0;
  const parsedCount = parseInt(installments) || 1;
  const installmentValue = parsedCount > 0 ? parsedTotal / parsedCount : parsedTotal;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 mb-5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title and Active Status */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                Simulador de Janela de Oportunidades & Aquisições
              </h3>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
              }`}>
                {isActive ? "Simulação Ativa no Gráfico" : "Simulação Desativada"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simule a compra de um bem (à vista ou parcelado) para ver em tempo real o impacto financeiro mês a mês.
            </p>
          </div>
        </div>

        {/* Toggle and Quick Action */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={handleToggle}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
              isActive
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            <span>{isActive ? "Simulação Ligada" : "Ligar Simulação"}</span>
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            {isOpen ? "Ocultar Parâmetros" : "Ajustar Parâmetros"}
          </button>
        </div>
      </div>

      {/* Inputs Form */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              O que você deseja adquirir?
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Cadeira de Escritório"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Valor Total da Compra (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Parcelamento
            </label>
            <select
              value={installments}
              onChange={(e) => setInstallments(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white font-semibold"
            >
              <option value="1">1x À Vista ({formatCurrency(parsedTotal)})</option>
              {[2, 3, 4, 5, 6, 8, 10, 12, 15, 18, 24].map((num) => (
                <option key={num} value={num}>
                  {num}x de {formatCurrency(parsedTotal / num)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Mês de Início
            </label>
            <div className="flex gap-2">
              <input
                type="month"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white font-semibold"
              />
              <button
                type="button"
                onClick={() => handleApply(true)}
                className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 whitespace-nowrap shadow-xs"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Insight Banner */}
      {isActive && (
        <div className="mt-4 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-950 font-medium">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              Simulando <strong>{title}</strong>: {parsedCount}x de <strong>{formatCurrency(installmentValue)}</strong> a partir de <strong>{startMonth}</strong>.
            </span>
          </div>
          {bestMonth && (
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Janela Ideal: {bestMonth.monthLabel}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

