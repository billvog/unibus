import axios, { AxiosError } from "axios";

import {
  generateCitybusToken,
  getCitybusToken,
} from "@api/utils/citybus-token";
import { CITYBUS_API_URL } from "@api/utils/constants";

const citybusClient = axios.create({
  baseURL: CITYBUS_API_URL(114),
});

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
