import { useMutation } from '@tanstack/react-query';
import { deleteEnterpriseContacts } from '@/lib/api/deleteEnterpriseContacts';

export function useDeleteEnterpriseContacts() {
    const mutation = useMutation({
        mutationFn: async ({ contactId }: { contactId: string }) => {
            return await deleteEnterpriseContacts(contactId);
        },
    });

    return mutation;
}
