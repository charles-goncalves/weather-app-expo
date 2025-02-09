import axios from "axios";
import { fetchWeatherAPI } from "../fetch";
import { WEATHER_API_KEY } from "../constants";

const mockAPIKey = "test-api-key";

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("fetchWeatherAPI", () => {
  const mockUrl = "https://api.weatherapi.com/v1/current.json";

  beforeEach(() => {
    (axios.get as jest.Mock).mockClear();
  });

  it("should fetch weather data with the correct URL and parameters", async () => {
    const mockParams = { q: "London", days: "3" };
    const mockResponse = { data: "mock weather data" };

    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: mockResponse.data,
    });

    const result = await fetchWeatherAPI(mockUrl, mockParams);

    expect(axios.get).toHaveBeenCalledWith(
      `${mockUrl}?key=${WEATHER_API_KEY}&q=London&days=3`
    );

    expect(result).toEqual(mockResponse.data);
  });

  it("should handle empty parameters correctly", async () => {
    const mockResponse = { data: "mock weather data" };

    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: mockResponse.data,
    });

    const result = await fetchWeatherAPI(mockUrl);

    expect(axios.get).toHaveBeenCalledWith(`${mockUrl}?key=${WEATHER_API_KEY}`);

    expect(result).toEqual(mockResponse.data);
  });

  it("should handle fetch errors", async () => {
    const mockError = new Error("Network error");

    (axios.get as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(fetchWeatherAPI(mockUrl)).rejects.toThrow("Network error");
  });
});
