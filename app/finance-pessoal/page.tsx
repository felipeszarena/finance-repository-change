"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, Building2, PieChart, BarChart3 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

const personalData = {
  currentBalance: 15750,
  monthlyIncome: 8500,
  monthlyExpenses: 6200,
  savingsGoal: 50000,
  currentSavings: 32500,
  investments: 22000,
}

const monthlyTrend = [
  { month: "Jan", saldo: 12000, receitas: 8500, despesas: 6200 },
  { month: "Fev", saldo: 13400, receitas: 9200, despesas: 5800 },
  { month: "Mar", saldo: 14700, receitas: 7800, despesas: 6500 },
  { month: "Abr", saldo: 15700, receitas: 10200, despesas: 7200 },
  { month: "Mai", saldo: 15700, receitas: 9800, despesas: 6800 },
  { month: "Jun", saldo: 15750, receitas: 8500, despesas: 6200 },
]

const expenseCategories = [
  { name: "Moradia", value: 3500, color: "#3B82F6" },
  { name: "Alimentação", value: 2500, color: "#10B981" },
  { name: "Transporte", value: 1200, color: "#F59E0B" },
  { name: "Lazer", value: 800, color: "#EF4444" },
  { name: "Saúde", value: 600, color: "#8B5CF6" },
  { name: "Outros", value: 900, color: "#6B7280" },
]

const budgetProgress = [
  { category: "Alimentação", spent: 2500, budget: 3000, percentage: 83 },
  { category: "Transporte", spent: 1200, budget: 1500, percentage: 80 },
  { category: "Moradia", spent: 3500, budget: 4000, percentage: 88 },
  { category: "Lazer", spent: 800, budget: 1000, percentage: 80 },
]

export default function FinancePessoalPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6m")

  const savingsPercentage = (personalData.currentSavings / personalData.savingsGoal) * 100
  const monthlyBalance = personalData.monthlyIncome - personalData.monthlyExpenses

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Finance Pessoal</h1>
            <p className="text-gray-600 dark:text-gray-400">Suas finanças pessoais em detalhes</p>
          </div>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Conta Principal
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Saldo Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {personalData.currentBalance.toLocaleString("pt-BR")}</div>
            <p className="text-xs opacity-90 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +R$ {monthlyBalance.toLocaleString("pt-BR")} este mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Renda Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {personalData.monthlyIncome.toLocaleString("pt-BR")}</div>
            <p className="text-xs opacity-90 mt-1">
              <Calendar className="inline h-3 w-3 mr-1" />
              Média dos últimos 6 meses
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Gastos Mensais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {personalData.monthlyExpenses.toLocaleString("pt-BR")}</div>
            <p className="text-xs opacity-90 mt-1">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -5% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Investimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {personalData.investments.toLocaleString("pt-BR")}</div>
            <p className="text-xs opacity-90 mt-1">
              <Target className="inline h-3 w-3 mr-1" />
              Portfolio diversificado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`} />
                <Line type="monotone" dataKey="saldo" stroke="#3B82F6" strokeWidth={3} />
                <Line type="monotone" dataKey="receitas" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="despesas" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={expenseCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: R$ ${value.toLocaleString("pt-BR")}`}
                >
                  {expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Goals and Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Meta de Economia 2024
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span className="font-medium">{savingsPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={savingsPercentage} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Economizado</p>
                <p className="font-semibold text-green-600">R$ {personalData.currentSavings.toLocaleString("pt-BR")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Meta Anual</p>
                <p className="font-semibold">R$ {personalData.savingsGoal.toLocaleString("pt-BR")}</p>
              </div>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500">Faltam</p>
              <p className="font-semibold text-blue-600">
                R$ {(personalData.savingsGoal - personalData.currentSavings).toLocaleString("pt-BR")}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Aproximadamente R${" "}
                {Math.ceil((personalData.savingsGoal - personalData.currentSavings) / 7).toLocaleString("pt-BR")} por
                mês
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Budget Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status do Orçamento Mensal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetProgress.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      R$ {item.spent.toLocaleString("pt-BR")} / R$ {item.budget.toLocaleString("pt-BR")}
                    </span>
                    <Badge
                      variant={item.percentage > 90 ? "destructive" : item.percentage > 70 ? "secondary" : "default"}
                    >
                      {item.percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>R$ {(item.budget - item.spent).toLocaleString("pt-BR")} restante</span>
                  <span>
                    {item.percentage > 90 ? "⚠️ Atenção" : item.percentage > 70 ? "🔶 Moderado" : "✅ No prazo"}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas - Finance Pessoal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm">Nova Transação</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <Target className="h-5 w-5" />
              <span className="text-sm">Ajustar Orçamento</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <PieChart className="h-5 w-5" />
              <span className="text-sm">Ver Investimentos</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm">Relatório Mensal</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
