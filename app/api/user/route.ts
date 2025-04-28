import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId'); // Lê o userId da query string

    if (!userId) {
        return NextResponse.json({ error: 'ID do usuário não encontrado na query string' }, { status: 400 });
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`);

    if (!res.ok) {
        return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: res.status });
    }

    const user = await res.json();
    return NextResponse.json(user);
}
