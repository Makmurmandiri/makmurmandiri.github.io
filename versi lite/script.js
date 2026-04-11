// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== POPULATE SELECT OPTIONS =====
function populateSelects() {
  const jumlahList = [];
  for (let i = 3000000; i <= 20000000; i += 500000) {
    jumlahList.push(i);
  }

  const tenorList = [];
  for (let i = 3; i <= 24; i++) {
    tenorList.push(i);
  }

  const selectIds = ['jumlahPinjaman', 'plJumlah'];
  selectIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    jumlahList.forEach(val => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = 'Rp ' + val.toLocaleString('id-ID');
      el.appendChild(opt);
    });
  });

  const tenorIds = ['tenorPinjaman', 'plTenor'];
  tenorIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    tenorList.forEach(val => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val + ' Bulan';
      el.appendChild(opt);
    });
  });
}
populateSelects();

// ===== FORMAT CURRENCY =====
function formatRp(val) {
  return 'Rp ' + Math.round(val).toLocaleString('id-ID');
}

// ===== HITUNG PINJAMAN =====
function hitungPinjaman() {
  const pinjaman = parseFloat(document.getElementById('jumlahPinjaman').value);
  const tenor = parseInt(document.getElementById('tenorPinjaman').value);
  const hasil = document.getElementById('hasilKalkulator');

  if (!pinjaman || !tenor) {
    showToast('Harap pilih jumlah pinjaman dan tenor terlebih dahulu.');
    return;
  }

  const biayaAdmin = pinjaman * 0.09;
  const simpananWajibAwal = pinjaman * 0.02;
  const biayaMaterai = 10000;
  const danaDiterima = pinjaman - biayaAdmin - simpananWajibAwal - biayaMaterai;

  const angsuranPokok = pinjaman / tenor;
  const jasa = pinjaman * 0.02;
  const simpananWajib = pinjaman * 0.01;
  const totalPerBulan = angsuranPokok + jasa + simpananWajib;

  hasil.innerHTML = `
    <div class="hasil-grid">
      <div class="hasil-block">
        <h4>Dana yang Diterima</h4>
        <div class="hasil-row">
          <span class="label">Jumlah Pinjaman</span>
          <span class="value">${formatRp(pinjaman)}</span>
        </div>
        <div class="hasil-row">
          <span class="label">Biaya Admin (9%)</span>
          <span class="value">${formatRp(biayaAdmin)}</span>
        </div>
        <div class="hasil-row">
          <span class="label">Simpanan Wajib Awal</span>
          <span class="value">${formatRp(simpananWajibAwal)}</span>
        </div>
        <div class="hasil-row">
          <span class="label">Biaya Materai</span>
          <span class="value">${formatRp(biayaMaterai)}</span>
        </div>
        <div class="hasil-row total">
          <span class="label">Dana Diterima</span>
          <span class="value">${formatRp(danaDiterima)}</span>
        </div>
      </div>
      <div class="hasil-block">
        <h4>Angsuran Per Bulan</h4>
        <div class="hasil-row">
          <span class="label">Angsuran Pokok</span>
          <span class="value">${formatRp(angsuranPokok)}</span>
        </div>
        <div class="hasil-row">
          <span class="label">Jasa (2%)</span>
          <span class="value">${formatRp(jasa)}</span>
        </div>
        <div class="hasil-row">
          <span class="label">Simpanan Wajib</span>
          <span class="value">${formatRp(simpananWajib)}</span>
        </div>
        <div class="hasil-row total">
          <span class="label">Total Per Bulan</span>
          <span class="value">${formatRp(totalPerBulan)}</span>
        </div>
      </div>
      <div class="kalk-cta">
        <a href="#kontak" class="btn-primary full-width">Ajukan Pinjaman Ini</a>
      </div>
    </div>
  `;
}

// ===== HITUNG PELUNASAN =====
function hitungPelunasan() {
  const pinjaman = parseFloat(document.getElementById('plJumlah').value);
  const tenor = parseInt(document.getElementById('plTenor').value);
  const angsuranKe = parseInt(document.getElementById('plAngsuranKe').value);
  const hasil = document.getElementById('hasilPelunasan');

  if (!pinjaman || !tenor || !angsuranKe) {
    showToast('Harap isi semua field terlebih dahulu.');
    return;
  }

  if (angsuranKe >= tenor) {
    showToast('Angsuran ke-' + angsuranKe + ' melebihi tenor ' + tenor + ' bulan.');
    return;
  }

  const angsuranPokok = pinjaman / tenor;
  const sisaAngsuran = tenor - angsuranKe;
  const sisaPokok = angsuranPokok * sisaAngsuran;
  const jasaSisa = sisaPokok * 0.02 * sisaAngsuran;
  const simpananSisa = (pinjaman * 0.01) * sisaAngsuran;
  const totalPelunasan = sisaPokok + jasaSisa + simpananSisa;

  hasil.innerHTML = `
    <div class="hasil-grid" style="grid-template-columns: 1fr;">
      <div class="hasil-block">
        <h4>Rincian Pelunasan</h4>
        <div class="hasil-row">
          <span class="label">Sisa Angsuran</span>
          <span class="value">${sisaAngsuran} bulan</span>
        </div>
        <div class="hasil-row">
          <span class="label">Sisa Pokok</span>
          <span class="value">${formatRp(sisaPokok)}</span>
        </div>
        <div class="hasil-row">
          <span class="label">Jasa Sisa</span>
          <span class="value">${formatRp(jasaSisa)}</span>
        </div>
        <div class="hasil-row">
          <span class="label">Simpanan Sisa</span>
          <span class="value">${formatRp(simpananSisa)}</span>
        </div>
        <div class="hasil-row total">
          <span class="label">Total Pelunasan</span>
          <span class="value">${formatRp(totalPelunasan)}</span>
        </div>
      </div>
      <div class="kalk-cta">
        <a href="#kontak" class="btn-primary full-width">Konsultasikan Sekarang</a>
      </div>
    </div>
  `;
}

// ===== TOAST NOTIFICATION =====
function showToast(msg) {
  let existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #1d2230;
    border: 1px solid rgba(201, 168, 76, 0.4);
    color: #f0f0f0;
    padding: 14px 28px;
    border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    z-index: 9999;
    opacity: 0;
    transition: all 0.3s ease;
    white-space: nowrap;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== SCROLL REVEAL (Intersection Observer) =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fitur-card, .syarat-card, .kontak-card, .lokasi-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
