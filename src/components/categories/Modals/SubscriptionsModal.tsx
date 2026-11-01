import React, { useState } from "react";
import { Modal } from "../../ui/Modal";
import { Subscription } from "../../../lib/types";
import { formatCurrency, generateId } from "../../../lib/utils";
import { Plus, Trash2, Check, Power } from "lucide-react";

interface SubscriptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: Subscription[];
  onSaveSubscription: (sub: Subscription) => void;
  onToggleSubscription: (id: string) => void;
  onDeleteSubscription: (id: string) => void;
}

export const SubscriptionsModal: React.FC<SubscriptionsModalProps> = ({
  isOpen,
  onClose,
  subscriptions,
  onSaveSubscription,
  onToggleSubscription,
  onDeleteSubscription,
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingDay, setBillingDay] = useState("1");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedAmount = parseFloat(amount.replace(",", ".")) || 0;

    onSaveSubscription({
      id: generateId(),
      name: name.trim(),
      amount: parsedAmount,
      billingDay: parseInt(billingDay) || 1,
      isActive: true,
    });

    setName("");
    setAmount("");
    setShowAdd(false);
  };

  const totalMonthly = subscriptions
    .filter((s) => s.isActive)
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assinaturas Mensais Recorrentes"
      subtitle="Netflix, Spotify, Academia, ChatGPT, iCloud e outros serviços mensais"
      maxWidth="lg"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase">
            {subscriptions.length} {subscriptions.length === 1 ? "assinatura" : "assinaturas"}
          </span>
          {totalMonthly > 0 && (
            <span className="ml-2 text-xs font-black text-[#854d0e]">
              Total: {formatCurrency(totalMonthly)}/mês
            </span>
          )}
        </div>
        {!showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#854d0e] text-white hover:bg-[#713f12] text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Assinatura
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleSave} className="p-4 bg-yellow-50/50 rounded-2xl border border-yellow-200 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#854d0e] uppercase">Cadastrar Assinatura</h4>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Nome do Serviço
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Netflix 4K, Spotify Familiar, Academia SmartFit"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#854d0e]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Valor Mensal (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#854d0e]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Dia de Cobrança
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={billingDay}
                onChange={(e) => setBillingDay(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#854d0e]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-2 bg-[#854d0e] text-white text-xs font-bold rounded-lg hover:bg-[#713f12]"
            >
              <Check className="w-3.5 h-3.5" />
              Salvar Assinatura
            </button>
          </div>
        </form>
      )}

      {subscriptions.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          Nenhuma assinatura cadastrada ainda. Clique em "Nova Assinatura" para cadastrar seus serviços recorrentes.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
                sub.isActive
                  ? "bg-slate-50 hover:bg-white border-slate-200"
                  : "bg-slate-100/50 border-slate-200 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-extrabold text-sm ${sub.isActive ? "text-slate-900" : "text-slate-500 line-through"}`}>
                    {sub.name}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    sub.isActive ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600"
                  }`}>
                    {sub.isActive ? "Ativa" : "Pausada"}
                  </span>
                  {sub.billingDay && (
                    <span className="text-[11px] text-slate-400">
                      Dia {sub.billingDay}
                    </span>
                  )}
                </div>
                <div className="text-xs font-extrabold text-[#854d0e] mt-1">
                  {formatCurrency(sub.amount)}/mês
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleSubscription(sub.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    sub.isActive
                      ? "text-emerald-600 hover:bg-emerald-50"
                      : "text-slate-400 hover:bg-slate-200"
                  }`}
                  title={sub.isActive ? "Pausar assinatura" : "Reativar assinatura"}
                >
                  <Power className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteSubscription(sub.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

