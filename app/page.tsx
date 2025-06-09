"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Search,
  X,
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
import { useApp } from "@/contexts/app-context"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  const { transactions, budgets, currentCompany, transactionFilters, setTransactionFilters } = useApp()

  const [showFilters, setShowFilters] = useState(false)

  // Filter transactions by current company
  const companyTransactions = transactions.filter((t) => t.company === currentCompany)
  const companyBudgets = budgets.filter((b) => b.company === currentCompany)

  // Apply filters to recent transactions
  const filteredTransactions = companyTransactions.filter((transaction) => {
    const matchesSearch =
      !transactionFilters.search ||
      transaction.description.toLowerCase().includes(transactionFilters.search.toLowerCase()) ||
      transaction.category.toLowerCase().includes(transactionFilters.search.toLowerCase())

    const matchesCategory = !transactionFilters.category || transaction.category === transactionFilters.category
    const matchesType = !transactionFilters.type || transaction.type === transactionFilters.type

    return matchesSearch && matchesCategory && matchesType
  })

  // Calculate summary data
  const totalReceitas = companyTransactions
    .filter((t) => t.type === "receita")
    .reduce((acc, curr) => acc + curr.amount, 0)

  const totalDespesas = companyTransactions
    .filter((t) => t.type === "despesa")
    .reduce((acc, curr) => acc + curr.amount, 0)

  const saldoTotal = totalReceitas - totalDespesas
  const orcamentoDisponivel = companyBudgets.reduce((acc, curr) => acc + (curr.budgeted - curr.spent), 0)

  // Generate chart data
  const monthlyData = [
    { month: "Jan", receitas: 8500, despesas: 6200 },
    { month: "Fev", receitas: 9200, despesas: 5800 },
    { month: "Mar", receitas: 7800, despesas: 6500 },
    { month: "Abr", receitas: 10200, despesas: 7200 },
    { month: "Mai", receitas: 9800, despesas: 6800 },
    { month: "Jun", receitas: totalReceitas, despesas: totalDespesas },
  ]

  // Category distribution
  const categoryData = companyTransactions
    .filter((t) => t.type === "despesa")
    .reduce(
      (acc, transaction) => {
        const existing = acc.find((item) => item.name === transaction.category)
        if (existing) {
          existing.value += transaction.amount
        } else {
          acc.push({
            name: transaction.category,
            value: transaction.amount,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          })
        }
        return acc
      },
      [] as Array<{ name: string; value: number; color: string }>,
    )

  const getBudgetColor = (percentage: number) => {
    if (percentage < 70) return "bg-green-500"
    if (percentage < 90) return "bg-yellow-500"
    return "bg-red-500"
  }

  const clearFilters = () => {
    setTransactionFilters({
      search: "",
      category: "",
      type: "",
      dateRange: "",
      company: "",
    })
  }

  const hasActiveFilters = Object.values(transactionFilters).some((value) => value !== "")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Financeiro</h1>
            <p className="text-gray-600 dark:text-gray-400">Bem-vindo de volta, Felipe Arena • {currentCompany}</p>
          </div>
          <div className="flex items-center gap-4">
            <TransactionForm />
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
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`} />
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
                  <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`} />
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
              {companyBudgets.slice(0, 4).map((budget) => {
                const percentage = (budget.spent / budget.budgeted) * 100
                return (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{budget.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          R$ {budget.spent.toLocaleString("pt-BR")} / R$ {budget.budgeted.toLocaleString("pt-BR")}
                        </span>
                        {percentage > 90 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </div>
                    </div>
                    <Progress value={percentage} className={`h-2 ${getBudgetColor(percentage)}`} />
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`font-medium ${
                          percentage > 90 ? "text-red-600" : percentage > 70 ? "text-yellow-600" : "text-green-600"
                        }`}
                      >
                        {percentage.toFixed(0)}% utilizado
                      </span>
                      <span className="text-gray-500">
                        R$ {(budget.budgeted - budget.spent).toLocaleString("pt-BR")} restante
                      </span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transações Recentes</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push("/transacoes")}>
                    Ver todas
                  </Button>
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar transações..."
                        value={transactionFilters.search}
                        onChange={(e) => setTransactionFilters({ ...transactionFilters, search: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                    {hasActiveFilters && (
                      <Button variant="outline" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4 mr-1" />
                        Limpar
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={transactionFilters.category || "all"}
                      onValueChange={(value) => setTransactionFilters({ ...transactionFilters, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {Array.from(new Set(companyTransactions.map((t) => t.category))).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={transactionFilters.type || "all"}
                      onValueChange={(value) => setTransactionFilters({ ...transactionFilters, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="receita">Receitas</SelectItem>
                        <SelectItem value="despesa">Despesas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTransactions.slice(0, 10).map((transaction) => (
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
                          {transaction.category} • {new Date(transaction.date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === "receita" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "receita" ? "+" : "-"}R$ {transaction.amount.toLocaleString("pt-BR")}
                      </p>
                      <p className="text-xs text-gray-500">{transaction.paymentMethod}</p>
                    </div>
                  </div>
                ))}

                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhuma transação encontrada</p>
                    {hasActiveFilters && (
                      <Button variant="link" onClick={clearFilters} className="mt-2">
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                Ver Metas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Button */}
      <TransactionForm
        trigger={
          <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" size="icon">
            <Plus className="h-6 w-6" />
          </Button>
        }
      />
    </div>
  )
}
