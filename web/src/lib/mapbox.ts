"use client";

import "es6-promise/auto";

import MapboxClient from "@mapbox/mapbox-sdk";
import MapboxGeocodingClient from "@mapbox/mapbox-sdk/services/geocoding";
import MapboxDirectionsClient from "@mapbox/mapbox-sdk/services/directions";

import { env } from "@web/env";

export const mbxClient = MapboxClient({
  accessToken: env.NEXT_PUBLIC_MAPBOX_TOKEN,
});

export const mbxGeocodingClient = MapboxGeocodingClient(mbxClient);
export const mbxDirectionsClient = MapboxDirectionsClient(mbxClient);
