"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target, Plus, TrendingUp, Calendar, DollarSign, Trophy, AlertTriangle, CheckCircle2 } from "lucide-react"

const goals = [
  {
    id: 1,
    title: "Economia Anual",
    description: "Economizar R$ 50.000 durante 2024",
    target: 50000,
    current: 32500,
    deadline: "2024-12-31",
    category: "Economia",
    status: "on_track",
    monthlyTarget: 4167,
    monthlyProgress: 5417,
  },
  {
    id: 2,
    title: "Reduzir Gastos com Alimentação",
    description: "Manter gastos com alimentação abaixo de R$ 3.000/mês",
    target: 36000,
    current: 15000,
    deadline: "2024-12-31",
    category: "Despesas",
    status: "at_risk",
    monthlyTarget: 3000,
    monthlyProgress: 2500,
  },
  {
    id: 3,
    title: "Investimentos",
    description: "Investir R$ 30.000 em aplicações",
    target: 30000,
    current: 22000,
    deadline: "2024-12-31",
    category: "Investimentos",
    status: "on_track",
    monthlyTarget: 2500,
    monthlyProgress: 3667,
  },
  {
    id: 4,
    title: "Reserva de Emergência",
    description: "Formar uma reserva de 6 meses de gastos",
    target: 45000,
    current: 45000,
    deadline: "2024-12-31",
    category: "Emergência",
    status: "completed",
    monthlyTarget: 3750,
    monthlyProgress: 7500,
  },
]

const categories = ["Economia", "Despesas", "Investimentos", "Emergência", "Renda", "Outros"]

export default function MetasPage() {
  const [newGoalOpen, setNewGoalOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState("2024")
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    target: "",
    deadline: "",
    category: "Economia",
  })

  const handleCreateGoal = () => {
    console.log("Creating goal:", newGoal)
    setNewGoalOpen(false)
    setNewGoal({
      title: "",
      description: "",
      target: "",
      deadline: "",
      category: "Economia",
    })
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bgColor: "bg-green-100 dark:bg-green-900/20",
          label: "Concluída",
        }
      case "on_track":
        return {
          icon: TrendingUp,
          color: "text-blue-600",
          bgColor: "bg-blue-100 dark:bg-blue-900/20",
          label: "No prazo",
        }
      case "at_risk":
        return {
          icon: AlertTriangle,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
          label: "Atenção",
        }
      default:
        return {
          icon: Target,
          color: "text-gray-600",
          bgColor: "bg-gray-100 dark:bg-gray-900/20",
          label: "Em andamento",
        }
    }
  }

  const completedGoals = goals.filter((goal) => goal.status === "completed").length
  const totalGoals = goals.length
  const totalTarget = goals.reduce((acc, goal) => acc + goal.target, 0)
  const totalProgress = goals.reduce((acc, goal) => acc + goal.current, 0)
  const overallProgress = (totalProgress / totalTarget) * 100

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Metas {selectedYear}</h1>
          <p className="text-gray-600 dark:text-gray-400">Acompanhe o progresso das suas metas financeiras</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Meta</DialogTitle>
                <DialogDescription>Defina uma nova meta financeira para acompanhar seu progresso</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Meta</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Economia para viagem"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    placeholder="Descreva sua meta em detalhes"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target">Valor Alvo</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                      <Input
                        id="target"
                        type="number"
                        placeholder="0,00"
                        className="pl-10"
                        value={newGoal.target}
                        onChange={(e) => setNewGoal((prev) => ({ ...prev, target: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      value={newGoal.category}
                      onValueChange={(value) => setNewGoal((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Prazo</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal((prev) => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewGoalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateGoal}>Criar Meta</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total de Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGoals}</div>
            <p className="text-xs opacity-90 mt-1">
              <Target className="inline h-3 w-3 mr-1" />
              {completedGoals} concluídas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Taxa de Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((completedGoals / totalGoals) * 100).toFixed(0)}%</div>
            <p className="text-xs opacity-90 mt-1">
              <Trophy className="inline h-3 w-3 mr-1" />
              Metas atingidas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalTarget.toLocaleString("pt-BR")}</div>
            <p className="text-xs opacity-90 mt-1">
              <DollarSign className="inline h-3 w-3 mr-1" />
              Valor das metas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Progresso Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress.toFixed(0)}%</div>
            <p className="text-xs opacity-90 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              R$ {totalProgress.toLocaleString("pt-BR")} alcançado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100
          const statusInfo = getStatusInfo(goal.status)
          const StatusIcon = statusInfo.icon
          const daysRemaining = Math.ceil(
            (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
          )

          return (
            <Card key={goal.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {goal.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${statusInfo.bgColor}`}>
                    <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-3" />
                </div>

                {/* Values */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Atual</p>
                    <p className="font-semibold text-green-600">R$ {goal.current.toLocaleString("pt-BR")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Meta</p>
                    <p className="font-semibold">R$ {goal.target.toLocaleString("pt-BR")}</p>
                  </div>
                </div>

                {/* Monthly Progress */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progresso Mensal</span>
                    <span
                      className={`font-medium ${
                        goal.monthlyProgress >= goal.monthlyTarget ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      R$ {goal.monthlyProgress.toLocaleString("pt-BR")} / R${" "}
                      {goal.monthlyTarget.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <Progress value={(goal.monthlyProgress / goal.monthlyTarget) * 100} className="h-2" />
                </div>

                {/* Status and Deadline */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Badge variant={goal.status === "completed" ? "default" : "secondary"}>{statusInfo.label}</Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {goal.status === "completed"
                      ? "Meta concluída!"
                      : daysRemaining > 0
                        ? `${daysRemaining} dias restantes`
                        : "Prazo vencido"}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar Meta
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
    </div>
  )
}
