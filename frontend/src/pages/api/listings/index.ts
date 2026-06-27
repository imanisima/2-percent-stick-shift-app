import { randomUUID } from 'crypto';
import { saveListing, getListings } from '../../../lib/storage';
import { getZipLatLon, distanceMiles } from '../../../lib/geo';
import type { Listing } from '../../../lib/types';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const zip = url.searchParams.get('zip')?.trim();
  const radius = Number(url.searchParams.get('radius') ?? '50');
  let listings = await getListings();

  if (zip) {
    const zipPoint = getZipLatLon(zip);
    if (!zipPoint) {
      return json({ error: 'Invalid ZIP code' }, 400);
    }

    listings = listings
      .map((listing) => ({
        ...listing,
        distanceMiles: distanceMiles(zipPoint.lat, zipPoint.lon, listing.lat, listing.lon),
      }))
      .filter((listing) => listing.distanceMiles !== undefined && listing.distanceMiles <= radius)
      .sort((a, b) => (a.distanceMiles ?? 0) - (b.distanceMiles ?? 0));
  }

  return json(listings);
}

export async function POST({ request }: { request: Request }) {
  const body = await request.json();
  const required = ['title', 'make', 'model', 'year', 'price', 'mileage', 'zip'];
  for (const key of required) {
    if (!body[key]) {
      return json({ error: `Missing field: ${key}` }, 400);
    }
  }

  const zipPoint = getZipLatLon(body.zip);
  if (!zipPoint) {
    return json({ error: 'Invalid ZIP code' }, 400);
  }

  const listing: Listing = {
    id: randomUUID(),
    title: String(body.title),
    make: String(body.make),
    model: String(body.model),
    year: Number(body.year),
    price: Number(body.price),
    mileage: Number(body.mileage),
    color: String(body.color ?? ''),
    engine: String(body.engine ?? ''),
    gears: Number(body.gears ?? 5),
    drivetrain: String(body.drivetrain ?? ''),
    fuel: String(body.fuel ?? ''),
    condition: String(body.condition ?? ''),
    description: String(body.description ?? ''),
    zip: String(body.zip),
    lat: zipPoint.lat,
    lon: zipPoint.lon,
    createdAt: new Date().toISOString(),
    media: Array.isArray(body.media)
      ? body.media.map((item: any, index: number) => ({
          id: item.id || `${index}-${Date.now()}`,
          url: String(item.url),
          thumbnailUrl: String(item.thumbnailUrl ?? item.url),
          type: item.type === 'video' ? 'video' : 'image',
        }))
      : [],
  };

  const saved = await saveListing(listing);
  return json(saved, 201);
}
