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
    const now = new Date();
    const twoHoursAgo = new Date();
    const sixHoursLater = new Date();
    twoHoursAgo.setHours(now.getHours() - 2);
    sixHoursLater.setHours(now.getHours() + 6);

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
              hour: [
                {
                  time: twoHoursAgo.toISOString(),
                  time_epoch: twoHoursAgo.getTime(),
                  temp_c: 26,
                  temp_f: 78,
                  condition: {
                    text: "Cloudy",
                    icon: "//cdn.weather.com/cloudy.png",
                  },
                },
                {
                  time: now.toISOString(),
                  time_epoch: now.getTime(),
                  temp_c: 26,
                  temp_f: 78,
                  condition: {
                    text: "Cloudy",
                    icon: "//cdn.weather.com/cloudy.png",
                  },
                },
                {
                  time: sixHoursLater.toISOString(),
                  time_epoch: sixHoursLater.getTime(),
                  temp_c: 26,
                  temp_f: 78,
                  condition: {
                    text: "Cloudy",
                    icon: "//cdn.weather.com/cloudy.png",
                  },
                },
              ],
            },
          ],
        },
      },
      currentLoading: false,
      currentError: null,
      suspendedListEnabled: false,
      handleSearch: jest.fn(),
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
      handleSearch: jest.fn(),
      handleSuggestionPress: jest.fn(),
      handleUnitChange: jest.fn(),
    });

    const { getAllByTestId } = render(<WeatherScreen />);
    expect(getAllByTestId("loading-indicator")).toHaveLength(2);
  });
});
