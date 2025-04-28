import Cookies from 'js-cookie'; // Para ler os cookies no frontend

export async function getEnterpriseContacts() {
    const userId = Cookies.get('user_id');
    const authToken = Cookies.get('auth_token');
  
    if (!userId || !authToken) {
        throw new Error('Usuário não autenticado');
    }

    const res = await fetch('/api/account/enterprise-contacts?' + authToken, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'x-user-id': userId, // Passando o userId no header correto
        },
        credentials: 'include', // Necessário para enviar cookies
    });    
  
    if (!res.ok) {
        throw new Error('Erro ao buscar dados do usuário');
    }
  
    return res.json();
}
