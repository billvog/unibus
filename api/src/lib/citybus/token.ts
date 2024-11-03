import axios from "axios";

import { GetCitybusWebsiteURL } from "@api/lib/constants";

let citybusToken = "";

export const getCitybusToken = () => citybusToken;

export const setCitybusToken = (token: string) => {
  citybusToken = token;
};

export const generateCitybusToken = async () => {
  console.log("Generating new Citybus token...");

  const url = `${GetCitybusWebsiteURL("lamia")}/stops`;

  try {
    const response = await axios.get(url);

    const extractedData = /const token = '([^']+)';/.exec(
      response.data as string
    );

    const token = extractedData?.[1];
    if (!token) {
      console.error("Failed to extract token from Citybus website");
      return;
    }

    console.log("Extracted token:", token);
    setCitybusToken(token);
  } catch (error) {
    console.error("Failed to generate Citybus token", error);
  }
};
