export type ExpenseType = 'fixa' | 'variavel';

export type CategoryKey = 
  | 'despesas_fixas'
  | 'cartao_credito'
  | 'assinaturas'
  | 'diversao'
  | 'investimentos'
  | 'entradas';

export type InvestmentType = 'tesouro_direto' | 'acoes' | 'fiis' | 'cripto' | 'outros';

export type MonthStatusColor = 'verde' | 'azul' | 'vermelho' | 'roxo';

export interface UserProfile {
  id: string;
  name: string;
  salary: number; // Salário fixo mensal líquido
  safetyMarginPercent: number; // % de folga desejada (default: 25%)
}

export interface CategoryLimit {
  category: CategoryKey;
  monthlyLimit: number;
}

export interface Income {
  id: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  yearMonth: string; // YYYY-MM
  isRecurring?: boolean;
}

export interface FixedExpenseEntry {
  id: string;
  fixedExpenseId: string;
  yearMonth: string; // YYYY-MM
  actualAmount: number;
}

export interface FixedExpense {
  id: string;
  name: string;
  expenseType: ExpenseType; // 'fixa' ou 'variavel'
  baseAmount: number; // Para fixa: valor mensal. Para variável: estimativa inicial/base.
  dueDay?: number;
  entries: FixedExpenseEntry[]; // Histórico para cálculo de médias
}

export interface CreditCard {
  id: string;
  name: string;
  color?: string;
  closingDay?: number;
  dueDay?: number;
}

export interface CreditCardPurchase {
  id: string;
  cardId: string;
  description: string;
  totalAmount: number;
  installmentsCount: number; // 1 = à vista, 2..48 = parcelado
  installmentAmount: number;
  startYearMonth: string; // YYYY-MM em que cai a primeira parcela
  purchaseDate?: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingDay?: number;
  isActive: boolean;
}

export interface Investment {
  id: string;
  name: string;
  investmentType: InvestmentType;
  amount: number;
  date: string; // YYYY-MM-DD
  yearMonth: string;
}

export interface LeisureExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  yearMonth: string;
}

export interface SimulatedPurchase {
  id: string;
  title: string;
  totalAmount: number;
  installmentsCount: number;
  startYearMonth: string;
  isActive: boolean;
}

export interface MonthFinancialSummary {
  monthKey: string; // YYYY-MM
  monthLabel: string; // "NOVEMBRO", "DEZEMBRO", etc.
  salary: number;
  extraIncomes: number;
  totalIncome: number;
  fixedExpenses: number;
  creditCardExpenses: number;
  subscriptionExpenses: number;
  leisureExpenses: number;
  investmentExpenses: number;
  baseExpensesTotal: number; // Total sem simulação
  simulationExpense: number; // Parcela da simulação se ativa
  totalWithSimulation: number;
  netBalance: number; // Saldo que sobra
  usagePercent: number; // % da renda gasta
  statusColor: MonthStatusColor;
  statusLabel: string;
}

