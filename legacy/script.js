const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const worksheetDefaults = [
  {
    location: "Pesisir Utara Jawa Timur",
    elevation: "5 mdpl",
    temperature: "32-34 C",
    humidity: "Sedang-tinggi",
    distance: "0-5 km",
    factor: "Kedekatan laut dan elevasi rendah",
    conclusion: "Warna citra cenderung merah karena wilayah rendah menerima pemanasan kuat."
  },
  {
    location: "Kota Batu",
    elevation: "900-1200 mdpl",
    temperature: "18-21 C",
    humidity: "Tinggi",
    distance: "50-70 km",
    factor: "Elevasi/topografi",
    conclusion: "Suhu lebih rendah dan peluang kondensasi meningkat karena udara naik di wilayah pegunungan."
  },
  {
    location: "Wilayah sekolah",
    elevation: "",
    temperature: "",
    humidity: "",
    distance: "",
    factor: "",
    conclusion: ""
  }
];

const quizQuestions = [
  {
    prompt:
      "Titik A berada di pesisir utara dengan elevasi 5 mdpl dan suhu 32-34 C. Titik B berada di Kota Batu dengan elevasi 900-1200 mdpl dan suhu 18-21 C. Faktor determinan utama perbedaan citra suhu tersebut adalah...",
    options: [
      "Variasi letak astronomis yang memengaruhi sudut datang sinar matahari.",
      "Perbedaan topografi atau elevasi yang memengaruhi kerapatan molekul udara.",
      "Jarak relatif terhadap badan air yang menciptakan anomali kelembapan.",
      "Pergerakan angin pasat yang terpusat di kawasan pesisir ekuatorial."
    ],
    answer: 1
  },
  {
    prompt:
      "Jika layer suhu dan kelembapan dioverlay, hipotesis paling logis untuk Titik B pada sore hari adalah...",
    options: [
      "Titik B memiliki probabilitas kondensasi dan presipitasi orografis lebih tinggi akibat penurunan suhu secara adiabatik.",
      "Titik A berpotensi mengalami presipitasi orografis akibat tekanan udara yang berbanding terbalik dengan suhu.",
      "Laju evaporasi Titik B jauh melebihi Titik A karena lebih dekat dengan stratosfer.",
      "Kedua titik memiliki indikator curah hujan identik karena berada pada bujur wilayah waktu yang sama."
    ],
    answer: 0
  },
  {
    prompt: "Variabel spasial yang paling relevan untuk membandingkan kondisi atmosfer antar wilayah adalah...",
    options: [
      "Elevasi, lintang, kedekatan laut, dan tutupan lahan.",
      "Nama jalan, jumlah toko, dan jadwal pelajaran.",
      "Warna seragam, ukuran kelas, dan daftar hadir.",
      "Jenis kendaraan, merek ponsel, dan jumlah bangku."
    ],
    answer: 0
  },
  {
    prompt: "Contoh meaningful learning dalam pembelajaran atmosfer adalah...",
    options: [
      "Menghafal definisi atmosfer tanpa mengaitkannya dengan pengalaman siswa.",
      "Membandingkan suhu pesisir dan pegunungan yang pernah dirasakan siswa.",
      "Menyalin seluruh paragraf modul tanpa diskusi.",
      "Mengabaikan data cuaca karena dianggap terlalu teknis."
    ],
    answer: 1
  },
  {
    prompt: "Layer digital yang sesuai untuk investigasi atmosfer di Zoom Earth adalah...",
    options: [
      "Temperature, Wind, Humidity, dan Rain.",
      "Street View, Traffic, dan Store Rating.",
      "Population, Currency, dan Language.",
      "Building Name, Restaurant, dan Review."
    ],
    answer: 0
  },
  {
    prompt: "Output visual berbasis lokasi yang kuat sebaiknya memuat...",
    options: [
      "Screenshot atau peta tematik, anotasi lokasi, legenda variabel, dan kesimpulan penyebab.",
      "Gambar bebas tanpa keterangan lokasi.",
      "Teks panjang tanpa data visual.",
      "Hanya nama kelompok dan warna latar."
    ],
    answer: 0
  }
];

