import React from "react";
import { render } from "@testing-library/react";
import WeatherCard from "../components/WeatherCard";
import moment from "moment";

// Mocking moment function
jest.mock("moment", () => () => ({
  format: jest.fn(() => "Monday, January 1, 2022"), // Mock the format function to return a specific date
}));

describe("WeatherCard Component", () => {
  test("renders WeatherCard component with correct weather data", () => {
    const weatherData = {
      data: [
        { tavg: 20, wspd: 10 }, // Sample weather data
      ],
    };

    const { getByText } = render(<WeatherCard weatherData={weatherData} />);

    // Check if the header is rendered
    expect(getByText("Weather")).toBeInTheDocument();

    // Check if the day and date are rendered with mocked moment function using regular expression matcher
    expect(getByText(/^Day:/)).toBeInTheDocument();
    expect(getByText("Monday, January 1, 2022")).toBeInTheDocument();

    // Check if the average temperature and wind speed are rendered from weatherData prop
    expect(getByText("Avg Temprature: 20 °C")).toBeInTheDocument();
    expect(getByText("Avg Wind Speed: 10 km/h")).toBeInTheDocument();
  });
});
