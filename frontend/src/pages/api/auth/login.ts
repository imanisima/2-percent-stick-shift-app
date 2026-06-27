function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function post({ request }: { request: Request }) {
  const body = await request.json();
  const email = String(body.email ?? 'user@stickshift.local');
  return json({
    token: 'mock-jwt-token',
    user: {
      id: 'user-1',
      email,
      name: 'StickShift Rider',
    },
  });
}
