import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import type { Listing, SavedSearch } from './types';

const dbFile = path.resolve(fileURLToPath(new URL('../../storage/db.json', import.meta.url)));

type Db = {
  listings: Listing[];
  savedSearches: SavedSearch[];
};

async function readDb(): Promise<Db> {
  try {
    const raw = await fs.readFile(dbFile, 'utf-8');
    return JSON.parse(raw) as Db;
  } catch (error) {
    await fs.mkdir(path.dirname(dbFile), { recursive: true });
    await fs.writeFile(dbFile, JSON.stringify({ listings: [], savedSearches: [] }, null, 2));
    return { listings: [], savedSearches: [] };
  }
}

async function writeDb(db: Db) {
  await fs.writeFile(dbFile, JSON.stringify(db, null, 2), 'utf-8');
}

export async function getListings() {
  const db = await readDb();
  return db.listings;
}

export async function saveListing(listing: Listing) {
  const db = await readDb();
  db.listings.unshift(listing);
  await writeDb(db);
  return listing;
}

export async function getSavedSearches() {
  const db = await readDb();
  return db.savedSearches;
}

export async function saveSavedSearch(search: SavedSearch) {
  const db = await readDb();
  db.savedSearches.unshift(search);
  await writeDb(db);
  return search;
}

export async function deleteSavedSearch(searchId: string) {
  const db = await readDb();
  db.savedSearches = db.savedSearches.filter((item) => item.id !== searchId);
  await writeDb(db);
}
