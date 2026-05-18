"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

// Dynamically import map to avoid SSR issues with Leaflet
const WeatherMap = dynamic(() => import("@/components/WeatherMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] md:h-[450px] rounded-2xl border border-white/10 flex items-center justify-center bg-surface/30">
      <span className="material-symbols-outlined animate-spin text-4xl text-primary-fixed">sync</span>
    </div>
  ),
});

interface WeatherData {
  city: string;
  temp: string;
  humidity: string;
  windSpeed: string;
  weatherDesc: string;
  lat: number;
  lon: number;
}

const MAJOR_CITIES = [
  { name: "Jakarta Pusat", adm4: "31.71.03.1001" },
  { name: "Surabaya", adm4: "35.78.08.1002" },
  { name: "Bandung", adm4: "32.73.12.1004" },
  { name: "Semarang", adm4: "33.74.11.1001" },
  { name: "Medan", adm4: "12.71.06.1001" },
  { name: "Malang", adm4: "35.73.01.1001" },
  { name: "Batu", adm4: "35.79.01.1001" },
  { name: "Makassar", adm4: "73.71.04.1005" },
  { name: "Denpasar", adm4: "51.71.01.1001" },
  { name: "Jayapura", adm4: "91.71.01.1001" },
  { name: "Yogyakarta", adm4: "34.71.04.1001" },
  { name: "Balikpapan", adm4: "64.71.06.1001" },
];

