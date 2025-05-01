export async function getCsrfToken() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/csrf-token`, {
      credentials: 'include',
    });
    const data = await res.json();
    return data.csrfToken;
}  