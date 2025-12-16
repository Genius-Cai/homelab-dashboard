import { NextRequest, NextResponse } from "next/server";

// Open-Meteo API (free, no key needed)
const OPEN_METEO_API = "https://api.open-meteo.com/v1/forecast";

// Fallback: Sydney coordinates (server location)
const DEFAULT_LAT = -33.8688;
const DEFAULT_LON = 151.2093;
const DEFAULT_CITY = "Sydney";
const DEFAULT_TIMEZONE = "Australia/Sydney";

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

interface GeoLocation {
  lat: number;
  lon: number;
  city: string;
  country: string;
  timezone: string;
}

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

// Get client IP from various headers
function getClientIP(request: NextRequest): string | null {
  // Cloudflare
  const cfConnectingIP = request.headers.get("cf-connecting-ip");
  if (cfConnectingIP) return cfConnectingIP;

  // X-Forwarded-For (may contain multiple IPs, take the first)
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",").map((ip) => ip.trim());
    return ips[0] || null;
  }

  // X-Real-IP
  const xRealIP = request.headers.get("x-real-ip");
  if (xRealIP) return xRealIP;

  return null;
}

// Get location from IP using ip-api.com (free, no key needed)
async function getLocationFromIP(ip: string): Promise<GeoLocation | null> {
  try {
    // Skip private/local IPs
    if (
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.") ||
      ip === "127.0.0.1" ||
      ip === "::1"
    ) {
      return null;
    }

    // Use AbortController for timeout (3 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,city,country,lat,lon,timezone`,
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = await response.json();

    if (data.status !== "success") return null;

    return {
      lat: data.lat,
      lon: data.lon,
      city: data.city,
      country: data.country,
      timezone: data.timezone,
    };
  } catch {
    // IP geolocation failed, will fallback to default
    console.log("IP geolocation failed, using default location");
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Try to get client IP and geolocate
    const clientIP = getClientIP(request);
    let location: GeoLocation | null = null;

    if (clientIP) {
      console.log("Detected client IP:", clientIP);
      location = await getLocationFromIP(clientIP);
      if (location) {
        console.log("Geolocated to:", location.city, location.country);
      }
    }

    // Use detected location or fallback to Sydney
    const lat = location?.lat ?? DEFAULT_LAT;
    const lon = location?.lon ?? DEFAULT_LON;
    const city = location?.city ?? DEFAULT_CITY;
    const timezone = location?.timezone ?? DEFAULT_TIMEZONE;

    console.log("Fetching weather for:", city, lat, lon);

    const url = `${OPEN_METEO_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m,is_day&timezone=${encodeURIComponent(timezone)}`;

    console.log("Weather API URL:", url);

    const response = await fetch(url);

    console.log("Weather API response status:", response.status);

    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;
    const weatherCode = current.weather_code;
    const weatherInfo = weatherCodes[weatherCode] || {
      description: "Unknown",
      icon: "❓",
    };

    const weather: WeatherData = {
      temperature: Math.round(current.temperature_2m),
      apparentTemperature: Math.round(current.apparent_temperature),
      weatherCode: weatherCode,
      description: weatherInfo.description,
      icon: weatherInfo.icon,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      isDay: current.is_day === 1,
      location: city,
    };

    return NextResponse.json({
      success: true,
      data: weather,
      detectedIP: clientIP,
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
