import { deleteSavedSearch } from '../../../lib/storage';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function del({ params }: { params: { id: string } }) {
  await deleteSavedSearch(params.id);
  return json({ success: true });
}
