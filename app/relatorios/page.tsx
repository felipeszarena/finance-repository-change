"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Calendar, Download, TrendingUp, TrendingDown, Target, DollarSign } from "lucide-react"

const monthlyData = [
  { month: "Jan", receitas: 8500, despesas: 6200, economia: 2300 },
  { month: "Fev", receitas: 9200, despesas: 5800, economia: 3400 },
  { month: "Mar", receitas: 7800, despesas: 6500, economia: 1300 },
  { month: "Abr", receitas: 10200, despesas: 7200, economia: 3000 },
  { month: "Mai", receitas: 9800, despesas: 6800, economia: 3000 },
  { month: "Jun", receitas: 11500, despesas: 7500, economia: 4000 },
]

const categoryExpenses = [
  { name: "Alimentação", value: 2500, percentage: 33.3, color: "#3B82F6" },
  { name: "Moradia", value: 3500, percentage: 46.7, color: "#10B981" },
  { name: "Transporte", value: 1200, percentage: 16.0, color: "#F59E0B" },
  { name: "Lazer", value: 800, percentage: 10.7, color: "#EF4444" },
  { name: "Saúde", value: 600, percentage: 8.0, color: "#8B5CF6" },
  { name: "Outros", value: 900, percentage: 12.0, color: "#6B7280" },
]

const cashFlowData = [
  { date: "01/06", entrada: 2000, saida: 1500, saldo: 500 },
  { date: "02/06", entrada: 0, saida: 300, saldo: 200 },
  { date: "03/06", entrada: 1200, saida: 800, saldo: 600 },
  { date: "04/06", entrada: 0, saida: 450, saldo: 150 },
  { date: "05/06", entrada: 8500, saida: 2200, saldo: 6450 },
  { date: "06/06", entrada: 0, saida: 180, saldo: 6270 },
  { date: "07/06", entrada: 500, saida: 320, saldo: 6450 },
]

const monthlyComparison = [
  { category: "Alimentação", atual: 2500, anterior: 2200, meta: 3000 },
  { category: "Transporte", atual: 1200, anterior: 1350, meta: 1500 },
  { category: "Moradia", atual: 3500, anterior: 3200, meta: 4000 },
  { category: "Lazer", atual: 800, anterior: 750, meta: 1000 },
]

export default function RelatoriosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6m")
  const [reportType, setReportType] = useState("geral")

  const totalReceitas = monthlyData.reduce((acc, curr) => acc + curr.receitas, 0)
  const totalDespesas = monthlyData.reduce((acc, curr) => acc + curr.despesas, 0)
  const totalEconomia = monthlyData.reduce((acc, curr) => acc + curr.economia, 0)
  const mediaEconomia = totalEconomia / monthlyData.length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
          <p className="text-gray-600 dark:text-gray-400">Análise detalhada das suas finanças</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geral">Relatório Geral</SelectItem>
              <SelectItem value="categoria">Por Categoria</SelectItem>
              <SelectItem value="fluxo">Fluxo de Caixa</SelectItem>
              <SelectItem value="comparativo">Comparativo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Último mês</SelectItem>
              <SelectItem value="3m">Últimos 3 meses</SelectItem>
              <SelectItem value="6m">Últimos 6 meses</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>

          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalReceitas.toLocaleString("pt-BR")}</div>
            <p className="text-xs opacity-90 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12.5% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalDespesas.toLocaleString("pt-BR")}</div>
            <p className="text-xs opacity-90 mt-1">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -3.1% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Economia Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalEconomia.toLocaleString("pt-BR")}</div>
            <p className="text-xs opacity-90 mt-1">
              <Target className="inline h-3 w-3 mr-1" />
              Meta: R$ 15.000
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Média Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {mediaEconomia.toLocaleString("pt-BR")}</div>
            <p className="text-xs opacity-90 mt-1">
              <DollarSign className="inline h-3 w-3 mr-1" />
              Economia por mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Financeira</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`} />
                <Area
                  type="monotone"
                  dataKey="receitas"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="despesas"
                  stackId="2"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.6}
                />
                <Line type="monotone" dataKey="economia" stroke="#3B82F6" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryExpenses}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {categoryExpenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo de Caixa Diário</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString("pt-BR")}`} />
                <Bar dataKey="entrada" fill="#10B981" name="Entradas" />
                <Bar dataKey="saida" fill="#EF4444" name="Saídas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparativo Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyComparison.map((item) => {
                const percentageChange = ((item.atual - item.anterior) / item.anterior) * 100
                const isIncrease = percentageChange > 0

                return (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={isIncrease ? "destructive" : "default"}>
                          {isIncrease ? "+" : ""}
                          {percentageChange.toFixed(1)}%
                        </Badge>
                        {isIncrease ? (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Atual:</span>
                        <p className="font-medium">R$ {item.atual.toLocaleString("pt-BR")}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Anterior:</span>
                        <p className="font-medium">R$ {item.anterior.toLocaleString("pt-BR")}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Meta:</span>
                        <p className="font-medium">R$ {item.meta.toLocaleString("pt-BR")}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
