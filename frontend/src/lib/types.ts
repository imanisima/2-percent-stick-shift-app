export type Media = {
  id: string;
  url: string;
  thumbnailUrl: string;
  type: 'image' | 'video';
};

export type Listing = {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  engine: string;
  gears: number;
  drivetrain: string;
  fuel: string;
  condition: string;
  description: string;
  zip: string;
  lat: number;
  lon: number;
  createdAt: string;
  media: Media[];
  distanceMiles?: number;
};

export type SavedSearch = {
  id: string;
  name: string;
  zip: string;
  radius: number;
  createdAt: string;
};
