// Database paket dipisah berdasarkan Cabang Studio agar sinkron dengan Web Admin (app.js)
const studioDatabase = {
  "Studio Karawaci": {
    "Personal": {
      subtext: "",
      packages: [
        { name: "Wood", price: 800000, displayPrice: "800K", duration: 30, session: "30 Minutes Session", info: "1 Pax", bgGrad: "linear-gradient(135deg, #A86B32 0%, #633912 100%)", textColor: "text-[#1A1A1A]", features: ["1 Choice of Background", "5 Edited Photos", "Basic Photographer"] },
        { name: "Silver", price: 2000000, displayPrice: "2 Mil", duration: 60, session: "60 Minutes Session", info: "1 Pax", bgGrad: "linear-gradient(135deg, #E0E0E0 0%, #9E9E9E 100%)", textColor: "text-[#1A1A1A]", features: ["2 Choice of Background", "10 Edited Photos", "5 Printed Photos (4R)", "Basic Photographer", "Basic MUA"] },
        { name: "Gold", price: 5000000, displayPrice: "5 Mil", duration: 90, session: "90 Minutes Session", info: "1 Pax", bgGrad: "linear-gradient(135deg, #EED184 0%, #BA943C 100%)", textColor: "text-[#1A1A1A]", features: ["3 Choice of Background", "15 Edited Photos", "5 Printed Photos (4R)", "1 Printed Photos (50 x 60 CM)", "Professional Photographer", "Professional MUA", "Wardrobe ( Voucher 500K )"] }
      ]
    },
    "Couple": {
      subtext: "Ideal for Pre-wedding sessions",
      packages: [
        { name: "Wood", price: 1000000, displayPrice: "1 Mil", duration: 30, session: "30 Minutes Session", info: "2 Pax", bgGrad: "linear-gradient(135deg, #A86B32 0%, #633912 100%)", textColor: "text-[#1A1A1A]", features: ["1 Choice of Background", "5 Edited Photos", "Basic Photographer"] },
        { name: "Silver", price: 4000000, displayPrice: "4 Mil", duration: 60, session: "60 Minutes Session", info: "2 Pax", bgGrad: "linear-gradient(135deg, #E0E0E0 0%, #9E9E9E 100%)", textColor: "text-[#1A1A1A]", features: ["2 Choice of Background", "10 Edited Photos", "5 Printed Photos (4R)", "1 Printed Photos (50 x 60 CM)", "Basic Photographer", "Basic MUA", "Wardrobe ( Voucher 500K )"] },
        { name: "Gold", price: 8000000, displayPrice: "8 Mil", duration: 120, session: "120 Minutes Session", info: "2 Pax", bgGrad: "linear-gradient(135deg, #EED184 0%, #BA943C 100%)", textColor: "text-[#1A1A1A]", features: ["3 Choice of Background", "15 Edited Photos", "5 Printed Photos (4R)", "1 Printed Photos (50 x 60 CM)", "Professional Photographer", "Professional MUA", "Wardrobe ( Voucher 1 Mil )"] }
      ]
    },
    "Group": {
      subtext: "Ideal for Family, Graduation, or Friendship sessions",
      packages: [
        { name: "Wood", price: 1000000, displayPrice: "1 Mil", duration: 30, session: "30 Minutes Session", info: "5 Pax", bgGrad: "linear-gradient(135deg, #A86B32 0%, #633912 100%)", textColor: "text-[#1A1A1A]", features: ["1 Choice of Background", "5 Edited Photos", "Basic Photographer"] },
        { name: "Silver", price: 2500000, displayPrice: "2,5 Mil", duration: 60, session: "60 Minutes Session", info: "5 Pax", bgGrad: "linear-gradient(135deg, #E0E0E0 0%, #9E9E9E 100%)", textColor: "text-[#1A1A1A]", features: ["2 Choice of Background", "10 Edited Photos", "Basic Photographer", "1 Trifold Album"] },
        { name: "Gold", price: 4000000, displayPrice: "4 Mil", duration: 90, session: "90 Minutes Session", info: "5 Pax", bgGrad: "linear-gradient(135deg, #EED184 0%, #BA943C 100%)", textColor: "text-[#1A1A1A]", features: ["2 Choice of Background", "15 Edited Photos", "Professional Photographer", "1 Trifold Album", "1 Photo Canvas ( 50 x 60 CM )"] }
      ]
    },
    "Yearbook": {
      subtext: "Ideal for Corporate Group sessions",
      packages: [
        { name: "Wood", price: 2500000, displayPrice: "2,5 Mil", duration: 60, session: "60 Minutes Session", info: "20 Pax", bgGrad: "linear-gradient(135deg, #A86B32 0%, #633912 100%)", textColor: "text-[#1A1A1A]", features: ["1 Choice of Background", "25 Edited Photos", "Included Photographer"] },
        { name: "Silver", price: 3500000, displayPrice: "3,5 Mil", duration: 120, session: "120 Minutes Session", info: "30 Pax", bgGrad: "linear-gradient(135deg, #E0E0E0 0%, #9E9E9E 100%)", textColor: "text-[#1A1A1A]", features: ["2 Choice of Background", "35 Edited Photos", "Included Photographer"] },
        { name: "Gold", price: 4500000, displayPrice: "4,5 Mil", duration: 180, session: "180 Minutes Session", info: "40 Pax", bgGrad: "linear-gradient(135deg, #EED184 0%, #BA943C 100%)", textColor: "text-[#1A1A1A]", features: ["2 Choice of Background", "45 Edited Photos", "Included Photographer"] }
      ]
    },
    "Product": {
      subtext: "",
      packages: [
        { name: "Wood", price: 500000, displayPrice: "500K", duration: 30, session: "Flexible Session", info: "", bgGrad: "linear-gradient(135deg, #A86B32 0%, #633912 100%)", textColor: "text-[#1A1A1A]", features: ["1 Choice of Background", "Max 5 SKU", "5 Edited Photos", "Basic Photographer"] },
        { name: "Silver", price: 3000000, displayPrice: "3 Mil", duration: 60, session: "Flexible Session", info: "", bgGrad: "linear-gradient(135deg, #E0E0E0 0%, #9E9E9E 100%)", textColor: "text-[#1A1A1A]", features: ["2 Choice of Background", "Max 10 SKU", "10 Edited Photos", "Basic Photographer", "Basic Talent"] },
        { name: "Gold", price: 7000000, displayPrice: "7 Mil", duration: 120, session: "Flexible Session", info: "", bgGrad: "linear-gradient(135deg, #EED184 0%, #BA943C 100%)", textColor: "text-[#1A1A1A]", features: ["2 Choice of Background", "Max 20 SKU", "20 Edited Photos", "Professional Photographer", "Professional Talent"] }
      ]
    },
    "Studio Rental": {
      subtext: "",
      packages: [
        { name: "Wood", price: 1000000, displayPrice: "1 Mil", duration: 180, session: "3 Hours Studio Access", info: "", bgGrad: "linear-gradient(135deg, #A86B32 0%, #633912 100%)", textColor: "text-[#1A1A1A]", features: ["3 Studio Lights Included", "Studio Rental Only (No Photographer)", "+IDR 250k for Weekend Sessions"] },
        { name: "Silver", price: 2000000, displayPrice: "2 Mil", duration: 360, session: "6 Hours Studio Access", info: "", bgGrad: "linear-gradient(135deg, #E0E0E0 0%, #9E9E9E 100%)", textColor: "text-[#1A1A1A]", features: ["3 Studio Lights Included", "Studio Rental Only (No Photographer)", "+IDR 300k for Weekend Sessions"] },
        { name: "Gold", price: 2500000, displayPrice: "2,5 Mil", duration: 540, session: "9 Hours Studio Access", info: "", bgGrad: "linear-gradient(135deg, #EED184 0%, #BA943C 100%)", textColor: "text-[#1A1A1A]", features: ["3 Studio Lights Included", "Studio Rental Only (No Photographer)", "+IDR 450k for Weekend Sessions"] },
        { name: "Platinum", price: 3000000, displayPrice: "3 Mil", duration: 720, session: "12 Hours Studio Access", info: "", bgGrad: "linear-gradient(135deg, #E6F4FE 0%, #C2E2F7 100%)", textColor: "text-[#1A1A1A]", features: ["3 Studio Lights Included", "Studio Rental Only (No Photographer)", "+IDR 600k for Weekend Sessions"] }
      ]
    }
  },
  "Studio Cideng": {
    "Studio Rental": {
      subtext: "Exclusive Studio Access at Cideng",
      packages: [
        { name: "Silver", price: 500000, displayPrice: "500K", duration: 60, session: "60 Minutes Session", info: "", bgGrad: "linear-gradient(135deg, #E0E0E0 0%, #9E9E9E 100%)", textColor: "text-[#1A1A1A]", features: ["Flexible Session Access", "Studio Rental Only", "Max 99 Background Choices"] },
        { name: "Gold", price: 1500000, displayPrice: "1,5 Mil", duration: 60, session: "60 Minutes VIP Session", info: "", bgGrad: "linear-gradient(135deg, #EED184 0%, #BA943C 100%)", textColor: "text-[#1A1A1A]", features: ["Premium Studio Access", "Studio Rental Only", "Max 99 Background Choices"] }
      ]
    }
  }
};

