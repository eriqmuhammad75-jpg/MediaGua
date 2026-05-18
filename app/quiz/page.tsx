"use client";

import { useState, useEffect } from "react";

const quizQuestions = [
  {
    id: 1,
    question: "Berdasarkan simulasi, apa yang terjadi pada suhu jika elevasi ditingkatkan dari 0 mdpl ke 1000 mdpl (dengan lintang dan jarak laut tetap)?",
    options: {
      a: "Suhu meningkat drastis.",
      b: "Suhu menurun karena tekanan udara berkurang.",
      c: "Suhu tetap karena jarak laut tidak berubah."
    },
    answer: "b"
  },
  {
    id: 2,
    question: "Wilayah mana yang kemungkinan memiliki fluktuasi suhu paling ekstrem antara siang dan malam?",
    options: {
      a: "Pesisir khatulistiwa yang lembap.",
      b: "Pegunungan tinggi di dekat laut.",
      c: "Daerah pedalaman/gurun pasir yang jauh dari laut."
    },
    answer: "c"
  },
  {
    id: 3,
    question: "Data citra suhu seringkali menunjukkan warna merah pekat (panas) di daerah perkotaan padat dibandingkan desa sekitarnya. Fenomena ini biasa dikaitkan dengan:",
    options: {
      a: "El Nino.",
      b: "Urban Heat Island (Pulau Panas Perkotaan).",
      c: "Angin Fohn."
    },
    answer: "b"
  },
  {
    id: 4,
    question: "Setiap kenaikan 100 meter elevasi, suhu udara rata-rata turun sekitar:",
    options: {
      a: "0.1°C",
      b: "0.6°C (Lapse Rate normal)",
      c: "2.0°C"
    },
    answer: "b"
  },
  {
    id: 5,
    question: "Mengapa daerah pesisir cenderung memiliki kelembapan udara yang lebih tinggi dibandingkan daerah pedalaman?",
    options: {
      a: "Karena suhu pesisir selalu lebih rendah.",
      b: "Karena evaporasi air laut menambah kadar uap air di atmosfer.",
      c: "Karena angin darat membawa udara kering ke pesisir."
    },
    answer: "b"
  },
  {
    id: 6,
    question: "Kota Batu (±800 mdpl) dan Kota Surabaya (±5 mdpl) berada di Jawa Timur. Berdasarkan konsep atmosfer, pernyataan mana yang paling tepat?",
    options: {
      a: "Suhu Batu lebih tinggi karena lebih dekat dengan matahari.",
      b: "Suhu Batu lebih rendah karena tekanan udara yang lebih rendah pada elevasi tinggi.",
      c: "Suhu kedua kota sama karena berada di provinsi yang sama."
    },
    answer: "b"
  },
  {
    id: 7,
    question: "Lapisan atmosfer yang paling dekat dengan permukaan bumi dan tempat terjadinya cuaca adalah:",
    options: {
      a: "Stratosfer.",
      b: "Mesosfer.",
      c: "Troposfer."
    },
    answer: "c"
  },
  {
    id: 8,
    question: "Apa fungsi utama lapisan ozon (O₃) yang terdapat di stratosfer?",
    options: {
      a: "Menyerap radiasi ultraviolet (UV) berbahaya dari matahari.",
      b: "Menghasilkan oksigen untuk makhluk hidup.",
      c: "Memantulkan sinyal radio untuk komunikasi."
    },
    answer: "a"
  },
  {
    id: 9,
    question: "Angin laut terjadi pada siang hari karena:",
    options: {
      a: "Daratan lebih cepat panas daripada laut, sehingga udara di darat naik dan udara dari laut bergerak menggantikan.",
      b: "Laut lebih cepat panas daripada daratan, sehingga udara di laut naik.",
      c: "Rotasi bumi mendorong angin dari laut ke darat pada siang hari."
    },
    answer: "a"
  },
  {
    id: 10,
    question: "Jika tekanan udara di suatu wilayah pegunungan tercatat sangat rendah (misalnya 700 hPa), apa dampaknya bagi manusia?",
    options: {
      a: "Manusia merasa lebih berenergi karena udara lebih ringan.",
      b: "Kadar oksigen berkurang sehingga dapat menyebabkan sesak napas (hipoksia).",
      c: "Tidak ada dampak karena manusia beradaptasi secara instan."
    },
    answer: "b"
  }
];

