import { useMutation } from '@tanstack/react-query';
import { postEnterpriseContacts } from '@/lib/api/postEnterpriseContacts';

export function usePostEnterpriseContact() {
    const mutation = useMutation({
        mutationFn: async ({ name, phone }: { name: string; phone: string }) => {
        return await postEnterpriseContacts(name, phone);
        },
    });

    return mutation;
}