const backgroundCategorizedDatabase = {
  "Studio Karawaci": {
    slug: "karawaci",
    tag: "",
    themes: [
      { name: "Blue Classic", type: "image", src: "BLUE CLASSIC.png" },
      { name: "Bohemian", type: "image", src: "BOHEMIAN.png" },
      { name: "Classic Chinese", type: "image", src: "CLASSIC CHINESE.png" },
      { name: "Clean Set", type: "image", src: "CLEAN SET.png" },
      { name: "Kitchen Set", type: "image", src: "KITCHEN.png" },
      { name: "Ramadhan Kareem", type: "image", src: "RAMADHAN KAREEM.png" },
      { name: "Red Gold Chinese", type: "image", src: "RED GOLD CHINESE.png" },
      { name: "Simple Wood", type: "image", src: "SIMPLE WOOD.png" },
      { name: "Valentine Floral", type: "image", src: "VALENTINE FLORAL.png" },
      { name: "Vintage Flower", type: "image", src: "VINTAGE FLOWER.png" }
    ],
    wallpapers: [
      { name: "Biru", type: "color", hex: "#3ec1d3" },
      { name: "Cokelat Taupe", type: "color", hex: "#8b8878" },
      { name: "Cokelat Muda", type: "color", hex: "#bcbaae" },
      { name: "Abu Tua", type: "color", hex: "#8fa1b3" },
      { name: "Hijau Tosca", type: "color", hex: "#72D4C7" },
      { name: "Cokelat", type: "color", hex: "#c27d62" },
      { name: "Pink", type: "color", hex: "#dcaeaf" },
      { name: "Hitam", type: "color", hex: "#0F1012" },
      { name: "Ungu", type: "color", hex: "#967FC7" },
      { name: "Hijau ", type: "color", hex: "#55B16A" },
    ]
  },
  "Studio Cideng": {
    slug: "cideng",
    tag: "",
    themes: [
      { name: "Bathtub", type: "image", src: "BATHTUB.jpg" },
      { name: "White Limbo", type: "image", src: "LIMBO.jpg" },
      { name: "Royal Set", type: "image", src: "ROYAL.jpg" },
      { name: "Vintage ", type: "image", src: "VINTAGE.jpg" },
      { name: "Wardrobe Room", type: "image", src: "WARDROBE ROOM.jpg" },
      { name: "Wooden", type: "image", src: "WOODEN.jpg" }
    ],
    wallpapers: [] 
  }
};