export default function Quiz() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const savedAnswers = localStorage.getItem("atmosferQuizAnswers");
      const savedScore = localStorage.getItem("atmosferQuizScore");
      if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
      if (savedScore) setScore(Number(savedScore));
      setIsClient(true);
    }, 0);
  }, []);

  const handleOptionChange = (questionId: number, optionId: string) => {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);
    if (isClient) {
      localStorage.setItem("atmosferQuizAnswers", JSON.stringify(newAnswers));
      // Clear score if they change an answer after submitting
      if (score !== null) {
        setScore(null);
        localStorage.removeItem("atmosferQuizScore");
      }
    }
  };

  const submitQuiz = () => {
    let currentScore = 0;
    quizQuestions.forEach(q => {
      if (answers[q.id] === q.answer) {
        currentScore += 10; // 10 questions × 10 points = 100
      }
    });

    setScore(currentScore);
    if (isClient) {
      localStorage.setItem("atmosferQuizScore", currentScore.toString());
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setScore(null);
    if (isClient) {
      localStorage.removeItem("atmosferQuizAnswers");
      localStorage.removeItem("atmosferQuizScore");
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hydration handled safely via useEffect

  return (
    <div className="flex flex-col gap-6 h-full pb-20 md:pb-0">
      <div>
        <h2 className="font-headline-lg text-headline-md text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-fixed">quiz</span>
          Kuis Interpretasi Atmosfer
        </h2>
        <p className="font-body-md text-on-surface-variant mt-1">Uji pemahaman spasial Anda terkait dinamika atmosfer.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {quizQuestions.map((q, index) => (
            <div key={q.id} className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary-container opacity-50"></div>
              <h3 className="font-headline-md text-white text-lg ml-2">
                <span className="text-primary-fixed mr-2">{index + 1}.</span> {q.question}
              </h3>
              <div className="flex flex-col gap-3 ml-2">
                {Object.entries(q.options).map(([optId, optText]) => {
                  const isSelected = answers[q.id] === optId;
                  const showResult = score !== null;
                  const isCorrectAnswer = q.answer === optId;
                  const isWrongAnswer = isSelected && !isCorrectAnswer;

                  let borderClass = "border-white/10";
                  if (isSelected) borderClass = "border-primary-fixed/50 bg-primary-fixed/10";
                  if (showResult) {
                    if (isCorrectAnswer) borderClass = "border-green-500/50 bg-green-500/10";
                    if (isWrongAnswer) borderClass = "border-red-500/50 bg-red-500/10";
                  }

                  return (
                    <label 
                      key={optId} 
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${borderClass} hover:bg-white/5`}
                    >
                      <input 
                        type="radio" 
                        name={`question-${q.id}`} 
                        value={optId}
                        checked={isSelected}
                        onChange={() => handleOptionChange(q.id, optId)}
                        disabled={showResult}
                        className="w-4 h-4 text-primary-fixed accent-primary-fixed bg-surface-container-highest border-white/20"
                      />
                      <span className="text-on-surface-variant font-body-md">
                        <strong className="text-white uppercase mr-1">{optId}.</strong> {optText}
                      </span>
                      {showResult && isCorrectAnswer && <span className="material-symbols-outlined text-green-400 ml-auto">check_circle</span>}
                      {showResult && isWrongAnswer && <span className="material-symbols-outlined text-red-400 ml-auto">cancel</span>}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex gap-4">
            {score === null ? (
              <button 
                onClick={submitQuiz}
                disabled={Object.keys(answers).length !== quizQuestions.length}
                className="px-6 py-3 rounded-xl font-label-md text-label-md text-surface-dim bg-gradient-to-r from-primary-container to-primary-fixed shadow-[0_0_15px_rgba(0,242,255,0.3)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kirim Jawaban
              </button>
            ) : (
              <button 
                onClick={resetQuiz}
                className="px-6 py-3 rounded-xl font-label-md text-label-md text-white bg-surface-container-highest border border-white/10 hover:bg-white/5 transition-colors"
              >
                Ulangi Kuis
              </button>
            )}
          </div>
        </div>

        {/* Right Col: Rubric & Score */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center">
            <h3 className="font-headline-md text-white mb-2">Skor Anda</h3>
            <div className="text-6xl font-display-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-fixed to-secondary-fixed mb-4 inline-block drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]">
              {score !== null ? score : "-"}
            </div>
            {score !== null && (
              <p className="font-label-md text-primary-fixed bg-primary-fixed/10 py-2 rounded-lg">
                {score >= 60 ? "Lulus Kompetensi" : "Perlu Pengayaan"}
              </p>
            )}
            <p className="text-xs text-on-surface-variant italic mt-4">Tersimpan otomatis di peramban.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="font-headline-md text-white border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">fact_check</span>
              Rubrik Penilaian
            </h3>
            <ul className="flex flex-col gap-3 font-body-md text-sm text-on-surface-variant">
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-green-400 text-base">check_circle</span>
                <span>Jawaban Benar: +10 Poin. Menunjukkan pemahaman spasial yang kuat.</span>
              </li>
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-red-400 text-base">cancel</span>
                <span>Jawaban Salah: +0 Poin. Perlu meninjau ulang konsep dan faktor geografis di menu Materi.</span>
              </li>
              <li className="flex gap-2">
                <span className="material-symbols-outlined text-primary-fixed text-base">info</span>
                <span>Batas kelulusan adalah 60 poin.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
