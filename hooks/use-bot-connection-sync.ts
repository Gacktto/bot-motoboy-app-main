import { useEffect } from "react";
import { useBotConnection } from "@/store/useBotConnection"; // caminho do seu Zustand
import { apiFetch } from "@/services/api/apiFetch";

export type BotConnectionStatus = {
  isConnected: boolean;
  isRunning: boolean;
  lastUpdate: Date;
};

/**
 * A React hook that synchronizes the bot connection status with the application's state.
 * Fetches and updates the bot connection status on component mount.
 *
 * @returns {void}
 */
export function useBotConnectionSync() {
  const updateStatus = useBotConnection((state) => state.updateStatus);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await apiFetch<BotConnectionStatus>(
          "/bot-conection/status",
          {
            next: { revalidate: 60, tags: ["bot-status"] },
          }
        );

        updateStatus({
          isConnected: response.isConnected,
          isRunning: response.isRunning,
          lastUpdate: response.lastUpdate,
        });
      } catch (error) {
        console.error("Erro ao buscar status do bot:", error);
      }
    }

    fetchStatus();
  }, []);
}
