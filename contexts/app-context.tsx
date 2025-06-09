"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Types
export interface Transaction {
  id: string
  description: string
  amount: number
  type: "receita" | "despesa"
  category: string
  company: string
  date: string
  paymentMethod: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Budget {
  id: string
  category: string
  budgeted: number
  spent: number
  month: string
  company: string
  alerts: boolean
  status: "dentro" | "atencao" | "excedido"
  createdAt: string
}

export interface Goal {
  id: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  company: string
  status: "ativo" | "concluido" | "pausado"
  createdAt: string
}

export interface Company {
  id: string
  name: string
  isMain: boolean
  color: string
  createdAt: string
}

export interface Page {
  id: string
  name: string
  icon: string
  route: string
  description: string
  isVisible: boolean
  isFavorite: boolean
  isCustom: boolean
  isDeleted: boolean
  order: number
  company: string
  deletedAt?: string
  createdAt: string
}

interface AppContextType {
  // Transactions
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void

  // Budgets
  budgets: Budget[]
  addBudget: (budget: Omit<Budget, "id" | "spent" | "status" | "createdAt">) => void
  updateBudget: (id: string, budget: Partial<Budget>) => void
  deleteBudget: (id: string) => void

  // Goals
  goals: Goal[]
  addGoal: (goal: Omit<Goal, "id" | "currentAmount" | "status" | "createdAt">) => void
  updateGoal: (id: string, goal: Partial<Goal>) => void
  deleteGoal: (id: string) => void

  // Companies
  companies: Company[]
  addCompany: (company: Omit<Company, "id" | "createdAt">) => void
  updateCompany: (id: string, company: Partial<Company>) => void
  deleteCompany: (id: string) => void

  // Pages
  pages: Page[]
  toggleFavorite: (pageId: string) => void
  toggleVisibility: (pageId: string) => void
  deletePage: (pageId: string) => void
  restorePage: (pageId: string) => void

  // Current selections
  currentCompany: string
  setCurrentCompany: (company: string) => void

