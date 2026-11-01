import {
  UserProfile,
  FixedExpense,
  CreditCardPurchase,
  Subscription,
  Income,
  LeisureExpense,
  SimulatedPurchase,
  MonthFinancialSummary,
  MonthStatusColor,
} from "./types";
import { getNext12Months, getMonthDifference } from "./utils";

export function calculateFixedExpenseForMonth(
  expense: FixedExpense,
  targetYearMonth: string
): number {
  if (expense.expenseType === "fixa") {
    return expense.baseAmount;
  }

  // Variável: verifica se há lançamento específico para este mês
  const entryForMonth = expense.entries?.find(
    (e) => e.yearMonth === targetYearMonth
  );

  if (entryForMonth) {
    return entryForMonth.actualAmount;
  }

  // Se não houver lançamento no mês, calcula a média dos registros existentes
  if (expense.entries && expense.entries.length > 0) {
    const sum = expense.entries.reduce((acc, curr) => acc + curr.actualAmount, 0);
    return Math.round((sum / expense.entries.length) * 100) / 100;
  }

  return expense.baseAmount;
}

export function calculateCreditCardExpenseForMonth(
  purchases: CreditCardPurchase[],
  targetYearMonth: string
): number {
  let total = 0;

  for (const purchase of purchases) {
    const diff = getMonthDifference(purchase.startYearMonth, targetYearMonth);
    if (diff >= 0 && diff < purchase.installmentsCount) {
      total += purchase.installmentAmount;
    }
  }

  return total;
}

export function calculateMonthStatus(
  totalExpenses: number,
  totalIncome: number,
  safetyMarginPercent: number = 25
): { color: MonthStatusColor; label: string; usagePercent: number } {
  if (totalIncome <= 0) {
    return {
      color: totalExpenses > 0 ? "roxo" : "verde",
      label: totalExpenses > 0 ? "Ultrapassando limites" : "Sem movimentação",
      usagePercent: 100,
    };
  }

  const usagePercent = (totalExpenses / totalIncome) * 100;
  const safeThreshold = 100 - safetyMarginPercent; // Ex: 75%

  if (usagePercent <= safeThreshold) {
    return {
      color: "verde",
      label: "Pagando sem aperto",
      usagePercent,
    };
  } else if (usagePercent <= 90) {
    return {
      color: "azul",
      label: "Passando da barreira de folga",
      usagePercent,
    };
  } else if (usagePercent <= 100) {
    return {
      color: "vermelho",
      label: "No limite da renda",
      usagePercent,
    };
  } else {
    return {
      color: "roxo",
      label: "Ultrapassando limites",
      usagePercent,
    };
  }
}

export function calculate12MonthProjections(
  userProfile: UserProfile,
  incomes: Income[],
  fixedExpenses: FixedExpense[],
  creditCardPurchases: CreditCardPurchase[],
  subscriptions: Subscription[],
  leisureExpenses: LeisureExpense[],
  simulatedPurchase: SimulatedPurchase | null,
  startYearMonth?: string
): MonthFinancialSummary[] {
  const months = getNext12Months(startYearMonth);

  return months.map(({ key, label }) => {
    // 1. Renda: Salário + Entradas do mês
    const salary = userProfile.salary;
    const monthIncomes = incomes
      .filter((inc) => inc.yearMonth === key || inc.isRecurring)
      .reduce((sum, inc) => sum + inc.amount, 0);
    const totalIncome = salary + monthIncomes;

    // 2. Despesas Fixas (com médias se variável)
    const fixedTotal = fixedExpenses.reduce((sum, exp) => {
      return sum + calculateFixedExpenseForMonth(exp, key);
    }, 0);

    // 3. Faturas de Cartão de Crédito
    const cardTotal = calculateCreditCardExpenseForMonth(
      creditCardPurchases,
      key
    );

    // 4. Assinaturas ativas
    const subTotal = subscriptions
      .filter((s) => s.isActive)
      .reduce((sum, s) => sum + s.amount, 0);

    // 5. Diversão do mês
    const leisureTotal = leisureExpenses
      .filter((l) => l.yearMonth === key)
      .reduce((sum, l) => sum + l.amount, 0);

    // Total base sem simulação
    const baseExpensesTotal = fixedTotal + cardTotal + subTotal + leisureTotal;

    // 6. Simulação de Janela de Oportunidade
    let simulationExpense = 0;
    if (simulatedPurchase && simulatedPurchase.isActive) {
      const diff = getMonthDifference(
        simulatedPurchase.startYearMonth,
        key
      );
      if (diff >= 0 && diff < simulatedPurchase.installmentsCount) {
        simulationExpense =
          simulatedPurchase.totalAmount / simulatedPurchase.installmentsCount;
      }
    }

    const totalWithSimulation = baseExpensesTotal + simulationExpense;
    const netBalance = totalIncome - totalWithSimulation;

    const { color, label: statusLabel, usagePercent } = calculateMonthStatus(
      totalWithSimulation,
      totalIncome,
      userProfile.safetyMarginPercent
    );

    return {
      monthKey: key,
      monthLabel: label,
      salary,
      extraIncomes: monthIncomes,
      totalIncome,
      fixedExpenses: fixedTotal,
      creditCardExpenses: cardTotal,
      subscriptionExpenses: subTotal,
      leisureExpenses: leisureTotal,
      investmentExpenses: 0,
      baseExpensesTotal,
      simulationExpense,
      totalWithSimulation,
      netBalance,
      usagePercent,
      statusColor: color,
      statusLabel,
    };
  });
}

