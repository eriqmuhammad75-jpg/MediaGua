"use client";

import { useState } from "react";

export default function Simulator() {
  const [elevation, setElevation] = useState<number>(0);
  const [latitude, setLatitude] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [greenCover, setGreenCover] = useState<number>(50);
  const [successMsg, setSuccessMsg] = useState("");

  // Helper to clamp values within realistic physical bounds
  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  // Pure derived calculations performed directly during render body
  const maritimeCooling = distance < 20 ? 1.2 : distance > 100 ? -0.8 : 0;
  const landHeat = (100 - greenCover) * 0.018;
  const temp = parseFloat(clamp(34 - elevation * 0.0065 - Math.abs(latitude) * 0.1 - maritimeCooling + landHeat, 12, 36).toFixed(1));
  
  const humidity = parseFloat(clamp(84 - distance * 0.22 + elevation * 0.012 + greenCover * 0.08 - temp * 0.22, 32, 96).toFixed(1));
  
  const pressure = Math.round(1013 - (elevation / 10));
  const wind = parseFloat((5 + (elevation / 500) * 2 + (distance < 50 ? 5 : 0)).toFixed(1));

  // Visual layout mapping for map coordinates
  const pinLeft = parseFloat(clamp(16 + distance * 0.34, 12, 80).toFixed(1));
  const pinTop = parseFloat(clamp(72 - elevation * 0.035, 18, 74).toFixed(1));

  // Determine dynamic temperature theme colors matching the legacy visual scale
  let colorName = "Merah (Panas)";
  let color = "#ff5252";
  if (temp < 21) {
    colorName = "Hijau-biru (Dingin)";
    color = "#4aa3c2";
  } else if (temp < 27) {
    colorName = "Hijau-kuning (Sejuk)";
    color = "#7fb66b";
  } else if (temp < 31) {
    colorName = "Kuning-oranye (Hangat)";
    color = "#f3b63f";
  }

  // Dynamic instructional factor analysis
  let dominant = "Kedekatan laut dan tutupan lahan menjadi faktor penting pada skenario ini.";
  if (elevation >= 700) {
    dominant = "Elevasi menjadi faktor paling kuat pada skenario ini.";
  } else if (Math.abs(latitude) >= 25) {
    dominant = "Lintang menjadi faktor paling kuat pada skenario ini.";
  } else if (distance <= 20) {
    dominant = "Kedekatan laut menjadi faktor paling kuat pada skenario ini.";
  }

  let explanation = "Wilayah rendah dan jauh dari vegetasi cenderung tampil lebih panas pada citra suhu.";
  if (elevation >= 700) {
    explanation = "Saat elevasi meningkat, suhu turun. Udara yang lebih sejuk dapat mendorong kondensasi, terutama pada lereng pegunungan.";
  } else if (distance <= 20) {
    explanation = "Wilayah pesisir dipengaruhi angin laut dan kelembapan. Suhu masih dapat tinggi jika elevasinya rendah dan tutupan lahan minim.";
  } else if (Math.abs(latitude) >= 25) {
    explanation = "Semakin jauh dari ekuator, sudut datang sinar matahari berubah sehingga intensitas pemanasan cenderung menurun.";
  }

  // Function to save current parameters directly to student's worksheet
  const sendToWorksheet = () => {
    const savedRowsStr = localStorage.getItem("atmosferWorksheet");
    const savedRows = savedRowsStr ? JSON.parse(savedRowsStr) : [];
    
    const newRow = {
      id: Date.now().toString(),
      lokasi: `Simulasi (${elevation} mdpl, ${latitude}°, ${distance} km, Hijau ${greenCover}%)`,
      elevasi: elevation.toString(),
      lintang: latitude.toString(),
      jarakLaut: distance.toString(),
      suhu: temp.toString(),
      kelembapan: Math.round(humidity).toString()
    };
    
    const updatedRows = [...savedRows, newRow];
    localStorage.setItem("atmosferWorksheet", JSON.stringify(updatedRows));
    
    setSuccessMsg("Skenario berhasil direkam ke LKPD Digital!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 pb-20 md:pb-0 h-full">
      {/* Left Column: Interactive Map & Controls */}
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h2 className="font-headline-lg text-headline-md text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed">public</span>
            Simulasi Dinamika Atmosfer
          </h2>
          <p className="font-body-md text-on-surface-variant mt-1">
            Ubah variabel geografis di bawah untuk melihat reaksinya terhadap gradasi suhu satelit dan parameter cuaca.
          </p>
        </div>

        {/* Map Visualization */}
        <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl relative overflow-hidden bg-slate-950 border border-white/10 transition-all duration-1000 flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-25 mix-blend-overlay"></div>
          
          {/* Radial Gradient overlay centered at pin dynamic location */}
          <div 
            id="temperatureLayer"
            className="absolute inset-0 transition-all duration-500"
            style={{
              background: `radial-gradient(circle at ${pinLeft}% ${pinTop}%, ${color}66 0%, ${color}11 25%, transparent 50%)`
            }}
          ></div>

          {/* Location Pin */}
          <div 
            id="locationPin"
            className="absolute w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-all duration-500 z-10 cursor-pointer"
            style={{
              left: `${pinLeft}%`,
              top: `${pinTop}%`,
              backgroundColor: color,
              transform: "translate(-50%, -50%)",
              boxShadow: `0 0 15px ${color}`
            }}
          >
            <span className="w-2 h-2 bg-white rounded-full"></span>
          </div>

          <div className="relative z-20 glass-panel-elevated p-6 rounded-2xl flex flex-col items-center gap-2 backdrop-blur-md">
            <span className="material-symbols-outlined text-5xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse">
              {temp < 15 ? 'ac_unit' : temp > 28 ? 'light_mode' : 'partly_cloudy_day'}
            </span>
            <div className="text-4xl font-display-lg text-white font-bold">{temp}°C</div>
            <div className="text-sm font-label-md text-primary-fixed uppercase tracking-wider">
              Gradasi Citra: {colorName}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="font-headline-md text-white">Variabel Geografis</h3>
            <button 
              onClick={sendToWorksheet} 
              className="px-4 py-1.5 rounded-lg text-sm bg-primary-container/20 text-primary-fixed border border-primary-container/50 hover:bg-primary-container/30 transition-all font-label-md cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-[0_0_10px_rgba(0,242,255,0.2)]"
            >
              <span className="material-symbols-outlined text-sm">send</span> Kirim ke LKPD
            </button>
          </div>
          
          {successMsg && (
            <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10 text-green-400 font-body-md text-sm flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>{successMsg}</span>
              <a href="/worksheet" className="underline ml-auto font-label-md hover:text-white transition-colors">
                Buka LKPD &rarr;
              </a>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Elevasi */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <label className="font-label-md text-primary-fixed flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">landscape</span> Elevasi
                </label>
                <span className="font-mono text-white text-sm bg-surface-container-high px-2 py-1 rounded">
                  {elevation} mdpl
                </span>
              </div>
              <input 
                type="range" min="0" max="4000" step="100" 
                value={elevation} onChange={(e) => setElevation(Number(e.target.value))}
                className="w-full accent-primary-fixed h-2 bg-surface-container-highest rounded-lg cursor-pointer relative z-20"
              />
            </div>

            {/* Lintang */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <label className="font-label-md text-secondary-fixed flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">explore</span> Lintang (Utara/Selatan)
                </label>
                <span className="font-mono text-white text-sm bg-surface-container-high px-2 py-1 rounded">
                  {latitude}°
                </span>
              </div>
              <input 
                type="range" min="-90" max="90" step="1" 
                value={latitude} onChange={(e) => setLatitude(Number(e.target.value))}
                className="w-full accent-secondary-fixed h-2 bg-surface-container-highest rounded-lg cursor-pointer relative z-20"
              />
            </div>

            {/* Jarak dari Laut */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <label className="font-label-md text-tertiary-fixed-dim flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">water</span> Jarak dari Laut
                </label>
                <span className="font-mono text-white text-sm bg-surface-container-high px-2 py-1 rounded">
                  {distance} km
                </span>
              </div>
              <input 
                type="range" min="0" max="1000" step="10" 
                value={distance} onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-tertiary-fixed-dim h-2 bg-surface-container-highest rounded-lg cursor-pointer relative z-20"
              />
            </div>

            {/* Tutupan Lahan */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <label className="font-label-md text-green-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">forest</span> Tutupan Lahan (Green Cover)
                </label>
                <span className="font-mono text-white text-sm bg-surface-container-high px-2 py-1 rounded">
                  {greenCover}%
                </span>
              </div>
              <input 
                type="range" min="0" max="100" step="5" 
                value={greenCover} onChange={(e) => setGreenCover(Number(e.target.value))}
                className="w-full accent-green-400 h-2 bg-surface-container-highest rounded-lg cursor-pointer relative z-20"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Instructional Factor Analysis */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
          <h3 className="font-headline-md text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <span className="material-symbols-outlined text-primary-container">psychology</span>
            Analisis Bukti Spasial
          </h3>
          <div className="flex flex-col gap-3 font-body-md text-sm text-on-surface-variant">
            <p>
              <strong className="text-white">Faktor Dominan:</strong>{" "}
              <span id="dominantFactor" className="text-primary-fixed">{dominant}</span>
            </p>
            <p>
              <strong className="text-white">Penjelasan Spasial-Geografis:</strong>{" "}
              <span id="spatialExplanation" className="text-on-surface-variant leading-relaxed">
                {explanation}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Widgets */}
      <div className="xl:w-[320px] flex flex-col gap-4">
        {/* Temperature Box */}
        <div className="glass-panel-elevated p-5 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/10 rounded-full blur-3xl group-hover:bg-primary-fixed/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="font-label-md text-on-surface-variant flex items-center gap-2 uppercase tracking-wider text-xs">
              <span className="material-symbols-outlined text-primary-fixed text-sm">thermostat</span>
              Temperatur (T)
            </h3>
          </div>
          <div className="flex items-end gap-2 relative z-10">
            <span className="font-display-lg text-4xl text-white font-bold">{temp}</span>
            <span className="text-primary-fixed-dim font-label-md mb-1">°C</span>
          </div>
        </div>

        {/* Humidity Box */}
        <div className="glass-panel-elevated p-5 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed/10 rounded-full blur-3xl group-hover:bg-secondary-fixed/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="font-label-md text-on-surface-variant flex items-center gap-2 uppercase tracking-wider text-xs">
              <span className="material-symbols-outlined text-secondary-fixed text-sm">humidity_percentage</span>
              Kelembapan (RH)
            </h3>
          </div>
          <div className="flex items-end gap-2 relative z-10">
            <span className="font-display-lg text-4xl text-white font-bold">{humidity}</span>
            <span className="text-secondary-fixed-dim font-label-md mb-1">%</span>
          </div>
        </div>

        {/* Wind Box */}
        <div className="glass-panel-elevated p-5 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-fixed-dim/10 rounded-full blur-3xl group-hover:bg-tertiary-fixed-dim/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="font-label-md text-on-surface-variant flex items-center gap-2 uppercase tracking-wider text-xs">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-sm">air</span>
              Kecepatan Angin
            </h3>
          </div>
          <div className="flex items-end gap-2 relative z-10">
            <span className="font-display-lg text-4xl text-white font-bold">{wind}</span>
            <span className="text-tertiary-fixed-dim font-label-md mb-1">km/h</span>
          </div>
        </div>

        {/* Pressure Box */}
        <div className="glass-panel-elevated p-5 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="font-label-md text-on-surface-variant flex items-center gap-2 uppercase tracking-wider text-xs">
              <span className="material-symbols-outlined text-white/50 text-sm">compress</span>
              Tekanan Udara
            </h3>
          </div>
          <div className="flex items-end gap-2 relative z-10">
            <span className="font-display-lg text-4xl text-white font-bold">{pressure}</span>
            <span className="text-white/50 font-label-md mb-1">hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
