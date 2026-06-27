import type { Listing, SavedSearch } from './types';

const getOrigin = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return process.env.BASE_URL || 'http://localhost:3000';
};

function buildUrl(path: string, params?: Record<string, string>) {
  const url = new URL(path, `${getOrigin()}/`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

export async function fetchListings(zip?: string, radius?: number) {
  const params: Record<string, string> = {};
  if (zip) params.zip = zip;
  if (radius !== undefined) params.radius = String(radius);

  const response = await fetch(buildUrl(`${BASE}/listings`, params));
  if (!response.ok) {
    throw new Error(`Unable to fetch listings: ${response.status}`);
  }

  return (await response.json()) as Listing[];
}

export async function createListing(listing: Omit<Listing, 'id' | 'createdAt'>) {
  const response = await fetch(buildUrl('/api/listings'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listing),
  });

  if (!response.ok) {
    throw new Error(`Unable to create listing: ${response.status}`);
  }

  return (await response.json()) as Listing;
}

export async function fetchSavedSearches() {
  const response = await fetch(buildUrl('/api/saved-searches'));
  if (!response.ok) {
    throw new Error(`Unable to fetch saved searches: ${response.status}`);
  }
  return (await response.json()) as SavedSearch[];
}

export async function createSavedSearch(search: Omit<SavedSearch, 'id' | 'createdAt'>) {
  const response = await fetch(buildUrl('/api/saved-searches'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(search),
  });

  if (!response.ok) {
    throw new Error(`Unable to save search: ${response.status}`);
  }
  return (await response.json()) as SavedSearch;
}

export async function deleteSavedSearch(searchId: string) {
  const response = await fetch(buildUrl(`/api/saved-searches/${searchId}`), {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Unable to delete saved search: ${response.status}`);
  }
}
