import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1000) {
    const k = value / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return `R$ ${Math.round(value)}`;
}

export function getCurrentYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function getMonthName(yearMonth: string): string {
  const [year, month] = yearMonth.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString("pt-BR", { month: "long" }).toUpperCase();
}

export function getNext12Months(startYearMonth?: string): { key: string; label: string }[] {
  let [year, month] = (startYearMonth || getCurrentYearMonth())
    .split("-")
    .map(Number);

  const months: { key: string; label: string }[] = [];

  for (let i = 0; i < 12; i++) {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    const date = new Date(year, month - 1, 1);
    const label = date.toLocaleString("pt-BR", { month: "long" }).toUpperCase();

    months.push({ key, label });

    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return months;
}

export function addMonths(yearMonth: string, offset: number): string {
  const [year, month] = yearMonth.split("-").map(Number);
  const d = new Date(year, month - 1 + offset, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function getMonthDifference(fromYearMonth: string, toYearMonth: string): number {
  const [fromY, fromM] = fromYearMonth.split("-").map(Number);
  const [toY, toM] = toYearMonth.split("-").map(Number);
  return (toY - fromY) * 12 + (toM - fromM);
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

