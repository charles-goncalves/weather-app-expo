import { useState, useEffect, SetStateAction } from "react";
import { fetchWeatherAPI } from "../services/fetch";

const useWeatherAPI = <T>(url: string, params?: { [key: string]: string }) => {
  const [weatherData, setWeatherData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submit, setSubmit] = useState<boolean>(false);

  useEffect(() => {
    if (submit && !loading) {
      setLoading(true);
      setError(null);
      fetchWeatherAPI(url, params)
        .then((data: T) => setWeatherData(data))
        .catch((error: { message: SetStateAction<string | null> }) => {
          setError(
            error instanceof Error ? error.message : "An unknown error occurred"
          );
        })
        .finally(() => {
          setLoading(false);
          setSubmit(false);
        });
    }
  }, [url, params, submit]);

  return { weatherData, loading, error, submit: () => setSubmit(true) };
};

export default useWeatherAPI;
