# 🧭 Janela Financeira

Ferramenta preditiva de controle de gastos, planejamento financeiro e **Janela de Oportunidades & Aquisições**.

---

## 🌟 O Diferencial: Janela de Oportunidades
Enquanto gerenciadores convencionais apenas categorizam os gastos passados, a **Janela Financeira** projeta seus próximos **12 meses** combinando:
1. **Salário Fixo Mensal** (Renda garantida) + **Entradas Extras**
2. **Despesas Fixas e Variáveis de Casa** (com cálculo automático de média ponderada para contas como água e luz)
3. **Cartões de Crédito** (com controle individual por cartão e parcelas programadas)
4. **Assinaturas Recorrentes**
5. **Gastos com Diversão & Lazer** (com teto orçamentário e alertas)
6. **Simulador de Janela de Oportunidade**: Simule compras à vista ou parceladas e veja instantaneamente no gráfico se a compra é segura ou se vai te apertar.

---

## 🎨 Cores dos Meses na Análise Preditiva
- 🟢 **Verde**: *Pagando sem aperto* (Renda folgada e margem de segurança preservada).
- 🔵 **Azul**: *Passando da barreira de folga* (Atenção leve, margem de segurança diminuída).
- 🔴 **Vermelho**: *No limite da renda* (Gastos próximos a 100% da renda).
- 🟣 **Roxo**: *Ultrapassando os limites* (Orçamento estourado / saldo negativo no mês).

---

## 🛠️ Tecnologias Utilizadas
- **React 19 + TypeScript (TSX)**
- **Vite** (Build ultra-rápido)
- **Tailwind CSS + shadcn/ui Design Pattern**
- **Lucide Icons**
- **Recharts** (Gráficos preditivos responsivos)
- **PostgreSQL / Supabase** (Banco relacional, seguro com Row Level Security)
- **Adaptador Híbrido de Armazenamento**: Funciona de imediato localmente via `localStorage` e conecta com 1 clique ao Supabase.

---

## 🚀 Como Executar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/SEU_USUARIO/janelafinanceira.git
cd janelafinanceira
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra no seu navegador: `http://localhost:5173`

---

## 🗄️ Banco de Dados Online Gratuito (Supabase)

A arquitetura foi desenhada em **PostgreSQL** com isolamento via **Row Level Security (RLS)**:
- **100% Gratuito**: 500 MB de armazenamento, 50.000 usuários ativos por mês.
- **Segurança contra SQL Injection e vazamento**: Protegido por políticas de segurança no nível de linha (RLS).
- **Conexão Nativa com a Vercel**: Integração com 1 clique no dashboard da Vercel.

O script completo para criação das tabelas, índices e políticas de segurança está disponível em:
👉 [`database/supabase_schema.sql`](./database/supabase_schema.sql)

Para conectar:
1. Crie uma conta gratuita em [supabase.com](https://supabase.com).
2. Cole o script em **SQL Editor** e clique em **Run**.
3. Copie as credenciais da API para o arquivo `.env` (baseado no `.env.example`).
