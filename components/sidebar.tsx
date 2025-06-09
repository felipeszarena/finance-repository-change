"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  CreditCard,
  Target,
  BarChart3,
  Building2,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter, usePathname } from "next/navigation"

interface SidebarProps {
  className?: string
}

const navigationItems = [
  { icon: Home, label: "Dashboard", href: "/", badge: null },
  { icon: CreditCard, label: "Transações", href: "/transacoes", badge: "12" },
  { icon: Target, label: "Orçamentos", href: "/orcamentos", badge: null },
  { icon: BarChart3, label: "Relatórios", href: "/relatorios", badge: null },
]

const companies = [
  { icon: Building2, label: "Finance Pessoal", href: "/empresa/finance-pessoal", isMain: true },
  { icon: Building2, label: "Empresa 1", href: "/empresa/empresa-1", isMain: false },
  { icon: Building2, label: "Empresa 2", href: "/empresa/empresa-2", isMain: false },
]

const favoritePages = [
  { icon: BarChart3, label: "Fluxo de Caixa", href: "/relatorios/fluxo-caixa" },
  { icon: Target, label: "Metas 2024", href: "/metas/2024" },
]

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleContextMenu = (e: React.MouseEvent, item: any) => {
    e.preventDefault()
    // Context menu logic would go here
  }

  return (
    <div
      className={`${className} ${isCollapsed ? "w-16" : "w-64"} transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Finance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Felipe Arena</p>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {/* Main Navigation */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Principal
              </p>
            )}
            {navigationItems.map((item) => (
              <div key={item.href} onContextMenu={(e) => handleContextMenu(e, item)} className="relative group">
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"}`}
                  size={isCollapsed ? "icon" : "default"}
                  onClick={() => router.push(item.href)}
                >
                  <item.icon className="h-4 w-4" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-2">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
                {!isCollapsed && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Star className="h-4 w-4 mr-2" />
                        Favoritar
                      </DropdownMenuItem>
                      <DropdownMenuItem>Editar página</DropdownMenuItem>
                      <DropdownMenuItem>Ocultar</DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Apagar página</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>

          {/* Companies */}
          <div className="space-y-1 mt-6">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Empresas
                </p>
                <Button variant="ghost" size="icon" className="h-4 w-4">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
            {companies.map((company) => (
              <div key={company.href} onContextMenu={(e) => handleContextMenu(e, company)} className="relative group">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"}`}
                  size={isCollapsed ? "icon" : "default"}
                  onClick={() => router.push(company.href)}
                >
                  <company.icon className="h-4 w-4" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-2">{company.label}</span>
                      {company.isMain && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          Principal
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* Favorites */}
          {favoritePages.length > 0 && (
            <div className="space-y-1 mt-6">
              {!isCollapsed && (
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Favoritos
                </p>
              )}
              {favoritePages.map((page) => (
                <div key={page.href} onContextMenu={(e) => handleContextMenu(e, page)} className="relative group">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"}`}
                    size={isCollapsed ? "icon" : "default"}
                  >
                    <page.icon className="h-4 w-4" />
                    {!isCollapsed && (
                      <>
                        <span className="ml-2">{page.label}</span>
                        <Star className="h-3 w-3 ml-auto text-yellow-500 fill-current" />
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </nav>
      </div>

      {/* Settings */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"}`}
          size={isCollapsed ? "icon" : "default"}
          onClick={() => router.push("/configuracoes")}
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Configurações</span>}
        </Button>
      </div>
    </div>
  )
}
