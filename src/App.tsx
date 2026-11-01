import React, { useState, useEffect, useMemo } from "react";
import { Header } from "./components/layout/Header";
import { CategoryPills } from "./components/categories/CategoryPills";
import { SalaryButton } from "./components/categories/SalaryButton";
import { OpportunityWindow } from "./components/opportunity/OpportunityWindow";

// Modals
import { SalaryModal } from "./components/categories/Modals/SalaryModal";
import { IncomesModal } from "./components/categories/Modals/IncomesModal";
import { FixedExpensesModal } from "./components/categories/Modals/FixedExpensesModal";
import { CreditCardsModal } from "./components/categories/Modals/CreditCardsModal";
import { SubscriptionsModal } from "./components/categories/Modals/SubscriptionsModal";
import { InvestmentsModal } from "./components/categories/Modals/InvestmentsModal";
import { LeisureModal } from "./components/categories/Modals/LeisureModal";
import { CategoryLimitModal } from "./components/categories/Modals/CategoryLimitModal";

// Libs & Storage
import { StorageService } from "./lib/storage";
import {
  UserProfile,
  CategoryLimit,
  CategoryKey,
  Income,
  FixedExpense,
  CreditCard,
  CreditCardPurchase,
  Subscription,
  Investment,
  LeisureExpense,
  SimulatedPurchase,
} from "./lib/types";
import {
  calculate12MonthProjections,
  calculateFixedExpenseForMonth,
  calculateCreditCardExpenseForMonth,
} from "./lib/calculations";
import { getCurrentYearMonth } from "./lib/utils";

