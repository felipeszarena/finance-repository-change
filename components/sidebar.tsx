"use client"

import type React from "react"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
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
  Trophy,
  Eye,
  EyeOff,
  Edit,
  Copy,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useApp } from "@/contexts/app-context"

interface SidebarProps {
  className?: string
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Home,
  CreditCard,
  Target,
  BarChart3,
  Building2,
  Star,
  Settings,
  Trophy,
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const {
    pages,
    companies,
    currentCompany,
    setCurrentCompany,
    toggleFavorite,
    toggleVisibility,
    deletePage,
    transactions,
  } = useApp()

  const visiblePages = pages.filter((page) => page.isVisible && !page.isDeleted)
  const favoritePages = pages.filter((page) => page.isFavorite && page.isVisible && !page.isDeleted)
  const mainPages = visiblePages.filter(
    (page) => !page.isFavorite && ["Dashboard", "Transações", "Orçamentos", "Relatórios"].includes(page.name),
  )
  const otherPages = visiblePages.filter(
    (page) => !page.isFavorite && !["Dashboard", "Transações", "Orçamentos", "Relatórios"].includes(page.name),
  )

  const handlePageClick = (route: string) => {
    router.push(route)
  }

  const handleCompanyClick = (companyName: string) => {
    setCurrentCompany(companyName)
    if (companyName === "Finance Pessoal") {
      router.push("/")
    } else {
      router.push(`/empresa/${companyName.toLowerCase().replace(/\s+/g, "-")}`)
    }
  }

  const handleContextMenu = (e: React.MouseEvent, page: any) => {
    e.preventDefault()
  }

  const getTransactionCount = () => {
    return transactions.filter((t) => t.company === currentCompany).length
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
            {mainPages.map((page) => {
              const IconComponent = iconMap[page.icon] || Home
              const isActive = pathname === page.route
              return (
                <div key={page.id} onContextMenu={(e) => handleContextMenu(e, page)} className="relative group">
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"}`}
                    size={isCollapsed ? "icon" : "default"}
                    onClick={() => handlePageClick(page.route)}
                  >
                    <IconComponent className="h-4 w-4" />
                    {!isCollapsed && (
                      <>
                        <span className="ml-2">{page.name}</span>
                        {page.name === "Transações" && (
                          <Badge variant="secondary" className="ml-auto">
                            {getTransactionCount()}
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
                        <DropdownMenuItem onClick={() => toggleFavorite(page.id)}>
                          <Star className={`h-4 w-4 mr-2 ${page.isFavorite ? "fill-current text-yellow-500" : ""}`} />
                          {page.isFavorite ? "Remover dos favoritos" : "Favoritar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar página
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleVisibility(page.id)}>
                          {page.isVisible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                          {page.isVisible ? "Ocultar" : "Mostrar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => deletePage(page.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Apagar página
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              )
            })}
          </div>

          {/* Companies */}
          <div className="space-y-1 mt-6">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Empresas
                </p>
                <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => router.push("/empresas")}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
            {companies.map((company) => {
              const isActive = currentCompany === company.name
              return (
                <div key={company.id} className="relative group">
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"}`}
                    size={isCollapsed ? "icon" : "default"}
                    onClick={() => handleCompanyClick(company.name)}
                  >
                    <Building2 className="h-4 w-4" />
                    {!isCollapsed && (
                      <>
                        <span className="ml-2">{company.name}</span>
                        {company.isMain && (
                          <Badge variant="outline" className="ml-auto text-xs">
                            Principal
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Other Pages */}
          {otherPages.length > 0 && (
            <div className="space-y-1 mt-6">
              {!isCollapsed && (
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Outras Páginas
                </p>
              )}
              {otherPages.map((page) => {
                const IconComponent = iconMap[page.icon] || Home
                const isActive = pathname === page.route
                return (
                  <div key={page.id} className="relative group">
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"}`}
                      size={isCollapsed ? "icon" : "default"}
                      onClick={() => handlePageClick(page.route)}
                    >
                      <IconComponent className="h-4 w-4" />
                      {!isCollapsed && <span className="ml-2">{page.name}</span>}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Favorites */}
          {favoritePages.length > 0 && (
            <div className="space-y-1 mt-6">
              {!isCollapsed && (
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Favoritos
                </p>
              )}
              {favoritePages.map((page) => {
                const IconComponent = iconMap[page.icon] || Home
                const isActive = pathname === page.route
                return (
                  <div key={page.id} className="relative group">
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"}`}
                      size={isCollapsed ? "icon" : "default"}
                      onClick={() => handlePageClick(page.route)}
                    >
                      <IconComponent className="h-4 w-4" />
                      {!isCollapsed && (
                        <>
                          <span className="ml-2">{page.name}</span>
                          <Star className="h-3 w-3 ml-auto text-yellow-500 fill-current" />
                        </>
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </nav>
      </div>

      {/* Settings */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant={pathname === "/configuracoes" ? "secondary" : "ghost"}
          className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"}`}
          size={isCollapsed ? "icon" : "default"}
          onClick={() => handlePageClick("/configuracoes")}
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Configurações</span>}
        </Button>
      </div>
    </div>
  )
}
