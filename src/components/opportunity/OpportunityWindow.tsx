import React from "react";
import { SimulationBar } from "./SimulationBar";
import { FinancialChart } from "./FinancialChart";
import { SimulatedPurchase, MonthFinancialSummary } from "../../lib/types";

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
    <div className="w-full mt-6">
      <div className="mb-3">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
          ANALISE GRÁFICA E JANELA DE OPORTUNIDADE
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Visão preditiva dos próximos 12 meses. O sistema calcula o impacto de novas compras e identifica o momento seguro para suas aquisições.
        </p>
      </div>

      {/* Simulator Bar */}
      <SimulationBar
        simulation={simulation}
        onSaveSimulation={onSaveSimulation}
        projections={projections}
      />

      {/* Visual Projection Chart */}
      <FinancialChart
        projections={projections}
        isSimulationActive={simulation?.isActive ?? false}
      />
    </div>
  );
};

