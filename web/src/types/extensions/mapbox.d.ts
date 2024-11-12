import { GeocodeRequest } from "@mapbox/mapbox-sdk/services/geocoding";

declare module "@mapbox/mapbox-sdk/services/geocoding" {
  interface GeocodeRequest {
    session_token?: string;
  }
}
