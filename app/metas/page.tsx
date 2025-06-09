"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Trophy, Target, Plus, TrendingUp, CheckCircle, Clock, Pause } from "lucide-react"
import { useApp } from "@/contexts/app-context"

export default function MetasPage() {
  const { goals, currentCompany, addGoal, updateGoal, deleteGoal } = useApp()
  const [newGoalOpen, setNewGoalOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetAmount: "",
    deadline: "",
    category: "",
    company: currentCompany
  })

  const companyGoals = goals.filter(g => g.company === currentCompany)

  const getGoalStatus = (goal: any) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100
    const deadline = new Date(goal.deadline)
    const now = new Date()
    const isOverdue = deadline < now && goal.status === "ativo"
    
    if (goal.status === "concluido") return { color: "text-green-600", label: "Concluída", icon: CheckCircle }
    if (goal.status === "pausado") return { color: "text-gray-600", label: "Pausada", icon: Pause }
    if (isOverdue) return { color: "text-red-600", label: "Atrasada", icon: Clock }
    return { color: "text-blue-600", label: "Em andamento", icon: Target }
  }

  const getProgressColor = (progress: number, status: string) => {
    if (status === "concluido") return "bg-green-500"
    if (status === "pausado") return "bg-gray-500"
    if (progress >= 100) return "bg-green-500"
    if (progress >= 75) return "bg-blue-500"
    if (progress >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const handleCreateGoal = () => {
    if (newGoal.title && newGoal.targetAmount && newGoal.deadline) {
      addGoal({
        title: newGoal.title,
        description: newGoal.description,
        targetAmount: Number.parseFloat(newGoal.targetAmount),
        deadline: newGoal.deadline,
        category: newGoal.category || "Geral",
        company: newGoal.company
      })
      setNewGoalOpen(false)
      setNewGoal({
        title: "",
        description: "",
        targetAmount: "",
        deadline: "",
        category: "",
        company: currentCompany
      })
    }
  }

  const totalGoals = companyGoals.length
  const completedGoals = companyGoals.filter(g => g.status === "concluido").length
  const activeGoals = companyGoals.filter(g => g.status === "ativo").length
  const totalTargetAmount = companyGoals.reduce((acc, g) => acc + g.targetAmount, 0)
  const totalCurrentAmount = companyGoals.reduce((acc, g) => acc + g.currentAmount, 0)
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0

  const categories = ["Poupança", "Investimento", "Lazer", "Educação", "Saúde", "Viagem", "Casa", "Carro", "Outros"]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Metas 2024</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Acompanhe seus objetivos financeiros • {currentCompany}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Meta
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Criar Nova Meta</DialogTitle>
                  <DialogDescription>
                    Defina um objetivo financeiro para alcançar em 2024
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título da Meta</Label>
                    <Input
                      placeholder="Ex: Reserva de emergência"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      placeholder="Descreva sua meta..."
                      value={newGoal.description}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valor Alvo</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          className="pl-10"
                          value={newGoal.targetAmount}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select
                        value={newGoal.category}
                        onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Data Limite</Label>
                    <Input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
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
      </header>

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total de Metas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{totalGoals}</div>
                <Trophy className="h-8 w-8 opacity-90" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Metas Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{completedGoals}</div>
                <CheckCircle className="h-8 w-8 opacity-90" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Metas Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{activeGoals}</div>
                <Target className="h-8 w-8 opacity-90" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Progresso Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{overallProgress.toFixed(0)}%</div>
                <TrendingUp className="h-8 w-8 opacity-90" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Progresso Geral das Metas 2024
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Valor Total das Metas</span>
                <span className="font-medium">R$ {totalTargetAmount.toLocaleString("pt-BR")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Valor Atual Acumulado</span>
                <span className="font-medium">R$ {totalCurrentAmount.toLocaleString("pt-BR")}</span>
              </div>
              <Progress value={overallProgress} className="h-4" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progresso: {overallProgress.toFixed(1)}%</span>
                <span>Faltam: R$ {(totalTargetAmount - totalCurrentAmount).toLocaleString("pt-BR")}</span>
              </div>
            </div>
          </CardContent>\