let activeCategory = "Personal";
let currentStep = 1;
let bookingData = { studio: '', serviceCategory: '', package: '', price: 0, duration: 0, addonsPrice: 0, background: [], addons: [], date: '', time: '09:00', endTime: '', name: '', phone: '', email: '' };

document.addEventListener("DOMContentLoaded", () => {
  renderPackages(activeCategory);
  renderOuterGallery();
});

function renderOuterGallery() {
  const gridContainer = document.getElementById("backgroundGrid");
  if (!gridContainer) return;
  gridContainer.innerHTML = "";
  Object.keys(backgroundCategorizedDatabase).forEach(studioKey => {
    const currentStudio = backgroundCategorizedDatabase[studioKey];
    currentStudio.themes.forEach(theme => {
      gridContainer.innerHTML += `
        <div data-location="${currentStudio.slug}" class="bg-item flex flex-col gap-3">
          <div class="relative rounded-[20px] overflow-hidden aspect-[4/5] bg-gray-200 shadow-sm group">
            <img src="${window.imagePath || ''}${theme.src}" alt="${theme.name}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105">
          </div>
          <div class="text-black font-semibold text-sm px-1">${theme.name} ${currentStudio.tag}</div>
        </div>
      `;
    });
  });
}

function switchCategoryTab(categoryName) {
  activeCategory = categoryName;
  document.querySelectorAll(".category-tab").forEach(tab => {
    tab.className = "category-tab px-5 py-2 rounded-full font-medium text-sm transition text-gray-600 hover:text-black";
  });
  const currentTab = document.getElementById(`tab-${categoryName}`);
  if (currentTab) {
    currentTab.className = "category-tab px-5 py-2 rounded-full font-medium text-sm transition bg-[#1A1A1A] text-white shadow-md";
  }
  renderPackages(categoryName);
}

function renderPackages(cat) {
  const targetGrid = document.getElementById("packageCardsGrid");
  const subtextEl = document.getElementById("categorySubtext");
  if (!targetGrid || !subtextEl) return;
  
  // Default fallback ke Studio Karawaci untuk list view pricing di landing page utama
  const branchData = studioDatabase["Studio Karawaci"];
  
  if (!branchData[cat]) {
    subtextEl.innerText = "";
    targetGrid.innerHTML = `<p class="text-gray-400 italic text-sm">Kategori tidak tersedia untuk cabang ini.</p>`;
    return;
  }

  subtextEl.innerText = branchData[cat].subtext || "";
  targetGrid.innerHTML = "";

  branchData[cat].packages.forEach(pkg => {
    let featureListHTML = pkg.features.map(f => `
      <div class="flex items-start gap-2.5 text-xs font-medium text-gray-700">
        <span class="w-4 h-4 mt-0.5 border border-gray-300 text-gray-600 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0">✓</span>
        <span>${f}</span>
      </div>
    `).join('');

    let infoHTML = pkg.info ? `<div class="absolute top-6 right-6 flex items-center gap-1 opacity-70 text-xs font-semibold"><span>👤</span> <span>${pkg.info}</span></div>` : '';
    let sessionHTML = pkg.session ? `<p class="text-xs opacity-90 mt-1">${pkg.session}</p>` : '';

    targetGrid.innerHTML += `
      <div class="bg-white rounded-[24px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between w-full sm:w-[280px]">
        <div>
          <div class="rounded-[20px] p-6 flex flex-col justify-between min-h-[160px] relative overflow-hidden" style="background: ${pkg.bgGrad};">
            ${infoHTML}
            <div class="${pkg.textColor}">
              <span class="text-sm font-semibold tracking-wide block mb-1">${pkg.name}</span>
              <div class="flex items-baseline gap-1">
                <span class="text-xs font-bold opacity-80">IDR</span>
                <span class="text-3xl font-black tracking-tight">${pkg.displayPrice}</span>
              </div>
              ${sessionHTML}
            </div>
            <button onclick="openBookingFromCard('${cat}', '${pkg.name}', ${pkg.price}, ${pkg.duration || 0})" class="w-full bg-[#161616] hover:bg-black text-white text-xs font-bold py-2.5 rounded-xl transition mt-4 tracking-wide shadow-md">Select</button>
          </div>
          <div class="px-2 py-4 space-y-2.5">${featureListHTML}</div>
        </div>
      </div>
    `;
  });
}

function openBookingFromCard(category, packageName, price, duration) {
  resetBookingFormState(); 
  
  // 1. Kunci data secara otomatis ke Studio Karawaci
  bookingData.studio = "Studio Karawaci";
  bookingData.serviceCategory = category;
  bookingData.package = packageName;
  bookingData.price = price;
  bookingData.duration = duration;
  
  // 2. Sinkronisasikan element select kategori di HTML
  const categorySelect = document.getElementById('serviceCategorySelect');
  if (categorySelect) {
    categorySelect.value = category; 
  }

  // Buka modal reservasi
  currentStep = 1;
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  // 3. AKTIFKAN VISUAL SELEKSI: Cari element card Studio Karawaci di Step 1 lalu tandai aktif
  const targetStudioCard = document.getElementById('studioKarawaciCard');
  if (targetStudioCard) {
    selectStudio("Studio Karawaci", targetStudioCard);
  }
  
  // 4. Langsung lompat ke Step 2 (Layanan & Paket)
  currentStep = 2;
  showStep(currentStep);

  // 5. Sinkronisasikan element select Tier Paket di HTML agar langsung mengarah ke paket yang dipilih
  const pSelect = document.getElementById('packageTierSelect');
  if (pSelect) {
    pSelect.value = packageName;
  }
}

