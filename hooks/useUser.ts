// hooks/useUser.ts
import useSWR from "swr";
import { getUserData } from "@/lib/api/getUserData";

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR("/api/user", getUserData);

  return {
    user: data,
    isLoading,
    isError: !!error,
    mutateUser: mutate,
  };
}
