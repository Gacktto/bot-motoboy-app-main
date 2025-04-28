"use client";

import { useBotConnection } from "@/store/useBotConnection";

export function ConnectionInformation() {
  const botConnection = useBotConnection();
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-medium">Informações da Conexão</h3>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-500">Status:</div>
        <div className="flex items-center">
          {botConnection.status.isConnected ? (
            <>
              <span className="mr-2 flex h-2 w-2 rounded-full bg-green-500"></span>
              Online
            </>
          ) : (
            <>
              <span className="mr-2 flex h-2 w-2 rounded-full bg-red-500"></span>
              Offline
            </>
          )}
        </div>

        <div className="text-gray-500">Última conexão:</div>
        <div>
          {botConnection.status.lastUpdate
            ? new Date(botConnection.status.lastUpdate).toLocaleString("pt-BR")
            : "Nunca"}
        </div>

        <div className="text-gray-500">Mensagens recebidas hoje:</div>
        <div>{botConnection.status.isConnected ? "24" : "0"}</div>
      </div>
    </div>
  );
}
