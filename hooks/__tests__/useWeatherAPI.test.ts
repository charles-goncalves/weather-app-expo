import { renderHook, act } from "@testing-library/react-hooks";
import useWeatherAPI from "../useWeatherAPI";
import { fetchWeatherAPI } from "../../services/fetch";

// Mock the fetchWeatherAPI function
jest.mock("../../services/fetch", () => ({
  fetchWeatherAPI: jest.fn(),
}));

describe("useWeatherAPI", () => {
  const mockUrl = "https://api.weatherapi.com/v1/current.json";
  const mockParams = { q: "London" };
  const mockResponse = {
    current: { temp_c: 15, condition: { text: "Sunny" } },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch weather data and update state correctly", async () => {
    (fetchWeatherAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() =>
      useWeatherAPI(mockUrl, mockParams)
    );

    expect(result.current.weatherData).toBeUndefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    act(() => {
      result.current.submit();
    });

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.weatherData).toEqual(mockResponse);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch errors and update error state", async () => {
    const mockError = new Error("Network error");

    (fetchWeatherAPI as jest.Mock).mockRejectedValueOnce(mockError);

    const { result, waitForNextUpdate } = renderHook(() =>
      useWeatherAPI(mockUrl, mockParams)
    );

    act(() => {
      result.current.submit();
    });

    await waitForNextUpdate();

    expect(result.current.error).toBe("Network error");
    expect(result.current.loading).toBe(false);
    expect(result.current.weatherData).toBeUndefined();
  });

  it("should not fetch data if submit is not called", async () => {
    const { result } = renderHook(() => useWeatherAPI(mockUrl, mockParams));

    expect(result.current.weatherData).toBeUndefined();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    expect(fetchWeatherAPI).not.toHaveBeenCalled();
  });

  it("should reset submit state after fetching data", async () => {
    (fetchWeatherAPI as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() =>
      useWeatherAPI(mockUrl, mockParams)
    );

    act(() => {
      result.current.submit();
    });

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
  });
});
