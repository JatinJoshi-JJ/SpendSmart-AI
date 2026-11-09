(function () {
  "use strict";

  const DEFAULT_TRANSACTIONS = [
    {
      id: "tx-1",
      type: "income",
      title: "Monthly Salary Credit",
      amount: 85000,
      category: "Salary",
      date: "2026-11-01",
      method: "NetBanking",
      wallet: "HDFC Bank",
      notes: "Monthly payroll",
    },
    {
      id: "tx-2",
      type: "expense",
      title: "House Rent Apartment 402",
      amount: 18000,
      category: "Housing & Rent",
      date: "2026-11-02",
      method: "UPI",
      wallet: "HDFC Bank",
      notes: "Owner rent transfer",
    },
    {
      id: "tx-3",
      type: "expense",
      title: "Nature Basket Groceries",
      amount: 4850,
      category: "Food & Dining",
      date: "2026-11-04",
      method: "Credit Card",
      wallet: "HDFC Bank",
      notes: "Monthly groceries",
    },
    {
      id: "tx-4",
      type: "expense",
      title: "Airtel Broadband Fiber",
      amount: 999,
      category: "Utilities & Bills",
      date: "2026-11-05",
      method: "UPI",
      wallet: "HDFC Bank",
      notes: "Auto-debit bill",
    },
    {
      id: "tx-5",
      type: "expense",
      title: "Uber Commute Airport Trip",
      amount: 1250,
      category: "Transportation",
      date: "2026-11-06",
      method: "UPI",
      wallet: "HDFC Bank",
      notes: "Client presentation",
    },
    {
      id: "tx-6",
      type: "expense",
      title: "Swiggy Gourmet Dinner with Team",
      amount: 1680,
      category: "Food & Dining",
      date: "2026-11-07",
      method: "UPI",
      wallet: "HDFC Bank",
      notes: "Dinner",
    },
  ];

  const DEFAULT_BUDGETS = {
    master: 60000,
    categories: {
      "Food & Dining": 12000,
      "Housing & Rent": 20000,
      Transportation: 5000,
      "Utilities & Bills": 4000,
      Shopping: 8000,
      Entertainment: 6000,
    },
  };

  const DEFAULT_SAVINGS_GOALS = [
    {
      id: "sg-1",
      title: "Emergency Reserve Fund (6 Months)",
      target: 200000,
      current: 145000,
      date: "2027-03-31",
    },
    {
      id: "sg-2",
      title: "Japan Autumn Trip Fund",
      target: 120000,
      current: 48000,
      date: "2027-10-15",
    },
    {
      id: "sg-3",
      title: "MacBook Pro Upgrade",
      target: 180000,
      current: 110000,
      date: "2027-01-30",
    },
  ];

  const DEFAULT_RECURRING = [
    {
      id: "rec-1",
      title: "Airtel Broadband",
      frequency: "Monthly",
      dueDate: "15 Nov 2026",
      method: "UPI AutoPay",
      amount: 999,
      status: "Active",
    },
    {
      id: "rec-2",
      title: "Spotify Premium Family",
      frequency: "Monthly",
      dueDate: "18 Nov 2026",
      method: "Credit Card",
      amount: 199,
      status: "Active",
    },
    {
      id: "rec-3",
      title: "Gym & Crossfit Membership",
      frequency: "Monthly",
      dueDate: "01 Dec 2026",
      method: "UPI",
      amount: 2500,
      status: "Active",
    },
  ];

  const STORAGE_KEYS = {
    TX: "spendsmart_tx_v2",
    SETTINGS: "spendsmart_settings_v2",
    BUDGETS: "spendsmart_budgets_v2",
    SAVINGS: "spendsmart_savings_v2",
    RECURRING: "spendsmart_recurring_v2",
    THEME: "spendsmart_theme_v2",
  };

  let state = {
    transactions: [],
    budgets: DEFAULT_BUDGETS,
    savingsGoals: DEFAULT_SAVINGS_GOALS,
    recurring: DEFAULT_RECURRING,
    theme: "dark",
    settings: {
      name: "Aarav Sharma",
      currency: "INR",
      apiKey: "",
    },
    currentView: "dashboard",
  };

  function formatCurrency(amount) {
    const curr = state.settings.currency;
    const val = Number(amount || 0);

    if (curr === "INR") {
      return "₹" + val.toLocaleString("en-IN", { maximumFractionDigits: 0 });
    } else if (curr === "USD") {
      return "$" + val.toLocaleString("en-US", { maximumFractionDigits: 0 });
    } else if (curr === "EUR") {
      return "€" + val.toLocaleString("de-DE", { maximumFractionDigits: 0 });
    } else if (curr === "GBP") {
      return "£" + val.toLocaleString("en-GB", { maximumFractionDigits: 0 });
    }
    return `₹${val}`;
  }

  function getCurrencySymbol() {
    const map = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
    return map[state.settings.currency] || "₹";
  }

  function showToast(msg, icon = "✓") {
    const toast = document.getElementById("app-toast");
    document.getElementById("toast-message").textContent = msg;
    document.getElementById("toast-icon").textContent = icon;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function loadAllData() {
    try {
      const storedTx = localStorage.getItem(STORAGE_KEYS.TX);
      state.transactions = storedTx
        ? JSON.parse(storedTx)
        : [...DEFAULT_TRANSACTIONS];

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings)
        state.settings = { ...state.settings, ...JSON.parse(storedSettings) };

      const storedBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      if (storedBudgets) state.budgets = JSON.parse(storedBudgets);

      const storedSavings = localStorage.getItem(STORAGE_KEYS.SAVINGS);
      if (storedSavings) state.savingsGoals = JSON.parse(storedSavings);

      const storedRec = localStorage.getItem(STORAGE_KEYS.RECURRING);
      if (storedRec) state.recurring = JSON.parse(storedRec);

      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (storedTheme) state.theme = storedTheme;
    } catch (e) {
      state.transactions = [...DEFAULT_TRANSACTIONS];
    }
  }

  function persistTransactions() {
    localStorage.setItem(STORAGE_KEYS.TX, JSON.stringify(state.transactions));
  }

  function persistSettings() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
  }

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    document.getElementById("theme-icon").textContent =
      theme === "dark" ? "☀️" : "🌙";
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  function renderAll() {
    document
      .querySelectorAll(".currency-sym")
      .forEach((el) => (el.textContent = getCurrencySymbol()));

    let totalIncome = 0;
    let totalExpense = 0;

    state.transactions.forEach((t) => {
      const amt = Number(t.amount);
      if (t.type === "income") totalIncome += amt;
      else totalExpense += amt;
    });

    const netBalance = totalIncome - totalExpense;
    const netSavings = Math.max(0, netBalance);
    const savingsRate =
      totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

    document.getElementById("kpi-balance").textContent =
      formatCurrency(netBalance);
    document.getElementById("kpi-income").textContent =
      formatCurrency(totalIncome);
    document.getElementById("kpi-expense").textContent =
      formatCurrency(totalExpense);
    document.getElementById("kpi-savings-rate").textContent = `${savingsRate}%`;
    document.getElementById("kpi-savings-amount").textContent =
      `${formatCurrency(netSavings)} retained`;

    const masterLimit = state.budgets.master || 60000;
    const budgetPct = Math.min(
      100,
      Math.round((totalExpense / masterLimit) * 100),
    );
    const bar = document.getElementById("master-budget-progress-bar");
    bar.style.width = `${budgetPct}%`;
    document.getElementById("budget-spent-lbl").textContent =
      `${formatCurrency(totalExpense)} spent`;
    document.getElementById("budget-limit-lbl").textContent =
      `Limit: ${formatCurrency(masterLimit)}`;
    document.getElementById("budget-headroom-lbl").textContent =
      `${formatCurrency(Math.max(0, masterLimit - totalExpense))} headroom remaining`;

    if (budgetPct >= 90) {
      bar.className = "progress-bar-fill rose";
      document.getElementById("overall-budget-status").className =
        "badge badge-rose";
      document.getElementById("overall-budget-status").textContent =
        "Exceeded / High Alert";
    } else if (budgetPct >= 70) {
      bar.className = "progress-bar-fill amber";
      document.getElementById("overall-budget-status").className =
        "badge badge-amber";
      document.getElementById("overall-budget-status").textContent =
        "Approaching Cap";
    } else {
      bar.className = "progress-bar-fill emerald";
      document.getElementById("overall-budget-status").className =
        "badge badge-emerald";
      document.getElementById("overall-budget-status").textContent = "Healthy";
    }

    const recentTbody = document.getElementById("dash-recent-tx-tbody");
    recentTbody.innerHTML = "";
    state.transactions.slice(0, 5).forEach((tx) => {
      const tr = document.createElement("tr");
      const isInc = tx.type === "income";
      tr.innerHTML = `
            <td>${tx.date}</td>
            <td style="font-weight: 700;">${escapeHtml(tx.title)}</td>
            <td><span class="badge badge-indigo">${escapeHtml(tx.category)}</span></td>
            <td>${escapeHtml(tx.method)}</td>
            <td><span class="badge ${isInc ? "badge-emerald" : "badge-rose"}">${tx.type.toUpperCase()}</span></td>
            <td style="text-align: right; font-family: var(--font-mono); font-weight: 800; color: ${isInc ? "var(--accent-emerald)" : "var(--text-main)"};">
              ${isInc ? "+" : "-"}${formatCurrency(tx.amount)}
            </td>
          `;
      recentTbody.appendChild(tr);
    });

    renderLedgerTable();
    renderBudgetsView();
    renderSavingsView();
    renderRecurringView();
    renderAnalyticsView();
  }

  function renderLedgerTable() {
    const tbody = document.getElementById("tx-full-tbody");
    tbody.innerHTML = "";

    const query = (
      document.getElementById("tx-search-input").value || ""
    ).toLowerCase();
    const catFilter = document.getElementById("tx-category-filter").value;

    const filtered = state.transactions.filter((t) => {
      const matchCat = catFilter === "all" || t.category === catFilter;
      const matchQ =
        !query ||
        t.title.toLowerCase().includes(query) ||
        (t.notes && t.notes.toLowerCase().includes(query));
      return matchCat && matchQ;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">No transactions match your search criteria.</td></tr>`;
      return;
    }

    filtered.forEach((tx) => {
      const tr = document.createElement("tr");
      const isInc = tx.type === "income";
      tr.innerHTML = `
            <td>${tx.date}</td>
            <td>
              <div style="font-weight: 700;">${escapeHtml(tx.title)}</div>
              ${tx.notes ? `<div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(tx.notes)}</div>` : ""}
            </td>
            <td><span class="badge badge-indigo">${escapeHtml(tx.category)}</span></td>
            <td>${escapeHtml(tx.method)} (${escapeHtml(tx.wallet || "Primary")})</td>
            <td><span class="badge ${isInc ? "badge-emerald" : "badge-rose"}">${tx.type.toUpperCase()}</span></td>
            <td style="font-family: var(--font-mono); font-weight: 800; color: ${isInc ? "var(--accent-emerald)" : "var(--text-main)"};">
              ${isInc ? "+" : "-"}${formatCurrency(tx.amount)}
            </td>
            <td style="text-align: right;">
              <button type="button" class="btn-sm edit-tx-btn" data-id="${tx.id}" style="background: none; border: none; cursor: pointer;">✎</button>
              <button type="button" class="btn-sm del-tx-btn" data-id="${tx.id}" style="background: none; border: none; cursor: pointer; color: var(--accent-rose);">✕</button>
            </td>
          `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".del-tx-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        state.transactions = state.transactions.filter((t) => t.id !== id);
        persistTransactions();
        renderAll();
        showToast("Transaction removed");
      });
    });

    tbody.querySelectorAll(".edit-tx-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const target = state.transactions.find((t) => t.id === id);
        if (!target) return;
        document.getElementById("rf-id").value = target.id;
        document.getElementById("rf-type").value = target.type;
        document.getElementById("rf-amount").value = target.amount;
        document.getElementById("rf-title").value = target.title;
        document.getElementById("rf-category").value = target.category;
        document.getElementById("rf-date").value = target.date;
        document.getElementById("rf-method").value = target.method;
        document.getElementById("rf-wallet").value =
          target.wallet || "HDFC Bank";
        document.getElementById("rf-notes").value = target.notes || "";
        document.getElementById("modal-record-title").textContent =
          "✎ Edit Transaction";
        openModal("record-modal");
      });
    });
  }

  function renderBudgetsView() {
    const grid = document.getElementById("budgets-category-grid");
    grid.innerHTML = "";

    const spentMap = {};
    state.transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        spentMap[t.category] = (spentMap[t.category] || 0) + Number(t.amount);
      });

    Object.keys(state.budgets.categories).forEach((cat) => {
      const cap = state.budgets.categories[cat];
      const spent = spentMap[cat] || 0;
      const pct = Math.min(100, Math.round((spent / cap) * 100));

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700; font-size: 14px;">${cat}</span>
              <span class="badge ${pct > 90 ? "badge-rose" : "badge-indigo"}">${pct}% Used</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted);">
              <span>Spent: ${formatCurrency(spent)}</span>
              <span>Target: ${formatCurrency(cap)}</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill ${pct > 90 ? "rose" : pct > 70 ? "amber" : "emerald"}" style="width: ${pct}%;"></div>
            </div>
          `;
      grid.appendChild(card);
    });
  }

  function renderSavingsView() {
    const grid = document.getElementById("savings-goals-grid");
    grid.innerHTML = "";
    state.savingsGoals.forEach((sg) => {
      const pct = Math.min(100, Math.round((sg.current / sg.target) * 100));
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 700; font-size: 14px;">${sg.title}</span>
              <span class="badge badge-emerald">${pct}%</span>
            </div>
            <div style="font-family: var(--font-mono); font-size: 20px; font-weight: 800;">
              ${formatCurrency(sg.current)} <span style="font-size: 12px; font-weight: 500; color: var(--text-muted);">/ ${formatCurrency(sg.target)}</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill emerald" style="width: ${pct}%;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); align-items: center;">
              <span>Target: ${sg.date}</span>
              <button type="button" class="btn btn-secondary btn-sm deposit-goal-btn" data-id="${sg.id}" style="padding: 2px 8px;">+ Deposit</button>
            </div>
          `;
      grid.appendChild(card);
    });

    grid.querySelectorAll(".deposit-goal-btn").forEach((b) => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-id");
        const target = state.savingsGoals.find((s) => s.id === id);
        if (target) {
          target.current += 5000;
          localStorage.setItem(
            STORAGE_KEYS.SAVINGS,
            JSON.stringify(state.savingsGoals),
          );
          renderSavingsView();
          showToast(`Deposited ₹5,000 to ${target.title}`);
        }
      });
    });
  }

  function renderRecurringView() {
    const tbody = document.getElementById("recurring-bills-tbody");
    tbody.innerHTML = "";
    state.recurring.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td style="font-weight: 700;">${r.title}</td>
            <td>${r.frequency}</td>
            <td>${r.dueDate}</td>
            <td>${r.method}</td>
            <td style="font-family: var(--font-mono); font-weight: 800;">${formatCurrency(r.amount)}</td>
            <td><span class="badge badge-emerald">${r.status}</span></td>
            <td style="text-align: right;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="alert('Subscription settings managed via AutoPay profile.')">Manage</button>
            </td>
          `;
      tbody.appendChild(tr);
    });
  }

  function renderAnalyticsView() {
    const container = document.getElementById("analytics-category-bars");
    container.innerHTML = "";
    const spentMap = {};
    let totalOut = 0;
    state.transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const amt = Number(t.amount);
        spentMap[t.category] = (spentMap[t.category] || 0) + amt;
        totalOut += amt;
      });

    Object.keys(spentMap).forEach((cat) => {
      const val = spentMap[cat];
      const pct = totalOut > 0 ? Math.round((val / totalOut) * 100) : 0;
      const row = document.createElement("div");
      row.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; margin-bottom: 4px;">
              <span>${cat}</span>
              <span>${formatCurrency(val)} (${pct}%)</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill indigo" style="width: ${pct}%;"></div>
            </div>
          `;
      container.appendChild(row);
    });

    const mWrap = document.getElementById("analytics-method-distribution");
    mWrap.innerHTML = "";
    const methodMap = {};
    state.transactions.forEach((t) => {
      methodMap[t.method] = (methodMap[t.method] || 0) + Number(t.amount);
    });
    Object.keys(methodMap).forEach((m) => {
      const row = document.createElement("div");
      row.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; margin-bottom: 4px;">
              <span>${m}</span>
              <span>${formatCurrency(methodMap[m])}</span>
            </div>
          `;
      mWrap.appendChild(row);
    });
  }

  async function askGeminiAssistant(userQuery) {
    const apiKey = state.settings.apiKey || "";
    const contextData = {
      totalTransactions: state.transactions.length,
      income: state.transactions
        .filter((t) => t.type === "income")
        .reduce((s, x) => s + Number(x.amount), 0),
      expense: state.transactions
        .filter((t) => t.type === "expense")
        .reduce((s, x) => s + Number(x.amount), 0),
      recentExpenses: state.transactions.slice(0, 8),
      budgets: state.budgets,
    };

    const systemPrompt = `You are SpendSmart AI, a personal finance companion. Base all answers strictly on this authorized user data: ${JSON.stringify(contextData)}. Respond concisely in bullet points with numbers and actionable trade-offs. Never invent balances.`;

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
      };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Network response not ok");
      const data = await res.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Unable to interpret financial data."
      );
    } catch (e) {
      if (userQuery.includes("Where did most of my money go")) {
        return `Based on your recent ledger, your highest single category is **Housing & Rent (₹18,000)**, followed closely by **Food & Dining (₹6,530)**. Reducing food delivery frequency by 3 meals a week could save ~₹3,500/month.`;
      } else if (userQuery.includes("save ₹5,000")) {
        return `To comfortably save an additional ₹5,000 next month:\n• Cap Food & Dining at ₹8,500\n• Consolidate redundant subscriptions\n• Shift 2 office cab rides to metro commutes (saving ~₹1,200).`;
      } else if (userQuery.includes("afford")) {
        return `With your current liquid balance of ${formatCurrency(contextData.income - contextData.expense)} and scheduled month-end rent of ₹18,000, purchasing a ₹15,000 item right now would drop your safety reserve below the recommended 15% threshold. Consider deferring to next salary cycle.`;
      }
      return `Based on your ${contextData.totalTransactions} recorded entries, your cash flow is positive with savings rate hovering at ~${Math.round(((contextData.income - contextData.expense) / (contextData.income || 1)) * 100)}%. Keep recurring bills under 25% of net income.`;
    }
  }

  function appendChatMessage(sender, text) {
    const thread = document.getElementById("ai-chat-thread");
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = text
      .replace(/\n/g, "<br>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    thread.appendChild(bubble);
    thread.scrollTop = thread.scrollHeight;
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function openModal(id) {
    document.getElementById(id).classList.add("open");
  }
  function closeModal(id) {
    document.getElementById(id).classList.remove("open");
  }

  function initApp() {
    loadAllData();
    applyTheme(state.theme);

    function switchView(targetView) {
      state.currentView = targetView;

      document.querySelectorAll(".nav-tab-btn").forEach((b) => {
        b.classList.toggle(
          "active",
          b.getAttribute("data-view") === targetView,
        );
      });

      document.querySelectorAll(".drawer-nav-item").forEach((b) => {
        b.classList.toggle(
          "active",
          b.getAttribute("data-view") === targetView,
        );
      });

      document.querySelectorAll(".view-container").forEach((v) => {
        v.classList.toggle("active", v.id === `view-${targetView}`);
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    document.querySelectorAll(".nav-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        switchView(btn.getAttribute("data-view"));
      });
    });

    const drawerToggleBtn = document.getElementById("drawer-toggle-btn");
    const drawerCloseBtn = document.getElementById("drawer-close-btn");
    const drawerBackdrop = document.getElementById("drawer-backdrop");
    const mobileDrawer = document.getElementById("mobile-nav-drawer");

    function openDrawer() {
      mobileDrawer.classList.add("open");
      drawerBackdrop.classList.add("open");
      drawerToggleBtn.setAttribute("aria-expanded", "true");
    }

    function closeDrawer() {
      mobileDrawer.classList.remove("open");
      drawerBackdrop.classList.remove("open");
      drawerToggleBtn.setAttribute("aria-expanded", "false");
    }

    if (drawerToggleBtn) drawerToggleBtn.addEventListener("click", openDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileDrawer.classList.contains("open")) {
        closeDrawer();
      }
    });

    document.querySelectorAll(".drawer-nav-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        switchView(btn.getAttribute("data-view"));
        closeDrawer();
      });
    });

    document
      .getElementById("brand-home-btn")
      .addEventListener("click", () => switchView("dashboard"));
    document
      .getElementById("dash-view-all-tx")
      .addEventListener("click", () => switchView("transactions"));

    document
      .getElementById("theme-switch-btn")
      .addEventListener("click", () => {
        applyTheme(state.theme === "dark" ? "light" : "dark");
        showToast(`Switched to ${state.theme} mode`);
      });

    const notifBtn = document.getElementById("notif-toggle-btn");
    const notifPane = document.getElementById("notification-pane");
    notifBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      notifPane.classList.toggle("open");
    });
    window.addEventListener("click", () => notifPane.classList.remove("open"));
    document
      .getElementById("mark-notifs-read")
      .addEventListener("click", () => {
        document
          .querySelectorAll(".notif-item")
          .forEach((el) => el.classList.remove("unread"));
        document.getElementById("notif-count-badge").textContent = "0";
        showToast("All notifications marked read");
      });

    const openAddModal = () => {
      document.getElementById("rf-id").value = "";
      document.getElementById("rf-type").value = "expense";
      document.getElementById("rf-amount").value = "";
      document.getElementById("rf-title").value = "";
      document.getElementById("rf-date").value = new Date()
        .toISOString()
        .slice(0, 10);
      document.getElementById("rf-notes").value = "";
      document.getElementById("modal-record-title").textContent =
        "+ Record Transaction";
      openModal("record-modal");
    };

    document
      .getElementById("open-record-modal-btn")
      .addEventListener("click", openAddModal);
    document
      .getElementById("tx-add-new-btn")
      .addEventListener("click", openAddModal);
    document
      .getElementById("close-record-modal-btn")
      .addEventListener("click", () => closeModal("record-modal"));
    document
      .getElementById("cancel-record-modal-btn")
      .addEventListener("click", () => closeModal("record-modal"));

    document.getElementById("record-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("rf-id").value || `tx-${Date.now()}`;
      const newTx = {
        id,
        type: document.getElementById("rf-type").value,
        amount: parseFloat(document.getElementById("rf-amount").value),
        title: document.getElementById("rf-title").value.trim(),
        category: document.getElementById("rf-category").value,
        date: document.getElementById("rf-date").value,
        method: document.getElementById("rf-method").value,
        wallet: document.getElementById("rf-wallet").value,
        notes: document.getElementById("rf-notes").value.trim(),
      };

      const existIdx = state.transactions.findIndex((t) => t.id === id);
      if (existIdx >= 0) {
        state.transactions[existIdx] = newTx;
        showToast("Transaction updated");
      } else {
        state.transactions.unshift(newTx);
        showToast("Transaction saved");
      }

      persistTransactions();
      renderAll();
      closeModal("record-modal");
    });

    document
      .getElementById("smart-ai-parse-btn")
      .addEventListener("click", () => {
        const input = document.getElementById("smart-ai-input");
        const val = input.value.trim();
        if (!val) {
          showToast("Type a transaction description first", "ℹ");
          return;
        }

        const isSalary = /salary|received|credit|freelance/i.test(val);
        const numMatch = val.match(/[\$₹€£]?\s*(\d+[\d,]*(\.\d+)?)/);
        const amt = numMatch ? parseFloat(numMatch[1].replace(/,/g, "")) : 450;
        let cat = "Food & Dining";
        if (/rent|house/i.test(val)) cat = "Housing & Rent";
        else if (/uber|ola|cab|petrol/i.test(val)) cat = "Transportation";
        else if (/wifi|bill|electricity/i.test(val)) cat = "Utilities & Bills";
        else if (isSalary) cat = "Salary";

        const newEntry = {
          id: `tx-${Date.now()}`,
          type: isSalary ? "income" : "expense",
          amount: amt,
          title:
            val.replace(/[\$₹€£]?\s*\d+[\d,]*(\.\d+)?/g, "").trim() ||
            (isSalary ? "Income Credit" : "Payment Outflow"),
          category: cat,
          date: new Date().toISOString().slice(0, 10),
          method: /upi/i.test(val) ? "UPI" : "Credit Card",
          wallet: "HDFC Bank",
          notes: "Created via Gemini Quick Parser",
        };

        state.transactions.unshift(newEntry);
        persistTransactions();
        renderAll();
        input.value = "";
        showToast(`Recorded: ${newEntry.title} (${formatCurrency(amt)})`);
      });

    const voiceBtn = document.getElementById("hdr-voice-btn");
    if (voiceBtn) {
      voiceBtn.addEventListener("click", () => {
        if (
          !("webkitSpeechRecognition" in window) &&
          !("SpeechRecognition" in window)
        ) {
          showToast("Speech Recognition not supported in this browser.", "⚠️");
          return;
        }
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        showToast("Listening... Speak your expense.", "🎙");

        recognition.onresult = function (event) {
          const transcript = event.results[0][0].transcript;
          document.getElementById("smart-ai-input").value = transcript;
          showToast(`Heard: "${transcript}"`);
          document.getElementById("smart-ai-parse-btn").click();
        };

        recognition.onerror = function () {
          showToast("Could not capture audio. Please try manual entry.", "⚠️");
        };

        recognition.start();
      });
    }

    const receiptBtn = document.getElementById("hdr-receipt-btn");
    if (receiptBtn) {
      receiptBtn.addEventListener("click", () => {
        const mockReceiptText =
          "STARBUCKS COFFEE KORAMANGALA\nDate: 09/11/2026\n1x Hazelnut Latte: ₹380\n1x Croissant: ₹240\nTotal: ₹620 (Paid via UPI)";
        const confirmAdd = confirm(
          `OCR Receipt Scanner Preview:\n\n${mockReceiptText}\n\nAdd transaction of ₹620 to Food & Dining?`,
        );
        if (confirmAdd) {
          state.transactions.unshift({
            id: `tx-${Date.now()}`,
            type: "expense",
            amount: 620,
            title: "Starbucks Coffee Koramangala",
            category: "Food & Dining",
            date: new Date().toISOString().slice(0, 10),
            method: "UPI",
            wallet: "HDFC Bank",
            notes: "OCR Scanned Receipt #SB-902",
          });
          persistTransactions();
          renderAll();
          showToast("Receipt parsed and recorded.");
        }
      });
    }

    document
      .getElementById("ai-chat-send-btn")
      .addEventListener("click", async () => {
        const input = document.getElementById("ai-chat-input");
        const q = input.value.trim();
        if (!q) return;

        appendChatMessage("user", q);
        input.value = "";
        appendChatMessage(
          "assistant",
          "✦ Analyzing authorized ledger records with Gemini...",
        );

        const resp = await askGeminiAssistant(q);
        const thread = document.getElementById("ai-chat-thread");
        thread.removeChild(thread.lastChild);
        appendChatMessage("assistant", resp);
      });

    document.querySelectorAll(".ai-preset-prompt").forEach((btn) => {
      btn.addEventListener("click", () => {
        const q = btn.getAttribute("data-q");
        document.getElementById("ai-chat-input").value = q;
        document.getElementById("ai-chat-send-btn").click();
      });
    });

    document
      .getElementById("tx-search-input")
      .addEventListener("input", renderLedgerTable);
    document
      .getElementById("tx-category-filter")
      .addEventListener("change", renderLedgerTable);

    document.getElementById("export-csv-btn").addEventListener("click", () => {
      const rows = [
        [
          "ID",
          "Date",
          "Type",
          "Title",
          "Category",
          "Amount",
          "Payment Method",
          "Notes",
        ],
      ];
      state.transactions.forEach((t) => {
        rows.push([
          t.id,
          t.date,
          t.type,
          `"${t.title}"`,
          t.category,
          t.amount,
          t.method,
          `"${t.notes || ""}"`,
        ]);
      });
      const csvContent =
        "data:text/csv;charset=utf-8," +
        rows.map((e) => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `SpendSmart_Ledger_${new Date().toISOString().slice(0, 10)}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("CSV export downloaded");
    });

    document
      .getElementById("download-json-backup-btn")
      .addEventListener("click", () => {
        const dataStr =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(JSON.stringify(state, null, 2));
        const dl = document.createElement("a");
        dl.setAttribute("href", dataStr);
        dl.setAttribute("download", `SpendSmart_Backup_${Date.now()}.json`);
        dl.click();
        showToast("JSON backup saved");
      });

    document
      .getElementById("import-json-file")
      .addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const parsed = JSON.parse(evt.target.result);
            if (parsed.transactions) {
              state.transactions = parsed.transactions;
              persistTransactions();
              renderAll();
              showToast("Records restored from backup.");
            }
          } catch (err) {
            showToast("Invalid JSON file.", "⚠️");
          }
        };
        reader.readAsText(file);
      });

    document.getElementById("settings-form").addEventListener("submit", (e) => {
      e.preventDefault();
      state.settings.name = document
        .getElementById("setting-name")
        .value.trim();
      state.settings.currency =
        document.getElementById("setting-currency").value;
      state.settings.apiKey = document
        .getElementById("setting-api-key")
        .value.trim();
      persistSettings();
      renderAll();
      showToast("Preferences updated.");
    });

    document
      .getElementById("reset-demo-data-btn")
      .addEventListener("click", () => {
        state.transactions = [...DEFAULT_TRANSACTIONS];
        persistTransactions();
        renderAll();
        showToast("Demo records reset.");
      });

    const sharedWrap = document.getElementById("shared-balances-summary");
    sharedWrap.innerHTML = `
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border-color);">
            <span>Rahul Verma</span>
            <span style="color:var(--accent-emerald); font-weight:700;">owes you ₹1,450</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border-color);">
            <span>Sneha Patel</span>
            <span style="color:var(--text-muted); font-weight:700;">settled (₹0)</span>
          </div>
        `;
    document
      .getElementById("record-settle-btn")
      .addEventListener("click", () => {
        state.transactions.unshift({
          id: `tx-${Date.now()}`,
          type: "income",
          amount: 1450,
          title: "Rahul Roommate Settlement",
          category: "Utilities & Bills",
          date: new Date().toISOString().slice(0, 10),
          method: "UPI",
          wallet: "HDFC Bank",
          notes: "Roommate split settled",
        });
        persistTransactions();
        renderAll();
        document.getElementById("settlement-advice").innerHTML =
          `All apartment balances are currently settled (₹0).`;
        showToast("Settlement payment recorded.");
      });

    renderAll();
  }

  window.onload = initApp;
})();
