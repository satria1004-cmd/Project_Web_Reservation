<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" class="w-full" content="width=device-width, initial-scale=1.0">
  <title>Lomoto Studio</title>
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <!-- <script src="script.js"></script> -->
  <script src="{{ asset('js/script.js') }}"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    // Membuat variabel global yang berisi path folder images dari Laravel
    window.imagePath = "{{ asset('images') }}/";
</script>
  <!-- <link rel="stylesheet" href="style.css"> -->
  <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body class="bg-gray-50 text-gray-900 min-h-screen flex flex-col font-sans">

  <nav class="w-full bg-white text-gray-900 border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <div class="flex items-center">
        <img src="{{ asset('images/logo_LOMOTO-removebg-preview.png') }}" alt="Lomoto Studio Logo" class="h-12 w-auto object-contain">
      </div>
      
      <div class="hidden md:flex items-center space-x-8 font-medium text-sm text-gray-600">
        <a href="#home" class="hover:text-black transition">Home</a>
        <a href="#price" class="hover:text-black transition">Price</a>
        <a href="#backgrounds" class="hover:text-black transition">Backgrounds</a>
        <a href="#locations" class="hover:text-black transition">Locations</a>
      </div>

      <button onclick="openBooking()" class="bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition">
        Book Now
      </button>
    </div>
  </nav>

  <main class="flex-grow">
    
    <section id="home" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
      <div class="relative rounded-3xl overflow-hidden bg-gray-900 text-white min-h-[500px] flex items-center p-8 md:p-16">
        <img src="{{ asset('images/buat halaman home .jpg') }}" alt="Lomoto Studio Hero Background" class="absolute inset-0 w-full h-full object-cover z-0">
        <div class="absolute inset-0 bg-black/50 z-10"></div>
        
        <div class="relative z-20 max-w-2xl">
          <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Capturing the Art <br> of Your Existence
          </h1>
          <p class="text-lg text-gray-200 mb-8 max-w-lg">
            Setiap sudut, setiap cahaya, dan setiap detik dirancang untuk mengabadikan sisi terbaik Anda.
          </p>
          <div class="flex flex-wrap gap-4">
            <button onclick="openBooking()" class="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition flex items-center gap-2">
              Start Now <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section id="price" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center">
      <div class="mb-6 text-center">
        <h2 class="text-3xl font-bold text-black mb-2">Our Pricing & Packages</h2>
        <p class="text-gray-500">Pilih kategori layanan di bawah ini untuk melihat rincian paket spesifik.</p>
      </div>

      <div class="flex justify-center mb-4">
        <div class="flex flex-wrap items-center justify-center gap-1 bg-white px-4 py-2 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100">
          <button onclick="switchCategoryTab('Personal')" id="tab-Personal" class="category-tab px-5 py-2 rounded-full font-medium text-sm transition bg-[#1A1A1A] text-white">Personal</button>
          <button onclick="switchCategoryTab('Couple')" id="tab-Couple" class="category-tab px-5 py-2 rounded-full font-medium text-sm transition text-gray-600 hover:text-black">Couple</button>
          <button onclick="switchCategoryTab('Group')" id="tab-Group" class="category-tab px-5 py-2 rounded-full font-medium text-sm transition text-gray-600 hover:text-black">Group</button>
          <button onclick="switchCategoryTab('Yearbook')" id="tab-Yearbook" class="category-tab px-5 py-2 rounded-full font-medium text-sm transition text-gray-600 hover:text-black">Yearbook</button>
          <button onclick="switchCategoryTab('Product')" id="tab-Product" class="category-tab px-5 py-2 rounded-full font-medium text-sm transition text-gray-600 hover:text-black">Product</button>
          <button onclick="switchCategoryTab('Studio Rental')" id="tab-Studio Rental" class="category-tab px-5 py-2 rounded-full font-medium text-sm transition text-gray-600 hover:text-black">Studio Rental</button>
        </div>
      </div>

      <div id="categorySubtext" class="text-center italic text-xs text-gray-500 mb-10 h-4"></div>
      
      <div class="flex flex-wrap justify-center gap-6 max-w-7xl w-full" id="packageCardsGrid"></div>
    </section>

    <section id="backgrounds" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 class="text-3xl font-bold text-black mb-2">Discover Our Background Sets</h2>
          <p class="text-gray-500">Beragam latar belakang profesional yang dikurasi untuk melengkapi setiap nuansa.</p>
        </div>
        <div class="flex gap-2">
          <button onclick="filterBackgrounds('all', this)" class="bg-black text-white px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer filter-btn">All</button>
          <button onclick="filterBackgrounds('karawaci', this)" class="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer hover:bg-gray-300 filter-btn">Karawaci</button>
          <button onclick="filterBackgrounds('cideng', this)" class="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer hover:bg-gray-300 filter-btn">Cideng</button>
        </div>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8" id="backgroundGrid"></div>
    </section>

    <section id="locations" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-10">
      <h2 class="text-3xl font-bold text-black mb-8 text-center">Our Studio Locations</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between group">
          <div>
            <h3 class="font-bold text-xl mb-1 group-hover:text-blue-600 transition">Studio Karawaci</h3>
            <p class="text-xs text-gray-400 mb-4">09:00 - 18:00 WIB</p>
            <div class="w-full h-48 rounded-xl mb-4 overflow-hidden relative bg-gray-100">
              <img src="{{ asset('images/Buat di bagian location (KARAWACI).webp') }}" alt="Peta Lokasi Karawaci" class="w-full h-full object-cover">
            </div>
          </div>
          <a href="https://maps.app.goo.gl/BeH1sgTiHMGAd5vT9" target="_blank" class="w-full bg-gray-100 hover:bg-gray-200 text-black text-sm font-semibold py-2.5 rounded-xl transition text-center block">Directions ↗</a>
        </div>

        <div class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between group">
          <div>
            <h3 class="font-bold text-xl mb-1 group-hover:text-blue-600 transition">Studio Cideng</h3>
            <p class="text-xs text-gray-400 mb-4">10:00 - 20:00 WIB</p>
            <div class="w-full h-48 rounded-xl mb-4 overflow-hidden relative bg-gray-100">
              <img src="{{ asset('images/Buat di bagian location (CIDENG).webp') }}" alt="Peta Lokasi Cideng" class="w-full h-full object-cover">
            </div>
          </div>
          <a href="https://maps.app.goo.gl/xaqFgh3451S8f9ui8" target="_blank" class="w-full bg-gray-100 hover:bg-gray-200 text-black text-sm font-semibold py-2.5 rounded-xl transition text-center block">Directions ↗</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="bg-[#1A1A1A] text-gray-400 text-xs pt-16 pb-8 border-t border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 items-start">
        <div class="text-center md:text-left flex flex-col items-center md:items-start">
          <img src="{{ asset('images/logo_LOMOTO-removebg-preview.png') }}" alt="Lomoto Studio Logo" class="h-10 w-auto object-contain mb-4">
        </div>
        <div class="flex flex-col items-center md:items-start space-y-2">
          <h4 class="font-bold text-white text-sm tracking-wide mb-2">Quick Links</h4>
          <a href="#home" class="hover:text-white transition">Home</a>
          <a href="#price" class="hover:text-white transition">Price List</a>
          <a href="#backgrounds" class="hover:text-white transition">Backgrounds</a>
          <a href="#locations" class="hover:text-white transition">Locations</a>
        </div>
        <div class="flex flex-col items-center md:items-start">
          <h4 class="font-bold text-white text-sm tracking-wide mb-4">Contact Us</h4>
          <div class="flex items-center space-x-4">
            <a href="https://wa.me/#" target="_blank" class="hover:text-white transition">
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.455L0 24zm6.59-4.846c1.66.986 3.288 1.481 4.881 1.482 5.4 0 9.791-4.385 9.794-9.778.002-2.613-1.01-5.07-2.852-6.914C16.577 2.099 14.12 1.084 11.507 1.084c-5.405 0-9.798 4.388-9.801 9.782-.001 1.689.51 3.332 1.478 4.793l-.974 3.559 3.637-.954z"/>
              </svg>
            </a>
          </div>
        </div>
        <div class="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
          <h4 class="font-bold text-white text-sm tracking-wide mb-2">Operating Hour</h4>
          <p class="font-semibold text-gray-300">Studio Karawaci</p>
          <p class="text-[11px] text-gray-500 pb-2">09:00 – 18:00 WIB</p>
          <p class="font-semibold text-gray-300">Studio Cideng</p>
          <p class="text-[11px] text-gray-500">10:00 – 20:00 WIB</p>
        </div>
      </div>
      <div class="border-t border-gray-800/60 pt-8 text-center text-[11px] text-gray-500 tracking-wider">
        Copyright © 2026 ™ All Rights Reserved.
      </div>
    </div>
  </footer>

  <div id="bookingModal" class="fixed inset-0 z-50 overflow-y-auto bg-black/60 hidden items-center justify-center p-4">
   <div class="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div class="flex items-center space-x-2" id="stepperDots"></div>
        <button onclick="closeBooking()" class="text-gray-400 hover:text-black text-sm font-medium" id="cancelBtn">Cancel</button>
      </div>

      <div class="p-6 overflow-y-auto flex-grow sub-container-scroll" id="stepContent">
        
        <div id="step1" class="booking-step">
          <h3 class="text-xl font-bold mb-1 text-center">Cabang Studio</h3>
          <p class="text-sm text-gray-400 mb-6 text-center">Silakan pilih lokasi studio yang tersedia.</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div id="studioKarawaciCard" onclick="selectStudio('Studio Karawaci', this)" class="studio-card border-2 border-gray-200 rounded-2xl p-3 cursor-pointer hover:border-black transition flex items-center space-x-4 bg-white">
              <div class="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                <img src="{{ asset('images/Buat di bagian location (KARAWACI).webp') }}" alt="Karawaci" class="w-full h-full object-cover">
              </div>
              <div>
                <p class="font-bold text-base text-gray-900">Studio Karawaci</p>
                <p class="text-xs text-gray-400">Tangerang</p>
              </div>
            </div>
            <div onclick="selectStudio('Studio Cideng', this)" class="studio-card border-2 border-gray-200 rounded-2xl p-3 cursor-pointer hover:border-black transition flex items-center space-x-4 bg-white">
              <div class="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                <img src="{{ asset('images/Buat di bagian location (CIDENG).webp') }}" alt="Cideng" class="w-full h-full object-cover">
              </div>
              <div>
                <p class="font-bold text-base text-gray-900">Studio Cideng</p>
                <p class="text-xs text-gray-400">Jakarta Pusat</p>
              </div>
            </div>
          </div>
        </div>

        <div id="step2" class="booking-step hidden flex flex-col items-center">
          <h3 class="text-xl font-bold mb-4 text-center">Layanan & Paket</h3>
          <div class="space-y-5 w-full max-w-md">
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-700">Kategori Layanan</label>
              <select id="serviceCategorySelect" onchange="handleModalServiceChange(this.value)" class="w-full bg-white border-2 border-gray-200 p-3.5 rounded-xl text-sm focus:outline-none">
                <option value="Personal">Personal / Maternity Portrait</option>
                <option value="Couple">Prewedding / Couple</option>
                <option value="Group">Family / Graduation / Friendship</option>
                <option value="Yearbook">Yearbook / Corporate Group</option>
                <option value="Product">Product Photography</option>
                <option value="Studio Rental">Studio Rental</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-gray-700">Spesifikasi Paket</label>
              <select id="packageTierSelect" onchange="handleModalPackageChange(this)" class="w-full bg-white border-2 border-gray-200 p-3.5 rounded-xl text-sm focus:outline-none"></select>
            </div>
          </div>
        </div>

        <div id="step3" class="booking-step hidden">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 tracking-tight">Pilihan Background <span class="text-gray-500 font-normal" id="bgCounterText">(0 / 3)</span></h3>
            <p class="text-xs text-gray-400 mt-1">Geser ke samping untuk melihat koleksi set studio kami yang estetik dan pilih favorit Anda.</p>
          </div>
          <div id="modalBgDynamicLayout" class="space-y-8 relative pb-16 max-w-3xl mx-auto"></div>
        </div>

        <div id="step4" class="booking-step hidden">
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 mb-1">Jadwal & Add-ons</h3>
            <p class="text-xs text-gray-400 max-w-md mx-auto">Pilih waktu yang tersedia dan lengkapi momen Anda dengan jasa MUA atau Videografer profesional</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-4 max-w-2xl mx-auto">
            <div class="md:col-span-6 space-y-5">
              <div>
                <label class="block text-xs font-bold text-gray-800 mb-1.5">Pilih Tanggal*</label>
                <div class="flex rounded-lg overflow-hidden bg-gray-50 border border-gray-200 items-center">
                  <div class="bg-slate-900 p-3 flex items-center justify-center text-white">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <input type="date" id="inputDate" onchange="updateJadwal()" class="w-full bg-transparent px-3 py-2 text-xs font-semibold text-gray-700 outline-none">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-800 mb-1.5">Pilih Jam Mulai*</label>
                <div class="flex rounded-lg overflow-hidden bg-gray-50 border border-gray-200 items-center">
                  <div class="bg-slate-900 p-3 flex items-center justify-center text-white">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <select id="inputTime" onchange="updateJadwal()" class="w-full bg-transparent px-3 py-2 text-xs font-semibold text-gray-700 outline-none appearance-none cursor-pointer">
                    <option value="09:00">09:00 WIB</option>
                    <option value="09:30">09:30 WIB</option>
                    <option value="10:00">10:00 WIB</option>
                    <option value="10:30">10:30 WIB</option>
                    <option value="11:00">11:00 WIB</option>
                    <option value="11:30">11:30 WIB</option>
                    <option value="12:00">12:00 WIB</option>
                    <option value="12:30">12:30 WIB</option>
                    <option value="13:00">13:00 WIB</option>
                    <option value="13:30">13:30 WIB</option>
                    <option value="14:00">14:00 WIB</option>
                    <option value="14:30">14:30 WIB</option>
                    <option value="15:00">15:00 WIB</option>
                    <option value="15:30">15:30 WIB</option>
                    <option value="16:00">16:00 WIB</option>
                    <option value="16:30">16:30 WIB</option>
                    <option value="17:00">17:00 WIB</option>
                    <option value="17:30">17:30 WIB</option>
                    <option value="18:00">18:00 WIB</option>
                   
                  </select>
                </div>
              </div>
            </div>

            <div class="hidden md:flex justify-center items-center md:col-span-1 h-36 border-r border-gray-200"></div>

            <div class="md:col-span-5 space-y-3.5">
              <h4 class="text-xs font-bold text-gray-800 mb-1">Add-ons (Opsional)</h4>
              <label class="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" value="MUA" data-price="250000" onchange="updateAddons()" class="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 bg-gray-100">
                <span class="text-xs font-medium text-gray-400 group-hover:text-gray-700 transition">MUA (+IDR 250K)</span>
              </label>
              <label class="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" value="Videografer" data-price="450000" onchange="updateAddons()" class="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 bg-gray-100">
                <span class="text-xs font-medium text-gray-400 group-hover:text-gray-700 transition">Videografer (+IDR 450K)</span>
              </label>
              <label class="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" value="Busana" data-price="350000" onchange="updateAddons()" class="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 bg-gray-100">
                <span class="text-xs font-medium text-gray-400 group-hover:text-gray-700 transition">Busana (+IDR 350K)</span>
              </label>
            </div>
          </div>
        </div>

        <div id="step5" class="booking-step hidden max-w-2xl mx-auto">
          <h3 class="text-xl font-bold mb-1 text-center">Personal Data</h3>
          <p class="text-sm text-gray-400 mb-6 text-center">Detail kontak Anda agar kami dapat mengirimkan konfirmasi reservasi dengan segera.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-semibold text-[#1A2E5A] mb-2">Nama Lengkap *</label>
              <input type="text" id="custName" placeholder="Masukkan nama" class="w-full border border-gray-400 px-4 py-3 rounded-xl text-sm focus:border-blue-600 focus:outline-none transition bg-white font-medium shadow-sm">
            </div>
            <div>
              <label class="block text-sm font-semibold text-[#1A2E5A] mb-2">No. Telepon / Whatsapp *</label>
              <input type="tel" id="custPhone" placeholder="Contoh: 0812345678" class="w-full border border-gray-400 px-4 py-3 rounded-xl text-sm focus:border-blue-600 focus:outline-none transition bg-white font-medium shadow-sm">
            </div>
          </div>
          <div class="w-full">
            <label class="block text-sm font-semibold text-[#1A2E5A] mb-2">Email *</label>
            <input type="email" id="custEmail" placeholder="contoh@email.com" class="w-full border border-gray-400 px-4 py-3 rounded-xl text-sm focus:border-blue-600 focus:outline-none transition bg-white font-medium shadow-sm">
          </div>
        </div>

        <div id="step6" class="booking-step hidden">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-1">Ringkasan Data</h3>
            <p class="text-xs text-gray-400">Silakan periksa kembali detail pesanan Anda sebelum menyelesaikan Reservasi</p>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-4xl mx-auto">
            <div class="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6" id="summaryDetailsContainer"></div>
            <div class="lg:col-span-4 bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm space-y-6" id="summaryPriceContainer"></div>
          </div>
        </div>

        <div id="step7" class="booking-step hidden text-center py-10">
          <h3 class="text-2xl font-bold text-black mb-2">Reservasi Berhasil!</h3>
          <p class="text-sm text-gray-500">Jadwal berhasil dicatat. Admin kami akan menghubungi Anda via WhatsApp dalam waktu maksimal 1x24 jam</p>
          <button onclick="closeBooking()" class="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium mt-4">Tutup</button>
        </div>
      </div>

      <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between" id="actionFooter">
        <button id="prevBtn" onclick="moveStep(-1)" class="px-5 py-2 border rounded-xl text-sm font-medium text-gray-600 hover:text-black">Kembali</button>
        <button id="nextBtn" onclick="moveStep(1)" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition">Selanjutnya</button>
      </div>
    </div>
  </div>

  
</body>
</html>