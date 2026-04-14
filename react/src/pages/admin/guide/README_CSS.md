# Admin CSS Struktur & Commands

## 📂 File Organization

```
src/pages/admin/
├── Dashboard.jsx                  # Admin Dashboard
├── Products.jsx                   # Product Management  
├── Services.jsx                   # Service Management
├── Users.jsx                      # User Management
├── Bundles.jsx                    # Bundle Management
├── AdminTableStyles.js            # Shared CSS untuk CRUD (4 files)
├── AdminDashboardStyles.js        # CSS untuk Dashboard
└── CSS_GUIDE.md                   # Quick Reference
```

---

## 🎨 CSS Files

### 1. **AdminTableStyles.js** (Digunakan oleh: Products, Services, Users, Bundles)
- Export: `adminTableCss`
- Classes: `.adm-page`, `.adm-modal`, `.adm-table`, `.adm-btn-*`, dll

### 2. **AdminDashboardStyles.js** (Digunakan oleh: Dashboard)
- Export: `adminDashboardCss`  
- Classes: `.adm-db`, `.stat-card`, `.panel`, `.ql-item`, dll

---

## ⚡ Quick Commands

### Edit CSS Files
```bash
# Edit Dashboard CSS
code src/pages/admin/AdminDashboardStyles.js

# Edit Table CSS (Products, Services, Users, Bundles)
code src/pages/admin/AdminTableStyles.js

# Edit Dashboard Component
code src/pages/admin/Dashboard.jsx

# Edit Products Component
code src/pages/admin/Products.jsx
```

### Search & Find
```bash
# Find all .stat-card references
grep -n "stat-card" src/pages/admin/AdminDashboardStyles.js

# Find all .panel references
grep -n "\.panel" src/pages/admin/AdminDashboardStyles.js

# Find all button styles
grep -n "\.adm-btn" src/pages/admin/AdminTableStyles.js

# Find all color definitions
grep -n "\-\-" src/pages/admin/AdminDashboardStyles.js

# Find animation definitions
grep -n "@keyframes" src/pages/admin/AdminDashboardStyles.js
```

### Development
```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎯 Common CSS Modifications

### Change Primary Color (Gold)
```javascript
// File: AdminDashboardStyles.js
// Or: AdminTableStyles.js

// Find:
--gold: #C9A84C;

// Change to:
--gold: #D4AF37;  // New gold color
```

### Change Font Size
```javascript
// Find: .adm-title { font-size: 26px; ... }
// Change to: font-size: 24px;

// Or find: .stat-label { font-size: 10px; ... }
// Change to: font-size: 12px;
```

### Change Spacing/Gap
```javascript
// Find: .stats-grid { ... gap: 12px; ... }
// Change to: gap: 16px;

// Or find: .panel { ... padding: 16px 20px; ... }
// Change to: padding: 20px 24px;
```

### Change Border Radius
```javascript
// Find: border-radius: 12px;
// Change to: border-radius: 8px;
```

### Change Animation Speed
```javascript
// Find: @keyframes fadeUp { ... 0.4s ... }
// Change duration from 0.4s to 0.3s (faster) or 0.6s (slower)

// Or find: transition: all 0.28s
// Change to: transition: all 0.15s (faster) or 0.4s (slower)
```

### Change Background Color
```javascript
// Find: .adm-db { ... --s2: #1B1A18; ... }
// Change to different hex value

// Current surface colors:
--s1: #141312  (darkest)
--s2: #1B1A18  (default/light)
--s3: #232220  (hover)
--s4: #2D2B28  (active)
```

---

## 🎨 CSS Variables Reference

### Primary Colors
| Variable | Value | Usage |
|----------|-------|-------|
| `--gold` | #C9A84C | Main brand color |
| `--gold-light` | #E8C97A | Hover state |
| `--gold-dim` | rgba(201,168,76,0.12) | Backgrounds |
| `--gold-line` | rgba(201,168,76,0.22) | Borders |

### Surface Colors (Dark Theme)
| Variable | Value | Usage |
|----------|-------|-------|
| `--s1` | #141312 | Darkest background |
| `--s2` | #1B1A18 | Default surfaces |
| `--s3` | #232220 | Hover states |
| `--s4` | #2D2B28 | Active states |
| `--s5` | #383532 | Lightest surfaces |

### Text Colors
| Variable | Value | Usage |
|----------|-------|-------|
| `--t1` | #F0EDE6 | Primary text |
| `--t2` | #9A9690 | Secondary text |
| `--t3` | #56534E | Tertiary text |

### Status Colors
| Variable | Value | Usage |
|----------|-------|-------|
| `--success` | #4CAF7D | Success/green |
| `--danger` | #E05252 | Error/red |
| `--info` | #5B9BDC | Info/blue |
| `--warning` | #E0C060 | Warning/yellow |
| `--purple` | #A07BC8 | Purple accent |

---

## 🔧 Advanced Edits

### Add New Color Variable
```javascript
// Add in AdminDashboardStyles.js or AdminTableStyles.js
.adm-db {
  --gold: #C9A84C;
  --s2: #1B1A18;
  /* Add your new color */
  --custom-color: #FF5733;
}

