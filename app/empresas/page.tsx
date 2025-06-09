"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Building2,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
} from "lucide-react"

const companies = [
  {
    id: 1,
    name: "Finance Pessoal",
    type: "Pessoal",
    isMain: true,
    revenue: 48500,
    expenses: 32200,
    transactions: 124,
    lastActivity: "2024-06-15",
    growth: 12.5,
  },
  {
    id: 2,
    name: "Empresa 1",
    type: "Empresarial",
    isMain: false,
    revenue: 25000,
    expenses: 18500,
    transactions: 67,
    lastActivity: "2024-06-14",
    growth: -2.3,
  },
  {
    id: 3,
    name: "Empresa 2",
    type: "Empresarial",
    isMain: false,
    revenue: 15600,
    expenses: 12300,
    transactions: 43,
    lastActivity: "2024-06-13",
    growth: 8.7,
  },
]

export default function EmpresasPage() {
  const [newCompanyOpen, setNewCompanyOpen] = useState(false)
  const [newCompany, setNewCompany] = useState({
    name: "",
    type: "Empresarial",
  })

  const handleCreateCompany = () => {
    console.log("Creating company:", newCompany)
    setNewCompanyOpen(false)
    setNewCompany({ name: "", type: "Empresarial" })
  }

  const totalRevenue = companies.reduce((acc, company) => acc + company.revenue, 0)
  const totalExpenses = companies.reduce((acc, company) => acc + company.expenses, 0)
  const totalTransactions = companies.reduce((acc, company) => acc + company.transactions, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciamento de Empresas</h1>
          <p className="text-gray-600 dark:text-gray-400">Organize suas finanças por empresa ou projeto</p>
        </div>
        <Dialog open={newCompanyOpen} onOpenChange={setNewCompanyOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Empresa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Empresa</DialogTitle>
              <DialogDescription>Adicione uma nova empresa ou projeto ao seu dashboard</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input
                  id="name"
                  placeholder="Ex: Minha Empresa LTDA"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <select
                  id="type"
                  className="w-full p-2 border rounded-md"
                  value={newCompany.type}
                  onChange={(e) => setNewCompany((prev) => ({ ...prev, type: e.target.value }))}
                >
                  <option value="Pessoal">Pessoal</option>
                  <option value="Empresarial">Empresarial</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Investimento">Investimento</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewCompanyOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateCompany}>Criar Empresa</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString("pt-BR")}</div>
            <p className="text-xs opacity-90 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Todas as empresas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Despesas Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalExpenses.toLocaleString("pt-BR")}</div>
            <p className="text-xs opacity-90 mt-1">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              Todas as empresas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Lucro Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {(totalRevenue - totalExpenses).toLocaleString("pt-BR")}</div>
            <p className="text-xs opacity-90 mt-1">
              <Users className="inline h-3 w-3 mr-1" />
              {companies.length} empresas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Card key={company.id} className="relative">
            {company.isMain && (
              <div className="absolute top-3 right-3">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              </div>
            )}

            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {company.type}
                    </Badge>
                  </div>
                </div>
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
                    <DropdownMenuItem>
                      <Star className="h-4 w-4 mr-2" />
                      {company.isMain ? "Remover dos favoritos" : "Marcar como principal"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Financial Summary */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Receitas</span>
                  <span className="font-semibold text-green-600">R$ {company.revenue.toLocaleString("pt-BR")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Despesas</span>
                  <span className="font-semibold text-red-600">R$ {company.expenses.toLocaleString("pt-BR")}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">Lucro</span>
                  <span className="font-bold text-blue-600">
                    R$ {(company.revenue - company.expenses).toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <p className="text-xs text-gray-500">Transações</p>
                  <p className="font-semibold">{company.transactions}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Crescimento</p>
                  <div className="flex items-center gap-1">
                    {company.growth > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${company.growth > 0 ? "text-green-600" : "text-red-600"}`}>
                      {company.growth > 0 ? "+" : ""}
                      {company.growth}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Last Activity */}
              <div className="text-xs text-gray-500 pt-2 border-t">
                Última atividade: {new Date(company.lastActivity).toLocaleDateString("pt-BR")}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Detalhes
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Transações
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
