"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Search, CheckCircle, XCircle, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"

interface Delivery {
  id: string
  company: string
  date: string
  status: "completed" | "canceled"
  value: number
  distance: number
  details?: {
    pickupAddress: string
    deliveryAddress: string
    customer: string
    items: string
    duration: string
  }
}

export default function CorridasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(false)

  const deliveries: Delivery[] = [
    {
      id: "1",
      company: "Restaurante Sabor Caseiro",
      date: "02/04/2025",
      status: "completed",
      value: 25,
      distance: 3.5,
      details: {
        pickupAddress: "Av. Paulista, 1000",
        deliveryAddress: "Rua Augusta, 500",
        customer: "Maria Silva",
        items: "1x Marmitex, 1x Refrigerante",
        duration: "25 min",
      },
    },
    {
      id: "2",
      company: "Farmácia Saúde",
      date: "02/04/2025",
      status: "completed",
      value: 18,
      distance: 2.1,
      details: {
        pickupAddress: "Rua Oscar Freire, 200",
        deliveryAddress: "Alameda Santos, 800",
        customer: "João Pereira",
        items: "Medicamentos",
        duration: "15 min",
      },
    },
    {
      id: "3",
      company: "Mercado Express",
      date: "01/04/2025",
      status: "canceled",
      value: 30,
      distance: 4.2,
      details: {
        pickupAddress: "Rua Haddock Lobo, 350",
        deliveryAddress: "Av. Rebouças, 1200",
        customer: "Ana Costa",
        items: "Compras de supermercado",
        duration: "30 min",
      },
    },
    {
      id: "4",
      company: "Loja de Eletrônicos TechPlus",
      date: "01/04/2025",
      status: "completed",
      value: 22,
      distance: 3.0,
      details: {
        pickupAddress: "Shopping Ibirapuera",
        deliveryAddress: "Rua Pamplona, 700",
        customer: "Carlos Mendes",
        items: "1x Carregador, 1x Fone de ouvido",
        duration: "20 min",
      },
    },
    {
      id: "5",
      company: "Padaria Pão Dourado",
      date: "31/03/2025",
      status: "completed",
      value: 15,
      distance: 1.8,
      details: {
        pickupAddress: "Rua dos Pinheiros, 100",
        deliveryAddress: "Av. Faria Lima, 250",
        customer: "Roberto Alves",
        items: "2x Pão Francês, 1x Bolo",
        duration: "10 min",
      },
    },
    {
      id: "6",
      company: "Açougue Premium",
      date: "31/03/2025",
      status: "completed",
      value: 28,
      distance: 3.7,
      details: {
        pickupAddress: "Rua Teodoro Sampaio, 800",
        deliveryAddress: "Rua Cardeal Arcoverde, 300",
        customer: "Fernanda Lima",
        items: "2kg Carne, 1kg Frango",
        duration: "22 min",
      },
    },
    {
      id: "7",
      company: "Livraria Cultura",
      date: "30/03/2025",
      status: "canceled",
      value: 20,
      distance: 2.5,
      details: {
        pickupAddress: "Shopping Eldorado",
        deliveryAddress: "Rua Harmonia, 450",
        customer: "Paulo Santos",
        items: "3x Livros",
        duration: "18 min",
      },
    },
    {
      id: "8",
      company: "Pet Shop Amigo Fiel",
      date: "30/03/2025",
      status: "completed",
      value: 23,
      distance: 3.2,
      details: {
        pickupAddress: "Av. Brigadeiro Faria Lima, 1500",
        deliveryAddress: "Rua dos Pinheiros, 500",
        customer: "Mariana Costa",
        items: "1x Ração, 2x Brinquedos",
        duration: "15 min",
      },
    },
  ]

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch = delivery.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter
    const matchesDate = !date || delivery.date === date.toLocaleDateString("pt-BR")

    return matchesSearch && matchesStatus && matchesDate
  })

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDate(undefined)
  }

  const viewDeliveryDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setShowDeliveryDetails(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Histórico de Corridas</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre as corridas por empresa, status ou data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por empresa"
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
                <SelectItem value="completed">Concluídas</SelectItem>
                <SelectItem value="canceled">Canceladas</SelectItem>
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

            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados</CardTitle>
          <CardDescription>{filteredDeliveries.length} corridas encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Distância</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeliveries.length > 0 ? (
                    filteredDeliveries.map((delivery, index) => (
                      <motion.tr
                        key={delivery.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b transition-colors hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">{delivery.company}</TableCell>
                        <TableCell>{delivery.date}</TableCell>
                        <TableCell>R$ {delivery.value.toFixed(2)}</TableCell>
                        <TableCell>{delivery.distance.toFixed(1)} km</TableCell>
                        <TableCell>
                          {delivery.status === "completed" ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Concluída
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              <XCircle className="mr-1 h-3 w-3" />
                              Cancelada
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => viewDeliveryDetails(delivery)}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhuma corrida encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Details Drawer */}
      <Sheet open={showDeliveryDetails} onOpenChange={setShowDeliveryDetails}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Detalhes da Corrida</SheetTitle>
            <SheetDescription>
              {selectedDelivery?.company} - {selectedDelivery?.date}
            </SheetDescription>
          </SheetHeader>
          {selectedDelivery && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <div className="mt-1">
                  {selectedDelivery.status === "completed" ? (
                    <Badge className="bg-green-100 text-green-800">Concluída</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">Cancelada</Badge>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Cliente</h3>
                  <p className="mt-1">{selectedDelivery.details?.customer}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Endereço de Coleta</h3>
                  <p className="mt-1">{selectedDelivery.details?.pickupAddress}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Endereço de Entrega</h3>
                  <p className="mt-1">{selectedDelivery.details?.deliveryAddress}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Itens</h3>
                  <p className="mt-1">{selectedDelivery.details?.items}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Valor</h3>
                    <p className="mt-1">R$ {selectedDelivery.value.toFixed(2)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Distância</h3>
                    <p className="mt-1">{selectedDelivery.distance.toFixed(1)} km</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Duração</h3>
                    <p className="mt-1">{selectedDelivery.details?.duration}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <SheetClose asChild>
                  <Button className="w-full">Fechar</Button>
                </SheetClose>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

