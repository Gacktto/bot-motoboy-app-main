"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Calendar,
  ChevronRight,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { dashboardApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { CardInfoList } from "./components/card-info-list";

export default function DashboardPage() {
  const [activeDelivery, setActiveDelivery] = useState<string | null>(null);
  const [confirmingRideId, setConfirmingRideId] = useState<string | null>(null);
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [selectedRideDetails, setSelectedRideDetails] = useState<any>(null);
  const [showRideDetails, setShowRideDetails] = useState(false);

  const [isLoadingPendingRides, setIsLoadingPendingRides] = useState(true);
  const [isLoadingTodaysRides, setIsLoadingTodaysRides] = useState(true);

  const [pendingRides, setPendingRides] = useState<any[]>([]);
  const [todaysRides, setTodaysRides] = useState<any[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load pending rides
        setIsLoadingPendingRides(true);
        const pendingRidesData = await dashboardApi.getPendingRides();
        setPendingRides(pendingRidesData);
        setIsLoadingPendingRides(false);

        // Load today's rides
        setIsLoadingTodaysRides(true);
        const todaysRidesData = await dashboardApi.getTodaysRides();
        setTodaysRides(todaysRidesData);
        setIsLoadingTodaysRides(false);
      } catch (error) {
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados do dashboard",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [toast]);

  const acceptDelivery = (id: string) => {
    setActiveDelivery(id);
    setConfirmingRideId(null);
  };

  const finishDelivery = () => {
    setActiveDelivery(null);
    setShowFinishConfirmation(false);
    toast({
      title: "Corrida finalizada",
      description: "A corrida foi finalizada com sucesso",
    });
  };

  const cancelDelivery = () => {
    setActiveDelivery(null);
    setShowCancelConfirmation(false);
    toast({
      title: "Corrida cancelada",
      description: "A corrida foi cancelada",
    });
  };

  const viewRideDetails = (ride: any) => {
    setSelectedRideDetails(ride);
    setShowRideDetails(true);
  };

  return (
    <div className="space-y-6">
      <CardInfoList />

      {/* Active Delivery */}
      {activeDelivery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border bg-white p-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Corrida em Andamento</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Iniciada às 14:30</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-100 text-amber-800">
                Em Andamento
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600"
                onClick={() => setShowCancelConfirmation(true)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setShowFinishConfirmation(true)}
              >
                Finalizar
              </Button>
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-3">
              <div className="font-medium">Detalhes da Entrega</div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Empresa:</div>
                <div>Restaurante Sabor Caseiro</div>
                <div className="text-gray-500">Endereço de Coleta:</div>
                <div>Av. Paulista, 1000</div>
                <div className="text-gray-500">Endereço de Entrega:</div>
                <div>Rua Augusta, 500</div>
                <div className="text-gray-500">Valor:</div>
                <div>R$ 25,00</div>
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="font-medium">Status da Entrega</div>
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Pedido Aceito</div>
                    <div className="text-gray-500">14:30</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Em Rota para Coleta</div>
                    <div className="text-gray-500">14:35</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Coletando Pedido</div>
                    <div className="text-gray-500">14:45</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Em Rota para Entrega</div>
                    <div className="text-gray-500">--:--</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Entrega Concluída</div>
                    <div className="text-gray-500">--:--</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pending Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Corridas Pendentes</CardTitle>
          <CardDescription>Corridas disponíveis para aceitação</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPendingRides ? (
            <div className="space-y-4">
              {[1, 2, 3].map((id) => (
                <div
                  key={id}
                  className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-9 w-32" />
                </div>
              ))}
            </div>
          ) : !activeDelivery ? (
            <div className="space-y-4">
              {pendingRides.map((ride) => {
                const rideId = ride.id;
                return (
                  <motion.div
                    key={ride.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="font-medium">{ride.company}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>Distância: {ride.distance} km</span>
                        <span>•</span>
                        <span>Valor: R$ {ride.value.toFixed(2)}</span>
                      </div>
                    </div>
                    <AlertDialog
                      open={confirmingRideId === rideId}
                      onOpenChange={(open) =>
                        !open && setConfirmingRideId(null)
                      }
                    >
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => setConfirmingRideId(rideId)}
                      >
                        Aceitar Corrida
                      </Button>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Aceitar Corrida</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja aceitar esta corrida da{" "}
                            {ride.company}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => acceptDelivery(rideId)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            Aceitar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium">
                Você já tem uma corrida em andamento
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Finalize a corrida atual para aceitar novas corridas
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Rides */}
      <Card>
        <CardHeader>
          <CardTitle>Corridas de Hoje</CardTitle>
          <CardDescription>Corridas realizadas hoje</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTodaysRides ? (
            <div className="space-y-4">
              <div className="mb-4">
                <Skeleton className="h-10 w-64" />
              </div>
              {[1, 2, 3, 4].map((id) => (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : todaysRides.length > 0 ? (
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="completed">Concluídas</TabsTrigger>
                <TabsTrigger value="canceled">Canceladas</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {todaysRides.map((delivery) => (
                  <div
                    key={delivery.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <div className="font-medium">{delivery.company}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{delivery.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {delivery.status === "completed" ? (
                        <Badge className="bg-green-100 text-green-800">
                          Concluída
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          Cancelada
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => viewRideDetails(delivery)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                {todaysRides
                  .filter((delivery) => delivery.status === "completed")
                  .map((delivery) => (
                    <div
                      key={delivery.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <div className="font-medium">{delivery.company}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{delivery.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-800">
                          Concluída
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewRideDetails(delivery)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </TabsContent>
              <TabsContent value="canceled" className="space-y-4">
                {todaysRides
                  .filter((delivery) => delivery.status === "canceled")
                  .map((delivery) => (
                    <div
                      key={delivery.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <div className="font-medium">{delivery.company}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{delivery.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-red-100 text-red-800">
                          Cancelada
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewRideDetails(delivery)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-gray-100 p-3 text-gray-500">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Nenhuma corrida hoje</h3>
              <p className="mt-2 text-sm text-gray-500">
                As corridas realizadas hoje aparecerão aqui
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ride Details Drawer */}
      <Sheet open={showRideDetails} onOpenChange={setShowRideDetails}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Detalhes da Corrida</SheetTitle>
            <SheetDescription>
              {selectedRideDetails?.company} - {selectedRideDetails?.time}
            </SheetDescription>
          </SheetHeader>
          {selectedRideDetails && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <div className="mt-1">
                  {selectedRideDetails.status === "completed" ? (
                    <Badge className="bg-green-100 text-green-800">
                      Concluída
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">Cancelada</Badge>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Cliente</h3>
                  <p className="mt-1">{selectedRideDetails.details.customer}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Endereço de Coleta
                  </h3>
                  <p className="mt-1">
                    {selectedRideDetails.details.pickupAddress}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Endereço de Entrega
                  </h3>
                  <p className="mt-1">
                    {selectedRideDetails.details.deliveryAddress}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Itens</h3>
                  <p className="mt-1">{selectedRideDetails.details.items}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Valor</h3>
                    <p className="mt-1">
                      R$ {selectedRideDetails.details.value.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Distância
                    </h3>
                    <p className="mt-1">
                      {selectedRideDetails.details.distance} km
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Duração
                    </h3>
                    <p className="mt-1">
                      {selectedRideDetails.details.duration}
                    </p>
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

      {/* Finish Delivery Confirmation */}
      <AlertDialog
        open={showFinishConfirmation}
        onOpenChange={setShowFinishConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar Corrida</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja finalizar esta corrida? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={finishDelivery}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Delivery Confirmation */}
      <AlertDialog
        open={showCancelConfirmation}
        onOpenChange={setShowCancelConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Corrida</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta corrida? Esta ação não pode
              ser desfeita e pode afetar sua taxa de conclusão.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={cancelDelivery}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancelar Corrida
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