export default function RealtimeWeather() {
  const [allCities, setAllCities] = useState<WeatherData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const results = await Promise.all(
          MAJOR_CITIES.map(async (city) => {
            const res = await fetch(`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${city.adm4}`);
            if (!res.ok) throw new Error("Gagal mengambil " + city.name);
            const json = await res.json();

            const lokasi = json.lokasi || json.data?.[0]?.lokasi;
            const cuaca = json.data[0].cuaca[0][0];

            return {
              city: city.name,
              temp: cuaca.t.toString(),
              humidity: cuaca.hu.toString(),
              windSpeed: cuaca.ws.toString(),
              weatherDesc: cuaca.weather_desc,
              lat: lokasi?.lat ?? 0,
              lon: lokasi?.lon ?? 0,
            };
          })
        );
        setAllCities(results);
      } catch {
        setError("Sebagian data gagal dimuat dari satelit BMKG. Pastikan Anda memiliki koneksi internet.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const filteredChips = useMemo(() => {
    if (!searchQuery.trim()) return allCities;
    return allCities.filter((c) =>
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allCities]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setWeatherData(null);
      setError(null);
      return;
    }

    const match = allCities.find((c) =>
      c.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (match) {
      setWeatherData(match);
      setError(null);
    } else {
      setWeatherData(null);
      setError(`Kota '${searchQuery}' tidak ditemukan di daftar kurasi kami.`);
    }
  };

  const getIconForWeather = (desc: string) => {
    const d = desc.toLowerCase();
    if (d.includes("hujan petir")) return "thunderstorm";
    if (d.includes("hujan")) return "rainy";
    if (d.includes("berawan")) return "partly_cloudy_day";
    if (d.includes("kabut") || d.includes("kabur") || d.includes("asap"))
      return "foggy";
    return "clear_day";
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-20 md:pb-0">
      <div>
        <h2 className="font-headline-lg text-headline-md text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-container">
            satellite_alt
          </span>
          Observasi Cuaca Real-time (BMKG)
        </h2>
        <p className="font-body-md text-on-surface-variant mt-1">
          Bandingkan data simulator teoretis dengan observasi satelit dan stasiun
          cuaca nyata dari BMKG.
        </p>
      </div>

      {/* Interactive Map */}
      <WeatherMap
        cities={allCities}
        onCitySelect={(city) => {
          setWeatherData(city);
          setSearchQuery(city.city);
          setError(null);
        }}
      />

      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          <div className="relative flex-grow w-full md:max-w-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value === "") setWeatherData(null);
              }}
              placeholder="Cari kota (misal: Surabaya, Malang, Batu, Denpasar...)"
              className="w-full bg-surface-container-highest border border-white/10 rounded-xl py-3 px-4 pl-12 text-white font-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none transition-all"
            />
            <span className="material-symbols-outlined absolute left-4 top-3 text-on-surface-variant">
              search
            </span>
          </div>
          <button
            type="submit"
            disabled={isLoading || allCities.length === 0}
            className="w-full md:w-auto px-6 py-3 rounded-xl font-label-md text-label-md text-surface-dim bg-gradient-to-r from-primary-container to-primary-fixed shadow-[0_0_15px_rgba(0,242,255,0.3)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">
                  sync
                </span>{" "}
                Memuat Data BMKG...
              </>
            ) : (
              "Cari Wilayah"
            )}
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-xl border border-error/40 bg-error-container/20 text-error flex items-center gap-3 animate-in fade-in">
            <span className="material-symbols-outlined">error</span>
            <p className="font-body-md">{error}</p>
          </div>
        )}

        {/* Available Cities Chips (when empty) */}
        {!weatherData && !isLoading && !error && (
          <div className="animate-in fade-in flex flex-col gap-3">
            <p className="font-label-md text-on-surface-variant text-sm uppercase tracking-wider">
              {searchQuery ? "Hasil pencarian:" : "Kota yang tersedia:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {filteredChips.map((city) => (
                <button
                  key={city.city}
                  onClick={() => {
                    setSearchQuery(city.city);
                    setWeatherData(city);
                    setError(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-surface/50 border border-white/10 hover:bg-primary-container/20 hover:border-primary-container/50 hover:text-primary-fixed transition-all text-sm cursor-pointer"
                >
                  {city.city}
                </button>
              ))}
              {filteredChips.length === 0 && (
                <p className="text-on-surface-variant text-sm">
                  Tidak ada kota yang cocok.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Empty State / Loading */}
        {!weatherData && isLoading && (
          <div className="flex flex-col items-center justify-center p-12 text-center opacity-50 border border-dashed border-white/20 rounded-xl">
            <span className="material-symbols-outlined animate-spin text-6xl mb-4 text-primary-fixed">
              sync
            </span>
            <h3 className="font-headline-md text-white mb-2">
              Sinkronisasi dengan Satelit
            </h3>
            <p className="font-body-md text-on-surface-variant">
              Sedang mengunduh data terbaru dari server publik BMKG...
            </p>
          </div>
        )}

        {/* Results */}
        {weatherData && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary-fixed text-4xl">
                location_on
              </span>
              <div>
                <h3 className="font-display-lg text-3xl text-white">
                  {weatherData.city}
                </h3>
                <p className="font-label-md text-primary-fixed-dim uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs">
                    rss_feed
                  </span>{" "}
                  Terhubung ke Server Publik BMKG
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Temperature */}
              <div className="glass-panel-elevated p-5 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/10 rounded-full blur-3xl group-hover:bg-primary-fixed/20 transition-colors"></div>
                <h3 className="font-label-md text-on-surface-variant flex items-center gap-2 uppercase tracking-wider text-xs mb-4 relative z-10">
                  <span className="material-symbols-outlined text-primary-fixed text-sm">
                    thermostat
                  </span>{" "}
                  Temperatur
                </h3>
                <div className="flex items-end gap-2 relative z-10">
                  <span className="font-display-lg text-4xl text-white font-bold">
                    {weatherData.temp || "--"}
                  </span>
                  <span className="text-primary-fixed-dim font-label-md mb-1">
                    °C
                  </span>
                </div>
              </div>

              {/* Humidity */}
              <div className="glass-panel-elevated p-5 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed/10 rounded-full blur-3xl group-hover:bg-secondary-fixed/20 transition-colors"></div>
                <h3 className="font-label-md text-on-surface-variant flex items-center gap-2 uppercase tracking-wider text-xs mb-4 relative z-10">
                  <span className="material-symbols-outlined text-secondary-fixed text-sm">
                    humidity_percentage
                  </span>{" "}
                  Kelembapan
                </h3>
                <div className="flex items-end gap-2 relative z-10">
                  <span className="font-display-lg text-4xl text-white font-bold">
                    {weatherData.humidity || "--"}
                  </span>
                  <span className="text-secondary-fixed-dim font-label-md mb-1">
                    %
                  </span>
                </div>
              </div>

              {/* Wind Speed */}
              <div className="glass-panel-elevated p-5 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-fixed-dim/10 rounded-full blur-3xl group-hover:bg-tertiary-fixed-dim/20 transition-colors"></div>
                <h3 className="font-label-md text-on-surface-variant flex items-center gap-2 uppercase tracking-wider text-xs mb-4 relative z-10">
                  <span className="material-symbols-outlined text-tertiary-fixed-dim text-sm">
                    air
                  </span>{" "}
                  Kecepatan Angin
                </h3>
                <div className="flex items-end gap-2 relative z-10">
                  <span className="font-display-lg text-4xl text-white font-bold">
                    {weatherData.windSpeed || "--"}
                  </span>
                  <span className="text-tertiary-fixed-dim font-label-md mb-1">
                    km/h
                  </span>
                </div>
              </div>

              {/* Weather Condition */}
              <div className="glass-panel-elevated p-5 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-colors"></div>
                <h3 className="font-label-md text-on-surface-variant flex items-center gap-2 uppercase tracking-wider text-xs mb-4 relative z-10">
                  <span className="material-symbols-outlined text-green-400 text-sm">
                    filter_drama
                  </span>{" "}
                  Kondisi Langit
                </h3>
                <div className="flex items-center gap-3 relative z-10">
                  <span className="material-symbols-outlined text-3xl text-green-400">
                    {getIconForWeather(weatherData.weatherDesc)}
                  </span>
                  <span className="font-headline-md text-xl text-white font-bold">
                    {weatherData.weatherDesc}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 glass-card rounded-xl border border-white/10 bg-surface/30">
              <div className="flex items-center gap-3 text-sm font-body-md text-on-surface-variant">
                <img
                  src="https://www.bmkg.go.id/asset/img/logo/logo-bmkg.png"
                  alt="BMKG"
                  className="h-8 opacity-80"
                />
                <p>
                  Sumber Data:{" "}
                  <strong>
                    BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
                  </strong>
                  . Diperbarui otomatis dari satelit publik.
                </p>
              </div>

              <button
                onClick={() => {
                  setWeatherData(null);
                  setSearchQuery("");
                }}
                className="px-4 py-2 border border-white/10 rounded-lg hover:bg-surface-container transition-colors text-sm"
              >
                Kembali ke Daftar Kota
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
