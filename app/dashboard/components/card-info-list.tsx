"use client";

import { useState } from "react";

import { CardInfo } from "./card-info";
import { Bot, CheckCircle, MessageSquare, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useBotConnection } from "@/store/useBotConnection";

export function CardInfoList() {
  const [messagesCountToday] = useState(0);

  const botConnection = useBotConnection();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <CardInfo
        title="Status da Conexão"
        icon={Bot}
        content={
          <>
            <div className="text-2xl font-bold flex items-center">
              <span
                data-connected={botConnection.status.isConnected}
                className="mr-2 flex h-3 w-3 rounded-full data-[connected=true]:bg-green-500 bg-red-500"
              ></span>
              {botConnection.status.isConnected ? "Conectado" : "Desconectado"}
            </div>
            <p className="text-xs text-gray-500">
              Última atualização:{" "}
              {botConnection.status.lastUpdate
                ? new Date(botConnection.status.lastUpdate).toLocaleString(
                    "pt-BR",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }
                  )
                : "Nunca"}
            </p>
          </>
        }
      />

      <CardInfo
        title="Recebimento de Mensagens"
        icon={MessageSquare}
        content={
          <>
            <div className="text-2xl font-bold flex items-center">
              <span
                data-is-running={botConnection.status.isRunning}
                className="mr-2 flex h-3 w-3 rounded-full data-[is-running=true]:bg-green-500 bg-red-500"
              ></span>
              {botConnection.status.isRunning ? "Ativo" : "Inativo"}
            </div>
            {botConnection.status.isRunning ? (
              <p className="text-xs text-gray-500">
                {messagesCountToday === 0
                  ? "Nenhuma mensagem recebida hoje"
                  : `${messagesCountToday} mensagem recebida hoje`}
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                Para receber mensagens ative o bot
              </p>
            )}
          </>
        }
      />

      <CardInfo
        title="Corridas Hoje"
        icon={TrendingUp}
        content={
          <>
            <div className="text-2xl font-bold">{2}</div>
            <p className="text-xs text-gray-500">{2} comparado a ontem</p>
          </>
        }
      />

      <CardInfo
        title="Taxa de Conclusão"
        icon={CheckCircle}
        content={
          <>
            <div className="text-2xl font-bold">{90}%</div>
            <div className="mt-2">
              <Progress value={90} className="h-2" />
            </div>
          </>
        }
      />
    </div>
  );
}
