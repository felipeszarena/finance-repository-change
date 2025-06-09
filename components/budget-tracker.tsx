"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, TrendingDown, Target, Plus, Settings, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const budgetData = [
  {
    id: 1,
    category: "Alimentação",
    budgeted: 3000,
    spent: 2500,
    percentage: 83,
    trend: "up",
    lastMonth: 2200,
    alerts: true,
  },
  {
    id: 2,
    category: "Transporte",
    budgeted: 1500,
    spent: 1200,
    percentage: 80,
    trend: "down",
    lastMonth: 1350,
    alerts: true,
  },
  {
    id: 3,
    category: "Moradia",
    budgeted: 4000,
    spent: 3500,
    percentage: 88,
    trend: "up",
    lastMonth: 3200,
    alerts: true,
  },
  {
    id: 4,
    category: "Lazer",
    budgeted: 1000,
    spent: 800,
    percentage: 80,
    trend: "stable",
    lastMonth: 750,
    alerts: false,
  },
  {
    id: 5,
    category: "Saúde",
    budgeted: 800,
    spent: 450,
    percentage: 56,
    trend: "down",
    lastMonth: 600,
    alerts: false,
  },
  {
    id: 6,
    category: "Educação",
    budgeted: 1200,
    spent: 300,
    percentage: 25,
    trend: "stable",
    lastMonth: 280,
    alerts: false,
  },
]

const categories = ["Alimentação", "Transporte", "Moradia", "Lazer", "Saúde", "Educação", "Outros"]

export function BudgetTracker() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-06")
  const [newBudgetOpen, setNewBudgetOpen] = useState(false)
  const [newBudget, setNewBudget] = useState({
    category: "",
    amount: "",
    period: "2024-06",
  })

  const getBudgetColor = (percentage: number) => {
    if (percentage < 70) return "bg-green-500"
    if (percentage < 90) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getBudgetStatus = (percentage: number) => {
    if (percentage < 70) return { color: "text-green-600", label: "Dentro do orçamento" }
    if (percentage < 90) return { color: "text-yellow-600", label: "Atenção" }
    return { color: "text-red-600", label: "Orçamento excedido" }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-red-500" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-green-500" />
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-400" />
    }
  }

  const totalBudgeted = budgetData.reduce((acc, item) => acc + item.budgeted, 0)
  const totalSpent = budgetData.reduce((acc, item) => acc + item.spent, 0)
  const overallPercentage = (totalSpent / totalBudgeted) * 100

  const handleCreateBudget = () => {
    // Handle budget creation
    console.log("Creating budget:", newBudget)
    setNewBudgetOpen(false)
    setNewBudget({ category: "", amount: "", period: "2024-06" })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Monitoramento de Orçamento</h2>
          <p className="text-gray-600 dark:text-gray-400">Acompanhe seus gastos e mantenha-se dentro do orçamento</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-06">Junho 2024</SelectItem>
              <SelectItem value="2024-05">Maio 2024</SelectItem>
              <SelectItem value="2024-04">Abril 2024</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={newBudgetOpen} onOpenChange={setNewBudgetOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Orçamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Orçamento</DialogTitle>
                <DialogDescription>Defina um orçamento para uma categoria específica</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select
                    value={newBudget.category}
                    onValueChange={(value) => setNewBudget((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor do Orçamento</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      className="pl-10"
                      value={newBudget.amount}
                      onChange={(e) => setNewBudget((prev) => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewBudgetOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateBudget}>Criar Orçamento</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overall Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Resumo Geral - {selectedPeriod}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Orçado</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ {totalBudgeted.toLocaleString("pt-BR")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Gasto</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ {totalSpent.toLocaleString("pt-BR")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Disponível</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {(totalBudgeted - totalSpent).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso Geral</span>
              <span className={`text-sm font-medium ${getBudgetStatus(overallPercentage).color}`}>
                {overallPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={overallPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgetData.map((budget) => {
          const status = getBudgetStatus(budget.percentage)
          const remaining = budget.budgeted - budget.spent
          const trendChange = budget.spent - budget.lastMonth
          const trendPercentage = ((trendChange / budget.lastMonth) * 100).toFixed(1)

          return (
            <Card key={budget.id} className="relative">
              {budget.percentage > 90 && (
                <div className="absolute top-2 right-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{budget.category}</CardTitle>
                  <Badge
                    variant={budget.percentage > 90 ? "destructive" : budget.percentage > 70 ? "secondary" : "default"}
                  >
                    {budget.percentage}%
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <Progress value={budget.percentage} className={`h-2 ${getBudgetColor(budget.percentage)}`} />
                </div>

                {/* Values */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Gasto</span>
                    <span className="font-medium">R$ {budget.spent.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Orçado</span>
                    <span className="font-medium">R$ {budget.budgeted.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Restante</span>
                    <span className={`font-medium ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                      R$ {Math.abs(remaining).toLocaleString("pt-BR")}
                      {remaining < 0 && " (excedido)"}
                    </span>
                  </div>
                </div>

                {/* Trend */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1">
                    {getTrendIcon(budget.trend)}
                    <span className="text-xs text-gray-600 dark:text-gray-400">vs mês anterior</span>
                  </div>
                  <span className={`text-xs font-medium ${trendChange > 0 ? "text-red-600" : "text-green-600"}`}>
                    {trendChange > 0 ? "+" : ""}R$ {Math.abs(trendChange).toLocaleString("pt-BR")}
                  </span>
                </div>

                {/* Status */}
                <div className={`text-xs ${status.color} font-medium`}>{status.label}</div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Alertas de Orçamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {budgetData
              .filter((budget) => budget.percentage > 80)
              .map((budget) => (
                <div
                  key={budget.id}
                  className={`p-3 rounded-lg border ${
                    budget.percentage > 90
                      ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                      : "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`font-medium ${
                          budget.percentage > 90
                            ? "text-red-800 dark:text-red-200"
                            : "text-yellow-800 dark:text-yellow-200"
                        }`}
                      >
                        {budget.category} - {budget.percentage}% utilizado
                      </p>
                      <p
                        className={`text-sm ${
                          budget.percentage > 90
                            ? "text-red-600 dark:text-red-300"
                            : "text-yellow-600 dark:text-yellow-300"
                        }`}
                      >
                        {budget.percentage > 90
                          ? `Orçamento excedido em R$ ${(budget.spent - budget.budgeted).toLocaleString("pt-BR")}`
                          : `Restam R$ ${(budget.budgeted - budget.spent).toLocaleString("pt-BR")} do orçamento`}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Revisar
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
