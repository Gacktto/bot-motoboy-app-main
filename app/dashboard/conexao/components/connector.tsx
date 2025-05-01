"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BotConnectionStatus } from "@/hooks/use-bot-connection-sync";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import { apiFetch } from "@/services/api/apiFetch";
import { useBotConnection } from "@/store/useBotConnection";
import { motion } from "framer-motion";
import { CircleAlert, QrCode, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import { revalidateTag } from "next/cache";

type BotQrCodeGenerate = {
  qrCode: string;
};

export function Connector() {
  const [isLoading, setIsLoading] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrCodeImageSrc, setQrCodeImageSrc] = useState(
    "/placeholder.svg?height=200&width=200"
  );
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting" | "desconnecting"
  >("disconnected");
  const botConnection = useBotConnection((state) => state.status);
  const updateStatus = useBotConnection((state) => state.updateStatus);

  const { toast } = useToast();

  const generateQrCode = async () => {
    setIsLoading(true);
    setConnectionStatus("connecting");
    setShowQrCode(true);

    try {
      const { qrCode } = await apiFetch<BotQrCodeGenerate>(
        "/bot-conection/qrcode",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setQrCodeImageSrc(qrCode);
    } catch (error) {
      toast({
        title: "Erro ao gerar QR Code",
        description:
          "Não foi possível gerar o QR Code. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }

    // Simulate QR code generation
    setTimeout(() => {
      setConnectionStatus("connected");
      setShowQrCode(true);
    }, 2000);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center rounded-lg border p-6 text-center">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: botConnection.isConnected ? 1 : 0.7,
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className={`flex h-24 w-24 items-center justify-center rounded-full ${
            botConnection.isConnected
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {botConnection.isConnected ? (
            <Wifi className="h-12 w-12" />
          ) : (
            <WifiOff className="h-12 w-12" />
          )}
        </motion.div>

        <h3 className="mt-4 text-xl font-semibold">
          {botConnection.isConnected ? "Conectado" : "Desconectado"}
        </h3>

        <p className="mt-2 text-gray-500">
          {botConnection.isConnected
            ? "Seu bot está conectado e pronto para receber mensagens."
            : "Seu bot está desconectado. Conecte para começar a receber mensagens."}
        </p>

        <div className="mt-6">
          {!botConnection.isConnected && (
            <Button
              onClick={generateQrCode}
              disabled={isLoading || connectionStatus === "connecting"}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {connectionStatus === "connecting" ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Gerando Qr Code...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Gerar QR Code
                </span>
              )}
            </Button>
          )}
          {showQrCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex flex-col items-center space-y-4 mt-4">
                <div className="relative flex items-center justify-center rounded-lg border p-4">
                  {connectionStatus === "connecting" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                      <svg
                        className="h-8 w-8 animate-spin text-emerald-600"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  )}
                  <img
                    src={qrCodeImageSrc}
                    alt="QR Code"
                    className="h-48 w-48"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateQrCode}
                  disabled={isLoading || connectionStatus === "connecting"}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Atualizar QR Code
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        <div>
          {botConnection.isConnected && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="flex items-center gap-2 text-yellow-700">
                <CircleAlert className="h-4 w-4 text-yellow-600" />
                <strong>Para desconectar o bot basta:</strong> Abra o WhatsApp{" "}
                {">"} Mais opções {">"} Dispositivos conectados {">"} Selecione
                o dispositivo, clique em Desconectar
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </>
  );
}
