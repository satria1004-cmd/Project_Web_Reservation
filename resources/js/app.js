// Mock Data & State
const DEVELOPER_GMAIL = "admin@lomoto.com";
let isLoggedIn = false;
let lomotoChartInstance = null;
let currentBranchFilter = 'Semua Cabang';
let currentStatusFilter = 'Semua Status';
let currentDateFilter = '';
let currentSortOrder = 'asc'; // 'asc' = terdekat, 'desc' = terjauh
let searchQuery = '';
let clientSearchQuery = '';
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();
window.activeCalendarBranch = 'Karawaci';
const MOCK_CREDENTIALS = { email: 'admin@lomoto.com', password: 'admin123' };

// ============================================================
// GLOBAL STATE — selalu diinisialisasi sebelum fungsi apapun
// ============================================================
let bookingState = [];

const mapCategory = (oldCat) => {
    if (!oldCat) return 'Personal / Maternity Portrait';
    const c = oldCat.toLowerCase();
    if (c.includes('personal')) return 'Personal / Maternity Portrait';
    if (c.includes('prewedding') || c.includes('couple')) return 'Prewedding / Couple';
    if (c.includes('family')) return 'Family / Graduation / Friendship';
    if (c.includes('group') || c.includes('friendship') || c.includes('graduation')) return 'Family / Graduation / Friendship';
    if (c.includes('yearbook') || c.includes('corporate')) return 'Yearbook / Corporate Group';
    if (c.includes('product')) return 'Product Photography';
    if (c.includes('rental') || c.includes('studio rental')) return 'Studio Rental';
    return 'Personal / Maternity Portrait';
};

const sanitizeBackgroundName = (bg) => {
    if (!bg) return '';
    let clean = bg.replace(/^Set\s+\d+:\s*/i, '').trim();
    if (clean === "Ramadhan Set 10" || clean.includes("Ramadhan Set")) {
        clean = "Ramadhan Kareem";
    }
    return clean;
};

// saveReservations: hanya rebuild chart, tidak lagi menulis ke localStorage
const saveReservations = () => {
    if (typeof window.renderOrUpdateChart === 'function') {
        window.renderOrUpdateChart();
    }
};

const LOMOTO_PRICE_LIST_2024 = {
    "Karawaci": {
        "Personal / Maternity Portrait": {
            "Wood": { price: 800000, durationMinutes: 30, maxBackgrounds: 1 },
            "Silver": { price: 2000000, durationMinutes: 60, maxBackgrounds: 2 },
            "Gold": { price: 5000000, durationMinutes: 90, maxBackgrounds: 3 }
        },
        "Prewedding / Couple": {
            "Wood": { price: 1000000, durationMinutes: 30, maxBackgrounds: 1 },
            "Silver": { price: 4000000, durationMinutes: 60, maxBackgrounds: 2 },
            "Gold": { price: 8000000, durationMinutes: 120, maxBackgrounds: 3 }
        },
        "Family / Graduation / Friendship": {
            "Wood": { price: 1000000, durationMinutes: 30, maxBackgrounds: 1 },
            "Silver": { price: 2500000, durationMinutes: 60, maxBackgrounds: 2 },
            "Gold": { price: 4000000, durationMinutes: 90, maxBackgrounds: 2 }
        },
        "Yearbook / Corporate Group": {
            "Wood": { price: 2500000, durationMinutes: 60, maxBackgrounds: 1 },
            "Silver": { price: 3500000, durationMinutes: 120, maxBackgrounds: 2 },
            "Gold": { price: 4500000, durationMinutes: 180, maxBackgrounds: 2 }
        },
        "Product Photography": {
            "Wood": { price: 500000, durationMinutes: 120, maxBackgrounds: 5 },
            "Silver": { price: 3000000, durationMinutes: 120, maxBackgrounds: 5 },
            "Gold": { price: 7000000, durationMinutes: 120, maxBackgrounds: 5 }
        },
        "Studio Rental": {
            "Wood": { price: 1000000, durationMinutes: 180, maxBackgrounds: 99, isFlexible: true },
            "Silver": { price: 2000000, durationMinutes: 180, maxBackgrounds: 99, isFlexible: true },
            "Gold": { price: 2500000, durationMinutes: 360, maxBackgrounds: 99, isFlexible: true },
            "Platinum": { price: 3000000, durationMinutes: 720, maxBackgrounds: 99, isFlexible: true }
        }
    },
    "Cideng": {
        "Studio Rental": {
            "Silver": { price: 500000, durationMinutes: 60, maxBackgrounds: 99, isFlexible: true },
            "Gold": { price: 1500000, durationMinutes: 60, maxBackgrounds: 99, isFlexible: true }
        }
    }
};

const getCategoryTierPrice = (branch, category, tier) => {
    const targetBranch = branch || 'Karawaci';
    const branchRule = LOMOTO_PRICE_LIST_2024[targetBranch];
    if (branchRule) {
        const categoryRule = branchRule[category];
        if (categoryRule) {
            const tierRule = categoryRule[tier];
            if (tierRule && tierRule.price !== undefined) {
                return tierRule.price;
            }
        }
    }
    
    const fallbackTierPricing = { Wood: 400000, Silver: 850000, Gold: 1250000, Platinum: 2500000 };
    return fallbackTierPricing[tier] !== undefined ? fallbackTierPricing[tier] : 400000;
};

const getCategoryTierConstraints = (category, tier, branch = 'Karawaci') => {
    const defaultVal = { durationMinutes: 120, maxBackgrounds: 2, isFlexible: false };
    
    const targetBranch = branch || 'Karawaci';
    const branchRule = LOMOTO_PRICE_LIST_2024[targetBranch];
    if (!branchRule) return defaultVal;
    
    const categoryRule = branchRule[category];
    if (!categoryRule) return defaultVal;
    
    const tierRule = categoryRule[tier] || categoryRule["Wood"] || categoryRule["Silver"];
    if (!tierRule) return defaultVal;
    
    return {
        durationMinutes: tierRule.durationMinutes !== undefined ? tierRule.durationMinutes : 120,
        maxBackgrounds: tierRule.maxBackgrounds !== undefined ? tierRule.maxBackgrounds : 2,
        isFlexible: tierRule.isFlexible !== undefined ? tierRule.isFlexible : false
    };
};

const PACKAGE_TEMPLATES = {
  'Personal / Maternity Portrait': { Wood: '5 Edited Photos', Silver: '10 Edited Photos', Gold: 'All Original' },
  'Prewedding / Couple': { Wood: '10 Edited, 1 Print', Silver: '20 Edited, 2 Print', Gold: 'All Original + Album' }
};

const formatCurrency = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

// --- OPTIONS ---
const BRANCHES = ['Karawaci', 'Cideng'];
const CATEGORIES = ["Personal / Maternity Portrait", "Prewedding / Couple", "Family / Graduation / Friendship", "Yearbook / Corporate Group", "Product Photography", "Studio Rental"];
const TIERS = ['Wood', 'Silver', 'Gold', 'Platinum'];

let studioSettings = {
  "karawaci": { jamBuka: "08:00 WIB", jamTutup: "22:00 WIB", status: "Buka" },
  "cideng": { jamBuka: "08:00 WIB", jamTutup: "22:00 WIB", status: "Buka" }
};

const savedSettings = localStorage.getItem('studioSettings');
if (savedSettings) {
  try {
    const parsed = JSON.parse(savedSettings);
    if (parsed) {
      if (parsed["karawaci"]) studioSettings["karawaci"] = parsed["karawaci"];
      if (parsed["cideng"]) studioSettings["cideng"] = parsed["cideng"];
      if (parsed["gading-serpong"] && !parsed["cideng"]) {
        studioSettings["cideng"] = parsed["gading-serpong"];
      }
    }
  } catch(e) {
    console.error("Gagal memuat studioSettings dari localStorage, menggunakan default.", e);
  }
}

let studioOperational = {
  open: studioSettings["karawaci"]?.jamBuka || '08:00 WIB',
  close: studioSettings["karawaci"]?.jamTutup || '22:00 WIB'
};

let blackoutDatesState = [
  { start: '2024-06-10', end: '2024-06-12', reason: 'Renovasi Studio', branches: ['karawaci', 'cideng'] },
  { start: '2024-06-25', end: '2024-06-25', reason: 'Private Event', branches: ['karawaci'] }
];

const savedBlackouts = localStorage.getItem('blackoutDatesState');
if (savedBlackouts) {
    try {
        const parsedB = JSON.parse(savedBlackouts);
        if (Array.isArray(parsedB)) {
            blackoutDatesState = parsedB;
        }
    } catch(e) {
        console.error("Gagal memuat blackoutDatesState dari localStorage, menggunakan default.", e);
    }
}

const getAvailableTimeOptions = (branch = null) => {
    let targetBranch = branch;
    if (!targetBranch && window.addBookingState && window.addBookingState.branch) {
        targetBranch = window.addBookingState.branch;
    }
    if (!targetBranch) targetBranch = 'Karawaci';
    
    let bKey = targetBranch.toLowerCase().replace(/\s/g, '-');
    if (bKey !== 'cideng' && bKey !== 'karawaci') {
        bKey = 'karawaci';
    }
    
    const settings = studioSettings[bKey] || { jamBuka: "08:00 WIB", jamTutup: "22:00 WIB", status: "Buka" };
    const jamBukaStr = settings.jamBuka || "08:00 WIB";
    const jamTutupStr = settings.jamTutup || "22:00 WIB";
    
    const openHour = parseInt(jamBukaStr.split(':')[0]);
    const closeHour = parseInt(jamTutupStr.split(':')[0]);
    const options = [];
    for (let h = openHour; h <= closeHour; h++) {
        options.push(`${String(h).padStart(2, '0')}:00 WIB`);
    }
    return options;
};

const checkBlackoutCollisions = (dateStr, branch = null) => {
    if (!dateStr) return null;
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);
    
    return blackoutDatesState.find(b => {
        const start = new Date(b.start);
        start.setHours(0, 0, 0, 0);
        const end = new Date(b.end);
        end.setHours(0, 0, 0, 0);
        const dateMatch = targetDate >= start && targetDate <= end;
        if (!dateMatch) return false;
        
        if (branch) {
            const bKey = branch.toLowerCase().trim();
            if (!b.branches || b.branches.length === 0) {
                return true;
            }
            return b.branches.some(br => br.toLowerCase() === bKey);
        }
        return true;
    });
};

const getBlackoutBranchesBadge = (b) => {
    if (!b.branches || b.branches.length === 0 || b.branches.length === 2) {
        return `<span class="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[9px] font-black uppercase tracking-tight shrink-0">Semua Cabang</span>`;
    }
    return b.branches.map(br => {
        if (br.toLowerCase() === 'karawaci') {
            return `<span class="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-[9px] font-black uppercase tracking-tight shrink-0">Karawaci</span>`;
        } else if (br.toLowerCase() === 'cideng') {
            return `<span class="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-[9px] font-black uppercase tracking-tight shrink-0">Cideng</span>`;
        }
        return `<span class="px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-tight shrink-0">${br}</span>`;
    }).join(' ');
};

let TIME_OPTIONS = getAvailableTimeOptions();

const calculateDisplayTimeRange = (reservation) => {
    const startTimeStr = reservation.time; // Expecting "HH:mm WIB" or "HH:mm"
    const parts = startTimeStr.split(':');
    const startHour = parseInt(parts[0]);
    let startMin = 0;
    if (parts[1]) {
        startMin = parseInt(parts[1].split(' ')[0]);
    }
    if (isNaN(startHour)) return startTimeStr;

    // Use category and tier rules
    const { durationMinutes } = getCategoryTierConstraints(reservation.category, reservation.tier, reservation.branch);
    
    // Total minutes
    let totalMinutes = durationMinutes;
    
    const startTotalMini = (startHour * 60) + startMin;
    const endTotalMini = startTotalMini + totalMinutes;
    
    const endHour = Math.floor(endTotalMini / 60);
    const endMin = endTotalMini % 60;
    
    return `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')} - ${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')} WIB`;
};

const BACKGROUND_OPTIONS = {
    'Karawaci': {
        'Wallpaper Background': ['Biru Muda', 'Coklat Taupe', 'Coklat Muda', 'Abu Tua', 'Hitam', 'Hijau Tosca', 'Coklat', 'Pink', 'Ungu', 'Hijau'],
        'Tematik Set Studio': [
            'Red Gold Chinese',
            'Blue Classic',
            'Classic Chinese',
            'Valentine Floral',
            'Vintage Flower',
            'Simple Wood',
            'Bohemian',
            'Kitchen ',
            'Clean Set',
            'Ramadhan Kareem'
        ],
        'Pilih Nanti Di Tempat': null
    },
    'Cideng': {
        'Set Tema Eksklusif': [
            'Royal',
            'White Limbo',
            'Wooden',
            'Vintage',
            'Wardroberoom',
            'Bathtub',
            'Pilih Nanti Di Tempat'
        ]
        
    }
};

const BRANCH_BUSINESS_RULES = {
    'Karawaci': {
        categories: [
            "Personal / Maternity Portrait",
            "Prewedding / Couple",
            "Family / Graduation / Friendship",
            "Yearbook / Corporate Group",
            "Product Photography",
            "Studio Rental"
        ],
        getTiers: (category) => category === 'Studio Rental' 
            ? ['Wood', 'Silver', 'Gold', 'Platinum'] 
            : ['Wood', 'Silver', 'Gold']
    },
    'Cideng': {
        categories: ['Studio Rental'],
        getTiers: (category) => ['Silver', 'Gold']
    }
};
const AVAILABLE_ADDONS = [
    { id: 'add-1', name: 'MUA', price: 250000 },
    { id: 'add-2', name: 'Videografer', price: 450000 },
    { id: 'add-3', name: 'Busana', price: 350000 }
];

// --- AUTH LOGIC ---
const handleLogin = async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  try {
    // Kembalikan ke port 8000
const response = await fetch('http://127.0.0.1:8000/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({ email, password })
});

    const data = await response.json();

    if (response.ok && data.success) {
        console.log("✓ Login Manual Berhasil:", data.message);
        isLoggedIn = true; 
        
        if (errorEl) errorEl.classList.add('hidden');
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-dashboard').classList.remove('hidden');
        
        // Memuat data reservasi Lomoto Studio dari database
        await refreshReservationsFromBackend();

        switchTab('dashboard');

        // Reset form
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
        
    } else {
        const loginErrorMessage = data.message || "Email atau password salah.";
        console.warn("❌ Login Gagal:", loginErrorMessage);
        
        if (errorEl) {
            errorEl.innerText = loginErrorMessage;
            errorEl.classList.remove('hidden');
        }
        
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.classList.add('animate-shake');
            setTimeout(() => loginForm.classList.remove('animate-shake'), 500);
        }
    }
  } catch (error) {
    console.error("❌ Gagal koneksi ke server database:", error);
    alert("Gagal terhubung ke server backend. Pastikan 'php artisan serve --port=8080' Anda menyala!");
  }
};

const handleLogout = () => {
  isLoggedIn = false;
  document.getElementById('main-dashboard').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-password').value = '';
};

