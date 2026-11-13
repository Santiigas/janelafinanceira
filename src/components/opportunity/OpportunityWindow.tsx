import React from "react";
import { SimulationBar } from "./SimulationBar";
import { FinancialChart } from "./FinancialChart";
import { SimulatedPurchase, MonthFinancialSummary } from "../../lib/types";
import { Sparkles, LineChart } from "lucide-react";

interface OpportunityWindowProps {
  simulation: SimulatedPurchase | null;
  onSaveSimulation: (sim: SimulatedPurchase | null) => void;
  projections: MonthFinancialSummary[];
}

export const OpportunityWindow: React.FC<OpportunityWindowProps> = ({
  simulation,
  onSaveSimulation,
  projections,
}) => {
  return (
    <div className="w-full space-y-8">
      {/* BLOCO 2: ANÁLISE GRÁFICA E JANELA DE OPORTUNIDADE + SIMULADOR */}
      <section className="space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-[11px] font-bold text-indigo-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Bloco 2 • Inteligência Preditiva</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Análise Gráfica e Janela de Oportunidade
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Simule a aquisição de um bem (à vista ou parcelado) para identificar em tempo real o impacto financeiro e o mês mais seguro para a compra.
          </p>
        </div>

        {/* Simulador de Janela */}
        <SimulationBar
          simulation={simulation}
          onSaveSimulation={onSaveSimulation}
          projections={projections}
        />
      </section>

      {/* BLOCO 3: GRÁFICO EM TEMPO REAL */}
      <section className="space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-bold text-slate-700 mb-2">
            <LineChart className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bloco 3 • Gráfico em Tempo Real</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Projeção Orçamentária dos Próximos 12 Meses
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Acompanhe o comprometimento da sua renda mês a mês com base nas suas despesas cadastradas e no impacto da simulação ativa.
          </p>
        </div>

        {/* Gráfico com bordas e estilo harmonizados com o simulador */}
        <FinancialChart
          projections={projections}
          isSimulationActive={simulation?.isActive ?? false}
        />
      </section>
    </div>
  );
};
