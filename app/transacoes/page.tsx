"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowUpDown,
  X,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { TransactionForm } from "@/components/transaction-form"
import { useApp } from "@/contexts/app-context"

export default function TransacoesPage() {
  const { transactions, currentCompany, deleteTransaction } = useApp()
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    type: "",
    dateRange: "",
    paymentMethod: "",
  })
  const [sortBy, setSortBy] = useState<"date" | "amount" | "description">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Filter transactions by current company
  const companyTransactions = transactions.filter((t) => t.company === currentCompany)

  // Apply filters
  const filteredTransactions = companyTransactions.filter((transaction) => {
    const matchesSearch =
      !filters.search ||
      transaction.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      transaction.category.toLowerCase().includes(filters.search.toLowerCase())

    const matchesCategory = !filters.category || transaction.category === filters.category
    const matchesType = !filters.type || transaction.type === filters.type
    const matchesPaymentMethod = !filters.paymentMethod || transaction.paymentMethod === filters.paymentMethod

    return matchesSearch && matchesCategory && matchesType && matchesPaymentMethod
  })

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "date":
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
        break
      case "amount":
        comparison = a.amount - b.amount
        break
      case "description":
        comparison = a.description.localeCompare(b.description)
        break
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

  // Calculate summary
  const totalReceitas = companyTransactions
    .filter((t) => t.type === "receita")
    .reduce((acc, curr) => acc + curr.amount, 0)

  const totalDespesas = companyTransactions
    .filter((t) => t.type === "despesa")
    .reduce((acc, curr) => acc + curr.amount, 0)

  const saldoTotal = totalReceitas - totalDespesas

  const handleSelectTransaction = (transactionId: string) => {
    setSelectedTransactions((prev) =>
      prev.includes(transactionId) ? prev.filter((id) => id !== transactionId) : [...prev, transactionId],
    )
  }

  const handleSelectAll = () => {
    if (selectedTransactions.length === sortedTransactions.length) {
      setSelectedTransactions([])
    } else {
      setSelectedTransactions(sortedTransactions.map((t) => t.id))
    }
  }

  const handleDeleteSelected = () => {
    selectedTransactions.forEach((id) => deleteTransaction(id))
    setSelectedTransactions([])
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      type: "",
      dateRange: "",
      paymentMethod: "",
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  const categories = Array.from(new Set(companyTransactions.map((t) => t.category)))
  const paymentMethods = Array.from(new Set(companyTransactions.map((t) => t.paymentMethod)))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transações</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie suas receitas e despesas • {currentCompany}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <TransactionForm />
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Receitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">R$ {totalReceitas.toLocaleString("pt-BR")}</div>
                <TrendingUp className="h-6 w-6 opacity-90" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">R$ {totalDespesas.toLocaleString("pt-BR")}</div>
                <TrendingDown className="h-6 w-6 opacity-90" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Saldo Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">R$ {saldoTotal.toLocaleString("pt-BR")}</div>
                <DollarSign className="h-6 w-6 opacity-90" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filtros e Ações</CardTitle>
              {selectedTransactions.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedTransactions.length} selecionadas
                  </span>
                  <Button variant="outline" onClick={handleDeleteSelected}>
                    Excluir Selecionadas
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Quick Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por descrição ou categoria..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              )}
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="receita">Receitas</SelectItem>
                  <SelectItem value="despesa">Despesas</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.paymentMethod}
                onValueChange={(value) => setFilters({ ...filters, paymentMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Forma de Pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as formas</SelectItem>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.dateRange} onValueChange={(value) => setFilters({ ...filters, dateRange: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os períodos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mês</SelectItem>
                  <SelectItem value="year">Este ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Transações ({sortedTransactions.length})</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Ordenar por
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedTransactions.length === sortedTransactions.length && sortedTransactions.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSortBy("description")
                          setSortOrder(sortBy === "description" && sortOrder === "asc" ? "desc" : "asc")
                        }}
                      >
                        Descrição
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSortBy("amount")
                          setSortOrder(sortBy === "amount" && sortOrder === "asc" ? "desc" : "asc")
                        }}
                      >
                        Valor
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSortBy("date")
                          setSortOrder(sortBy === "date" && sortOrder === "asc" ? "desc" : "asc")
                        }}
                      >
                        Data
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedTransactions.includes(transaction.id)}
                          onCheckedChange={() => handleSelectTransaction(transaction.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          {transaction.notes && <div className="text-sm text-gray-500">{transaction.notes}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`font-semibold ${
                            transaction.type === "receita" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.type === "receita" ? "+" : "-"}R$ {transaction.amount.toLocaleString("pt-BR")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{transaction.paymentMethod}</span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>Duplicar</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => deleteTransaction(transaction.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {sortedTransactions.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    {hasActiveFilters
                      ? "Nenhuma transação encontrada com os filtros aplicados"
                      : "Nenhuma transação encontrada"}
                  </div>
                  {hasActiveFilters ? (
                    <Button variant="outline" onClick={clearFilters}>
                      Limpar filtros
                    </Button>
                  ) : (
                    <TransactionForm
                      trigger={
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar primeira transação
                        </Button>
                      }
                    />
                  )}
                </div>
              )}
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
