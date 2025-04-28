import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const authToken = cookieStore.get('auth_token')?.value;

  if (!authToken) {
    return NextResponse.json({ error: 'Token de autenticação não encontrado.' }, { status: 401 });
  }

  const userId = request.headers.get('x-user-id'); // Lê o userId no header "x-user-id"

  if (!userId) {
    return NextResponse.json({ error: 'ID do usuário não encontrado no header' }, { status: 400 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bot-conection/qrcode`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'x-user-id': userId, // Passa o userId também no header, como no frontend
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: res.status });
  }

  const user = await res.json();
  return NextResponse.json(user);
}
