import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import useSearch from "../hooks/useSearch";
import TemperatureUnitSelector from "@/components/ui/TemperatureUnitSelector";

const WeatherScreen = () => {
  const {
    query,
    unit,
    suggestions,
    suggestionsLoading,
    suggestionsError,
    suspendedListEnabled,
    currentWeather,
    currentLoading,
    currentError,
    handleForecastList,
    handleSearch,
    handleSuggestionPress,
    handleUnitChange,
  } = useSearch();
  const now = new Date();

  const renderSuggestion = ({
    index,
    item,
  }: {
    item: {
      id: number;
      name: string;
    };
    index: number;
  }) => (
    <TouchableOpacity
      key={index}
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item.name)}
    >
      <Text style={styles.suggestionText}>{item.name}</Text>
    </TouchableOpacity>
  );
  const renderTemperature = (celsius: number, fahrenheit: number) => {
    if (unit === "C") return `${celsius.toFixed(0)}°`;

    return `${fahrenheit.toFixed(0)}°`;
  };
  const renderForecast = (item: {
    temp_f: number;
    time: string;
    time_epoch: number;
    condition: {
      text: string;
      icon: string;
    };
    temp_c: number;
  }) => {
    return (
      <View style={styles.forecastItem} key={item.time_epoch}>
        <View>
          <Text style={styles.suggestionText}>{item.time.split(" ")[1]}</Text>
          <Text style={styles.suggestionText}>{item.condition.text}</Text>
        </View>
        <View style={styles.forecastSubItem}>
          <Text style={styles.suggestionText}>
            {renderTemperature(item.temp_c, item.temp_f)}
          </Text>
          <Image
            source={{
              uri: "https:" + item.condition.icon,
            }}
            style={styles.forecastIcon}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TemperatureUnitSelector onUnitChange={handleUnitChange} />
      <View>
        <TextInput
          style={styles.input}
          placeholder="Enter a location..."
          value={query}
          onChangeText={handleSearch}
          onSubmitEditing={() => handleSearch(query)}
        />
        <TouchableOpacity
          onPress={() => handleSearch(query)}
          testID="searchButton"
          style={{
            position: "absolute",
            right: 30,
            top: 25,
          }}
        >
          <IconSymbol name="magnifyingglass.circle" size={30} color={"black"} />
        </TouchableOpacity>
        {suspendedListEnabled && (
          <View style={styles.suspendedList}>
            {suggestionsLoading && (
              <ActivityIndicator
                size="large"
                color="#000000"
                testID="loading-indicator"
              />
            )}

            {suggestionsError && (
              <Text style={styles.error}>Error: {suggestionsError}</Text>
            )}

            {suggestions && (
              <FlatList
                data={suggestions}
                renderItem={renderSuggestion}
                keyExtractor={(item) => item.id.toString()}
                style={styles.suggestionsList}
              />
            )}

            {suggestions && suggestions.length === 0 && (
              <Text style={styles.noResults}>No results found.</Text>
            )}
          </View>
        )}
      </View>
      <ScrollView>
        {currentLoading && (
          <ActivityIndicator
            size="large"
            color="#000000"
            testID="loading-indicator"
          />
        )}

        {currentError && (
          <Text style={styles.error}>Error: {currentError}</Text>
        )}

        {currentWeather && (
          <View style={styles.sectionContainer}>
            <Text style={styles.weatherTitle}>Current Weather:</Text>
            <View style={styles.weatherContainer}>
              <View style={styles.weatherDataContainer}>
                <Text style={styles.weatherLocation}>
                  {currentWeather.location.name},{" "}
                  {currentWeather.location.country}
                </Text>
                <Text style={styles.weatherRegion}>
                  {currentWeather.location.region}
                </Text>
                <Text style={styles.weatherCondition}>
                  {currentWeather.current.condition.text}
                </Text>
                <Text style={styles.weatherRegion}>
                  H:{" "}
                  {renderTemperature(
                    currentWeather.forecast.forecastday[0].day.maxtemp_c,
                    currentWeather.forecast.forecastday[0].day.maxtemp_f
                  )}
                  {", "}
                  L:{" "}
                  {renderTemperature(
                    currentWeather.forecast.forecastday[0].day.mintemp_c,
                    currentWeather.forecast.forecastday[0].day.mintemp_f
                  )}
                </Text>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: "https:" + currentWeather.current.condition.icon,
                  }}
                  style={styles.weatherIcon}
                />
                <Text style={styles.weatherTemperature}>
                  {renderTemperature(
                    currentWeather.current.temp_c,
                    currentWeather.current.temp_f
                  )}
                </Text>
              </View>
            </View>
            <Text style={styles.weatherTitle}>Forecast:</Text>
            <View style={styles.forecastList}>
              {handleForecastList(now.getHours()).map((item: any) =>
                renderForecast(item)
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  separator: {
    borderTopWidth: 1,
  },
  input: {
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    margin: 20,
    backgroundColor: "#fff",
  },
  suspendedList: {
    backgroundColor: "white",
    position: "absolute",
    width: "100%",
    zIndex: 10,
    top: 60,
  },
  suggestionsList: {
    marginHorizontal: 20,
    maxHeight: 250,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  forecastList: {
    marginTop: 8,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    borderBottomWidth: 0,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  forecastItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderRadius: 10,
    borderBottomColor: "black",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forecastSubItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  suggestionText: {
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 16,
    marginTop: 16,
  },
  noResults: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  sectionContainer: {
    margin: 20,
  },
  weatherContainer: {
    marginVertical: 16,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
  },
  weatherDataContainer: { maxWidth: "70%" },
  weatherTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  weatherLocation: {
    fontSize: 20,
    fontWeight: "bold",
  },
  weatherRegion: {
    fontSize: 16,
    marginBottom: 8,
  },
  weatherCondition: {
    fontSize: 18,
    marginBottom: 8,
  },
  weatherTemperature: {
    fontSize: 20,
  },
  weatherIcon: {
    width: 90,
    height: 90,
  },
  forecastIcon: {
    width: 30,
    height: 30,
    marginLeft: 5,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export default WeatherScreen;
