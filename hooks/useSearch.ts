import { useState } from "react";
import useWeatherAPI from "./useWeatherAPI";
import {
  WEATHER_API_CURRENT_URL,
  WEATHER_API_SEARCH_URL,
} from "@/services/constants";
import { TemperatureUnit } from "@/components/ui/TemperatureUnitSelector";

interface IForecastAPIResponse {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
  };
  forecast: {
    forecastday: {
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
      };
      hour: {
        temp_f: number;
        time: string;
        time_epoch: number;
        condition: {
          text: string;
          icon: string;
        };
        temp_c: number;
      }[];
    }[];
  };
}

interface ISearchAPIResponseItem {
  id: number;
  name: string;
}

const useSearch = () => {
  const [query, setQuery] = useState<string>("");
  const [unit, setUnit] = useState<TemperatureUnit>("C");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [suspendedListEnabled, setSuspendedListEnabled] =
    useState<boolean>(true);

  const {
    weatherData: suggestions,
    loading: suggestionsLoading,
    error: suggestionsError,
    submit: suggestionSubmit,
  } = useWeatherAPI<ISearchAPIResponseItem[]>(
    WEATHER_API_SEARCH_URL,
    query ? { q: query } : undefined
  );

  const {
    weatherData: currentWeather,
    loading: currentLoading,
    error: currentError,
    submit: currentSubmit,
  } = useWeatherAPI<IForecastAPIResponse>(
    WEATHER_API_CURRENT_URL,
    selectedLocation ? { q: selectedLocation, days: "2" } : undefined
  );

  const handleSearch = (text: string) => {
    setQuery(text);
    setSuspendedListEnabled(true);
    if (text.length > 2) {
      suggestionSubmit();
    }
  };

  const handleSuggestionPress = (location: string) => {
    setQuery(location);
    setSelectedLocation(location);
    setSuspendedListEnabled(false);
    currentSubmit();
  };

  const handleForecastList = (currentHour: number) => {
    if (!currentWeather) return [];

    const currentDayHours = currentWeather.forecast.forecastday[0].hour.filter(
      (item) => {
        const forecastDate = new Date(item.time);
        const forecastHour = forecastDate.getHours();

        if (forecastHour <= currentHour || forecastHour > currentHour + 5)
          return undefined;

        return item;
      }
    );

    const amountNextDay = 5 - currentDayHours.length;
    const nextDayHours = amountNextDay
      ? currentWeather.forecast.forecastday[1].hour.filter((item) => {
          const forecastDate = new Date(item.time);
          const forecastHour = forecastDate.getHours();

          if (forecastHour >= amountNextDay) return undefined;

          return item;
        })
      : [];

    return currentDayHours.concat(nextDayHours);
  };

  return {
    query,
    unit,
    suggestions,
    suggestionsLoading,
    suggestionsError,
    currentWeather,
    currentLoading,
    currentError,
    suspendedListEnabled,
    handleForecastList,
    handleSearch,
    handleSuggestionPress,
    handleUnitChange: (unit: TemperatureUnit) => setUnit(unit),
  };
};

export default useSearch;
