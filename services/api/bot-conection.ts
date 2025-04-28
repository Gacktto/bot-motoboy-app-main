import { apiClient } from "./apiClient";

type BotConnectionStatus = {
  isConnected: boolean;
  isRunning: boolean;
  lastUpdate: Date;
};

type BotQrCodeGenerate = {
  qrCode: string;
};

export const botConnectionService = {
  botConectionStatus: async () => {
    const { data } = await apiClient.get<BotConnectionStatus>(
      "/bot-conection/status"
    );
    return data;
  },
  botQrCodeGenerate: async () => {
    const { data } = await apiClient.get<BotQrCodeGenerate>(
      "/bot-conection/qrcode",
      {}
    );
    return data;
  },
};