function openBooking() {
  resetBookingFormState(); 
  currentStep = 1;
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
  showStep(currentStep);
}

function closeBooking() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  resetBookingFormState(); 
}

function resetBookingFormState() {
  currentStep = 1;
  bookingData = { studio: '', serviceCategory: '', package: '', price: 0, duration: 0, addonsPrice: 0, background: [], addons: [], date: '', time: '09:00', endTime: '', name: '', phone: '', email: '' };

  document.querySelectorAll('.studio-card').forEach(el => {
    el.className = "studio-card border-2 border-gray-200 rounded-2xl p-3 cursor-pointer hover:border-black transition flex items-center space-x-4 bg-white";
  });

  const iDate = document.getElementById('inputDate');
  if (iDate) iDate.value = '';
  
  const iTime = document.getElementById('inputTime');
  if (iTime) iTime.value = '09:00';

  const cName = document.getElementById('custName');
  if (cName) cName.value = '';

  const cPhone = document.getElementById('custPhone');
  if (cPhone) cPhone.value = '';

  const cEmail = document.getElementById('custEmail');
  if (cEmail) cEmail.value = '';

  document.querySelectorAll('#step4 input[type="checkbox"]').forEach(cb => cb.checked = false);
}

function filterCategoryDropdownByStudio() {
  const categorySelect = document.getElementById('serviceCategorySelect');
  if (!categorySelect) return;
  
  if (bookingData.studio === "Studio Cideng") {
    categorySelect.value = "Studio Rental";
    Array.from(categorySelect.options).forEach(option => {
      if (option.value !== "Studio Rental") {
        option.hidden = true;
        option.disabled = true;
      } else {
        option.hidden = false;
        option.disabled = false;
      }
    });
    handleModalServiceChange("Studio Rental");
  } else {
    Array.from(categorySelect.options).forEach(option => {
      option.hidden = false;
      option.disabled = false;
    });
    
    // Perbaikan di sini: Jika bookingData sudah membawa serviceCategory dari Card, 
    // gunakan itu daripada memaksa mengikuti activeCategory tab landing page.
    if (bookingData.serviceCategory) {
      categorySelect.value = bookingData.serviceCategory;
    } else if (categorySelect.value === "Studio Rental" && activeCategory !== "Studio Rental") {
      categorySelect.value = activeCategory;
    }
    
    handleModalServiceChange(categorySelect.value);
  }
}

function handleModalServiceChange(category) {
  bookingData.serviceCategory = category;
  const pSelect = document.getElementById('packageTierSelect');
  if (!pSelect) return;
  pSelect.innerHTML = "";
  
  const currentStudio = bookingData.studio || "Studio Karawaci";
  const branchDb = studioDatabase[currentStudio];

  if (branchDb && branchDb[category]) {
    const categoryData = branchDb[category];
    
    // Jika data berupa array (Karawaci)
    if (Array.isArray(categoryData.packages)) {
      categoryData.packages.forEach(p => {
        const isSelected = (p.name === bookingData.package) ? 'selected' : '';
        pSelect.innerHTML += `<option value="${p.name}" data-price="${p.price}" data-duration="${p.duration || 0}" ${isSelected}>${p.name} - IDR ${p.price.toLocaleString('id-ID')}</option>`;
      });
    } 
    // Jika data berupa array langsung di bawah properti (seperti model Cideng yang disamakan)
    else if (Array.isArray(categoryData)) {
      categoryData.forEach(p => {
        const isSelected = (p.name === bookingData.package) ? 'selected' : '';
        pSelect.innerHTML += `<option value="${p.name}" data-price="${p.price}" data-duration="${p.duration || 0}" ${isSelected}>${p.name} - IDR ${p.price.toLocaleString('id-ID')}</option>`;
      });
    }

    // Pasang state package default jika belum diatur atau hilang akibat ganti studio
    const selectedOption = pSelect.options[pSelect.selectedIndex] || pSelect.options[0];
    if (selectedOption) {
      bookingData.package = selectedOption.value;
      bookingData.price = parseInt(selectedOption.getAttribute('data-price'));
      bookingData.duration = parseInt(selectedOption.getAttribute('data-duration'));
    }
  }
}

function handleModalPackageChange(selectElement) {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  bookingData.package = selectedOption.value;
  
  const currentStudio = bookingData.studio || "Studio Karawaci";
  const category = document.getElementById('serviceCategorySelect').value;
  const categoryData = studioDatabase[currentStudio][category];
  
  let found = null;
  if (Array.isArray(categoryData.packages)) {
    found = categoryData.packages.find(p => p.name === selectedOption.value);
  } else if (Array.isArray(categoryData)) {
    found = categoryData.find(p => p.name === selectedOption.value);
  }

  if (found) {
    bookingData.price = found.price;
    bookingData.duration = found.duration;
  }
}

function getBackgroundLimit() {
  if (bookingData.studio === "Studio Cideng") {
    return 99; // Mengikuti maxBackgrounds: 99 di app.js untuk cabang Cideng
  }
  
  const cat = bookingData.serviceCategory;
  const pName = bookingData.package;

  // Batasan khusus untuk Group & Yearbook Paket Gold di Karawaci (Maksimal 2)
  if ((cat === "Group" || cat === "Yearbook") && pName === "Gold") {
    return 2;
  }

  if (pName === "Wood") return 1;
  if (pName === "Silver") return 2;
  if (pName === "Gold") return 3;
  if (pName === "Platinum") return 4;
  return 1;
}

