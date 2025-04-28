import Cookies from 'js-cookie'; // Para ler os cookies no frontend

export async function getUserData() {
    const userId = Cookies.get('user_id'); // Pega o user_id armazenado nos cookies
    const authToken = Cookies.get('auth_token'); // Pega o auth_token armazenado nos cookies
  
    if (!userId || !authToken) {
        throw new Error('Usuário não autenticado');
    }

    const res = await fetch('/api/user?userId=' + userId, {
        headers: {
            'Authorization': `Bearer ${authToken}`, // Autorização usando o auth_token
        },
    });
  
    if (!res.ok) {
        throw new Error('Erro ao buscar dados do usuário');
    }
  
    return res.json();
}
