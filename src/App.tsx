import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { AuthModal } from "./components/auth/AuthModal";

// Libs, Storage & Supabase
import { StorageService } from "./lib/storage";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import { SupabaseService } from "./lib/supabaseService";
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
import { Cloud, CloudCheck, Loader2 } from "lucide-react";

export function App() {
  const currentMonth = getCurrentYearMonth();

  // Auth & Cloud State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Financial Domain States
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

  // Função para carregar todos os dados do Supabase
  const loadCloudData = useCallback(async (userId: string, userNameFallback?: string) => {
    setIsSyncing(true);
    try {
      const [
        cloudProfile,
        cloudLimits,
        cloudIncomes,
        cloudFixed,
        cloudCards,
        cloudPurchases,
        cloudSubs,
        cloudInvs,
        cloudLeisure,
        cloudSim,
      ] = await Promise.all([
        SupabaseService.getProfile(userId),
        SupabaseService.getCategoryLimits(userId),
        SupabaseService.getIncomes(userId),
        SupabaseService.getFixedExpenses(userId),
        SupabaseService.getCreditCards(userId),
        SupabaseService.getCardPurchases(userId),
        SupabaseService.getSubscriptions(userId),
        SupabaseService.getInvestments(userId),
        SupabaseService.getLeisureExpenses(userId),
        SupabaseService.getSimulation(userId),
      ]);

      if (cloudProfile) {
        setProfile(cloudProfile);
        StorageService.saveUserProfile(cloudProfile);
      } else {
        // Inicializa perfil no Supabase se for o primeiro login
        const newProf: UserProfile = {
          id: userId,
          name: userNameFallback || "Santiago",
          salary: 0,
          safetyMarginPercent: 25,
        };
        await SupabaseService.upsertProfile(newProf);
        setProfile(newProf);
        StorageService.saveUserProfile(newProf);
      }

      if (cloudLimits.length > 0) setLimits(cloudLimits);
      setIncomes(cloudIncomes);
      setFixedExpenses(cloudFixed);
      if (cloudCards.length > 0) setCreditCards(cloudCards);
      setCardPurchases(cloudPurchases);
      setSubscriptions(cloudSubs);
      setInvestments(cloudInvs);
      setLeisureExpenses(cloudLeisure);
      if (cloudSim) setSimulation(cloudSim);
    } catch (e) {
      console.error("Erro ao sincronizar dados do Supabase:", e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Monitora sessão do Supabase ao iniciar
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        loadCloudData(
          session.user.id,
          session.user.user_metadata?.name || session.user.email?.split("@")[0]
        );
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        loadCloudData(
          session.user.id,
          session.user.user_metadata?.name || session.user.email?.split("@")[0]
        );
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadCloudData]);

  // Logout
  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setProfile(StorageService.getUserProfile());
    setIncomes(StorageService.getIncomes());
    setFixedExpenses(StorageService.getFixedExpenses());
    setCreditCards(StorageService.getCreditCards());
    setCardPurchases(StorageService.getCreditCardPurchases());
    setSubscriptions(StorageService.getSubscriptions());
    setInvestments(StorageService.getInvestments());
    setLeisureExpenses(StorageService.getLeisureExpenses());
    setSimulation(StorageService.getSimulatedPurchase());
  };

  // Totais do mês atual por categoria
  const categoryTotals = useMemo(() => {
    const totalIncomes = incomes
      .filter((i) => i.yearMonth === currentMonth || i.isRecurring)
      .reduce((s, i) => s + i.amount, 0);

    const totalFixed = fixedExpenses.reduce((s, exp) => {
      return s + calculateFixedExpenseForMonth(exp, currentMonth);
    }, 0);

    const totalCards = calculateCreditCardExpenseForMonth(cardPurchases, currentMonth);

    const totalSubs = subscriptions
      .filter((s) => s.isActive)
      .reduce((s, sub) => s + sub.amount, 0);

    const totalInvs = investments
      .filter((i) => i.yearMonth === currentMonth)
      .reduce((s, i) => s + i.amount, 0);

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

  // --- Handlers de Ação com Persistência em Nuvem ---

  const handleSaveProfile = async (updated: UserProfile) => {
    setProfile(updated);
    StorageService.saveUserProfile(updated);
    if (currentUser) {
      await SupabaseService.upsertProfile({ ...updated, id: currentUser.id });
    }
  };

  const handleSaveLimit = async (cat: CategoryKey, limit: number) => {
    StorageService.saveCategoryLimit(cat, limit);
    setLimits(StorageService.getCategoryLimits());
    if (currentUser) {
      await SupabaseService.saveCategoryLimit(currentUser.id, cat, limit);
    }
  };

  // Fixed Expenses
  const handleSaveFixedExpense = async (exp: FixedExpense) => {
    StorageService.saveFixedExpense(exp);
    setFixedExpenses(StorageService.getFixedExpenses());
    if (currentUser) {
      await SupabaseService.saveFixedExpense(currentUser.id, exp);
    }
  };

  const handleDeleteFixedExpense = async (id: string) => {
    StorageService.deleteFixedExpense(id);
    setFixedExpenses(StorageService.getFixedExpenses());
    if (currentUser) {
      await SupabaseService.deleteFixedExpense(id);
    }
  };

  const handleUpdateFixedExpenseMonth = async (id: string, month: string, amount: number) => {
    StorageService.updateFixedExpenseMonth(id, month, amount);
    setFixedExpenses(StorageService.getFixedExpenses());
    if (currentUser) {
      await SupabaseService.updateFixedExpenseMonth(currentUser.id, id, month, amount);
    }
  };

  // Credit Cards
  const handleSaveCard = async (card: CreditCard) => {
    StorageService.saveCreditCard(card);
    setCreditCards(StorageService.getCreditCards());
    if (currentUser) {
      await SupabaseService.saveCreditCard(currentUser.id, card);
    }
  };

  const handleDeleteCard = async (id: string) => {
    StorageService.deleteCreditCard(id);
    setCreditCards(StorageService.getCreditCards());
    if (currentUser) {
      await SupabaseService.deleteCreditCard(id);
    }
  };

  const handleSaveCardPurchase = async (purchase: CreditCardPurchase) => {
    StorageService.saveCreditCardPurchase(purchase);
    setCardPurchases(StorageService.getCreditCardPurchases());
    if (currentUser) {
      await SupabaseService.saveCardPurchase(currentUser.id, purchase);
    }
  };

  const handleDeleteCardPurchase = async (id: string) => {
    StorageService.deleteCreditCardPurchase(id);
    setCardPurchases(StorageService.getCreditCardPurchases());
    if (currentUser) {
      await SupabaseService.deleteCardPurchase(id);
    }
  };

  // Subscriptions
  const handleSaveSubscription = async (sub: Subscription) => {
    StorageService.saveSubscription(sub);
    setSubscriptions(StorageService.getSubscriptions());
    if (currentUser) {
      await SupabaseService.saveSubscription(currentUser.id, sub);
    }
  };

  const handleToggleSubscription = async (id: string) => {
    StorageService.toggleSubscription(id);
    const updatedSubs = StorageService.getSubscriptions();
    setSubscriptions(updatedSubs);
    const sub = updatedSubs.find((s) => s.id === id);
    if (currentUser && sub) {
      await SupabaseService.saveSubscription(currentUser.id, sub);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    StorageService.deleteSubscription(id);
    setSubscriptions(StorageService.getSubscriptions());
    if (currentUser) {
      await SupabaseService.deleteSubscription(id);
    }
  };

  // Incomes
  const handleSaveIncome = async (inc: Income) => {
    StorageService.saveIncome(inc);
    setIncomes(StorageService.getIncomes());
    if (currentUser) {
      await SupabaseService.saveIncome(currentUser.id, inc);
    }
  };

  const handleDeleteIncome = async (id: string) => {
    StorageService.deleteIncome(id);
    setIncomes(StorageService.getIncomes());
    if (currentUser) {
      await SupabaseService.deleteIncome(id);
    }
  };

  // Investments
  const handleSaveInvestment = async (inv: Investment) => {
    StorageService.saveInvestment(inv);
    setInvestments(StorageService.getInvestments());
    if (currentUser) {
      await SupabaseService.saveInvestment(currentUser.id, inv);
    }
  };

  const handleDeleteInvestment = async (id: string) => {
    StorageService.deleteInvestment(id);
    setInvestments(StorageService.getInvestments());
    if (currentUser) {
      await SupabaseService.deleteInvestment(id);
    }
  };

  // Leisure
  const handleSaveLeisure = async (lei: LeisureExpense) => {
    StorageService.saveLeisureExpense(lei);
    setLeisureExpenses(StorageService.getLeisureExpenses());
    if (currentUser) {
      await SupabaseService.saveLeisureExpense(currentUser.id, lei);
    }
  };

  const handleDeleteLeisure = async (id: string) => {
    StorageService.deleteLeisureExpense(id);
    setLeisureExpenses(StorageService.getLeisureExpenses());
    if (currentUser) {
      await SupabaseService.deleteLeisureExpense(id);
    }
  };

  // Simulation
  const handleSaveSimulation = async (sim: SimulatedPurchase | null) => {
    setSimulation(sim);
    StorageService.saveSimulatedPurchase(sim);
    if (currentUser && sim) {
      await SupabaseService.saveSimulation(currentUser.id, sim);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* 1. Header Superior com Navegação e Boas-Vindas */}
      <Header
        userName={profile.name || "Santiago"}
        isLoggedIn={Boolean(currentUser)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Sync Status Banner */}
      {isSyncing && (
        <div className="bg-emerald-600 text-white text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 animate-in fade-in">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Sincronizando seus dados com o Supabase Cloud...</span>
        </div>
      )}

      {/* 2. Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Título da Tela e Botão de Salário */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
            TELA DE LANÇAMENTOS E ANALISE FINANCEIRA
          </h1>

          <div className="self-start sm:self-auto flex items-center gap-2">
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

      {/* Modal de Autenticação Supabase */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(userName) => {
          setProfile((prev) => ({ ...prev, name: userName }));
        }}
      />
    </div>
  );
}

export default App;
