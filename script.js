/* =============================================
   KSP Makmur Mandiri - script.js
   ============================================= */

// ---- FORMAT RUPIAH ----
function formatRp(angka) {
  return 'Rp ' + Math.round(angka).toLocaleString('id-ID');
}

// ---- NAVBAR SCROLL ----
window.addEventListener('scroll', function () {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// =============================================
// KALKULATOR PINJAMAN
// Perubahan:
//   - Biaya Admin: 9.5% (dari 9%)
//   - Simpanan Wajib bulanan: Rp 205.000 (dari Rp 50.000)
// =============================================
function hitungAngsuran(){

const pinjaman = parseInt(document.getElementById("jumlahPinjaman").value);
const tenor = parseInt(document.getElementById("tenor").value);

// ========================
// CONFIG
// ========================
const ADMIN_RATE = 0.095; // ✅ 9.5%
const BUNGA = 0.02;

const SIMPANAN_WAJIB_AWAL = 50000;
const SIMPANAN_POKOK = 1000000;
const SIMPANAN_BULANAN = 205000;

// ========================
// ADMIN
// ========================
const admin = pinjaman * ADMIN_RATE;

// ========================
// MATERAI
// ========================
let materai = 0;

if(pinjaman <= 5000000){
  materai = 22000;
}else{
  materai = 33000;
}

// ========================
// TOTAL POTONGAN
// ========================
const totalPotongan = admin + SIMPANAN_WAJIB_AWAL + SIMPANAN_POKOK + materai;
const diterima = pinjaman - totalPotongan;

// ========================
// ANGSURAN
// ========================
let pokok = pinjaman / tenor;

// ========================
// PEMBULATAN KOPERASI
// ========================
let sisa = pokok % 1000;

if (sisa >= 200 && sisa <= 500) {
  pokok = pokok - sisa + 500;
} else if (sisa >= 600) {
  pokok = pokok - sisa + 1000;
} else {
  pokok = pokok - sisa;
}
const jasa = pinjaman * BUNGA;
const totalBulanan = pokok + jasa + SIMPANAN_BULANAN;

// ========================
// FORMAT
// ========================
const rp = (n) => "Rp " + n.toLocaleString("id-ID");

// ========================
// OUTPUT
// ========================
document.getElementById("calcResults").style.display = "block";

document.getElementById("r-pinjaman").innerText = rp(pinjaman);
document.getElementById("r-admin").innerText = rp(admin);
document.getElementById("r-simpanan-awal").innerText = rp(SIMPANAN_WAJIB_AWAL);
document.getElementById("r-simpanan-pokok").innerText = rp(SIMPANAN_POKOK);
document.getElementById("r-materai").innerText = rp(materai);
document.getElementById("r-diterima").innerText = rp(diterima);

document.getElementById("r-pokok").innerText = rp(pokok);
document.getElementById("r-jasa").innerText = rp(jasa);
document.getElementById("r-simpanan").innerText = rp(SIMPANAN_BULANAN);
document.getElementById("r-total").innerText = rp(totalBulanan);

  // Scroll ke hasil
  hasil.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// =============================================
// SIMULASI PELUNASAN
// Perubahan:
//   - Tabungan: 200.000 x 1 = Rp 200.000 (HANYA x1, tidak ikut sisa angsuran)
//   - Pokok  : pokok_per_bulan x sisa_angsuran
//   - Jasa   : jasa_per_bulan x sisa_angsuran  (2% flat dari sisa pokok)
//   - ADM    : Rp 5.000 x sisa_angsuran
// =============================================
function hitungPelunasan() {
  const pinjaman     = parseFloat(document.getElementById('pelJumlah').value);
  const tenor        = parseInt(document.getElementById('pelTenor').value);
  const sudah        = parseInt(document.getElementById('sudahAngsuran').value);

  if (!pinjaman || !tenor) {
    alert('Mohon pilih jumlah pinjaman dan tenor terlebih dahulu.');
    return;
  }
  if (!sudah || isNaN(sudah) || sudah < 1) {
    alert('Mohon isi sudah angsuran ke berapa (minimal 1).');
    return;
  }
  if (sudah >= tenor) {
    alert('Angsuran ke-' + sudah + ' sudah melebihi atau sama dengan tenor ' + tenor + ' bulan.\nPinjaman seharusnya sudah lunas!');
    return;
  }

  const sisaAngsuran = tenor - sudah;   // berapa bulan tersisa

  // Pokok per bulan = pinjaman / tenor
  const pokokPerBulan = pinjaman / tenor;

  // Sisa pokok = pokok per bulan x sisa angsuran
  const totalPokok = pokokPerBulan * sisaAngsuran;

  // Jasa: dihitung dari SISA pokok yang belum dibayar (flat)
  // Rumus asli situs: jasa = pinjaman * 2% flat per bulan * sisa bulan
  const jasaPerBulan = pinjaman * 0.02;
  const totalJasa    = jasaPerBulan * sisaAngsuran;

  // Tabungan: HANYA x 1 (tidak ikut sisa angsuran)
  const totalTabungan = 200000; // 200.000 x 1

  // ADM: Rp 5.000 x sisa angsuran
  const admPerBulan = 5000;
  const totalAdm    = admPerBulan * sisaAngsuran;

  // Total pelunasan
  const totalPelunasan = totalPokok + totalJasa + totalTabungan + totalAdm;

  // Update labels dinamis
  document.getElementById('pel-pokok-label').textContent   = 'Pokok (' + formatRp(pokokPerBulan) + ' × ' + sisaAngsuran + ')';
  document.getElementById('pel-jasa-label').textContent    = 'Jasa (' + formatRp(jasaPerBulan) + ' × ' + sisaAngsuran + ')';
  document.getElementById('pel-tabungan-label').textContent = 'Tabungan 200.000 × 1';
  document.getElementById('pel-adm-label').textContent     = 'ADM (' + formatRp(admPerBulan) + ' × ' + sisaAngsuran + ')';

  // Isi nilai
  document.getElementById('pel-pinjaman').textContent      = formatRp(pinjaman);
  document.getElementById('pel-tenor').textContent         = tenor + ' Bulan';
  document.getElementById('pel-sudah').textContent         = 'Ke-' + sudah;
  document.getElementById('pel-sisa-angsuran').textContent = sisaAngsuran + ' kali lagi';

  document.getElementById('pel-pokok').textContent         = formatRp(totalPokok);
  document.getElementById('pel-jasa').textContent          = formatRp(totalJasa);
  document.getElementById('pel-tabungan').textContent      = formatRp(totalTabungan);
  document.getElementById('pel-adm').textContent           = formatRp(totalAdm);

  document.getElementById('pel-total').textContent         = formatRp(totalPelunasan);

  // Tampilkan
  const hasil = document.getElementById('pelResults');
  hasil.style.display = 'flex';
  hasil.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---- WA redirect untuk tombol Ajukan ----
function bukaWA(e) {
  e.preventDefault();
  const pinjaman = document.getElementById('jumlahPinjaman').value;
  const tenor    = document.getElementById('tenor').value;
  const msg      = encodeURIComponent(
    'Halo KSP Makmur Mandiri, saya ingin mengajukan pinjaman sebesar Rp ' +
    parseInt(pinjaman).toLocaleString('id-ID') +
    ' dengan tenor ' + tenor + ' bulan. Mohon informasinya. Terima kasih.'
  );
  window.open('https://wa.me/6281383960670?text=' + msg, '_blank');
}

// ---- Intersection Observer for scroll animations ----
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll(
    '.feature-card, .stat-card, .req-card, .contact-card, .lokasi-card'
  );
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    cards.forEach(function (card, i) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(24px)';
      card.style.transition = 'opacity 0.5s ease ' + (i * 0.06) + 's, transform 0.5s ease ' + (i * 0.06) + 's';
      obs.observe(card);
    });
  }
});

