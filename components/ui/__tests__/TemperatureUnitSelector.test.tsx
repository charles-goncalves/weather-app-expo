import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TemperatureUnitSelector from "../TemperatureUnitSelector";

describe("TemperatureUnitSelector", () => {
  it("renders correctly with Celsius selected by default", () => {
    const onUnitChange = jest.fn();
    const { getByText } = render(
      <TemperatureUnitSelector onUnitChange={onUnitChange} />
    );

    expect(getByText("Temperature Unit:")).toBeTruthy();
    expect(getByText("Celsius (°C)")).toBeTruthy();
    expect(getByText("Fahrenheit (°F)")).toBeTruthy();

    const celsiusButton = getByText("Celsius (°C)");
    expect(celsiusButton.props.style).toContainEqual(
      expect.objectContaining({ color: "#aaa", fontSize: 16 })
    );
  });

  it("calls onUnitChange with 'C' when Celsius is pressed", () => {
    const onUnitChange = jest.fn();
    const { getByText } = render(
      <TemperatureUnitSelector onUnitChange={onUnitChange} />
    );

    const celsiusButton = getByText("Celsius (°C)");
    fireEvent.press(celsiusButton);

    expect(onUnitChange).toHaveBeenCalledWith("C");
  });

  it("calls onUnitChange with 'F' when Fahrenheit is pressed", () => {
    const onUnitChange = jest.fn();
    const { getByText } = render(
      <TemperatureUnitSelector onUnitChange={onUnitChange} />
    );

    const fahrenheitButton = getByText("Fahrenheit (°F)");
    fireEvent.press(fahrenheitButton);

    expect(onUnitChange).toHaveBeenCalledWith("F");
  });

  it("updates the selected unit when a button is pressed", () => {
    const onUnitChange = jest.fn();
    const { getByText } = render(
      <TemperatureUnitSelector onUnitChange={onUnitChange} />
    );

    const fahrenheitButton = getByText("Fahrenheit (°F)");
    fireEvent.press(fahrenheitButton);

    expect(fahrenheitButton.props.style).toContainEqual(
      expect.objectContaining({ color: "#fff" })
    );

    const celsiusButton = getByText("Celsius (°C)");
    fireEvent.press(celsiusButton);

    expect(celsiusButton.props.style).toContainEqual(
      expect.objectContaining({ color: "#fff" })
    );
  });
});
