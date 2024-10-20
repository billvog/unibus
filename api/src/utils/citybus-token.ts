import { CITYBUS_WEBSITE_URL } from "@api/utils/constants";
import axios from "axios";

let citybusToken = "";

export const getCitybusToken = () => citybusToken;

export const setCitybusToken = (token: string) => {
  citybusToken = token;
};

export const generateCitybusToken = async () => {
  console.log("Generating new Citybus token...");

  const url = `${CITYBUS_WEBSITE_URL("lamia")}/stops`;
  axios
    .get(url)
    .then((response) => {
      const extractedData = (response.data as string).match(
        /const token = '([^']+)';/
      );

      const token = extractedData?.[1];
      if (!token) {
        console.error("Failed to extract token from Citybus website");
        return;
      }

      console.log("Extracted token:", token);
      setCitybusToken(token);
    })
    .catch((error) => {
      console.error("Failed to fetch Citybus website", error);
    });
};
