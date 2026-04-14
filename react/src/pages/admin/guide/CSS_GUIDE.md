/* 
  ADMIN CSS STRUCTURE - Quick Reference Guide
  ============================================
  
  Semua file CSS admin sudah dipisahkan ke file terpisah untuk kemudahan modifikasi.
  
  FILE STRUCTURE:
  ├── AdminTableStyles.js        → CSS untuk Products, Services, Users, Bundles
  └── AdminDashboardStyles.js   → CSS untuk Dashboard
  
  CARA MENGGUNAKAN:
  ================
  
  1. EDIT CSS DASHBOARD:
     File: src/pages/admin/AdminDashboardStyles.js
     
     Contoh:
     - Export adminDashboardCss
     - Modifikasi warna, sizing, animasi di file ini
     - Automatic reload di Dashboard.jsx
  
  2. EDIT CSS TABLE (Products, Services, Users, Bundles):
     File: src/pages/admin/AdminTableStyles.js
     
     Contoh:
     - Export adminTableCss
     - Semua halaman CRUD menggunakan export ini
  
  COMMANDS UNTUK QUICK EDIT:
  ==========================
  
  📝 Edit Dashboard CSS:
  $ code src/pages/admin/AdminDashboardStyles.js
  
  📝 Edit Table CSS:
  $ code src/pages/admin/AdminTableStyles.js
  
  🔍 Search CSS Class (Dashboard):
  $ grep -n "\.stat-card\|\.panel\|\.ql-item" src/pages/admin/AdminDashboardStyles.js
  
  🔍 Search CSS Class (Tables):
  $ grep -n "\.adm-page\|\.adm-modal\|\.adm-btn" src/pages/admin/AdminTableStyles.js
  
  🌐 Watch for Changes & Hot Reload:
  $ npm run dev
  
  BUILD & DEPLOY:
  ===============
  
  $ npm run build        # Build production
  $ npm run preview      # Preview build
  
  CSS VARIABLES YANG TERSEDIA:
  =============================
  
  Colors:
  --gold: #C9A84C                    → Warna utama (gold)
  --gold-light: #E8C97A             → Variant lebih terang
  --gold-dim: rgba(201,168,76,0.12) → Transparent background
  --gold-line: rgba(201,168,76,0.22)→ Border color
  
  Surfaces (Dark Background):
  --s1: #141312 (darkest)
  --s2: #1B1A18 (default)
  --s3: #232220 (hover)
  --s4: #2D2B28 (active)
  --s5: #383532 (lightest)
  
  Text:
  --t1: #F0EDE6 (primary)
  --t2: #9A9690 (secondary)
  --t3: #56534E (tertiary)
  
  Status Colors:
  --success: #4CAF7D  → Hijau
  --danger: #E05252   → Merah
  --info: #5B9BDC    → Biru
  --warning: #E0C060 → Kuning
  --purple: #A07BC8  → Ungu
  
  CONTOH QUICK EDITS:
  ====================
  
  1. Ubah Ukuran Font Judul:
     Cari: .adm-title { font-size: 26px; ... }
     Ubah ke: font-size: 24px;
  
  2. Ubah Warna Gold:
     Cari: --gold: #C9A84C;
     Ubah ke: --gold: #D4AF37; (atau warna lain)
  
  3. Ubah Space/Gap di Stats:
     Cari: .stats-grid { ... gap: 12px; ... }
     Ubah ke: gap: 16px;
  
  4. Ubah Border Radius:
     Cari: border-radius: 12px;
     Ubah ke: border-radius: 8px; (atau nilai lain)
  
  5. Ubah Animation Speed:
     Cari: @keyframes fadeUp { ... 0.4s ... }
     Ubah di: 0.4s menjadi 0.3s atau 0.5s
  
  TIPS DEBUGGING:
  ================
  
  ✓ Gunakan DevTools (F12) untuk inspect element
  ✓ Check Console untuk CSS warnings
  ✓ Gunakan 'Ctrl+Shift+C' untuk inspect specific element
  ✓ DevTools akan show class names dan applied styles
  
  FILE IMPORTS DI COMPONENT:
  ===========================
  
  Dashboard.jsx:
  import { adminDashboardCss } from './AdminDashboardStyles';
  <style>{adminDashboardCss}</style>
  
  Products.jsx, Services.jsx, Users.jsx, Bundles.jsx:
  import { adminTableCss } from './AdminTableStyles';
  <style>{adminTableCss}</style>
  
  FOLDER STRUCTURE:
  ===================
  
  src/pages/admin/
  ├── Dashboard.jsx                 → Main dashboard component
  ├── Products.jsx                  → Product management
  ├── Services.jsx                  → Service management
  ├── Users.jsx                     → User management
  ├── Bundles.jsx                   → Bundle management
  ├── AdminTableStyles.js           → Shared table CSS
  ├── AdminDashboardStyles.js       → Dashboard CSS
  └── CSS_GUIDE.md                  → File ini / dokumentasi
  
  NEED HELP?
  ===========
  
  1. Cari class yang ingin diubah di AdminDashboardStyles.js atau AdminTableStyles.js
  2. Modifikasi CSS sesuai kebutuhan
  3. Save file → browser akan auto-reload
  4. Jika ada error, check console (F12)
  
  Happy coding! 🚀
*/

export const CSS_GUIDE = `
  Use this file (CSS_GUIDE.md) as reference for all CSS modifications.
  See inline comments above for detailed instructions.
`;
