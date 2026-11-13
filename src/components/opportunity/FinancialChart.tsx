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
  ReferenceLine,
  Cell,
} from "recharts";
import { MonthFinancialSummary } from "../../lib/types";
import { formatCurrency, formatCompactCurrency } from "../../lib/utils";
import { BarChart3, TrendingUp, AlertCircle, Sparkles } from "lucide-react";

interface FinancialChartProps {
  projections: MonthFinancialSummary[];
  isSimulationActive: boolean;
}

const COLOR_MAP = {
  verde: "#16a34a", // Verde esmeralda
  azul: "#2563eb", // Azul royal
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
        <div className="bg-slate-950 text-white p-4 rounded-2xl shadow-2xl text-xs space-y-2 border border-slate-800 min-w-[250px] animate-in zoom-in-95 duration-150">
          <div className="font-extrabold text-sm border-b border-slate-800 pb-2 flex items-center justify-between">
            <span className="tracking-wide uppercase text-slate-100">{data.monthLabel}</span>
            <span
              className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase"
              style={{
                backgroundColor: COLOR_MAP[data.statusColor] + "26",
                color: COLOR_MAP[data.statusColor],
                borderColor: COLOR_MAP[data.statusColor] + "66",
                borderWidth: "1px",
              }}
            >
              {data.statusLabel}
            </span>
          </div>

          <div className="pt-1 space-y-1.5 text-slate-300">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-400">Renda Disponível:</span>
              <span className="text-white font-bold">{formatCurrency(data.totalIncome)}</span>
            </div>
            <div className="flex justify-between text-orange-400">
              <span>• Despesas Fixas:</span>
              <span className="font-medium">{formatCurrency(data.fixedExpenses)}</span>
            </div>
            <div className="flex justify-between text-rose-400">
              <span>• Cartões de Crédito:</span>
              <span className="font-medium">{formatCurrency(data.creditCardExpenses)}</span>
            </div>
            <div className="flex justify-between text-amber-400">
              <span>• Assinaturas:</span>
              <span className="font-medium">{formatCurrency(data.subscriptionExpenses)}</span>
            </div>
            <div className="flex justify-between text-pink-400">
              <span>• Diversão:</span>
              <span className="font-medium">{formatCurrency(data.leisureExpenses)}</span>
            </div>
            {isSimulationActive && data.simulationExpense > 0 && (
              <div className="flex justify-between text-indigo-300 font-bold bg-indigo-950/70 p-1.5 rounded-xl border border-indigo-800/60 mt-1">
                <span>✦ Impacto da Compra:</span>
                <span>+{formatCurrency(data.simulationExpense)}</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 pt-2 mt-1 flex justify-between items-center font-bold text-sm">
            <span className="text-slate-300">Saldo Livre:</span>
            <span className={data.netBalance >= 0 ? "text-emerald-400 font-extrabold" : "text-rose-400 font-extrabold"}>
              {formatCurrency(data.netBalance)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 transition-all">
      {/* Topo do Gráfico: Legendas e Indicador de Simulação */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-600 shadow-2xs" />
            <span>Verde: Sem Aperto</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200/80 text-[11px] font-bold text-blue-800">
            <span className="w-2 h-2 rounded-full bg-blue-600 shadow-2xs" />
            <span>Azul: Barreira de Folga</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200/80 text-[11px] font-bold text-rose-800">
            <span className="w-2 h-2 rounded-full bg-rose-600 shadow-2xs" />
            <span>Vermelho: Limite da Renda</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50 border border-purple-200/80 text-[11px] font-bold text-purple-800">
            <span className="w-2 h-2 rounded-full bg-purple-600 shadow-2xs" />
            <span>Roxo: Ultrapassando Limite</span>
          </div>
        </div>

        {isSimulationActive && (
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50/80 px-3 py-1.5 rounded-xl border border-indigo-200/80 self-start lg:self-auto">
            <span className="w-3.5 h-0.5 bg-indigo-600 border-t-2 border-dashed border-indigo-600 inline-block" />
            <span>Linha Roxa: Curva da Nova Compra</span>
          </div>
        )}
      </div>

      {/* Área do Gráfico */}
      <div className="h-80 sm:h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 10, left: -10, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="mes"
              interval={0}
              angle={-25}
              textAnchor="end"
              tick={{ fontSize: 10, fontWeight: 700, fill: "#475569" }}
              height={50}
              stroke="#cbd5e1"
            />

            <YAxis
              domain={[0, yAxisMax]}
              tickFormatter={(v) => formatCompactCurrency(v)}
              tick={{ fontSize: 11, fontWeight: 700, fill: "#64748b" }}
              stroke="#cbd5e1"
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Linha de Renda / Salário */}
            {projections[0]?.totalIncome > 0 && (
              <ReferenceLine
                y={projections[0].totalIncome}
                stroke="#0f172a"
                strokeWidth={1.5}
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

            {/* Barras com cores preditivas de saúde financeira */}
            <Bar
              dataKey={isSimulationActive ? "totalComSimulacao" : "gastosBase"}
              name="Gastos Projetados"
              radius={[8, 8, 0, 0]}
              maxBarSize={44}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.cor} />
              ))}
            </Bar>

            {/* Linha de Simulação de Compra */}
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

      {/* Mini-Cards dos 12 Meses (Resumo Preditivo) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2 mt-6 pt-5 border-t border-slate-100">
        {projections.map((m) => (
          <div
            key={m.monthKey}
            className="p-2.5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 text-center shadow-2xs hover:shadow-xs transition-all"
          >
            <div className="text-[10px] font-black text-slate-700 truncate uppercase">
              {m.monthLabel.slice(0, 3)}
            </div>
            <div
              className="w-full h-1.5 rounded-full my-1.5 shadow-2xs"
              style={{ backgroundColor: COLOR_MAP[m.statusColor] }}
            />
            <div className="text-[11px] font-extrabold text-slate-900 truncate">
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
                ? "No limite"
                : "Estourado"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