  // Filters
  transactionFilters: {
    search: string
    category: string
    type: string
    dateRange: string
    company: string
  }
  setTransactionFilters: (filters: any) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Initial data
const initialTransactions: Transaction[] = [
  {
    id: "1",
    description: "Salário",
    amount: 8500,
    type: "receita",
    category: "Salário",
    company: "Finance Pessoal",
    date: "2024-06-15",
    paymentMethod: "Transferência",
    createdAt: "2024-06-15T10:00:00Z",
    updatedAt: "2024-06-15T10:00:00Z",
  },
  {
    id: "2",
    description: "Supermercado Extra",
    amount: 320,
    type: "despesa",
    category: "Alimentação",
    company: "Finance Pessoal",
    date: "2024-06-14",
    paymentMethod: "Cartão de Débito",
    createdAt: "2024-06-14T15:30:00Z",
    updatedAt: "2024-06-14T15:30:00Z",
  },
  {
    id: "3",
    description: "Uber",
    amount: 45,
    type: "despesa",
    category: "Transporte",
    company: "Finance Pessoal",
    date: "2024-06-14",
    paymentMethod: "PIX",
    createdAt: "2024-06-14T18:20:00Z",
    updatedAt: "2024-06-14T18:20:00Z",
  },
  {
    id: "4",
    description: "Freelance Design",
    amount: 1200,
    type: "receita",
    category: "Freelance",
    company: "Finance Pessoal",
    date: "2024-06-13",
    paymentMethod: "PIX",
    createdAt: "2024-06-13T14:00:00Z",
    updatedAt: "2024-06-13T14:00:00Z",
  },
  {
    id: "5",
    description: "Conta de Luz",
    amount: 180,
    type: "despesa",
    category: "Moradia",
    company: "Finance Pessoal",
    date: "2024-06-12",
    paymentMethod: "Boleto",
    createdAt: "2024-06-12T09:00:00Z",
    updatedAt: "2024-06-12T09:00:00Z",
  },
]

const initialBudgets: Budget[] = [
  {
    id: "1",
    category: "Alimentação",
    budgeted: 3000,
    spent: 2500,
    month: "2024-06",
    company: "Finance Pessoal",
    alerts: true,
    status: "atencao",
    createdAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "2",
    category: "Transporte",
    budgeted: 1500,
    spent: 1200,
    month: "2024-06",
    company: "Finance Pessoal",
    alerts: true,
    status: "atencao",
    createdAt: "2024-06-01T00:00:00Z",
  },
]

const initialGoals: Goal[] = [
  {
    id: "1",
    title: "Reserva de Emergência",
    description: "Juntar 6 meses de gastos para emergências",
    targetAmount: 30000,
    currentAmount: 15000,
    deadline: "2024-12-31",
    category: "Poupança",
    company: "Finance Pessoal",
    status: "ativo",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Viagem Europa",
    description: "Economizar para viagem de férias",
    targetAmount: 12000,
    currentAmount: 8000,
    deadline: "2024-12-01",
    category: "Lazer",
    company: "Finance Pessoal",
    status: "ativo",
    createdAt: "2024-02-01T00:00:00Z",
  },
]

const initialCompanies: Company[] = [
  {
    id: "1",
    name: "Finance Pessoal",
    isMain: true,
    color: "#3B82F6",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Empresa 1",
    isMain: false,
    color: "#10B981",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Empresa 2",
    isMain: false,
    color: "#F59E0B",
    createdAt: "2024-01-01T00:00:00Z",
  },
]

const initialPages: Page[] = [
  {
    id: "1",
    name: "Dashboard",
    icon: "Home",
    route: "/",
    description: "Visão geral das finanças",
    isVisible: true,
    isFavorite: false,
    isCustom: false,
    isDeleted: false,
    order: 1,
    company: "Finance Pessoal",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Transações",
    icon: "CreditCard",
    route: "/transacoes",
    description: "Gerenciar receitas e despesas",
    isVisible: true,
    isFavorite: true,
    isCustom: false,
    isDeleted: false,
    order: 2,
    company: "Finance Pessoal",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Orçamentos",
    icon: "Target",
    route: "/orcamentos",
    description: "Controle de orçamentos",
    isVisible: true,
    isFavorite: false,
    isCustom: false,
    isDeleted: false,
    order: 3,
    company: "Finance Pessoal",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Relatórios",
    icon: "BarChart3",
    route: "/relatorios",
    description: "Análises e relatórios",
    isVisible: true,
    isFavorite: true,
    isCustom: false,
    isDeleted: false,
    order: 4,
    company: "Finance Pessoal",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Metas 2024",
    icon: "Trophy",
    route: "/metas",
    description: "Objetivos financeiros do ano",
    isVisible: true,
    isFavorite: true,
    isCustom: false,
    isDeleted: false,
    order: 5,
    company: "Finance Pessoal",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "6",
    name: "Configurações",
    icon: "Settings",
    route: "/configuracoes",
    description: "Configurações do sistema",
    isVisible: true,
    isFavorite: false,
    isCustom: false,
    isDeleted: false,
    order: 6,
    company: "Finance Pessoal",
    createdAt: "2024-01-01T00:00:00Z",
  },
]

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets)
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [companies, setCompanies] = useState<Company[]>(initialCompanies)
  const [pages, setPages] = useState<Page[]>(initialPages)
  const [currentCompany, setCurrentCompany] = useState("Finance Pessoal")
  const [transactionFilters, setTransactionFilters] = useState({
    search: "",
    category: "",
    type: "",
    dateRange: "",
    company: "",
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("finance-dashboard-data")
    if (savedData) {
      const data = JSON.parse(savedData)
      setTransactions(data.transactions || initialTransactions)
      setBudgets(data.budgets || initialBudgets)
      setGoals(data.goals || initialGoals)
      setCompanies(data.companies || initialCompanies)
      setPages(data.pages || initialPages)
      setCurrentCompany(data.currentCompany || "Finance Pessoal")
    }
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const data = {
      transactions,
      budgets,
      goals,
      companies,
      pages,
      currentCompany,
    }
    localStorage.setItem("finance-dashboard-data", JSON.stringify(data))
  }, [transactions, budgets, goals, companies, pages, currentCompany])

