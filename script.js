const form = document.querySelector('form');
const result = document.getElementById('result');
const submitButton = form.querySelector('.submit-button');
const spreadsheetUrl = 'https://script.google.com/macros/s/AKfycbzollMSa2VHK0_iZKwJsk0lznyQiruawbYPy9KZSFjjxN4eu_ge6NC59641p2p9TAqRTw/exec';

const correctAnswers = {
  pg1: 'B', pg2: 'C', pg3: 'B', pg4: 'B', pg5: 'C',
  pg6: 'B', pg7: 'B', pg8: 'A', pg9: 'B', pg10: 'B',
  bs1: 'B', bs2: 'B', bs3: 'S', bs4: 'B', bs5: 'B',
  bs6: 'B', bs7: 'B', bs8: 'S', bs9: 'B', bs10: 'B',
  jodoh1: 'E', jodoh2: 'A', jodoh3: 'F', jodoh4: 'C', jodoh5: 'B',
  jodoh6: 'D', jodoh7: 'H', jodoh8: 'G', jodoh9: 'J', jodoh10: 'I'
};

const pointValues = {
  ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`pg${i + 1}`, 3])),
  ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`bs${i + 1}`, 3])),
  ...Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`jodoh${i + 1}`, 4]))
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  result.hidden = false;
  result.textContent = 'Menghitung nilai dan mengirim jawaban...';

  let score = 0;
  let correctCount = 0;
  let answered = 0;
  const answers = {};

  for (const [name, correctAnswer] of Object.entries(correctAnswers)) {
    const response = form.elements[name].value;
    answers[name] = response;
    if (response) answered++;
    if (response === correctAnswer) {
      score += pointValues[name];
      correctCount++;
    }
  }

  const total = Object.keys(correctAnswers).length;
  const percentage = score;
  const payload = {
    waktuKirim: new Date().toISOString(),
    nama: form.elements.nama.value,
    kelas: form.elements.kelas.value,
    tanggalLahir: form.elements['tanggal-lahir'].value,
    mataPelajaran: form.elements['mata-pelajaran'].value,
    bab: form.elements.bab.value,
    jawaban: answers,
    nilai: percentage,
    jawabanBenar: correctCount,
    totalSoal: total,
    jawabanTerisi: answered
  };

  try {
    await fetch(spreadsheetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    result.textContent = `Tes selesai! Nilai: ${percentage} dari 100. Jawaban benar: ${correctCount} dari ${total}. Jawaban terisi: ${answered} dari ${total}. Permintaan penyimpanan telah dikirim ke spreadsheet.`;
    form.querySelectorAll('input, select, button').forEach((control) => {
      control.disabled = true;
    });
  } catch (error) {
    result.textContent = `Nilai: ${percentage} dari 100. Pengiriman ke spreadsheet gagal. Periksa koneksi internet lalu coba kumpulkan kembali.`;
    submitButton.disabled = false;
  }
});
