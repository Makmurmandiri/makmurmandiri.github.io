// ========================================
// GLOBAL VARIABLES
// ========================================
const WHATSAPP_NUMBER = '6285724729600';
const ADMIN_FEE_RATE = 0.085; // 8.5%
const INTEREST_RATE = 0.02; // 2% per month
const STAMP_DUTY_LOW = 22000;  // ≤ 5 jt
const STAMP_DUTY_HIGH = 33000; // > 6 jt
const INITIAL_SAVINGS = 1025000; // Fixed initial mandatory savings
const MONTHLY_SAVINGS = 205000; // Fixed monthly mandatory savings

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Format number to Indonesian currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Open WhatsApp with custom message
 */
function openWhatsApp(message = null) {
    const defaultMessage = 'Halo KSP Makmur Mandiri, saya ingin mengajukan pinjaman. Mohon informasinya, terima kasih.';
    const finalMessage = message || defaultMessage;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(finalMessage)}`;
    window.open(url, '_blank');
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ========================================
// CALCULATOR FUNCTIONS
// ========================================

/**
 * Calculate loan details
 */
function calculateLoan() {
    const loanAmountSelect = document.getElementById('loanAmount');
    const loanTenorSelect = document.getElementById('loanTenor');
    const resultContainer = document.getElementById('resultContainer');

    if (!loanAmountSelect || !loanTenorSelect || !resultContainer) {
        console.error('Calculator elements not found');
        return;
    }

    const loanAmount = parseInt(loanAmountSelect.value);
    const tenor = parseInt(loanTenorSelect.value);

    // Calculate all values
    const adminFee = loanAmount * ADMIN_FEE_RATE;
    const stampDuty = loanAmount > 5000000 ? STAMP_DUTY_HIGH : STAMP_DUTY_LOW;
    const receivedAmount = loanAmount - adminFee - INITIAL_SAVINGS - stampDuty;
    const principalPayment = loanAmount / tenor;
    const interestPayment = loanAmount * INTEREST_RATE;
    const totalMonthlyPayment = principalPayment + interestPayment + MONTHLY_SAVINGS;

    // Update DOM elements
  // Update DOM elements
updateElementText('resultLoanAmount', formatCurrency(loanAmount));
updateElementText('resultAdminFee', formatCurrency(adminFee));
updateElementText('resultInitialSavings', formatCurrency(INITIAL_SAVINGS));

// ✅ INI YANG DIGANTI
updateElementText('resultStampDuty', formatCurrency(stampDuty));

updateElementText('resultReceivedAmount', formatCurrency(receivedAmount));
updateElementText('resultPrincipal', formatCurrency(principalPayment));
updateElementText('resultInterest', formatCurrency(interestPayment));
updateElementText('resultMonthlySavings', formatCurrency(MONTHLY_SAVINGS));
updateElementText('resultTotalMonthly', formatCurrency(totalMonthlyPayment));


    // Show result container
    resultContainer.style.display = 'block';

    // Smooth scroll to result
    setTimeout(() => {
        smoothScrollTo(resultContainer);
    }, 100);
}

/**
 * Update element text safely
 */
function updateElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

/**
 * Generate WhatsApp message with loan details
 */
function generateLoanMessage() {
    const loanAmountSelect = document.getElementById('loanAmount');
    const loanTenorSelect = document.getElementById('loanTenor');

    if (!loanAmountSelect || !loanTenorSelect) {
        return null;
    }

    const loanAmount = parseInt(loanAmountSelect.value);
    const tenor = parseInt(loanTenorSelect.value);
    const principalPayment = loanAmount / tenor;
    const interestPayment = loanAmount * INTEREST_RATE;
    const totalMonthlyPayment = principalPayment + interestPayment + MONTHLY_SAVINGS;

    const message = `Halo KSP Makmur Mandiri,

Saya ingin mengajukan pinjaman dengan detail:

Jumlah Pinjaman: ${formatCurrency(loanAmount)}
Tenor: ${tenor} bulan
Angsuran per Bulan: ${formatCurrency(totalMonthlyPayment)}

Mohon informasi lebih lanjut mengenai persyaratan dan proses pengajuannya.

Terima kasih.`;

    return message;
}

// ========================================
// EVENT LISTENERS
// ========================================

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // Calculate button
    const btnCalculate = document.getElementById('btnCalculate');
    if (btnCalculate) {
        btnCalculate.addEventListener('click', calculateLoan);
    }

    // Header Ajukan button
    const btnAjukanHeader = document.getElementById('btnAjukanHeader');
    if (btnAjukanHeader) {
        btnAjukanHeader.addEventListener('click', () => {
            openWhatsApp();
        });
    }

    // Calculator Ajukan button
    const btnAjukanCalc = document.getElementById('btnAjukanCalc');
    if (btnAjukanCalc) {
        btnAjukanCalc.addEventListener('click', () => {
            const message = generateLoanMessage();
            openWhatsApp(message);
        });
    }

    // CTA Ajukan button
    const btnAjukanCTA = document.getElementById('btnAjukanCTA');
    if (btnAjukanCTA) {
        btnAjukanCTA.addEventListener('click', () => {
            openWhatsApp();
        });
    }

    // Auto-calculate on select change
    const loanAmountSelect = document.getElementById('loanAmount');
    const loanTenorSelect = document.getElementById('loanTenor');
    
    if (loanAmountSelect) {
        loanAmountSelect.addEventListener('change', calculateLoan);
    }
    
    if (loanTenorSelect) {
        loanTenorSelect.addEventListener('change', calculateLoan);
    }
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================

/**
 * Add shadow to header on scroll
 */
function initializeHeaderScroll() {
    const header = document.querySelector('.header-mobile');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

/**
 * Enable smooth scroll for all anchor links
 */
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            smoothScrollTo(targetElement);
        });
    });
}

// ========================================
// FADE-IN ANIMATION ON SCROLL
// ========================================

/**
 * Initialize intersection observer for fade-in animations
 */
function initializeFadeInAnimation() {
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

    // Observe elements
    const elementsToObserve = document.querySelectorAll(
        '.feature-card, .stat-card, .requirement-card, .contact-card'
    );

    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ========================================
// PREVENT ZOOM ON INPUT FOCUS (iOS)
// ========================================

/**
 * Prevent zoom on input focus for iOS devices
 */
function preventZoomOnFocus() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            document.body.style.fontSize = '16px';
        });
        input.addEventListener('blur', () => {
            document.body.style.fontSize = '';
        });
    });
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
    console.log('Initializing KSP Makmur Mandiri App...');
    
    // Initialize all features
    initializeEventListeners();
    initializeHeaderScroll();
    initializeSmoothScroll();
    initializeFadeInAnimation();
    preventZoomOnFocus();
    
    // Run initial calculation
    calculateLoan();
    
    console.log('App initialized successfully!');
}

// Run initialization when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ========================================
// SERVICE WORKER REGISTRATION (Optional)
// ========================================

/**
 * Register service worker for PWA support (if available)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment below to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => {
        //         console.log('SW registered:', registration);
        //     })
        //     .catch(error => {
        //         console.log('SW registration failed:', error);
        //     });
    });
}

// ========================================
// EXPORT FOR TESTING (Optional)
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        calculateLoan,
        openWhatsApp,
        generateLoanMessage
    };
}
