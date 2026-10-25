<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- <script type="module" src="http://localhost:5173/@@vite/client"></script> -->
    <script type="module" src="http://localhost:5173/resources/js/app.js"></script>
    <link rel="stylesheet" href="http://localhost:5173/resources/css/app.css">
    <title> Admin - Lomoto Studio</title>
</head>
  <body class="bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
    <!-- Login Screen -->
    <div id="login-screen" class="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
      <div class="w-full max-w-md bg-white rounded-3xl p-10 shadow-xl border border-[#E2E8F0]">
        <div class="text-center mb-8">
          <div class="flex items-center justify-center mb-5">
           <img src="{{ asset('logo_lomoto.PNG') }}" alt="Lomoto Studio" class="h-20 w-auto object-contain">
          </div>
          <h2 class="text-2xl font-bold text-slate-900">Admin Portal</h2>
          <p class="text-slate-500 text-sm mt-1">Lomoto Studio Dashboard</p>
        </div>

        <form id="login-form" class="space-y-5">
          <div id="login-error" class="hidden p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl text-center">
            Email atau Password salah!
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-1">Email Address</label>
            <input type="email" id="login-email" value="admin@lomoto.com" class="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium text-slate-900 bg-[#F8FAFC]/50" placeholder="admin@lomoto.com">
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-1">Password</label>
            <div class="relative">
              <input type="password" id="login-password" value="admin123" class="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium text-slate-900 bg-[#F8FAFC]/50" placeholder="••••••••">
              <button type="button" id="toggle-password" class="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                <svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          <button type="submit" class="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all transform active:scale-95">Sign In</button>
        </form>
      </div>
    </div>

    <!-- Dashboard Layout (Hidden by default) -->
    <div id="main-dashboard" class="hidden">
      <!-- Mobile Header -->
      <div class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-[60] flex items-center justify-between px-6">
        <div class="flex items-center gap-2">
          <img src="logo_lomoto.PNG" alt="Lomoto Studio" class="h-9 w-auto object-contain">
        </div>
        <button id="mobile-menu-toggle" class="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      <!-- Sidebar Overlay (Mobile) -->
      <div id="sidebar-overlay" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] hidden opacity-0 transition-opacity duration-300 lg:hidden"></div>

      <div id="app" class="flex min-h-screen">
        <!-- Sidebar -->
        <aside id="sidebar" class="fixed left-0 top-0 h-screen w-72 md:w-20 lg:w-64 border-r border-[#E2E8F0] bg-white flex flex-col p-4 lg:p-6 z-[80] transition-all duration-300 -translate-x-full md:translate-x-0 shadow-2xl md:shadow-none">
          <div class="flex items-center justify-between px-2 mb-8 lg:mb-10">
            <div class="flex flex-1 justify-center items-center">
              <img src="logo_lomoto.PNG" alt="Lomoto Studio" class="h-12 w-auto object-contain md:h-8 lg:h-12">
            </div>
            <button id="close-sidebar" class="md:hidden p-2 text-slate-400 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <nav id="sidebar-nav" class="flex-1 space-y-2">
            <button data-tab="dashboard" class="tab-btn active-tab w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all duration-200 bg-blue-600 text-white shadow-lg shadow-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
              <span class="font-semibold text-sm md:hidden lg:block">Dashboard</span>
            </button>
            <button data-tab="booking-management" class="tab-btn w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all duration-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span class="font-semibold text-sm md:hidden lg:block">Booking Management</span>
            </button>
            <button data-tab="client-data" class="tab-btn w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all duration-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span class="font-semibold text-sm md:hidden lg:block">Client Data</span>
            </button>
            <div class="relative w-full">
              <button data-tab="schedule-calendar" id="schedule-calendar-trigger" class="tab-btn w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 select-none">
                <div class="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span class="font-semibold text-sm md:hidden lg:block">Schedule Calendar</span>
                </div>
                <svg id="chevron-icon" class="w-4 h-4 transition-transform duration-200 md:hidden lg:block transform rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              
              <div id="schedule-calendar-sub" class="hidden pl-6 pr-2 py-1 space-y-1 mt-1 transition-all duration-200">
                <button id="submenu-karawaci" class="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all text-left">
                  <div class="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></div>
                  <span class="md:hidden lg:block">Cabang Karawaci</span>
                </button>
                <button id="submenu-cideng" class="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all text-left">
                  <div class="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></div>
                  <span class="md:hidden lg:block">Cabang Cideng</span>
                </button>
              </div>
            </div>
            <button data-tab="studio-settings" class="tab-btn w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all duration-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              <span class="font-semibold text-sm md:hidden lg:block">Studio Settings</span>
            </button>
          </nav>

          <div class="mt-auto pt-4 border-t border-slate-100">
            <button id="logout-btn" class="w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all group">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:stroke-red-500"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span class="font-semibold text-sm md:hidden lg:block">Logout</span>
            </button>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="md:pl-20 lg:pl-64 flex-1 min-h-screen pb-32 pt-16 md:pt-0">
          <div class="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
            <!-- Header Topbar -->
            <header class="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 lg:mb-10 p-4 bg-white rounded-2xl border border-[#E2E8F0]">
              <div class="flex items-center gap-4">
                <div class="lg:hidden w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white" id="sidebar-trigger">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                </div>
                <h1 id="page-title" class="text-xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="relative flex items-center gap-2 pr-4 border-r border-[#E2E8F0]">
                   <button id="notification-bell" class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative" aria-label="Notifikasi">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                     <span id="notification-badge" class="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                   </button>
                   <!-- Floating Notification Dropdown Container -->
                   <div id="notification-dropdown" class="hidden absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 text-left">
                     <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                       <span class="text-xs font-black uppercase text-slate-800 tracking-wider">Notifikasi Sistem</span>
                       <button id="clear-notifications" class="text-[10px] text-blue-600 font-bold hover:underline">Tandai Dibaca</button>
                     </div>
                     <div id="notification-list" class="space-y-3 max-h-72 overflow-y-auto">
                       <!-- Items dynamically generated -->
                     </div>
                   </div>
                </div>
                <div class="flex items-center gap-3 pl-2">
                  <div class="text-right hidden sm:block">
                    <p class="text-xs font-bold text-slate-900">Administrator</p>
                    <p class="text-[10px] text-slate-400 font-medium whitespace-nowrap">Lomoto Studio Admin</p>
                  </div>
                  <img src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff" alt="Admin" class="w-10 h-10 rounded-xl border-2 border-white shadow-sm">
                </div>
              </div>
            </header>
            
            <div id="content-area">
              <!-- Content will be injected here by app.js -->
            </div>
          </div>
        </main>

        <footer class="fixed bottom-0 md:left-20 lg:left-64 left-0 right-0 p-4 sm:p-6 bg-white/80 backdrop-blur-md border-t border-[#E2E8F0] z-40 pb-24 md:pb-6">
          <div class="max-w-[1600px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <p>© 2024 Lomoto Studio • Admin Management System</p>
            <div class="flex gap-4">
              <a href="#" class="hover:text-blue-600 transition-colors">Bantuan</a>
              <a href="#" class="hover:text-blue-600 transition-colors">Kebijakan</a>
            </div>
          </div>
        </footer>

        <!-- Mobile Bottom Navigation (Visible on mobile only) -->
        <div class="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-200 z-[90] flex items-center justify-around px-2 pb-2 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
          <button data-tab="dashboard" class="tab-btn flex flex-col items-center gap-1.5 p-2 transition-all active-tab text-blue-600">
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
             <span class="text-[9px] font-bold uppercase tracking-tight">Overview</span>
          </button>
          <button data-tab="booking-management" class="tab-btn flex flex-col items-center gap-1.5 p-2 transition-all text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
             <span class="text-[9px] font-bold uppercase tracking-tight">Booking</span>
          </button>
          <button data-tab="client-data" class="tab-btn flex flex-col items-center gap-1.5 p-2 transition-all text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
             <span class="text-[9px] font-bold uppercase tracking-tight">Clients</span>
          </button>
          <button data-tab="schedule-calendar" class="tab-btn flex flex-col items-center gap-1.5 p-2 transition-all text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
             <span class="text-[9px] font-bold uppercase tracking-tight">Calendar</span>
          </button>
          <button id="mobile-menu-open-sidebar" class="flex flex-col items-center gap-1.5 p-2 transition-all text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
             <span class="text-[9px] font-bold uppercase tracking-tight">Menu</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div id="edit-modal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300 p-4">
      <div class="bg-white rounded-[2rem] w-full max-w-5xl shadow-2xl transform scale-95 transition-transform duration-300 max-h-[95vh] overflow-hidden flex flex-col">
        <div class="flex justify-between items-center p-6 border-b border-slate-50">
          <div>
            <h3 class="text-xl font-bold text-slate-900">Edit Reservasi</h3>
            <p class="text-xs text-slate-400 font-medium mt-1">Kelola data reservasi klien dan atur jadwal ulang.</p>
          </div>
          <button onclick="window.closeEditModal()" class="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div id="edit-content" class="flex-1 overflow-y-auto p-8">
           <!-- Form injected by JS -->
        </div>

        <div class="p-6 border-t border-slate-50 bg-[#F8FAFC]/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button onclick="window.handleCancelBooking()" class="px-6 py-3 bg-white border border-red-100 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center gap-2 text-sm">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                Cancel Booking
            </button>
            <div class="flex gap-3">
                <button onclick="window.closeEditModal()" class="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">Close</button>
                <button id="save-changes-btn" onclick="window.saveBookingChanges(event)" class="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 text-sm">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    Save Changes
                </button>
            </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal (Read Only) -->
    <div id="detail-modal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300 p-4">
      <div class="bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl transform scale-95 transition-transform duration-300 max-h-[90vh] overflow-hidden flex flex-col">
        <div class="flex justify-between items-center p-6 border-b border-slate-50">
          <div>
            <h3 class="text-xl font-bold text-slate-900">Detail Reservasi</h3>
            <p class="text-xs text-slate-400 font-medium mt-1">Review informasi lengkap pesanan klien.</p>
          </div>
          <button onclick="window.closeDetailModal()" class="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div id="detail-content" class="flex-1 overflow-y-auto p-8">
           <!-- Content injected by JS -->
        </div>

        <div class="p-6 border-t border-slate-50 bg-[#F8FAFC]/50 flex justify-end">
            <button onclick="window.closeDetailModal()" class="px-10 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">Tutup Preview</button>
        </div>
      </div>
    </div>

    <!-- Add Booking Modal -->
    <div id="add-modal" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300 p-4">
      <div class="bg-white rounded-[2rem] w-full max-w-4xl shadow-2xl transform scale-95 transition-transform duration-300 max-h-[95vh] overflow-hidden flex flex-col">
        <div class="flex justify-between items-center p-6 border-b border-slate-50">
          <div>
            <h3 class="text-xl font-bold text-slate-900">Reservasi Baru</h3>
            <p class="text-xs text-slate-400 font-medium mt-1">Lengkapi data untuk membuat reservasi studio baru.</p>
          </div>
          <button onclick="window.closeAddModal()" class="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Step Indicator -->
        <div class="px-8 pt-8">
            <div class="flex items-center justify-between max-w-xl mx-auto relative">
                <div class="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
                <!-- Line Active -->
                <div id="step-line" class="absolute top-1/2 left-0 w-0 h-0.5 bg-blue-600 -z-10 -translate-y-1/2 transition-all duration-300"></div>
                
                <div class="flex flex-col items-center gap-2">
                    <div id="step-dot-1" class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold transition-all duration-300">1</div>
                    <span class="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Reservasi</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                    <div id="step-dot-2" class="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold transition-all duration-300">2</div>
                    <span class="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Jadwal</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                    <div id="step-dot-3" class="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold transition-all duration-300">3</div>
                    <span class="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Background</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                    <div id="step-dot-4" class="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold transition-all duration-300">4</div>
                    <span class="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Add-ons</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                    <div id="step-dot-5" class="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold transition-all duration-300">5</div>
                    <span class="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Klien</span>
                </div>
            </div>
        </div>

        <div id="add-modal-content" class="flex-1 overflow-y-auto p-8">
           <!-- Steps injected by JS -->
        </div>

        <div id="add-modal-footer" class="p-6 border-t border-slate-50 bg-[#F8FAFC]/55 flex justify-between items-center">
            <button id="add-back-btn" onclick="window.prevAddStep()" class="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm hidden">Kembali</button>
            <div class="flex-1"></div>
            <button id="add-next-btn" onclick="window.nextAddStep()" class="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 text-sm">Lanjut</button>
        </div>
      </div>
    </div>

    <!-- Client History Modal -->
    <div id="history-modal" class="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300 p-4">
      <div class="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl transform scale-95 transition-transform duration-300 max-h-[80vh] overflow-hidden flex flex-col">
        <div class="flex justify-between items-center p-6 border-b border-slate-50">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Riwayat Booking</h3>
            <p id="history-client-name" class="text-xs text-blue-600 font-black uppercase tracking-widest mt-1"></p>
          </div>
          <button onclick="window.closeHistoryModal()" class="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div id="history-content" class="flex-1 overflow-y-auto p-6 space-y-3">
          <!-- History list injected by JS -->
        </div>
        <div class="p-4 border-t border-slate-50 bg-slate-50 text-center">
            <button onclick="window.closeHistoryModal()" class="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">Tutup</button>
          </div>
      </div>
    </div>

    <!-- External Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- <script type="module" src="/resources/js/app.js"></script> -->
  </body>
</html>