function populateModalBackgrounds() {
  const container = document.getElementById("modalBgDynamicLayout");
  const counterText = document.getElementById("bgCounterText");
  if (!container || !counterText) return;
  
  const currentStudio = bookingData.studio || "Studio Karawaci";
  const dataGroup = backgroundCategorizedDatabase[currentStudio];
  const limit = getBackgroundLimit();

  counterText.innerText = `(${bookingData.background.length} / ${limit === 99 ? 'Unlimited' : limit})`;
  if (!dataGroup) return;

  let htmlContent = "";

  htmlContent += `
    <div>
      <h4 class="text-sm font-bold text-gray-800 mb-3 tracking-wide text-center">Set Themes</h4>
      <div class="flex justify-start gap-4 overflow-x-auto pb-4 px-4 snap-x scroll-smooth">
  `;
  dataGroup.themes.forEach((item, index) => {
    const isSelected = bookingData.background.includes(item.name);
    htmlContent += `
      <div onclick="selectBackgroundItem('${item.name}')" class="flex-shrink-0 w-36 snap-start cursor-pointer text-center">
        <div class="w-full aspect-[4/3] rounded-xl overflow-hidden border-2 transition ${isSelected ? 'border-[#2ecc71] scale-95 shadow-md' : 'border-transparent shadow-sm'}">
          <img src="${window.imagePath || ''}${item.src}" alt="${item.name}" class="w-full h-full object-cover">
        </div>
        <p class="text-[11px] font-semibold mt-1.5 transition ${isSelected ? 'text-[#2ecc71]' : 'text-gray-500'}">
          ${item.name} ${isSelected ? '✔' : ''}
        </p>
      </div>
    `;
  });
  htmlContent += `</div></div>`;

  if (dataGroup.wallpapers && dataGroup.wallpapers.length > 0) {
    htmlContent += `
      <div>
        <h4 class="text-sm font-bold text-gray-800 mb-3 tracking-wide text-center">Set Wallpaper</h4>
        <div class="flex justify-start gap-4 overflow-x-auto pb-4 px-4 snap-x scroll-smooth">
    `;
    dataGroup.wallpapers.forEach((item, index) => {
      const isSelected = bookingData.background.includes(item.name);
      htmlContent += `
        <div onclick="selectBackgroundItem('${item.name}')" class="flex-shrink-0 w-36 snap-start cursor-pointer text-center">
          <div class="w-full aspect-[4/3] rounded-xl border-2 transition ${isSelected ? 'border-[#2ecc71] scale-95 shadow-md' : 'border-transparent shadow-sm'}" style="background-color: ${item.hex};"></div>
          <p class="text-[11px] font-semibold mt-1.5 transition ${isSelected ? 'text-[#2ecc71]' : 'text-gray-500'}">
            ${item.name} ${isSelected ? '✔' : ''}
          </p>
        </div>
      `;
    });
    htmlContent += `</div></div>`;
  }

  const isLaterSelected = bookingData.background.includes("Pilih Nanti Di Studio");
  htmlContent += `
    <div class="flex justify-center mt-6">
      <button onclick="selectBackgroundItem('Pilih Nanti Di Studio')" class="px-5 py-2 border rounded-full text-xs font-semibold transition ${isLaterSelected ? 'bg-blue-600 text-white border-transparent' : 'border-blue-500 text-blue-500 hover:bg-blue-50'}">
        Pilih Nanti Di Studio
      </button>
    </div>
  `;

  container.innerHTML = htmlContent;
}

function selectBackgroundItem(name) {
  const limit = getBackgroundLimit();
  
  if (name === "Pilih Nanti Di Studio") {
    // Cek apakah "Pilih Nanti Di Studio" sudah terpilih sebelumnya
    const isAlreadySelected = bookingData.background.includes("Pilih Nanti Di Studio");
    
    if (isAlreadySelected) {
      // Jika sudah terpilih dan diklik lagi, hapus/cancel (kembalikan ke array kosong)
      bookingData.background = [];
    } else {
      // Jika belum terpilih, set absolut menjadi "Pilih Nanti Di Studio"
      bookingData.background = ["Pilih Nanti Di Studio"];
    }
  } else {
    // Jika user memilih tema biasa, hapus opsi "Pilih Nanti Di Studio" dari array
    bookingData.background = bookingData.background.filter(item => item !== "Pilih Nanti Di Studio");
    
    const idx = bookingData.background.indexOf(name);
    if (idx > -1) {
      // Jika tema sudah ada di array, hapus (Cancel)
      bookingData.background.splice(idx, 1);
    } else {
      // Jika belum ada, cek limit sebelum menambahkan
      if (bookingData.background.length >= limit) {
        alert(`Maaf, pilihan untuk Paket ${bookingData.package} di ${bookingData.studio} dibatasi maksimal ${limit} background.`);
        return;
      }
      bookingData.background.push(name);
    }
  }
  
  // Render ulang UI modal agar perubahan warna/status tombol langsung kelihatan
  populateModalBackgrounds();
}

function updateAddons() {
  bookingData.addons = [];
  bookingData.addonsPrice = 0;
  const checkedBoxes = document.querySelectorAll('#step4 input[type="checkbox"]:checked');
  checkedBoxes.forEach(cb => {
    bookingData.addons.push({ name: cb.value, price: parseInt(cb.getAttribute('data-price')) });
    bookingData.addonsPrice += parseInt(cb.getAttribute('data-price'));
  });
}

