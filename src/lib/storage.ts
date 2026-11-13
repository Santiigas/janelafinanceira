import {
  UserProfile,
  CategoryLimit,
  Income,
  FixedExpense,
  CreditCard,
  CreditCardPurchase,
  Subscription,
  Investment,
  LeisureExpense,
  SimulatedPurchase,
  CategoryKey,
} from "./types";
import { getCurrentYearMonth } from "./utils";

const STORAGE_KEYS = {
  PROFILE: "janela_financeira_user_profile",
  LIMITS: "janela_financeira_category_limits",
  INCOMES: "janela_financeira_incomes",
  FIXED_EXPENSES: "janela_financeira_fixed_expenses",
  CREDIT_CARDS: "janela_financeira_credit_cards",
  CARD_PURCHASES: "janela_financeira_card_purchases",
  SUBSCRIPTIONS: "janela_financeira_subscriptions",
  INVESTMENTS: "janela_financeira_investments",
  LEISURE: "janela_financeira_leisure",
  SIMULATION: "janela_financeira_simulation",
};

const DEFAULT_PROFILE: UserProfile = {
  id: "user_santiago",
  name: "Santiago",
  salary: 0,
  safetyMarginPercent: 25,
};

const DEFAULT_LIMITS: CategoryLimit[] = [
  { category: "despesas_fixas", monthlyLimit: 0 },
  { category: "cartao_credito", monthlyLimit: 0 },
  { category: "assinaturas", monthlyLimit: 0 },
  { category: "diversao", monthlyLimit: 0 },
];

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Erro ao carregar chave ${key}:`, e);
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Erro ao salvar chave ${key}:`, e);
  }
}

