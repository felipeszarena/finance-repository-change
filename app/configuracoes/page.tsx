"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Palette, Download, Upload, Trash2, Moon, Sun, Globe, CreditCard } from "lucide-react"

export default function ConfiguracoesPage() {
  const [theme, setTheme] = useState("dark")
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    budget: true,
    goals: true,
    transactions: false,
  })
  const [profile, setProfile] = useState({
    name: "Felipe Arena",
    email: "felipe.arena@email.com",
    currency: "BRL",
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
  })

  const handleSaveProfile = () => {
    console.log("Saving profile:", profile)
  }

  const handleSaveNotifications = () => {
    console.log("Saving notifications:", notifications)
  }

  const handleExportData = () => {
    console.log("Exporting data...")
  }

  const handleImportData = () => {
    console.log("Importing data...")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações</h1>
          <p className="text-gray-600 dark:text-gray-400">Personalize sua experiência no Finance Dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Moeda</Label>
                <Select
                  value={profile.currency}
                  onValueChange={(value) => setProfile((prev) => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real (R$)</SelectItem>
                    <SelectItem value="USD">Dólar ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select
                  value={profile.language}
                  onValueChange={(value) => setProfile((prev) => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select
                  value={profile.timezone}
                  onValueChange={(value) => setProfile((prev) => ({ ...prev, timezone: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                    <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveProfile}>Salvar Perfil</Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Tema</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  className="flex items-center gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Claro
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  className="flex items-center gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Escuro
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Configurações Visuais</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Animações</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Gráficos animados</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Modo compacto</span>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Canais de Notificação</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Email</span>
                    <p className="text-xs text-gray-500">Receber notificações por email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Push</span>
                    <p className="text-xs text-gray-500">Notificações push no navegador</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">SMS</span>
                    <p className="text-xs text-gray-500">Alertas importantes via SMS</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, sms: checked }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Tipos de Notificação</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Alertas de Orçamento</span>
                    <p className="text-xs text-gray-500">Quando ultrapassar 80% do orçamento</p>
                  </div>
                  <Switch
                    checked={notifications.budget}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, budget: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Progresso de Metas</span>
                    <p className="text-xs text-gray-500">Atualizações sobre suas metas</p>
                  </div>
                  <Switch
                    checked={notifications.goals}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, goals: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Novas Transações</span>
                    <p className="text-xs text-gray-500">Confirmar transações automáticas</p>
                  </div>
                  <Switch
                    checked={notifications.transactions}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, transactions: checked }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveNotifications}>Salvar Notificações</Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Backup e Exportação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button onClick={handleExportData} className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar Dados (JSON)
              </Button>
              <Button onClick={handleExportData} className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar Relatório (PDF)
              </Button>
              <Button onClick={handleExportData} className="w-full justify-start" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar Planilha (Excel)
              </Button>
            </div>
            <Separator />
            <div className="space-y-3">
              <Button onClick={handleImportData} className="w-full justify-start" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importar Dados
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança e Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Métodos de Pagamento
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                Política de Privacidade
              </Button>
            </div>
            <Separator />
            <div className="space-y-3">
              <Button variant="destructive" className="w-full justify-start">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm text-gray-500">Plano Atual</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default">Pro</Badge>
                <span className="text-sm">R$ 29,90/mês</span>
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Membro desde</Label>
              <p className="font-medium mt-1">Janeiro 2024</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Último backup</Label>
              <p className="font-medium mt-1">15/06/2024 às 14:30</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
