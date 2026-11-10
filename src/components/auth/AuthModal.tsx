import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { supabase } from "../../lib/supabase";
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      setErrorMsg("Supabase não está configurado. Verifique suas variáveis .env.");
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
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("E-mail ou senha incorretos.");
        }
        throw error;
      }

      if (data.user) {
        // Busca nome no metadata ou no perfil
        const userName =
          data.user.user_metadata?.name ||
          data.user.email?.split("@")[0] ||
          "Santiago";

        setSuccessMsg("Login realizado com sucesso! Sincronizando dados...");
        setTimeout(() => {
          onAuthSuccess(userName);
          onClose();
          resetForm();
        }, 800);
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
      setErrorMsg("Supabase não está configurado. Verifique suas variáveis .env.");
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
      const trimmedName = name.trim() || "Santiago";
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
        if (error.message.includes("User already registered")) {
          throw new Error("Este e-mail já possui cadastro. Faça login.");
        }
        throw error;
      }

      if (data.user) {
        // Cria perfil inicial no Supabase
        await supabase.from("user_profiles").upsert({
          id: data.user.id,
          name: trimmedName,
          salary: 0,
          safety_margin_percent: 25,
        });

        setSuccessMsg(
          "Conta criada com sucesso! Conectando com seu banco de dados..."
        );
        setTimeout(() => {
          onAuthSuccess(trimmedName);
          onClose();
          resetForm();
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tab === "login" ? "Acessar sua Conta" : "Criar Nova Conta"}
      subtitle="Conecte-se para salvar e sincronizar todos os seus dados na nuvem"
      maxWidth="md"
    >
      {/* Abas Alternadoras */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setTab("login");
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`py-2 rounded-lg transition-all ${
            tab === "login"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Entrar na Conta
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("signup");
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`py-2 rounded-lg transition-all ${
            tab === "signup"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Criar Cadastro
        </button>
      </div>

      {/* Alertas de Erro ou Sucesso */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Formulário */}
      <form
        onSubmit={tab === "login" ? handleLogin : handleSignUp}
        className="space-y-3.5"
      >
        {tab === "signup" && (
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              Seu Nome
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                placeholder="Ex: Santiago"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold text-slate-900"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
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
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
            Senha
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold text-slate-900"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processando...</span>
              </>
            ) : (
              <>
                <span>
                  {tab === "login" ? "Entrar na Conta" : "Criar Conta & Sincronizar"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protegido por Supabase & Row Level Security (RLS)</span>
        </div>
      </form>
    </Modal>
  );
};

