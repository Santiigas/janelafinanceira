-- ====================================================================
-- JANELA FINANCEIRA - SCHEMA OFICIAL POSTGRESQL / SUPABASE
-- ====================================================================
-- Este script cria todas as tabelas com integridade relacional, tipos
-- numéricos exatos para moeda (NUMERIC), índices de performance e
-- Row Level Security (RLS) habilitado para segurança multi-usuário.
--
-- COMO EXECUTAR NO SUPABASE:
-- 1. Acesse o painel do Supabase: https://supabase.com
-- 2. Crie um novo projeto gratuito.
-- 3. No menu lateral, clique em "SQL Editor".
-- 4. Cole o conteúdo deste arquivo e clique em "Run".
-- 5. Copie a URL e a Anon Key em "Project Settings -> API" e coloque no seu .env.
-- ====================================================================

-- 1. TABELA DE PERFIS DE USUÁRIO (Vinculada à autenticação do Supabase)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    salary NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    safety_margin_percent NUMERIC(5, 2) NOT NULL DEFAULT 25.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. TABELA DE TETOS DE GASTOS POR CATEGORIA
CREATE TABLE IF NOT EXISTS public.category_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('despesas_fixas', 'cartao_credito', 'assinaturas', 'diversao')),
    monthly_limit NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, category)
);

-- 3. TABELA DE ENTRADAS EXTRAS (Rendas adicionais ao salário)
CREATE TABLE IF NOT EXISTS public.incomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    date DATE NOT NULL,
    year_month TEXT NOT NULL, -- Formato 'YYYY-MM'
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABELA DE DESPESAS FIXAS (Fixas ou Variáveis de Casa)
CREATE TABLE IF NOT EXISTS public.fixed_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    expense_type TEXT NOT NULL CHECK (expense_type IN ('fixa', 'variavel')),
    base_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    due_day INT DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. TABELA DE HISTÓRICO DE MESES PARA CONTAS VARIÁVEIS (Cálculo de médias)
CREATE TABLE IF NOT EXISTS public.fixed_expense_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fixed_expense_id UUID NOT NULL REFERENCES public.fixed_expenses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    year_month TEXT NOT NULL, -- Formato 'YYYY-MM'
    actual_amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(fixed_expense_id, year_month)
);

-- 6. TABELA DE CARTÕES DE CRÉDITO
CREATE TABLE IF NOT EXISTS public.credit_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#881337',
    closing_day INT DEFAULT 25,
    due_day INT DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. TABELA DE COMPRAS NO CARTÃO DE CRÉDITO (À vista e parceladas)
CREATE TABLE IF NOT EXISTS public.credit_card_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id UUID NOT NULL REFERENCES public.credit_cards(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    installments_count INT NOT NULL DEFAULT 1,
    installment_amount NUMERIC(12, 2) NOT NULL,
    start_year_month TEXT NOT NULL, -- 'YYYY-MM' em que cai a 1ª parcela
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. TABELA DE ASSINATURAS RECORRENTES
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    billing_day INT DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. TABELA DE APORTES E INVESTIMENTOS
CREATE TABLE IF NOT EXISTS public.investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    investment_type TEXT NOT NULL CHECK (investment_type IN ('tesouro_direto', 'acoes', 'fiis', 'cripto', 'outros')),
    amount NUMERIC(12, 2) NOT NULL,
    date DATE NOT NULL,
    year_month TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. TABELA DE GASTOS COM DIVERSÃO E LAZER
CREATE TABLE IF NOT EXISTS public.leisure_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    date DATE NOT NULL,
    year_month TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. TABELA DE SIMULAÇÃO DE COMPRAS (JANELA DE OPORTUNIDADES)
CREATE TABLE IF NOT EXISTS public.simulated_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    installments_count INT NOT NULL DEFAULT 1,
    start_year_month TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ====================================================================
-- ÍNDICES PARA ALTA PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_incomes_user_month ON public.incomes(user_id, year_month);
CREATE INDEX IF NOT EXISTS idx_fixed_entries_user_month ON public.fixed_expense_entries(user_id, year_month);
CREATE INDEX IF NOT EXISTS idx_card_purchases_user ON public.credit_card_purchases(user_id, start_year_month);
CREATE INDEX IF NOT EXISTS idx_leisure_user_month ON public.leisure_expenses(user_id, year_month);
CREATE INDEX IF NOT EXISTS idx_investments_user_month ON public.investments(user_id, year_month);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) - SEGURANÇA TOTAL MULTI-USUÁRIO
-- ====================================================================
-- Garante que cada usuário acesse e modifique estritamente suas próprias linhas

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixed_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixed_expense_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_card_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leisure_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulated_purchases ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACESSO (CRUD ISOLADO POR USUÁRIO)
CREATE POLICY "Users can manage own profile" ON public.user_profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own category limits" ON public.category_limits
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own incomes" ON public.incomes
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own fixed expenses" ON public.fixed_expenses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own fixed entries" ON public.fixed_expense_entries
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own credit cards" ON public.credit_cards
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own card purchases" ON public.credit_card_purchases
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own subscriptions" ON public.subscriptions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own investments" ON public.investments
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own leisure" ON public.leisure_expenses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own simulations" ON public.simulated_purchases
    FOR ALL USING (auth.uid() = user_id);

