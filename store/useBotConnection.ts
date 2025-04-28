import { create } from "zustand";

type Props = {
  status: {
    isConnected: boolean;
    isRunning: boolean;
    lastUpdate: Date | null;
  };

  updateStatus: (status: Props["status"]) => void;
};

export const useBotConnection = create<Props>((set, get) => ({
  status: {
    isConnected: false,
    isRunning: false,
    lastUpdate: null,
  },
  updateStatus: (status) => {
    set({ status });
  },
}));
