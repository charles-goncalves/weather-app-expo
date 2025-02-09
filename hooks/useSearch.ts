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
    selectedLocation ? { q: selectedLocation } : undefined
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
    handleSearch,
    handleSuggestionPress,
    handleUnitChange: (unit: TemperatureUnit) => setUnit(unit),
  };
};

export default useSearch;
