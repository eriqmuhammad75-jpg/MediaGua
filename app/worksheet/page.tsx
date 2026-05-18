"use client";

import { useState, useEffect } from "react";

interface WorksheetRow {
  id: string;
  lokasi: string;
  elevasi: string;
  lintang: string;
  jarakLaut: string;
  suhu: string;
  kelembapan: string;
}

const rubricItems = [
  {
    id: "interpretasi",
    title: "1. Interpretasi Peta dan Citra Satelit",
    desc: "Ketepatan membaca gradasi warna, layer suhu, angin, kelembapan, dan legenda peta.",
    options: [
      "Belum mampu mengekstraksi data keruangan secara mandiri.",
      "Interpretasi kurang presisi dan masih membutuhkan asistensi intensif.",
      "Cukup presisi, tetapi ada kekeliruan minor pada legenda.",
      "Sangat presisi dalam mengekstraksi dan menginterpretasi data atmosfer."
    ]
  },
  {
    id: "visual",
    title: "2. Penyajian Visual Berbasis Lokasi",
    desc: "Kejelasan screenshot, peta tematik, anotasi geografis, dan struktur informasi.",
    options: [
      "Tidak menyajikan output visual yang relevan.",
      "Visual parsial, minim anotasi, dan belum utuh.",
      "Visual cukup representatif namun tata letak informasi belum proporsional.",
      "Visual komprehensif, beranotasi, memuat legenda, dan sangat representatif."
    ]
  },
  {
    id: "argumentasi",
    title: "3. Argumentasi Akademik",
    desc: "Kemampuan menjelaskan hubungan sebab-akibat secara sistematis saat presentasi.",
    options: [
      "Tidak berpartisipasi aktif dalam presentasi.",
      "Artikulasi kurang terstruktur dan pasif merespons pertanyaan.",
      "Artikulasi sistematis, tetapi masih bergantung pada catatan.",
      "Argumentasi komprehensif, sistematis, rasional, dan berbasis bukti spasial."
    ]
  }
];

