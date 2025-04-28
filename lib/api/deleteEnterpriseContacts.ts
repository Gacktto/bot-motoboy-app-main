import Cookies from 'js-cookie'; // Para ler os cookies no frontend

export async function deleteEnterpriseContacts(contactId: string) {
    const userId = Cookies.get('user_id');
    const authToken = Cookies.get('auth_token');
  
    if (!userId || !authToken) {
        throw new Error('Usuário não autenticado');
    }

    const res = await fetch('/api/account/delete/enterprise-contacts', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'x-user-id': userId, // Passando o userId no header correto
            'user-id': userId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contactId: contactId
        }),
        credentials: 'include', // Necessário para enviar cookies
    });    
  
    if (!res.ok) {
        throw new Error('Erro ao buscar dados do usuário');
    }
  
    return res.json();
}
