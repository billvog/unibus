export type BusStop = {
  id: number;
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  lineCodes: string[];
  routeCodes: string[];
  distance: number;
};

export type BusRoute = {
  id: number;
  code: string;
  name: string;
  direction: number;
};

export type BusLine = {
  id: number;
  code: string;
  name: string;
  color: string;
  textColor: string;
  borderColor: string;
  routes: string[];
};
