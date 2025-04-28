import useSWR from "swr";
import { getQrCode } from "@/lib/api/getQrCode";

export function useGetQrCode() {
  const { data, error, isLoading, mutate } = useSWR("/api/account/qrcode", getQrCode);

  return {
    QRCODE: data,
    isLoading,
    isError: !!error,
  };
}
