"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Search, Download, CreditCard, DollarSign, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Payment {
  id: string
  date: string
  amount: number
  status: "paid" | "pending" | "overdue"
  plan: string
  period: string
}

export default function PagamentosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [date, setDate] = useState<Date | undefined>(undefined)

  const payments: Payment[] = [
    {
      id: "1",
      date: "02/04/2025",
      amount: 49.9,
      status: "paid",
      plan: "Plano Básico",
      period: "Abril 2025",
    },
    {
      id: "2",
      date: "02/03/2025",
      amount: 49.9,
      status: "paid",
      plan: "Plano Básico",
      period: "Março 2025",
    },
    {
      id: "3",
      date: "02/02/2025",
      amount: 49.9,
      status: "paid",
      plan: "Plano Básico",
      period: "Fevereiro 2025",
    },
    {
      id: "4",
      date: "02/01/2025",
      amount: 49.9,
      status: "paid",
      plan: "Plano Básico",
      period: "Janeiro 2025",
    },
    {
      id: "5",
      date: "02/12/2024",
      amount: 49.9,
      status: "paid",
      plan: "Plano Básico",
      period: "Dezembro 2024",
    },
    {
      id: "6",
      date: "02/05/2025",
      amount: 49.9,
      status: "pending",
      plan: "Plano Básico",
      period: "Maio 2025",
    },
    {
      id: "7",
      date: "02/11/2024",
      amount: 39.9,
      status: "overdue",
      plan: "Plano Básico (Promoção)",
      period: "Novembro 2024",
    },
  ]

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.period.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesDate = !date || payment.date === date.toLocaleDateString("pt-BR")

    return matchesSearch && matchesStatus && matchesDate
  })

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDate(undefined)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Atrasado</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Histórico de Pagamentos</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Plano Atual</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Plano Básico</div>
            <p className="text-xs text-gray-500">R$ 49,90/mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status da Assinatura</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <span className="mr-2 flex h-3 w-3 rounded-full bg-green-500"></span>
              Ativa
            </div>
            <p className="text-xs text-gray-500">Renovação automática</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Próximo Pagamento</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">02/05/2025</div>
            <p className="text-xs text-gray-500">R$ 49,90</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre os pagamentos por plano, status ou data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por plano ou período"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="paid">Pagos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="overdue">Atrasados</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? date.toLocaleDateString("pt-BR") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Button variant="outline" onClick={clearFilters} className="sm:col-span-2 md:col-span-3">
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados</CardTitle>
          <CardDescription>{filteredPayments.length} pagamentos encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment, index) => (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b transition-colors hover:bg-gray-50"
                      >
                        <TableCell>{payment.date}</TableCell>
                        <TableCell className="font-medium">{payment.plan}</TableCell>
                        <TableCell>{payment.period}</TableCell>
                        <TableCell>R$ {payment.amount.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                              <DropdownMenuItem>Baixar recibo</DropdownMenuItem>
                              <DropdownMenuItem>Reportar problema</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhum pagamento encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

