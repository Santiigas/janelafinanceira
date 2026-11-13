import React from "react";
import {
  Compass,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  TrendingUp,
  CreditCard,
  Layers,
  ArrowRight,
} from "lucide-react";

export const HelpSection: React.FC = () => {
  return (
    <section className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 mt-8 transition-all">
      {/* Cabeçalho da Seção de Ajuda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-800 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guia Prático da Ferramenta</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Como usar a Janela Financeira?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Entenda o objetivo da sua ferramenta e como tomar decisões de compra com segurança.
          </p>
        </div>
      </div>

      {/* Grid com os 3 Pilares Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5">
        {/* Pilar 1: O Objetivo */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-2xs">
            <Compass className="w-4 h-4 text-emerald-400" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
            1. O Objetivo da Ferramenta
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Diferente dos apps convencionais que só olham para os gastos do passado, a <strong>Janela Financeira é uma bússola de futuro</strong>. O objetivo é projetar seus próximos 12 meses para revelar o melhor momento de fazer aquisições sem aperto.
          </p>
        </div>

        {/* Pilar 2: Alimentação dos Dados */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
            <Layers className="w-4 h-4" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
            2. Como Lançar Suas Contas
          </h4>
          <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <span>
                <strong className="text-slate-900 font-bold">Salário:</strong> Defina sua renda líquida garantida mensal.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <span>
                <strong className="text-slate-900 font-bold">Despesas:</strong> Cadastre fixas (aluguel) e variáveis (água/luz com médias).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <span>
                <strong className="text-slate-900 font-bold">Cartões:</strong> Lance compras à vista ou parceladas (ex: 10x).
              </span>
            </li>
          </ul>
        </div>

        {/* Pilar 3: O Simulador e Cores */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
            3. A Janela de Aquisições
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Deseja comprar algo (como uma cadeira ou eletrônico)? Coloque no <strong>Simulador</strong>. O sistema recalcula os 12 meses e indica pelas cores:
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold pt-1">
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              🟢 Verde: Sem aperto
            </span>
            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
              🔵 Azul: Barreira de folga
            </span>
            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
              🔴 Vermelho: No limite
            </span>
            <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
              🟣 Roxo: Ultrapassando
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