// Use it in CSS:
.custom-element {
  color: var(--custom-color);
}
```

### Modify Animation
```javascript
// Change animation duration or effect
@keyframes fadeUp {
  from { 
    opacity: 0; 
    transform: translateY(12px);  /* Ubah jarak dari 12px */
  }
  to   { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

// Apply to element with different timing:
.a1 { animation: fadeUp 0.4s ease 0.04s both; }  /* 0.4s = duration */
```

### Override Specific Element
```javascript
// Find the class and modify
.ql-item.primary { 
  background: var(--gold); 
  color: #111; 
}

// You can also add new styles:
.ql-item.primary:hover { 
  background: var(--gold-light);
  box-shadow: 0 4px 12px rgba(201, 168, 76, 0.2);
}
```

---

## 📱 Responsive Breakpoints

### Desktop (default)
```css
.stats-grid { grid-template-columns: repeat(4, 1fr); }
```

### Tablet (max-width: 1000px)
```css
@media (max-width: 1000px) { 
  .stats-grid { grid-template-columns: repeat(2, 1fr); } 
}
```

### Mobile (max-width: 900px)
```css
@media (max-width: 900px) { 
  .lower-grid { grid-template-columns: 1fr; } 
}
```

---

## 🧪 Testing Changes

### Method 1: Dev Tools (Browser)
1. Press `F12` to open DevTools
2. Go to Elements/Inspector tab
3. Find the element you want to inspect
4. See computed styles and where they come from
5. Live edit to test before making permanent changes

### Method 2: Terminal with VS Code
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Watch for CSS file changes
cd src/pages/admin
ls -la *.js | grep -i style
```

---

## 🚀 Best Practices

### DO ✅
- Keep CSS organized by component
- Use CSS variables for colors
- Use semantic class names
- Add comments for complex styles
- Test changes in dev environment first
- Keep backup of working CSS

### DON'T ❌
- Don't use inline styles (use CSS files instead)
- Don't modify multiple files without testing
- Don't remove unused classes (they might be used elsewhere)
- Don't hardcode colors (use CSS variables)
- Don't forget to save files

---

## 📝 Example Workflow

### Step 1: Open CSS File
```bash
code src/pages/admin/AdminDashboardStyles.js
```

### Step 2: Find Element to Modify
```javascript
// Search for: .stat-card
.stat-card {
  background: var(--s2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px 20px;
  /* ... other styles ... */
}
```

### Step 3: Make Changes
```javascript
// Change border-radius from 12px to 8px
.stat-card {
  background: var(--s2);
  border: 1px solid var(--border);
  border-radius: 8px;  /* Changed here */
  padding: 18px 20px;
}
```

### Step 4: Save & Test
```bash
# Save file (Ctrl+S)
# Browser auto-reloads → see changes immediately
# If not, press F5 to manually refresh
```

### Step 5: Verify in Browser
- Check if changes look correct
- Use DevTools to verify applied styles
- Test responsiveness at different screen sizes

---

## 🔗 File Imports

### Dashboard.jsx
```javascript
import { adminDashboardCss } from './AdminDashboardStyles';

// Usage:
<style>{adminDashboardCss}</style>
```

### Products.jsx, Services.jsx, Users.jsx, Bundles.jsx
```javascript
import { adminTableCss } from './AdminTableStyles';

// Usage:
<style>{adminTableCss}</style>
```

---

## 🆘 Troubleshooting

### Styles Not Applying?
```bash
# 1. Check if file is properly imported
# 2. Check for typos in class names
# 3. Check browser cache (Ctrl+Shift+R for hard refresh)
# 4. Check DevTools console for errors
# 5. Restart dev server: npm run dev
```

### Animation Not Working?
```bash
# Check browser DevTools → Performance tab
# Look for @keyframes definitions
# Ensure animation name matches
# Check timing values are correct
```

### Colors Look Wrong?
```bash
# 1. Check CSS variables are defined
# 2. Use DevTools color picker
# 3. Check for conflicting styles
# 4. Clear browser cache
```

---

## 📞 Need Help?

- Use `grep -n` to find class names
- Use DevTools Inspector to check computed styles
- Check Console (F12) for CSS warnings/errors
- Compare with backup if you broke something

---

**Last Updated:** 2026-04-14  
**Version:** 1.0