/* =============================================
   WIDGET CHAT AI - KSP Makmur Mandiri
   Semua dibuat lewat JS, tidak perlu ubah HTML.
   Chat memanggil Cloudflare Worker (proxy),
   BUKAN OpenRouter langsung, biar API key aman.
   ============================================= */

// GANTI dengan URL Worker kamu setelah dideploy ke Cloudflare
// contoh: "https://makmurmandiri-chatbot.namamu.workers.dev"
const CHATBOT_PROXY_URL = "https://makmurmandiri-chatbot.rrsecbounty.workers.dev/";

(function initChatWidget() {
  let chatHistory = [];
  let isLoading = false;

  // ---- Inject CSS ----
  const style = document.createElement('style');
  style.textContent = `
    #kmm-chat-toggle {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #0f7a3e;
      color: #fff;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
      font-size: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9998;
      transition: transform 0.2s ease;
    }
    #kmm-chat-toggle:hover { transform: scale(1.06); }

    #kmm-chat-window {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 340px;
      max-width: 90vw;
      height: 460px;
      max-height: 75vh;
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.25);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
      font-family: inherit;
    }
    #kmm-chat-window.open { display: flex; }

    #kmm-chat-header {
      background: #0f7a3e;
      color: #fff;
      padding: 14px 16px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 15px;
    }
    #kmm-chat-close {
      background: none;
      border: none;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      line-height: 1;
    }

    #kmm-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      background: #f7f8fa;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .kmm-msg {
      max-width: 85%;
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 13.5px;
      line-height: 1.4;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .kmm-msg.user {
      align-self: flex-end;
      background: #0f7a3e;
      color: #fff;
      border-bottom-right-radius: 4px;
    }
    .kmm-msg.bot {
      align-self: flex-start;
      background: #fff;
      color: #222;
      border: 1px solid #e2e4e8;
      border-bottom-left-radius: 4px;
    }
    .kmm-msg.typing {
      align-self: flex-start;
      background: #fff;
      border: 1px solid #e2e4e8;
      color: #888;
      font-style: italic;
    }

    #kmm-chat-inputbar {
      display: flex;
      border-top: 1px solid #e2e4e8;
      padding: 8px;
      gap: 8px;
      background: #fff;
    }
    #kmm-chat-input {
      flex: 1;
      border: 1px solid #d8dbe0;
      border-radius: 20px;
      padding: 8px 14px;
      font-size: 13.5px;
      outline: none;
      font-family: inherit;
    }
    #kmm-chat-send {
      background: #0f7a3e;
      color: #fff;
      border: none;
      border-radius: 20px;
      padding: 0 16px;
      cursor: pointer;
      font-size: 13.5px;
      font-weight: 600;
    }
    #kmm-chat-send:disabled { opacity: 0.5; cursor: default; }
  `;
  document.head.appendChild(style);

  // ---- Build widget DOM ----
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'kmm-chat-toggle';
  toggleBtn.setAttribute('aria-label', 'Buka chat asisten');
  toggleBtn.textContent = '💬';

  const chatWindow = document.createElement('div');
  chatWindow.id = 'kmm-chat-window';
  chatWindow.innerHTML = `
    <div id="kmm-chat-header">
      <span>Asisten KSP Makmur Mandiri</span>
      <button id="kmm-chat-close" aria-label="Tutup chat">×</button>
    </div>
    <div id="kmm-chat-messages"></div>
    <div id="kmm-chat-inputbar">
      <input id="kmm-chat-input" type="text" placeholder="Tanya soal pinjaman..." autocomplete="off" />
      <button id="kmm-chat-send">Kirim</button>
    </div>
  `;

  document.body.appendChild(chatWindow);
  document.body.appendChild(toggleBtn);

  const messagesEl = chatWindow.querySelector('#kmm-chat-messages');
  const inputEl = chatWindow.querySelector('#kmm-chat-input');
  const sendBtn = chatWindow.querySelector('#kmm-chat-send');
  const closeBtn = chatWindow.querySelector('#kmm-chat-close');

  // Pesan sambutan awal
  addMessage('bot', 'Halo! 👋 Saya asisten KSP Makmur Mandiri. Ada yang bisa saya bantu soal pinjaman?');

  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) inputEl.focus();
  });
  closeBtn.addEventListener('click', () => chatWindow.classList.remove('open'));

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  function addMessage(role, text) {
    const bubble = document.createElement('div');
    bubble.className = 'kmm-msg ' + role;
    bubble.textContent = text;
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isLoading) return;

    if (CHATBOT_PROXY_URL === "GANTI_DENGAN_URL_CLOUDFLARE_WORKER_KAMU") {
      addMessage('bot', 'Chat belum aktif. Admin situs perlu memasang URL server chat terlebih dahulu.');
      return;
    }

    addMessage('user', text);
    chatHistory.push({ role: 'user', content: text });
    inputEl.value = '';
    isLoading = true;
    sendBtn.disabled = true;

    const typingBubble = addMessage('typing', 'Sedang mengetik...');

    try {
      const res = await fetch(CHATBOT_PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: chatHistory })
      });

      const data = await res.json();
      typingBubble.remove();

      if (!res.ok || data.error) {
        addMessage('bot', data.error || 'Maaf, terjadi kesalahan. Coba lagi ya.');
      } else {
        addMessage('bot', data.reply);
        chatHistory.push({ role: 'assistant', content: data.reply });
      }
    } catch (err) {
      typingBubble.remove();
      addMessage('bot', 'Gagal terhubung ke server chat. Periksa koneksi internet kamu.');
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
    }
  }
})();
