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

export type BusVehicle = {
  lineCode: string;
  lineName: string;
  routeCode: string;
  routeName: string;
  latitude: number;
  longitude: number;
  departureMins: number;
  departureSeconds: number;
  vehicleCode: string;
  lineColor: string;
  lineTextColor: string;
  borderColor: string;
};