export function App() {
  const currentMonth = getCurrentYearMonth();

  // State
  const [profile, setProfile] = useState<UserProfile>(StorageService.getUserProfile());
  const [limits, setLimits] = useState<CategoryLimit[]>(StorageService.getCategoryLimits());
  const [incomes, setIncomes] = useState<Income[]>(StorageService.getIncomes());
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>(StorageService.getFixedExpenses());
  const [creditCards, setCreditCards] = useState<CreditCard[]>(StorageService.getCreditCards());
  const [cardPurchases, setCardPurchases] = useState<CreditCardPurchase[]>(StorageService.getCreditCardPurchases());
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(StorageService.getSubscriptions());
  const [investments, setInvestments] = useState<Investment[]>(StorageService.getInvestments());
  const [leisureExpenses, setLeisureExpenses] = useState<LeisureExpense[]>(StorageService.getLeisureExpenses());
  const [simulation, setSimulation] = useState<SimulatedPurchase | null>(StorageService.getSimulatedPurchase());

  // Active Modals
  const [activeModal, setActiveModal] = useState<CategoryKey | "salary" | null>(null);
  const [limitModalCategory, setLimitModalCategory] = useState<CategoryKey | null>(null);

  // Totais do mês atual por categoria para badges e tetos
  const categoryTotals = useMemo(() => {
    // 1. Entradas
    const totalIncomes = incomes
      .filter((i) => i.yearMonth === currentMonth || i.isRecurring)
      .reduce((s, i) => s + i.amount, 0);

    // 2. Despesas Fixas (com histórico e média)
    const totalFixed = fixedExpenses.reduce((s, exp) => {
      return s + calculateFixedExpenseForMonth(exp, currentMonth);
    }, 0);

    // 3. Cartão de Crédito
    const totalCards = calculateCreditCardExpenseForMonth(cardPurchases, currentMonth);

    // 4. Assinaturas
    const totalSubs = subscriptions
      .filter((s) => s.isActive)
      .reduce((s, sub) => s + sub.amount, 0);

    // 5. Investimentos
    const totalInvs = investments
      .filter((i) => i.yearMonth === currentMonth)
      .reduce((s, i) => s + i.amount, 0);

    // 6. Diversão
    const totalLeisure = leisureExpenses
      .filter((l) => l.yearMonth === currentMonth)
      .reduce((s, l) => s + l.amount, 0);

    return {
      entradas: totalIncomes,
      despesas_fixas: totalFixed,
      cartao_credito: totalCards,
      assinaturas: totalSubs,
      investimentos: totalInvs,
      diversao: totalLeisure,
    };
  }, [incomes, fixedExpenses, cardPurchases, subscriptions, investments, leisureExpenses, currentMonth]);

  // Projeções dos 12 meses
  const projections = useMemo(() => {
    return calculate12MonthProjections(
      profile,
      incomes,
      fixedExpenses,
      cardPurchases,
      subscriptions,
      leisureExpenses,
      simulation,
      currentMonth
    );
  }, [profile, incomes, fixedExpenses, cardPurchases, subscriptions, leisureExpenses, simulation, currentMonth]);

  // Handlers para Salvar e Atualizar
  const handleSaveProfile = (updated: UserProfile) => {
    setProfile(updated);
    StorageService.saveUserProfile(updated);
  };

  const handleSaveLimit = (cat: CategoryKey, limit: number) => {
    StorageService.saveCategoryLimit(cat, limit);
    setLimits(StorageService.getCategoryLimits());
  };

  // Fixed Expenses
  const handleSaveFixedExpense = (exp: FixedExpense) => {
    StorageService.saveFixedExpense(exp);
    setFixedExpenses(StorageService.getFixedExpenses());
  };

  const handleDeleteFixedExpense = (id: string) => {
    StorageService.deleteFixedExpense(id);
    setFixedExpenses(StorageService.getFixedExpenses());
  };

  const handleUpdateFixedExpenseMonth = (id: string, month: string, amount: number) => {
    StorageService.updateFixedExpenseMonth(id, month, amount);
    setFixedExpenses(StorageService.getFixedExpenses());
  };

  // Credit Cards
  const handleSaveCard = (card: CreditCard) => {
    StorageService.saveCreditCard(card);
    setCreditCards(StorageService.getCreditCards());
  };

  const handleDeleteCard = (id: string) => {
    StorageService.deleteCreditCard(id);
    setCreditCards(StorageService.getCreditCards());
  };

  const handleSaveCardPurchase = (purchase: CreditCardPurchase) => {
    StorageService.saveCreditCardPurchase(purchase);
    setCardPurchases(StorageService.getCreditCardPurchases());
  };

  const handleDeleteCardPurchase = (id: string) => {
    StorageService.deleteCreditCardPurchase(id);
    setCardPurchases(StorageService.getCreditCardPurchases());
  };

  // Subscriptions
  const handleSaveSubscription = (sub: Subscription) => {
    StorageService.saveSubscription(sub);
    setSubscriptions(StorageService.getSubscriptions());
  };

  const handleToggleSubscription = (id: string) => {
    StorageService.toggleSubscription(id);
    setSubscriptions(StorageService.getSubscriptions());
  };

  const handleDeleteSubscription = (id: string) => {
    StorageService.deleteSubscription(id);
    setSubscriptions(StorageService.getSubscriptions());
  };

  // Incomes
  const handleSaveIncome = (inc: Income) => {
    StorageService.saveIncome(inc);
    setIncomes(StorageService.getIncomes());
  };

  const handleDeleteIncome = (id: string) => {
    StorageService.deleteIncome(id);
    setIncomes(StorageService.getIncomes());
  };

  // Investments
  const handleSaveInvestment = (inv: Investment) => {
    StorageService.saveInvestment(inv);
    setInvestments(StorageService.getInvestments());
  };

  const handleDeleteInvestment = (id: string) => {
    StorageService.deleteInvestment(id);
    setInvestments(StorageService.getInvestments());
  };

  // Leisure
  const handleSaveLeisure = (lei: LeisureExpense) => {
    StorageService.saveLeisureExpense(lei);
    setLeisureExpenses(StorageService.getLeisureExpenses());
  };

  const handleDeleteLeisure = (id: string) => {
    StorageService.deleteLeisureExpense(id);
    setLeisureExpenses(StorageService.getLeisureExpenses());
  };

  // Simulation
  const handleSaveSimulation = (sim: SimulatedPurchase | null) => {
    setSimulation(sim);
    StorageService.saveSimulatedPurchase(sim);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* 1. Header Superior com Navegação e Boas-Vindas */}
      <Header userName={profile.name || "SANTIAGO"} />

      {/* 2. Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Título da Tela e Botão de Salário */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
            TELA DE LANÇAMENTOS E ANALISE FINANCEIRA
          </h1>

          <div className="self-start sm:self-auto">
            <SalaryButton
              salary={profile.salary}
              onClick={() => setActiveModal("salary")}
            />
          </div>
        </div>

        {/* 3. Botões de Lançamento / Categorias (Pills) */}
        <CategoryPills
          categoryTotals={categoryTotals}
          limits={limits}
          onOpenCategory={(cat) => setActiveModal(cat)}
          onOpenLimitModal={(cat) => setLimitModalCategory(cat)}
        />

        {/* 4. Janela de Oportunidades e Gráfico de Projeção */}
        <OpportunityWindow
          simulation={simulation}
          onSaveSimulation={handleSaveSimulation}
          projections={projections}
        />
      </main>

      {/* 5. Modais de Cadastro e Edição */}
      <SalaryModal
        isOpen={activeModal === "salary"}
        onClose={() => setActiveModal(null)}
        userProfile={profile}
        onSave={handleSaveProfile}
      />

      <IncomesModal
        isOpen={activeModal === "entradas"}
        onClose={() => setActiveModal(null)}
        incomes={incomes}
        onSaveIncome={handleSaveIncome}
        onDeleteIncome={handleDeleteIncome}
      />

      <FixedExpensesModal
        isOpen={activeModal === "despesas_fixas"}
        onClose={() => setActiveModal(null)}
        expenses={fixedExpenses}
        onSaveExpense={handleSaveFixedExpense}
        onDeleteExpense={handleDeleteFixedExpense}
        onUpdateMonthValue={handleUpdateFixedExpenseMonth}
      />

      <CreditCardsModal
        isOpen={activeModal === "cartao_credito"}
        onClose={() => setActiveModal(null)}
        cards={creditCards}
        purchases={cardPurchases}
        onSaveCard={handleSaveCard}
        onDeleteCard={handleDeleteCard}
        onSavePurchase={handleSaveCardPurchase}
        onDeletePurchase={handleDeleteCardPurchase}
      />

      <SubscriptionsModal
        isOpen={activeModal === "assinaturas"}
        onClose={() => setActiveModal(null)}
        subscriptions={subscriptions}
        onSaveSubscription={handleSaveSubscription}
        onToggleSubscription={handleToggleSubscription}
        onDeleteSubscription={handleDeleteSubscription}
      />

      <InvestmentsModal
        isOpen={activeModal === "investimentos"}
        onClose={() => setActiveModal(null)}
        investments={investments}
        onSaveInvestment={handleSaveInvestment}
        onDeleteInvestment={handleDeleteInvestment}
      />

      <LeisureModal
        isOpen={activeModal === "diversao"}
        onClose={() => setActiveModal(null)}
        expenses={leisureExpenses}
        onSaveExpense={handleSaveLeisure}
        onDeleteExpense={handleDeleteLeisure}
      />

      <CategoryLimitModal
        isOpen={limitModalCategory !== null}
        onClose={() => setLimitModalCategory(null)}
        category={limitModalCategory}
        currentLimit={
          limitModalCategory
            ? limits.find((l) => l.category === limitModalCategory)?.monthlyLimit || 0
            : 0
        }
        currentTotal={
          limitModalCategory ? categoryTotals[limitModalCategory] || 0 : 0
        }
        onSaveLimit={handleSaveLimit}
      />
    </div>
  );
}

export default App;