// --- RENDERERS ---
// === DASHBOARD VIEW START ===
const renderDashboard = () => {
    // 1. Dapatkan tanggal hari ini dalam format lokal Indonesia 'YYYY-MM-DD' menggunakan JavaScript (Zona waktu Asia/Jakarta)
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour12: false
    });
    const parts = formatter.formatToParts(new Date());
    const year = parts.find(p => p.type === 'year').value;
    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;
    const todayDateStr = `${year}-${month}-${day}`;

    // Kartu 1: Booking Hari Ini
    const todayBookings = bookingState.filter(r => (r.date === todayDateStr || r.tanggal_foto === todayDateStr || r.tanggal === todayDateStr) && r.status !== 'cancelled');
    const bookingHariIniCount = todayBookings.length;
    
    // Calculate subtext compared with yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour12: false
    });
    const yParts = yFormatter.formatToParts(yesterday);
    const yYear = yParts.find(p => p.type === 'year').value;
    const yMonth = yParts.find(p => p.type === 'month').value;
    const yDay = yParts.find(p => p.type === 'day').value;
    const yesterdayDateStr = `${yYear}-${yMonth}-${yDay}`;
    const yesterdayBookingsCount = bookingState.filter(r => (r.date === yesterdayDateStr || r.tanggal_foto === yesterdayDateStr || r.tanggal === yesterdayDateStr) && r.status !== 'cancelled').length;
    
    let subBookingHariIni = "+0 dibanding kemarin";
    if (bookingHariIniCount > yesterdayBookingsCount) {
        subBookingHariIni = `+${bookingHariIniCount - yesterdayBookingsCount} dari kemarin`;
    } else if (bookingHariIniCount < yesterdayBookingsCount) {
        subBookingHariIni = `-${yesterdayBookingsCount - bookingHariIniCount} dari kemarin`;
    } else {
        subBookingHariIni = "Sama seperti kemarin";
    }

    // Kartu 2: Menunggu Persetujuan
    const pendingOrLocalReservations = bookingState.filter(r => {
        const isPending = r.status && r.status.toLowerCase() === 'pending';
        const isLocal = r.googleSynced === false;
        return isPending || isLocal;
    });
    const pendingOrLocalCount = pendingOrLocalReservations.length;
    const pendingCount = bookingState.filter(r => r.status && r.status.toLowerCase() === 'pending').length;
    const localCount = bookingState.filter(r => r.googleSynced === false).length;
    const subPendingOrLocal = `${pendingCount} Pending • ${localCount} Local`;

    const stats = [
        { label: 'Booking Hari Ini', val: bookingHariIniCount, sub: subBookingHariIni, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'blue' },
        { label: 'Menunggu Persetujuan', val: pendingOrLocalCount, sub: subPendingOrLocal, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'amber' }
    ];

    window.activeDashboardBranchStatus = window.activeDashboardBranchStatus || 'karawaci';
    const activeDashboardBranch = window.activeDashboardBranchStatus;
    const settings = studioSettings[activeDashboardBranch] || { jamBuka: '08:00 WIB', jamTutup: '22:00 WIB', status: 'Buka' };
    const isClosedByStatus = settings.status === 'Tutup';

    // Find if today features a blackout and find closest upcoming blackout date
    const todayBlackout = checkBlackoutCollisions(todayDateStr, activeDashboardBranch);

    let studioOperationalStatusText = '';
    let studioOperationalStatusThemeClass = '';
    let studioSubReasonText = '';

    if (todayBlackout || isClosedByStatus) {
        studioOperationalStatusText = '🔴 CLOSED';
        studioOperationalStatusThemeClass = 'bg-rose-50 border border-rose-100 text-rose-800';
        studioSubReasonText = todayBlackout 
            ? `Studio sedang tutup hari ini karena: <b class="font-black">${todayBlackout.reason}</b>.`
            : `Studio dinonaktifkan / tutup manual oleh admin untuk cabang ${activeDashboardBranch === 'karawaci' ? 'Karawaci' : 'Cideng'}.`;
    } else {
        studioOperationalStatusText = '🟢 OPEN - Menerima Reservasi';
        studioOperationalStatusThemeClass = 'bg-emerald-50 border border-emerald-100 text-emerald-800';
        studioSubReasonText = 'Tidak ada halangan blackout hari ini. Seluruh pemesanan beroperasi normal.';
    }

    // Find closest upcoming blackout date starting of tomorrow
    const todayStart = new Date(todayDateStr);
    todayStart.setHours(0,0,0,0);
    
    let upcomingBlackout = null;
    let minDiff = Infinity;
    blackoutDatesState.forEach(b => {
        const startStr = b.start || b.startDate;
        if (!startStr) return;
        const startD = new Date(startStr);
        startD.setHours(0,0,0,0);
        if (startD > todayStart) {
            // Check if this blackout applies to the active dashboard branch
            if (activeDashboardBranch) {
                const bKey = activeDashboardBranch.toLowerCase().trim();
                if (b.branches && b.branches.length > 0 && !b.branches.some(br => br.toLowerCase() === bKey)) {
                    return;
                }
            }
            const diff = startD.getTime() - todayStart.getTime();
            if (diff < minDiff) {
                minDiff = diff;
                upcomingBlackout = b;
            }
        }
    });

    let blackoutAlertHtml = '';
    if (upcomingBlackout) {
        blackoutAlertHtml = `
            <div class="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 text-amber-800">
                <span class="text-lg">⚠️</span>
                <div>
                    <span class="text-xs font-black uppercase tracking-wider block">Jadwal Blackout Terdekat Terdeteksi!</span>
                    <p class="text-[11px] font-medium text-amber-600 mt-0.5">Studio akan ditutup dari tanggal <b class="font-bold">${upcomingBlackout.start || upcomingBlackout.startDate}</b> s/d <b class="font-bold">${upcomingBlackout.end || upcomingBlackout.endDate}</b> karena: <b class="font-black uppercase">${upcomingBlackout.reason}</b>.</p>
                </div>
            </div>
        `;
    } else {
        blackoutAlertHtml = `
            <div class="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-800">
                <span class="text-lg">✅</span>
                <div>
                    <span class="text-xs font-black uppercase tracking-wider block">Kalender Beroperasi Penuh</span>
                    <p class="text-[11px] font-medium text-emerald-600 mt-0.5">Tidak ada tanggal blackout mendatang. Seluruh pemesanan offline & online dapat diterima.</p>
                </div>
            </div>
        `;
    }

    const recentBookings = bookingState.slice(0, 3);

    const content = `
        <!-- === 2 KARTU STATISTIK UTAMA (DIATAS) === -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-5">
            ${stats.map(s => `
                <div class="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all">
                    <div class="flex justify-between items-start mb-4">
                        <div class="p-3 bg-${s.color}-50 text-${s.color}-600 rounded-xl">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${s.icon}"></path></svg>
                        </div>
                        <span class="text-[10px] font-bold text-${s.color}-600 bg-${s.color}-50 px-2 py-1 rounded-lg">AKTIF</span>
                    </div>
                    <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">${s.label}</p>
                    <h3 class="text-2xl font-black text-slate-900 mt-1">${s.val}</h3>
                    <p class="text-[10px] font-bold text-slate-500 mt-1 pl-1">${s.sub}</p>
                </div>
            `).join('')}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <!-- Left Column: Blok Kontrol Operasional & Grafik -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Today's Operational Status Widget -->
                <div class="bg-white p-8 rounded-[2rem] border border-[#E2E8F0] shadow-sm">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div class="flex items-center gap-2">
                            <div class="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-black text-slate-800 text-sm uppercase tracking-wider">Today's Operational Status</h3>
                                <p class="text-[10px] font-bold text-slate-400">Cabang: <span class="text-blue-600 font-extrabold uppercase">${activeDashboardBranch}</span></p>
                            </div>
                        </div>
                        
                        <!-- Quick switcher tab -->
                        <div class="flex gap-1 bg-slate-100 p-1 rounded-xl">
                            <button onclick="window.setDashboardStatusBranch('karawaci')" class="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-tight transition-all duration-200 ${activeDashboardBranch === 'karawaci' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-700'}">Karawaci</button>
                            <button onclick="window.setDashboardStatusBranch('cideng')" class="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-tight transition-all duration-200 ${activeDashboardBranch === 'cideng' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-700'}">Cideng</button>
                        </div>
                    </div>
                    <p class="text-xs text-slate-400 mb-6 font-medium">Informasi parameter operasional studio Lomoto yang terhubung langsung dengan setelan master spesifik per cabang di tab Studio Settings.</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Operational Hours Details -->
                        <div class="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                            <div>
                                <span class="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Jam Kerja Aktif Hari Ini</span>
                                <div class="text-lg font-black text-slate-800 mt-1 font-mono">${settings.jamBuka} - ${settings.jamTutup}</div>
                            </div>
                            <div class="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl font-black text-[9px] uppercase tracking-wider shrink-0 font-mono">
                                ONLINE SERVICE
                            </div>
                        </div>
 
                        <!-- Today's Status Widget -->
                        <div class="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                            <div>
                                <span class="text-[9px] font-black uppercase text-slate-400 tracking-widest block">Status Layanan Studio</span>
                                <div class="text-base font-black text-slate-800 mt-1 font-mono uppercase tracking-wide">
                                    ${studioOperationalStatusText}
                                </div>
                            </div>
                            <div class="px-3 py-1.5 ${todayBlackout || isClosedByStatus ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'} rounded-xl font-black text-[9px] uppercase tracking-wider shrink-0 text-center font-mono">
                                ${todayBlackout || isClosedByStatus ? 'RESTRICTED' : 'NORMAL SERVICE'}
                            </div>
                        </div>
                    </div>
 
                    <!-- Description / Reason subtext -->
                    <div class="mt-4 p-4 rounded-2xl text-xs font-medium ${todayBlackout || isClosedByStatus ? 'bg-rose-50 border border-rose-100 text-rose-800 animate-pulse' : 'bg-slate-50 border border-slate-100 text-slate-600'}">
                        ${studioSubReasonText}
                    </div>
                </div>

                <!-- Green/Amber alert card tepat di bawahnya -->
                ${blackoutAlertHtml}

                <!-- Grafik Monthly Trend -->
                <div class="bg-white p-8 rounded-[2rem] border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="font-black text-slate-800 text-sm uppercase tracking-wider">Grafik Monthly Trend</h3>
                            <div id="chart-month-label" class="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500"></div>
                        </div>
                        <p class="text-xs text-slate-400 mb-6 font-medium">Tren gabungan total orderan dari Cabang <b>Karawaci</b> & <b>Cideng</b> sepanjang bulan berjalan.</p>
                    </div>
                    <div class="h-[280px]"><canvas id="main-chart"></canvas></div>
                </div>
            </div>

            <!-- Right Column: Recent Activity (Actual State Sync, Max 3 items) -->
            <div class="lg:col-span-1">
                <div class="bg-white p-8 rounded-[2rem] border border-[#E2E8F0] shadow-sm flex flex-col justify-start h-full">
                    <h3 class="font-black text-slate-800 text-sm uppercase tracking-wider mb-2">Recent Activity</h3>
                    <p class="text-xs text-slate-400 mb-6 font-medium">Reservasi riil terbaru yang masuk ke database sistem.</p>
                    <div class="space-y-4 flex-1">
                        ${recentBookings.length === 0 ? `
                            <div class="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-tight">Tidak Ada Aktivitas Terbaru</div>
                        ` : recentBookings.map(r => {
                            const isConfirmed = r.status === 'confirmed';
                            const isPending = r.status === 'pending';
                            const badgeClass = isConfirmed 
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                : isPending 
                                    ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                    : 'bg-slate-50 text-slate-400 border border-slate-200';
                            return `
                                <div class="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all">
                                    <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs uppercase shrink-0">
                                        ${r.customerName ? r.customerName.charAt(0) : 'K'}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-black text-slate-800 truncate">${r.customerName}</p>
                                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wide truncate mt-0.5">${r.category} • ${r.time} • ${r.branch}</p>
                                    </div>
                                    <div class="shrink-0 text-right">
                                        <span class="px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider ${badgeClass}">${r.status}</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('content-area').innerHTML = content;

    // Inject Indonesian active month & year dynamic labels
    const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const sekarang = new Date();
    const bulanSekarang = namaBulan[sekarang.getMonth()]; 
    const tahunSekarang = sekarang.getFullYear(); 
    const chartLabel = document.getElementById("chart-month-label");
    if (chartLabel) {
        chartLabel.innerText = `${bulanSekarang} ${tahunSekarang}`;
    }

    window.initLomotoChart();
};

window.setDashboardStatusBranch = (branchVal) => {
    window.activeDashboardBranchStatus = branchVal;
    renderDashboard();
    window.renderOrUpdateChart();
    window.refreshChartData();
};
// === DASHBOARD VIEW END ===

// --- NOTIFICATION BELL FLOW ---
let notificationsRead = false;

window.renderNotifications = () => {
    const listEl = document.getElementById('notification-list');
    if (!listEl) return;

    // 1. Notifikasi Booking Baru (Mengambil data terbaru berstatus 'Pending')
    const pendingBookings = bookingState.filter(r => r.status && r.status.toLowerCase() === 'pending');
    let bookingNotifHtml = '';
    if (pendingBookings.length > 0) {
        const latest = pendingBookings[0];
        bookingNotifHtml = `
            <div class="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all">
                <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-xs">
                    📅
                </div>
                <div class="flex-1 text-xs">
                    <p class="font-black text-slate-800 uppercase tracking-wide text-[10px]">Booking Pending Baru</p>
                    <p class="text-slate-500 mt-0.5">Klien <strong class="font-bold">${latest.customerName}</strong> mengajukan <strong class="font-bold text-blue-600">${latest.category}</strong> (${latest.branch}) pada ${latest.date} ${latest.time}.</p>
                </div>
            </div>
        `;
    } else {
        bookingNotifHtml = `
            <div class="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all">
                <div class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 text-xs">
                    ✓
                </div>
                <div class="flex-1 text-xs">
                    <p class="font-black text-slate-400 uppercase tracking-wide text-[10px]">Review Booking Selesai</p>
                    <p class="text-slate-400 mt-0.5 font-medium">Semua permohonan reservasi baru berhasil ditinjau oleh sistem.</p>
                </div>
            </div>
        `;
    }

    // 2. Notifikasi Pengingat Operasional (Mengambil data tanggal blokir terdekat dari blackoutDatesState)
    const today = new Date();
    today.setHours(0,0,0,0);
    let upcomingBlackout = null;
    let minDiff = Infinity;
    blackoutDatesState.forEach(b => {
        const startStr = b.start || b.startDate;
        if (!startStr) return;
        const startD = new Date(startStr);
        startD.setHours(0,0,0,0);
        if (startD >= today) {
            const diff = startD.getTime() - today.getTime();
            if (diff < minDiff) {
                minDiff = diff;
                upcomingBlackout = b;
            }
        }
    });

    let blackoutNotifHtml = '';
    if (upcomingBlackout) {
        const branchesLabel = upcomingBlackout.branches && upcomingBlackout.branches.length > 0
            ? upcomingBlackout.branches.map(b => b.charAt(0).toUpperCase() + b.slice(1)).join(', ')
            : 'Semua Cabang';
        blackoutNotifHtml = `
            <div class="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all">
                <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 text-xs">
                    ⚠️
                </div>
                <div class="flex-1 text-xs">
                    <p class="font-black text-slate-800 uppercase tracking-wide text-[10px]">Tanggal Blackout Terdekat</p>
                    <p class="text-slate-500 mt-0.5">Studio akan ditutup dari <strong class="font-bold text-amber-700">${upcomingBlackout.start || upcomingBlackout.startDate}</strong> s/d <strong class="font-bold text-amber-700">${upcomingBlackout.end || upcomingBlackout.endDate}</strong> karena <strong class="font-black">${upcomingBlackout.reason} [${branchesLabel}]</strong>.</p>
                </div>
            </div>
        `;
    } else {
        blackoutNotifHtml = `
            <div class="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all">
                <div class="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 text-xs">
                    ⚙️
                </div>
                <div class="flex-1 text-xs">
                    <p class="font-black text-slate-400 uppercase tracking-wide text-[10px]">Operasional Terjadwal</p>
                    <p class="text-slate-400 mt-0.5 font-medium">Jadwal operasional berjalan lancar, tidak ada tanggal blackout terdekat terdeteksi.</p>
                </div>
            </div>
        `;
    }

    // 3. Notifikasi Status Sistem (Simulasi pesan sukses/gagal sinkronisasi Google Calendar)
    const unsyncedCount = bookingState.filter(r => r.googleSynced === false).length;
    let syncNotifHtml = '';
    if (unsyncedCount > 0) {
        syncNotifHtml = `
            <div class="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all">
                <div class="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 text-xs">
                    💡
                </div>
                <div class="flex-1 text-xs">
                    <p class="font-black text-slate-800 uppercase tracking-wide text-[10px]">Gagal Sinkronisasi Google</p>
                    <p class="text-orange-600 mt-0.5 font-medium">Perhatian: Ada <strong class="font-bold">${unsyncedCount} reservasi lokal</strong> yang belum disinkronisasi ke Google Calendar!</p>
                </div>
            </div>
        `;
    } else {
        syncNotifHtml = `
            <div class="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all">
                <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 text-xs">
                    ✓
                </div>
                <div class="flex-1 text-xs">
                    <p class="font-black text-slate-800 uppercase tracking-wide text-[10px]">Sinkronisasi Kalender Sukses</p>
                    <p class="text-slate-500 mt-0.5 font-medium">Sistem sinkronisasi Google Calendar berjalan sukses dan aktif.</p>
                </div>
            </div>
        `;
    }

    listEl.innerHTML = `
        ${bookingNotifHtml}
        <hr class="border-slate-100 my-1">
        ${blackoutNotifHtml}
        <hr class="border-slate-100 my-1">
        ${syncNotifHtml}
    `;

    // Handle initial badge rendering based on unread status
    const badgeEl = document.getElementById('notification-badge');
    if (badgeEl) {
        if (notificationsRead) {
            badgeEl.classList.add('hidden');
        } else {
            badgeEl.classList.remove('hidden');
        }
    }
};

window.toggleNotificationDropdown = () => {
    const dropdown = document.getElementById('notification-dropdown');
    const badge = document.getElementById('notification-badge');
    if (!dropdown) return;
    
    const isHidden = dropdown.classList.toggle('hidden');
    if (!isHidden) {
        // Opened! Hilangkan titik merah (red dot badge)
        notificationsRead = true;
        if (badge) badge.classList.add('hidden');
        window.renderNotifications();
    }
};

window.clearAllNotifications = () => {
    notificationsRead = true;
    const badge = document.getElementById('notification-badge');
    if (badge) badge.classList.add('hidden');
    window.renderNotifications();
};

window.getFilteredReservationsList = () => {
    // PERBAIKAN: Gunakan bookingState (data riil dari backend), bukan bookingState
    let filtered = bookingState.filter(r => {
        const matchesBranch = currentBranchFilter === 'Semua Cabang' || r.branch === currentBranchFilter;
        const matchesStatus = currentStatusFilter === 'Semua Status' || r.status === currentStatusFilter;
        const matchesDate = currentDateFilter === '' || r.date === currentDateFilter;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = (r.customerName || '').toLowerCase().includes(searchLower) || 
                            (r.id || '').toLowerCase().includes(searchLower) ||
                            (r.phone || '').includes(searchQuery);
        return matchesBranch && matchesStatus && matchesDate && matchesSearch;
    });

    // Sort Logic
    filtered.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return currentSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
};

