import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export type TemperatureUnit = "C" | "F";

interface TemperatureUnitSelectorProps {
  onUnitChange: (unit: TemperatureUnit) => void;
}

const TemperatureUnitSelector: React.FC<TemperatureUnitSelectorProps> = ({
  onUnitChange,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<TemperatureUnit>("C");

  const handleUnitChange = (unit: TemperatureUnit) => {
    setSelectedUnit(unit);
    onUnitChange(unit);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Temperature Unit:</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, selectedUnit === "C" && styles.selectedButton]}
          onPress={() => handleUnitChange("C")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedUnit === "C" && styles.selectedButtonText,
            ]}
          >
            Celsius (°C)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedUnit === "F" && styles.selectedButton]}
          onPress={() => handleUnitChange("F")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedUnit === "F" && styles.selectedButtonText,
            ]}
          >
            Fahrenheit (°F)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 0.28,
    textAlign: "right",
    marginRight: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 0.8,
  },
  button: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  selectedButton: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  buttonText: {
    fontSize: 16,
    color: "#aaa",
  },
  selectedButtonText: {
    color: "#fff",
  },
});

export default TemperatureUnitSelector;
