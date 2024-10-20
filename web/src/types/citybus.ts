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

export type BusLinePoint = {
  id: number;
  sequence: number;
  longitude: string;
  latitude: string;
};

export type BusVehicle = {
  lineCode: string;
  lineName: string;
  routeCode: string;
  routeName: string;
  latitude: string;
  longitude: string;
  departureMins: number;
  departureSeconds: number;
  vehicleCode: string;
  lineColor: string;
  lineTextColor: string;
  borderColor: string;
};

export type BusStopTrip = {
  id: number;
  day: number;
  lineCode: string;
  lineColor: string;
  lineName: string;
  lineTextColor: string;
  routeCode: string;
  routeName: string;
  time: string;
  timeHour: number;
  timeMinute: number;
};