async function refreshReservationsFromBackend() {
    try {
        console.log("Memulai koneksi ke API Laravel...");
        
        const response = await fetch('http://localhost:8000/api/reservations', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Server merespon dengan status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data mentah dari database diterima:", data);

        if (Array.isArray(data) && data.length > 0) {
            
            // === PERBAIKAN DI SINI: Mengisi array const dengan aman ===
            bookingState.length = 0; 
            bookingState.push(...data.map(r => {
                return {
                    id: r.id != null ? Number(r.id) : 'BK-UNKNOWN',
                    customerName: r.client_name || 'Tanpa Nama',
                    category: mapCategory(r.category),
                    tier: r.tier || 'Wood',
                    branch: r.branch || 'Karawaci',
                    backgrounds: r.background
                        ? r.background.split(',').map(b => sanitizeBackgroundName(b.trim())).filter(Boolean)
                        : [],
                    email: r.email || '',
                    date: r.booking_date || '2026-01-01',
                    time: r.booking_time || '10:00 WIB',
                    status: r.status || 'pending',
                    totalPrice: parseInt(r.total_price) || 0,
                    phone: r.client_whatsapp || '',
                    proof: null,
                    addOns: (() => {
                        if (!r.add_ons) return [];
                        // DB menyimpan add_ons sebagai string "MUA, Videografer"
                        // Pecah ke array dan cocokan harganya dari AVAILABLE_ADDONS
                        return r.add_ons.split(',').map(name => {
                            const trimmed = name.trim();
                            const known = (typeof AVAILABLE_ADDONS !== 'undefined')
                                ? AVAILABLE_ADDONS.find(a => a.name === trimmed)
                                : null;
                            return { name: trimmed, price: known ? known.price : 0 };
                        }).filter(a => a.name.length > 0);
                    })()
                };
            }));
            // ========================================================

            console.log("✓ Sukses Sinkronisasi! Berhasil memuat data riil dari database Laravel MySQL.");
            
            renderDashboard();
        } else {
            console.log("API mengembalikan data kosong [], menggunakan mock data default.");
        }

    } catch (error) {
        console.error("❌ Gagal menyambung ke Backend Laravel. Error detail:", error.message);
        console.log("Menjalankan Mode Offline: Menggunakan data mock lokal.");
    }
}

window.getBookingTableRowsHtml = (filteredReservations) => {
    return filteredReservations.length > 0 ? filteredReservations.map(r => `
        <tr class="hover:bg-slate-50/50 transition-colors">
            <td class="px-6 py-4 font-mono text-xs font-bold text-blue-600">${r.id}</td>
            <td class="px-6 py-4">
                <p class="text-sm font-bold text-slate-900">${r.customerName}</p>
                <p class="text-[10px] text-slate-400 font-medium">${formatCurrency(r.totalPrice)}</p>
            </td>
            <td class="px-6 py-4">
                <p class="text-xs font-bold text-slate-600">${r.branch}</p>
            </td>
            <td class="px-6 py-4">
                <span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">${r.category}</span>
            </td>
             <td class="px-6 py-4">
                 <p class="text-xs font-bold text-slate-800">${r.date}</p>
                 <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">${calculateDisplayTimeRange(r)}</p>
             </td>
            <td class="px-6 py-4 text-center">
                <div class="flex flex-col items-center gap-1.5">
                    <span class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusClass(r.status)}">${r.status}</span>
                    <div class="flex items-center gap-1 opacity-70 cursor-pointer hover:opacity-100 transition-opacity" 
                         title="${r.googleSynced === false ? 'Mode Uji: Hanya disimpan lokal' : 'Terintegrasi dengan Kalender: Aktif'}"
                         onclick="alert('${r.googleSynced === false ? 'Mode Uji: Hanya disimpan lokal' : 'Terintegrasi dengan Kalender: Aktif'}')">
                        <div class="w-1.5 h-1.5 rounded-full ${r.googleSynced === false ? 'bg-orange-500' : 'bg-blue-500'} animate-pulse"></div>
                        <span class="text-[8px] font-black text-slate-500 uppercase tracking-tighter">${r.googleSynced === false ? 'Local Only' : 'Synced'}</span>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                    <button onclick="window.openDetailModal(${r.id})" class="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-lg transition-all" title="Melihat Detail">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button onclick="window.openEditModal(${r.id})" class="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all" title="Edit Reservasi">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <a href="https://wa.me/${r.phone}" target="_blank" class="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all" title="Hubungi WA">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    </a>
                </div>
            </td>
        </tr>
    `).join('') : `
        <tr>
            <td colspan="7" class="px-6 py-12 text-center text-slate-400 font-medium">Data tidak ditemukan.</td>
        </tr>
    `;
};

window.filterBookingTable = (val) => {
    searchQuery = val;
    const filteredRes = window.getFilteredReservationsList();
    const tbody = document.getElementById('booking-table-body');
    if (tbody) {
        tbody.innerHTML = window.getBookingTableRowsHtml(filteredRes);
    }
};

window.filterTable = (val) => {
    window.filterBookingTable(val);
};

const renderBookingManagement = () => {
    bookingState.forEach(r => {
        if (!r.googleSync) r.googleSync = 'Synced';
    });
    let filteredReservations = window.getFilteredReservationsList();

    const content = `
        <div class="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm">
            <!-- Header with Primary Action -->
            <div class="p-8 border-b border-slate-100 bg-white">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div class="flex items-center gap-3 mb-1">
                            <div class="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                            </div>
                            <h2 class="text-2xl font-black text-slate-900 tracking-tighter">Manajemen Reservasi</h2>
                        </div>
                        <p class="text-xs text-slate-400 font-bold uppercase tracking-widest pl-1">Kelola Jadwal & Status Booking Klien</p>
                        <p class="text-[10px] text-blue-600 font-black uppercase tracking-widest pl-1 mt-1.5 flex items-center gap-1.5 bg-blue-50/50 border border-blue-100/30 w-fit px-3 py-1 rounded-xl">
                            <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            ⚙️ Google API Mode: Active / Synced
                        </p>
                    </div>
                    <button id="open-add-booking-btn" class="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] text-sm font-black shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 group">
                        <div class="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                        TAMBAH BOOKING BARU
                    </button>
                </div>
            </div>

            <!-- Integrated Filter Bar -->
            <div class="p-6 border-b border-slate-50 bg-[#F8FAFC]/50 space-y-5">
               <div class="flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div class="relative w-full lg:w-[32rem]">
                         <input type="text" id="booking-search" oninput="window.filterBookingTable(this.value)" value="${searchQuery}" placeholder="Cari Nama, Nomor WA, atau ID Booking..." class="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all bg-white shadow-sm placeholder:text-slate-300">
                         <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <div class="flex items-center gap-3 w-full lg:w-auto">
                        <div class="relative flex-1 lg:flex-none min-w-[200px]">
                            <select id="date-sort" class="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-blue-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none cursor-pointer shadow-sm uppercase tracking-tight">
                                <option value="asc" ${currentSortOrder === 'asc' ? 'selected' : ''}>Urutkan: Terdekat</option>
                                <option value="desc" ${currentSortOrder === 'desc' ? 'selected' : ''}>Urutkan: Terjauh</option>
                            </select>
                            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
               </div>

               <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="space-y-1.5">
                        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Cabang Studio</label>
                        <div class="relative">
                            <select id="branch-filter" class="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-blue-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer shadow-sm appearance-none">
                                <option value="Semua Cabang" ${currentBranchFilter === 'Semua Cabang' ? 'selected' : ''}>Semua Cabang</option>
                                ${BRANCHES.map(b => `<option value="${b}" ${currentBranchFilter === b ? 'selected' : ''}>${b}</option>`).join('')}
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Status Reservasi</label>
                        <div class="relative">
                            <select id="status-filter" class="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-blue-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer shadow-sm appearance-none">
                                <option value="Semua Status" ${currentStatusFilter === 'Semua Status' ? 'selected' : ''}>Semua Status</option>
                                <option value="pending" ${currentStatusFilter === 'pending' ? 'selected' : ''}>Pending (Kuning)</option>
                                <option value="confirmed" ${currentStatusFilter === 'confirmed' ? 'selected' : ''}>Confirmed (Hijau)</option>
                                <option value="cancelled" ${currentStatusFilter === 'cancelled' ? 'selected' : ''}>Cancelled (Merah)</option>
                                <option value="done" ${currentStatusFilter === 'done' ? 'selected' : ''}>Done (Biru)</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Tanggal Spesifik</label>
                        <div class="flex gap-2">
                             <input type="date" id="date-filter" value="${currentDateFilter}" class="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none shadow-sm focus:border-blue-600">
                             ${currentDateFilter ? `<button id="clear-date-filter" class="p-3 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg></button>` : ''}
                        </div>
                    </div>
               </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-[#F8FAFC] text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                        <tr>
                            <th class="px-6 py-4">ID</th>
                            <th class="px-6 py-4">Klien</th>
                            <th class="px-6 py-4">Cabang</th>
                            <th class="px-6 py-4">Kategori</th>
                            <th class="px-6 py-4">Tanggal & Jam</th>
                            <th class="px-6 py-4 text-center">Status</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="booking-table-body" class="divide-y divide-slate-50">
                        ${window.getBookingTableRowsHtml(filteredReservations)}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    document.getElementById('content-area').innerHTML = content;
    document.getElementById('open-add-booking-btn').addEventListener('click', window.openAddModal);
    
    document.getElementById('branch-filter').addEventListener('change', (e) => {
        currentBranchFilter = e.target.value;
        renderBookingManagement();
    });

    document.getElementById('status-filter').addEventListener('change', (e) => {
        currentStatusFilter = e.target.value;
        renderBookingManagement();
    });

    document.getElementById('date-filter').addEventListener('change', (e) => {
        currentDateFilter = e.target.value;
        renderBookingManagement();
    });

    const clearDateBtn = document.getElementById('clear-date-filter');
    if(clearDateBtn) {
        clearDateBtn.addEventListener('click', () => {
            currentDateFilter = '';
            renderBookingManagement();
        });
    }

    document.getElementById('date-sort').addEventListener('change', (e) => {
        currentSortOrder = e.target.value;
        renderBookingManagement();
    });
};

const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

window.changeCalendarMonth = (m) => {
    currentCalendarMonth = parseInt(m);
    renderScheduleCalendar();
};

window.changeCalendarYear = (y) => {
    currentCalendarYear = parseInt(y);
    renderScheduleCalendar();
};

window.prevMonth = () => {
    if (currentCalendarMonth === 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    } else {
        currentCalendarMonth--;
    }
    renderScheduleCalendar();
};

window.nextMonth = () => {
    if (currentCalendarMonth === 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    } else {
        currentCalendarMonth++;
    }
    renderScheduleCalendar();
};

const renderScheduleCalendar = () => {
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const activeBranch = window.activeCalendarBranch || 'Karawaci';
    
    const firstDayOfMonth = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
    const startOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentCalendarYear, currentCalendarMonth, 0).getDate();

    const content = `
        <div class="bg-white rounded-[2rem] border border-[#E2E8F0] p-8 shadow-sm">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                   <div class="flex items-center gap-3 mb-1">
                        <div class="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                             <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <h3 class="font-black text-slate-900 text-2xl tracking-tighter">Schedule Calendar - Cabang ${activeBranch}</h3>
                   </div>
                   <p class="text-xs text-slate-400 font-bold uppercase tracking-widest pl-1">Periode: ${MONTH_NAMES[currentCalendarMonth]} ${currentCalendarYear}</p>
                </div>
                
                <div class="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <div class="flex gap-1.5">
                        <button onclick="window.prevMonth()" class="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">
                             <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </button>
                        <button onclick="window.nextMonth()" class="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">
                             <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </button>
                    </div>
                    <div class="h-8 w-px bg-slate-200 mx-1"></div>
                    <div class="flex gap-2">
                        <div class="relative">
                            <select onchange="window.changeCalendarMonth(this.value)" class="appearance-none bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest py-2.5 pl-4 pr-10 rounded-xl hover:border-blue-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none cursor-pointer shadow-sm">
                                ${MONTH_NAMES.map((m, i) => `<option value="${i}" ${currentCalendarMonth === i ? 'selected' : ''}>${m}</option>`).join('')}
                            </select>
                            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                        <div class="relative">
                            <select onchange="window.changeCalendarYear(this.value)" class="appearance-none bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest py-2.5 pl-4 pr-10 rounded-xl hover:border-blue-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none cursor-pointer shadow-sm">
                                ${[2024, 2025, 2026, 2027].map(y => `<option value="${y}" ${currentCalendarYear === y ? 'selected' : ''}>${y}</option>`).join('')}
                            </select>
                            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-7 gap-px bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
                ${days.map(d => `<div class="bg-slate-50 p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">${d}</div>`).join('')}
                
                ${Array.from({length: startOffset}, (_, i) => {
                    const day = daysInPrevMonth - startOffset + i + 1;
                    return `<div class="bg-slate-50/30 min-h-[140px] p-3 opacity-30 select-none"><span class="text-[10px] font-bold text-slate-300">${day}</span></div>`;
                }).join('')}

                ${Array.from({length: daysInMonth}, (_, i) => {
                    const day = i + 1;
                    const dateStr = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const bookings = bookingState.filter(r => r.date === dateStr && r.branch === activeBranch);
                    
                    return `
                        <div class="bg-white min-h-[150px] p-4 transition-all group relative border-r border-b border-slate-50 last:border-r-0">
                            <div class="flex justify-between items-start mb-3">
                                <span class="text-xs font-black ${bookings.length > 0 ? 'text-blue-600' : 'text-slate-400'}">${day}</span>
                                ${bookings.length > 0 ? `<span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>` : ''}
                            </div>
                            <div class="space-y-1.5 max-h-[100px] overflow-y-auto no-scrollbar">
                                ${bookings.map(b => `
                                    <div onclick="window.openDetailModal(${b.id})" class="px-2.5 py-1.5 rounded-xl text-[9px] font-black tracking-tight leading-tight shadow-sm cursor-help hover:scale-105 transition-transform ${b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : b.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : b.status === 'done' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}" title="${b.customerName} - ${b.time}">
                                        <div class="flex items-center gap-1">
                                            <span class="opacity-60">${b.time.split(' ')[0]}</span>
                                            <span class="truncate">${b.customerName.split(' ')[0]}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}

                ${Array.from({length: (7 - ( (startOffset + daysInMonth) % 7)) % 7}, (_, i) => {
                    const day = i + 1;
                    return `<div class="bg-slate-50/30 min-h-[140px] p-3 opacity-30 select-none"><span class="text-[10px] font-bold text-slate-300">${day}</span></div>`;
                }).join('')}
            </div>
        </div>
    `;
    document.getElementById('content-area').innerHTML = content;
};

const renderStudioSettings = () => {
    window.activeSettingsBranch = window.activeSettingsBranch || 'karawaci';
    const currentBranch = window.activeSettingsBranch;
    const settings = studioSettings[currentBranch] || { jamBuka: '08:00 WIB', jamTutup: '22:00 WIB', status: 'Buka' };

    const content = `
        <div class="space-y-8">
            <!-- Header Mode Information -->
            <div class="bg-blue-50 border border-blue-100 rounded-[2rem] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h4 class="text-sm font-black text-blue-900 flex items-center gap-2">
                        <span>⚙️</span> Manajemen Operasional Studio Terpadu
                    </h4>
                    <p class="text-xs text-blue-600 mt-1">Gunakan tab ini untuk menyesuaikan jam kerja studio dan menetapkan hari libur opsional atau blackout dates secara interaktif.</p>
                </div>
                <div class="px-3 py-1.5 bg-blue-600 text-white font-mono text-[9px] font-black rounded-lg uppercase tracking-wider shrink-0">
                    Lomoto Control Panel
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Left Column: Jam Operasional (lg:col-span-4) -->
                <div class="lg:col-span-4 space-y-6">
                    <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#E2E8F0] shadow-sm">
                        <h3 class="text-sm font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Pengaturan Operasional Studio
                        </h3>
                        <p class="text-[11px] text-slate-400 mb-6 leading-relaxed">Atur cabang, jam buka/tutup, dan status operasional aktivitas foto studio di Lomoto.</p>
                        
                        <div class="space-y-5">
                            <!-- ELEMEN UI BARU: PEMILIHAN CABANG UNTUK SETTINGS (CHECKBOX/RADIO MODERN TANPA SELECT DROPDOWN) -->
                            <div class="mb-4">
                                <label class="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2 pl-1">PILIH CABANG STUDIO:</label>
                                <div class="flex gap-3">
                                    <!-- Opsi Karawaci -->
                                    <label class="flex-1 cursor-pointer group">
                                        <input type="radio" name="settings-active-branch" value="karawaci" class="sr-only peer" onchange="window.setSettingsBranch(this.value)" ${currentBranch === 'karawaci' ? 'checked' : ''}>
                                        <div class="w-full text-center py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 transition-all duration-200 peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:text-white group-hover:bg-slate-50 peer-checked:group-hover:bg-blue-700 shadow-sm font-black tracking-wider text-[11px] uppercase">
                                            Lomoto Karawaci
                                        </div>
                                    </label>
                                    <!-- Opsi Cideng -->
                                    <label class="flex-1 cursor-pointer group">
                                        <input type="radio" name="settings-active-branch" value="cideng" class="sr-only peer" onchange="window.setSettingsBranch(this.value)" ${currentBranch === 'cideng' ? 'checked' : ''}>
                                        <div class="w-full text-center py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 transition-all duration-200 peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:text-white group-hover:bg-slate-50 peer-checked:group-hover:bg-blue-700 shadow-sm font-black tracking-wider text-[11px] uppercase">
                                            Lomoto Cideng
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div class="space-y-1.5">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Jam Buka Studio</label>
                                <div class="relative">
                                    <select id="settings-open-hour" class="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 text-sm font-bold text-slate-700 cursor-pointer shadow-sm transition-all duration-200">
                                        ${Array.from({length: 24}).map((_, i) => {
                                            const hr = `${String(i).padStart(2, '0')}:00`;
                                            const val = `${hr} WIB`;
                                            return `<option value="${val}" ${settings.jamBuka === val ? 'selected' : ''}>${val}</option>`;
                                        }).join('')}
                                    </select>
                                    <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Jam Tutup Studio</label>
                                <div class="relative">
                                    <select id="settings-close-hour" class="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 text-sm font-bold text-slate-700 cursor-pointer shadow-sm transition-all duration-200">
                                        ${Array.from({length: 24}).map((_, i) => {
                                            const hr = `${String(i).padStart(2, '0')}:00`;
                                            const val = `${hr} WIB`;
                                            return `<option value="${val}" ${settings.jamTutup === val ? 'selected' : ''}>${val}</option>`;
                                        }).join('')}
                                    </select>
                                    <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Status Studio</label>
                                <div class="relative">
                                    <select id="settings-status" class="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 text-sm font-bold text-slate-700 cursor-pointer shadow-sm transition-all duration-200">
                                        <option value="Buka" ${settings.status === 'Buka' ? 'selected' : ''}>Buka (Menerima Reservasi)</option>
                                        <option value="Tutup" ${settings.status === 'Tutup' ? 'selected' : ''}>Tutup (Sesi Penghentian)</option>
                                    </select>
                                    <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div class="pt-2">
                                <button type="button" onclick="window.saveStudioOperational()" class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-100 hover:-translate-y-0.5 transition-all outline-none">
                                    Simpan Pengaturan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Blackout Dates (lg:col-span-8) -->
                <div class="lg:col-span-8 space-y-6">
                    <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#E2E8F0] shadow-sm">
                        <h3 class="text-sm font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <svg class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            Blokir Tanggal Operasional (Blackout Dates)
                        </h3>
                        <p class="text-[11px] text-slate-400 mb-6 leading-relaxed">Blokir rentang tanggal tertentu agar studio tidak bisa dipesan untuk kebutuhan maintenance, libur hari raya, atau privat event.</p>
                        
                        <!-- ELEMEN UI BARU: PEMILIHAN CABANG UNTUK BLACKOUT (CHECKBOX MODERN TANPA RADIO BUTTON) -->
                        <div class="mb-4">
                            <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 pl-1">TERAPKAN BLOKIR PADA CABANG:</label>
                            <div class="flex gap-3">
                                <!-- Opsi Karawaci -->
                                <label class="flex-1 cursor-pointer group">
                                    <input type="checkbox" id="blackout-branch-karawaci" value="karawaci" class="sr-only peer" checked>
                                    <div class="w-full text-center py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 transition-all duration-200 peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:text-white group-hover:bg-gray-50 peer-checked:group-hover:bg-blue-700 shadow-sm font-black tracking-wider text-[11px] uppercase">
                                        Lomoto Karawaci
                                    </div>
                                </label>
                                <!-- Opsi Cideng -->
                                <label class="flex-1 cursor-pointer group">
                                    <input type="checkbox" id="blackout-branch-cideng" value="cideng" class="sr-only peer">
                                    <div class="w-full text-center py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 transition-all duration-200 peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:text-white group-hover:bg-gray-50 peer-checked:group-hover:bg-blue-700 shadow-sm font-black tracking-wider text-[11px] uppercase">
                                        Lomoto Cideng
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tanggal Mulai Blokir</label>
                                <input type="date" id="blackout-start" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 text-sm font-bold text-slate-700 shadow-sm">
                            </div>
                            <div class="space-y-1.5">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tanggal Selesai Blokir</label>
                                <input type="date" id="blackout-end" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 text-sm font-bold text-slate-700 shadow-sm">
                            </div>
                        </div>
                        
                        <div class="space-y-1.5 mt-4">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Keterangan Alasan</label>
                            <input type="text" id="blackout-reason" placeholder="Contoh: Renovasi Studio Lantai 2, Libur Lebaran, Private Event..." class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 text-sm font-bold text-slate-700 shadow-sm">
                        </div>
                        
                        <div class="pt-4">
                            <button type="button" onclick="window.addBlackoutDate()" class="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-rose-100 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 outline-none">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
                                </svg>
                                Tambah Tanggal Blokir
                            </button>
                        </div>
                    </div>

                    <div class="bg-white rounded-[2rem] border border-[#E2E8F0] overflow-hidden shadow-sm">
                        <div class="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daftar Tanggal yang Sedang Diblokir</h4>
                        </div>
                        
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th class="px-6 py-4">Tanggal Mulai</th>
                                        <th class="px-6 py-4">Tanggal Selesai</th>
                                        <th class="px-6 py-4">Keterangan / Alasan</th>
                                        <th class="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-50">
                                    ${blackoutDatesState.length === 0 ? `
                                        <tr>
                                            <td colspan="4" class="px-6 py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-tight">Terdapat 0 tanggal diblokir. Studio beroperasi normal seluruh hari.</td>
                                        </tr>
                                    ` : blackoutDatesState.map((b, idx) => `
                                        <tr class="text-xs font-medium text-slate-700 hover:bg-slate-50/50 transition-colors">
                                            <td class="px-6 py-4 font-mono text-slate-900 font-bold">${b.start}</td>
                                            <td class="px-6 py-4 font-mono text-slate-900 font-bold">${b.end}</td>
                                            <td class="px-6 py-4">
                                                 <div class="flex flex-wrap items-center gap-2">
                                                     ${getBlackoutBranchesBadge(b)}
                                                     <span class="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-tight">${b.reason}</span>
                                                 </div>
                                            </td>
                                            <td class="px-6 py-4 text-right">
                                                <button type="button" onclick="window.deleteBlackoutDate(${idx})" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-tight outline-none">
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('content-area').innerHTML = content;
};

window.setSettingsBranch = (branchVal) => {
    window.activeSettingsBranch = branchVal;
    renderStudioSettings();
};

window.saveStudioOperational = () => {
    const openVal = document.getElementById('settings-open-hour').value;
    const closeVal = document.getElementById('settings-close-hour').value;
    const statusVal = document.getElementById('settings-status').value;
    
    const openH = parseInt(openVal.split(':')[0]);
    const closeH = parseInt(closeVal.split(':')[0]);
    
    if (openH >= closeH) {
        alert('⚠️ JAM ERROR: Jam buka studio harus lebih awal daripada jam tutup studio.');
        return;
    }
    
    const currentBranch = document.querySelector('input[name="settings-active-branch"]:checked')?.value || window.activeSettingsBranch || 'karawaci';
    studioSettings[currentBranch] = {
        jamBuka: openVal,
        jamTutup: closeVal,
        status: statusVal
    };
    
    localStorage.setItem('studioSettings', JSON.stringify(studioSettings));
    
    if (currentBranch === 'karawaci') {
        studioOperational.open = openVal;
        studioOperational.close = closeVal;
    }
    
    // Regenerate dynamic options
    TIME_OPTIONS = getAvailableTimeOptions();
    
    alert(`✅ Pengaturan Operasional Studio untuk cabang ${currentBranch === 'karawaci' ? 'Karawaci' : 'Cideng'} berhasil disimpan!`);
    
    // Auto-adjust add state time value if out of bounds
    const availableOpts = getAvailableTimeOptions();
    if (!availableOpts.includes(window.addBookingState.time)) {
        window.addBookingState.time = availableOpts[0] || '08:00 WIB';
    }
    
    renderStudioSettings();
};

window.addBlackoutDate = () => {
    const startVal = document.getElementById('blackout-start').value;
    const endVal = document.getElementById('blackout-end').value;
    const reasonVal = document.getElementById('blackout-reason').value.trim();
    
    const branches = [];
    if (document.getElementById('blackout-branch-karawaci')?.checked) {
        branches.push('karawaci');
    }
    if (document.getElementById('blackout-branch-cideng')?.checked) {
        branches.push('cideng');
    }
    
    if (branches.length === 0) {
        alert('Harap pilih minimal satu cabang studio untuk diblokir!');
        return;
    }
    
    if (!startVal || !endVal || !reasonVal) {
        alert('⚠️ ERROR: Lengkapi seluruh Tanggal Mulai, Tanggal Selesai, dan Alasan Blokir.');
        return;
    }
    
    const startD = new Date(startVal);
    const endD = new Date(endVal);
    
    if (startD > endD) {
        alert('⚠️ ERROR: Tanggal mulai blokir tidak boleh melebihi tanggal selesai.');
        return;
    }
    
    blackoutDatesState.push({
        start: startVal,
        end: endVal,
        reason: reasonVal,
        branches: branches
    });
    
    localStorage.setItem('blackoutDatesState', JSON.stringify(blackoutDatesState));
    
    alert('✅ Tanggal blackout berhasil ditambahkan!');
    renderStudioSettings();
};

window.deleteBlackoutDate = (idx) => {
    blackoutDatesState.splice(idx, 1);
    localStorage.setItem('blackoutDatesState', JSON.stringify(blackoutDatesState));
    alert('✅ Tanggal blokir berhasil dihapus/dibuka kembali!');
    renderStudioSettings();
};

const getStatusClass = (s) => {
    switch(s) {
        case 'confirmed': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
        case 'pending': return 'bg-amber-50 text-amber-600 border border-amber-100';
        case 'cancelled': return 'bg-red-50 text-red-600 border border-red-100';
        case 'done': return 'bg-blue-50 text-blue-600 border border-blue-100';
        default: return 'bg-slate-50 text-slate-500 border border-slate-100';
    }
};

// --- CHART INIT ---
// === CHART INITIALIZER WITH DESTROY-AND-REBUILD STRATEGY START ===
window.refreshChartData = () => {
    let weeklyCounts = [0, 0, 0, 0];

    // Ambil bulan & tahun sekarang secara otomatis (tidak hardcoded)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentPeriod = `${currentYear}-${currentMonth}`; // contoh: "2026-06"

    bookingState.forEach(r => {
        if (r.status === 'cancelled') return;
        const dStr = r.tanggal_foto || r.date || r.tanggal || '';
        if (dStr.startsWith(currentPeriod)) {
            const dayNum = parseInt(dStr.split('-')[2]) || 1;
            if (dayNum >= 1 && dayNum <= 7) {
                weeklyCounts[0]++;
            } else if (dayNum >= 8 && dayNum <= 14) {
                weeklyCounts[1]++;
            } else if (dayNum >= 15 && dayNum <= 21) {
                weeklyCounts[2]++;
            } else if (dayNum >= 22 && dayNum <= 31) {
                weeklyCounts[3]++;
            }
        }
    });

    if (lomotoChartInstance && lomotoChartInstance.data && lomotoChartInstance.data.datasets && lomotoChartInstance.data.datasets[0]) {
        lomotoChartInstance.data.datasets[0].data = weeklyCounts;
        lomotoChartInstance.update();
    }
    return weeklyCounts;
};

window.renderOrUpdateChart = () => {
    // 1. STRATEGI RE-INITIALIZE DENGAN DESTROY PROPERTY
    if (lomotoChartInstance) {
        lomotoChartInstance.destroy();
        lomotoChartInstance = null;
    }

    const canvas = document.getElementById('main-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 2. LOGIKA PEMETAAN DATA BOOKING (MEI 2026) VIA REFRESHCHARTDATA
    const weeklyCounts = window.refreshChartData();

    // 3. RE-CREATE CHART BARU PADA CANVAS
    lomotoChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Trend Gabungan (Karawaci + Cideng)',
                data: weeklyCounts,
                borderColor: '#2563eb',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                backgroundColor: (c) => {
                    const ctx = c.chart.ctx;
                    const grad = ctx.createLinearGradient(0, 0, 0, 260);
                    grad.addColorStop(0, 'rgba(37, 99, 235, 0.12)');
                    grad.addColorStop(1, 'transparent');
                    return grad;
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { 
                    display: true,
                    labels: {
                        font: {
                            family: 'Inter, system-ui, sans-serif',
                            size: 10,
                            weight: 'bold'
                        },
                        color: '#475569'
                    }
                } 
            },
            scales: {
                y: { grid: { color: '#F1F5F9' }, ticks: { font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { font: { size: 10 } } }
            }
        }
    });
};

// Backwards-compatible aliases mapping to renderOrUpdateChart to ensure complete system safety
window.initLomotoChart = () => {
    window.renderOrUpdateChart();
};

window.syncDashboardChart = () => {
    window.refreshChartData();
};
// === CHART INITIALIZER WITH DESTROY-AND-REBUILD STRATEGY END ===

// --- CORE LOGIC ---
const getBookingTimeRange = (r) => {
    const startTimeStr = r.time || "09:00 WIB";
    const startHour = parseInt(startTimeStr.split(':')[0]);
    
    const { durationMinutes } = getCategoryTierConstraints(r.category, r.tier, r.branch);
    let duration = Math.ceil(durationMinutes / 60);
    
    return { start: startHour, end: startHour + duration };
};

const checkBookingCollision = (newBooking, excludeId = null) => {
    const newRange = getBookingTimeRange(newBooking);
    
    return bookingState.find(existing => {
        if (excludeId && existing.id === excludeId) return false;
        if (existing.status === 'cancelled') return false;
        
        if (existing.date === newBooking.date && existing.branch === newBooking.branch) {
            const existingRange = getBookingTimeRange(existing);
            // Overlap: start1 < end2 && end1 > start2
            return newRange.start < existingRange.end && newRange.end > existingRange.start;
        }
        return false;
    });
};

const switchTab = (tabId) => {
    const prevActiveTabBtn = document.querySelector('.tab-btn.active-tab');
    const prevTabId = prevActiveTabBtn ? prevActiveTabBtn.dataset.tab : null;

    const titleMap = {
        'dashboard': 'Statistik Utama Lomoto',
        'booking-management': 'Manajemen Reservasi Klien',
        'client-data': 'Database Pelanggan Unique',
        'schedule-calendar': 'Kalender Jadwal Studio',
        'studio-settings': 'Manajemen Operasional Studio'
    };
    
    if (tabId === 'schedule-calendar') {
        document.getElementById('page-title').innerText = `Schedule Calendar - Cabang ${window.activeCalendarBranch || 'Karawaci'}`;
    } else {
        document.getElementById('page-title').innerText = titleMap[tabId] || 'Admin Portal';
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active-tab', 'bg-blue-600', 'text-white', 'shadow-lg', 'shadow-blue-100');
        btn.classList.add('text-slate-500');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active-tab', 'bg-blue-600', 'text-white', 'shadow-lg', 'shadow-blue-100');
            btn.classList.remove('text-slate-500');
        }
    });

    if (tabId === 'schedule-calendar') {
        const sub = document.getElementById('schedule-calendar-sub');
        const chevron = document.getElementById('chevron-icon');
        
        // Auto-open only if coming from another tab
        if (prevTabId !== 'schedule-calendar') {
            if (sub) sub.classList.remove('hidden');
            if (chevron) {
                chevron.classList.remove('rotate-0');
                chevron.classList.add('rotate-90');
            }
        }
        
        const kBtn = document.getElementById('submenu-karawaci');
        const cBtn = document.getElementById('submenu-cideng');
        if (kBtn && cBtn) {
            kBtn.classList.remove('bg-blue-50/50', 'text-blue-600', 'font-bold');
            kBtn.classList.add('text-slate-500');
            cBtn.classList.remove('bg-blue-50/50', 'text-blue-600', 'font-bold');
            cBtn.classList.add('text-slate-500');
            
            if ((window.activeCalendarBranch || 'Karawaci') === 'Karawaci') {
                kBtn.classList.add('bg-blue-50/50', 'text-blue-600', 'font-bold');
                kBtn.classList.remove('text-slate-500');
            } else {
                cBtn.classList.add('bg-blue-50/50', 'text-blue-600', 'font-bold');
                cBtn.classList.remove('text-slate-500');
            }
        }
    } else {
        // Automatically collapse the sub-menu if transitioning to an entirely different tab
        const sub = document.getElementById('schedule-calendar-sub');
        const chevron = document.getElementById('chevron-icon');
        if (sub) sub.classList.add('hidden');
        if (chevron) {
            chevron.classList.remove('rotate-90');
            chevron.classList.add('rotate-0');
        }
    }

    if(tabId === 'dashboard') {
        renderDashboard();
        window.renderOrUpdateChart();
        window.refreshChartData();
    }
    else if(tabId === 'booking-management') renderBookingManagement();
    else if(tabId === 'client-data') renderClientData();
    else if(tabId === 'schedule-calendar') renderScheduleCalendar();
    else if(tabId === 'studio-settings') renderStudioSettings();
};

