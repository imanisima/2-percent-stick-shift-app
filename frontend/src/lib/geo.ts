import { lookup } from 'zipcodes';

export function distanceMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 3959 * c;
}

export function getZipLatLon(zip: string) {
  const normalizedZip = zip.trim().slice(0, 5);
  const info = lookup(normalizedZip);
  if (!info || typeof info.latitude !== 'number' || typeof info.longitude !== 'number') {
    return null;
  }
  return { lat: info.latitude, lon: info.longitude };
}