export default function Worksheet() {
  const [rows, setRows] = useState<WorksheetRow[]>([]);
  const [concern, setConcern] = useState("");
  const [habit, setHabit] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Self-assessment rubric states
  const [rubric, setRubric] = useState<Record<string, number>>({
    interpretasi: 3, // Default is 3 points as in legacy (index 2 checked)
    visual: 3,
    argumentasi: 3
  });

  // Form states
  const [lokasi, setLokasi] = useState("");
  const [elevasi, setElevasi] = useState("");
  const [lintang, setLintang] = useState("");
  const [jarakLaut, setJarakLaut] = useState("");
  const [suhu, setSuhu] = useState("");
  const [kelembapan, setKelembapan] = useState("");

  // Safe client load to resolve cascading renders in Next.js
  useEffect(() => {
    setTimeout(() => {
      const savedRows = localStorage.getItem("atmosferWorksheet");
      if (savedRows) setRows(JSON.parse(savedRows));
      
      setConcern(localStorage.getItem("reflectionConcern") || "");
      setHabit(localStorage.getItem("reflectionHabit") || "");

      const savedRubric = localStorage.getItem("atmosferRubricScore");
      if (savedRubric) setRubric(JSON.parse(savedRubric));

      setIsClient(true);
    }, 0);
  }, []);

  // Autosave when states change, gated by isClient mount check
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("atmosferWorksheet", JSON.stringify(rows));
      localStorage.setItem("reflectionConcern", concern);
      localStorage.setItem("reflectionHabit", habit);
      localStorage.setItem("atmosferRubricScore", JSON.stringify(rubric));
    }
  }, [rows, concern, habit, rubric, isClient]);

  const addRow = () => {
    if (!lokasi || !elevasi || !lintang || !jarakLaut || !suhu || !kelembapan) {
      alert("Mohon isi semua data sebelum menambah baris!");
      return;
    }
    const newRow = {
      id: Date.now().toString(),
      lokasi, elevasi, lintang, jarakLaut, suhu, kelembapan
    };
    setRows([...rows, newRow]);
    
    // Clear form inputs
    setLokasi(""); 
    setElevasi(""); 
    setLintang(""); 
    setJarakLaut(""); 
    setSuhu(""); 
    setKelembapan("");
  };

  const clearAllData = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua data LKPD, Refleksi, dan Penilaian Mandiri?")) {
      setRows([]);
      setConcern("");
      setHabit("");
      setRubric({
        interpretasi: 3,
        visual: 3,
        argumentasi: 3
      });
    }
  };

  // Pure derived rubric scores and feedback calculated directly in render
  const totalRubricScore = (rubric.interpretasi || 0) + (rubric.visual || 0) + (rubric.argumentasi || 0);

  let rubricFeedback = "Perlu pendampingan pada pembacaan data dan penyajian visual.";
  if (totalRubricScore >= 11) {
    rubricFeedback = "Sangat baik. Interpretasi, visual, dan argumentasi sudah kuat.";
  } else if (totalRubricScore >= 8) {
    rubricFeedback = "Kinerja baik. Perkuat ketepatan legenda dan bukti lokasi.";
  } else if (totalRubricScore >= 5) {
    rubricFeedback = "Cukup. Tambahkan anotasi, cek legenda, dan latih argumentasi sebab-akibat.";
  }

  return (
    <div className="flex flex-col gap-6 h-full pb-20 md:pb-0">
      <div>
        <h2 className="font-headline-lg text-headline-md text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-fixed">dataset</span>
          LKPD Digital & Refleksi
        </h2>
        <p className="font-body-md text-on-surface-variant mt-1">
          Catat hasil pengamatan bukti spasial dari simulator dan lakukan refleksi diri mandiri.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: LKPD Form & Table */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h3 className="font-headline-md text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">table_chart</span>
              Data Bukti Spasial
            </h3>
            <button 
              onClick={clearAllData} 
              className="px-4 py-2 rounded-lg bg-error-container/20 text-error hover:bg-error-container/40 transition-colors font-label-md text-sm border border-error/30 cursor-pointer"
            >
              Hapus Semua Data
            </button>
          </div>

          {/* Form */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-label-md text-on-surface-variant mb-1">Nama Lokasi</label>
              <input 
                value={lokasi} 
                onChange={(e) => setLokasi(e.target.value)} 
                type="text" 
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-white font-body-md focus:border-primary-container focus:outline-none" 
                placeholder="Misal: Pantai Kuta" 
              />
            </div>
            <div>
              <label className="block text-xs font-label-md text-on-surface-variant mb-1">Elevasi (mdpl)</label>
              <input 
                value={elevasi} 
                onChange={(e) => setElevasi(e.target.value)} 
                type="number" 
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-white font-body-md focus:border-primary-container focus:outline-none" 
                placeholder="0" 
              />
            </div>
            <div>
              <label className="block text-xs font-label-md text-on-surface-variant mb-1">Lintang (°)</label>
              <input 
                value={lintang} 
                onChange={(e) => setLintang(e.target.value)} 
                type="number" 
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-white font-body-md focus:border-primary-container focus:outline-none" 
                placeholder="-8" 
              />
            </div>
            <div>
              <label className="block text-xs font-label-md text-on-surface-variant mb-1">Jarak Laut (km)</label>
              <input 
                value={jarakLaut} 
                onChange={(e) => setJarakLaut(e.target.value)} 
                type="number" 
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-white font-body-md focus:border-primary-container focus:outline-none" 
                placeholder="2" 
              />
            </div>
            <div>
              <label className="block text-xs font-label-md text-on-surface-variant mb-1">Suhu (°C)</label>
              <input 
                value={suhu} 
                onChange={(e) => setSuhu(e.target.value)} 
                type="number" 
                step="0.1"
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-white font-body-md focus:border-primary-container focus:outline-none" 
                placeholder="30.5" 
              />
            </div>
            <div>
              <label className="block text-xs font-label-md text-on-surface-variant mb-1">Kelembapan (%)</label>
              <input 
                value={kelembapan} 
                onChange={(e) => setKelembapan(e.target.value)} 
                type="number" 
                className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-2 text-white font-body-md focus:border-primary-container focus:outline-none" 
                placeholder="85" 
              />
            </div>
            <div className="col-span-2 md:col-span-3">
              <button 
                onClick={addRow} 
                className="w-full py-2 bg-primary-container/20 text-primary-fixed border border-primary-container/50 rounded-lg hover:bg-primary-container/30 transition-all font-label-md cursor-pointer active:scale-[0.99]"
              >
                + Tambah Baris Bukti Spasial
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-4 rounded-xl border border-white/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/50 text-on-surface-variant font-label-md text-sm">
                  <th className="p-3 border-b border-white/10">Lokasi / Skenario</th>
                  <th className="p-3 border-b border-white/10">Elevasi</th>
                  <th className="p-3 border-b border-white/10">Lintang</th>
                  <th className="p-3 border-b border-white/10">Jarak Laut</th>
                  <th className="p-3 border-b border-white/10">Suhu</th>
                  <th className="p-3 border-b border-white/10">Kelembapan</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-on-surface-variant italic font-body-md">
                      Belum ada data dicatat. Anda bisa menambahkan data di atas atau mengirim data dari menu Simulasi.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="text-white border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-3 font-medium text-xs md:text-sm max-w-[200px] truncate" title={row.lokasi}>
                        {row.lokasi}
                      </td>
                      <td className="p-3 text-xs md:text-sm">{row.elevasi} mdpl</td>
                      <td className="p-3 text-xs md:text-sm">{row.lintang}°</td>
                      <td className="p-3 text-xs md:text-sm">{row.jarakLaut} km</td>
                      <td className="p-3 text-xs md:text-sm text-primary-fixed font-bold">{row.suhu}°C</td>
                      <td className="p-3 text-xs md:text-sm text-secondary-fixed-dim font-bold">{row.kelembapan}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Refleksi & Self-Assessment Rubrics */}
        <div className="flex flex-col gap-6">
          {/* Refleksi Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
            <h3 className="font-headline-md text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">self_improvement</span>
              Refleksi Mindful
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-label-md text-primary-fixed">
                  Apa satu hal tentang atmosfer yang paling membuatmu peduli (concern) pada lingkungan?
                </label>
                <textarea 
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  className="w-full bg-surface-container-highest border border-white/10 rounded-xl p-3 text-white font-body-md min-h-[100px] focus:border-primary-container focus:outline-none resize-y text-sm"
                  placeholder="Tuliskan refleksimu di sini..."
                ></textarea>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-label-md text-secondary-fixed">
                  Kebiasaan apa yang bisa kamu ubah untuk mengurangi dampak negatif pada atmosfer?
                </label>
                <textarea 
                  value={habit}
                  onChange={(e) => setHabit(e.target.value)}
                  className="w-full bg-surface-container-highest border border-white/10 rounded-xl p-3 text-white font-body-md min-h-[100px] focus:border-secondary-fixed focus:outline-none resize-y text-sm"
                  placeholder="Tuliskan rencanamu di sini..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Self-Assessment Rubric Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-6">
            <h3 className="font-headline-md text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <span className="material-symbols-outlined text-primary-container">fact_check</span>
              Rubrik Penilaian Mandiri
            </h3>
            
            <div className="flex flex-col gap-6">
              {rubricItems.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
                  <h4 className="font-label-md text-primary-fixed text-sm">{item.title}</h4>
                  <p className="text-xs text-on-surface-variant mb-2 leading-relaxed">{item.desc}</p>
                  
                  <div className="flex flex-col gap-2">
                    {item.options.map((opt, idx) => {
                      const scoreVal = idx + 1;
                      const isChecked = rubric[item.id] === scoreVal;
                      return (
                        <label 
                          key={opt}
                          className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                            isChecked 
                              ? "border-primary-fixed/40 bg-primary-fixed/5" 
                              : "border-white/5 bg-surface/20 hover:bg-white/5"
                          }`}
                        >
                          <input 
                            type="radio" 
                            name={`rubric-${item.id}`}
                            value={scoreVal}
                            checked={isChecked}
                            onChange={() => {
                              setRubric({ ...rubric, [item.id]: scoreVal });
                            }}
                            className="w-3.5 h-3.5 mt-0.5 text-primary-fixed accent-primary-fixed cursor-pointer"
                          />
                          <span className="text-on-surface-variant font-body-md">
                            <strong className="text-white uppercase mr-1">{scoreVal}.</strong> {opt}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Score and Dynamic qualitative Feedback display */}
              <div className="mt-2 glass-panel-elevated p-4 rounded-xl border border-white/10 text-center flex flex-col gap-2 backdrop-blur-md">
                <h4 className="text-xs font-label-md text-on-surface-variant uppercase tracking-widest">
                  Estimasi Skor Kinerja
                </h4>
                <div className="text-3xl font-display-lg font-bold text-primary-container drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]">
                  {totalRubricScore} / 12
                </div>
                <p className="text-xs text-on-surface-variant italic font-body-md leading-relaxed px-2">
                  &ldquo;{rubricFeedback}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