const getClients = () => {
    const clientsMap = new Map();
    bookingState.forEach(r => {
        const key = r.phone.replace(/\s/g, ''); 
        if (!clientsMap.has(key)) {
            clientsMap.set(key, {
                id: `LM-${String(clientsMap.size + 1).padStart(3, '0')}`,
                name: r.customerName,
                phone: r.phone,
                email: r.email,
                bookings: []
            });
        }
        clientsMap.get(key).bookings.push({
            id: r.id,
            date: r.date,
            branch: r.branch,
            category: r.category,
            totalPrice: r.totalPrice,
            timeDisplay: calculateDisplayTimeRange(r)
        });
    });
    return Array.from(clientsMap.values());
};

window.getFilteredClientsList = () => {
    const allClients = getClients();
    return allClients.filter(c => {
        const searchLower = clientSearchQuery.toLowerCase();
        return c.name.toLowerCase().includes(searchLower) || c.phone.includes(clientSearchQuery);
    });
};

window.getClientTableRowsHtml = (filteredClients) => {
    return filteredClients.length > 0 ? filteredClients.map(c => `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="px-6 py-4 font-mono text-[10px] font-bold text-slate-400">${c.id}</td>
            <td class="px-6 py-4">
                <p class="text-sm font-bold text-slate-800">${c.name}</p>
                <p class="text-[10px] text-slate-400 font-medium">${c.email || 'No Email'}</p>
            </td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-400 font-mono">${c.phone}</span>
                    <a href="https://wa.me/${c.phone}" target="_blank" class="p-1.5 bg-emerald-50 text-emerald-500 rounded-lg hover:bg-emerald-505 hover:bg-emerald-500 hover:text-white transition-all">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    </a>
                </div>
            </td>
            <td class="px-6 py-4">
                <span class="text-xs font-black text-slate-700">${c.bookings.length} Kali</span>
            </td>
            <td class="px-6 py-4">
                ${c.bookings.length > 2 
                    ? '<span class="px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-lg shadow-blue-100">Loyal Customer</span>' 
                    : '<span class="px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-400">New Customer</span>'}
            </td>
            <td class="px-6 py-4 text-right">
                <button onclick="window.openHistoryModal('${c.phone}')" class="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-[10px] font-black uppercase transition-all">
                    Riwayat Booking
                </button>
            </td>
        </tr>
    `).join('') : `
        <tr>
            <td colspan="6" class="px-6 py-12 text-center text-slate-400 font-medium">Data pelanggan tidak ditemukan.</td>
        </tr>
    `;
};

