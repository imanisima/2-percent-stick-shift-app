const STORAGE_KEY = 'stickshift.savedListings';

export function getSavedListingIds(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === 'string') : [];
  } catch {
    return [];
  }
}

export function isSavedListing(listingId: string): boolean {
  return getSavedListingIds().includes(listingId);
}

export function ensureDefaultSavedListings(): string[] {
  if (typeof window === 'undefined') {
    return getSavedListingIds();
  }

  const current = getSavedListingIds();
  if (current.length) {
    return current;
  }

  const defaults = ['sample-1'];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  return defaults;
}

export function toggleSavedListing(listingId: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const current = getSavedListingIds();
  const next = current.includes(listingId)
    ? current.filter((id) => id !== listingId)
    : [...current, listingId];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next.includes(listingId);
}
