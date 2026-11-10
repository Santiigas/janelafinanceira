import React, { useState } from "react";
import {
  Menu,
  LogOut,
  LogIn,
  Database,
  User,
  ShieldCheck,
  X,
  Compass,
  ChevronRight,
  TrendingUp,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
} from "lucide-react";
import { isSupabaseConfigured } from "../../lib/supabase";

interface HeaderProps {
  userName?: string;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
  onOpenSettings?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName = "Santiago",
  isLoggedIn = false,
  onOpenAuth,
  onLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Formata o nome para capitalizado suave caso venha em maiúsculo
  const formattedName =
    userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Lado Esquerdo: Botão Menu + Marca "Janela Financeira" */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 active:scale-95"
              title="Abrir menu de navegação e opções"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center shadow-xs shadow-slate-900/20">
                <Compass className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 text-base sm:text-lg tracking-tight leading-none">
                    Janela<span className="text-emerald-600">Financeira</span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 leading-none hidden md:inline">
                    Preditiva
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wide hidden sm:block">
                  Controle & Janela de Oportunidades
                </span>
              </div>
            </div>
          </div>

          {/* Centro: Boas-vindas Elegante */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-2.5 px-4 py-1.5 bg-slate-50 border border-slate-200/80 rounded-full shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-slate-600 font-medium">
                Olá, <strong className="text-slate-900 font-bold">{formattedName}</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
                Planejamento Ativo
              </span>
            </div>
          </div>

          {/* Lado Direito: Status da Nuvem / Perfil / Botão Sair */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Indicador de Conexão */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                isSupabaseConfigured
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
              title={
                isSupabaseConfigured
                  ? "Sincronizado com Supabase Cloud"
                  : "Armazenamento local persistente ativo"
              }
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[11px]">
                {isSupabaseConfigured ? "Supabase Nuvem" : "Banco Local"}
              </span>
            </div>

            {isLoggedIn ? (
              <>
                {/* Avatar Pill */}
                <div className="flex items-center gap-2 pl-1 sm:pl-2">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow-xs ring-2 ring-slate-100">
                    {formattedName.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-slate-800 hidden lg:inline">
                    {formattedName}
                  </span>
                </div>

                {/* Botão Sair Clean & Moderno */}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all focus:outline-none active:scale-95 shadow-2xs"
                  title="Sair da sua conta"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all focus:outline-none active:scale-95 shadow-xs"
                title="Acessar sua conta ou criar cadastro gratuito"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar / Cadastrar</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Drawer Lateral Moderno (Menu Hambúrguer) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="relative w-84 max-w-full bg-white h-full shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-250 border-r border-slate-200">
            <div>
              {/* Topo do Drawer */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                    <Compass className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                      Janela Financeira
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Painel de Controle
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navegação de Telas */}
              <nav className="mt-6 space-y-1.5">
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Módulos & Telas
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white flex items-center justify-between shadow-xs transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span>1. Lançamentos e Análise</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-black px-2 py-0.5 rounded-full">
                    Ativo
                  </span>
                </button>

                <div className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 bg-slate-50/50 flex items-center justify-between cursor-not-allowed">
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                    <span>2. Janela de Metas & Sonhos</span>
                  </div>
                  <span className="text-[10px] bg-slate-200/60 text-slate-500 font-medium px-2 py-0.5 rounded-full">
                    Fase 2
                  </span>
                </div>

                <div className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 bg-slate-50/50 flex items-center justify-between cursor-not-allowed">
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-slate-400" />
                    <span>3. Fechamento de Faturas</span>
                  </div>
                  <span className="text-[10px] bg-slate-200/60 text-slate-500 font-medium px-2 py-0.5 rounded-full">
                    Fase 3
                  </span>
                </div>
              </nav>

              {/* Informações da Infraestrutura */}
              <div className="mt-8 pt-5 border-t border-slate-100">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Conexão de Dados
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <span>{isSupabaseConfigured ? "Supabase Cloud" : "Banco Local"}</span>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSupabaseConfigured ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {isSupabaseConfigured
                      ? "Seus dados estão protegidos por RLS no PostgreSQL em nuvem."
                      : "Armazenamento local ativo. Seus lançamentos estão salvos no seu computador."}
                  </p>
                </div>
              </div>
            </div>

            {/* Rodapé do Menu */}
            <div className="pt-4 border-t border-slate-100">
              {isLoggedIn ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs border border-slate-200">
                      {formattedName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{formattedName}</div>
                      <div className="text-[10px] text-slate-400">Janela Financeira v1.0</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Sair da conta"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onOpenAuth) onOpenAuth();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Entrar / Cadastrar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
