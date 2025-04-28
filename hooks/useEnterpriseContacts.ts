import useSWR from "swr";
import { getEnterpriseContacts } from "@/lib/api/getEnterpriseContacts";

export function useEnterpriseContacts() {
  const { data, error, isLoading, mutate } = useSWR("/api/account/enterprise-contacts", getEnterpriseContacts);

  return {
    contact: data,
    isLoading,
    isError: !!error,
    mutateUser: mutate,
  };
}