window.filterClientTable = (val) => {
    clientSearchQuery = val;
    const filtered = window.getFilteredClientsList();
    const tbody = document.getElementById('client-table-body');
    if (tbody) {
        tbody.innerHTML = window.getClientTableRowsHtml(filtered);
    }
    const indicator = document.getElementById('client-count-indicator');
    if (indicator) {
        indicator.innerText = `Total: ${filtered.length} Pelanggan`;
    }
};

const renderClientData = () => {
    const allClients = getClients();
    const filteredClients = window.getFilteredClientsList();

    const content = `
        <div class="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
            <div class="p-6 border-b border-slate-50 bg-[#F8FAFC]/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div class="relative w-full sm:w-96">
                     <input type="text" id="client-search" oninput="window.filterClientTable(this.value)" value="${clientSearchQuery}" placeholder="Cari Nama / WhatsApp Pelanggan..." class="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all bg-white shadow-sm">
                     <svg class="absolute left-3.5 top-3.5 text-slate-400" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <div id="client-count-indicator" class="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-2 border border-slate-100 rounded-xl">
                    Total: ${filteredClients.length} Pelanggan
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-[#F8FAFC] text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <tr>
                            <th class="px-6 py-4 italic">ID</th>
                            <th class="px-6 py-4">Nama Pelanggan</th>
                            <th class="px-6 py-4">Kontak & WA</th>
                            <th class="px-6 py-4">Total Booking</th>
                            <th class="px-6 py-4">Loyalty Status</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="client-table-body" class="divide-y divide-slate-50">
                        ${window.getClientTableRowsHtml(filteredClients)}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    document.getElementById('content-area').innerHTML = content;
};

window.openHistoryModal = (phone) => {
    const clients = getClients();
    const c = clients.find(it => it.phone === phone);
    if(!c) return;

    document.getElementById('history-client-name').innerText = c.name;
    const listEl = document.getElementById('history-content');
    
    listEl.innerHTML = c.bookings.map(b => `
        <div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center group">
            <div>
                <p class="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">${b.id}</p>
                <p class="text-sm font-bold text-slate-900">${b.date}</p>
                <p class="text-[10px] text-slate-400 font-medium">${b.branch} • ${b.category} • ${b.timeDisplay}</p>
            </div>
            <div class="text-right">
                <p class="text-xs font-black text-slate-700">${formatCurrency(b.totalPrice)}</p>
                <p class="text-[9px] text-emerald-500 font-bold uppercase tracking-tight">Booking Selesai</p>
            </div>
        </div>
    `).reverse().join(''); 

    const modal = document.getElementById('history-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.replace('opacity-0', 'opacity-100');
        modal.querySelector('div').classList.replace('scale-95', 'scale-100');
    }, 10);
};

window.closeHistoryModal = () => {
    const modal = document.getElementById('history-modal');
    modal.classList.replace('opacity-100', 'opacity-0');
    modal.querySelector('div').classList.replace('scale-100', 'scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
};

/// --- DETAIL MODAL LOGIC ---
window.openDetailModal = (id) => {
    const numId = Number(id);
    const r = bookingState.find(it => Number(it.id) === numId);
    if(!r) { console.warn('openDetailModal: id tidak ditemukan di bookingState →', id); return; }

    document.getElementById('detail-content').innerHTML = `
        <div class="space-y-6">
            <!-- Header: Booking ID & Status -->
            <div class="flex items-center justify-between p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                <div class="relative z-10">
                    <p class="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Booking Identification</p>
                    <h2 class="text-3xl font-black italic tracking-tighter">${r.id}</h2>
                </div>
                <div class="relative z-10 flex flex-col items-end gap-2">
                    <p class="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Status Reservasi</p>
                    <div class="flex items-center gap-3">
                        <div class="flex flex-col items-end">
                             <span class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusClass(r.status).replace('border', 'border-0')} shadow-lg">${r.status}</span>
                             <span class="text-[8px] font-black text-blue-400 uppercase tracking-[0.2em] mt-1 pr-1">● GOOGLE SYNC: ${r.googleSync || 'Synced'}</span>
                        </div>
                    </div>
                </div>
                <!-- Abstract Background Accent -->
                <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            <!-- Main Sections Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <!-- SECTION 1: Informasi Pelanggan -->
                <div class="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-5">
                    <div class="flex items-center gap-3 border-b border-slate-200/50 pb-3">
                        <div class="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                        <h4 class="text-[10px] font-black text-slate-800 uppercase tracking-widest">Informasi Pelanggan</h4>
                    </div>
                    
                    <div class="grid grid-cols-1 gap-4">
                        <div>
                            <label class="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Nama Lengkap Klien</label>
                            <p class="text-sm font-bold text-slate-800">${r.customerName}</p>
                        </div>
                        <div>
                            <label class="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Nomor WhatsApp</label>
                            <div class="flex items-center gap-2">
                                <p class="text-sm font-bold text-slate-800 font-mono tracking-widest">${r.phone}</p>
                                <a href="https://wa.me/${r.phone}" target="_blank" class="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <label class="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Alamat Gmail / Email</label>
                            <p class="text-sm font-bold text-slate-800">${r.email || '-'}</p>
                        </div>
                    </div>
                </div>

                <!-- SECTION 2: Detail Sesi Foto -->
                <div class="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-5">
                    <div class="flex items-center gap-3 border-b border-slate-200/50 pb-3">
                        <div class="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <h4 class="text-[10px] font-black text-slate-800 uppercase tracking-widest">Detail Sesi Foto</h4>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Cabang Studio</label>
                            <p class="text-sm font-bold text-slate-800">${r.branch}</p>
                        </div>
                        <div>
                            <label class="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Kategori</label>
                            <span class="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold uppercase">${r.category}</span>
                        </div>
                        <div>
                            <label class="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Paket (Tier)</label>
                            <p class="text-sm font-bold text-slate-800">Tier ${r.tier}</p>
                        </div>
                        <div>
                            <label class="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Tanggal</label>
                            <p class="text-sm font-bold text-slate-800">${r.date}</p>
                        </div>
                        <div class="col-span-2 grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50">
                             <div>
                                <label class="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Slot Jam Sesi</label>
                                <p class="text-sm font-bold text-blue-600">${calculateDisplayTimeRange(r)}</p>
                             </div>
                             <div>
                                <label class="text-[10px] font-semibold uppercase text-slate-400 block mb-1">Backgrounds</label>
                                <p class="text-sm font-bold text-slate-800">${(r.backgrounds || []).join(', ') || '-'}</p>
                             </div>
                        </div>
                    </div>
                </div>

                <!-- SECTION 3: Ringkasan Biaya & Add-ons -->
                <div class="md:col-span-2 p-8 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-6">
                    <div class="flex items-center justify-between border-b border-slate-200/50 pb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h4 class="text-[10px] font-black text-slate-800 uppercase tracking-widest">Ringkasan Biaya & Add-ons</h4>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                        <!-- Add-ons List -->
                        <div class="space-y-3">
                             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Layanan Tambahan:</label>
                             ${(r.addOns || []).length > 0 ? (r.addOns || []).map(a => `
                                <div class="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200/30 shadow-sm">
                                    <span class="text-xs font-bold text-slate-600">${a.name}</span>
                                    <span class="text-xs font-black text-slate-900">${formatCurrency(a.price)}</span>
                                </div>
                             `).join('') : `
                                <div class="bg-white p-4 rounded-xl border border-dashed border-slate-200 text-center">
                                    <p class="text-[10px] font-bold text-slate-400 uppercase italic">Tidak ada add-ons yang disewa</p>
                                </div>
                             `}
                        </div>

                        <!-- Grand Total Card -->
                        <div class="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                             <div class="relative z-10">
                                <p class="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Grand Total Estimasi</p>
                                <div class="flex items-baseline gap-2">
                                    <h3 class="text-4xl font-black tracking-tighter">${formatCurrency(r.totalPrice)}</h3>
                                </div>
                                <div class="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                                    <p class="text-[9px] font-bold uppercase opacity-50">Lomoto Studio Official</p>
                                    <div class="flex gap-1">
                                        <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                        <div class="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                        <div class="w-1.5 h-1.5 rounded-full bg-blue-300"></div>
                                    </div>
                                </div>
                             </div>
                             <!-- Decorative Accent -->
                             <div class="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modal = document.getElementById('detail-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.replace('opacity-0', 'opacity-100');
        modal.querySelector('div').classList.replace('scale-95', 'scale-100');
    }, 10);
};

