import React, { useState } from "react";
import { Modal } from "../../ui/Modal";
import { CreditCard, CreditCardPurchase } from "../../../lib/types";
import { formatCurrency, getCurrentYearMonth, generateId, addMonths } from "../../../lib/utils";
import { CreditCard as CardIcon, Plus, Trash2, Calendar, Check } from "lucide-react";

interface CreditCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: CreditCard[];
  purchases: CreditCardPurchase[];
  onSaveCard: (card: CreditCard) => void;
  onDeleteCard: (id: string) => void;
  onSavePurchase: (purchase: CreditCardPurchase) => void;
  onDeletePurchase: (id: string) => void;
}

export const CreditCardsModal: React.FC<CreditCardsModalProps> = ({
  isOpen,
  onClose,
  cards,
  purchases,
  onSaveCard,
  onDeleteCard,
  onSavePurchase,
  onDeletePurchase,
}) => {
  const currentMonth = getCurrentYearMonth();
  const [selectedCardId, setSelectedCardId] = useState<string>(
    cards[0]?.id || "card_default"
  );
  const [showAddPurchase, setShowAddPurchase] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  // Purchase Form
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [installments, setInstallments] = useState("1");
  const [startMonth, setStartMonth] = useState(currentMonth);

  // New Card Form
  const [newCardName, setNewCardName] = useState("");
  const [newCardColor, setNewCardColor] = useState("#881337");

  const handleCreatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !selectedCardId) return;

    const total = parseFloat(totalAmount.replace(",", ".")) || 0;
    const count = parseInt(installments) || 1;
    const installmentVal = count > 0 ? total / count : total;

    const purchase: CreditCardPurchase = {
      id: generateId(),
      cardId: selectedCardId,
      description: description.trim(),
      totalAmount: total,
      installmentsCount: count,
      installmentAmount: Math.round(installmentVal * 100) / 100,
      startYearMonth: startMonth,
    };

    onSavePurchase(purchase);
    setDescription("");
    setTotalAmount("");
    setInstallments("1");
    setShowAddPurchase(false);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardName.trim()) return;

    const newCard: CreditCard = {
      id: generateId(),
      name: newCardName.trim(),
      color: newCardColor,
    };

    onSaveCard(newCard);
    setSelectedCardId(newCard.id);
    setNewCardName("");
    setShowAddCard(false);
  };

  const filteredPurchases = selectedCardId === "all"
    ? purchases
    : purchases.filter((p) => p.cardId === selectedCardId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cartões de Crédito & Parcelamentos"
      subtitle="Escolha o cartão para lançar e visualize as parcelas nos meses futuros"
      maxWidth="xl"
    >
      {/* 1. Escolha de Cartão (Header com Abas) */}
      <div className="space-y-2 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Selecione o Cartão
          </label>
          {!showAddCard && (
            <button
              onClick={() => setShowAddCard(true)}
              className="text-[11px] font-bold text-[#881337] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Adicionar Outro Cartão
            </button>
          )}
        </div>

        {showAddCard && (
          <form onSubmit={handleCreateCard} className="flex gap-2 p-3 bg-rose-50 rounded-xl border border-rose-200">
            <input
              type="text"
              required
              placeholder="Nome do cartão (ex: Nubank, Inter, XP)"
              value={newCardName}
              onChange={(e) => setNewCardName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#881337] text-white text-xs font-bold rounded-lg"
            >
              Salvar Cartão
            </button>
            <button
              type="button"
              onClick={() => setShowAddCard(false)}
              className="text-xs text-slate-400 hover:text-slate-600 px-2"
            >
              Cancelar
            </button>
          </form>
        )}

        {/* Pills dos Cartões */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCardId("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              selectedCardId === "all"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Todos os Cartões ({purchases.length})
          </button>
          {cards.map((card) => {
            const count = purchases.filter((p) => p.cardId === card.id).length;
            const isSelected = selectedCardId === card.id;
            return (
              <button
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isSelected
                    ? "bg-[#881337] text-white border-[#881337] shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <CardIcon className="w-3.5 h-3.5" />
                <span>{card.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Botão de Lançar Nova Compra */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase">
          Compras Lançadas
        </span>
        {!showAddPurchase && selectedCardId !== "all" && (
          <button
            onClick={() => setShowAddPurchase(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#881337] text-white hover:bg-[#70102e] text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Lançar Compra neste Cartão
          </button>
        )}
      </div>

      {/* Form de Nova Compra */}
      {showAddPurchase && (
        <form onSubmit={handleCreatePurchase} className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#881337] uppercase">
              Nova Compra no Cartão: {cards.find((c) => c.id === selectedCardId)?.name}
            </h4>
            <button
              type="button"
              onClick={() => setShowAddPurchase(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Descrição da Compra
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Cadeira de escritório, Supermercado, Eletrônico"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#881337]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Valor Total (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#881337]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Parcelamento
              </label>
              <select
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#881337] bg-white font-semibold"
              >
                <option value="1">1x à vista</option>
                {Array.from({ length: 47 }, (_, i) => i + 2).map((num) => {
                  const val = totalAmount ? (parseFloat(totalAmount) / num).toFixed(2) : "0.00";
                  return (
                    <option key={num} value={num}>
                      {num}x {totalAmount ? `de R$ ${val}` : "parcelas"}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Mês da 1ª Parcela (YYYY-MM)
              </label>
              <input
                type="month"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#881337] bg-white font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-2 bg-[#881337] text-white text-xs font-bold rounded-lg hover:bg-[#70102e]"
            >
              <Check className="w-3.5 h-3.5" />
              Lançar no Cartão
            </button>
          </div>
        </form>
      )}

      {/* 3. Lista de Compras */}
      {filteredPurchases.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          Nenhuma compra registrada para este cartão. Clique em "Lançar Compra" acima para adicionar compras à vista ou parceladas.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
          {filteredPurchases.map((purchase) => {
            const card = cards.find((c) => c.id === purchase.cardId);
            const isInstallment = purchase.installmentsCount > 1;
            const endMonth = addMonths(purchase.startYearMonth, purchase.installmentsCount - 1);

            return (
              <div
                key={purchase.id}
                className="p-3.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 transition-colors flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      {purchase.description}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900">
                      {card?.name || "Cartão"}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {isInstallment ? `${purchase.installmentsCount}x` : "À Vista"}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                    <span>
                      Total: <strong>{formatCurrency(purchase.totalAmount)}</strong>
                    </span>
                    {isInstallment && (
                      <span className="text-[#881337] font-semibold">
                        ({purchase.installmentsCount}x de {formatCurrency(purchase.installmentAmount)})
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {purchase.startYearMonth} {isInstallment && `até ${endMonth}`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDeletePurchase(purchase.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Excluir compra"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
};

