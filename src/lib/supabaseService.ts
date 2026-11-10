import { supabase } from "./supabase";
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
} from "./types";

export const SupabaseService = {
  // --- PERFIL DO USUÁRIO ---
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar perfil:", error);
      return null;
    }
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      salary: Number(data.salary) || 0,
      safetyMarginPercent: Number(data.safety_margin_percent) || 25,
    };
  },

  async upsertProfile(profile: UserProfile): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from("user_profiles").upsert({
      id: profile.id,
      name: profile.name,
      salary: profile.salary,
      safety_margin_percent: profile.safetyMarginPercent,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Erro ao salvar perfil no Supabase:", error);
      return false;
    }
    return true;
  },

  // --- TETOS DE GASTOS ---
  async getCategoryLimits(userId: string): Promise<CategoryLimit[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("category_limits")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Erro ao buscar tetos de gastos:", error);
      return [];
    }

    return (data || []).map((row) => ({
      category: row.category as CategoryKey,
      monthlyLimit: Number(row.monthly_limit) || 0,
    }));
  },

  async saveCategoryLimit(
    userId: string,
    category: CategoryKey,
    limit: number
  ): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from("category_limits").upsert(
      {
        user_id: userId,
        category,
        monthly_limit: limit,
      },
      { onConflict: "user_id, category" }
    );

    if (error) {
      console.error("Erro ao salvar teto de gastos:", error);
      return false;
    }
    return true;
  },

  // --- ENTRADAS EXTRAS ---
  async getIncomes(userId: string): Promise<Income[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("incomes")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) {
      console.error("Erro ao buscar entradas:", error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      description: row.description,
      amount: Number(row.amount) || 0,
      date: row.date,
      yearMonth: row.year_month,
      isRecurring: row.is_recurring,
    }));
  },

  async saveIncome(userId: string, income: Income): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from("incomes").upsert({
      id: income.id,
      user_id: userId,
      description: income.description,
      amount: income.amount,
      date: income.date,
      year_month: income.yearMonth,
      is_recurring: income.isRecurring ?? false,
    });

    if (error) {
      console.error("Erro ao salvar entrada:", error);
      return false;
    }
    return true;
  },

  async deleteIncome(id: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from("incomes").delete().eq("id", id);
    if (error) {
      console.error("Erro ao excluir entrada:", error);
      return false;
    }
    return true;
  },

  // --- DESPESAS FIXAS E VARIÁVEIS ---
  async getFixedExpenses(userId: string): Promise<FixedExpense[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("fixed_expenses")
      .select("*, entries:fixed_expense_entries(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao buscar despesas fixas:", error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      expenseType: row.expense_type,
      baseAmount: Number(row.base_amount) || 0,
      dueDay: row.due_day,
      entries: (row.entries || []).map((e: any) => ({
        id: e.id,
        fixedExpenseId: e.fixed_expense_id,
        yearMonth: e.year_month,
        actualAmount: Number(e.actual_amount) || 0,
      })),
    }));
  },

  async saveFixedExpense(userId: string, expense: FixedExpense): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from("fixed_expenses").upsert({
      id: expense.id,
      user_id: userId,
      name: expense.name,
      expense_type: expense.expenseType,
      base_amount: expense.baseAmount,
      due_day: expense.dueDay,
    });

    if (error) {
      console.error("Erro ao salvar despesa fixa:", error);
      return false;
    }
    return true;
  },

  async deleteFixedExpense(id: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from("fixed_expenses").delete().eq("id", id);
    if (error) {
      console.error("Erro ao excluir despesa fixa:", error);
      return false;
    }
    return true;
  },

  async updateFixedExpenseMonth(
    userId: string,
    expenseId: string,
    yearMonth: string,
    actualAmount: number
  ): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from("fixed_expense_entries").upsert(
      {
        fixed_expense_id: expenseId,
        user_id: userId,
        year_month: yearMonth,
        actual_amount: actualAmount,
      },
      { onConflict: "fixed_expense_id, year_month" }
    );

    if (error) {
      console.error("Erro ao atualizar valor mensal de despesa fixa:", error);
      return false;
    }
    return true;
  },

  // --- CARTÕES DE CRÉDITO ---
  async getCreditCards(userId: string): Promise<CreditCard[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("credit_cards")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Erro ao buscar cartões:", error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      color: row.color,
      closingDay: row.closing_day,
      dueDay: row.due_day,
    }));
  },

  async saveCreditCard(userId: string, card: CreditCard): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from("credit_cards").upsert({
      id: card.id,
      user_id: userId,
      name: card.name,
      color: card.color,
      closing_day: card.closingDay,
      due_day: card.dueDay,
    });

    if (error) {
      console.error("Erro ao salvar cartão:", error);
      return false;
    }
    return true;
  },

  async deleteCreditCard(id: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from("credit_cards").delete().eq("id", id);
    if (error) {
      console.error("Erro ao excluir cartão:", error);
      return false;
    }
    return true;
  },

  // --- COMPRAS NO CARTÃO ---
  async getCardPurchases(userId: string): Promise<CreditCardPurchase[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("credit_card_purchases")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar compras de cartão:", error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      cardId: row.card_id,
      description: row.description,
      totalAmount: Number(row.total_amount) || 0,
      installmentsCount: Number(row.installments_count) || 1,
      installmentAmount: Number(row.installment_amount) || 0,
      startYearMonth: row.start_year_month,
    }));
  },

  async saveCardPurchase(
    userId: string,
    purchase: CreditCardPurchase
  ): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from("credit_card_purchases").upsert({
      id: purchase.id,
      user_id: userId,
      card_id: purchase.cardId,
      description: purchase.description,
      total_amount: purchase.totalAmount,
      installments_count: purchase.installmentsCount,
      installment_amount: purchase.installmentAmount,
      start_year_month: purchase.startYearMonth,
    });

    if (error) {
      console.error("Erro ao salvar compra de cartão:", error);
      return false;
    }
    return true;
  },

  async deleteCardPurchase(id: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase
      .from("credit_card_purchases")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao excluir compra de cartão:", error);
      return false;
    }
    return true;
  },

  // --- ASSINATURAS ---
  async getSubscriptions(userId: string): Promise<Subscription[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Erro ao buscar assinaturas:", error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      amount: Number(row.amount) || 0,
      billingDay: row.billing_day,
      isActive: row.is_active,
    }));
  },

  async saveSubscription(
    userId: string,
    subscription: Subscription
  ): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from("subscriptions").upsert({
      id: subscription.id,
      user_id: userId,
      name: subscription.name,
      amount: subscription.amount,
      billing_day: subscription.billingDay,
      is_active: subscription.isActive,
    });

    if (error) {
      console.error("Erro ao salvar assinatura:", error);
      return false;
    }
    return true;
  },

  async deleteSubscription(id: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from("subscriptions").delete().eq("id", id);
    if (error) {
      console.error("Erro ao excluir assinatura:", error);
      return false;
    }
    return true;
  },

  // --- INVESTIMENTOS ---
  async getInvestments(userId: string): Promise<Investment[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("investments")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Erro ao buscar investimentos:", error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      investmentType: row.investment_type,
      amount: Number(row.amount) || 0,
      date: row.date,
      yearMonth: row.year_month,
    }));
  },

  async saveInvestment(userId: string, investment: Investment): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from("investments").upsert({
      id: investment.id,
      user_id: userId,
      name: investment.name,
      investment_type: investment.investmentType,
      amount: investment.amount,
      date: investment.date,
      year_month: investment.yearMonth,
    });

    if (error) {
      console.error("Erro ao salvar investimento:", error);
      return false;
    }
    return true;
  },

  async deleteInvestment(id: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from("investments").delete().eq("id", id);
    if (error) {
      console.error("Erro ao excluir investimento:", error);
      return false;
    }
    return true;
  },

  // --- DIVERSÃO ---
  async getLeisureExpenses(userId: string): Promise<LeisureExpense[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("leisure_expenses")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Erro ao buscar gastos com lazer:", error);
      return [];
    }

    return (data || []).map((row) => ({
      id: row.id,
      description: row.description,
      amount: Number(row.amount) || 0,
      date: row.date,
      yearMonth: row.year_month,
    }));
  },

  async saveLeisureExpense(
    userId: string,
    expense: LeisureExpense
  ): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from("leisure_expenses").upsert({
      id: expense.id,
      user_id: userId,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      year_month: expense.yearMonth,
    });

    if (error) {
      console.error("Erro ao salvar diversão:", error);
      return false;
    }
    return true;
  },

  async deleteLeisureExpense(id: string): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase.from("leisure_expenses").delete().eq("id", id);
    if (error) {
      console.error("Erro ao excluir diversão:", error);
      return false;
    }
    return true;
  },

  // --- SIMULAÇÃO DE COMPRA ---
  async getSimulation(userId: string): Promise<SimulatedPurchase | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from("simulated_purchases")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar simulação:", error);
      return null;
    }
    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      totalAmount: Number(data.total_amount) || 0,
      installmentsCount: Number(data.installments_count) || 1,
      startYearMonth: data.start_year_month,
      isActive: data.is_active,
    };
  },

  async saveSimulation(
    userId: string,
    simulation: SimulatedPurchase | null
  ): Promise<boolean> {
    if (!supabase || !simulation) return false;
    const { error } = await supabase.from("simulated_purchases").upsert({
      id: simulation.id,
      user_id: userId,
      title: simulation.title,
      total_amount: simulation.totalAmount,
      installments_count: simulation.installmentsCount,
      start_year_month: simulation.startYearMonth,
      is_active: simulation.isActive,
    });

    if (error) {
      console.error("Erro ao salvar simulação:", error);
      return false;
    }
    return true;
  },
};

