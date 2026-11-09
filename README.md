# ✦ SpendSmart AI — Personal Finance Management Platform
> *Your Money. Your Intelligence. Your Control.*

SpendSmart AI is an interactive, production-minded personal finance web application built using **HTML5, CSS3, and modern Vanilla JavaScript**. It integrates real-time transaction tracking, multi-category budgeting, recurring bill intelligence, savings milestones, and a conversational financial assistant powered by **Google Gemini 3 Flash**.

---

## 🚀 Key Features

### 1. Financial Command Dashboard
- **Liquid Net Balance & Savings Velocity**: Real-time calculations of liquid capital, monthly gross inflow, total burn, and net savings rate.
- **Dynamic Cash-Flow SVG Curve**: SVG area curve illustrating daily spending trajectory across the month.
- **Financial Health Score (0–100)**: Transparent 4-factor scoring model analyzing savings rate (30%), budget adherence (30%), recurring debt load (20%), and goal progress (20%).
- **Master Budget Meter**: Visual progress track monitoring total monthly limit exhaustion with dynamic warning thresholds (*Healthy*, *Approaching Cap*, *Exceeded*).

### 2. Complete Transaction Ledger (CRUD)
- Record **Income** and **Expense** entries with date, amount, description, payment instrument (UPI, Credit/Debit Card, NetBanking, Cash), category, and custom notes.
- Real-time search, multi-category filtering, inline editing, and deletion.
- Minor-unit arithmetic and native locale support with Indian Rupee (`₹` Lakh/Crore formatting) and international currencies (`$`, `€`, `£`).

### 3. Gemini 3 Flash AI Intelligence
- **Natural Language Quick Parser**: Parse natural language statements (e.g., *"Spent ₹480 on Swiggy lunch via UPI"*) and record them into the ledger.
- **Grounded Conversational Companion**: Chat drawer grounded directly in the user's authentic ledger records to calculate trade-offs, affordability checks, and savings recommendations.
- **OCR Receipt Simulation**: Mock extraction for receipts and itemized invoices with confirmation prior to commit.
- **Voice Entry (Web Speech API)**: Native microphone dictation converting speech directly into draft transactions.

### 4. Budgets, Goals & Shared Expenses
- **Category Caps**: Dedicated spending limits for Food & Dining, Rent, Utilities, Transport, Entertainment, and Shopping.
- **Savings Milestones**: Target-based goals with manual deposit tracking and percentage completion gauges.
- **Recurring Commitments & Cash Calendar**: Projected obligations calendar tracking upcoming bills (broadband, electricity, subscriptions).
- **Shared Roommate Splitter**: Equal and custom expense splitting with settlement balance calculations.

### 5. UI/UX, Themes & Accessibility
- **Light & Dark Mode**: Token-based color scheme with automatic `localStorage` persistence.
- **Zero-Distraction Invisible Scrollbars**: Smooth scrolling via mouse wheel, trackpad, and touch with completely hidden scrollbar tracks and thumbs.
- **Responsive Navigation**: Desktop navigation ribbon paired with an accessible mobile slide-out drawer (☰) and escape-key handling.
- **Data Portability**: Instant one-click CSV ledger export, full JSON backup downloads, and validated JSON file restoration.

---

## 🛠️ Technology Stack

- **Markup & Semantics**: HTML5 (Landmarks: `header`, `nav`, `main`, `section`, `aside`)
- **Styling**: Modern CSS3 custom properties (Design tokens, CSS Grid, Flexbox, Media Queries)
- **Scripting & Business Logic**: Vanilla JavaScript (ES6+, DOM API, Web Storage API, Web Speech API)
- **AI Integration**: Google Gemini REST API (`gemini-3-flash-preview`) with fallback intelligence
- **Zero Dependencies**: No React, Vue, Tailwind CSS, Bootstrap, jQuery, or third-party UI libraries required.

---

## 📂 Project Structure

```text
spendsmart-ai/
├── index.html        # Complete single-file production application (HTML, CSS, JS)
└── README.md         # Architecture documentation and usage guide
```

---

## ⚡ Quick Start & Local Run

1. **Clone or Download the Repository**:
   ```bash
   git clone https://github.com/your-username/spendsmart-ai.git
   cd spendsmart-ai
   ```

2. **Run Locally**:
   Because the project uses standard web technologies with zero build steps, you can open `index.html` directly in any modern browser:
   ```bash
   # Using Python's built-in HTTP server:
   python3 -m http.server 8000

   # Or using Node.js http-server:
   npx http-server .
   ```
   Open your browser and navigate to `http://localhost:8000`.

---

## 🔒 Data Privacy & Storage Architecture

- **Client-Side Storage**: All transactions, budgets, goals, and user preferences are saved locally in the browser's `localStorage` (`spendsmart_tx_v2`, `spendsmart_budgets_v2`, `spendsmart_settings_v2`).
- **No Remote Telemetry**: User financial records are never sent to third-party databases.
- **Custom Gemini API Key**: If an API key is provided under *Settings*, it is stored only in the browser's local storage and used exclusively for direct client-to-API requests.
- **Graceful Fallbacks**: If no API key is configured or the user is offline, the app uses local heuristic rule engines to handle natural language parsing and financial summaries.

---

## 📋 Testing & Verification Checklist

- [x] **CRUD Ledger**: Successfully create, view, edit, search, filter, and delete entries.
- [x] **Math Precision**: Money calculations execute without floating-point errors.
- [x] **Theme Persistence**: Light and dark mode states persist across reloads.
- [x] **Keyboard Navigation**: Modals and mobile drawers trap and dismiss focus cleanly via `Escape`.
- [x] **Data Import/Export**: Validated JSON backup restoration and standard RFC 4180 CSV generation.
- [x] **Viewport Adaptation**: Tested and verified across 320px, 375px, 768px, 1024px, and 1440px displays.

---

## 📄 License

Distributed under the **MIT License**. Free for personal, commercial, and educational use.# SpendSmart-AI
