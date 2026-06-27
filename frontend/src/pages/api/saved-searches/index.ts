import { randomUUID } from 'crypto';
import { getSavedSearches, saveSavedSearch } from '../../../lib/storage';
import type { SavedSearch } from '../../../lib/types';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET() {
  const searches = await getSavedSearches();
  return json(searches);
}

export async function POST({ request }: { request: Request }) {
  const body = await request.json();
  if (!body.name || !body.zip) {
    return json({ error: 'Must provide name and zip' }, 400);
  }

  const search: SavedSearch = {
    id: randomUUID(),
    name: String(body.name),
    zip: String(body.zip),
    radius: Number(body.radius ?? 50),
    createdAt: new Date().toISOString(),
  };

  const saved = await saveSavedSearch(search);
  return json(saved, 201);
}