const rubricItems = [
  {
    id: "interpretasi",
    title: "Interpretasi Peta dan Citra Satelit",
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
    title: "Penyajian Visual Berbasis Lokasi",
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
    title: "Argumentasi Akademik",
    desc: "Kemampuan menjelaskan hubungan sebab-akibat secara sistematis saat presentasi.",
    options: [
      "Tidak berpartisipasi aktif dalam presentasi.",
      "Artikulasi kurang terstruktur dan pasif merespons pertanyaan.",
      "Artikulasi sistematis, tetapi masih bergantung pada catatan.",
      "Argumentasi komprehensif, sistematis, rasional, dan berbasis bukti spasial."
    ]
  }
];

function initTabs() {
  qsa(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const name = tab.dataset.tab;
      qsa(".tab").forEach((item) => {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      qsa(".tab-panel").forEach((panel) => {
        const active = panel.id === `panel-${name}`;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    });
  });
}

function computeAtmosphere() {
  const elevation = Number(qs("#elevation").value);
  const latitude = Number(qs("#latitude").value);
  const distance = Number(qs("#distance").value);
  const greenCover = Number(qs("#greenCover").value);

  const maritimeCooling = distance < 20 ? 1.2 : distance > 100 ? -0.8 : 0;
  const landHeat = (100 - greenCover) * 0.018;
  const temperature = clamp(34 - elevation * 0.0065 - latitude * 0.1 - maritimeCooling + landHeat, 12, 36);
  const humidity = clamp(84 - distance * 0.22 + elevation * 0.012 + greenCover * 0.08 - temperature * 0.22, 32, 96);
  const pinLeft = clamp(16 + distance * 0.34, 12, 80);
  const pinTop = clamp(72 - elevation * 0.035, 18, 74);

  let colorName = "Merah";
  let color = "#f16642";
  if (temperature < 21) {
    colorName = "Hijau-biru";
    color = "#4aa3c2";
  } else if (temperature < 27) {
    colorName = "Hijau-kuning";
    color = "#7fb66b";
  } else if (temperature < 31) {
    colorName = "Kuning-oranye";
    color = "#f3b63f";
  }

  let dominant = "Kedekatan laut dan tutupan lahan menjadi faktor penting pada skenario ini.";
  if (elevation >= 700) {
    dominant = "Elevasi menjadi faktor paling kuat pada skenario ini.";
  } else if (latitude >= 25) {
    dominant = "Lintang menjadi faktor paling kuat pada skenario ini.";
  } else if (distance <= 20) {
    dominant = "Kedekatan laut menjadi faktor paling kuat pada skenario ini.";
  }

  let explanation = "Wilayah rendah dan jauh dari vegetasi cenderung tampil lebih panas pada citra suhu.";
  if (elevation >= 700) {
    explanation =
      "Saat elevasi meningkat, suhu turun. Udara yang lebih sejuk dapat mendorong kondensasi, terutama pada lereng pegunungan.";
  } else if (distance <= 20) {
    explanation =
      "Wilayah pesisir dipengaruhi angin laut dan kelembapan. Suhu masih dapat tinggi jika elevasinya rendah dan tutupan lahan minim.";
  } else if (latitude >= 25) {
    explanation =
      "Semakin jauh dari ekuator, sudut datang sinar matahari berubah sehingga intensitas pemanasan cenderung menurun.";
  }

  return {
    elevation,
    latitude,
    distance,
    greenCover,
    temperature,
    humidity,
    pinLeft,
    pinTop,
    colorName,
    color,
    dominant,
    explanation
  };
}

function updateSimulator() {
  const data = computeAtmosphere();
  qs("#elevationValue").textContent = `${data.elevation} mdpl`;
  qs("#latitudeValue").textContent = `${data.latitude} LS`;
  qs("#distanceValue").textContent = `${data.distance} km`;
  qs("#greenValue").textContent = `${data.greenCover}%`;
  qs("#temperatureMetric").textContent = `${data.temperature.toFixed(1)} C`;
  qs("#humidityMetric").textContent = `${Math.round(data.humidity)}%`;
  qs("#colorMetric").textContent = data.colorName;
  qs("#dominantFactor").textContent = data.dominant;
  qs("#spatialExplanation").textContent = data.explanation;

  qs("#locationPin").style.left = `${data.pinLeft}%`;
  qs("#locationPin").style.top = `${data.pinTop}%`;
  qs("#locationPin").style.background = data.color;
  qs("#temperatureLayer").style.background = `radial-gradient(circle at ${data.pinLeft}% ${data.pinTop}%, ${data.color} 0 12%, rgba(255,255,255,0) 38%)`;
}

function worksheetRowTemplate(row) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input aria-label="Lokasi" value="${row.location || ""}"></td>
    <td><input aria-label="Elevasi" value="${row.elevation || ""}"></td>
    <td><input aria-label="Suhu" value="${row.temperature || ""}"></td>
    <td><input aria-label="Kelembapan" value="${row.humidity || ""}"></td>
    <td><input aria-label="Jarak laut" value="${row.distance || ""}"></td>
    <td><input aria-label="Faktor dominan" value="${row.factor || ""}"></td>
    <td><textarea aria-label="Kesimpulan spasial">${row.conclusion || ""}</textarea></td>
  `;
  return tr;
}

function getWorksheetRows() {
  return qsa("#worksheetBody tr").map((tr) => {
    const fields = qsa("input, textarea", tr).map((item) => item.value.trim());
    return {
      location: fields[0],
      elevation: fields[1],
      temperature: fields[2],
      humidity: fields[3],
      distance: fields[4],
      factor: fields[5],
      conclusion: fields[6]
    };
  });
}

function renderWorksheet(rows = worksheetDefaults) {
  const body = qs("#worksheetBody");
  body.innerHTML = "";
  rows.forEach((row) => body.appendChild(worksheetRowTemplate(row)));
}

function saveWorksheet() {
  localStorage.setItem("atmosferWorksheet", JSON.stringify(getWorksheetRows()));
}

function initWorksheet() {
  const saved = localStorage.getItem("atmosferWorksheet");
  renderWorksheet(saved ? JSON.parse(saved) : worksheetDefaults);
  qs("#addRow").addEventListener("click", () => {
    qs("#worksheetBody").appendChild(
      worksheetRowTemplate({
        location: "",
        elevation: "",
        temperature: "",
        humidity: "",
        distance: "",
        factor: "",
        conclusion: ""
      })
    );
  });
  qs("#saveWorksheet").addEventListener("click", saveWorksheet);
  qs("#resetWorksheet").addEventListener("click", () => {
    localStorage.removeItem("atmosferWorksheet");
    renderWorksheet();
  });
  qs("#printPortfolio").addEventListener("click", () => window.print());
  qs("#sendToWorksheet").addEventListener("click", () => {
    const data = computeAtmosphere();
    qs("#worksheetBody").appendChild(
      worksheetRowTemplate({
        location: "Skenario simulasi",
        elevation: `${data.elevation} mdpl`,
        temperature: `${data.temperature.toFixed(1)} C`,
        humidity: `${Math.round(data.humidity)}%`,
        distance: `${data.distance} km`,
        factor: data.dominant.replace(".", ""),
        conclusion: data.explanation
      })
    );
    saveWorksheet();
    qs("#lkpd").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderQuiz() {
  const form = qs("#quizForm");
  form.innerHTML = "";
  quizQuestions.forEach((question, index) => {
    const article = document.createElement("article");
    article.className = "quiz-card";
    const options = question.options
      .map(
        (option, optionIndex) => `
          <label>
            <input type="radio" name="question-${index}" value="${optionIndex}">
            <span>${option}</span>
          </label>
        `
      )
      .join("");
    article.innerHTML = `
      <fieldset>
        <legend>${index + 1}. ${question.prompt}</legend>
        ${options}
      </fieldset>
    `;
    form.appendChild(article);
  });
}

function checkQuiz() {
  let score = 0;
  qsa(".quiz-card").forEach((card, index) => {
    const selected = qs(`input[name="question-${index}"]:checked`);
    const correct = selected && Number(selected.value) === quizQuestions[index].answer;
    card.classList.toggle("is-correct", Boolean(correct));
    card.classList.toggle("is-wrong", Boolean(selected && !correct));
    if (correct) score += 1;
  });
  const percent = Math.round((score / quizQuestions.length) * 100);
  qs("#quizResult").textContent = `Skor ${score}/${quizQuestions.length} (${percent}%). ${
    percent >= 80
      ? "Pemahaman spasial sudah kuat."
      : "Tinjau kembali hubungan elevasi, lintang, kelembapan, dan citra suhu."
  }`;
}

function initQuiz() {
  renderQuiz();
  qs("#checkQuiz").addEventListener("click", checkQuiz);
  qs("#resetQuiz").addEventListener("click", () => {
    renderQuiz();
    qs("#quizResult").textContent = "";
  });
}

function renderRubric() {
  const grid = qs("#rubricGrid");
  grid.innerHTML = "";
  rubricItems.forEach((item) => {
    const article = document.createElement("article");
    article.className = "rubric-item";
    const options = item.options
      .map(
        (label, index) => `
          <label>
            <input type="radio" name="${item.id}" value="${index + 1}" ${index === 2 ? "checked" : ""}>
            <span>${index + 1}. ${label}</span>
          </label>
        `
      )
      .join("");
    article.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
      <div class="rubric-options">${options}</div>
    `;
    grid.appendChild(article);
  });
  qsa(".rubric-options input").forEach((input) => input.addEventListener("change", updateRubric));
  updateRubric();
}

