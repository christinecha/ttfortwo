export type Club = {
  name: string;
  country: string;
  region?: string;
  metro: string;
  distinction: string;
  type: string[];
  tags: string[];
  id: string;
  address: string;
  url: string;
  lat: string;
  lng: string;
  closed?: boolean;
};
