// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
    });
}

// Close mobile menu when clicking on links
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
    });
});

// Loan Calculator
const calculateBtn = document.getElementById('calculateBtn');
const loanAmountSelect = document.getElementById('loanAmount');
const loanTenorSelect = document.getElementById('loanTenor');
const calculatorResult = document.getElementById('calculatorResult');

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function calculateLoan() {
    const loanAmount = parseInt(loanAmountSelect.value);
    const tenor = parseInt(loanTenorSelect.value);
    
    // Constants
    const ADMIN_FEE_RATE = 0.085; // 8.5%
    const INTEREST_RATE = 0.02; // 2% per month
    const STAMP_DUTY = 33000; // 3 materai @ 11,000 each
    const INITIAL_SAVINGS = 1025000; // Fixed initial mandatory savings
    const MONTHLY_SAVINGS = 155000; // Fixed monthly mandatory savings
    
    // Calculations
    const adminFee = loanAmount * ADMIN_FEE_RATE;
    const receivedAmount = loanAmount - adminFee - INITIAL_SAVINGS - STAMP_DUTY;
    
    const principalPayment = loanAmount / tenor;
    const interestPayment = loanAmount * INTEREST_RATE;
    const totalMonthlyPayment = principalPayment + interestPayment + MONTHLY_SAVINGS;
    
    // Display results
    document.getElementById('resultLoanAmount').textContent = formatCurrency(loanAmount);
    document.getElementById('resultAdminFee').textContent = formatCurrency(adminFee);
    document.getElementById('resultInitialSavings').textContent = formatCurrency(INITIAL_SAVINGS);
    document.getElementById('resultStampDuty').textContent = formatCurrency(STAMP_DUTY);
    document.getElementById('resultReceivedAmount').textContent = formatCurrency(receivedAmount);
    
    document.getElementById('resultPrincipalPayment').textContent = formatCurrency(principalPayment);
    document.getElementById('resultInterestPayment').textContent = formatCurrency(interestPayment);
    document.getElementById('resultMonthlySavings').textContent = formatCurrency(MONTHLY_SAVINGS);
    document.getElementById('resultTotalMonthly').textContent = formatCurrency(totalMonthlyPayment);
    
    calculatorResult.style.display = 'block';
    
    // Smooth scroll to result
    setTimeout(() => {
        calculatorResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateLoan);
    
    // Calculate on load with default values
    calculateLoan();
}

// Generate Loan Table
function generateLoanTable() {
    const table = document.getElementById('loanTable');
    if (!table) return;
    
    const loanAmounts = [3000000, 4000000, 5000000, 6000000, 7000000, 8000000, 9000000, 10000000, 11000000, 12000000, 13000000, 14000000, 15000000, 16000000, 17000000, 18000000, 19000000, 20000000];
    const tenors = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    
    const INTEREST_RATE = 0.02; // 2% per month
    const MONTHLY_SAVINGS = 155000; // Fixed monthly mandatory savings
    
    // Create table header
    let headerHTML = '<thead><tr><th class="sticky-col">Jumlah Pinjaman</th>';
    tenors.forEach(tenor => {
        headerHTML += `<th>${tenor} Bulan</th>`;
    });
    headerHTML += '</tr></thead>';
    
    // Create table body
    let bodyHTML = '<tbody>';
    loanAmounts.forEach(loanAmount => {
        bodyHTML += `<tr><td class="sticky-col loan-amount">${formatCurrency(loanAmount)}</td>`;
        
        tenors.forEach(tenor => {
            const principalPayment = loanAmount / tenor;
            const interestPayment = loanAmount * INTEREST_RATE;
            const totalMonthlyPayment = principalPayment + interestPayment + MONTHLY_SAVINGS;
            
            bodyHTML += `<td>${formatCurrency(totalMonthlyPayment)}</td>`;
        });
        
        bodyHTML += '</tr>';
    });
    bodyHTML += '</tbody>';
    
    table.innerHTML = headerHTML + bodyHTML;
}

// Generate table on page load
generateLoanTable();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.background = 'rgba(10, 10, 11, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(10, 10, 11, 0.8)';
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.trust-card, .stat-card, .requirement-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// === WHATSAPP AJUKAN PINJAMAN ===
const waBtn = document.getElementById("waAjukan");

if (waBtn) {
  waBtn.addEventListener("click", () => {
    const jumlah = document.getElementById("loanAmount")?.value || "-";
    const tenor = document.getElementById("loanTenor")?.value || "-";

    const pesan = `
Halo KSP Makmur Mandiri,
Saya ingin mengajukan pinjaman.

Jumlah Pinjaman: Rp ${Number(jumlah).toLocaleString("id-ID")}
Tenor: ${tenor} bulan

Mohon informasinya, terima kasih.
    `;

    const nomorWA = "6285724729600"; // ganti sesuai admin
    const url = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank");
  });
}

// === WHATSAPP AJUKAN PINJAMAN (SATU FUNGSI) ===
function ajukanKeWhatsApp() {
  const jumlah = document.getElementById("loanAmount")?.value || "-";
  const tenor = document.getElementById("loanTenor")?.value || "-";

  const pesan = `
Halo KSP Makmur Mandiri,
Saya ingin mengajukan pinjaman.

Jumlah Pinjaman: Rp ${Number(jumlah).toLocaleString("id-ID")}
Tenor: ${tenor} bulan

Mohon informasinya, terima kasih.
  `;

  const nomorWA = "6285724729600"; // ganti sesuai admin
  const url = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank");
}

// PASANG KE DUA TOMBOL
document.getElementById("waAjukan")?.addEventListener("click", ajukanKeWhatsApp);
document.getElementById("btnAjukanHeader")?.addEventListener("click", ajukanKeWhatsApp);

document.getElementById("btnAjukanMobile")?.addEventListener("click", ajukanKeWhatsApp);

mobileMenuBtn.addEventListener("click", () => {
  document.body.classList.toggle("menu-open");
});




