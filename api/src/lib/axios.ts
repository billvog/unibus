import axios, { AxiosError } from "axios";
import rateLimit from "axios-rate-limit";

import { generateCitybusToken, getCitybusToken } from "@api/lib/citybus/token";
import { GetCitybusAPIURL } from "@api/lib/constants";

const citybusClient = rateLimit(
  axios.create({
    baseURL: GetCitybusAPIURL(114),
  }),
  // Rate limit to 3 requests per second.
  // This is to prevent abuse of Citybus API.
  {
    maxRequests: 3,
    perMilliseconds: 1000,
  }
);

citybusClient.interceptors.request.use((config) => {
  // Put citybus token on header, if any, for Citybus API requests.
  const citybusToken = getCitybusToken();
  if (citybusToken.length > 0) {
    config.headers.Authorization = `Bearer ${getCitybusToken()}`;
  }

  return config;
});

citybusClient.interceptors.response.use(undefined, (error) => {
  const axiosError = error as AxiosError;

  // Regenerate Citybus token if 401 Unauthorized.
  if (axiosError.status === 401) {
    console.log("Received 401 from Citybus API. Regenerating token:");
    void generateCitybusToken();
  }
});

export { citybusClient };