window.closeDetailModal = () => {
    const modal = document.getElementById('detail-modal');
    modal.classList.replace('opacity-100', 'opacity-0');
    modal.querySelector('div').classList.replace('scale-100', 'scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
};

/// --- EDIT MODAL LOGIC ---
window.openEditModal = (id) => {
    if (document.getElementById('edit-time')) {
    document.getElementById('edit-time').removeAttribute('data-user-changed');
}
    const numId = Number(id);
    const r = bookingState.find(it => Number(it.id) === numId);
    if(!r) { console.warn('openEditModal: id tidak ditemukan di bookingState →', id); return; }

    window.currentEditId = numId;
    window.selectedAddons = [...(r.addOns || [])];

    const basePrice = getCategoryTierPrice(r.branch, r.category, r.tier);
    window.currentBasePrice = basePrice;

    // Initialize Edit Background Rows
    window.editBackgroundRows = (r.backgrounds || []).map(b => {
        const cleanBg = sanitizeBackgroundName(b);
        
        // [PENGAMAN] Normalisasi nama cabang jika mengandung kata 'Studio'
        let secureBranch = r.branch;
        if (secureBranch && secureBranch.includes('Karawaci')) secureBranch = 'Karawaci';
        if (secureBranch && secureBranch.includes('Cideng')) secureBranch = 'Cideng';

        // Try to find the type for each theme
        let foundType = secureBranch === 'Cideng' ? 'Set Tema Eksklusif' : 'Wallpaper Background';
        
        // Ambil opsi background berdasarkan cabang yang sudah aman, jika tidak ada fallback ke objek kosong {}
        const branchOptions = BACKGROUND_OPTIONS[secureBranch] || {};

        for (const [type, themes] of Object.entries(branchOptions)) {
            if (themes === null) {
                if (cleanBg === sanitizeBackgroundName(type) || b === type) {
                    return { type: type, theme: type };
                }
                continue;
            }
            const sanitizedThemes = themes.map(t => sanitizeBackgroundName(t));
            if (themes.includes(cleanBg) || sanitizedThemes.includes(cleanBg) || themes.includes(b)) {
                foundType = type;
                const exactTheme = themes.find(t => sanitizeBackgroundName(t) === cleanBg || t === b) || cleanBg;
                return { type: foundType, theme: exactTheme };
            }
        }
        return { type: foundType, theme: cleanBg };
    });
    if (window.editBackgroundRows.length === 0) {
        const defaultType = Object.keys(BACKGROUND_OPTIONS[r.branch])[0];
        window.editBackgroundRows.push({ type: defaultType, theme: '' });
    }

    const STATUS_OPTIONS = [
        { val: 'pending', label: 'Pending', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'amber' },
        { val: 'confirmed', label: 'Confirmed', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'emerald' },
        { val: 'done', label: 'Done', icon: 'M5 13l4 4L19 7', color: 'blue' },
        { val: 'cancelled', label: 'Cancelled', icon: 'M6 18L18 6M6 6l12 12', color: 'rose' }
    ];

    document.getElementById('edit-content').innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <!-- Left: Transaction & Reservation -->
            <div class="space-y-8">
                <div>
                    <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Status & Lokasi
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-slate-400 uppercase pl-1">Status Booking</label>
                            <div class="relative">
                                <select id="edit-status" class="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 text-sm font-bold text-slate-700 cursor-pointer shadow-sm transition-all duration-200">
                                    ${STATUS_OPTIONS.map(s => `<option value="${s.val}" ${r.status === s.val ? 'selected' : ''}>${s.label}</option>`).join('')}
                                </select>
                                <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-slate-400 uppercase pl-1">Cabang Studio</label>
                            <div class="relative">
                                <select id="edit-branch" class="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 text-sm font-bold text-slate-700 cursor-pointer shadow-sm transition-all duration-200">
                                    ${BRANCHES.map(b => `<option value="${b}" ${r.branch === b ? 'selected' : ''}>${b}</option>`).join('')}
                                </select>
                                <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        Paket & Layanan
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-slate-400 uppercase pl-1">Kategori</label>
                            <div class="relative">
                                <select id="edit-category" class="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 text-sm font-bold text-slate-700 cursor-pointer shadow-sm transition-all duration-200">
                                    ${CATEGORIES.map(c => `<option value="${c}" ${r.category === c ? 'selected' : ''}>${c}</option>`).join('')}
                                </select>
                                <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-slate-400 uppercase pl-1">Paket (Tier)</label>
                            <div class="relative">
                                <select id="edit-tier" class="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 text-sm font-bold text-slate-700 cursor-pointer shadow-sm transition-all duration-200">
                                    ${TIERS.map(t => `<option value="${t}" ${r.tier === t ? 'selected' : ''}>Tier ${t}</option>`).join('')}
                                </select>
                                <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-1.5 sm:col-span-2">
                             <div class="flex justify-between items-center mb-1">
                                 <label class="text-[10px] font-black text-slate-400 uppercase pl-1">Input Background Dinamis</label>
                                 <button onclick="window.addEditBackgroundRow()" class="text-[8px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-600 hover:text-white transition-all">+ Tambah</button>
                             </div>
                             <div id="edit-background-rows" class="space-y-2">
                                 <!-- Content injected by script -->
                             </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        Reschedule (Jadwal Ulang)
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-slate-400 uppercase pl-1">Tanggal Sesi</label>
                            <input type="date" id="edit-date" value="${r.date}" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 text-sm font-bold text-slate-700 shadow-sm">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-slate-400 uppercase pl-1">Jam Mulai</label>
                            <div class="relative">
                                <select id="edit-time" class="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 text-sm font-bold text-slate-700 cursor-pointer shadow-sm transition-all duration-200">
                                    ${TIME_OPTIONS.map(t => `<option value="${t}" ${r.time === t ? 'selected' : ''}>${t}</option>`).join('')}
                                </select>
                                <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                            <p id="edit-duration-preview" class="text-[9px] text-blue-600 font-bold uppercase mt-1 pl-1">Estimasi Selesai: ${calculateDisplayTimeRange(r).split(' - ')[1]}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right: Addons & Client Profile -->
            <div class="space-y-8">
                <div>
                    <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Manajemen Add-ons
                    </h4>
                    <div id="edit-addons-list" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        ${AVAILABLE_ADDONS.map(addon => {
                            const isSelected = window.selectedAddons.some(a => a.name === addon.name);
                            return `
                                <label class="flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${isSelected ? 'bg-blue-50/50 border-blue-600 shadow-sm' : 'bg-white border-slate-100 hover:border-blue-100'}">
                                    <input type="checkbox" name="edit-addons-checkbox" value="${addon.name}" ${isSelected ? 'checked' : ''} 
                                        onchange="window.toggleAddon('${addon.name}', ${addon.price})"
                                        class="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer">
                                    <div class="flex-1">
                                        <p class="text-xs font-bold text-slate-800">${addon.name}</p>
                                        <p class="text-[10px] font-medium text-slate-400">${formatCurrency(addon.price)}</p>
                                    </div>
                                </label>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div>
                    <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        Identitas Klien
                    </h4>
                    <div class="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4">
                        <div class="space-y-1.5">
                             <label class="text-[10px] font-black text-slate-400 uppercase pl-1">Nama Lengkap</label>
                             <input type="text" id="edit-customer-name" value="${r.customerName}" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 text-sm font-bold text-slate-700">
                        </div>
                        <div class="space-y-1.5">
                             <label class="text-[10px] font-black text-slate-400 uppercase pl-1">Nomor WhatsApp</label>
                             <div class="relative">
                                 <input type="text" id="edit-phone" value="${r.phone}" class="w-full pl-4 pr-14 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 text-sm font-bold text-slate-700 font-mono tracking-wider">
                                 <a id="edit-wa-link" href="https://wa.me/${r.phone}" target="_blank" class="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                                     <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                 </a>
                             </div>
                        </div>
                        <div class="space-y-1.5">
                             <label class="text-[10px] font-black text-slate-400 uppercase pl-1">Email / Gmail</label>
                             <input type="email" id="edit-email" value="${r.email || ''}" placeholder="contoh@gmail.com" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 text-sm font-bold text-slate-700">
                        </div>
                    </div>
                </div>

                <div class="mt-auto">
                    <div class="p-6 bg-slate-900 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                        <div class="relative z-10">
                            <p class="text-[10px] font-black uppercase opacity-50 tracking-widest mb-1">Grand Total</p>
                            <div class="flex justify-between items-end">
                                <h3 id="edit-total-display" class="text-3xl font-black tracking-tight">${formatCurrency(r.totalPrice)}</h3>
                                <div class="text-right">
                                    <p class="text-[9px] font-bold opacity-40 uppercase tracking-widest">${r.id}</p>
                                </div>
                            </div>
                        </div>
                        <!-- Decorative Abstract Shapes -->
                        <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-500"></div>
                        <div class="absolute -left-12 -top-12 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/20 transition-all duration-500"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const modal = document.getElementById('edit-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.replace('opacity-0', 'opacity-100');
        modal.querySelector('div').classList.replace('scale-95', 'scale-100');
    }, 50);

    // Dynamic phone to WA link
    document.getElementById('edit-phone').addEventListener('input', (e) => {
        document.getElementById('edit-wa-link').href = `https://wa.me/${e.target.value}`;
    });

    // --- Dynamic Logic Karawaci vs Cideng ---
    const updateModalDropdowns = () => {
        const branchSelect = document.getElementById('edit-branch');
        const categorySelect = document.getElementById('edit-category');
        const tierSelect = document.getElementById('edit-tier');
        const timeSelect = document.getElementById('edit-time');
        
        const branch = branchSelect.value;
        const currentCategory = categorySelect.value;
        const currentTier = tierSelect.value;

        const rules = BRANCH_BUSINESS_RULES[branch];
        
        // 1. Update Category Dropdown
        categorySelect.innerHTML = rules.categories.map(c => 
            `<option value="${c}" ${currentCategory === c ? 'selected' : ''}>${c}</option>`
        ).join('');

        // If current category is not in the allowed list, default to first available
        if (!rules.categories.includes(currentCategory)) {
            categorySelect.value = rules.categories[0];
        }

        // Cideng Lock: Disable if only one category
        if (branch === 'Cideng') {
            categorySelect.value = 'Studio Rental';
            categorySelect.disabled = true;
        } else {
            categorySelect.disabled = false;
        }

        // 2. Update Tier Dropdown
        const allowedTiers = rules.getTiers(categorySelect.value);
        tierSelect.innerHTML = allowedTiers.map(t => 
            `<option value="${t}" ${currentTier === t ? 'selected' : ''}>Tier ${t}</option>`
        ).join('');

        if (!allowedTiers.includes(currentTier)) {
            tierSelect.value = allowedTiers[0];
        }

        // === FIX JAM BOOKING CUSTOMER (SINKRONISASI WIB) ===
        // Ambil data mentah jam milik customer dari database (variabel 'r' tersedia secara global saat modal dibuka)
        if (window.currentEditId) {
            const r = bookingState.find(item => Number(item.id) === Number(window.currentEditId));
            if (r) {
                let jamDatabase = r.booking_time || r.time || '09:00 - 11:00 WIB';
                
                // Jika jam dari customer polos (tanpa WIB), tambahkan kata " WIB" agar cocok dengan dropdown admin
                if (jamDatabase && !jamDatabase.includes('WIB')) {
                    jamDatabase = jamDatabase.trim() + ' WIB';
                }
                
                // Set nilai dropdown admin ke jam milik customer jika belum berubah
                if (timeSelect && !timeSelect.dataset.userChanged) {
                    timeSelect.value = jamDatabase;
                }
            }
        }
        // ====================================================

        // 3. Update Duration Preview and Base Price
        window.currentBasePrice = getCategoryTierPrice(branch, categorySelect.value, tierSelect.value);
        
        // Update grand total display
        const newTotal = window.currentBasePrice + window.selectedAddons.reduce((sum, a) => sum + a.price, 0);
        const totalDisplay = document.getElementById('edit-total-display');
        if (totalDisplay) {
            totalDisplay.innerText = formatCurrency(newTotal);
        }

        const previewEl = document.getElementById('edit-duration-preview');
        if (previewEl) {
            previewEl.innerText = 'Estimasi Selesai: ' + calculateDisplayTimeRange({
                category: categorySelect.value,
                tier: tierSelect.value,
                time: timeSelect.value,
                branch: branch,
                addOns: window.selectedAddons
            }).split(' - ')[1];
        }

        

        // 4. Background Cap / Truncate Validation
        if (window.editBackgroundRows) {
            if (branch === 'Cideng') {
                const cidengThemes = BACKGROUND_OPTIONS['Cideng']['Set Tema Eksklusif'];
                window.editBackgroundRows = window.editBackgroundRows.filter(row => cidengThemes.includes(row.theme) || row.type === 'Set Tema Eksklusif');
            } else {
                const availableTypes = Object.keys(BACKGROUND_OPTIONS[branch]);
                window.editBackgroundRows = window.editBackgroundRows.filter(row => availableTypes.includes(row.type));
                if (window.editBackgroundRows.length === 0) {
                    window.editBackgroundRows.push({ type: 'Wallpaper Background', theme: '' });
                }
            }
            const { maxBackgrounds, isFlexible } = getCategoryTierConstraints(categorySelect.value, tierSelect.value, branch);
            if (!isFlexible && window.editBackgroundRows.length > maxBackgrounds && branch !== 'Cideng') {
                window.editBackgroundRows = window.editBackgroundRows.slice(0, maxBackgrounds);
            }
            window.renderEditBackgroundRows();
        }
    };

    const branchSelect = document.getElementById('edit-branch');
    const categorySelect = document.getElementById('edit-category');

    branchSelect.addEventListener('change', updateModalDropdowns);
    categorySelect.addEventListener('change', updateModalDropdowns);
    document.getElementById('edit-tier').addEventListener('change', updateModalDropdowns);
    document.getElementById('edit-time').addEventListener('change', updateModalDropdowns);
    document.getElementById('edit-time').addEventListener('change', (e) => {
    e.target.dataset.userChanged = "true";
    updateModalDropdowns();
});

    // Dynamic state helper for Cideng checkboxes in edit modal
    window.toggleCidengBackgroundEdit = (theme, checked) => {
        if (checked) {
            if (!window.editBackgroundRows.some(row => row.theme === theme)) {
                window.editBackgroundRows.push({ type: 'Set Tema Eksklusif', theme: theme });
            }
        } else {
            window.editBackgroundRows = window.editBackgroundRows.filter(row => row.theme !== theme);
        }
        window.renderEditBackgroundRows();
    };

    // Render Background Rows for Edit
    window.renderEditBackgroundRows = () => {
        const branch = document.getElementById('edit-branch').value;
        const container = document.getElementById('edit-background-rows');
        const addBtn = document.querySelector('[onclick="window.addEditBackgroundRow()"]');

        if (branch === 'Cideng') {
            if (addBtn) addBtn.style.display = 'none';

            const cidengThemes = BACKGROUND_OPTIONS['Cideng']['Set Tema Eksklusif'];
            container.innerHTML = `
                <div class="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl space-y-3 w-full animate-fadeIn transition-all">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">PILIHAN TEMA SET EKSKLUSIF (CIDENG)</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        ${cidengThemes.map(th => {
                            const isChecked = window.editBackgroundRows.some(row => row.theme === th);
                            return `
                                <label class="flex items-center gap-3.5 p-4 border rounded-2xl cursor-pointer transition-all ${isChecked ? 'bg-blue-50/50 border-blue-600 shadow-sm' : 'bg-white border-slate-100 hover:border-blue-100 shadow-sm'}">
                                    <input type="checkbox" name="edit-cideng-bg-checkbox" value="${th}" ${isChecked ? 'checked' : ''} 
                                        onchange="window.toggleCidengBackgroundEdit('${th}', this.checked)"
                                        class="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer">
                                    <div class="flex-1">
                                        <p class="text-xs font-bold text-slate-800">${th}</p>
                                    </div>
                                </label>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        } else {
            if (addBtn) addBtn.style.display = 'block';

            const availableTypes = Object.keys(BACKGROUND_OPTIONS[branch]);
            container.innerHTML = window.editBackgroundRows.map((row, idx) => {
                const themes = BACKGROUND_OPTIONS[branch][row.type] || [];
                const isPilihNanti = BACKGROUND_OPTIONS[branch][row.type] === null;
                return `
                    <div class="flex items-center gap-2 group animate-fadeIn">
                        <div class="flex-1 grid ${isPilihNanti ? 'grid-cols-1' : 'grid-cols-2'} gap-3">
                            <div class="relative">
                                <select onchange="window.updateEditBackgroundRow(${idx}, 'type', this.value)" class="w-full appearance-none py-2.5 pl-4 pr-10 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-blue-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none cursor-pointer shadow-sm">
                                    ${availableTypes.map(t => `<option value="${t}" ${row.type === t ? 'selected' : ''}>${t}</option>`).join('')}
                                </select>
                                <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                            ${isPilihNanti ? '' : `
                            <div class="relative">
                                <select onchange="window.updateEditBackgroundRow(${idx}, 'theme', this.value)" class="w-full appearance-none py-2.5 pl-4 pr-10 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-blue-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none cursor-pointer shadow-sm">
                                    <option value="">Pilih Tema...</option>
                                    ${themes.map(th => `<option value="${th}" ${row.theme === th ? 'selected' : ''}>${th}</option>`).join('')}
                                </select>
                                <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        `}
                        <button type="button" onclick="window.duplicateEditBackgroundRow(${idx})" class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Duplikasi Baris">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                        </button>
                        <button type="button" onclick="window.removeEditBackgroundRow(${idx})" class="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Hapus Baris">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                `;
            }).join('');
        }
    };

    window.addEditBackgroundRow = () => {
        const branch = document.getElementById('edit-branch').value;
        const category = document.getElementById('edit-category').value;
        const tier = document.getElementById('edit-tier').value;
        const { maxBackgrounds, isFlexible } = getCategoryTierConstraints(category, tier, branch);
        
        if (!isFlexible && window.editBackgroundRows.length >= maxBackgrounds) {
            window.alert(`Jumlah set background dibatasi maksimal ${maxBackgrounds} set untuk paket ini.`);
            return;
        }

        const defaultType = Object.keys(BACKGROUND_OPTIONS[branch])[0];
        window.editBackgroundRows.push({ type: defaultType, theme: '' });
        window.renderEditBackgroundRows();
    };

    window.duplicateEditBackgroundRow = (idx) => {
        const branch = document.getElementById('edit-branch').value;
        const category = document.getElementById('edit-category').value;
        const tier = document.getElementById('edit-tier').value;
        const { maxBackgrounds, isFlexible } = getCategoryTierConstraints(category, tier, branch);
        
        if (!isFlexible && window.editBackgroundRows.length >= maxBackgrounds) {
            window.alert(`Jumlah set background dibatasi maksimal ${maxBackgrounds} set untuk paket ini.`);
            return;
        }

        const row = window.editBackgroundRows[idx];
        window.editBackgroundRows.splice(idx + 1, 0, { ...row });
        window.renderEditBackgroundRows();
    };

    window.removeEditBackgroundRow = (idx) => {
        window.editBackgroundRows.splice(idx, 1);
        window.renderEditBackgroundRows();
    };

    window.updateEditBackgroundRow = (idx, key, val) => {
        window.editBackgroundRows[idx][key] = val;
        if (key === 'type') {
            const branch = document.getElementById('edit-branch').value;
            if (BACKGROUND_OPTIONS[branch] && BACKGROUND_OPTIONS[branch][val] === null) {
                window.editBackgroundRows[idx].theme = 'Pilih Nanti Di Tempat';
            } else {
                window.editBackgroundRows[idx].theme = '';
            }
        }
        window.renderEditBackgroundRows();
    };

    window.renderEditBackgroundRows();

    // Initial run to sync
    updateModalDropdowns();
};

window.closeEditModal = () => {
    const modal = document.getElementById('edit-modal');
    modal.classList.replace('opacity-100', 'opacity-0');
    modal.querySelector('div').classList.replace('scale-100', 'scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
};

window.toggleAddon = (name, price) => {
    const index = window.selectedAddons.findIndex(a => a.name === name);
    
    if(index === -1) {
        window.selectedAddons.push({ name, price });
    } else {
        window.selectedAddons.splice(index, 1);
    }
    
    // Update UI Total
    const newTotal = window.currentBasePrice + window.selectedAddons.reduce((sum, a) => sum + a.price, 0);
    document.getElementById('edit-total-display').innerText = formatCurrency(newTotal);

    // Re-render addons list
    const addonsList = document.getElementById('edit-addons-list');
    addonsList.innerHTML = AVAILABLE_ADDONS.map(addon => {
        const isSelected = window.selectedAddons.some(a => a.name === addon.name);
        return `
            <label class="flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${isSelected ? 'bg-blue-50/50 border-blue-600 shadow-sm' : 'bg-white border-slate-100 hover:border-blue-100'}">
                <input type="checkbox" name="edit-addons-checkbox" value="${addon.name}" ${isSelected ? 'checked' : ''} 
                    onchange="window.toggleAddon('${addon.name}', ${addon.price})"
                    class="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer">
                <div class="flex-1">
                    <p class="text-xs font-bold text-slate-800">${addon.name}</p>
                    <p class="text-[10px] font-medium text-slate-400">${formatCurrency(addon.price)}</p>
                </div>
            </label>
        `;
    }).join('');
};

window.saveBookingChanges = async (event) => {
    console.log("DEBUG: Tombol Save Changes Berhasil Diklik!");
    
    const id = window.currentEditId;
    const idx = bookingState.findIndex(r => Number(r.id) === Number(id));
    if(idx === -1) {
        window.alert('Gagal! Data reservasi tidak ditemukan.');
        return;
    }

    const branch = document.getElementById('edit-branch').value;
    const category = document.getElementById('edit-category').value;
    const tier = document.getElementById('edit-tier').value;
    const date = document.getElementById('edit-date').value;
    const time = document.getElementById('edit-time').value;

    // Check blackout dates
    const blackout = checkBlackoutCollisions(date, branch);
    if (blackout) {
        window.alert(`❌ Maaf, Studio sedang TUTUP pada tanggal tersebut karena: ${blackout.reason}!`);
        if (typeof event !== 'undefined' && event && event.preventDefault) {
            event.preventDefault();
        } else if (window.event && window.event.preventDefault) {
            window.event.preventDefault();
        }
        return;
    }

    const inputData = {
        branch,
        category,
        tier,
        date,
        time,
        addOns: window.selectedAddons
    };

    const getHours = (b) => {
        const startTimeStr = b.time || "09:00 WIB";
        const startHour = parseInt(startTimeStr.split(':')[0]);
        
        const { durationMinutes } = getCategoryTierConstraints(b.category, b.tier, b.branch);
        let duration = Math.ceil(durationMinutes / 60);
        
        return { start: startHour, end: startHour + duration };
    };

    const currentEditingId = id;
    const inputTanggal = date;
    const inputCabang = branch;
    const inputHours = getHours(inputData);
    const inputJamMulai = inputHours.start;
    const inputJamSelesai = inputHours.end;

    // 1. COLLISION CHECK (Anti-Booking Collision)
    const isBentrok = bookingState.some(booking => {
        if (booking.status === 'cancelled') return false;
        
        const bHours = getHours(booking);
        booking.jamMulai = bHours.start;
        booking.jamSelesai = bHours.end;
        booking.tanggal = booking.date;
        booking.cabang = booking.branch;

        return booking.id !== currentEditingId && booking.tanggal === inputTanggal && booking.cabang === inputCabang && inputJamMulai < booking.jamSelesai && inputJamSelesai > booking.jamMulai;
    });

    if (isBentrok) {
        console.log("DEBUG: Status BENTROK Terdeteksi!");
        window.alert("⚠️ PERUBAHAN JADWAL BENTROK!\n\nGagal memperbarui data karena slot waktu tersebut sudah di-booking oleh klien lain di Cabang yang sama.\n\nSilakan ganti Tanggal, Cabang, atau Jam Sesi Foto.");
        if (typeof event !== 'undefined' && event && event.preventDefault) {
            event.preventDefault();
        } else if (window.event && window.event.preventDefault) {
            window.event.preventDefault();
        }
        return;
    }

    // 2. SUCCESSFUL UPDATE
    const backgrounds = window.editBackgroundRows
        .filter(r => r.theme)
        .map(r => r.theme);
    
    const updatedTotal = window.currentBasePrice + window.selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const newStatus = document.getElementById('edit-status').value;
    const newName = document.getElementById('edit-customer-name').value;
    const newPhone = document.getElementById('edit-phone').value;
    const newEmail = document.getElementById('edit-email').value;

    // ============================================================
    // PERBAIKAN: Kirim perubahan ke backend Laravel MySQL via API
    // ============================================================
    const updatePayload = {
        client_name: newName,
        client_whatsapp: newPhone,
        email: newEmail,
        booking_date: date,
        booking_time: time,
        category: category,
        branch: branch,
        status: newStatus
    };

    try {
        const response = await fetch(`http://localhost:8000/api/reservations/${id}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify(updatePayload)
        });
        const data = await response.json();
        if (!response.ok) {
            window.alert('❌ Gagal menyimpan ke database: ' + (data.message || 'Error server'));
            return;
        }
        console.log('✓ Data booking berhasil diperbarui di MySQL:', data.message);
    } catch (err) {
        console.error('❌ Gagal terhubung ke backend untuk update booking:', err);
        window.alert('❌ Tidak bisa terhubung ke server Laravel. Pastikan server berjalan di port 8000.');
        return;
    }
    // ============================================================

    // Update state lokal (bookingState) supaya UI langsung sinkron
    const bsIdx = bookingState.findIndex(r => Number(r.id) === Number(id));
    if (bsIdx !== -1) {
        bookingState[bsIdx] = {
            ...bookingState[bsIdx],
            status: newStatus,
            branch,
            category,
            tier,
            backgrounds,
            date,
            time,
            customerName: newName,
            phone: newPhone,
            email: newEmail,
            addOns: window.selectedAddons,
            totalPrice: updatedTotal,
            googleSync: 'Synced'
        };
    }



    window.alert("✅ Perubahan data reservasi berhasil diperbarui di database!");
    
    // Auto-refresh the view
    const activeTab = document.querySelector('.tab-btn.active-tab')?.dataset.tab || 'booking-management';
    switchTab(activeTab);
    window.closeEditModal();
};

window.handleSaveChanges = (event) => {
    window.saveBookingChanges(event);
};

window.handleCancelBooking = async () => {
    const idx = bookingState.findIndex(r => Number(r.id) === Number(window.currentEditId));
    if(idx !== -1) {
        if(confirm('Apakah Anda yakin ingin membatalkan reservasi ini?')) {
            // PERBAIKAN: Kirim pembatalan ke backend MySQL
            await window.updateReservationStatusBackend(window.currentEditId, 'cancelled');
            saveReservations();
            const activeTab = document.querySelector('.tab-btn.active-tab')?.dataset.tab || 'booking-management';
            switchTab(activeTab);
            window.closeEditModal();
        }
    }
};

// --- ADD MODAL LOGIC (STEP-BY-STEP) ---
window.addBookingState = {
    step: 1,
    branch: 'Karawaci',
    category: 'Studio Rental',
    tier: 'Wood',
    date: '',
    time: '',
    backgrounds: [],
    backgroundRows: [{ type: 'Wallpaper Background', theme: '' }],
    customerName: '',
    phone: '',
    email: '',
    addOns: [],
    basePrice: 500000
};

window.openAddModal = (prefillDate) => {
    const defaultDate = new Date().toISOString().split('T')[0];
    const actualDate = (typeof prefillDate === 'string') ? prefillDate : defaultDate;
    
    window.addBookingState = {
        step: 1,
        branch: 'Karawaci',
        category: 'Studio Rental',
        tier: 'Wood',
        date: actualDate,
        time: '10:00 WIB',
        backgrounds: [],
        backgroundRows: [{ type: 'Wallpaper Background', theme: '' }],
        customerName: '',
        phone: '628',
        email: '',
        addOns: [],
        basePrice: 500000
    };
    
    const modal = document.getElementById('add-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.replace('opacity-0', 'opacity-100');
        modal.querySelector('div').classList.replace('scale-95', 'scale-100');
    }, 10);

    // Ensure buttons are active
    document.getElementById('add-next-btn').onclick = window.nextAddStep;
    document.getElementById('add-back-btn').onclick = window.prevAddStep;

    window.renderAddStep();
};

window.renderAddStep = () => {
    const { step, branch, category, tier } = window.addBookingState;
    const contentArea = document.getElementById('add-modal-content');
    const nextBtn = document.getElementById('add-next-btn');
    const backBtn = document.getElementById('add-back-btn');
    const stepLine = document.getElementById('step-line');

    // Update Indicators for 5 steps: width = (step - 1) * 25%
    if (stepLine) {
        stepLine.style.width = `${(step - 1) * 25}%`;
    }
    for (let i = 1; i <= 5; i++) {
        const dot = document.getElementById(`step-dot-${i}`);
        if (dot) {
            if (i <= step) {
                dot.classList.add('bg-blue-600', 'text-white');
                dot.classList.remove('bg-slate-100', 'text-slate-400');
            } else {
                dot.classList.remove('bg-blue-600', 'text-white');
                dot.classList.add('bg-slate-100', 'text-slate-400');
            }
        }
    }

    backBtn.classList.toggle('hidden', step === 1);
    nextBtn.innerText = step === 5 ? 'Simpan Reservasi' : 'Lanjut';
    nextBtn.classList.toggle('bg-emerald-600', step === 5);
    nextBtn.classList.toggle('bg-blue-600', step !== 5);

    let html = '';

    if (step === 1) {
        const rules = BRANCH_BUSINESS_RULES[branch];
        const allowedTiers = rules.getTiers(category);
        
        html = `
            <div class="space-y-6 animate-fadeIn">
                <div class="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-5">
                    <div class="space-y-1.5">
                        <label class="text-[10px] font-black text-slate-400 uppercase pl-1 tracking-widest">Pilih Cabang Studio</label>
                        <div class="grid grid-cols-2 gap-3">
                            ${BRANCHES.map(b => `
                                <button type="button" onclick="window.updateAddState('branch', '${b}')" class="p-4 border-2 rounded-2xl transition-all flex flex-col items-center gap-2 ${branch === b ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white border-slate-50 text-slate-400 hover:border-blue-200'}">
                                    <span class="text-xs font-black uppercase tracking-tight">${b}</span>
                                    <span class="text-[9px] opacity-70 font-bold">${b === 'Karawaci' ? 'Full Services' : 'Studio Rental Only'}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-[10px] font-black text-slate-400 uppercase pl-1 tracking-widest">Kategori Layanan</label>
                        <div class="relative">
                            <select id="add-category-select" onchange="window.updateAddState('category', this.value)" class="w-full appearance-none px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm font-bold text-slate-700 cursor-pointer shadow-sm transition-all duration-200" ${branch === 'Cideng' ? 'disabled' : ''}>
                                 ${rules.categories.map(c => `<option value="${c}" ${category === c ? 'selected' : ''}>${c}</option>`).join('')}
                            </select>
                            <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-[10px] font-black text-slate-400 uppercase pl-1 tracking-widest">Pilihan Paket (Tier)</label>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            ${allowedTiers.map(t => `
                                <button type="button" onclick="window.updateAddState('tier', '${t}')" class="p-3 border-2 rounded-xl transition-all flex flex-col items-center gap-1 ${tier === t ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-50 text-slate-500 hover:border-blue-200'}">
                                    <span class="text-[10px] font-black uppercase tracking-tighter line-clamp-1">${t}</span>
                                    <span class="text-[8px] opacity-70 font-bold">LOMOTO</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (step === 2) {
        html = `
            <div class="space-y-6 animate-fadeIn">
                <div class="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-slate-400 uppercase pl-1 tracking-widest">Tanggal Sesi</label>
                            <input type="date" id="add-date" value="${window.addBookingState.date}" onchange="window.addBookingState.date = this.value" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 text-sm font-bold text-slate-700 shadow-sm">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-slate-400 uppercase pl-1 tracking-widest">Jam Mulai</label>
                            <div class="relative">
                                <select id="add-time" onchange="window.addBookingState.time = this.value; window.renderAddStep()" class="w-full appearance-none px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm font-bold text-slate-700 cursor-pointer shadow-sm transition-all duration-200">
                                    ${TIME_OPTIONS.map(t => `<option value="${t}" ${window.addBookingState.time === t ? 'selected' : ''}>${t}</option>`).join('')}
                                </select>
                                <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                            <p class="text-[9px] text-blue-600 font-bold uppercase mt-1 pl-1">Durasi Paket: ${calculateDisplayTimeRange({ ...window.addBookingState, addOns: window.addBookingState.addOns || [] })}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (step === 3) {
        const currentBranch = window.addBookingState.branch;

        if (currentBranch === 'Cideng') {
            const cidengThemes = BACKGROUND_OPTIONS['Cideng']['Set Tema Eksklusif'];
            html = `
                <div class="space-y-6 animate-fadeIn">
                    <div class="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4">
                        <div>
                            <label class="text-sm font-bold text-slate-800 uppercase tracking-tight">TEMA SET EKSKLUSIF (CIDENG)</label>
                            <p class="text-[11px] text-slate-400 font-medium">Pilih satu atau beberapa tema set studio eksklusif untuk sesi Anda di cabang Cideng.</p>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            ${cidengThemes.map(th => {
                                const isChecked = window.addBookingState.backgroundRows.some(row => row.theme === th);
                                return `
                                    <label class="flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${isChecked ? 'bg-blue-50/50 border-blue-600 shadow-sm' : 'bg-white border-slate-100 hover:border-blue-100'}">
                                        <input type="checkbox" name="add-cideng-bg-checkbox" value="${th}" ${isChecked ? 'checked' : ''} 
                                            onchange="window.toggleCidengBackgroundNew('${th}', this.checked)"
                                            class="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer">
                                        <div class="flex-1">
                                            <p class="text-xs font-bold text-slate-800">${th}</p>
                                        </div>
                                    </label>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else {
            const availableTypes = Object.keys(BACKGROUND_OPTIONS[currentBranch]);
            html = `
                <div class="space-y-6 animate-fadeIn">
                    <div class="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4">
                        <div class="flex justify-between items-center px-1 mb-2">
                            <div>
                                <label class="text-sm font-bold text-slate-800 uppercase tracking-tight">KUSTOMISASI MULTI-BACKGROUND</label>
                                <p class="text-[11px] text-slate-400 font-medium">Pilih satu atau lebih jenis serta tema latar belakang untuk sesi Anda.</p>
                            </div>
                            <button type="button" onclick="window.addBackgroundRow()" class="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3.5 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1.5 shadow-sm">
                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
                                + TAMBAH BACKGROUND
                            </button>
                        </div>

                        <div id="background-rows" class="space-y-3">
                            ${window.addBookingState.backgroundRows.map((row, idx) => {
                                const themes = BACKGROUND_OPTIONS[currentBranch][row.type] || [];
                                const isPilihNanti = BACKGROUND_OPTIONS[currentBranch][row.type] === null;
                                return `
                                    <div class="flex items-center gap-2 group animate-fadeIn">
                                        <div class="flex-1 grid ${isPilihNanti ? 'grid-cols-1' : 'grid-cols-2'} gap-3">
                                            <div class="relative">
                                                <select onchange="window.updateBackgroundRow(${idx}, 'type', this.value)" class="w-full appearance-none py-2.5 pl-4 pr-10 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-blue-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none cursor-pointer shadow-sm">
                                                    ${availableTypes.map(t => `<option value="${t}" ${row.type === t ? 'selected' : ''}>${t}</option>`).join('')}
                                                </select>
                                                <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            ${isPilihNanti ? '' : `
                                            <div class="relative">
                                                <select onchange="window.updateBackgroundRow(${idx}, 'theme', this.value)" class="w-full appearance-none py-2.5 pl-4 pr-10 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-blue-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none cursor-pointer shadow-sm">
                                                    <option value="" ${row.theme === '' ? 'selected' : ''}>Pilih Tema...</option>
                                                    ${themes.map(th => `<option value="${th}" ${row.theme === th ? 'selected' : ''}>${th}</option>`).join('')}
                                                </select>
                                                <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            `}
                                        </div>
                                        <button type="button" onclick="window.duplicateBackgroundRow(${idx})" class="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Duplikasi Baris">
                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                                        </button>
                                        <button type="button" onclick="window.removeBackgroundRow(${idx})" class="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm" title="Hapus Baris">
                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                `;
                            }).join('')}
                        </div>
 
                        ${window.addBookingState.backgroundRows.length === 0 ? `
                            <div class="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center">
                                <p class="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Belum ada background dipilih</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    } else if (step === 4) {
        html = `
            <div class="space-y-6 animate-fadeIn">
                <div class="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4">
                    <div>
                        <label class="text-sm font-bold text-slate-800 uppercase tracking-tight">Kustomisasi Layanan Tambahan (Add-ons)</label>
                        <p class="text-[10px] text-slate-400">Pilih satu atau beberapa layanan tambahan di bawah ini:</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        ${AVAILABLE_ADDONS.map(addon => {
                            const isChecked = window.addBookingState.addOns.some(a => a.name === addon.name);
                            return `
                                <label class="flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${isChecked ? 'bg-blue-50/50 border-blue-600 shadow-sm' : 'bg-white border-slate-100 hover:border-blue-100'}">
                                    <input type="checkbox" name="addons-checkbox" value="${addon.name}" ${isChecked ? 'checked' : ''} 
                                        onchange="window.handleAddonCheckboxChange('${addon.name}', ${addon.price}, this.checked)"
                                        class="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer">
                                    <div class="flex-1">
                                        <p class="text-xs font-bold text-slate-800">${addon.name}</p>
                                        <p class="text-[10px] font-medium text-slate-400">${formatCurrency(addon.price)}</p>
                                    </div>
                                </label>
                            `;
                        }).join('')}
                    </div>

                    <div class="mt-4 p-5 bg-slate-900 rounded-[2rem] text-white shadow-md flex justify-between items-center">
                        <div>
                             <span class="text-[9px] font-black uppercase tracking-widest opacity-50 block">Grand Total Sesi</span>
                             <h3 class="text-2xl font-black">${formatCurrency(window.calculateAddTotal())}</h3>
                        </div>
                        <div class="text-right">
                             <span class="text-[9px] font-black uppercase tracking-widest opacity-50 block">Estimasi Waktu Selesai</span>
                             <p class="text-sm font-bold text-blue-400 font-mono">${calculateDisplayTimeRange({ ...window.addBookingState, addOns: window.addBookingState.addOns || [] })}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (step === 5) {
        html = `
            <div class="space-y-6 animate-fadeIn max-w-lg mx-auto">
                <div class="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4 shadow-sm">
                    <div>
                        <label class="text-sm font-bold text-slate-800 uppercase tracking-tight">Data Diri Klien</label>
                        <p class="text-[10px] text-slate-400">Harap masukkan detail kontak klien dengan benar.</p>
                    </div>

                    <div class="space-y-1.5">
                         <label class="text-[10px] font-black text-slate-400 uppercase pl-1 tracking-wider">Nama Lengkap Klien</label>
                         <input type="text" id="add-customer-name-field" placeholder="Masukkan Nama Lengkap..." value="${window.addBookingState.customerName}" 
                             oninput="window.addBookingState.customerName = this.value" 
                             class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-sm">
                    </div>
                    <div class="space-y-1.5">
                         <label class="text-[10px] font-black text-slate-400 uppercase pl-1 tracking-wider">Nomor WhatsApp Pelanggan</label>
                         <input type="text" id="add-customer-phone-field" placeholder="Contoh: 628123456789" value="${window.addBookingState.phone}" 
                             oninput="window.addBookingState.phone = this.value" 
                             class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-sm">
                    </div>
                    <div class="space-y-1.5">
                         <label class="text-[10px] font-black text-slate-400 uppercase pl-1 tracking-wider">Alamat Email (.com)</label>
                         <input type="email" id="add-customer-email-field" placeholder="Contoh: email@gmail.com" value="${window.addBookingState.email}" 
                             oninput="window.addBookingState.email = this.value" 
                             class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-sm">
                    </div>
                </div>

                <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mt-6">Review & Konfirmasi Booking</h4>
                <div class="p-6 bg-blue-50/50 border border-blue-100 rounded-[2rem] space-y-3">
                     <div class="flex justify-between items-center text-xs">
                          <span class="font-bold text-slate-500">Cabang & Sesi:</span>
                          <span class="font-black text-slate-800">${window.addBookingState.branch} - ${window.addBookingState.category} (${window.addBookingState.tier})</span>
                     </div>
                     <div class="flex justify-between items-center text-xs">
                          <span class="font-bold text-slate-500">Waktu & Tanggal:</span>
                          <span class="font-black text-blue-600 font-mono">${window.addBookingState.date} @ ${window.addBookingState.time}</span>
                     </div>
                     <div class="flex justify-between items-center text-xs">
                          <span class="font-bold text-slate-500">Latar Belakang:</span>
                          <span class="font-black text-slate-800 truncate max-w-[200px]">${window.addBookingState.backgroundRows.filter(r => r.theme).map(r => r.theme).join(', ') || 'Belum dipilih'}</span>
                     </div>
                     <div class="flex justify-between items-center text-xs">
                          <span class="font-bold text-slate-500">Layanan Tambahan:</span>
                          <span class="font-black text-slate-800 truncate max-w-[200px]">${window.addBookingState.addOns.map(a => a.name).join(', ') || 'Tidak ada'}</span>
                     </div>
                     <div class="pt-2 border-t border-blue-100 flex justify-between items-center text-sm">
                          <span class="font-black text-blue-800 uppercase tracking-tight text-xs">Grand Total Biaya</span>
                          <span class="font-black text-blue-600 text-lg">${formatCurrency(window.calculateAddTotal())}</span>
                     </div>
                </div>
            </div>
        `;
    }

    if (contentArea) {
        contentArea.innerHTML = html;
    }
};

window.updateAddState = (key, val) => {
    window.addBookingState[key] = val;
    
    if (key === 'branch') {
        const rules = BRANCH_BUSINESS_RULES[val];
        window.addBookingState.category = rules.categories[0];
        window.addBookingState.tier = rules.getTiers(window.addBookingState.category)[0];
        
        // Reset backgrounds if branch changes
        if (val === 'Cideng') {
            window.addBookingState.backgroundRows = [];
        } else {
            window.addBookingState.backgroundRows = [{ type: 'Wallpaper Background', theme: '' }];
        }
    } else if (key === 'category') {
        const rules = BRANCH_BUSINESS_RULES[window.addBookingState.branch];
        window.addBookingState.tier = rules.getTiers(val)[0];
        
        // Lock background limit: slice if they had more backgrounds than permitted
        const { maxBackgrounds, isFlexible } = getCategoryTierConstraints(val, window.addBookingState.tier, window.addBookingState.branch);
        if (!isFlexible && window.addBookingState.backgroundRows.length > maxBackgrounds) {
            window.addBookingState.backgroundRows = window.addBookingState.backgroundRows.slice(0, maxBackgrounds);
        }
    } else if (key === 'tier') {
        const { maxBackgrounds, isFlexible } = getCategoryTierConstraints(window.addBookingState.category, val, window.addBookingState.branch);
        if (!isFlexible && window.addBookingState.backgroundRows.length > maxBackgrounds) {
            window.addBookingState.backgroundRows = window.addBookingState.backgroundRows.slice(0, maxBackgrounds);
        }
    }
    
    window.renderAddStep();
};

window.addBackgroundRow = () => {
    const branch = window.addBookingState.branch;
    const category = window.addBookingState.category;
    const tier = window.addBookingState.tier;
    const { maxBackgrounds, isFlexible } = getCategoryTierConstraints(category, tier, branch);
    
    if (!isFlexible && window.addBookingState.backgroundRows.length >= maxBackgrounds) {
        window.alert(`Jumlah set background dibatasi maksimal ${maxBackgrounds} set untuk paket ini.`);
        return;
    }

    const defaultType = Object.keys(BACKGROUND_OPTIONS[branch])[0];
    window.addBookingState.backgroundRows.push({ type: defaultType, theme: '' });
    window.renderAddStep();
};

window.duplicateBackgroundRow = (idx) => {
    const branch = window.addBookingState.branch;
    const category = window.addBookingState.category;
    const tier = window.addBookingState.tier;
    const { maxBackgrounds, isFlexible } = getCategoryTierConstraints(category, tier, branch);
    
    if (!isFlexible && window.addBookingState.backgroundRows.length >= maxBackgrounds) {
        window.alert(`Jumlah set background dibatasi maksimal ${maxBackgrounds} set untuk paket ini.`);
        return;
    }

    const row = window.addBookingState.backgroundRows[idx];
    window.addBookingState.backgroundRows.splice(idx + 1, 0, { ...row });
    window.renderAddStep();
};

window.removeBackgroundRow = (idx) => {
    window.addBookingState.backgroundRows.splice(idx, 1);
    window.renderAddStep();
};

window.updateBackgroundRow = (idx, key, val) => {
    window.addBookingState.backgroundRows[idx][key] = val;
    if (key === 'type') {
        const branch = window.addBookingState.branch;
        if (BACKGROUND_OPTIONS[branch] && BACKGROUND_OPTIONS[branch][val] === null) {
            window.addBookingState.backgroundRows[idx].theme = 'Pilih Nanti Di Tempat';
        } else {
            window.addBookingState.backgroundRows[idx].theme = '';
        }
    }
    window.renderAddStep();
};

window.toggleCidengBackgroundNew = (theme, checked) => {
    if (checked) {
        if (!window.addBookingState.backgroundRows.some(row => row.theme === theme)) {
            window.addBookingState.backgroundRows.push({ type: 'Set Tema Eksklusif', theme: theme });
        }
    } else {
        window.addBookingState.backgroundRows = window.addBookingState.backgroundRows.filter(row => row.theme !== theme);
    }
    window.renderAddStep();
};

window.nextAddStep = () => {
    if (window.addBookingState.step < 5) {
        // Validate inputs before moving from step 2 or step 5
        if (window.addBookingState.step === 2) {
            if (!window.addBookingState.date) {
                alert('Silakan pilih Tanggal Sesi terlebih dahulu.');
                return;
            }
            const blackout = checkBlackoutCollisions(window.addBookingState.date, window.addBookingState.branch);
            if (blackout) {
                alert(`❌ Maaf, Studio sedang TUTUP pada tanggal tersebut karena: ${blackout.reason}!`);
                return;
            }
        }
        window.addBookingState.step++;
        window.renderAddStep();
    } else {
        window.handleSaveNewBooking();
    }
};

window.prevAddStep = () => {
    if (window.addBookingState.step > 1) {
        window.addBookingState.step--;
        window.renderAddStep();
    }
};

window.calculateAddTotal = () => {
    const addonsTotal = window.addBookingState.addOns.reduce((sum, a) => sum + a.price, 0);
    const base = getCategoryTierPrice(
        window.addBookingState.branch,
        window.addBookingState.category,
        window.addBookingState.tier
    );
    return base + addonsTotal;
};

window.toggleAddonForNew = (name, price) => {
    const idx = window.addBookingState.addOns.findIndex(a => a.name === name);
    if (idx > -1) {
        window.addBookingState.addOns.splice(idx, 1);
    } else {
        window.addBookingState.addOns.push({ name, price });
    }
    window.renderAddStep();
};

window.handleAddonCheckboxChange = (name, price, isChecked) => {
    const idx = window.addBookingState.addOns.findIndex(a => a.name === name);
    if (isChecked) {
        if (idx === -1) {
            window.addBookingState.addOns.push({ name, price });
        }
    } else {
        if (idx > -1) {
            window.addBookingState.addOns.splice(idx, 1);
        }
    }
    window.renderAddStep();
};

window.handleSaveNewBooking = async () => {
    const s = window.addBookingState;

    // Direct input collection for 100% input state accuracy
    const nameInput = document.getElementById('add-customer-name-field');
    const phoneInput = document.getElementById('add-customer-phone-field');
    const emailInput = document.getElementById('add-customer-email-field');

    if (nameInput) s.customerName = nameInput.value;
    if (phoneInput) s.phone = phoneInput.value;
    if (emailInput) s.email = emailInput.value;

    if(!s.customerName || !s.phone || s.phone.length < 5) {
        alert('Mohon lengkapi Nama Klien dan Nomor WhatsApp.');
        s.step = 5;
        window.renderAddStep();
        return;
    }

    // Check blackout dates
    const blackout = checkBlackoutCollisions(s.date, s.branch);
    if (blackout) {
        alert(`❌ Maaf, Studio sedang TUTUP pada tanggal tersebut karena: ${blackout.reason}!`);
        s.step = 2;
        window.renderAddStep();
        return;
    }

    // Recalculate automatic Finished Hour duration + Extra Hour (if exists)
    const displayTimeRangeStr = calculateDisplayTimeRange({ ...s, addOns: s.addOns || [] });
    const parts = displayTimeRangeStr.replace(' WIB', '').split(' - ');
    const calculatedJamMulai = parts[0] || s.time;
    const calculatedJamSelesai = parts[1] || s.time;

    // Check scheduling collision
    const collision = checkBookingCollision({
        date: s.date,
        branch: s.branch,
        time: s.time,
        category: s.category,
        tier: s.tier,
        addOns: s.addOns
    });

    if (collision) {
        const range = calculateDisplayTimeRange(collision);
        alert(`⚠️ JADWAL BENTROK!\n\nSlot waktu tersebut tidak bisa disimpan karena sudah di-booking oleh klien lain (${collision.customerName}) di Cabang yang sama pada jam tersebut (${range}).\n\nSilakan ganti Tanggal, Cabang, atau Jam Mulai sesi foto.`);
        return;
    }

    const backgroundsArr = s.backgroundRows.filter(r => r.theme).map(r => r.theme);
    const addonsNamesArr = s.addOns.map(a => a.name);

    const newBooking = {
        // Core English fields
        id: `BK-TEMP-${Date.now()}`, // ID sementara; ID asli diberikan oleh database MySQL
        customerName: s.customerName,
        category: s.category,
        tier: s.tier,
        branch: s.branch,
        backgrounds: backgroundsArr,
        email: s.email,
        date: s.date,
        time: s.time,
        status: 'confirmed',
        googleSync: 'Synced', // legacy status for old checkers
        totalPrice: window.calculateAddTotal(),
        phone: s.phone,
        proof: null,
        addOns: s.addOns,

        // Required Indonesian fields mapped perfectly
        nama: s.customerName,
        whatsapp: s.phone,
        emailIndo: s.email, // fallback if needed
        cabang: s.branch,
        kategori: s.category,
        paket: s.tier,
        tanggal: s.date,
        tanggal_foto: s.date,
        jamMulai: calculatedJamMulai,
        jamSelesai: calculatedJamSelesai,
        addons: addonsNamesArr,
        background: backgroundsArr.join(', '),
        googleSynced: true // Mode Simulasi API: Langsung Synced ke Gmail
    };

    // ============================================================
    // PERBAIKAN UTAMA: Kirim data booking baru ke Laravel MySQL
    // ============================================================
    const apiPayload = {
        client_name: s.customerName,
        client_whatsapp: s.phone,
        email: s.email,
        booking_date: s.date,
        booking_time: s.time,
        category: s.category,
        tier: s.tier,
        branch: s.branch,
        add_ons: s.addOns.map(a => a.name).join(', ') || null,
        background: backgroundsArr.join(', ') || null,
        total_price: window.calculateAddTotal()
    };

    let savedId = null;
    try {
        const response = await fetch('http://localhost:8000/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify(apiPayload)
        });
        const data = await response.json();
        if (!response.ok) {
            alert('❌ Gagal menyimpan ke database: ' + (data.message || 'Error validasi server'));
            return;
        }
        savedId = data.data?.id || null;
        console.log('✓ Booking baru berhasil disimpan ke MySQL:', savedId);
    } catch (err) {
        console.error('❌ Gagal terhubung ke backend untuk menyimpan booking baru:', err);
        alert('❌ Tidak bisa terhubung ke server Laravel. Pastikan server berjalan di port 8000.');
        return;
    }
    // ============================================================

    // Refresh data dari backend supaya tabel langsung sinkron
    await refreshReservationsFromBackend();

    alert(`✅ Reservasi atas nama ${s.customerName} Berhasil Disimpan! (ID: ${savedId || 'Otomatis'})`);
    window.closeAddModal();
    
    // Auto-refresh whichever page we are on
    const activeTab = document.querySelector('.tab-btn.active-tab')?.dataset.tab || 'booking-management';
    switchTab(activeTab);
};

window.closeAddModal = () => {
    const modal = document.getElementById('add-modal');
    modal.classList.replace('opacity-100', 'opacity-0');
    modal.querySelector('div').classList.replace('scale-100', 'scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
};

// --- INITIALIZE ---
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('logout-btn').addEventListener('click', handleLogout);
document.getElementById('toggle-password').addEventListener('click', () => {
    const input = document.getElementById('login-password');
    input.type = input.type === 'password' ? 'text' : 'password';
});

document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.id === 'schedule-calendar-trigger') return;
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Dropdown and sub-menus event listeners
const triggerBtn = document.getElementById('schedule-calendar-trigger');
if (triggerBtn) {
    triggerBtn.addEventListener('click', (e) => {
        const sub = document.getElementById('schedule-calendar-sub');
        const chevron = document.getElementById('chevron-icon');
        
        const currentActiveBtn = document.querySelector('.tab-btn.active-tab');
        const isAlreadyActive = currentActiveBtn && currentActiveBtn.dataset.tab === 'schedule-calendar';

        if (isAlreadyActive) {
            if (sub && chevron) {
                const isHidden = sub.classList.toggle('hidden');
                if (!isHidden) {
                    chevron.classList.remove('rotate-0');
                    chevron.classList.add('rotate-90');
                } else {
                    chevron.classList.remove('rotate-90');
                    chevron.classList.add('rotate-0');
                }
            }
        } else {
            switchTab('schedule-calendar');
        }
    });
}

const kBtn = document.getElementById('submenu-karawaci');
if (kBtn) {
    kBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.activeCalendarBranch = 'Karawaci';
        
        const sub = document.getElementById('schedule-calendar-sub');
        const chevron = document.getElementById('chevron-icon');
        if (sub) sub.classList.remove('hidden');
        if (chevron) {
            chevron.classList.remove('rotate-0');
            chevron.classList.add('rotate-90');
        }
        
        switchTab('schedule-calendar');
    });
}

const cBtn = document.getElementById('submenu-cideng');
if (cBtn) {
    cBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.activeCalendarBranch = 'Cideng';
        
        const sub = document.getElementById('schedule-calendar-sub');
        const chevron = document.getElementById('chevron-icon');
        if (sub) sub.classList.remove('hidden');
        if (chevron) {
            chevron.classList.remove('rotate-0');
            chevron.classList.add('rotate-90');
        }
        
        switchTab('schedule-calendar');
    });
}

// Sidebar Mobile Toggle
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
const openSidebar = () => {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.replace('opacity-0', 'opacity-100'), 10);
};
const closeSidebar = () => {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => overlay.classList.add('hidden'), 300);
};

const sidebarTrigger = document.getElementById('sidebar-trigger');
if(sidebarTrigger) sidebarTrigger.addEventListener('click', openSidebar);
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
if(mobileMenuToggle) mobileMenuToggle.addEventListener('click', openSidebar);
const mobileMenuOpenSidebar = document.getElementById('mobile-menu-open-sidebar');
if(mobileMenuOpenSidebar) mobileMenuOpenSidebar.addEventListener('click', openSidebar);
document.getElementById('close-sidebar').addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

// Register Notification Bell & Dropdown Listeners
const bellBtn = document.getElementById('notification-bell');
if (bellBtn) {
    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.toggleNotificationDropdown();
    });
}

const clearNotifBtn = document.getElementById('clear-notifications');
if (clearNotifBtn) {
    clearNotifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.clearAllNotifications();
    });
}

// Click outside dropdowns to close
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('notification-dropdown');
    const bellBtn = document.getElementById('notification-bell');
    if (dropdown && !dropdown.classList.contains('hidden')) {
        if (!dropdown.contains(e.target) && (!bellBtn || !bellBtn.contains(e.target))) {
            dropdown.classList.add('hidden');
        }
    }
});

