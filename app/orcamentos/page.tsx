"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Target, Plus, Calendar, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import { useApp } from "@/contexts/app-context"

const categories = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Lazer",
  "Saúde",
  "Educação",
  "Vestuário",
  "Tecnologia",
  "Viagem",
  "Outros",
]

export default function OrcamentosPage() {
  const { budgets, currentCompany, addBudget, updateBudget, deleteBudget, transactions } = useApp()
  const [newBudgetOpen, setNewBudgetOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("2024-06")
  const [newBudget, setNewBudget] = useState({
    category: "",
    budgeted: "",
    month: "2024-06",
    company: currentCompany,
    alerts: true,
  })

  // Filter budgets by current company and period
  const companyBudgets = budgets.filter((b) => b.company === currentCompany && b.month === selectedPeriod)

  // Calculate spent amounts from transactions
  const budgetsWithSpent = companyBudgets.map((budget) => {
    const spent = transactions
      .filter(
        (t) =>
          t.company === currentCompany &&
          t.category === budget.category &&
          t.type === "despesa" &&
          t.date.startsWith(selectedPeriod),
      )
      .reduce((acc, t) => acc + t.amount, 0)

    const percentage = (spent / budget.budgeted) * 100
    const status = percentage > 90 ? "excedido" : percentage > 70 ? "atencao" : "dentro"

    return { ...budget, spent, percentage, status }
  })

  const totalBudgeted = budgetsWithSpent.reduce((acc, b) => acc + b.budgeted, 0)
  const totalSpent = budgetsWithSpent.reduce((acc, b) => acc + b.spent, 0)
  const overallPercentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0

  const getBudgetColor = (percentage: number) => {
    if (percentage < 70) return "bg-green-500"
    if (percentage < 90) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getBudgetStatus = (percentage: number) => {
    if (percentage < 70) return { color: "text-green-600", label: "Dentro do orçamento", icon: CheckCircle }
    if (percentage < 90) return { color: "text-yellow-600", label: "Atenção", icon: AlertTriangle }
    return { color: "text-red-600", label: "Orçamento excedido", icon: XCircle }
  }

  const handleCreateBudget = () => {
    if (newBudget.category && newBudget.budgeted) {
      addBudget({
        category: newBudget.category,
        budgeted: Number.parseFloat(newBudget.budgeted),
        month: newBudget.month,
        company: newBudget.company,
        alerts: newBudget.alerts,
      })
      setNewBudgetOpen(false)
      setNewBudget({
        category: "",
        budgeted: "",
        month: "2024-06",
        company: currentCompany,
        alerts: true,
      })
    }
  }

  const alertBudgets = budgetsWithSpent.filter((b) => b.percentage > 80)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orçamentos</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Controle seus gastos e mantenha-se dentro do orçamento • {currentCompany}
            </p>
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
                <SelectItem value="2024-03">Março 2024</SelectItem>
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
                        {categories
                          .filter((cat) => !companyBudgets.find((b) => b.category === cat))
                          .map((category) => (
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
                        value={newBudget.budgeted}
                        onChange={(e) => setNewBudget((prev) => ({ ...prev, budgeted: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Período</Label>
                    <Select
                      value={newBudget.month}
                      onValueChange={(value) => setNewBudget((prev) => ({ ...prev, month: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-06">Junho 2024</SelectItem>
                        <SelectItem value="2024-07">Julho 2024</SelectItem>
                        <SelectItem value="2024-08">Agosto 2024</SelectItem>
                      </SelectContent>
                    </Select>
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
      </header>

      <div className="p-6">
        {/* Overall Summary */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Resumo Geral - {selectedPeriod}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p
                  className={`text-2xl font-bold ${totalBudgeted - totalSpent >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  R$ {Math.abs(totalBudgeted - totalSpent).toLocaleString("pt-BR")}
                  {totalBudgeted - totalSpent < 0 && " (excedido)"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Progresso Geral</p>
                <p className={`text-2xl font-bold ${getBudgetStatus(overallPercentage).color}`}>
                  {overallPercentage.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={overallPercentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Alerts Section */}
        {alertBudgets.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Alertas de Orçamento ({alertBudgets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertBudgets.map((budget) => {
                  const status = getBudgetStatus(budget.percentage)
                  const StatusIcon = status.icon
                  return (
                    <div
                      key={budget.id}
                      className={`p-4 rounded-lg border ${
                        budget.percentage > 90
                          ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                          : "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <StatusIcon className={`h-5 w-5 ${status.color}`} />
                          <div>
                            <p className={`font-medium ${status.color}`}>
                              {budget.category} - {budget.percentage.toFixed(1)}% utilizado
                            </p>
                            <p className={`text-sm ${status.color.replace("600", "500")}`}>
                              {budget.percentage > 90
                                ? `Orçamento excedido em R$ ${(budget.spent - budget.budgeted).toLocaleString("pt-BR")}`
                                : `Restam R$ ${(budget.budgeted - budget.spent).toLocaleString("pt-BR")} do orçamento`}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Revisar
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Budget Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgetsWithSpent.map((budget) => {
            const status = getBudgetStatus(budget.percentage)
            const remaining = budget.budgeted - budget.spent
            const StatusIcon = status.icon

            return (
              <Card key={budget.id} className="relative">
                {budget.percentage > 90 && (
                  <div className="absolute top-3 right-3">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{budget.category}</CardTitle>
                    <Badge
                      variant={
                        budget.percentage > 90 ? "destructive" : budget.percentage > 70 ? "secondary" : "default"
                      }
                    >
                      {budget.percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <Progress value={budget.percentage} className={`h-3 ${getBudgetColor(budget.percentage)}`} />
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

                  {/* Status */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <StatusIcon className={`h-4 w-4 ${status.color}`} />
                    <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => deleteBudget(budget.id)}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* Add New Budget Card */}
          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
              <Target className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Criar Novo Orçamento</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Defina limites de gastos para suas categorias</p>
              <Dialog open={newBudgetOpen} onOpenChange={setNewBudgetOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Orçamento
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        {budgetsWithSpent.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Target className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Nenhum orçamento encontrado</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Comece criando orçamentos para suas categorias de gastos e mantenha suas finanças sob controle.
              </p>
              <Dialog open={newBudgetOpen} onOpenChange={setNewBudgetOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Orçamento
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
