"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TransactionForm } from "@/components/transaction-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Filter,
  Search,
  Download,
  MoreHorizontal,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpDown,
} from "lucide-react"

const transactions = [
  {
    id: 1,
    description: "Salário",
    amount: 8500,
    type: "receita",
    category: "Salário",
    date: "2024-06-15",
    company: "Finance Pessoal",
    paymentMethod: "Transferência",
  },
  {
    id: 2,
    description: "Supermercado Extra",
    amount: -320,
    type: "despesa",
    category: "Alimentação",
    date: "2024-06-14",
    company: "Finance Pessoal",
    paymentMethod: "Cartão de Débito",
  },
  {
    id: 3,
    description: "Uber",
    amount: -45,
    type: "despesa",
    category: "Transporte",
    date: "2024-06-14",
    company: "Finance Pessoal",
    paymentMethod: "PIX",
  },
  {
    id: 4,
    description: "Freelance Design",
    amount: 1200,
    type: "receita",
    category: "Freelance",
    date: "2024-06-13",
    company: "Empresa 1",
    paymentMethod: "PIX",
  },
  {
    id: 5,
    description: "Conta de Luz",
    amount: -180,
    type: "despesa",
    category: "Moradia",
    date: "2024-06-12",
    company: "Finance Pessoal",
    paymentMethod: "Boleto",
  },
  {
    id: 6,
    description: "Academia",
    amount: -89,
    type: "despesa",
    category: "Saúde",
    date: "2024-06-11",
    company: "Finance Pessoal",
    paymentMethod: "Cartão de Crédito",
  },
  {
    id: 7,
    description: "Dividendos",
    amount: 450,
    type: "receita",
    category: "Investimentos",
    date: "2024-06-10",
    company: "Finance Pessoal",
    paymentMethod: "Transferência",
  },
  {
    id: 8,
    description: "Cinema",
    amount: -35,
    type: "despesa",
    category: "Lazer",
    date: "2024-06-09",
    company: "Finance Pessoal",
    paymentMethod: "Cartão de Crédito",
  },
]

export default function TransacoesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter
      const matchesType = typeFilter === "all" || transaction.type === typeFilter
      const matchesCompany = companyFilter === "all" || transaction.company === companyFilter
      return matchesSearch && matchesCategory && matchesType && matchesCompany
    })
    .sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1
      switch (sortBy) {
        case "date":
          return order * (new Date(a.date).getTime() - new Date(b.date).getTime())
        case "amount":
          return order * (Math.abs(a.amount) - Math.abs(b.amount))
        case "description":
          return order * a.description.localeCompare(b.description)
        default:
          return 0
      }
    })

  const totalReceitas = filteredTransactions.filter((t) => t.type === "receita").reduce((acc, t) => acc + t.amount, 0)

  const totalDespesas = filteredTransactions
    .filter((t) => t.type === "despesa")
    .reduce((acc, t) => acc + Math.abs(t.amount), 0)

  const saldo = totalReceitas - totalDespesas

  const categories = [...new Set(transactions.map((t) => t.category))]
  const companies = [...new Set(transactions.map((t) => t.company))]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transações</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie todas as suas transações financeiras</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <TransactionForm />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalReceitas.toLocaleString("pt-BR")}</div>
            <p className="text-xs opacity-90 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              {filteredTransactions.filter((t) => t.type === "receita").length} transações
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
              {filteredTransactions.filter((t) => t.type === "despesa").length} transações
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {saldo.toLocaleString("pt-BR")}</div>
            <p className="text-xs opacity-90 mt-1">
              <Calendar className="inline h-3 w-3 mr-1" />
              {filteredTransactions.length} transações total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="receita">Receitas</SelectItem>
                <SelectItem value="despesa">Despesas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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

            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as empresas</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="amount">Valor</SelectItem>
                <SelectItem value="description">Descrição</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Transações</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortOrder === "asc" ? "Crescente" : "Decrescente"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">{transaction.company}</TableCell>
                  <TableCell className="text-sm">{new Date(transaction.date).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell className="text-sm">{transaction.paymentMethod}</TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      transaction.type === "receita" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.type === "receita" ? "+" : ""}R$ {Math.abs(transaction.amount).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
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
        </CardContent>
      </Card>
    </div>
  )
}
