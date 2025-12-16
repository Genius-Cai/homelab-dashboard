import { NextResponse } from "next/server";

// Open-Meteo API (free, no key needed)
const OPEN_METEO_API = "https://api.open-meteo.com/v1/forecast";

// Sydney coordinates
const SYDNEY_LAT = -33.8688;
const SYDNEY_LON = 151.2093;

// WMO Weather interpretation codes
const weatherCodes: Record<number, { description: string; icon: string }> = {
  0: { description: "Clear sky", icon: "☀️" },
  1: { description: "Mainly clear", icon: "🌤️" },
  2: { description: "Partly cloudy", icon: "⛅" },
  3: { description: "Overcast", icon: "☁️" },
  45: { description: "Fog", icon: "🌫️" },
  48: { description: "Depositing rime fog", icon: "🌫️" },
  51: { description: "Light drizzle", icon: "🌧️" },
  53: { description: "Moderate drizzle", icon: "🌧️" },
  55: { description: "Dense drizzle", icon: "🌧️" },
  56: { description: "Light freezing drizzle", icon: "🌨️" },
  57: { description: "Dense freezing drizzle", icon: "🌨️" },
  61: { description: "Slight rain", icon: "🌧️" },
  63: { description: "Moderate rain", icon: "🌧️" },
  65: { description: "Heavy rain", icon: "🌧️" },
  66: { description: "Light freezing rain", icon: "🌨️" },
  67: { description: "Heavy freezing rain", icon: "🌨️" },
  71: { description: "Slight snow", icon: "❄️" },
  73: { description: "Moderate snow", icon: "❄️" },
  75: { description: "Heavy snow", icon: "❄️" },
  77: { description: "Snow grains", icon: "❄️" },
  80: { description: "Slight rain showers", icon: "🌦️" },
  81: { description: "Moderate rain showers", icon: "🌦️" },
  82: { description: "Violent rain showers", icon: "⛈️" },
  85: { description: "Slight snow showers", icon: "🌨️" },
  86: { description: "Heavy snow showers", icon: "🌨️" },
  95: { description: "Thunderstorm", icon: "⛈️" },
  96: { description: "Thunderstorm with slight hail", icon: "⛈️" },
  99: { description: "Thunderstorm with heavy hail", icon: "⛈️" },
};

interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  location: string;
}

export async function GET() {
  try {
    const params = new URLSearchParams({
      latitude: SYDNEY_LAT.toString(),
      longitude: SYDNEY_LON.toString(),
      current: "temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m,is_day",
      timezone: "Australia/Sydney",
    });

    const response = await fetch(`${OPEN_METEO_API}?${params}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;
    const weatherCode = current.weather_code;
    const weatherInfo = weatherCodes[weatherCode] || { description: "Unknown", icon: "❓" };

    const weather: WeatherData = {
      temperature: Math.round(current.temperature_2m),
      apparentTemperature: Math.round(current.apparent_temperature),
      weatherCode: weatherCode,
      description: weatherInfo.description,
      icon: weatherInfo.icon,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      isDay: current.is_day === 1,
      location: "Sydney",
    };

    return NextResponse.json({
      success: true,
      data: weather,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
