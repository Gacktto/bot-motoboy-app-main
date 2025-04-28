"use client";

import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Connector } from "./components/connector";
import { ConnectionInformation } from "./connection-information";

export default function ConexaoPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("disconnected");
  const [acceptingRides, setAcceptingRides] = useState(false);

  useEffect(() => {
    setIsConnected(connectionStatus === "connected");
  }, [connectionStatus]);

  useEffect(() => {
    if (!isConnected && acceptingRides) {
      setAcceptingRides(false);
    }
  }, [isConnected, acceptingRides]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Conexão com WhatsApp</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status da Conexão</CardTitle>
          <CardDescription>
            Gerencie a conexão do seu bot com o WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Aceitar Corridas</h3>
                <p className="text-sm text-gray-500">
                  {isConnected
                    ? "Ative para começar a receber corridas"
                    : "Conecte o bot para habilitar o recebimento de corridas"}
                </p>
              </div>
              <Switch
                checked={acceptingRides}
                onCheckedChange={setAcceptingRides}
                disabled={!isConnected}
              />
            </div>
          </div>

          <Connector />
          <ConnectionInformation />
        </CardContent>
      </Card>
    </div>
  );
}