  // Transaction functions
  const addTransaction = (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTransactions((prev) => [newTransaction, ...prev])

    // Update budget spent amount
    if (transaction.type === "despesa") {
      setBudgets((prev) =>
        prev.map((budget) => {
          if (budget.category === transaction.category && budget.company === transaction.company) {
            const newSpent = budget.spent + transaction.amount
            const percentage = (newSpent / budget.budgeted) * 100
            return {
              ...budget,
              spent: newSpent,
              status: percentage > 90 ? "excedido" : percentage > 70 ? "atencao" : "dentro",
            }
          }
          return budget
        }),
      )
    }
  }

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...updatedTransaction, updatedAt: new Date().toISOString() }
          : transaction,
      ),
    )
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
  }

  // Budget functions
  const addBudget = (budget: Omit<Budget, "id" | "spent" | "status" | "createdAt">) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
      status: "dentro",
      createdAt: new Date().toISOString(),
    }
    setBudgets((prev) => [...prev, newBudget])
  }

  const updateBudget = (id: string, updatedBudget: Partial<Budget>) => {
    setBudgets((prev) => prev.map((budget) => (budget.id === id ? { ...budget, ...updatedBudget } : budget)))
  }

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((budget) => budget.id !== id))
  }

  // Goal functions
  const addGoal = (goal: Omit<Goal, "id" | "currentAmount" | "status" | "createdAt">) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      currentAmount: 0,
      status: "ativo",
      createdAt: new Date().toISOString(),
    }
    setGoals((prev) => [...prev, newGoal])
  }

  const updateGoal = (id: string, updatedGoal: Partial<Goal>) => {
    setGoals((prev) => prev.map((goal) => (goal.id === id ? { ...goal, ...updatedGoal } : goal)))
  }

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id))
  }

  // Company functions
  const addCompany = (company: Omit<Company, "id" | "createdAt">) => {
    const newCompany: Company = {
      ...company,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setCompanies((prev) => [...prev, newCompany])
  }

  const updateCompany = (id: string, updatedCompany: Partial<Company>) => {
    setCompanies((prev) => prev.map((company) => (company.id === id ? { ...company, ...updatedCompany } : company)))
  }

  const deleteCompany = (id: string) => {
    setCompanies((prev) => prev.filter((company) => company.id !== id))
  }

  // Page functions
  const toggleFavorite = (pageId: string) => {
    setPages((prev) => prev.map((page) => (page.id === pageId ? { ...page, isFavorite: !page.isFavorite } : page)))
  }

  const toggleVisibility = (pageId: string) => {
    setPages((prev) => prev.map((page) => (page.id === pageId ? { ...page, isVisible: !page.isVisible } : page)))
  }

  const deletePage = (pageId: string) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId ? { ...page, isDeleted: true, deletedAt: new Date().toISOString() } : page,
      ),
    )
  }

  const restorePage = (pageId: string) => {
    setPages((prev) =>
      prev.map((page) => (page.id === pageId ? { ...page, isDeleted: false, deletedAt: undefined } : page)),
    )
  }

  const value: AppContextType = {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    companies,
    addCompany,
    updateCompany,
    deleteCompany,
    pages,
    toggleFavorite,
    toggleVisibility,
    deletePage,
    restorePage,
    currentCompany,
    setCurrentCompany,
    transactionFilters,
    setTransactionFilters,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