export const StorageService = {
  getUserProfile(): UserProfile {
    return getFromStorage<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  },

  saveUserProfile(profile: UserProfile): void {
    setToStorage(STORAGE_KEYS.PROFILE, profile);
  },

  getCategoryLimits(): CategoryLimit[] {
    return getFromStorage<CategoryLimit[]>(STORAGE_KEYS.LIMITS, DEFAULT_LIMITS);
  },

  saveCategoryLimit(category: CategoryKey, limit: number): void {
    const limits = this.getCategoryLimits();
    const existingIndex = limits.findIndex((l) => l.category === category);
    if (existingIndex >= 0) {
      limits[existingIndex].monthlyLimit = limit;
    } else {
      limits.push({ category, monthlyLimit: limit });
    }
    setToStorage(STORAGE_KEYS.LIMITS, limits);
  },

  getIncomes(): Income[] {
    return getFromStorage<Income[]>(STORAGE_KEYS.INCOMES, []);
  },

  saveIncome(income: Income): void {
    const incomes = this.getIncomes();
    const index = incomes.findIndex((i) => i.id === income.id);
    if (index >= 0) {
      incomes[index] = income;
    } else {
      incomes.unshift(income);
    }
    setToStorage(STORAGE_KEYS.INCOMES, incomes);
  },

  deleteIncome(id: string): void {
    const incomes = this.getIncomes().filter((i) => i.id !== id);
    setToStorage(STORAGE_KEYS.INCOMES, incomes);
  },

  getFixedExpenses(): FixedExpense[] {
    return getFromStorage<FixedExpense[]>(STORAGE_KEYS.FIXED_EXPENSES, []);
  },

  saveFixedExpense(expense: FixedExpense): void {
    const expenses = this.getFixedExpenses();
    const index = expenses.findIndex((e) => e.id === expense.id);
    if (index >= 0) {
      expenses[index] = expense;
    } else {
      expenses.push(expense);
    }
    setToStorage(STORAGE_KEYS.FIXED_EXPENSES, expenses);
  },

  deleteFixedExpense(id: string): void {
    const expenses = this.getFixedExpenses().filter((e) => e.id !== id);
    setToStorage(STORAGE_KEYS.FIXED_EXPENSES, expenses);
  },

  updateFixedExpenseMonth(
    expenseId: string,
    yearMonth: string,
    actualAmount: number
  ): void {
    const expenses = this.getFixedExpenses();
    const exp = expenses.find((e) => e.id === expenseId);
    if (!exp) return;

    if (!exp.entries) exp.entries = [];
    const entryIdx = exp.entries.findIndex((e) => e.yearMonth === yearMonth);
    if (entryIdx >= 0) {
      exp.entries[entryIdx].actualAmount = actualAmount;
    } else {
      exp.entries.push({
        id: Math.random().toString(36).substring(2, 9),
        fixedExpenseId: expenseId,
        yearMonth,
        actualAmount,
      });
    }
    setToStorage(STORAGE_KEYS.FIXED_EXPENSES, expenses);
  },

  getCreditCards(): CreditCard[] {
    return getFromStorage<CreditCard[]>(STORAGE_KEYS.CREDIT_CARDS, [
      { id: "card_default", name: "Cartão Principal", color: "#881337" },
    ]);
  },

  saveCreditCard(card: CreditCard): void {
    const cards = this.getCreditCards();
    const index = cards.findIndex((c) => c.id === card.id);
    if (index >= 0) {
      cards[index] = card;
    } else {
      cards.push(card);
    }
    setToStorage(STORAGE_KEYS.CREDIT_CARDS, cards);
  },

  deleteCreditCard(id: string): void {
    const cards = this.getCreditCards().filter((c) => c.id !== id);
    setToStorage(STORAGE_KEYS.CREDIT_CARDS, cards);
  },

  getCreditCardPurchases(): CreditCardPurchase[] {
    return getFromStorage<CreditCardPurchase[]>(STORAGE_KEYS.CARD_PURCHASES, []);
  },

  saveCreditCardPurchase(purchase: CreditCardPurchase): void {
    const purchases = this.getCreditCardPurchases();
    const index = purchases.findIndex((p) => p.id === purchase.id);
    if (index >= 0) {
      purchases[index] = purchase;
    } else {
      purchases.unshift(purchase);
    }
    setToStorage(STORAGE_KEYS.CARD_PURCHASES, purchases);
  },

  deleteCreditCardPurchase(id: string): void {
    const purchases = this.getCreditCardPurchases().filter((p) => p.id !== id);
    setToStorage(STORAGE_KEYS.CARD_PURCHASES, purchases);
  },

  getSubscriptions(): Subscription[] {
    return getFromStorage<Subscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, []);
  },

  saveSubscription(subscription: Subscription): void {
    const subs = this.getSubscriptions();
    const index = subs.findIndex((s) => s.id === subscription.id);
    if (index >= 0) {
      subs[index] = subscription;
    } else {
      subs.push(subscription);
    }
    setToStorage(STORAGE_KEYS.SUBSCRIPTIONS, subs);
  },

  toggleSubscription(id: string): void {
    const subs = this.getSubscriptions();
    const sub = subs.find((s) => s.id === id);
    if (sub) {
      sub.isActive = !sub.isActive;
      setToStorage(STORAGE_KEYS.SUBSCRIPTIONS, subs);
    }
  },

  deleteSubscription(id: string): void {
    const subs = this.getSubscriptions().filter((s) => s.id !== id);
    setToStorage(STORAGE_KEYS.SUBSCRIPTIONS, subs);
  },

  getInvestments(): Investment[] {
    return getFromStorage<Investment[]>(STORAGE_KEYS.INVESTMENTS, []);
  },

  saveInvestment(investment: Investment): void {
    const invs = this.getInvestments();
    const index = invs.findIndex((i) => i.id === investment.id);
    if (index >= 0) {
      invs[index] = investment;
    } else {
      invs.unshift(investment);
    }
    setToStorage(STORAGE_KEYS.INVESTMENTS, invs);
  },

  deleteInvestment(id: string): void {
    const invs = this.getInvestments().filter((i) => i.id !== id);
    setToStorage(STORAGE_KEYS.INVESTMENTS, invs);
  },

  getLeisureExpenses(): LeisureExpense[] {
    return getFromStorage<LeisureExpense[]>(STORAGE_KEYS.LEISURE, []);
  },

  saveLeisureExpense(expense: LeisureExpense): void {
    const expenses = this.getLeisureExpenses();
    const index = expenses.findIndex((e) => e.id === expense.id);
    if (index >= 0) {
      expenses[index] = expense;
    } else {
      expenses.unshift(expense);
    }
    setToStorage(STORAGE_KEYS.LEISURE, expenses);
  },

  deleteLeisureExpense(id: string): void {
    const expenses = this.getLeisureExpenses().filter((e) => e.id !== id);
    setToStorage(STORAGE_KEYS.LEISURE, expenses);
  },

  getSimulatedPurchase(): SimulatedPurchase | null {
    return getFromStorage<SimulatedPurchase | null>(STORAGE_KEYS.SIMULATION, {
      id: "sim_default",
      title: "Ex: Cadeira de Escritório",
      totalAmount: 1000,
      installmentsCount: 10,
      startYearMonth: getCurrentYearMonth(),
      isActive: false,
    });
  },

  saveSimulatedPurchase(simulation: SimulatedPurchase | null): void {
    setToStorage(STORAGE_KEYS.SIMULATION, simulation);
  },

  clearUserData(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  },
};

