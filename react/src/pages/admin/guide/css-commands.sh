#!/bin/bash
# 
# CSS QUICK COMMANDS - Admin Pages
# Simpan file ini dan jalankan: bash css-commands.sh
# Atau copy-paste commands langsung ke terminal
#

echo "
======================================
 ADMIN CSS QUICK COMMANDS
======================================
"

# ====== EDIT COMMANDS ======
echo "
📝 EDIT COMMANDS:
================

# Edit Dashboard CSS
code src/pages/admin/AdminDashboardStyles.js

# Edit Table CSS (Products, Services, Users, Bundles)
code src/pages/admin/AdminTableStyles.js

# Edit Dashboard Component
code src/pages/admin/Dashboard.jsx

# Edit Products Component
code src/pages/admin/Products.jsx

# Edit Services Component
code src/pages/admin/Services.jsx

# Edit Users Component
code src/pages/admin/Users.jsx

# Edit Bundles Component
code src/pages/admin/Bundles.jsx
"

# ====== SEARCH COMMANDS ======
echo "
🔍 SEARCH & FIND COMMANDS:
==========================

# Find all stat-card references
grep -n 'stat-card' src/pages/admin/AdminDashboardStyles.js

# Find all panel references
grep -n '\.panel' src/pages/admin/AdminDashboardStyles.js

# Find all button styles in table
grep -n '\.adm-btn' src/pages/admin/AdminTableStyles.js

# Find all color definitions (Dashboard)
grep -n '\-\-' src/pages/admin/AdminDashboardStyles.js

# Find all color definitions (Table)
grep -n '\-\-' src/pages/admin/AdminTableStyles.js

# Find all animations
grep -n '@keyframes' src/pages/admin/AdminDashboardStyles.js

# Find all media queries (responsive)
grep -n '@media' src/pages/admin/AdminTableStyles.js

# Find all hover states
grep -n ':hover' src/pages/admin/AdminDashboardStyles.js

# Count total CSS lines
wc -l src/pages/admin/AdminDashboardStyles.js
wc -l src/pages/admin/AdminTableStyles.js
"

# ====== DEVELOPMENT COMMANDS ======
echo "
🚀 DEVELOPMENT COMMANDS:
=========================

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Watch CSS files for changes
watch 'ls -la src/pages/admin/*.js'

# List all CSS files
ls -lah src/pages/admin/*Styles.js

# Show size of CSS files
du -h src/pages/admin/*Styles.js
"

# ====== SPECIFIC MODIFICATIONS ======
echo "
🎨 SPECIFIC MODIFICATIONS:
===========================

# Change gold color (all occurrences):
sed -i 's/#C9A84C/#D4AF37/g' src/pages/admin/AdminDashboardStyles.js

# Change default surface color:
sed -i 's/#1B1A18/#2D2B28/g' src/pages/admin/AdminTableStyles.js

# Change border radius from 12px to 8px:
sed -i 's/border-radius: 12px/border-radius: 8px/g' src/pages/admin/AdminDashboardStyles.js

# Change animation speed from 0.4s to 0.3s:
sed -i 's/0\.4s ease/0.3s ease/g' src/pages/admin/AdminDashboardStyles.js
"

# ====== BACKUP COMMANDS ======
echo "
💾 BACKUP COMMANDS:
====================

# Backup before making changes
cp src/pages/admin/AdminDashboardStyles.js src/pages/admin/AdminDashboardStyles.js.backup
cp src/pages/admin/AdminTableStyles.js src/pages/admin/AdminTableStyles.js.backup

# Restore from backup
cp src/pages/admin/AdminDashboardStyles.js.backup src/pages/admin/AdminDashboardStyles.js
cp src/pages/admin/AdminTableStyles.js.backup src/pages/admin/AdminTableStyles.js

# Show diff between current and backup
diff src/pages/admin/AdminDashboardStyles.js src/pages/admin/AdminDashboardStyles.js.backup

# Remove backups
rm src/pages/admin/*.backup
"

# ====== USEFUL COMMANDS ======
echo "
🔧 USEFUL COMMANDS:
====================

# Show all CSS class names (Dashboard)
grep -oE '\.[a-z0-9-]+' src/pages/admin/AdminDashboardStyles.js | sort | uniq

# Show all CSS class names (Table)
grep -oE '\.[a-z0-9-]+' src/pages/admin/AdminTableStyles.js | sort | uniq

# Find longest CSS rule
awk '{print length, NR, \$0}' src/pages/admin/AdminDashboardStyles.js | sort -rn | head -1

# Count CSS rules
grep -c '{' src/pages/admin/AdminDashboardStyles.js

# Find TODO/FIXME comments
grep -n 'TODO\|FIXME' src/pages/admin/AdminDashboardStyles.js

# Show imports in components
grep -n 'import.*Styles' src/pages/admin/*.jsx

# Check if CSS is being used
grep -r 'stat-card' src/pages/admin/Dashboard.jsx
"

# ====== VALIDATION ======
echo "
✅ VALIDATION COMMANDS:
=========================

# Check for syntax errors
npm run build

# Lint CSS (if eslint is configured)
npm run lint

# Check file sizes
du -h src/pages/admin/AdminDashboardStyles.js
du -h src/pages/admin/AdminTableStyles.js

# Total size of all admin files
du -sh src/pages/admin/
"

echo "
======================================
 END OF COMMANDS
======================================

💡 TIPS:
- Copy paste any command above to terminal
- Change sed values to customize styles
- Always backup before making mass changes
- Use 'npm run dev' to see changes in real-time
- Press F12 in browser to inspect elements

📖 For detailed guide, see: README_CSS.md
"
