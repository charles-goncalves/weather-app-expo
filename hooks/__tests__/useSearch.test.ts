import { renderHook, act } from "@testing-library/react-hooks";
import useSearch from "../useSearch";
import useWeatherAPI from "../useWeatherAPI";

jest.mock("../useWeatherAPI");

describe("useSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with default query", () => {
    (useWeatherAPI as jest.Mock).mockReturnValue({
      weatherData: null,
      loading: false,
      error: null,
      submit: jest.fn(),
    });
    const { result } = renderHook(() => useSearch());
    expect(result.current.query).toBe("");
  });

  it("initializes with default unit", () => {
    const { result } = renderHook(() => useSearch());
    expect(result.current.unit).toBe("C");
  });

  it("initializes with default suggestions state", () => {
    const { result } = renderHook(() => useSearch());
    expect(result.current.suggestions).toBeNull();
    expect(result.current.suggestionsLoading).toBe(false);
    expect(result.current.suggestionsError).toBeNull();
  });

  it("initializes with default weather state", () => {
    const { result } = renderHook(() => useSearch());
    expect(result.current.currentWeather).toBeNull();
    expect(result.current.currentLoading).toBe(false);
    expect(result.current.currentError).toBeNull();
  });

  it("initializes with suspended list enabled", () => {
    const { result } = renderHook(() => useSearch());
    expect(result.current.suspendedListEnabled).toBe(true);
  });

  it("updates query when searching", () => {
    const mockSubmit = jest.fn();
    (useWeatherAPI as jest.Mock).mockReturnValue({
      weatherData: [],
      loading: false,
      error: null,
      submit: mockSubmit,
    });
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSearch("New York");
    });

    expect(result.current.query).toBe("New York");
  });

  it("calls suggestionSubmit when searching", () => {
    const mockSubmit = jest.fn();
    (useWeatherAPI as jest.Mock).mockReturnValue({
      weatherData: [],
      loading: false,
      error: null,
      submit: mockSubmit,
    });
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSearch("New York");
    });

    expect(mockSubmit).toHaveBeenCalled();
  });

  it("updates query when selecting a suggestion", () => {
    const mockSubmit = jest.fn();
    (useWeatherAPI as jest.Mock).mockReturnValue({
      weatherData: null,
      loading: false,
      error: null,
      submit: mockSubmit,
    });
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSuggestionPress("New York");
    });

    expect(result.current.query).toBe("New York");
  });

  it("disables suspended list when selecting a suggestion", () => {
    const mockSubmit = jest.fn();
    (useWeatherAPI as jest.Mock).mockReturnValue({
      weatherData: null,
      loading: false,
      error: null,
      submit: mockSubmit,
    });
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSuggestionPress("New York");
    });

    expect(result.current.suspendedListEnabled).toBe(false);
  });

  it("calls currentSubmit when selecting a suggestion", () => {
    const mockSubmit = jest.fn();
    (useWeatherAPI as jest.Mock).mockReturnValue({
      weatherData: null,
      loading: false,
      error: null,
      submit: mockSubmit,
    });
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleSuggestionPress("New York");
    });

    expect(mockSubmit).toHaveBeenCalled();
  });

  it("updates temperature unit", () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.handleUnitChange("F");
    });

    expect(result.current.unit).toBe("F");
  });
});