function updateRubric() {
  const total = rubricItems.reduce((sum, item) => {
    const selected = qs(`input[name="${item.id}"]:checked`);
    return sum + Number(selected ? selected.value : 0);
  }, 0);
  qs("#rubricScore").textContent = `${total} / 12`;
  let feedback = "Perlu pendampingan pada pembacaan data dan penyajian visual.";
  if (total >= 11) {
    feedback = "Sangat baik. Interpretasi, visual, dan argumentasi sudah kuat.";
  } else if (total >= 8) {
    feedback = "Kinerja baik. Perkuat ketepatan legenda dan bukti lokasi.";
  } else if (total >= 5) {
    feedback = "Cukup. Tambahkan anotasi, cek legenda, dan latih argumentasi sebab-akibat.";
  }
  qs("#rubricFeedback").textContent = feedback;
}

function initReflection() {
  qs("#reflectionConcern").value = localStorage.getItem("reflectionConcern") || "";
  qs("#reflectionHabit").value = localStorage.getItem("reflectionHabit") || "";
  qs("#saveReflection").addEventListener("click", () => {
    localStorage.setItem("reflectionConcern", qs("#reflectionConcern").value.trim());
    localStorage.setItem("reflectionHabit", qs("#reflectionHabit").value.trim());
  });
  qs("#clearReflection").addEventListener("click", () => {
    qs("#reflectionConcern").value = "";
    qs("#reflectionHabit").value = "";
    localStorage.removeItem("reflectionConcern");
    localStorage.removeItem("reflectionHabit");
  });
}

function initSimulator() {
  ["#elevation", "#latitude", "#distance", "#greenCover"].forEach((selector) => {
    qs(selector).addEventListener("input", updateSimulator);
  });
  updateSimulator();
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initSimulator();
  initWorksheet();
  initQuiz();
  renderRubric();
  initReflection();
});