function showStep(step) {
  document.querySelectorAll('.booking-step').forEach(el => {
    el.classList.add('hidden');
    el.classList.remove('flex');
  });
  
  const targetStep = document.getElementById(`step${step}`);
  if (targetStep) {
    targetStep.classList.remove('hidden');
    if(step === 2) targetStep.classList.add('flex');
  }

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const footer = document.getElementById('actionFooter');

  if(step === 2) filterCategoryDropdownByStudio();
  if(step === 3) populateModalBackgrounds();
  if(step === 4) filterTimeOptionsByStudio();

  if(step === 6 || step === 7) {
    if (footer) footer.classList.add('hidden');
  } else {
    if (footer) footer.classList.remove('hidden');
    if(step === 1) {
      if (prevBtn) prevBtn.classList.add('invisible');
    } else {
      if (prevBtn) prevBtn.classList.remove('invisible');
    }
    if (nextBtn) {
      nextBtn.className = "px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition";
      nextBtn.innerText = "Selanjutnya";
    }
  }
  renderStepper();
}

function filterTimeOptionsByStudio() {
  const timeSelect = document.getElementById('inputTime');
  if (!timeSelect) return;
  
  const isCideng = (bookingData.studio === "Studio Cideng");
  
  Array.from(timeSelect.options).forEach(option => {
    const hour = parseInt(option.value.split(':')[0], 10);
    
    if (isCideng && hour < 10) {
      option.hidden = true;
      option.disabled = true;
    } else {
      option.hidden = false;
      option.disabled = false;
    }
  });

  const currentSelectedHour = parseInt(timeSelect.value.split(':')[0], 10);
  if (isCideng && currentSelectedHour < 10) {
    timeSelect.value = "10:00";
  } else if (!isCideng && currentSelectedHour === 10 && timeSelect.value === "10:00") {
    timeSelect.value = "09:00";
  }
  bookingData.time = timeSelect.value;
}

function moveStep(direction) {
  if (direction === 1) {
    if (currentStep === 1 && !bookingData.studio) return alert('Pilih cabang studio.');
    
    if (currentStep === 3) {
      const limit = getBackgroundLimit();
      if (bookingData.background.length === 0) return alert('Pilih minimal satu tema background.');
      if (bookingData.background.length > limit) return alert(`Pilihan background Anda melebihi kuota maksimal (${limit} background).`);
    }
    
    if (currentStep === 4) {
      updateJadwal();
      if (!bookingData.date) return alert('Pilih tanggal.');
      if (!bookingData.time) return alert('Pilih jam mulai.');
    }
    if (currentStep === 5) {
      bookingData.name = document.getElementById('custName').value;
      bookingData.phone = document.getElementById('custPhone').value;
      bookingData.email = document.getElementById('custEmail').value;
      if(!bookingData.name || !bookingData.phone || !bookingData.email) return alert('Mohon lengkapi seluruh data personal.');
    }
  }
  currentStep += direction;
  if(currentStep === 6) buildSummary();
  showStep(currentStep);
}

function renderStepper() {
  const stepper = document.getElementById('stepperDots');
  if (!stepper) return;
  stepper.innerHTML = '';
  for(let i=1; i<=6; i++) {
    stepper.innerHTML += `<span class="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${(i === currentStep) ? 'bg-blue-600 text-white' : ((i < currentStep) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500')}">${i}</span>`;
  }
}

function selectStudio(name, element) {
  bookingData.studio = name;
  bookingData.background = []; 
  document.querySelectorAll('.studio-card').forEach(el => el.className = "studio-card border-2 border-gray-200 rounded-2xl p-3 cursor-pointer hover:border-black transition flex items-center space-x-4 bg-white");
  element.className = "studio-card border-2 border-black rounded-2xl p-3 cursor-pointer transition flex items-center space-x-4 bg-gray-50 shadow-sm";
}

function calculateEndTime() {
  if (!bookingData.time) {
    bookingData.endTime = "";
    return;
  }
  const currentStudio = bookingData.studio || "Studio Karawaci";
  const cat = bookingData.serviceCategory;
  const pkgName = bookingData.package;
  
  if (!cat || !pkgName || !studioDatabase[currentStudio] || !studioDatabase[currentStudio][cat]) {
    bookingData.endTime = bookingData.time;
    return;
  }
  
  const categoryData = studioDatabase[currentStudio][cat];
  let pkg = null;
  
  if (Array.isArray(categoryData.packages)) {
    pkg = categoryData.packages.find(p => p.name === pkgName);
  } else if (Array.isArray(categoryData)) {
    pkg = categoryData.find(p => p.name === pkgName);
  }
  
  const duration = pkg ? (pkg.duration || 0) : 0;
  
  const timeParts = bookingData.time.split(':');
  if (timeParts.length < 2) return;
  
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  
  const dateObj = new Date();
  dateObj.setHours(hours);
  dateObj.setMinutes(minutes + duration);
  
  const finalHours = String(dateObj.getHours()).padStart(2, '0');
  const finalMinutes = String(dateObj.getMinutes()).padStart(2, '0');
  bookingData.endTime = `${finalHours}:${finalMinutes}`;
}

function updateJadwal() {
  const iDate = document.getElementById('inputDate');
  const iTime = document.getElementById('inputTime');
  if (iDate) bookingData.date = iDate.value;
  if (iTime) bookingData.time = iTime.value;
  calculateEndTime();
}

