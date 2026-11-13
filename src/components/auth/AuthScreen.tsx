import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  Compass,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: (user: any) => void;
}

// Ícones Vetoriais Nativos (Instagram & GitHub)
const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [isRecovering, setIsRecovering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setErrorMsg("Conexão com Supabase não inicializada. Verifique suas variáveis.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        if (
          error.message.includes("Invalid login credentials") ||
          error.message.includes("invalid_credentials")
        ) {
          throw new Error("E-mail ou senha incorretos.");
        }
        if (error.message.includes("Email not confirmed")) {
          throw new Error(
            "E-mail ainda não confirmado. Verifique sua caixa de entrada para ativar sua conta."
          );
        }
        throw error;
      }

      if (data.user) {
        setSuccessMsg("Login realizado com sucesso! Carregando suas finanças...");
        setTimeout(() => {
          onAuthSuccess(data.user);
        }, 500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao realizar login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setErrorMsg("Conexão com Supabase não inicializada. Verifique suas variáveis.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const trimmedName = name.trim() || "Usuário";
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            name: trimmedName,
          },
        },
      });

      if (error) {
        if (
          error.message.includes("User already registered") ||
          error.message.includes("already registered")
        ) {
          throw new Error("Este e-mail já possui cadastro. Acesse a aba 'Entrar'.");
        }
        throw error;
      }

      if (data.user) {
        // Inicializa o perfil na tabela user_profiles
        try {
          await supabase.from("user_profiles").upsert({
            id: data.user.id,
            name: trimmedName,
            salary: 0,
            safety_margin_percent: 25,
          });
        } catch {
          // Caso a tabela tenha RLS antes da confirmação, segue o fluxo
        }

        if (data.session) {
          setSuccessMsg("Conta criada com sucesso! Conectando à ferramenta...");
          setTimeout(() => {
            onAuthSuccess(data.user);
          }, 800);
        } else {
          setSuccessMsg(
            "Conta criada com sucesso! Se a confirmação de e-mail estiver ativa, confira sua caixa de entrada ou faça login na aba 'Entrar'."
          );
          setTab("login");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setErrorMsg("Conexão com Supabase não inicializada.");
      return;
    }

    if (!email) {
      setErrorMsg("Informe seu e-mail para recuperar a senha.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });

      if (error) throw error;

      setSuccessMsg(
        "Link de recuperação enviado! Verifique sua caixa de entrada e spam."
      );
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao solicitar recuperação de senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100/90 via-[#f8fafc] to-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Bloco Superior: Logo em Nível de Código (Vetor Puro e Nítido) */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <div className="bg-white px-5 py-3.5 rounded-3xl border border-slate-200/90 shadow-md shadow-slate-200/60 mb-3.5 inline-flex items-center gap-3 transition-all hover:shadow-lg">
            {/* Ícone Container Dark com Bússola Esmeralda */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white flex items-center justify-center shadow-xs shadow-slate-900/20 border border-slate-700/60 shrink-0">
              <Compass className="w-6 h-6 text-emerald-400 stroke-[2.2]" />
            </div>

            {/* Tipografia Oficial da Marca */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 text-xl tracking-tight leading-none">
                  Janela<span className="text-emerald-600">Financeira</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200/90 leading-none">
                  Preditiva
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 tracking-wide mt-1 leading-none">
                Controle & Janela de Oportunidades
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xs sm:max-w-sm mx-auto leading-relaxed font-medium">
            Simulador preditivo dos próximos 12 meses. Identifique o momento seguro para suas compras e aquisições.
          </p>
        </div>

        {/* Card Principal de Autenticação */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8 transition-all">
          {/* Seletor de Abas (Entrar / Cadastrar) quando não estiver em recuperação */}
          {!isRecovering ? (
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  resetForm();
                }}
                className={`py-2.5 rounded-xl transition-all duration-150 ${
                  tab === "login"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Entrar na Conta
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("signup");
                  resetForm();
                }}
                className={`py-2.5 rounded-xl transition-all duration-150 ${
                  tab === "signup"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Criar Cadastro
              </button>
            </div>
          ) : (
            <div className="mb-6 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsRecovering(false);
                  resetForm();
                }}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Voltar ao login"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-slate-800">
                Recuperação de Senha
              </span>
            </div>
          )}

          {/* Mensagens de Feedback */}
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 mb-4 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span className="font-medium leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800 mb-4 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span className="font-semibold leading-relaxed">{successMsg}</span>
            </div>
          )}

          {/* Fluxo: Recuperação de Senha */}
          {isRecovering ? (
            <form onSubmit={handlePasswordRecovery} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Digite o e-mail cadastrado. Enviaremos um link seguro para você redefinir sua senha.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  E-mail cadastrado
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-950 text-white font-bold text-xs sm:text-sm hover:bg-slate-900 transition-all shadow-md active:scale-98 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Enviando link...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4 text-emerald-400" />
                      <span>Enviar Link de Recuperação</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Fluxo: Login ou Cadastro */
            <form
              onSubmit={tab === "login" ? handleLogin : handleSignUp}
              className="space-y-4"
            >
              {tab === "signup" && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Seu Nome
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Santiago Oliveira"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Senha
                  </label>
                  {tab === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsRecovering(true);
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder={
                      tab === "signup" ? "Mínimo 6 caracteres" : "Sua senha"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    title={showPassword ? "Ocultar senha" : "Ver senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-950 text-white font-bold text-xs sm:text-sm hover:bg-slate-900 transition-all shadow-md active:scale-98 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Conectando...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {tab === "login"
                          ? "Acessar Janela Financeira"
                          : "Criar Conta & Começar"}
                      </span>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Garantia de Privacidade e Segurança */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Dados protegidos com isolamento RLS e criptografia no PostgreSQL.
            </span>
          </div>
        </div>

        {/* Rodapé Informativo & Créditos */}
        <div className="text-center mt-6 space-y-2.5">
          <p className="text-xs font-semibold text-slate-400 tracking-wide">
            Janela Financeira • Controle & Aquisições Preditivas
          </p>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>Desenvolvido por</span>
            <span className="font-bold text-slate-800">Santiago Oliveira</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-0.5">
            <a
              href="https://www.instagram.com/santiagowebart/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50/50 shadow-2xs transition-all text-xs font-semibold active:scale-95"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
              <span>Instagram</span>
            </a>

            <a
              href="https://github.com/Santiigas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 shadow-2xs transition-all text-xs font-semibold active:scale-95"
            >
              <GithubIcon className="w-3.5 h-3.5 text-slate-900" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};