// Run initial notification render
window.renderNotifications();

// Inisialisasi variabel global lomotoChartInstance saat DOMContentLoaded pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
    lomotoChartInstance = null;
});

// ========================================================
// TAMBAHAN FUNGSI API BACKEND (CRUD LENGKAP & UPDATE)
// ========================================================

// 1. Fungsi Update Status Reservasi ke MySQL (Misal: Admin klik "Terima" atau "Tolak")
window.confirmBooking = async (id) => {
    const booking = bookingState.find(b => Number(b.id) === Number(id));
    if (booking) {
        booking.status = 'confirmed';
        
        // === TAMBAHKAN BARIS INI UNTUK MENEMBAK LARAVEL ===
        await window.updateReservationStatusBackend(id, 'confirmed');
        // =================================================
        
        renderDashboard();
    }
};
window.cancelBooking = async (id) => {
    const booking = bookingState.find(b => Number(b.id) === Number(id));
    if (booking) {
        booking.status = 'cancelled';
        
        // === TAMBAHKAN BARIS INI UNTUK MENEMBAK LARAVEL ===
        await window.updateReservationStatusBackend(id, 'cancelled');
        // =================================================
        
        renderDashboard();
    }
};
// 3. Fungsi Sinkronisasi Pengaturan Operasional Studio ke MySQL
// Mengirim data jamBuka, jamTutup, dan status studio agar tersimpan permanen di database server
window.saveStudioSettingsBackend = async (branchKey, settingsData) => {
    try {
        const response = await fetch(`/api/studio-settings/${branchKey}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
            },
            body: JSON.stringify({
                jam_buka: settingsData.jamBuka,
                jam_tutup: settingsData.jamTutup,
                status: settingsData.status
            })
        });
        
        if (response.ok) {
            console.log(`✓ Pengaturan operasional cabang ${branchKey} berhasil disinkronkan ke database.`);
        } else {
            console.warn("Gagal sinkronisasi pengaturan ke database, data sementara tersimpan di LocalStorage.");
        }
    } catch (error) {
        console.log("Mode Offline: Gagal terhubung ke database untuk menyimpan pengaturan.");
    }
};

// ========================================================
// REVISI FUNGSI UPDATE STATUS DI APP.JS (SINKRON PORT 8000)
// ========================================================
window.updateReservationStatusBackend = async (id, statusBaru) => {
    try {
        console.log(`🚀 Menembak API Laravel... ID: ${id} -> Status: ${statusBaru}`);
        
        const response = await fetch(`http://localhost:8000/api/reservations/${id}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify({ status: statusBaru })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log(`✓ Database phpMyAdmin Berhasil Diperbarui! Status ${id} -> ${statusBaru}`);
            // PERBAIKAN: Update local state langsung, lalu refresh dari backend — tidak perlu location.reload()
            const localItem = bookingState.find(r => Number(r.id) === Number(id));
            if (localItem) localItem.status = statusBaru;
            if (typeof window.showToast === 'function') {
                window.showToast(`Sukses mengubah status menjadi ${statusBaru}`);
            }
            // Refresh data dari MySQL supaya tabel sinkron
            await refreshReservationsFromBackend();
        } else {
            alert("Gagal: " + (data.message || "Eror Validasi"));
        }
    } catch (error) {
        console.error("❌ Gagal terhubung ke API port 8000:", error);
    }
};

// === SEKALIAN GANTI FUNGSI DELETE INI ===
window.deleteReservationBackend = async (id) => {
    try {
        console.log(`Mengirim permintaan hapus data ${id} ke Laravel...`);
        
        // Mengunci URL ke port absolut server Laravel kamu
        const response = await fetch(`http://localhost:8000/api/reservations/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log(`✓ Berhasil menghapus data booking ${id} dari database.`);
            // Segera refresh state dashboard agar data terbaru langsung ditarik
            await refreshReservationsFromBackend();
        } else {
            console.error(`❌ Gagal menghapus data dari server. Status: ${response.status}`);
            alert("Gagal menghapus data dari server.");
        }
    } catch (error) {
        console.error("❌ Terjadi kesalahan koneksi saat menghapus data.", error);
    }
};

