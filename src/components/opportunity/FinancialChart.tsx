import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from "recharts";
import { MonthFinancialSummary } from "../../lib/types";
import { formatCurrency, formatCompactCurrency } from "../../lib/utils";

interface FinancialChartProps {
  projections: MonthFinancialSummary[];
  isSimulationActive: boolean;
}

const COLOR_MAP = {
  verde: "#16a34a", // Verde
  azul: "#2563eb", // Azul
  vermelho: "#dc2626", // Vermelho
  roxo: "#9333ea", // Roxo
};

export const FinancialChart: React.FC<FinancialChartProps> = ({
  projections,
  isSimulationActive,
}) => {
  // Encontra o valor máximo para calibrar o eixo Y com folga
  const maxExpense = Math.max(
    ...projections.map((p) => p.totalWithSimulation),
    ...projections.map((p) => p.totalIncome),
    1000
  );
  const yAxisMax = Math.ceil((maxExpense * 1.25) / 2000) * 2000;

  const chartData = projections.map((p) => ({
    ...p,
    mes: p.monthLabel,
    gastosBase: p.baseExpensesTotal,
    simulacao: p.simulationExpense,
    totalComSimulacao: p.totalWithSimulation,
    renda: p.totalIncome,
    cor: COLOR_MAP[p.statusColor] || "#16a34a",
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: MonthFinancialSummary = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700 min-w-[240px]">
          <div className="font-extrabold text-sm border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span>{data.monthLabel}</span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
              style={{
                backgroundColor: COLOR_MAP[data.statusColor] + "33",
                color: COLOR_MAP[data.statusColor],
                borderColor: COLOR_MAP[data.statusColor],
                borderWidth: "1px",
              }}
            >
              {data.statusLabel}
            </span>
          </div>

          <div className="pt-1 space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span>Renda Total (Salário + Extras):</span>
              <strong className="text-white">{formatCurrency(data.totalIncome)}</strong>
            </div>
            <div className="flex justify-between text-orange-300">
              <span>• Despesas Fixas:</span>
              <span>{formatCurrency(data.fixedExpenses)}</span>
            </div>
            <div className="flex justify-between text-rose-300">
              <span>• Faturas Cartão de Crédito:</span>
              <span>{formatCurrency(data.creditCardExpenses)}</span>
            </div>
            <div className="flex justify-between text-yellow-300">
              <span>• Assinaturas:</span>
              <span>{formatCurrency(data.subscriptionExpenses)}</span>
            </div>
            <div className="flex justify-between text-pink-300">
              <span>• Diversão:</span>
              <span>{formatCurrency(data.leisureExpenses)}</span>
            </div>
            {isSimulationActive && data.simulationExpense > 0 && (
              <div className="flex justify-between text-indigo-300 font-bold bg-indigo-950/60 p-1 rounded-md">
                <span>✦ Parcela Simulação:</span>
                <span>+{formatCurrency(data.simulationExpense)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 pt-1.5 mt-1 flex justify-between font-bold text-sm">
            <span>Saldo Restante:</span>
            <span className={data.netBalance >= 0 ? "text-emerald-400" : "text-red-400"}>
              {formatCurrency(data.netBalance)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-[#f1f5f9]/70 rounded-2xl border-2 border-slate-900 p-3 sm:p-5 shadow-xs">
      {/* Legend & Dynamic Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-300">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-black uppercase">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-[#16a34a] shadow-xs" />
            <span className="text-slate-800">Verde: Sem Aperto</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-[#2563eb] shadow-xs" />
            <span className="text-slate-800">Azul: Barreira de Folga</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-[#dc2626] shadow-xs" />
            <span className="text-slate-800">Vermelho: Limite da Renda</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-[#9333ea] shadow-xs" />
            <span className="text-slate-800">Roxo: Ultrapassando Limite</span>
          </div>
        </div>

        {isSimulationActive && (
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
            <span className="w-3 h-0.5 bg-indigo-600 border-t-2 border-dashed border-indigo-600 inline-block" />
            <span>Linha Roxa/Índigo: Curva da Compra Simulada</span>
          </div>
        )}
      </div>

      {/* Chart Canvas */}
      <div className="h-80 sm:h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 10, left: -10, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
            
            <XAxis
              dataKey="mes"
              interval={0}
              angle={-25}
              textAnchor="end"
              tick={{ fontSize: 10, fontWeight: 900, fill: "#0f172a" }}
              height={50}
            />

            <YAxis
              domain={[0, yAxisMax]}
              tickFormatter={(v) => formatCompactCurrency(v)}
              tick={{ fontSize: 11, fontWeight: 800, fill: "#334155" }}
              stroke="#64748b"
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Income Reference Line (Salário / Renda) */}
            {projections[0]?.totalIncome > 0 && (
              <ReferenceLine
                y={projections[0].totalIncome}
                stroke="#0f172a"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{
                  value: `Renda: ${formatCompactCurrency(projections[0].totalIncome)}`,
                  position: "top",
                  fill: "#0f172a",
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              />
            )}

            {/* Total Expenses Bar with Dynamic Health Colors */}
            <Bar
              dataKey={isSimulationActive ? "totalComSimulacao" : "gastosBase"}
              name="Gastos do Mês"
              radius={[6, 6, 0, 0]}
              maxBarSize={45}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.cor} />
              ))}
            </Bar>

            {/* Simulated Purchase Overlay Line */}
            {isSimulationActive && (
              <Line
                type="monotone"
                dataKey="totalComSimulacao"
                name="Impacto com Simulação"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, fill: "#4f46e5" }}
                activeDot={{ r: 6 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Month Health Status Strip (Mini Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2 mt-4 pt-3 border-t border-slate-300">
        {projections.map((m) => (
          <div
            key={m.monthKey}
            className="p-2 rounded-xl bg-white border border-slate-200 text-center shadow-2xs hover:shadow-sm transition-all"
          >
            <div className="text-[10px] font-black text-slate-800 truncate uppercase">
              {m.monthLabel.slice(0, 3)}
            </div>
            <div
              className="w-full h-1.5 rounded-full my-1.5"
              style={{ backgroundColor: COLOR_MAP[m.statusColor] }}
            />
            <div className="text-[10px] font-extrabold text-slate-900 truncate">
              {formatCompactCurrency(m.totalWithSimulation)}
            </div>
            <div
              className="text-[9px] font-bold truncate mt-0.5"
              style={{ color: COLOR_MAP[m.statusColor] }}
            >
              {m.statusColor === "verde"
                ? "Sem aperto"
                : m.statusColor === "azul"
                ? "Folga"
                : m.statusColor === "vermelho"
                ? "Aperto"
                : "Estouro"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

