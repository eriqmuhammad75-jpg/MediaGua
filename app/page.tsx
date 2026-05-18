"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("konsep");

  return (
    <div className="flex flex-col gap-6 h-full pb-20 md:pb-0">
      {/* Hero Section (Beranda) */}
      <div className="glass-panel rounded-2xl p-6 lg:p-10 relative overflow-hidden flex flex-col border border-white/10 gradient-border-top-left">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20 mix-blend-screen pointer-events-none"></div>
        <div className="relative z-10 flex flex-col gap-4">
          <p className="font-label-md text-primary-fixed uppercase tracking-widest text-sm doodle-underline self-start">
            Geografi Kelas X | Fase E
          </p>
          <h1 className="font-display-lg text-display-lg text-white max-w-3xl glow-text mt-2">
            Laboratorium Atmosfer Berbasis Lokasi
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-4">
            Media ini mengubah modul atmosfer menjadi ruang belajar interaktif: siswa membaca peta suhu, membandingkan pesisir dan dataran tinggi, menafsirkan data cuaca, lalu menyusun bukti spasial dalam LKPD.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <a href="/simulator" className="px-6 py-3 rounded-xl font-label-md text-label-md text-surface-dim bg-gradient-to-r from-primary-container to-primary-fixed shadow-[0_0_15px_rgba(0,242,255,0.3)] hover:opacity-90 transition-opacity">
              Mulai Simulasi
            </a>
            <a href="/legacy/assets/modul-ajar-deep-learning-basis-spasial.pdf" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-xl font-label-md text-label-md text-primary-fixed border border-primary-fixed/30 hover:bg-primary-fixed/10 transition-colors glass-card">
              Buka Modul PDF
            </a>
          </div>
        </div>
      </div>

      {/* Learning Outcomes Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel-elevated p-5 rounded-xl border border-white/10 flex flex-col gap-2">
          <span className="text-primary-fixed font-display-lg text-3xl opacity-50">01</span>
          <strong className="text-white font-headline-md text-xl">Analisis geografis</strong>
          <p className="text-on-surface-variant font-body-md text-sm">Hubungkan suhu dan kelembapan dengan elevasi, lintang, dan jarak dari laut.</p>
        </div>
        <div className="glass-panel-elevated p-5 rounded-xl border border-white/10 flex flex-col gap-2">
          <span className="text-secondary-fixed font-display-lg text-3xl opacity-50">02</span>
          <strong className="text-white font-headline-md text-xl">Interpretasi data</strong>
          <p className="text-on-surface-variant font-body-md text-sm">Baca peta tematik, grafik sederhana, dan citra cuaca secara kritis.</p>
        </div>
        <div className="glass-panel-elevated p-5 rounded-xl border border-white/10 flex flex-col gap-2">
          <span className="text-tertiary-fixed-dim font-display-lg text-3xl opacity-50">03</span>
          <strong className="text-white font-headline-md text-xl">Visual berbasis lokasi</strong>
          <p className="text-on-surface-variant font-body-md text-sm">Sajikan temuan dalam bentuk peta, screenshot beranotasi, atau infografis.</p>
        </div>
      </div>

      {/* Materi Section */}
      <div className="glass-panel rounded-2xl p-6 lg:p-8 flex flex-col gap-6 border border-white/10">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">menu_book</span>
            Materi Inti
          </h2>
          <p className="text-on-surface-variant font-body-md mt-2 max-w-3xl">
            Fokus pembelajaran adalah memahami dinamika atmosfer melalui bukti lokasi: warna citra suhu, pola angin, kelembapan, elevasi, lintang, dan jarak dari laut.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2" style={{ scrollbarWidth: "none" }}>
          {["konsep", "faktor", "deep", "digital"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full font-label-md text-sm whitespace-nowrap transition-all cursor-pointer relative z-20 ${activeTab === tab
                ? "bg-primary-container/20 border border-primary-container/50 text-primary-fixed shadow-[0_0_10px_rgba(0,242,255,0.2)]"
                : "bg-surface/40 border border-white/10 text-on-surface-variant hover:text-white"
                }`}
            >
              {tab === "konsep" && "Konsep"}
              {tab === "faktor" && "Faktor Geografis"}
              {tab === "deep" && "Deep Learning"}
              {tab === "digital" && "Data Digital"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px] mt-4">
          {activeTab === "konsep" && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-white mb-3">Konsep atmosfer yang dipelajari</h3>
              <p className="text-on-surface-variant mb-4">
                Atmosfer dipahami melalui komposisi, struktur lapisan, unsur cuaca dan iklim, serta dampak aktivitas manusia seperti pemanasan global dan perubahan iklim.
              </p>
              <ul className="list-disc pl-5 text-on-surface-variant flex flex-col gap-2">
                <li><strong className="text-primary-fixed font-medium">Konseptual:</strong> definisi atmosfer, lapisan atmosfer, cuaca, iklim, dan faktor pengendali iklim.</li>
                <li><strong className="text-primary-fixed font-medium">Prosedural:</strong> membaca data cuaca sederhana, citra satelit, dan peta tematik.</li>
                <li><strong className="text-primary-fixed font-medium">Metakognitif:</strong> menyadari peran atmosfer bagi kehidupan dan tanggung jawab lingkungan.</li>
              </ul>
            </div>
          )}

          {activeTab === "faktor" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-300">
              <div className="glass-panel-elevated p-4 rounded-xl border-l-4 border-primary-container">
                <h3 className="text-white font-bold mb-1">Elevasi</h3>
                <p className="text-on-surface-variant text-sm">Semakin tinggi suatu tempat, suhu cenderung menurun karena kerapatan udara dan tekanan berubah.</p>
              </div>
              <div className="glass-panel-elevated p-4 rounded-xl border-l-4 border-secondary-container">
                <h3 className="text-white font-bold mb-1">Lintang</h3>
                <p className="text-on-surface-variant text-sm">Perbedaan lintang memengaruhi sudut datang sinar matahari dan intensitas pemanasan.</p>
              </div>
              <div className="glass-panel-elevated p-4 rounded-xl border-l-4 border-tertiary-fixed-dim">
                <h3 className="text-white font-bold mb-1">Kedekatan Laut</h3>
                <p className="text-on-surface-variant text-sm">Pesisir memiliki pengaruh angin laut dan kelembapan yang berbeda dari wilayah pedalaman.</p>
              </div>
              <div className="glass-panel-elevated p-4 rounded-xl border-l-4 border-error">
                <h3 className="text-white font-bold mb-1">Tutupan Lahan</h3>
                <p className="text-on-surface-variant text-sm">Permukiman padat, vegetasi, dan badan air dapat mengubah pola suhu lokal.</p>
              </div>
            </div>
          )}

          {activeTab === "deep" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-300">
              <div className="glass-panel-elevated p-4 rounded-xl border border-white/10 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-primary-fixed text-4xl mb-2">psychology</span>
                <h3 className="text-white font-bold mb-1">Bermakna</h3>
                <p className="text-on-surface-variant text-sm">Konsep dihubungkan dengan pengalaman harian seperti panas pesisir, hujan lebat, dan udara pegunungan.</p>
              </div>
              <div className="glass-panel-elevated p-4 rounded-xl border border-white/10 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-secondary-fixed text-4xl mb-2">celebration</span>
                <h3 className="text-white font-bold mb-1">Menyenangkan</h3>
                <p className="text-on-surface-variant text-sm">Siswa mengeksplorasi visualisasi cuaca, diskusi kelompok, dan peta tematik yang hidup.</p>
              </div>
              <div className="glass-panel-elevated p-4 rounded-xl border border-white/10 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-4xl mb-2">self_improvement</span>
                <h3 className="text-white font-bold mb-1">Reflektif</h3>
                <p className="text-on-surface-variant text-sm">Siswa melihat atmosfer sebagai sistem: perubahan suhu dapat memengaruhi tekanan, angin, dan hujan.</p>
              </div>
            </div>
          )}

          {activeTab === "digital" && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-300">
              <a href="https://zoom.earth/" target="_blank" rel="noreferrer" className="glass-panel-elevated p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors group">
                <div>
                  <h3 className="text-primary-fixed font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">travel_explore</span> Zoom Earth
                  </h3>
                  <p className="text-on-surface-variant text-sm mt-1">Layer temperature, wind, humidity, dan rain.</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-fixed transition-colors">open_in_new</span>
              </a>
              <a href="https://earth.google.com/" target="_blank" rel="noreferrer" className="glass-panel-elevated p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors group">
                <div>
                  <h3 className="text-secondary-fixed font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">public</span> Google Earth
                  </h3>
                  <p className="text-on-surface-variant text-sm mt-1">Elevasi, koordinat, jarak lokasi, dan pengamatan visual.</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-secondary-fixed transition-colors">open_in_new</span>
              </a>
              <a href="https://www.bmkg.go.id/" target="_blank" rel="noreferrer" className="glass-panel-elevated p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors group">
                <div>
                  <h3 className="text-tertiary-fixed-dim font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">cloudy_snowing</span> BMKG
                  </h3>
                  <p className="text-on-surface-variant text-sm mt-1">Rujukan data cuaca dan iklim dari sumber nasional.</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-tertiary-fixed-dim transition-colors">open_in_new</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
