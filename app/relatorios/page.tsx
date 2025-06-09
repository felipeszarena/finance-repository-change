"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  FileText,
  PieChart,
  LineChart,
  Activity,
} from "lucide-react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { useApp } from "@/contexts/app-context"

export default function RelatoriosPage() {
  const { transactions, budgets, currentCompany } = useApp()
  const [selectedPeriod, setSelectedPeriod] = useState("6m")
  const [selectedReport, setSelectedReport] = useState("overview")

  // Filter data by current company
  const companyTransactions = transactions.filter((t) => t.company === currentCompany)
  const companyBudgets = budgets.filter((b) => b.company === currentCompany)

  // Generate monthly data for the last 6 months
  const monthlyData = [
    { month: "Jan", receitas: 8500, despesas: 6200, lucro: 2300 },
    { month: "Fev", receitas: 9200, despesas: 5800, lucro: 3400 },
    { month: "Mar", receitas: 7800, despesas: 6500, lucro: 1300 },
    { month: "Abr", receitas: 10200, despesas: 7200, lucro: 3000 },
    { month: "Mai", receitas: 9800, despesas: 6800, lucro: 3000 },
    { month: "Jun", receitas: 11500, despesas: 7500, lucro: 4000 },
  ]

  // Category analysis
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
            color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
          })
        }
        return acc
      },
      [] as Array<{ name: string; value: number; color: string }>,
    )

  // Cash flow projection
  const cashFlowData = [
    { month: "Jul", projecao: 12000, real: 0 },
    { month: "Ago", projecao: 13500, real: 0 },
    { month: "Set", projecao: 11800, real: 0 },
    { month: "Out", projecao: 14200, real: 0 },
    { month: "Nov", projecao: 13000, real: 0 },
    { month: "Dez", projecao: 15500, real: 0 },
  ]

  // Calculate summary metrics
  const totalReceitas = companyTransactions
    .filter((t) => t.type === "receita")
    .reduce((acc, curr) => acc + curr.amount, 0)

  const totalDespesas = companyTransactions
    .filter((t) => t.type === "despesa")
    .reduce((acc, curr) => acc + curr.amount, 0)

  const lucroLiquido = totalReceitas - totalDespesas
  const margemLucro = totalReceitas > 0 ? (lucroLiquido / totalReceitas) * 100 : 0

  const reports = [
    { id: "overview", name: "Visão Geral", icon: BarChart3 },
    { id: "cashflow", name: "Fluxo de Caixa", icon: LineChart },
    { id: "categories", name: "Análise por Categoria", icon: PieChart },
    { id: "dre", name: "DRE Simplificado", icon: FileText },
    { id: "trends", name: "Análise de Tendências", icon: Activity },
  ]

  const exportOptions = [
    { format: "PDF", description: "Relatório completo em PDF" },
    { format: "Excel", description: "Planilha com dados detalhados" },
    { format: "PNG", description: "Gráficos em imagem" },
    { format: "CSV", description: "Dados brutos em CSV" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Análises detalhadas e insights financeiros • {currentCompany}
            </p>
          </div>
          <div className="flex items-center gap-3">
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
              Exportar
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Report Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {reports.map((report) => {
            const IconComponent = report.icon
            return (
              <Button
                key={report.id}
                variant={selectedReport === report.id ? "default" : "outline"}
                onClick={() => setSelectedReport(report.id)}
                className="whitespace-nowrap"
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {report.name}
              </Button>
            )
          })}
        </div>

        {/* Overview Report */}
        {selectedReport === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Receitas Totais</CardTitle>
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
                  <CardTitle className="text-sm font-medium opacity-90">Despesas Totais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {totalDespesas.toLocaleString("pt-BR")}</div>
                  <p className="text-xs opacity-90 mt-1">
                    <TrendingDown className="inline h-3 w-3 mr-1" />
                    -3.2% vs período anterior
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Lucro Líquido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {lucroLiquido.toLocaleString("pt-BR")}</div>
                  <p className="text-xs opacity-90 mt-1">
                    <DollarSign className="inline h-3 w-3 mr-1" />
                    Margem: {margemLucro.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Orçamento Utilizado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs opacity-90 mt-1">
                    <Target className="inline h-3 w-3 mr-1" />
                    R$ 2.500 disponível
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`} />
                      <Line type="monotone" dataKey="receitas" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="despesas" stroke="#EF4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="lucro" stroke="#3B82F6" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Despesas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
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
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Cash Flow Report */}
        {selectedReport === "cashflow" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Projeção de Fluxo de Caixa - Próximos 6 Meses</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`} />
                    <Area type="monotone" dataKey="projecao" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Entrada Prevista</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">R$ 79.000</div>
                  <p className="text-sm text-gray-600">Próximos 6 meses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Saída Prevista</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 mb-2">R$ 45.000</div>
                  <p className="text-sm text-gray-600">Próximos 6 meses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Saldo Projetado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">R$ 34.000</div>
                  <p className="text-sm text-gray-600">Resultado líquido</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Categories Report */}
        {selectedReport === "categories" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gastos por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString("pt-BR")}`} />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ranking de Categorias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryData
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 5)
                      .map((category, index) => (
                        <div key={category.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                              {index + 1}
                            </div>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">R$ {category.value.toLocaleString("pt-BR")}</div>
                            <div className="text-sm text-gray-500">
                              {((category.value / totalDespesas) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* DRE Report */}
        {selectedReport === "dre" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Demonstrativo de Resultado do Exercício (DRE)</CardTitle>
                <p className="text-sm text-gray-600">Período: {selectedPeriod}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Receita Bruta</span>
                    <span className="font-semibold text-green-600">R$ {totalReceitas.toLocaleString("pt-BR")}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">(-) Custos e Despesas</span>
                    <span className="font-semibold text-red-600">R$ {totalDespesas.toLocaleString("pt-BR")}</span>
                  </div>

                  <div className="ml-4 space-y-2">
                    {categoryData.map((category) => (
                      <div key={category.name} className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-600">• {category.name}</span>
                        <span className="text-sm">R$ {category.value.toLocaleString("pt-BR")}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center py-3 border-t-2 border-gray-300">
                    <span className="font-bold text-lg">Lucro Líquido</span>
                    <span className={`font-bold text-lg ${lucroLiquido >= 0 ? "text-green-600" : "text-red-600"}`}>
                      R$ {lucroLiquido.toLocaleString("pt-BR")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Margem de Lucro</span>
                    <span className={`font-semibold ${margemLucro >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {margemLucro.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Opções de Exportação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {exportOptions.map((option) => (
                <Button key={option.format} variant="outline" className="h-auto p-4 flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="h-4 w-4" />
                    <span className="font-medium">{option.format}</span>
                  </div>
                  <span className="text-sm text-gray-600 text-left">{option.description}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