function formatIndonesianDate(dateString) {
  if(!dateString) return "";
  const dateObj = new Date(dateString);
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return `${days[dateObj.getDay()]}, ${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}

// Fungsi pembantu untuk mendapatkan biaya tambahan weekend (Surcharge) khusus Studio Karawaci - Studio Rental
function getWeekendSurcharge(tier) {
  const surcharges = {
    'Wood': 250000,
    'Silver': 300000,
    'Gold': 450000,
    'Platinum': 600000
  };
  return surcharges[tier] || 0;
}

function buildSummary() {
  calculateEndTime();
  const formattedDate = formatIndonesianDate(bookingData.date);
  
  // --- LOGIKA TAMBAHAN BIAYA WEEKEND (SURCHARGE) ---
  let weekendSurcharge = 0;
  let isWeekend = false;
  
  if (bookingData.date) {
    const selectedDate = new Date(bookingData.date);
    const dayOfWeek = selectedDate.getDay(); // 0 = Minggu, 6 = Sabtu
    isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
  }

  // Surcharge hanya berlaku jika: Hari Weekend + Cabang Karawaci + Kategori Studio Rental
  if (isWeekend && bookingData.studio === "Studio Karawaci" && bookingData.serviceCategory === "Studio Rental") {
    weekendSurcharge = getWeekendSurcharge(bookingData.package);
  }
  
  // Total biaya dihitung dari: Harga Paket + Biaya Tambahan Weekend + Harga Addons
  const grandTotal = bookingData.price + weekendSurcharge + bookingData.addonsPrice;
  // -------------------------------------------------

  const bgListHTML = bookingData.background.map(bg => `<li>•  ${bg}</li>`).join('');

  let addonsListHTML = '<li class="text-gray-400 italic">Tidak ada</li>';
  if(bookingData.addons.length > 0) {
    addonsListHTML = bookingData.addons.map(add => `
      <div class="flex justify-between max-w-xs text-xs text-gray-600">
        <span>•  ${add.name}</span>
        <span class="text-gray-400 font-normal">IDR ${add.price.toLocaleString('id-ID')}+</span>
      </div>
    `).join('');
  }

  const detailsContainer = document.getElementById('summaryDetailsContainer');
  if (detailsContainer) {
    detailsContainer.innerHTML = `
      <div>
        <h4 class="font-bold text-xs text-gray-900 border-b pb-2 mb-3 tracking-wide text-blue-900">Detail Studio & Paket Layanan</h4>
        <table class="w-full text-xs text-gray-700 space-y-2">
          <tr class="align-top">
            <td class="w-32 py-1 text-gray-500">Cabang Studio</td>
            <td class="py-1 font-semibold text-gray-900">${bookingData.studio}</td>
          </tr>
          <tr class="align-top">
            <td class="w-32 py-1 text-gray-500">Layanan & Paket</td>
            <td class="py-1 font-semibold text-gray-900">${bookingData.serviceCategory} - Paket ${bookingData.package} (${bookingData.duration} Menit)</td>
          </tr>
        </table>
      </div>
      <div>
        <h4 class="font-bold text-xs text-gray-900 border-b pb-2 mb-3 tracking-wide text-blue-900">Pilihan Backgrounds & Waktu</h4>
        <table class="w-full text-xs text-gray-700">
          <tr class="align-top">
            <td class="w-32 py-1 text-gray-500">Background</td>
            <td class="py-1 font-semibold text-gray-900"><ul class="space-y-0.5">${bgListHTML}</ul></td>
          </tr>
          <tr class="align-top">
            <td class="w-32 py-2 text-gray-500">Tanggal & Waktu</td>
            <td class="py-2 font-semibold text-gray-900">${formattedDate} / ${bookingData.time} - ${bookingData.endTime || ''} WIB</td>
          </tr>
          <tr class="align-top">
            <td class="w-32 py-1 text-gray-500">Add-ons</td>
            <td class="py-1 font-semibold text-gray-900 space-y-1">${addonsListHTML}</td>
          </tr>
        </table>
      </div>
      <div>
        <h4 class="font-bold text-xs text-gray-900 border-b pb-2 mb-3 tracking-wide text-blue-900">Informasi Kontak</h4>
        <table class="w-full text-xs text-gray-700">
          <tr class="align-top">
            <td class="w-32 py-1 text-gray-500">Nama</td>
            <td class="py-1 font-semibold text-gray-900">${bookingData.name}</td>
          </tr>
          <tr class="align-top">
            <td class="w-32 py-1 text-gray-500">No Telepon / WA</td>
            <td class="py-1 font-semibold text-gray-900">${bookingData.phone}</td>
          </tr>
          <tr class="align-top">
            <td class="w-32 py-1 text-gray-500">Gmail</td>
            <td class="py-1 font-semibold text-gray-900">${bookingData.email}</td>
          </tr>
        </table>
      </div>
    `;
  }

  const priceContainer = document.getElementById('summaryPriceContainer');
  if (priceContainer) {
    // Tampilkan baris info biaya tambahan weekend jika kondisi terpenuhi
    let weekendRowHTML = '';
    if (weekendSurcharge > 0) {
      weekendRowHTML = `
        <div class="flex justify-between text-amber-600 font-medium">
          <span>Surcharge (Weekend Fee)</span>
          <span>IDR ${weekendSurcharge.toLocaleString('id-ID')}</span>
        </div>
      `;
    }

    priceContainer.innerHTML = `
      <h4 class="font-bold text-sm text-gray-900 tracking-wide mb-4">Rincian Biaya</h4>
      <div class="space-y-2 text-xs border-b pb-4 border-gray-200">
        <div class="flex justify-between">
          <span class="text-gray-500">Paket ${bookingData.package}</span>
          <span class="font-semibold text-slate-600">IDR ${bookingData.price.toLocaleString('id-ID')}</span>
        </div>
        ${weekendRowHTML}
        <div class="flex justify-between">
          <span class="text-gray-500">Add-ons</span>
          <span class="font-semibold text-slate-600">IDR ${bookingData.addonsPrice.toLocaleString('id-ID')}</span>
        </div>
      </div>
      <div class="flex justify-between items-baseline pt-1">
        <span class="text-xs font-bold text-gray-900">Total Biaya</span>
        <span class="text-base font-black text-blue-900 text-right">IDR <br class="hidden sm:inline"> ${grandTotal.toLocaleString('id-ID')}</span>
      </div>
      <div class="space-y-2.5 pt-4">
        <button onclick="executeFinalBooking()" class="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-xl transition shadow-md tracking-wider">Konfirmasi</button>
        <button onclick="moveStep(-1)" class="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 text-xs font-bold py-3 rounded-xl transition">Kembali</button>
      </div>
    `;
  }
}

async function executeFinalBooking() {
  // 1. Ambil nilai data diri langsung dari form HTML secara real-time
  const inputName = document.querySelector('#step5 input[type="text"]') || document.getElementById('customerName');
  const inputPhone = document.querySelector('#step5 input[type="tel"]') || document.getElementById('customerPhone');
  const inputEmail = document.querySelector('#step5 input[type="email"]') || document.getElementById('customerEmail');

  if (inputName) bookingData.name = inputName.value.trim();
  if (inputPhone) bookingData.whatsapp = inputPhone.value.trim();
  if (inputEmail) bookingData.email = inputEmail.value.trim();

  // 2. PEMETAAN DATA AGAR SESUAI DENGAN VALIDASI LARAVEL
  const payload = {
    branch: bookingData.studio || bookingData.branch,
    category: bookingData.serviceCategory || bookingData.category,
    tier: bookingData.package || bookingData.tier,
    background: Array.isArray(bookingData.background) ? bookingData.background[0] : bookingData.background,
    date: bookingData.date,
    time: bookingData.time,
    name: bookingData.name,
    whatsapp: bookingData.whatsapp || bookingData.phone, 
    email: bookingData.email,
    addons: bookingData.addons || [],
    totalPrice: bookingData.price || bookingData.totalPrice
  };

  console.log("Data Pemetaan (Payload) yang dikirim ke Laravel:", payload);

  // 3. VALIDASI DI SISI FRONTEND MENGGUNAKAN PAYLOAD BARU
  if (!payload.branch || !payload.category || !payload.tier) {
    alert("⚠️ Opsi reservasi belum lengkap! Silakan pastikan Anda sudah memilih Cabang, Kategori, dan Paket.");
    return;
  }

  if (!payload.name || !payload.whatsapp || !payload.email) {
    alert("⚠️ Kontak data diri belum lengkap! Silakan isi Nama, Nomor WhatsApp, dan Email Anda terlebih dahulu pada Step 5.");
    return;
  }

  // 4. Ambil token CSRF Laravel
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // 5. Efek Loading Tombol Konfirmasi
  const confirmBtn = document.querySelector('#step6 button[onclick="executeFinalBooking()"]');
  const originalText = confirmBtn ? confirmBtn.innerText : "Konfirmasi";
  
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.innerText = "Memproses Reservasi...";
    confirmBtn.classList.add('opacity-50', 'cursor-not-allowed');
  }

  try {
    // 6. Kirim data PAYLOAD ke backend Laravel
    const response = await fetch('/booking/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    // =============== [KUNCI PERBAIKAN DI SINI] ===============
    // Cek apakah response dari server gagal (Cth: Bentrok jadwal status 422)
    if (!response.ok) {
      alert("⚠️ GAGAL RESERVASI:\n" + (result.message || "Jadwal pada jam tersebut sudah penuh. Silakan pilih waktu lain."));
      
      // Kembalikan tombol konfirmasi ke keadaan normal agar bisa diklik lagi
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerText = originalText;
        confirmBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
      
      // BERHENTI DI SINI! Blokir agar tidak mengeksekusi kode perpindahan halaman di bawahnya.
      return; 
    }
    // =========================================================

    // Jika response sukses (200 OK) dan database berhasil mencatat
    if (result.success) {
      const step7Div = document.getElementById('step7');
      if (step7Div) {
        step7Div.innerHTML = `
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 class="text-2xl font-bold text-black mb-2">Reservasi Berhasil!</h3>
          <p class="text-sm text-gray-600 mb-2">ID Reservasi Anda: <strong class="text-blue-600 font-mono text-lg">#${result.booking_id}</strong></p>
          <p class="text-xs text-gray-500 max-w-md mx-auto">Jadwal berhasil dicatat di sistem Lomoto Studio. Admin kami akan menghubungi Anda via WhatsApp dalam waktu maksimal 1x24 jam.</p>
          <button onclick="closeBooking()" class="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium mt-6 transition hover:bg-gray-800">Tutup Halaman</button>
        `;
      }
      currentStep = 7;
      showStep(currentStep);
    }

  } catch (error) {
    console.error("Error Booking:", error);
    alert("⚠️ Gagal terhubung ke server. Pastikan koneksi internet Anda stabil.");
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.innerText = originalText;
      confirmBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }
}

function filterBackgrounds(location, btnElement) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.className = "bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-xs font-semibold filter-btn");
  btnElement.className = "bg-black text-white px-4 py-1.5 rounded-full text-xs font-semibold filter-btn";
  document.querySelectorAll('.bg-item').forEach(item => {
    if (location === 'all' || item.getAttribute('data-location') === location) item.classList.remove('hidden');
    else item.classList.add('hidden');
  });
}

