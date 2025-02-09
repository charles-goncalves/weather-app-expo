import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import WeatherScreen from "../index";
import useSearch from "../../hooks/useSearch";

jest.mock("../../hooks/useSearch");

describe("WeatherScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    (useSearch as jest.Mock).mockReturnValue({
      query: "",
      unit: "C",
      suggestions: [],
      suggestionsLoading: false,
      suggestionsError: null,
      currentWeather: null,
      currentLoading: false,
      currentError: null,
      suspendedListEnabled: true,
      handleForecastList: jest.fn(),
      handleSearch: jest.fn(),
      handleSuggestionPress: jest.fn(),
      handleUnitChange: jest.fn(),
    });

    const { toJSON } = render(<WeatherScreen />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("updates input value and triggers search", async () => {
    const mockHandleSearch = jest.fn();
    (useSearch as jest.Mock).mockReturnValue({
      query: "",
      unit: "C",
      suggestions: [],
      suggestionsLoading: false,
      suggestionsError: null,
      currentWeather: null,
      currentLoading: false,
      currentError: null,
      suspendedListEnabled: true,
      handleForecastList: jest.fn(),
      handleSearch: mockHandleSearch,
      handleSuggestionPress: jest.fn(),
      handleUnitChange: jest.fn(),
    });

    const { getByPlaceholderText } = render(<WeatherScreen />);
    const input = getByPlaceholderText("Enter a location...");

    fireEvent.changeText(input, "New York");
    fireEvent(input, "submitEditing");

    await waitFor(() => {
      expect(mockHandleSearch).toHaveBeenCalledWith("New York");
    });
  });

  it("renders search suggestions and handles selection", async () => {
    const mockHandleSuggestionPress = jest.fn();
    (useSearch as jest.Mock).mockReturnValue({
      query: "",
      unit: "C",
      suggestions: [{ id: 1, name: "New York" }],
      suggestionsLoading: false,
      suggestionsError: null,
      currentWeather: null,
      currentLoading: false,
      currentError: null,
      suspendedListEnabled: true,
      handleForecastList: jest.fn(),
      handleSearch: jest.fn(),
      handleSuggestionPress: mockHandleSuggestionPress,
      handleUnitChange: jest.fn(),
    });

    const { getByText } = render(<WeatherScreen />);

    const suggestion = getByText("New York");
    fireEvent.press(suggestion);

    expect(mockHandleSuggestionPress).toHaveBeenCalledWith("New York");
  });

  it("renders the weather data correctly", () => {
    (useSearch as jest.Mock).mockReturnValue({
      query: "",
      unit: "F",
      suggestions: [],
      suggestionsLoading: false,
      suggestionsError: null,
      currentWeather: {
        location: { name: "New York", country: "USA", region: "NY" },
        current: {
          temp_c: 25,
          temp_f: 77,
          condition: { text: "Sunny", icon: "//cdn.weather.com/icon.png" },
        },
        forecast: {
          forecastday: [
            {
              day: {
                maxtemp_c: 30,
                maxtemp_f: 86,
                mintemp_c: 20,
                mintemp_f: 68,
              },
            },
          ],
        },
      },
      currentLoading: false,
      currentError: null,
      suspendedListEnabled: false,
      handleSearch: jest.fn(),
      handleForecastList: jest.fn().mockReturnValue([
        {
          time: "2025-02-09 22:00",
          time_epoch: 1,
          temp_c: 20,
          temp_f: 68,
          condition: { text: "Clear", icon: "//icon.png" },
        },
        {
          time: "2025-02-09 23:00",
          time_epoch: 2,
          temp_c: 19,
          temp_f: 66,
          condition: { text: "Cloudy", icon: "//icon.png" },
        },
        {
          time: "2025-02-09 00:00",
          time_epoch: 3,
          temp_c: 18,
          temp_f: 64,
          condition: { text: "Rainy", icon: "//icon.png" },
        },
      ]),
      handleSuggestionPress: jest.fn(),
      handleUnitChange: jest.fn(),
    });

    const { toJSON } = render(<WeatherScreen />);

    expect(toJSON()).toMatchSnapshot();
  });

  it("renders and interacts with unit selector", () => {
    const mockHandleUnitChange = jest.fn();
    (useSearch as jest.Mock).mockReturnValue({
      query: "",
      unit: "C",
      suggestions: [],
      suggestionsLoading: false,
      suggestionsError: null,
      currentWeather: null,
      currentLoading: false,
      currentError: null,
      suspendedListEnabled: true,
      handleSearch: jest.fn(),
      handleForecastList: jest.fn(),
      handleSuggestionPress: jest.fn(),
      handleUnitChange: mockHandleUnitChange,
    });

    const { getByText } = render(<WeatherScreen />);
    const fahrenheitButton = getByText("Fahrenheit (°F)");
    fireEvent.press(fahrenheitButton);

    expect(mockHandleUnitChange).toHaveBeenCalledWith("F");
  });

  it("renders and interacts with unit selector", () => {
    const mockHandleSearch = jest.fn();
    (useSearch as jest.Mock).mockReturnValue({
      query: "query",
      unit: "C",
      suggestions: [],
      suggestionsLoading: false,
      suggestionsError: null,
      currentWeather: null,
      currentLoading: false,
      currentError: null,
      suspendedListEnabled: true,
      handleForecastList: jest.fn(),
      handleSearch: mockHandleSearch,
      handleSuggestionPress: jest.fn(),
      handleUnitChange: jest.fn(),
    });

    const { getByTestId } = render(<WeatherScreen />);
    const fahrenheitButton = getByTestId("searchButton");
    fireEvent.press(fahrenheitButton);

    expect(mockHandleSearch).toHaveBeenCalledWith("query");
  });

  it("shows loading indicator when fetching data", () => {
    (useSearch as jest.Mock).mockReturnValue({
      query: "",
      unit: "C",
      suggestions: [],
      suggestionsLoading: true,
      suggestionsError: "mockError",
      currentWeather: null,
      currentLoading: true,
      currentError: "mockError",
      suspendedListEnabled: true,
      handleForecastList: jest.fn(),
      handleSearch: jest.fn(),
      handleSuggestionPress: jest.fn(),
      handleUnitChange: jest.fn(),
    });

    const { getAllByTestId } = render(<WeatherScreen />);
    expect(getAllByTestId("loading-indicator")).toHaveLength(2);
  });
});
