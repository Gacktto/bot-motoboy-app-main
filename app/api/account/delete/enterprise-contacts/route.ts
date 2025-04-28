import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  const { contactId } = await req.json();  // Para pegar o corpo da requisição
  const authToken = req.headers.get('authorization')?.split(' ')[1];
  const userId = req.headers.get('x-user-id');

  if (!authToken || !userId) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enterprise-contacts/${contactId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'x-user-id': userId,
        'user-id': userId,
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
  }
}
