import { fetch } from "expo/fetch";
import { WEATHER_API_KEY } from "./constants";
import axios from "axios";

export const fetchWeatherAPI = (
  url: string,
  params?: { [key: string]: string }
) =>
  new Promise<any>((resolve, reject) => {
    const encodedParams = Object.keys(params ?? {}).reduce(
      (accumulator, key) => {
        if (params === undefined) return accumulator;
        const newParam = key + "=" + params[key];

        return accumulator + "&" + newParam;
      },
      `?key=${WEATHER_API_KEY}`
    );

    axios
      .get(url + encodedParams)
      .then((response) => resolve(response.data))
      .catch((error) => {
        reject(error);
      });
  });
