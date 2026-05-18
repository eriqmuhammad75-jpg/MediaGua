"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface CityWeather {
  city: string;
  temp: string;
  humidity: string;
  windSpeed: string;
  weatherDesc: string;
  lat: number;
  lon: number;
}

interface WeatherMapProps {
  cities: CityWeather[];
  onCitySelect: (city: CityWeather) => void;
}

// Custom marker icon since default Leaflet icons break in Next.js bundling
const createWeatherIcon = (temp: number) => {
  const color = temp >= 28 ? "#ff5252" : temp >= 20 ? "#ffeb3b" : temp >= 10 ? "#69f0ae" : "#00f2ff";
  return L.divIcon({
    className: "custom-weather-marker",
    html: `
      <div style="
        background: linear-gradient(135deg, ${color}dd, ${color}88);
        border: 2px solid ${color};
        border-radius: 12px;
        padding: 4px 8px;
        color: #000;
        font-weight: 700;
        font-size: 12px;
        font-family: 'Inter', sans-serif;
        white-space: nowrap;
        box-shadow: 0 2px 8px ${color}66, 0 0 20px ${color}33;
        text-align: center;
        min-width: 42px;
      ">
        ${temp}°C
      </div>
    `,
    iconSize: [50, 28],
    iconAnchor: [25, 14],
    popupAnchor: [0, -18],
  });
};

export default function WeatherMap({ cities, onCitySelect }: WeatherMapProps) {
  return (
    <div className="w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden border border-white/10 relative">
      <MapContainer
        center={[-2.5, 118]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.city}
            position={[city.lat, city.lon]}
            icon={createWeatherIcon(parseFloat(city.temp))}
            eventHandlers={{
              click: () => onCitySelect(city),
            }}
          >
            <Popup>
              <div style={{ fontFamily: "'Inter', sans-serif", color: "#111", minWidth: 180 }}>
                <h4 style={{ margin: "0 0 6px 0", fontSize: 14, fontWeight: 700 }}>{city.city}</h4>
                <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                  🌡️ Suhu: <strong>{city.temp}°C</strong><br/>
                  💧 Kelembapan: <strong>{city.humidity}%</strong><br/>
                  💨 Angin: <strong>{city.windSpeed} km/h</strong><br/>
                  ☁️ {city.weatherDesc}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
