"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Calendar,
  Filter,
  Download,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TransactionForm } from "@/components/transaction-form"
import { useRouter } from "next/navigation"

// Mock data
const monthlyData = [
  { month: "Jan", receitas: 8500, despesas: 6200 },
  { month: "Fev", receitas: 9200, despesas: 5800 },
  { month: "Mar", receitas: 7800, despesas: 6500 },
  { month: "Abr", receitas: 10200, despesas: 7200 },
  { month: "Mai", receitas: 9800, despesas: 6800 },
  { month: "Jun", receitas: 11500, despesas: 7500 },
]

const categoryData = [
  { name: "Alimentação", value: 2500, color: "#3B82F6" },
  { name: "Transporte", value: 1200, color: "#10B981" },
  { name: "Moradia", value: 3500, color: "#F59E0B" },
  { name: "Lazer", value: 800, color: "#EF4444" },
  { name: "Saúde", value: 600, color: "#8B5CF6" },
  { name: "Outros", value: 900, color: "#6B7280" },
]

const recentTransactions = [
  {
    id: 1,
    description: "Salário",
    amount: 8500,
    type: "receita",
    category: "Salário",
    date: "2024-06-15",
    company: "Finance Pessoal",
  },
  {
    id: 2,
    description: "Supermercado Extra",
    amount: -320,
    type: "despesa",
    category: "Alimentação",
    date: "2024-06-14",
    company: "Finance Pessoal",
  },
  {
    id: 3,
    description: "Uber",
    amount: -45,
    type: "despesa",
    category: "Transporte",
    date: "2024-06-14",
    company: "Finance Pessoal",
  },
  {
    id: 4,
    description: "Freelance Design",
    amount: 1200,
    type: "receita",
    category: "Freelance",
    date: "2024-06-13",
    company: "Finance Pessoal",
  },
  {
    id: 5,
    description: "Conta de Luz",
    amount: -180,
    type: "despesa",
    category: "Moradia",
    date: "2024-06-12",
    company: "Finance Pessoal",
  },
]

const budgets = [
  { category: "Alimentação", budgeted: 3000, spent: 2500, percentage: 83 },
  { category: "Transporte", budgeted: 1500, spent: 1200, percentage: 80 },
  { category: "Moradia", budgeted: 4000, spent: 3500, percentage: 88 },
  { category: "Lazer", budgeted: 1000, spent: 800, percentage: 80 },
]

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("6m")
  const router = useRouter()

  const totalReceitas = monthlyData.reduce((acc, curr) => acc + curr.receitas, 0)
  const totalDespesas = monthlyData.reduce((acc, curr) => acc + curr.despesas, 0)
  const saldoTotal = totalReceitas - totalDespesas
  const orcamentoDisponivel = budgets.reduce((acc, curr) => acc + (curr.budgeted - curr.spent), 0)

  const getBudgetColor = (percentage: number) => {
    if (percentage < 70) return "bg-green-500"
    if (percentage < 90) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getBudgetStatus = (percentage: number) => {
    if (percentage < 70) return "success"
    if (percentage < 90) return "warning"
    return "danger"
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Financeiro</h1>
            <p className="text-gray-600 dark:text-gray-400">Bem-vindo de volta, Felipe Arena</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                FA
              </div>
              <span className="text-gray-900 dark:text-white font-medium">Felipe Arena</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Saldo Total</CardTitle>
              <DollarSign className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {saldoTotal.toLocaleString("pt-BR")}</div>
              <p className="text-xs opacity-90 mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12.5% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Receitas</CardTitle>
              <ArrowUpRight className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalReceitas.toLocaleString("pt-BR")}</div>
              <p className="text-xs opacity-90 mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +8.2% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Despesas</CardTitle>
              <ArrowDownRight className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalDespesas.toLocaleString("pt-BR")}</div>
              <p className="text-xs opacity-90 mt-1">
                <TrendingDown className="inline h-3 w-3 mr-1" />
                -3.1% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Orçamento Disponível</CardTitle>
              <Target className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {orcamentoDisponivel.toLocaleString("pt-BR")}</div>
              <p className="text-xs opacity-90 mt-1">
                <Target className="inline h-3 w-3 mr-1" />
                78% do orçamento utilizado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Receitas vs Despesas</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />6 meses
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`} />
                  <Line type="monotone" dataKey="receitas" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="despesas" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Budget Monitoring and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Monitoramento de Orçamento</CardTitle>
                <Badge variant="outline">Junho 2024</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgets.map((budget) => (
                <div key={budget.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{budget.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        R$ {budget.spent.toLocaleString("pt-BR")} / R$ {budget.budgeted.toLocaleString("pt-BR")}
                      </span>
                      {budget.percentage > 90 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                  <Progress value={budget.percentage} className={`h-2 ${getBudgetColor(budget.percentage)}`} />
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-medium ${
                        budget.percentage > 90
                          ? "text-red-600"
                          : budget.percentage > 70
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {budget.percentage}% utilizado
                    </span>
                    <span className="text-gray-500">
                      R$ {(budget.budgeted - budget.spent).toLocaleString("pt-BR")} restante
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transações Recentes</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => router.push("/transacoes")}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push("/transacoes")}>
                    Ver todas
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          transaction.type === "receita" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {transaction.category} • {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === "receita" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "receita" ? "+" : ""}R${" "}
                        {Math.abs(transaction.amount).toLocaleString("pt-BR")}
                      </p>
                      <p className="text-xs text-gray-500">{transaction.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Alertas Inteligentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">Orçamento de Moradia</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Você já utilizou 88% do orçamento de moradia este mês. Considere revisar os gastos.
                </p>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">Tendência Positiva</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Suas receitas aumentaram 12.5% comparado ao mês anterior. Excelente trabalho!
                </p>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">Meta Atingida</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Parabéns! Você economizou R$ 2.500 este mês, superando sua meta de R$ 2.000.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <TransactionForm
                trigger={
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Transação
                  </Button>
                }
              />
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push("/orcamentos")}>
                <Target className="h-4 w-4 mr-2" />
                Definir Orçamento
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push("/relatorios")}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Relatório
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push("/metas")}>
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Meta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Action Button */}
      <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" size="icon">
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
