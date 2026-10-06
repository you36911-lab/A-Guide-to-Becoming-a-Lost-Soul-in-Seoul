/* =========================================================
   Lost Soul in Seoul — app
   Depends on: engine.js (KoEngine), curriculum.js, practice.js,
               dictionary.js, hanja.js
   ========================================================= */

(() => {
  "use strict";

  /* Premium content switch.
     true  = everything open (development / members)
     false = Hanja shows the free preview only                    */
  const ACCESS = { premium: true };

  const K = window.KoEngine;
  const STORE_KEY = "lss:v2";
  const SVG_NS = "http://www.w3.org/2000/svg";
  const LEVEL_ORDER = Object.keys(LEVELS);
  const DAY = 86400000;
  const SRS_DAYS = [0, 1, 3, 7, 16, 35, 80];

  /* ═════════ State ═════════ */
  const state = loadState();

  function freshState() {
    return { done: new Set(), freeRoam: false, startLevel: null, saved: {}, mistakes: {}, drafts: {}, checks: {}, notes: [], days: [], hanjaKnown: new Set(), lastBackup: null, diary: {}, ttsFallback: true, showSplash: true, readDone: [] };
  }
  function loadState() {
    const base = freshState();
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (raw) return { ...base, ...raw, done: new Set(raw.done || []), hanjaKnown: new Set(raw.hanjaKnown || []) };
      const v1 = JSON.parse(localStorage.getItem("lss:progress:v1") || "null");
      if (v1) return { ...base, done: new Set(v1.done || []), freeRoam: !!v1.freeRoam };
    } catch { /* fall through */ }
    return base;
  }
  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ ...state, done: [...state.done], hanjaKnown: [...state.hanjaKnown] }));
    } catch { /* storage unavailable: progress lasts for this visit */ }
    updateBadges();
  }
  function markActive() {
    const d = todayKey();
    if (!state.days.includes(d)) { state.days.push(d); state.days = state.days.slice(-400); }
  }

  /* ═════════ Helpers ═════════ */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const todayKey = (t = Date.now()) => new Date(t).toLocaleDateString("en-CA");
  const tint = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`; };
  const lessonId = (u, j) => `${UNITS[u].id}:${j}`;
  const unitTotal = u => UNITS[u].lessons.length;
  const unitDoneCount = u => UNITS[u].lessons.filter((_, j) => state.done.has(lessonId(u, j))).length;
  const unitComplete = u => unitDoneCount(u) === unitTotal(u);
  const levelIdx = code => LEVEL_ORDER.indexOf(code);
  const skipped = u => !!state.startLevel && levelIdx(UNITS[u].level) < levelIdx(state.startLevel);
  const isStartUnit = u => !!state.startLevel && UNITS.findIndex(x => x.level === state.startLevel) === u;
  const isUnlocked = u => state.freeRoam || u === 0 || skipped(u) || isStartUnit(u) || unitComplete(u - 1);
  const totalLessons = UNITS.reduce((n, u) => n + u.lessons.length, 0);
  const currentUnit = () => {
    const i = UNITS.findIndex((_, u) => !skipped(u) && !unitComplete(u));
    return i === -1 ? UNITS.length - 1 : i;
  };
  const findLesson = id => {
    const [uid, j] = id.split(":"); const u = UNITS.findIndex(x => x.id === uid);
    return u < 0 ? null : { u, j: Number(j), unit: UNITS[u], lesson: UNITS[u].lessons[Number(j)] };
  };
  function streak() {
    const set = new Set(state.days);
    let n = 0, t = Date.now();
    if (!set.has(todayKey(t))) t -= DAY;
    while (set.has(todayKey(t))) { n++; t -= DAY; }
    return n;
  }
  const dueWords = () => Object.entries(state.saved).filter(([, s]) => s.due <= Date.now()).map(([w]) => w);
  const mistakeList = () => Object.values(state.mistakes);
  const hanjaFree = i => ACCESS.premium || i < HANJA_SETS[0].free;

  function svgEl(tag, attrs = {}, parent) {
    const n = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (parent) parent.appendChild(n);
    return n;
  }

  /* ═════════ Audio: your recordings first, the browser voice as a fallback ═════════ */
  let koVoice = null;
  function loadVoices() {
    if (!("speechSynthesis" in window)) return;
    koVoice = speechSynthesis.getVoices().find(x => /^ko/i.test(x.lang)) || null;
  }
  if ("speechSynthesis" in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  function speakable(text) {
    return String(text)
      .replace(/\[[^\]]*\]/g, " ")
      .replace(/\([^)]*[A-Za-z][^)]*\)/g, " ")
      .replace(/[→=✗✓·]/g, ", ")
      .replace(/[A-Za-z]+/g, " ")
      .replace(/\s*,\s*(,\s*)+/g, ", ")
      .replace(/^[\s,]+|[\s,]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  // stable id for a line of text: FNV-1a, 32 bit
  function voiceId(text) {
    let h = 0x811c9dc5;
    for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
    return "v" + h.toString(16).padStart(8, "0");
  }
  let currentAudio = null;
  function speakTTS(s) {
    if (!koVoice) { toast("No recording for this line yet."); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(s);
    u.voice = koVoice; u.lang = koVoice.lang; u.rate = 0.9;
    speechSynthesis.speak(u);
  }
  function speak(text, btn) {
    const s = speakable(text);
    if (!/[가-힣]/.test(s)) return;
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    const cfg = window.VOICES || { dir: "voices/", ext: ".mp3" };
    const a = new Audio(cfg.dir + voiceId(s) + cfg.ext);
    currentAudio = a;
    btn && btn.classList.add("playing");
    const done = () => btn && btn.classList.remove("playing");
    a.addEventListener("ended", done);
    a.addEventListener("error", () => { done(); if (currentAudio === a) { currentAudio = null; if (state.ttsFallback !== false) speakTTS(s); else toast("No recording for this line yet."); } }, { once: true });
    a.play().catch(() => {});
  }
  const speakBtn = (text, label = "Listen") =>
    /[가-힣]/.test(speakable(text)) ? `<button class="speak" type="button" data-speak="${esc(text)}" aria-label="${label}: ${esc(speakable(text))}"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor"/><path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.5a6 6 0 0 1 0 9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button>` : "";
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-speak]");
    if (b) { e.stopPropagation(); speak(b.dataset.speak, b); }
  });

  // Every line the app can play, for the recording list
  function collectVoiceLines() {
    const rows = new Map();
    const add = (text, where) => {
      const s = speakable(text);
      if (!/[가-힣]/.test(s)) return;
      const id = voiceId(s);
      if (!rows.has(id)) rows.set(id, { id, text: s, where: [] });
      const r = rows.get(id);
      if (!r.where.includes(where) && r.where.length < 4) r.where.push(where);
    };
    UNITS.forEach((u, i) => u.lessons.forEach((l, j) => {
      const where = `${u.place} ${j + 1}. ${l.t}`;
      l.ex.forEach(x => add(x, where));
      (PRACTICE[lessonId(i, j)] || []).forEach(item => {
        if (item.drill && item.words) item.words.forEach(w => add(w, where + " (practice)"));
      });
    }));
    PROVERBS.forEach(p => add(p[0], "Proverb of the day"));
    DICTIONARY.forEach(e => add(e[0], "Dictionary (core)"));
    HANJA.forEach(h => h[4].forEach(w => add(w[0], `Hanja ${h[0]}`)));
    DEEP_DIVES.forEach(d => d.sections.forEach(s => (s.ex || []).forEach(x => add(x, `Deep dive: ${d.title}`))));
    DIARY_PROMPTS.forEach(p => add(p.ko, "Diary prompt"));
    READINGS.forEach(rd => rd.lines.forEach(l => add(l.replace(/^[^:]{1,6}:\s/, ""), `Reading: ${rd.title}`)));
    return [...rows.values()];
  }
  function downloadVoiceList() {
    const rows = collectVoiceLines();
    const q = s => `"${String(s).replace(/"/g, '""')}"`;
    const csv = "\uFEFF" + ["file,text,where", ...rows.map(r => [q(r.id + (window.VOICES?.ext || ".mp3")), q(r.text), q(r.where.join(" | "))].join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = "recording-list.csv";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(`Recording list downloaded: ${rows.length} lines.`);
  }

  /* ═════════ Toast ═════════ */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
  }

  /* ═════════ Router ═════════ */
  const VIEWS = ["journey", "place", "reading", "diary", "lab", "dictionary", "hanja", "deep", "review", "notebook", "settings", "more"];
  function route() {
    const [path, query] = (location.hash.replace(/^#\/?/, "") || "").split("?");
    const seg = path.split("/").map(decodeURIComponent);
    const view = VIEWS.includes(seg[0]) ? seg[0] : "journey";
    const params = new URLSearchParams(query || "");
    $$(".view").forEach(v => { v.hidden = v.dataset.view !== view; });
    const navKey = view === "place" ? "journey" : view;
    $$("[data-nav]").forEach(a => a.setAttribute("aria-current", a.dataset.nav === navKey ? "page" : "false"));
    if (["lab", "hanja", "notebook", "settings", "reading"].includes(view)) $$(".tabbar [data-nav='more']").forEach(a => a.setAttribute("aria-current", "page"));
    if (drawer.classList.contains("open")) closeDrawer(true);
    window.scrollTo({ top: 0 });
    if (view === "journey") { renderToday(); renderMap(); }
    if (view === "place") renderPlace(seg[1], seg[2]);
    if (view === "lab") renderLab(params);
    if (view === "dictionary") renderDictionary(params);
    if (view === "hanja") renderHanja(params);
    if (view === "deep") renderDeep(seg[1]);
    if (view === "review") renderReview(params);
    if (view === "notebook") renderNotebook(params);
    if (view === "diary") renderDiary();
    if (view === "reading") renderReading(seg[1]);
    if (view === "settings") renderSettings();
    document.title = view === "journey" ? "A Guide to Becoming a Lost Soul in Seoul" : `${({ place: "Place", reading: "Reading", diary: "Diary", lab: "Lab", dictionary: "Dictionary", hanja: "Hanja", deep: "Deep dives", review: "Review", notebook: "Notebook", settings: "Settings", more: "More" })[view]} · A Guide to Becoming a Lost Soul in Seoul`;
    renderNotesPanel();
  }
  window.addEventListener("hashchange", route);

  /* ═════════ Backup: export / import ═════════ */
  const BACKUP_APP = "lost-soul-in-seoul";
  function serialize() { return { ...state, done: [...state.done], hanjaKnown: [...state.hanjaKnown] }; }
  function hasProgress() {
    return state.done.size || Object.keys(state.saved).length || Object.values(state.drafts).some(t => t && t.trim()) || state.notes.length || state.hanjaKnown.size;
  }
  function renderBackupStatus() {
    const el = $("#backupStatus");
    if (!el) return;
    if (state.lastBackup) {
      const days = Math.floor((Date.now() - state.lastBackup) / DAY);
      el.textContent = `Last backup: ${new Date(state.lastBackup).toLocaleDateString()}${days >= 14 && hasProgress() ? ". It's been a while, so it's worth downloading a new one." : "."}`;
    } else {
      el.textContent = hasProgress()
        ? "No backup yet. Clearing browser data or switching devices would lose your progress, so download a backup now and then."
        : "Download a backup to keep your progress safe or move it to another device.";
    }
  }
  function exportData() {
    state.lastBackup = Date.now();
    const payload = { app: BACKUP_APP, version: 2, exportedAt: new Date(state.lastBackup).toISOString(), data: serialize() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `lost-soul-in-seoul-backup-${todayKey()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    save();
    toast("Backup downloaded.");
  }
  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      let payload;
      try { payload = JSON.parse(reader.result); } catch { toast("That file isn't a backup from this app."); return; }
      const d = payload && payload.app === BACKUP_APP && payload.data;
      if (!d || !Array.isArray(d.done)) { toast("That file isn't a backup from this app."); return; }
      const when = payload.exportedAt ? new Date(payload.exportedAt).toLocaleDateString() : "an unknown date";
      if (!confirm(`Restore the backup from ${when}? It has ${d.done.length} completed lessons and ${Object.keys(d.saved || {}).length} saved words. Your current progress in this browser will be replaced.`)) return;
      const base = freshState();
      Object.assign(state, base, d, {
        done: new Set(d.done),
        hanjaKnown: new Set(d.hanjaKnown || []),
        saved: d.saved || {}, mistakes: d.mistakes || {}, drafts: d.drafts || {}, checks: d.checks || {},
        notes: Array.isArray(d.notes) ? d.notes : [], days: Array.isArray(d.days) ? d.days : [], diary: d.diary || {}, readDone: Array.isArray(d.readDone) ? d.readDone : []
      });
      $("#freeRoam").checked = !!state.freeRoam;
      save(); route();
      toast("Backup restored.");
    };
    reader.readAsText(file);
  }

  function updateBadges() {
    const n = dueWords().length + mistakeList().length;
    const b = $("#navReviewCount");
    b.hidden = n === 0; b.textContent = n;
    $("#topProgress").textContent = `${state.done.size} of ${totalLessons} lessons`;
    renderBackupStatus();
  }

  /* ═════════ Journey: hero + today ═════════ */
  function renderHeroButton() {
    const u = UNITS[currentUnit()];
    const btn = $("#heroStart");
    if (state.done.size === 0 && !state.startLevel) btn.textContent = `Start at ${u.placeEn}`;
    else if (state.done.size === totalLessons) btn.textContent = "Revisit the map";
    else btn.textContent = `Continue in ${u.placeEn}`;
  }

  function renderToday() {
    renderHeroButton();
    const ci = currentUnit(), u = UNITS[ci], lv = LEVELS[u.level];
    const done = unitDoneCount(ci), total = unitTotal(ci);
    const p = PROVERBS[Math.floor(Date.now() / DAY) % PROVERBS.length];
    const s = streak();
    const due = dueWords().length, mis = mistakeList().length;
    $("#today").innerHTML = `
      <div class="today-inner">
        <button class="today-continue" type="button" data-open-unit="${ci}" style="--lv:${lv.color}">
          <span class="today-label">Continue</span>
          <span class="today-place"><span lang="ko">${esc(u.place)}</span> ${esc(u.placeEn)}</span>
          <span class="today-meta">${esc(u.title)}</span>
          <span class="mini-bar"><span style="width:${(done / total) * 100}%"></span></span>
        </button>
        <div class="today-stat">
          <span class="today-label">Streak</span>
          <span class="today-num">${s}</span>
          <span class="today-meta">${s === 1 ? "day" : "days"} in a row</span>
        </div>
        <a class="today-stat today-link" href="#/review">
          <span class="today-label">To review</span>
          <span class="today-num">${due + mis}</span>
          <span class="today-meta">${due} ${due === 1 ? "word" : "words"}, ${mis} ${mis === 1 ? "question" : "questions"}</span>
        </a>
        <div class="today-proverb">
          <span class="today-label" lang="ko">${p[2] ? "오늘의 사자성어" : "오늘의 속담"}</span>
          <p class="proverb-ko" lang="ko">${esc(p[0])}${p[2] ? `<span class="proverb-hj">${idiomHanja(p[2])}</span>` : ""} ${speakBtn(p[0])}</p>
          <p class="proverb-en">${esc(p[1])}</p>
        </div>
      </div>`;
    $("[data-open-unit]", $("#today")).addEventListener("click", () => openUnit(ci));
  }

  // link characters that are in the Hanja course
  function idiomHanja(hj) {
    return [...hj].map(c => {
      const i = HANJA.findIndex(h => h[0] === c);
      return i >= 0 && hanjaFree(i) ? `<a href="#/hanja?c=${encodeURIComponent(c)}" title="${HANJA[i][1]} ${HANJA[i][2]}">${c}</a>` : c;
    }).join("");
  }

  /* ═════════ Journey: legend + map ═════════ */
  function renderLegend() {
    $("#legend").innerHTML = Object.entries(LEVELS).map(([code, lv]) => `
      <li><span class="lv-dot" style="background:${lv.color}"></span><span class="lv-code">${code}</span><span class="lv-ko" lang="ko">${lv.ko}</span><span class="lv-en">${lv.en}</span></li>`).join("");
  }

  const RIVER = [{ x: -40, y: 398 }, { x: 140, y: 418 }, { x: 320, y: 468 }, { x: 470, y: 484 }, { x: 640, y: 474 }, { x: 790, y: 458 }, { x: 910, y: 474 }, { x: 1040, y: 506 }];

  function segment(pts, i, tension = 6) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / tension, c1y = p1.y + (p2.y - p0.y) / tension;
    const c2x = p2.x - (p3.x - p1.x) / tension, c2y = p2.y - (p3.y - p1.y) / tension;
    return { m: `M${p1.x},${p1.y}`, c: ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x},${p2.y}` };
  }
  function smoothPath(pts, tension = 6) {
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) d += segment(pts, i, tension).c;
    return d;
  }

  // An illustrated, quiet map: paper, a watercolour river, soft hills, no roads.
  function renderMap() {
    const svg = $("#mapSvg");
    svg.innerHTML = "";
    const defs = svgEl("defs", {}, svg);
    const rg = svgEl("linearGradient", { id: "riverGrad", x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
    svgEl("stop", { offset: "0", "stop-color": "#DCE9F7" }, rg);
    svgEl("stop", { offset: ".55", "stop-color": "#E9E3F6" }, rg);
    svgEl("stop", { offset: "1", "stop-color": "#F7E3EA" }, rg);
    const blur = svgEl("filter", { id: "soft", x: "-10%", y: "-10%", width: "120%", height: "120%" }, defs);
    svgEl("feGaussianBlur", { stdDeviation: 6 }, blur);

    svgEl("rect", { x: 0, y: 0, width: 1000, height: 700, fill: "var(--paper)" }, svg);
    [
      "M200,40 C250,10 330,20 360,60 C380,95 340,130 290,125 C240,120 180,90 200,40 Z",
      "M420,30 C470,0 560,10 580,45 C595,75 540,82 500,78 C455,74 400,62 420,30 Z",
      "M500,370 C530,340 600,345 625,375 C645,402 610,425 565,425 C520,425 480,400 500,370 Z",
      "M60,620 C110,580 220,590 240,640 C255,690 120,700 70,680 C40,668 40,640 60,620 Z",
      "M900,240 C940,220 990,240 1000,280 L1000,330 C960,340 900,320 890,290 C885,265 885,250 900,240 Z"
    ].forEach(d => svgEl("path", { d, fill: "var(--hill)", filter: "url(#soft)" }, svg));

    const riverD = smoothPath(RIVER, 5);
    svgEl("path", { d: riverD, fill: "none", stroke: "url(#riverGrad)", "stroke-width": 62, "stroke-linecap": "round", filter: "url(#soft)" }, svg);
    svgEl("path", { d: riverD, fill: "none", stroke: "url(#riverGrad)", "stroke-width": 44, "stroke-linecap": "round" }, svg);
    svgEl("ellipse", { cx: 318, cy: 467, rx: 66, ry: 13, fill: "var(--paper)", transform: "rotate(11 318 467)" }, svg);
    svgEl("text", { x: 640, y: 480, class: "m-river", "text-anchor": "middle" }, svg).textContent = "Han River · 한강";
    svgEl("text", { x: 500, y: 44, class: "m-deco", "text-anchor": "middle" }, svg).textContent = "북악산";
    const nm = MAP_LANDMARKS.namsan;
    svgEl("text", { x: nm.x + 44, y: nm.y + 22, class: "m-deco", "text-anchor": "middle" }, svg).textContent = nm.label;
    const tower = svgEl("g", { transform: `translate(${nm.x} ${nm.y})`, "aria-hidden": "true", class: "m-tower" }, svg);
    svgEl("path", { d: "M0,-62 V-8 M-6,-30 H6 M-4,-8 H4", stroke: "var(--ink-3)", "stroke-width": 1.4, "stroke-linecap": "round", fill: "none" }, tower);
    svgEl("circle", { cx: 0, cy: -30, r: 3.5, fill: "var(--paper)", stroke: "var(--ink-3)", "stroke-width": 1.2 }, tower);

    const pts = UNITS.map(u => ({ x: u.x, y: u.y }));
    svgEl("path", { d: smoothPath(pts), fill: "none", stroke: "var(--route)", "stroke-width": 1.4, "stroke-dasharray": "3 6", "stroke-linecap": "round" }, svg);
    for (let i = 0; i < UNITS.length - 1; i++) {
      if (!(unitComplete(i) || skipped(i))) break;
      const s = segment(pts, i);
      svgEl("path", { d: s.m + s.c, fill: "none", stroke: LEVELS[UNITS[i + 1].level].color, "stroke-width": 3, "stroke-linecap": "round", opacity: unitComplete(i) ? 1 : .45 }, svg);
    }
    const cur = currentUnit();
    UNITS.forEach((u, i) => drawNode(svg, u, i, i === cur && !unitComplete(i)));
  }

  function drawNode(svg, u, i, isCurrent) {
    const lv = LEVELS[u.level];
    const done = unitDoneCount(i), total = unitTotal(i), complete = done === total, unlocked = isUnlocked(i);
    const g = svgEl("g", {
      class: `node${unlocked ? "" : " locked"}${isCurrent ? " current" : ""}`,
      transform: `translate(${u.x} ${u.y})`, tabindex: 0, role: "link",
      "aria-label": `${u.placeEn} (${u.place}), ${u.level}: ${u.title}. ${done} of ${total} done.${unlocked ? "" : " Locked."}`
    }, svg);
    svgEl("circle", { class: "halo", r: 20, stroke: lv.color }, g);
    svgEl("circle", { class: "focus-ring", r: 28 }, g);
    const R = 22, C = 2 * Math.PI * R;
    if (done > 0 && !complete) svgEl("circle", { class: "ring", r: R, stroke: lv.color, "stroke-dasharray": C.toFixed(1), "stroke-dashoffset": (C * (1 - done / total)).toFixed(1), transform: "rotate(-90)" }, g);
    svgEl("circle", { class: "core", r: 17, fill: !unlocked ? "var(--paper)" : complete ? lv.color : "#fff", stroke: !unlocked ? "var(--line-strong)" : lv.color }, g);
    if (complete) svgEl("path", { d: "M-6,0 L-1.5,4.5 L6.5,-5", fill: "none", stroke: "#fff", "stroke-width": 2.4, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
    else if (!unlocked) {
      svgEl("rect", { x: -5, y: -1.5, width: 10, height: 7.5, rx: 1.5, fill: "var(--ink-3)" }, g);
      svgEl("path", { d: "M-3,-1.5 v-2.5 a3,3 0 0 1 6,0 v2.5", fill: "none", stroke: "var(--ink-3)", "stroke-width": 1.6 }, g);
    } else svgEl("text", { class: "m-num", y: 5, "text-anchor": "middle" }, g).textContent = pad2(i + 1);
    const ko = svgEl("text", { class: "m-place-ko", y: 42, "text-anchor": "middle" }, g); ko.textContent = u.place;
    const en = svgEl("text", { class: "m-place-en", y: 57, "text-anchor": "middle" }, g); en.textContent = u.placeEn.toUpperCase();
    [ko, en].forEach(t => { t.setAttribute("paint-order", "stroke"); t.setAttribute("stroke", "var(--paper)"); t.setAttribute("stroke-width", "5"); t.setAttribute("stroke-linejoin", "round"); });

    const activate = () => {
      if (!isUnlocked(i)) { toast(`Finish ${UNITS[i - 1].placeEn} first, or turn on “Unlock all places”.`); return; }
      openUnit(i);
    };
    g.addEventListener("click", activate);
    g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); } });
  }

  /* ═════════ Drawer ═════════ */
  const drawer = $("#drawer"), scrim = $("#scrim"), body = $("#drawerBody");
  let lastFocus = null;

  function openDrawer(trigger) {
    if (!drawer.classList.contains("open")) {
      lastFocus = trigger || document.activeElement;
      scrim.hidden = false;
      requestAnimationFrame(() => scrim.classList.add("show"));
      drawer.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    body.scrollTop = 0;
    drawer.focus({ preventScroll: true });
  }
  function closeDrawer(silent) {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    scrim.classList.remove("show");
    document.body.style.overflow = "";
    setTimeout(() => { scrim.hidden = true; }, 250);
    if (silent === true) return;
    refreshCurrentView();
    if (lastFocus) {
      const idx = lastFocus.__unitIndex;
      const nodes = $$("#mapSvg .node");
      const target = Number.isInteger(idx) && nodes[idx] ? nodes[idx] : lastFocus;
      if (document.contains(target)) target.focus?.({ preventScroll: true });
    }
  }
  function refreshCurrentView() {
    const v = $$(".view").find(x => !x.hidden)?.dataset.view;
    if (v === "journey") { renderToday(); renderMap(); }
    if (v === "review") renderReview(new URLSearchParams());
    if (v === "hanja") renderHanja(new URLSearchParams());
    if (v === "notebook") renderNotebook(new URLSearchParams());
  }
  scrim.addEventListener("click", () => closeDrawer());
  document.addEventListener("keydown", e => { if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer(); });

  const closeBtn = `<button class="icon-btn" type="button" data-act="close" aria-label="Close"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>`;
  const backBtn = label => `<button class="back-btn" type="button" data-act="back"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${label}</span></button>`;
  function wireClose() { body.querySelector('[data-act="close"]')?.addEventListener("click", () => closeDrawer()); }
  const dHead = (chip, title, extra = "") => `<div class="d-head" style="--tint:var(--mist)"><div class="d-toprow"><span class="level-chip">${chip}</span>${closeBtn}</div>${title ? `<h2 class="l-title" id="drawerTitle">${title}</h2>` : ""}${extra}</div>`;

  /* ═════════ Place: a unit and its lessons, in the main view ═════════
     #/place/<unitId>        the unit's front page
     #/place/<unitId>/<j>    lesson j                                       */
  const placeHref = (i, j) => `#/place/${UNITS[i].id}${j != null ? "/" + j : ""}`;
  function openUnit(i) { location.hash = placeHref(i); }
  function openLesson(i, j) { location.hash = placeHref(i, j); }
  const pad2 = n => String(n).padStart(2, "0");
  const arrowL = `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const arrowR = `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const lockIcon = `<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;

  function renderPlace(id, jRaw) {
    const i = UNITS.findIndex(u => u.id === id);
    if (i < 0) { location.replace("#/"); return; }
    if (!isUnlocked(i)) {
      toast(`Finish ${UNITS[i - 1].placeEn} first, or turn on “Unlock all places”.`);
      location.replace("#/"); return;
    }
    const u = UNITS[i], lv = LEVELS[u.level];
    const j = jRaw == null || jRaw === "" || isNaN(Number(jRaw)) ? null : Math.min(Number(jRaw), u.lessons.length - 1);
    const done = unitDoneCount(i), total = unitTotal(i);
    const prev = i > 0 ? UNITS[i - 1] : null, next = UNITS[i + 1] || null;
    const deep = DEEP_DIVES.filter(d => d.places.includes(u.id));
    const wide = matchMedia("(min-width: 960px)").matches;

    $("#placeBody").innerHTML = `
      <div class="place" style="--lv:${lv.color};--lv-soft:${tint(lv.color, .14)};--lv-mid:${tint(lv.color, .35)}">
        <nav class="place-bar" aria-label="Places">
          <a class="back-link" href="#/">${arrowL}<span>Choose another place</span></a>
          <div class="place-steps">
            ${prev && isUnlocked(i - 1) ? `<a href="${placeHref(i - 1)}" class="step-link">${arrowL}<span lang="ko">${esc(prev.place)}</span></a>` : ""}
            ${next && isUnlocked(i + 1) ? `<a href="${placeHref(i + 1)}" class="step-link"><span lang="ko">${esc(next.place)}</span>${arrowR}</a>` : ""}
          </div>
        </nav>

        <header class="place-head">
          <p class="kicker">No. ${pad2(i + 1)} <span class="kicker-sep"></span> ${u.level} <span lang="ko">${lv.ko}</span> · ${lv.en}</p>
          <h1 class="place-name"><span lang="ko">${esc(u.place)}</span> <em>${esc(u.placeEn)}</em></h1>
          <p class="place-title">${esc(u.title)} <span class="place-title-ko" lang="ko">${esc(u.titleKo)}</span></p>
          <p class="lede">${esc(u.blurb)}</p>
          <div class="place-progress"><div class="bar"><span style="width:${(done / total) * 100}%"></span></div><span>${done} of ${total} done</span></div>
        </header>

        <div class="place-grid">
          <aside class="place-side">
            <details class="toc" ${j === null || wide ? "open" : ""}>
              <summary>Lessons in this place</summary>
              <ol class="toc-list">
                ${u.lessons.map((l, k) => {
                  const isDone = state.done.has(lessonId(i, k)), mission = l.kind === "mission";
                  return `<li><a href="${placeHref(i, k)}" class="toc-item${isDone ? " done" : ""}${mission ? " mission" : ""}" ${k === j ? 'aria-current="page"' : ""}>
                    <span class="toc-n" aria-hidden="true">${isDone ? "✓" : mission ? "★" : pad2(k + 1)}</span>
                    <span class="toc-t">${mission ? "Mission: " : ""}${esc(l.t)}<span class="toc-k" lang="ko">${esc(l.k)}</span></span>
                  </a></li>`;
                }).join("")}
              </ol>
            </details>
            ${u.fact ? `<aside class="fact"><p class="fact-label" lang="ko">알고 있었나요?</p><p>${esc(u.fact)}</p></aside>` : ""}
            ${READINGS.filter(x => x.unit === u.id).map(x => `<div class="side-block"><p class="side-label">Read</p><a class="deep-mini" href="#/reading/${x.id}"><span class="deep-mini-t">${esc(x.title)}</span><span class="deep-mini-k" lang="ko">${esc(x.titleKo)} · ${esc(x.type)}</span></a></div>`).join("")}
            ${deep.length ? `<div class="side-block"><p class="side-label">Deep dives</p>${deep.map(d => `<a class="deep-mini" href="#/deep/${d.id}"><span class="deep-mini-t">${esc(d.title)}</span><span class="deep-mini-k" lang="ko">${esc(d.titleKo)}</span>${ACCESS.premium ? "" : `<span class="deep-lock">${lockIcon} Premium</span>`}</a>`).join("")}</div>` : ""}
          </aside>

          <article class="lesson" id="lessonArea">${j === null ? unitIntroHTML(i) : lessonHTML(i, j)}</article>
        </div>
      </div>`;

    if (j === null) {
      $("#startUnit")?.addEventListener("click", () => openLesson(i, Math.max(0, u.lessons.findIndex((_, k) => !state.done.has(lessonId(i, k))))));
    } else wireLesson(i, j);
  }

  function unitIntroHTML(i) {
    const u = UNITS[i];
    const firstOpen = u.lessons.findIndex((_, k) => !state.done.has(lessonId(i, k)));
    return `
      <p class="kicker">In this place</p>
      <h2 class="lesson-title">${u.lessons.filter(l => l.kind !== "mission").length} lessons and a mission</h2>
      <ol class="intro-list">
        ${u.lessons.map((l, k) => `<li><a href="${placeHref(i, k)}"><span class="intro-n">${l.kind === "mission" ? "★" : pad2(k + 1)}</span><span class="intro-t">${l.kind === "mission" ? "Mission: " : ""}${esc(l.t)}<span lang="ko">${esc(l.k)}</span></span><span class="intro-s">${state.done.has(lessonId(i, k)) ? "Done" : ""}</span></a></li>`).join("")}
      </ol>
      <div class="lesson-actions static">
        <button class="btn btn-primary" id="startUnit" type="button">${firstOpen === -1 ? "Review from the start" : firstOpen === 0 ? "Start the first lesson" : `Continue with lesson ${firstOpen + 1}`}</button>
      </div>`;
  }

  function lessonHTML(i, j) {
    const u = UNITS[i], l = u.lessons[j];
    const id = lessonId(i, j), isDone = state.done.has(id), mission = l.kind === "mission";
    const nextL = u.lessons[j + 1], nextU = UNITS[i + 1];
    const qs = mission ? [] : questionsFor(i, j);
    const nLessons = u.lessons.filter(x => x.kind !== "mission").length;
    const checks = state.checks[id] || [];
    const labLink = (u.id === "gwanghwamun" && j < 4) ? ["#/lab?tool=fonts", "See how the letters look in different typefaces"]
      : (u.id === "insadong" && j < 3) ? ["#/lab?tool=spell", "Check your own writing for common mistakes"]
      : (u.id === "hongdae" || u.id === "seochon" || (u.id === "insadong" && j === 3)) ? ["#/lab", "Try any word in the pronunciation lab"]
      : (u.id === "jamsil" || u.id === "yeouido") ? ["#/lab?tool=conj", "Conjugate any verb in the lab"]
      : (u.id === "gangnam" && j === 0) ? ["#/lab?tool=num", "Read any number in the lab"]
      : (u.id === "jongno" && j === 3) ? ["#/hanja", "Learn the characters in the Hanja course"] : null;
    return `
      <p class="kicker">${mission ? "Mission" : `Lesson ${j + 1} of ${nLessons}`}</p>
      <h2 class="lesson-title">${esc(l.t)}</h2>
      <p class="lesson-term" lang="ko">${esc(l.k)}</p>
      <p class="lesson-lead">${esc(l.s)}</p>

      <section class="lesson-block">
        <h3 class="block-h">${mission ? "Checklist" : "Key ideas"}</h3>
        ${mission
          ? `<ul class="checklist" lang="ko">${l.p.map((p, k) => `<li><label><input type="checkbox" data-check="${k}" ${checks[k] ? "checked" : ""}/><span>${esc(p)}</span></label></li>`).join("")}</ul>`
          : `<ol class="key-ideas" lang="ko">${l.p.map(p => `<li>${esc(p)}</li>`).join("")}</ol>`}
        ${l.table ? `<div class="table-wrap lesson-table"><table class="deep-table"><thead><tr>${l.table.head.map(x => `<th scope="col">${esc(x)}</th>`).join("")}</tr></thead><tbody>${l.table.rows.map(row => `<tr>${row.map((c, ci) => ci === 0 ? `<th scope="row">${esc(c)}</th>` : `<td lang="ko">${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : ""}
      </section>

      <section class="lesson-block">
        <h3 class="block-h">${mission ? "Useful expressions" : "Examples"}</h3>
        <div class="examples" lang="ko">${l.ex.map(x => `<p class="example"><span>${esc(x)}</span>${speakBtn(x)}</p>`).join("")}</div>
      </section>

      ${mission ? `
      <section class="lesson-block">
        <h3 class="block-h"><label for="draft">Your turn</label></h3>
        <textarea id="draft" class="draft" lang="ko" rows="8" placeholder="여기에 써 보세요…">${esc(state.drafts[id] || "")}</textarea>
        <p class="draft-meta"><span id="draftCount"></span> Saved as you type. It's also in your Notebook.</p>
        <button type="button" class="btn btn-small btn-ghost" id="checkDraft">Check common mistakes</button>
        <div class="tool-out" id="draftCheck" aria-live="polite"></div>
      </section>` : ""}

      ${qs.length ? `
      <section class="lesson-block">
        <div class="practice-head"><h3 class="block-h">Practice</h3><span class="score" id="score"></span></div>
        <div class="qlist">${qs.map((q, k) => questionHTML(q, k + 1)).join("")}</div>
      </section>` : ""}

      ${labLink ? `<p class="lab-link-wrap"><a class="lab-link" href="${labLink[0]}">${labLink[1]} ${arrowR}</a></p>` : ""}

      <div class="lesson-actions">
        <button class="btn ${isDone ? "btn-done" : "btn-primary"}" type="button" data-act="toggle">${isDone ? "Done ✓ Mark as not done" : "Mark as done"}</button>
        ${nextL ? `<a class="btn btn-ghost" href="${placeHref(i, j + 1)}">Next: ${esc(nextL.t)}</a>`
          : nextU && (unitComplete(i) || isUnlocked(i + 1)) ? `<a class="btn btn-ghost" href="${placeHref(i + 1)}">On to <span lang="ko">${esc(nextU.place)}</span></a>`
          : `<a class="btn btn-ghost" href="#/">Back to the map</a>`}
      </div>`;
  }

  function wireLesson(i, j) {
    const root = $("#placeBody");
    const u = UNITS[i], l = u.lessons[j], id = lessonId(i, j), mission = l.kind === "mission";
    root.querySelector('[data-act="toggle"]').addEventListener("click", () => {
      const was = unitComplete(i);
      if (state.done.has(id)) state.done.delete(id); else { state.done.add(id); markActive(); }
      save();
      if (!was && unitComplete(i)) {
        const nu = UNITS[i + 1];
        toast(nu ? `${u.placeEn} complete. ${nu.placeEn} is open.` : `${u.placeEn} complete. You've crossed the whole city.`);
      }
      const y = window.scrollY;
      renderPlace(u.id, j);
      window.scrollTo(0, y);
    });
    if (mission) {
      const ta = $("#draft"), cnt = $("#draftCount");
      const count = () => { const n = (ta.value.match(/[가-힣]/g) || []).length; cnt.textContent = `${n} Korean ${n === 1 ? "syllable" : "syllables"}.`; };
      count();
      let t;
      ta.addEventListener("input", () => { count(); clearTimeout(t); t = setTimeout(() => { state.drafts[id] = ta.value; if (ta.value.trim()) markActive(); save(); }, 400); });
      $("#checkDraft").addEventListener("click", () => { $("#draftCheck").innerHTML = spellHTML(ta.value); });
      $$("[data-check]", root).forEach(c => c.addEventListener("change", () => {
        const arr = state.checks[id] || []; arr[Number(c.dataset.check)] = c.checked; state.checks[id] = arr; save();
      }));
    }
    const qs = mission ? [] : questionsFor(i, j);
    if (qs.length) {
      let right = 0, answered = 0;
      wireQuestions(root, qs, (q, ok) => {
        recordResult(q, ok);
        if (q.type === "order" && !ok) return;
        answered++; if (ok) right++;
        $("#score").textContent = `${right} of ${qs.length} correct`;
        if (answered === qs.length && right === qs.length && !state.done.has(id)) toast("All correct. Mark the lesson as done when you're ready.");
      });
    }
  }

  /* ═════════ Questions: build from practice data ═════════ */
  const qCache = {};
  function questionsFor(u, j) {
    const id = lessonId(u, j);
    if (qCache[id]) return qCache[id];
    const out = [];
    (PRACTICE[id] || []).forEach(item => {
      if (Array.isArray(item)) out.push({ type: "mc", q: item[0], o: item[1], a: item[2], why: item[3] });
      else if (item.order) out.push({ type: "order", q: item.q, order: item.order, why: item.why });
      else if (item.drill === "pron") item.words.forEach(w => out.push(pronQuestion(w)));
      else if (item.drill === "conj") item.words.forEach(w => out.push(conjQuestion(w, item.form)));
      else if (item.drill === "num") item.items.forEach(n => out.push(numQuestion(n)));
    });
    out.forEach((q, k) => { q.id = `${id}#${k}`; q.src = id; });
    return (qCache[id] = out);
  }

  const SWAP_CHO = { "ㄱ":["ㄲ","ㅋ"],"ㄲ":["ㄱ"],"ㅋ":["ㄱ"],"ㄷ":["ㄸ","ㅌ"],"ㄸ":["ㄷ"],"ㅌ":["ㄷ"],"ㅂ":["ㅃ","ㅍ"],"ㅃ":["ㅂ"],"ㅍ":["ㅂ"],"ㅈ":["ㅉ","ㅊ"],"ㅉ":["ㅈ"],"ㅊ":["ㅈ"],"ㅅ":["ㅆ"],"ㅆ":["ㅅ"],"ㄴ":["ㄹ"],"ㄹ":["ㄴ"] };
  const SWAP_JONG = { "ㅇ":["ㄱ"],"ㄱ":["ㅇ"],"ㄴ":["ㄷ","ㄹ"],"ㄷ":["ㄴ","ㅅ"],"ㅁ":["ㅂ"],"ㅂ":["ㅁ"],"ㄹ":["ㄴ"] };
  function mutate(text) {
    const chars = [...text];
    const idx = chars.map((c, i) => K.isSyl(c) ? i : -1).filter(i => i >= 0);
    if (!idx.length) return null;
    const i = idx[Math.floor(Math.random() * idx.length)];
    const d = K.decompose(chars[i]);
    if (Math.random() < .5 && SWAP_CHO[d.cho] && !(d.cho === "ㄴ" && i === 0)) {
      const o = SWAP_CHO[d.cho]; d.cho = o[Math.floor(Math.random() * o.length)];
    } else if (d.jong && SWAP_JONG[d.jong]) {
      const o = SWAP_JONG[d.jong]; d.jong = o[Math.floor(Math.random() * o.length)];
    } else return null;
    chars[i] = K.compose(d.cho, d.jung, d.jong);
    return chars.join("");
  }
  function pronQuestion(word) {
    const res = K.pronounce(word);
    const correct = `[${res.text}]`;
    const cands = new Set();
    if (word !== res.text) cands.add(`[${word}]`);
    for (let t = 0; t < 80 && cands.size < 6; t++) {
      const m = mutate(res.text);
      if (m && m !== res.text) cands.add(`[${m}]`);
    }
    cands.delete(correct);
    const pool = [...cands];
    const first = pool[0] === `[${word}]` ? [pool.shift()] : [];
    const opts = shuffle([correct, ...first, ...shuffle(pool).slice(0, 3 - first.length)]);
    const rules = res.rules.map(r => K.RULES[r]?.ko).filter(Boolean);
    return { type: "mc", prompt: word, q: `How is ${word} pronounced?`, o: opts, a: opts.indexOf(correct),
      why: rules.length ? `${word} → ${correct}: ${rules.join(", ")}.` : `${word} is pronounced as written.` };
  }
  function conjQuestion(word, form) {
    const correct = K.conjugate(word, form);
    const stem = word.slice(0, -1);
    const raw = { haeyo: ["어요", "아요"], past: ["었어요", "았어요"], seyo: ["으세요", "세요"], nikka: ["으니까", "니까"], myeon: ["으면", "면"] }[form] || ["어요", "아요"];
    const cands = new Set([K.conjugate(word, form, { regular: true }), stem + raw[0], stem + raw[1], K.conjugate(word, form === "past" ? "haeyo" : "past")]);
    cands.delete(correct); cands.delete(null);
    const pool = [...cands];
    const reg = K.conjugate(word, form, { regular: true });
    const first = reg !== correct ? [reg] : [];
    const rest = shuffle(pool.filter(x => x !== reg)).slice(0, 3 - first.length);
    const opts = shuffle([correct, ...first, ...rest]);
    const type = K.irregularType(word);
    const label = type ? (type.includes("탈락") ? type : `${type} 불규칙`) : "regular";
    return { type: "mc", prompt: word, q: `${word} → ${K.FORMS[form].ko} (${K.FORMS[form].en})`, o: opts, a: opts.indexOf(correct), why: `${word} → ${correct} (${label}).` };
  }
  function numQuestion([kind, a, b]) {
    let q, correct, cands;
    if (kind === "time") {
      q = `How do you read ${a}:${String(b).padStart(2, "0")}?`;
      correct = K.readTime(a, b);
      cands = [`${K.readSino(a)} 시 ${K.readSino(b)} 분`, `${K.readNative(a, true)} 시 ${K.readNative(b, true)} 분`, `${K.readSino(a)} 시 ${K.readNative(b, true)} 분`];
    } else if (kind === "price") {
      q = `How do you read ₩${a.toLocaleString("en-US")}?`;
      correct = K.readPrice(a);
      cands = [/^[만천백십]/.test(correct) ? `일${correct}` : K.readPrice(a + 1000), K.readPrice(a * 10), K.readPrice(a / 10)];
    } else {
      q = `How do you say month ${a}?`;
      correct = K.readMonth(a);
      cands = [`${K.readSino(a)}월`, `${K.readNative(a)}월`, `${K.readNative(a, true)}월`];
    }
    cands = [...new Set(cands.map(c => c.trim()))].filter(c => c && c !== correct);
    const opts = shuffle([correct, ...cands.slice(0, 3)]);
    return { type: "mc", prompt: correct, q, o: opts, a: opts.indexOf(correct), why: `${correct}.` };
  }

  /* ═════════ Question UI ═════════ */
  function questionHTML(q, n) {
    const num = n ? `<span class="q-n">${n}</span>` : "";
    if (q.type === "order") {
      return `<div class="qcard" data-qid="${esc(q.id)}">
        <p class="q-text">${num}<span>${esc(q.q)}</span></p>
        <p class="order-answer" lang="ko" aria-live="polite"></p>
        <div class="chips" lang="ko">${shuffle(q.order).map(w => `<button type="button" class="chip" data-word="${esc(w)}">${esc(w)}</button>`).join("")}</div>
        <div class="q-tools"><button type="button" class="link-btn" data-act="reset-order">Start over</button></div>
        <p class="q-feedback" aria-live="polite"></p>
      </div>`;
    }
    return `<div class="qcard" data-qid="${esc(q.id)}">
      <p class="q-text">${num}<span>${esc(q.q)}</span>${q.prompt ? speakBtn(q.prompt) : ""}</p>
      <div class="options" role="group">${q.o.map((o, k) => `<button type="button" class="option" data-k="${k}" ${/[가-힣ㄱ-ㅣ]/.test(o) ? 'lang="ko"' : ""}>${esc(o)}</button>`).join("")}</div>
      <p class="q-feedback" aria-live="polite"></p>
    </div>`;
  }
  function wireQuestions(root, list, onResult) {
    list.forEach(q => {
      const card = root.querySelector(`[data-qid="${CSS.escape(q.id)}"]`);
      if (!card) return;
      const fb = card.querySelector(".q-feedback");
      const finish = ok => {
        card.classList.add(ok ? "is-right" : "is-wrong");
        fb.innerHTML = `<strong>${ok ? "Correct." : "Not quite."}</strong> ${esc(q.why || "")}` +
          (!ok && !q.fromReview && !String(q.id).startsWith("place#") ? `<span class="q-saved">Saved to <a href="#/review?tab=mistakes">Review → Mistakes</a>. Try it again there in a day or two.</span>` : "");
        markActive();
        onResult && onResult(q, ok);
      };
      if (q.type === "order") {
        const ans = card.querySelector(".order-answer");
        const picked = [];
        card.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
          if (card.classList.contains("is-right") || c.disabled) return;
          picked.push(c.dataset.word); c.disabled = true;
          ans.textContent = picked.join(" ");
          if (picked.length === q.order.length) finish(picked.join(" ") === q.order.join(" "));
        }));
        card.querySelector('[data-act="reset-order"]').addEventListener("click", () => {
          picked.length = 0; ans.textContent = ""; fb.textContent = "";
          card.classList.remove("is-right", "is-wrong");
          card.querySelectorAll(".chip").forEach(c => { c.disabled = false; });
        });
        return;
      }
      card.querySelectorAll(".option").forEach(btn => btn.addEventListener("click", () => {
        if (card.classList.contains("answered")) return;
        card.classList.add("answered");
        const ok = Number(btn.dataset.k) === q.a;
        btn.classList.add(ok ? "right" : "wrong");
        card.querySelector(`.option[data-k="${q.a}"]`).classList.add("right");
        finish(ok);
      }));
    });
  }
  function recordResult(q, ok) {
    if (!ok) state.mistakes[q.id] = { id: q.id, type: q.type, q: q.q, o: q.o, a: q.a, order: q.order, why: q.why, prompt: q.prompt, src: q.src, at: Date.now() };
    save();
  }

  /* ═════════ Placement test ═════════ */
  function openPlacement(trigger) {
    const levels = Object.keys(PLACEMENT); // A0..C2
    const per = PLACEMENT[levels[0]].length;
    const total = levels.length * per;
    let level = 0, qi = 0, right = 0, asked = 0;
    const start = () => {
      body.innerHTML = `${dHead("Placement", "Find your starting level")}
        <div class="d-section">
          <p class="l-summary">Five questions per level, from sounds to style. Get four right and you move up. The first level that feels hard is where you start.</p>
          <p class="l-summary spaced">First, can you read this?</p>
          <p class="big-ko" lang="ko">서울에서 길을 잃는 법</p>
          <div class="stack">
            <button class="btn btn-primary" type="button" data-a="yes">Yes, I can read Hangul</button>
            <button class="btn btn-quiet" type="button" data-a="no">Not yet</button>
          </div>
        </div>`;
      wireClose();
      body.querySelector('[data-a="no"]').addEventListener("click", () => result("A0", true));
      body.querySelector('[data-a="yes"]').addEventListener("click", ask);
    };
    const ask = () => {
      const code = levels[level], item = PLACEMENT[code][qi];
      const q = { id: `place#${code}#${qi}`, type: "mc", q: item[0], o: item[1], a: item[2] };
      body.innerHTML = `${dHead("Placement", `Question ${asked + 1}`)}
        <div class="d-section"><div class="mini-bar wide"><span style="width:${((level * per + qi) / total) * 100}%"></span></div>
          <p class="place-level"><span class="dot" style="background:${LEVELS[code].color}"></span>${code} <span lang="ko">${LEVELS[code].ko}</span></p></div>
        <div class="d-section">${questionHTML(q)}</div>
        <div class="d-section"><button type="button" class="link-btn" data-a="stop">This is getting hard. Stop here.</button></div>`;
      wireClose();
      body.querySelector('[data-a="stop"]').addEventListener("click", () => result(code));
      $$(".option", body).forEach(b => b.addEventListener("click", () => {
        if (Number(b.dataset.k) === q.a) right++;
        qi++; asked++;
        if (qi === PLACEMENT[code].length) {
          if (right >= 4 && level < levels.length - 1) { level++; qi = 0; right = 0; return ask(); }
          return result(code, false, right >= 4);
        }
        ask();
      }));
    };
    const result = (code, noHangul, passedAll) => {
      const ui = UNITS.findIndex(u => u.level === code), u = UNITS[ui], lv = LEVELS[code];
      const note = noHangul ? "Start with the alphabet itself. It takes most people a few hours, not weeks."
        : passedAll ? "You passed every level. Start with the final units, or open any neighborhood you like."
        : code === "A0" ? "You can read Hangul. Start here to learn why words sound different from how they're spelled."
        : "Earlier neighborhoods stay open so you can drop in any time.";
      body.innerHTML = `${dHead("Placement", "Your starting point")}
        <div class="d-section">
          <p class="result-level"><span class="lv-code" style="background:${lv.color}">${code}</span> <span lang="ko">${lv.ko}</span> ${lv.en}</p>
          <p class="l-summary">Start in <strong lang="ko">${esc(u.place)}</strong> (${esc(u.placeEn)}): ${esc(u.title)}. ${note}</p>
          <div class="stack"><button class="btn btn-primary" type="button" data-a="go">Start in ${esc(u.placeEn)}</button></div>
        </div>`;
      wireClose();
      body.querySelector('[data-a="go"]').addEventListener("click", () => {
        state.startLevel = code === "A0" ? null : code; markActive(); save();
        renderToday(); renderMap();
        openUnit(ui);
      });
    };
    start();
    openDrawer(trigger);
  }

  /* ═════════ Lab ═════════ */
  function renderLab(params) {
    const tool = params.get("tool");
    $("#labBody").innerHTML = `
      <section class="tool" id="tool-pron" aria-labelledby="tp">
        <h2 id="tp">Pronunciation and romanization <span class="tool-ko" lang="ko">발음 · 로마자</span></h2>
        <p class="tool-sub">Type a word or a short phrase. The lab applies the standard pronunciation rules (표준 발음법), names each one it used, and shows the word in three romanization systems.</p>
        <input id="pronIn" class="input-ko" lang="ko" type="text" value="국물이 맛있네요" autocomplete="off" aria-label="Korean word or phrase" />
        <div class="samples" lang="ko">${["같이", "신라", "축하해요", "꽃 위", "읽고", "독립문", "부산", "압구정", "김치", "희망"].map(w => `<button type="button" class="chip" data-sample="${w}">${w}</button>`).join("")}</div>
        <div class="tool-out" id="pronOut" aria-live="polite"></div>
      </section>
      <section class="tool" id="tool-conj" aria-labelledby="tc">
        <h2 id="tc">Conjugation <span class="tool-ko" lang="ko">활용</span></h2>
        <p class="tool-sub">Type a verb or adjective in its dictionary form, ending in 다.</p>
        <input id="conjIn" class="input-ko" lang="ko" type="text" value="듣다" autocomplete="off" aria-label="Dictionary form" />
        <div class="samples" lang="ko">${["먹다", "가다", "하다", "돕다", "모르다", "하얗다", "살다", "쓰다", "짓다"].map(w => `<button type="button" class="chip" data-sample-c="${w}">${w}</button>`).join("")}</div>
        <div class="tool-out" id="conjOut" aria-live="polite"></div>
      </section>
      <section class="tool" id="tool-num" aria-labelledby="tn">
        <h2 id="tn">Numbers <span class="tool-ko" lang="ko">수</span></h2>
        <p class="tool-sub">See a number in both systems, as a price, and as a time.</p>
        <div class="field-row">
          <label class="field"><span>Number</span><input id="numIn" type="number" min="0" max="99999999" value="15000" /></label>
          <label class="field"><span>Time</span><input id="timeIn" type="time" value="15:30" /></label>
        </div>
        <div class="tool-out" id="numOut" aria-live="polite"></div>
      </section>
      <section class="tool" id="tool-spell" aria-labelledby="ts">
        <h2 id="ts">Common mistakes <span class="tool-ko" lang="ko">자주 틀리는 표기</span></h2>
        <p class="tool-sub">Paste a few sentences. The checker flags spellings that are always wrong, the ones learners and native speakers trip over most. It isn't a full spell checker, so a clean result doesn't mean the text is perfect.</p>
        <textarea id="spellIn" class="draft" lang="ko" rows="4" aria-label="Text to check">저는 학생예요. 내일 연락할께요. 몇일 후에 만날수있어요?</textarea>
        <div class="tool-out" id="spellOut" aria-live="polite"></div>
      </section>
      <section class="tool" id="tool-fonts" aria-labelledby="tf">
        <h2 id="tf">Letterforms <span class="tool-ko" lang="ko">글꼴</span></h2>
        <p class="tool-sub">The same letters can look quite different from one typeface to the next, and handwriting differs again. Type anything to compare.</p>
        <input id="fontIn" class="input-ko" lang="ko" type="text" value="다람쥐 헌 쳇바퀴에 타고파" autocomplete="off" aria-label="Sample text" />
        <div class="tool-out" id="fontOut"></div>
        <h3 class="sub-h small">Letters that change shape</h3>
        <ul class="glyph-notes">
          <li><span class="gn-l" lang="ko">ㅈ ㅊ</span><span>The top can be one zigzag stroke, like a 7 joined to ㅅ, or a flat bar above ㅅ. Both are the same letter.</span></li>
          <li><span class="gn-l" lang="ko">ㅊ ㅎ</span><span>The small stroke on top stands upright in some typefaces and lies flat in others.</span></li>
          <li><span class="gn-l" lang="ko">ㅇ</span><span>Serif (명조) typefaces often give ㅇ a small tick on top, left over from brush writing. It's still a plain ㅇ.</span></li>
          <li><span class="gn-l" lang="ko">ㅅ ㅈ</span><span>Next to a vertical vowel (시, 지) the right leg shortens and the letter leans; above a flat vowel (소, 조) it spreads out.</span></li>
          <li><span class="gn-l" lang="ko">받침</span><span>Letters shrink and flatten to fit the bottom of a block, so ㄹ in 닭 looks squashed next to ㄹ in 라.</span></li>
        </ul>
        <div class="table-wrap"><table class="glyph-table" id="glyphTable"></table></div>
      </section>`;

    const pronIn = $("#pronIn"), pronOut = $("#pronOut");
    const runPron = () => {
      const v = pronIn.value.trim();
      if (!/[가-힣]/.test(v)) { pronOut.innerHTML = `<p class="muted">The lab reads Hangul. Switch your keyboard to Korean, or tap an example.</p>`; return; }
      const r = K.pronounce(v);
      pronOut.innerHTML = `
        <div class="pron-result"><span class="pron-written" lang="ko">${esc(v)}</span><span class="pron-arrow" aria-hidden="true">→</span><span class="pron-said" lang="ko">[${esc(r.text)}]</span>${speakBtn(v)}</div>
        ${r.rules.length ? `<ul class="rule-list">${r.rules.map(k => { const R = K.RULES[k]; return `<li><span class="rule-ko" lang="ko">${R.ko}</span><span>${R.en}</span><span class="rule-ref" lang="ko">${R.ref}</span></li>`; }).join("")}</ul>` : `<p class="muted">Pronounced as written.</p>`}
        <dl class="rom-list">
          <div><dt>Revised Romanization</dt><dd>${esc(K.romanize(v, "rr"))}</dd><span class="muted">South Korea, 2000</span></div>
          <div><dt>McCune–Reischauer</dt><dd>${esc(K.romanize(v, "mr"))}</dd><span class="muted">1939, basis of North Korea's system</span></div>
          <div><dt>Yale</dt><dd>${esc(K.romanize(v, "yale"))}</dd><span class="muted">linguistics, spelling letter by letter</span></div>
        </dl>
        <p class="tool-note">The rules work from spelling. Compounds can add sounds the spelling doesn't show (ㄴ 첨가, 사잇소리). Common ones are listed by hand; for others, check 표준국어대사전.</p>`;
    };
    pronIn.addEventListener("input", runPron);
    $$("[data-sample]").forEach(b => b.addEventListener("click", () => { pronIn.value = b.dataset.sample; runPron(); }));
    runPron();

    const conjIn = $("#conjIn"), conjOut = $("#conjOut");
    const runConj = () => {
      const v = conjIn.value.trim();
      if (!/^[가-힣]+다$/.test(v)) { conjOut.innerHTML = `<p class="muted">Use the dictionary form, ending in 다: 먹다, 듣다, 예쁘다.</p>`; return; }
      const type = K.irregularType(v);
      const rows = Object.entries(K.FORMS).map(([f, info]) => {
        const out = K.conjugate(v, f);
        return `<tr><th scope="row" lang="ko">${info.ko}</th><td>${info.en}</td><td lang="ko" class="conj-form">${esc(out)}${speakBtn(out)}</td></tr>`;
      }).join("");
      conjOut.innerHTML = `
        <p class="conj-type">${type ? `<span lang="ko">${type.includes("탈락") ? type : type + " 불규칙"}</span>` : "Regular"}</p>
        <div class="table-wrap"><table class="conj-table"><thead><tr><th scope="col">Ending</th><th scope="col">Use</th><th scope="col">Form</th></tr></thead><tbody>${rows}</tbody></table></div>
        <p class="tool-note">Irregular verbs are recognized from a built-in list of common ones.</p>`;
    };
    conjIn.addEventListener("input", runConj);
    $$("[data-sample-c]").forEach(b => b.addEventListener("click", () => { conjIn.value = b.dataset.sampleC; runConj(); }));
    runConj();

    const numIn = $("#numIn"), timeIn = $("#timeIn"), numOut = $("#numOut");
    const runNum = () => {
      const n = Math.floor(Number(numIn.value));
      const [h, m] = (timeIn.value || "").split(":").map(Number);
      const ok = numIn.value !== "" && Number.isFinite(n) && n >= 0 && n <= 99999999;
      numOut.innerHTML = `<dl class="num-list">
        ${ok ? `<div><dt>Sino-Korean</dt><dd lang="ko">${K.readSino(n)}${speakBtn(K.readSino(n))}</dd></div>
        <div><dt>Native</dt><dd lang="ko">${n >= 1 && n <= 99 ? `${K.readNative(n)} <span class="muted">(before a counter: ${K.readNative(n, true)})</span>` : `<span class="muted">Native numbers go from 1 to 99.</span>`}</dd></div>
        <div><dt>As a price</dt><dd lang="ko">${K.readPrice(n)}</dd></div>` : `<div><dt>Number</dt><dd class="muted">Enter a whole number up to 99,999,999.</dd></div>`}
        ${Number.isFinite(h) && Number.isFinite(m) ? `<div><dt>Time</dt><dd lang="ko">${h < 12 ? "오전" : "오후"} ${K.readTime(h, m)}${speakBtn(K.readTime(h, m))}</dd></div>` : ""}
      </dl>`;
    };
    numIn.addEventListener("input", runNum); timeIn.addEventListener("input", runNum);
    runNum();

    const spellIn = $("#spellIn"), spellOut = $("#spellOut");
    const runSpell = () => { spellOut.innerHTML = spellHTML(spellIn.value); };
    spellIn.addEventListener("input", runSpell);
    runSpell();

    loadSpecimenFonts();
    const fontIn = $("#fontIn"), fontOut = $("#fontOut");
    const fonts = availableFonts();
    const runFonts = () => {
      const t = esc(fontIn.value || "다람쥐 헌 쳇바퀴에 타고파");
      fontOut.innerHTML = `<ul class="specimens">${fonts.map(f => `<li><p class="spec-meta"><span class="spec-cat" lang="ko">${f.cat}</span>${esc(f.name)}${f.system ? ` <span class="muted">(installed on this device)</span>` : ""}</p><p class="spec-text" lang="ko" style="font-family:${esc(f.css)}">${t}</p></li>`).join("")}</ul>`;
    };
    fontIn.addEventListener("input", runFonts);
    runFonts();
    const glyphs = ["ㅈ", "ㅊ", "ㅎ", "ㅇ", "시", "소", "차", "하", "닭"];
    $("#glyphTable").innerHTML = `<thead><tr><th scope="col">Typeface</th>${glyphs.map(g => `<th scope="col" lang="ko">${g}</th>`).join("")}</tr></thead>
      <tbody>${fonts.filter(f => f.glyphRow).map(f => `<tr><th scope="row"><span lang="ko">${f.cat}</span> <span class="muted">${esc(f.name)}</span></th>${glyphs.map(g => `<td lang="ko" style="font-family:${esc(f.css)}">${g}</td>`).join("")}</tr>`).join("")}</tbody>`;

    if (tool) requestAnimationFrame(() => $(`#tool-${tool}`)?.scrollIntoView({ block: "start" }));
  }

  /* ═════════ Spelling (common mistakes) ═════════ */
  function spellHTML(text) {
    if (!/[가-힣]/.test(text)) return `<p class="muted">Write or paste some Korean to check it.</p>`;
    const hits = K.checkSpelling(text);
    if (!hits.length) return `<p class="spell-ok">No common mistakes found.</p>`;
    let marked = "", last = 0;
    hits.forEach(h => { marked += esc(text.slice(last, h.index)) + `<mark>${esc(h.found)}</mark>`; last = h.index + h.found.length; });
    marked += esc(text.slice(last));
    return `<p class="spell-marked" lang="ko">${marked}</p>
      <ul class="spell-list">${hits.map(h => `<li><span lang="ko"><s>${esc(h.found)}</s> → <strong>${esc(h.fix)}</strong></span>${h.note ? `<span class="muted">${esc(h.note)}</span>` : ""}</li>`).join("")}</ul>`;
  }

  /* ═════════ Typefaces for the letterforms tool ═════════ */
  const WEB_FONTS = [
    { cat: "고딕", name: "Noto Sans KR", css: "'Noto Sans KR', sans-serif", glyphRow: true },
    { cat: "고딕", name: "Nanum Gothic", css: "'Nanum Gothic', sans-serif" },
    { cat: "명조", name: "Noto Serif KR", css: "'Noto Serif KR', serif", glyphRow: true },
    { cat: "명조", name: "Nanum Myeongjo", css: "'Nanum Myeongjo', serif" },
    { cat: "바탕", name: "Gowun Batang", css: "'Gowun Batang', serif" },
    { cat: "명조", name: "Hahmlet", css: "'Hahmlet', serif" },
    { cat: "손글씨", name: "Nanum Pen Script", css: "'Nanum Pen Script', cursive", glyphRow: true },
    { cat: "손글씨", name: "Gaegu", css: "'Gaegu', cursive", glyphRow: true },
    { cat: "붓글씨", name: "Nanum Brush Script", css: "'Nanum Brush Script', cursive", glyphRow: true },
    { cat: "제목용", name: "Black Han Sans", css: "'Black Han Sans', sans-serif" },
    { cat: "제목용", name: "Do Hyeon", css: "'Do Hyeon', sans-serif" }
  ];
  // Windows / macOS system fonts can't be shipped with the site; they're shown only if installed
  const SYSTEM_FONTS = [
    { cat: "굴림", name: "Gulim", local: "Gulim", glyphRow: true },
    { cat: "돋움", name: "Dotum", local: "Dotum" },
    { cat: "바탕", name: "Batang", local: "Batang", glyphRow: true },
    { cat: "궁서", name: "Gungsuh", local: "Gungsuh", glyphRow: true },
    { cat: "맑은 고딕", name: "Malgun Gothic", local: "Malgun Gothic" },
    { cat: "애플 고딕", name: "Apple SD Gothic Neo", local: "Apple SD Gothic Neo" },
    { cat: "애플 명조", name: "AppleMyungjo", local: "AppleMyungjo", glyphRow: true }
  ];
  let fontsLoaded = false;
  function loadSpecimenFonts() {
    if (fontsLoaded) return; fontsLoaded = true;
    const fams = ["Noto+Sans+KR:wght@400", "Noto+Serif+KR:wght@400", "Nanum+Gothic", "Nanum+Myeongjo", "Nanum+Pen+Script", "Gaegu", "Nanum+Brush+Script", "Black+Han+Sans", "Do+Hyeon", "Gowun+Batang"];
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${fams.map(f => "family=" + f).join("&")}&display=swap`;
    document.head.appendChild(link);
  }
  // A system font counts as installed if it measures differently from both generic fallbacks
  function hasLocalFont(name) {
    const c = document.createElement("canvas").getContext("2d");
    const sample = "가나다라마바사 한글 ㅈㅊㅎ";
    return ["monospace", "serif"].every(base => {
      c.font = `40px ${base}`; const w0 = c.measureText(sample).width;
      c.font = `40px "${name}", ${base}`; return c.measureText(sample).width !== w0;
    });
  }
  let fontList = null;
  function availableFonts() {
    if (fontList) return fontList;
    const sys = SYSTEM_FONTS.filter(f => hasLocalFont(f.local)).map(f => ({ ...f, css: `"${f.local}"`, system: true }));
    return (fontList = [...WEB_FONTS, ...sys]);
  }

  /* ═════════ Dictionary ═════════
     Two sources, searched together:
     - DICTIONARY (dictionary.js): curated core words with app levels and Hanja links
     - DICTIONARY_FULL (dictionary-full.js, built by tools/build-dictionary.mjs from
       한국어기초사전): every entry, loaded the first time the dictionary opens.
       Definitions and examples sit in dict-details/NN.js, loaded when an entry opens. */
  const chosung = w => [...w].map(c => K.isSyl(c) ? K.decompose(c).cho : c).join("");
  const isJamoOnly = q => /^[ㄱ-ㅎ]+$/.test(q);
  const krdict = w => `https://krdict.korean.go.kr/eng/dicMarinerSearch/search?nation=eng&nationCode=6&ParaWordNo=&mainSearchWord=${encodeURIComponent(w)}`;
  const stdict = w => `https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=${encodeURIComponent(w)}`;
  const GRADE_COLOR = { "초급": LEVELS.A1.color, "중급": LEVELS.B1.color, "고급": LEVELS.C1.color };
  const GRADE_OF_LEVEL = { A0: "초급", A1: "초급", A2: "초급", B1: "중급", B2: "중급", C1: "고급", C2: "고급" };
  const UNIT_LABEL = { grammar: "Grammar pattern", idiom: "Idiom", proverb: "Proverb", phrase: "Phrase" };
  const TYPES = [["all", "All"], ["word", "Words"], ["grammar", "Grammar patterns"], ["idiom", "Idioms & proverbs"]];
  const typeOf = e => e.unit === "grammar" ? "grammar" : (e.unit === "idiom" || e.unit === "proverb") ? "idiom" : "word";
  const escRe = s => s.replace(/[.*+?^$()|[\]{}\\]/g, m => "\\" + m);
  const STOP = new Set(["to", "be", "a", "an", "the", "of", "one's", "someone", "something"]);
  const tokens = s => s.toLowerCase().split(/[^a-z']+/).filter(t => t && !STOP.has(t));

  let dictLevel = "all", dictType = "all";
  let ALL = DICTIONARY.map(e => ({ w: e[0], pos: e[1], en: e[2], lv: e[3], hj: e[4] || "", src: "core", fi: -1 }));
  let fullState = "idle"; // idle | loading | ready | missing
  let byWord = null;
  function indexWords() {
    byWord = new Map();
    ALL.forEach((e, i) => { e.i = i; if (!byWord.has(e.w)) byWord.set(e.w, e); });
  }
  indexWords();
  const getEntry = w => byWord.get(w) || null;

  function loadFullDictionary(onDone) {
    if (fullState === "ready" || fullState === "missing") { onDone && onDone(); return; }
    if (fullState === "loading") return;
    fullState = "loading";
    const s = document.createElement("script");
    s.src = "dictionary-full.js";
    s.onload = () => {
      const full = window.DICTIONARY_FULL || [];
      const coreByWord = new Map(ALL.map(e => [e.w, e]));
      const extra = [];
      // group 기초사전 entries by word so each core word can claim its best match
      const groups = new Map();
      full.forEach((f, fi) => { if (coreByWord.has(f[0])) { (groups.get(f[0]) || groups.set(f[0], []).get(f[0])).push(fi); } });
      const claimed = new Set();
      groups.forEach((fis, w) => {
        const core = coreByWord.get(w), ct = new Set(tokens(core.en));
        let best = fis.length === 1 ? fis[0] : -1, bestScore = 0;
        if (best < 0) fis.forEach(fi => { const sc = tokens(full[fi][2]).filter(t => ct.has(t)).length; if (sc > bestScore) { bestScore = sc; best = fi; } });
        if (best >= 0) { Object.assign(core, { fi: best, pron: full[best][5], hom: full[best][6], grade: full[best][3] }); claimed.add(best); }
      });
      full.forEach((f, fi) => {
        if (claimed.has(fi)) return;
        extra.push({ w: f[0], pos: f[1], en: f[2], lv: f[3], hj: f[4] || "", pron: f[5], hom: f[6], unit: f[7], src: "krdict", fi });
      });
      ALL = ALL.concat(extra);
      indexWords();
      fullState = "ready";
      onDone && onDone();
    };
    s.onerror = () => { fullState = "missing"; s.remove(); onDone && onDone(); };
    document.head.appendChild(s);
  }

  const detailWaiters = {};
  function loadDetails(fi, cb) {
    if (fi < 0 || !window.DICTIONARY_FULL_BLOCK) return cb(null);
    const block = Math.floor(fi / window.DICTIONARY_FULL_BLOCK), pos = fi % window.DICTIONARY_FULL_BLOCK;
    const have = window.DICTIONARY_DETAILS && window.DICTIONARY_DETAILS[block];
    if (have) return cb(have[pos]);
    if (detailWaiters[block]) { detailWaiters[block].push(() => cb(window.DICTIONARY_DETAILS[block][pos])); return; }
    detailWaiters[block] = [() => cb(window.DICTIONARY_DETAILS[block][pos])];
    const s = document.createElement("script");
    s.src = `dict-details/${String(block).padStart(2, "0")}.js`;
    s.onload = () => { (detailWaiters[block] || []).forEach(f => f()); delete detailWaiters[block]; };
    s.onerror = () => { (detailWaiters[block] || []).forEach(() => cb(null)); delete detailWaiters[block]; s.remove(); };
    document.head.appendChild(s);
  }

  function score(e, q, jamo, re) {
    if (jamo) { const c = e._cho || (e._cho = chosung(e.w)); return c === q ? 0 : c.startsWith(q) ? 1 : -1; }
    if (e.w === q) return 0;
    const bare = e.w.replace(/^-/, "");
    if (bare === q) return 0;
    if (e.w.startsWith(q) || bare.startsWith(q)) return 1;
    if (e.w.includes(q)) return 2;
    if (!re) return -1;
    const en = e.en.toLowerCase();
    if (en === q || en.split(/;\s*/).includes(q)) return 1;
    if (re.test(en)) return 3;
    return -1;
  }

  function renderDictionary(params) {
    const q0 = params.get("q") || "";
    $("#dictBody").innerHTML = `
      <div class="dict-search">
        <input id="dictIn" class="input-ko" type="search" placeholder="Search: 학교, school, ㅎㄱ, -거든요" value="${esc(q0)}" aria-label="Search the dictionary" autocomplete="off" />
        <div class="filter" role="group" aria-label="Filter by type" id="typeFilter" ${fullState === "missing" ? "hidden" : ""}>
          ${TYPES.map(([k, label]) => `<button type="button" class="filter-btn" data-ty="${k}" aria-pressed="${dictType === k}">${label}</button>`).join("")}
        </div>
        <div class="filter" role="group" aria-label="Filter by level">
          ${["all", ...LEVEL_ORDER].map(c => `<button type="button" class="filter-btn" data-lv="${c}" aria-pressed="${dictLevel === c}">${c === "all" ? "All levels" : c}</button>`).join("")}
        </div>
      </div>
      <p class="dict-count" id="dictCount" aria-live="polite"></p>
      <div id="dictMiss"></div>
      <ul class="dict-list" id="dictList"></ul>
      <p class="dict-source" id="dictSource"></p>`;
    const input = $("#dictIn");
    const run = () => {
      const q = input.value.trim().toLowerCase();
      const jamo = isJamoOnly(q);
      const grade = GRADE_OF_LEVEL[dictLevel];
      let rows = ALL.filter(e =>
        (dictLevel === "all" || (e.src === "core" ? e.lv === dictLevel : e.lv === grade)) &&
        (dictType === "all" || typeOf(e) === dictType));
      if (q) {
        const re = /[a-z]/.test(q) ? new RegExp("(^|[^a-z])" + escRe(q)) : null;
        rows = rows.map(e => [e, score(e, q, jamo, re)]).filter(([, s]) => s >= 0)
          .sort((a, b) => a[1] - b[1] || (b[0].src === "core") - (a[0].src === "core") || (a[0].hom || 0) - (b[0].hom || 0) || a[0].w.length - b[0].w.length)
          .map(([e]) => e);
      } else if (fullState === "ready" && dictLevel === "all" && dictType === "all") {
        rows = rows.filter(e => e.src === "core"); // browse the core list; search covers everything
      }
      const shown = rows.slice(0, 80);
      $("#dictCount").textContent = !q && fullState === "ready" && dictLevel === "all" && dictType === "all"
        ? `${rows.length} core words. Search to look through all ${ALL.length.toLocaleString()} entries.`
        : rows.length > shown.length ? `${rows.length.toLocaleString()} entries, showing the first ${shown.length}` : `${rows.length.toLocaleString()} ${rows.length === 1 ? "entry" : "entries"}`;
      $("#dictList").innerHTML = shown.map(entryRow).join("");
      $$("#dictList [data-i]").forEach(b => b.addEventListener("click", () => toggleEntry(b)));
      $("#dictMiss").innerHTML = /[가-힣]/.test(q) && !rows.length && fullState !== "loading" ? missHTML(q) : "";
      wireSaveButtons($("#dictMiss"));
      $("#dictSource").innerHTML = fullState === "ready"
        ? `Includes ${(window.DICTIONARY_FULL || []).length.toLocaleString()} entries from <a href="https://krdict.korean.go.kr" target="_blank" rel="noopener" lang="ko">한국어기초사전</a>, National Institute of Korean Language (CC BY-SA 2.0 KR). Their levels are 초급, 중급 and 고급; the level buttons match them roughly.`
        : fullState === "loading" ? "Loading the full dictionary…" : "";
      $("#typeFilter").hidden = fullState === "missing";
    };
    let deb;
    input.addEventListener("input", () => { clearTimeout(deb); deb = setTimeout(run, ALL.length > 2000 ? 120 : 0); });
    $$("[data-lv]", $("#dictBody")).forEach(b => b.addEventListener("click", () => {
      dictLevel = b.dataset.lv;
      $$("[data-lv]", $("#dictBody")).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      run();
    }));
    $$("[data-ty]", $("#dictBody")).forEach(b => b.addEventListener("click", () => {
      dictType = b.dataset.ty;
      $$("[data-ty]", $("#dictBody")).forEach(x => x.setAttribute("aria-pressed", String(x === b)));
      run();
    }));
    run();
    loadFullDictionary(() => {
      if ($("[data-view='dictionary']").hidden) return;
      run();
      if (q0) { const first = $("#dictList [data-i]"); if (first && first.getAttribute("aria-expanded") !== "true") toggleEntry(first); }
    });
    if (q0) { const first = $("#dictList [data-i]"); if (first) toggleEntry(first); }
  }
  function entryRow(e) {
    const color = e.src === "core" ? LEVELS[e.lv].color : (GRADE_COLOR[e.lv] || "var(--line)");
    const tag = e.unit && UNIT_LABEL[e.unit] ? `<span class="dict-tag">${UNIT_LABEL[e.unit]}</span>` : "";
    return `<li class="dict-row">
      <button type="button" class="dict-head" data-i="${e.i}" aria-expanded="false">
        <span class="dict-w" lang="ko">${esc(e.w)}${e.hom ? `<sup class="hom">${e.hom}</sup>` : ""}</span>
        <span class="dict-en">${tag}${esc(e.en)}</span>
        <span class="dict-meta">${e.lv ? `<span class="dot" style="background:${color}" aria-hidden="true"></span><span ${e.src === "krdict" ? 'lang="ko"' : ""}>${esc(e.lv)}</span>` : ""}</span>
      </button>
      <div class="dict-detail" hidden></div>
    </li>`;
  }
  function entryDetail(e, det) {
    const { w, pos, hj } = e;
    const isPhrase = /\s/.test(w) || w.startsWith("-");
    const r = isPhrase ? null : K.pronounce(w);
    const official = e.pron ? e.pron.replace(/ː/g, "") : "";
    const pronText = e.pron || (r ? r.text : "");
    const showRules = r && r.rules.length && (!official || official === r.text.replace(/\s/g, ""));
    const chars = hj ? [...hj.replace(/[^\u4E00-\u9FFF]/g, "")] : [];
    const isSaved = !!state.saved[w];
    const links = [...new Set(chars)].map(c => { const i = HANJA.findIndex(h => h[0] === c); return i >= 0 && hanjaFree(i) ? `<a class="hj-link" href="#/hanja?c=${encodeURIComponent(c)}"><span class="hj-c">${c}</span><span lang="ko">${HANJA[i][1]} ${HANJA[i][2]}</span></a>` : ""; }).join("");
    const [defs, enDef, ex] = det || [[], "", []];
    return `
      ${pronText ? `<p class="dd-pron"><span lang="ko">[${esc(pronText)}]</span>${speakBtn(w)}${pos ? `<span class="dd-pos">${esc(pos)}</span>` : ""}</p>` : pos ? `<p class="dd-pron">${speakBtn(w)}<span class="dd-pos">${esc(pos)}</span></p>` : ""}
      ${e.pron && e.pron.includes("ː") ? `<p class="dd-note">ː marks a long vowel in the standard pronunciation. Most younger Seoul speakers no longer distinguish length.</p>` : ""}
      ${showRules ? `<p class="dd-rules" lang="ko">${r.rules.map(k => K.RULES[k].ko).join(", ")}</p>` : ""}
      ${hj ? `<p class="dd-hanja"><span class="hj-text">${esc(hj)}</span>${links}</p>` : ""}
      ${defs && defs.length ? `<ol class="dd-defs" lang="ko">${defs.map(d => `<li>${esc(d)}</li>`).join("")}</ol>` : ""}
      ${enDef ? `<p class="dd-endef">${esc(enDef)}</p>` : ""}
      ${ex && ex.length ? `<ul class="dd-ex" lang="ko">${ex.map(x => `<li><span>${esc(x)}</span>${speakBtn(x)}</li>`).join("")}</ul>` : ""}
      <div class="dd-actions">
        <button type="button" class="btn btn-small ${isSaved ? "btn-done" : "btn-quiet"}" data-save="${esc(w)}">${isSaved ? "Saved for review ✓" : "Save for review"}</button>
        <a class="btn btn-small btn-quiet" href="${krdict(w)}" target="_blank" rel="noopener" lang="ko">한국어기초사전</a>
        <a class="btn btn-small btn-quiet" href="${stdict(w)}" target="_blank" rel="noopener" lang="ko">표준국어대사전</a>
      </div>`;
  }
  function toggleEntry(btn) {
    const det = btn.closest(".dict-row").querySelector(".dict-detail");
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    if (open) { det.hidden = true; return; }
    const e = ALL[Number(btn.dataset.i)];
    det.innerHTML = entryDetail(e, null);
    det.hidden = false;
    wireSaveButtons(det);
    loadDetails(e.fi ?? -1, d => {
      if (!d || btn.getAttribute("aria-expanded") !== "true") return;
      det.innerHTML = entryDetail(e, d);
      wireSaveButtons(det);
    });
  }
  function missHTML(q) {
    const r = K.pronounce(q);
    return `<div class="dict-miss">
      <p><strong lang="ko">${esc(q)}</strong> isn't in the built-in dictionary yet. Here's how it's pronounced, and where to look it up.</p>
      <p class="dd-pron"><span lang="ko">[${esc(r.text)}]</span>${speakBtn(q)}${r.rules.length ? `<span class="dd-rules" lang="ko">${r.rules.map(k => K.RULES[k].ko).join(", ")}</span>` : ""}</p>
      <div class="dd-actions">
        <button type="button" class="btn btn-small ${state.saved[q] ? "btn-done" : "btn-quiet"}" data-save="${esc(q)}">${state.saved[q] ? "Saved for review ✓" : "Save for review"}</button>
        <a class="btn btn-small btn-quiet" href="${krdict(q)}" target="_blank" rel="noopener" lang="ko">한국어기초사전</a>
        <a class="btn btn-small btn-quiet" href="${stdict(q)}" target="_blank" rel="noopener" lang="ko">표준국어대사전</a>
      </div></div>`;
  }
  function wireSaveButtons(root) {
    $$("[data-save]", root).forEach(b => {
      if (b.__wired) return; b.__wired = true;
      b.addEventListener("click", () => {
        const w = b.dataset.save;
        if (state.saved[w]) { delete state.saved[w]; b.textContent = "Save for review"; b.classList.replace("btn-done", "btn-quiet"); }
        else { state.saved[w] = { box: 0, due: Date.now() }; b.textContent = "Saved for review ✓"; b.classList.replace("btn-quiet", "btn-done"); markActive(); }
        save();
      });
    });
  }

  /* ═════════ Hanja ═════════ */
  function renderHanja(params) {
    const free = HANJA_SETS[0].free;
    $("#hanjaBody").innerHTML = `
      ${ACCESS.premium ? "" : `<div class="premium-note"><p><strong>Free preview.</strong> The first ${free} characters are open. The full Hanja course is part of the premium plan.</p></div>`}
      <div class="hanja-bar">
        <p><strong>${state.hanjaKnown.size}</strong> of ${HANJA.length} characters known <span class="muted" lang="ko">(한국어문회 8급 · 7급)</span></p>
        <div class="hanja-actions">
          <button class="btn btn-primary" type="button" id="hjQuiz">Quiz me</button>
          <button class="btn btn-quiet" type="button" id="hjBuild">Word builder</button>
        </div>
      </div>
      <section class="week" aria-labelledby="weekTitle">
        <h2 id="weekTitle" class="sub-h">The days of the week</h2>
        <p class="tool-sub">The weekdays are the moon, five elements and the sun. Learn these seven and every 요일 makes sense.</p>
        <div class="week-row">
          ${HANJA_WEEK.map(c => { const i = HANJA.findIndex(h => h[0] === c); return `<button type="button" class="week-day${hanjaFree(i) ? "" : " locked"}" data-hj="${i}"><span class="hj-c">${c}</span><span lang="ko">${HANJA[i][2].split(" / ")[0]}요일</span></button>`; }).join("")}
        </div>
      </section>
      ${HANJA_SETS.map(set => `
      <section aria-labelledby="grid-${set.id}">
        <h2 id="grid-${set.id}" class="sub-h"><span lang="ko">${set.name}</span> · ${set.en}</h2>
        <ul class="hanja-grid">
          ${HANJA.map((h, i) => [h, i]).filter(([h]) => (h[5] || "8") === set.id).map(([h, i]) => `<li><button type="button" class="hj-card${state.hanjaKnown.has(h[0]) ? " known" : ""}${hanjaFree(i) ? "" : " locked"}" data-hj="${i}" aria-label="${h[0]}, ${h[1]} ${h[2]}${state.hanjaKnown.has(h[0]) ? ", known" : ""}${hanjaFree(i) ? "" : ", premium"}">
            <span class="hj-c">${h[0]}</span><span class="hj-hun" lang="ko">${h[1]} ${h[2]}</span>
          </button></li>`).join("")}
        </ul>
      </section>`).join("")}`;
    $$("[data-hj]", $("#hanjaBody")).forEach(b => b.addEventListener("click", () => {
      const i = Number(b.dataset.hj);
      if (!hanjaFree(i)) { toast("This character is part of the premium Hanja course."); return; }
      openHanja(i, b);
    }));
    loadFullDictionary();
    $("#hjQuiz").addEventListener("click", e => openHanjaQuiz(e.currentTarget));
    $("#hjBuild").addEventListener("click", e => openWordBuilder(e.currentTarget));
    const c = params.get("c");
    if (c) { const i = HANJA.findIndex(h => h[0] === c); if (i >= 0 && hanjaFree(i)) openHanja(i); }
  }
  function linkChars(hj) {
    return [...hj].map(c => { const i = HANJA.findIndex(h => h[0] === c); return i >= 0 && hanjaFree(i) ? `<button type="button" class="hj-inline" data-goto="${i}" aria-label="${c}, ${HANJA[i][1]} ${HANJA[i][2]}">${c}</button>` : c; }).join("");
  }
  function openHanja(i, trigger) {
    const [c, hun, eum, en, words] = HANJA[i];
    const inDict = ALL.filter(e => e.hj && e.hj.includes(c)).sort((a, b) => (a.src === "core" ? -1 : 1) - (b.src === "core" ? -1 : 1) || a.w.length - b.w.length).slice(0, 12);
    const known = state.hanjaKnown.has(c);
    body.innerHTML = `
      <div class="d-head" style="--tint:var(--mist)">
        <div class="d-toprow"><span class="level-chip" lang="ko">${(HANJA[i][5] || "8")}급</span>${closeBtn}</div>
        <div class="hj-hero"><span class="hj-big" id="drawerTitle">${c}</span>
          <div><p class="hj-hun-big" lang="ko">${hun} ${eum}</p><p class="d-place-en">${esc(en)}</p></div></div>
      </div>
      <div class="d-section">
        <h3>Words</h3>
        <ul class="hj-words">${words.map(([w, hj, m]) => `<li><span class="hjw-ko" lang="ko">${esc(w)}</span><span class="hjw-hj">${linkChars(hj)}</span><span class="hjw-en">${esc(m)}</span>${speakBtn(w)}</li>`).join("")}</ul>
      </div>
      ${inDict.length ? `<div class="d-section"><h3>In the dictionary</h3><ul class="hj-words">${inDict.map(e => `<li><a lang="ko" class="hjw-ko" href="#/dictionary?q=${encodeURIComponent(e.w)}">${esc(e.w)}</a><span class="hjw-hj">${esc(e.hj)}</span><span class="hjw-en">${esc(e.en)}</span></li>`).join("")}</ul></div>` : ""}
      <div class="l-actions">
        <button class="btn ${known ? "btn-done" : "btn-primary"}" type="button" data-act="known">${known ? "Known ✓ Mark as not known" : "I know this one"}</button>
        ${i < HANJA.length - 1 && hanjaFree(i + 1) ? `<button class="btn btn-quiet" type="button" data-act="nexthj">Next: ${HANJA[i + 1][0]}</button>` : ""}
      </div>`;
    wireClose();
    $$("[data-goto]", body).forEach(b => b.addEventListener("click", () => openHanja(Number(b.dataset.goto))));
    body.querySelector('[data-act="known"]').addEventListener("click", () => {
      if (known) state.hanjaKnown.delete(c); else { state.hanjaKnown.add(c); markActive(); }
      save(); openHanja(i);
    });
    body.querySelector('[data-act="nexthj"]')?.addEventListener("click", () => openHanja(i + 1));
    openDrawer(trigger);
  }
  function openHanjaQuiz(trigger) {
    const pool = HANJA.map((h, i) => ({ h, i })).filter(x => hanjaFree(x.i));
    const qs = shuffle(pool).slice(0, 10).map(({ h }, k) => {
      const others = shuffle(pool.filter(x => x.h[0] !== h[0])).slice(0, 3).map(x => x.h);
      if (k % 2 === 0) {
        const opts = shuffle([h, ...others]).map(x => `${x[1]} ${x[2]}`);
        return { id: `hj#${h[0]}#a`, type: "mc", q: `What is ${h[0]}?`, o: opts, a: opts.indexOf(`${h[1]} ${h[2]}`), why: `${h[0]}: ${h[1]} ${h[2]}, ${h[3]}.` };
      }
      const opts = shuffle([h, ...others]).map(x => x[0]);
      return { id: `hj#${h[0]}#b`, type: "mc", q: `Which character is ${h[1]} ${h[2]}?`, o: opts, a: opts.indexOf(h[0]), why: `${h[1]} ${h[2]} is ${h[0]}.` };
    });
    body.innerHTML = `${dHead('<span lang="ko">한자 퀴즈</span>', "Ten characters")}
      <div class="d-section"><div class="practice-head"><h3>Quiz</h3><span class="score" id="score"></span></div>
        <div class="qlist hj-quiz">${qs.map((q, k) => questionHTML(q, k + 1)).join("")}</div></div>
      <div class="l-actions"><button class="btn btn-quiet" type="button" data-act="again">New quiz</button></div>`;
    wireClose();
    let right = 0, n = 0;
    wireQuestions(body, qs, (q, ok) => { n++; if (ok) right++; $("#score").textContent = `${right} of ${n} correct`; recordResult(q, ok); });
    body.querySelector('[data-act="again"]').addEventListener("click", () => openHanjaQuiz());
    openDrawer(trigger);
  }
  function openWordBuilder(trigger) {
    const all = [];
    HANJA.forEach(h => h[4].forEach(([w, hj, m]) => { if (!all.some(x => x.hj === hj)) all.push({ w, hj, m }); }));
    const avail = HANJA.filter((_, i) => hanjaFree(i)).map(h => h[0]);
    let picked = [];
    const render = () => {
      const hj = picked.join("");
      const hit = all.find(x => x.hj === hj);
      const more = all.filter(x => x.hj.startsWith(hj) && x.hj !== hj && [...x.hj].every(c => avail.includes(c)));
      body.innerHTML = `${dHead("Word builder", "Put characters together", `<p class="d-blurb">Tap characters to build a word. You know the pieces, so you can often guess the meaning before you see it.</p>`)}
        <div class="d-section">
          <div class="build-slot" aria-live="polite">
            <span class="build-chars">${hj || "&nbsp;"}</span>
            ${hit ? `<span class="build-hit"><span lang="ko">${esc(hit.w)}</span> ${esc(hit.m)}${speakBtn(hit.w)}</span>`
                  : `<span class="muted">${!picked.length ? "Pick a character." : more.length ? `Keep going: ${more.length} ${more.length === 1 ? "word starts" : "words start"} like this.` : "Not a word in this set. Start over and try another pair."}</span>`}
          </div>
          ${picked.length ? `<button type="button" class="link-btn" data-act="clear">Start over</button>` : ""}
          <div class="build-grid">${avail.map(c => `<button type="button" class="build-c" data-c="${c}">${c}</button>`).join("")}</div>
        </div>`;
      wireClose();
      $$(".build-c", body).forEach(b => b.addEventListener("click", () => { picked.push(b.dataset.c); if (picked.length > 4) picked = [b.dataset.c]; render(); }));
      body.querySelector('[data-act="clear"]')?.addEventListener("click", () => { picked = []; render(); });
    };
    render();
    openDrawer(trigger);
  }

  /* ═════════ Review ═════════ */
  let reviewTab = "words";
  function renderReview(params) {
    if (params.get("tab")) reviewTab = params.get("tab");
    const due = dueWords(), saved = Object.keys(state.saved), mis = mistakeList();
    if (!["words", "mistakes"].includes(reviewTab)) reviewTab = "words";
    const tabs = [["words", "Words", due.length], ["mistakes", "Mistakes", mis.length]];
    $("#reviewBody").innerHTML = `
      <div class="segmented" role="tablist" aria-label="Review sections">
        ${tabs.map(([k, label, n]) => `<button type="button" role="tab" aria-selected="${reviewTab === k}" data-tab="${k}">${label}${n ? ` <span class="seg-n">${n}</span>` : ""}</button>`).join("")}
      </div>
      <div class="review-panel" id="reviewPanel" role="tabpanel"></div>`;
    $$("[data-tab]").forEach(b => b.addEventListener("click", () => { reviewTab = b.dataset.tab; renderReview(new URLSearchParams()); }));
    const p = $("#reviewPanel");

    if (reviewTab === "words") {
      p.innerHTML = saved.length ? `
        <div class="review-start">
          <p>${due.length ? `<strong>${due.length}</strong> ${due.length === 1 ? "word is" : "words are"} due.` : "Nothing due right now. Saved words come back after 1, 3, 7, 16 and 35 days."}</p>
          ${due.length ? `<button class="btn btn-primary" type="button" id="startCards">Review ${due.length} ${due.length === 1 ? "word" : "words"}</button>` : ""}
        </div>
        <ul class="saved-list">${saved.map(w => { const s = state.saved[w]; const e = getEntry(w); const d = Math.ceil((s.due - Date.now()) / DAY); return `<li><span lang="ko" class="sw">${esc(w)}</span><span class="muted">${e ? esc(e.en) : ""}</span><span class="sw-next">${s.due <= Date.now() ? "Due" : `In ${d} ${d === 1 ? "day" : "days"}`}</span><button type="button" class="link-btn" data-unsave="${esc(w)}">Remove</button></li>`; }).join("")}</ul>`
        : emptyHTML("No saved words yet.", "Save words from the dictionary and they'll come back here just before you'd forget them.", "#/dictionary", "Open the dictionary");
      $("#startCards")?.addEventListener("click", e => openCards(due, e.currentTarget));
      $$("[data-unsave]", p).forEach(b => b.addEventListener("click", () => { delete state.saved[b.dataset.unsave]; save(); renderReview(new URLSearchParams()); }));
    }

    if (reviewTab === "mistakes") {
      if (!mis.length) { p.innerHTML = emptyHTML("No mistakes waiting.", "Questions you miss in lessons and quizzes wait here until you get them right.", "#/", "Back to the map"); return; }
      const qs = mis.map(m => { if (!m.o) return { ...m, fromReview: true }; const o = shuffle(m.o); return { ...m, o, a: o.indexOf(m.o[m.a]), fromReview: true }; });
      p.innerHTML = `<p class="muted">Answer correctly to clear a question.</p><div class="qlist">${qs.map(q => {
        const src = q.src && findLesson(q.src);
        return `<div class="mistake">${src ? `<p class="mistake-src"><span lang="ko">${esc(src.unit.place)}</span>, ${esc(src.lesson.t)}</p>` : q.id.startsWith("hj#") ? `<p class="mistake-src">Hanja quiz</p>` : q.id.startsWith("read#") ? `<p class="mistake-src">Reading: ${esc((READINGS.find(x => x.id === q.id.split("#")[1]) || {}).title || "")}</p>` : ""}${questionHTML(q)}</div>`;
      }).join("")}</div>`;
      wireQuestions(p, qs, (q, ok) => { if (ok) { delete state.mistakes[q.id]; save(); setTimeout(() => { if (reviewTab === "mistakes") renderReview(new URLSearchParams()); }, 1600); } });
    }

  }
  const emptyHTML = (t, s, href, cta) => `<div class="empty"><p class="empty-t">${t}</p><p class="muted">${s}</p><a class="btn btn-quiet" href="${href}">${cta}</a></div>`;

  function openCards(words, trigger) {
    let k = 0;
    const show = revealed => {
      if (k >= words.length) {
        body.innerHTML = dHead("Review", "All done for now", `<p class="d-blurb">${words.length} ${words.length === 1 ? "word" : "words"} reviewed. Each one comes back when it's due.</p>`);
        wireClose(); return;
      }
      const w = words[k], e = getEntry(w), r = K.pronounce(w);
      body.innerHTML = `${dHead(`${k + 1} of ${words.length}`, "")}
        <div class="d-section card-face">
          <p class="card-word" id="drawerTitle" lang="ko">${esc(w)}</p>${speakBtn(w)}
          ${revealed ? `<div class="card-back"><p lang="ko" class="dd-pron">[${esc(r.text)}]</p><p class="card-en">${e ? esc(e.en) : `<a href="${krdict(w)}" target="_blank" rel="noopener">Look it up in 한국어기초사전</a>`}</p>${e && e.hj ? `<p class="hj-text">${esc(e.hj)}</p>` : ""}</div>` : `<p class="muted">Say what it means, then check.</p>`}
        </div>
        <div class="l-actions">
          ${revealed ? `<button class="btn btn-quiet" type="button" data-r="again">Again</button><button class="btn btn-primary" type="button" data-r="good">Got it</button>`
                     : `<button class="btn btn-primary" type="button" data-r="show">Show answer</button>`}
        </div>`;
      wireClose();
      body.querySelector('[data-r="show"]')?.addEventListener("click", () => show(true));
      body.querySelector('[data-r="again"]')?.addEventListener("click", () => { state.saved[w] = { box: 0, due: Date.now() + 10 * 60000 }; markActive(); save(); k++; show(false); });
      body.querySelector('[data-r="good"]')?.addEventListener("click", () => { const s = state.saved[w]; const box = Math.min((s?.box || 0) + 1, SRS_DAYS.length - 1); state.saved[w] = { box, due: Date.now() + SRS_DAYS[box] * DAY }; markActive(); save(); k++; show(false); });
    };
    show(false);
    openDrawer(trigger);
  }

  /* ═════════ Quick notes (available on every screen) ═════════ */
  function currentContext() {
    const [path] = (location.hash.replace(/^#\/?/, "") || "").split("?");
    const seg = path.split("/").map(decodeURIComponent);
    if (seg[0] === "place") {
      const f = seg[2] != null && seg[2] !== "" ? findLesson(`${seg[1]}:${seg[2]}`) : null;
      const u = UNITS.find(x => x.id === seg[1]);
      if (f && f.lesson) return { label: `${f.unit.place} · ${f.lesson.t}`, href: `#/place/${seg[1]}/${seg[2]}` };
      if (u) return { label: `${u.place} · ${u.title}`, href: `#/place/${u.id}` };
    }
    if (seg[0] === "deep" && seg[1]) { const d = DEEP_DIVES.find(x => x.id === seg[1]); if (d) return { label: `Deep dive · ${d.title}`, href: `#/deep/${d.id}` }; }
    const names = { lab: "Lab", dictionary: "Dictionary", hanja: "Hanja", deep: "Deep dives", review: "Review" };
    return names[seg[0]] ? { label: names[seg[0]], href: `#/${seg[0]}` } : null;
  }
  const noteHTML = (n, k, full) => `<li class="note${full ? " full" : ""}">
      <p class="note-t" ${/[가-힣]/.test(n.t) ? 'lang="ko"' : ""}>${esc(n.t)}</p>
      <p class="note-meta"><span>${new Date(n.at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>${n.ctx ? `<a href="${esc(n.ctx.href)}" lang="ko">${esc(n.ctx.label)}</a>` : ""}${full ? `<button type="button" class="link-btn" data-del="${k}">Delete</button>` : ""}</p>
    </li>`;

  function renderNotesPanel() {
    const panel = $("#notesPanel");
    if (panel.hidden) return;
    const ctx = currentContext();
    panel.innerHTML = `
      <div class="np-head">
        <p class="np-title">Quick note</p>
        <button class="icon-btn" type="button" data-act="np-close" aria-label="Close notes"><svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      </div>
      <form class="np-form" id="npForm">
        <label class="sr-only" for="npIn">Note</label>
        <textarea id="npIn" rows="4" placeholder="A word you heard, a question for later…"></textarea>
        ${ctx ? `<label class="np-ctx"><input type="checkbox" id="npCtx" checked /> <span>Link to <span lang="ko">${esc(ctx.label)}</span></span></label>` : ""}
        <button class="btn btn-primary btn-small" type="submit">Save note</button>
      </form>
      ${state.notes.length ? `<ul class="np-list">${state.notes.slice(0, 4).map((n, k) => noteHTML(n, k, false)).join("")}</ul>` : ""}
      <a class="np-more" href="#/notebook">Open the notebook ${arrowR}</a>`;
    $("[data-act='np-close']", panel).addEventListener("click", toggleNotes);
    $("#npForm").addEventListener("submit", e => {
      e.preventDefault();
      const t = $("#npIn").value.trim(); if (!t) return;
      state.notes.unshift({ t, at: Date.now(), ctx: ctx && $("#npCtx")?.checked ? ctx : null });
      markActive(); save(); renderNotesPanel();
      if (!$("[data-view='notebook']").hidden) renderNotebook(new URLSearchParams());
      toast("Note saved.");
      $("#npIn").focus();
    });
  }
  function toggleNotes() {
    const panel = $("#notesPanel"), fab = $("#notesFab");
    const open = panel.hidden;
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", String(open));
    if (open) { renderNotesPanel(); $("#npIn").focus(); } else fab.focus();
  }

  /* ═════════ Notebook ═════════ */
  let notebookTab = "notes";
  function renderNotebook(params) {
    if (params.get("tab")) notebookTab = params.get("tab");
    const drafts = Object.entries(state.drafts).filter(([, t]) => t && t.trim());
    $("#notebookBody").innerHTML = `
      <div class="segmented" role="tablist" aria-label="Notebook sections">
        <button type="button" role="tab" aria-selected="${notebookTab === "notes"}" data-tab="notes">Notes${state.notes.length ? ` <span class="seg-n">${state.notes.length}</span>` : ""}</button>
        <button type="button" role="tab" aria-selected="${notebookTab === "writing"}" data-tab="writing">Writing${drafts.length ? ` <span class="seg-n">${drafts.length}</span>` : ""}</button>
      </div>
      <div id="nbPanel" role="tabpanel"></div>`;
    $$("[data-tab]", $("#notebookBody")).forEach(b => b.addEventListener("click", () => { notebookTab = b.dataset.tab; renderNotebook(new URLSearchParams()); }));
    const p = $("#nbPanel");
    if (notebookTab === "notes") {
      p.innerHTML = `
        <form class="note-form" id="noteForm">
          <label class="sr-only" for="noteIn">New note</label>
          <textarea id="noteIn" rows="3" placeholder="Write a note…"></textarea>
          <button class="btn btn-primary" type="submit">Add note</button>
        </form>
        ${state.notes.length > 6 ? `<input class="note-search" id="noteSearch" type="search" placeholder="Search your notes" aria-label="Search your notes" />` : ""}
        ${state.notes.length ? `<ul class="notes" id="notesList">${state.notes.map((n, k) => noteHTML(n, k, true)).join("")}</ul>`
          : `<p class="muted">Notes are for anything: a word you heard, a question for later. The <strong>Note</strong> button in the corner works on every screen.</p>`}`;
      $("#noteForm").addEventListener("submit", e => {
        e.preventDefault(); const t = $("#noteIn").value.trim(); if (!t) return;
        state.notes.unshift({ t, at: Date.now(), ctx: null }); markActive(); save(); renderNotebook(new URLSearchParams());
      });
      $$("[data-del]", p).forEach(b => b.addEventListener("click", () => { state.notes.splice(Number(b.dataset.del), 1); save(); renderNotebook(new URLSearchParams()); }));
      $("#noteSearch")?.addEventListener("input", e => {
        const q = e.target.value.trim().toLowerCase();
        $$("#notesList .note").forEach(li => { li.hidden = q && !li.textContent.toLowerCase().includes(q); });
      });
    } else {
      p.innerHTML = drafts.length ? `<ul class="drafts">${drafts.map(([id, t]) => { const f = findLesson(id); if (!f) return ""; return `<li>
          <p class="draft-title"><span lang="ko">${esc(f.unit.place)}</span> · ${esc(f.lesson.t)}</p>
          <p class="draft-text" lang="ko">${esc(t)}</p>
          <a class="btn btn-small btn-ghost" href="${placeHref(f.u, f.j)}">Keep writing</a></li>`; }).join("")}</ul>`
        : emptyHTML("No writing yet.", "Every neighborhood ends with a mission. What you write there is kept here.", "#/", "Find a mission");
    }
  }

  /* ═════════ Deep dives (premium) ═════════ */
  function renderDeep(id) {
    DEEP_DIVES.sort((a, b) => levelIdx(a.level) - levelIdx(b.level));
    const box = $("#deepBody");
    const d = id && DEEP_DIVES.find(x => x.id === id);
    if (!d) {
      box.innerHTML = `
        <header class="page-head">
          <p class="kicker"><span lang="ko">심화</span> <span class="badge-premium">Premium</span></p>
          <h1 class="display">Deep <em>dives</em></h1>
          <p class="lede">Things you don't need in order to move on, but that make your Korean richer: why romanization disagrees, what to call people, how families address each other, what tiny endings really signal. Grouped by level, each linked to the place where the basics are taught.</p>
        </header>
        ${ACCESS.premium ? "" : `<div class="premium-note"><p><strong>Premium.</strong> You can read the opening of every deep dive. The full notes are part of the premium plan.</p></div>`}
        ${LEVEL_ORDER.filter(code => DEEP_DIVES.some(x => x.level === code)).map(code => `
          <section class="deep-level">
            <h2 class="deep-level-h"><span class="lv-dot" style="background:${LEVELS[code].color}"></span>${code} <span lang="ko">${LEVELS[code].ko}</span> <span class="muted">${LEVELS[code].en}</span></h2>
            <ol class="deep-index">
              ${DEEP_DIVES.filter(x => x.level === code).map(x => `<li><a href="#/deep/${x.id}">
                <span class="deep-no">${pad2(DEEP_DIVES.indexOf(x) + 1)}</span>
                <span class="deep-main"><span class="deep-title">${esc(x.title)}</span><span class="deep-ko" lang="ko">${esc(x.titleKo)}</span><span class="deep-lede">${esc(x.lede)}</span></span>
                <span class="deep-meta">${ACCESS.premium ? "" : `<span class="deep-lock">${lockIcon} Premium</span>`}</span>
              </a></li>`).join("")}
            </ol>
          </section>`).join("")}`;
      return;
    }
    const k = DEEP_DIVES.indexOf(d), open = ACCESS.premium;
    const sections = open ? d.sections : d.sections.slice(0, 1).map(s => ({ h: s.h, p: s.p ? s.p.slice(0, 1) : [] }));
    const nextD = DEEP_DIVES[k + 1];
    box.innerHTML = `
      <article class="deep-article">
        <a class="back-link" href="#/deep">${arrowL}<span>All deep dives</span></a>
        <header class="deep-head">
          <p class="kicker">Deep dive No. ${pad2(k + 1)} <span class="kicker-sep"></span> <span class="lv-tag" style="--c:${LEVELS[d.level].color}">${d.level}</span></p>
          <h1 class="display">${esc(d.title)}</h1>
          <p class="deep-ko-big" lang="ko">${esc(d.titleKo)}</p>
          <p class="lede">${esc(d.lede)}</p>
          <p class="deep-places">Builds on ${d.places.map(pid => { const i = UNITS.findIndex(u => u.id === pid); return `<a href="${placeHref(i)}"><span lang="ko">${esc(UNITS[i].place)}</span></a>`; }).join(", ")}</p>
        </header>
        <div class="deep-body${open ? "" : " is-locked"}">
          ${sections.map(s => `
            <section>
              <h2>${esc(s.h)}</h2>
              ${(s.p || []).map(t => `<p>${esc(t)}</p>`).join("")}
              ${s.table ? `<div class="table-wrap"><table class="deep-table"><thead><tr>${s.table.head.map(h => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${s.table.rows.map(r => `<tr>${r.map((c, ci) => ci === 0 ? `<th scope="row" ${/[가-힣]/.test(c) ? 'lang="ko"' : ""}>${esc(c)}</th>` : `<td ${/[가-힣]/.test(c) ? 'lang="ko"' : ""}>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : ""}
              ${open && s.ex ? `<div class="examples" lang="ko">${s.ex.map(x => `<p class="example"><span>${esc(x)}</span>${speakBtn(x)}</p>`).join("")}</div>` : ""}
            </section>`).join("")}
        </div>
        ${open ? "" : `<div class="locked-card">${lockIcon}<p><strong>The rest of this deep dive is premium.</strong> ${d.sections.length - 1} more ${d.sections.length - 1 === 1 ? "section" : "sections"}, with tables and examples.</p></div>`}
        ${nextD ? `<a class="deep-next" href="#/deep/${nextD.id}"><span class="kicker">Next deep dive</span><span class="deep-title">${esc(nextD.title)}</span><span class="deep-ko" lang="ko">${esc(nextD.titleKo)}</span></a>` : ""}
      </article>`;
  }

  /* ═════════ Start screen: pastel sky, twinkling stars, butterflies ═════════ */
  let splashRAF = null;
  function showSplash() {
    const sp = $("#splash");
    const big = $("[data-letters]", sp);
    if (big && !big.dataset.split) {
      big.dataset.split = "1";
      big.innerHTML = [...big.textContent].map((ch, k) => ch === " " ? `<span class="sp"> </span>` : `<span class="ch" style="--i:${k}">${ch}</span>`).join("");
    }
    sp.hidden = false;
    document.body.classList.add("splash-on");
    $("#splashGo").textContent = state.done.size || state.startLevel ? "Continue" : "Begin";
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cv = $("#splashStars"), ctx = cv.getContext("2d");
    let W, H, stars = [];
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((W * H) / 9000);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H * .72, r: .5 + Math.random() * 1.3,
        p: Math.random() * Math.PI * 2, s: .6 + Math.random() * 1.6, big: Math.random() < .06
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const flyers = $("#splashFlyers");
    flyers.innerHTML = "";
    const bugs = []; // the pixel butterflies are retired; the logo carries the motif now

    const draw = t => {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        const a = reduce ? .8 : .35 + .65 * (0.5 + 0.5 * Math.sin(t * .001 * s.s + s.p));
        ctx.globalAlpha = a;
        ctx.fillStyle = "#fff";
        if (s.big) {
          const r = s.r * 3.2;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y - r); ctx.quadraticCurveTo(s.x, s.y, s.x + r, s.y);
          ctx.quadraticCurveTo(s.x, s.y, s.x, s.y + r); ctx.quadraticCurveTo(s.x, s.y, s.x - r, s.y);
          ctx.quadraticCurveTo(s.x, s.y, s.x, s.y - r); ctx.fill();
        } else { ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill(); }
      });
      ctx.globalAlpha = 1;
      bugs.forEach(b => {
        const x = (b.cx + b.ax * Math.sin(t * b.wx + b.ph)) * W;
        const y = (b.cy + b.ay * Math.sin(t * b.wy + b.ph * 1.3)) * H;
        const dir = Math.cos(t * b.wx + b.ph) >= 0 ? 1 : -1;
        const flap = reduce ? 1 : .55 + .45 * Math.abs(Math.sin(t * .012 + b.k));
        b.img.style.transform = `translate(${x}px, ${y}px) scaleX(${dir * flap}) rotate(${Math.sin(t * .002 + b.k) * 8}deg)`;
      });
      if (!reduce) splashRAF = requestAnimationFrame(draw);
    };
    splashRAF = requestAnimationFrame(draw);
    hideSplash.cleanup = () => window.removeEventListener("resize", resize);
  }
  function hideSplash(then) {
    const sp = $("#splash");
    if (sp.hidden) { then && then(); return; }
    try { sessionStorage.setItem("lss:splash", "1"); } catch {}
    sp.classList.add("leaving");
    setTimeout(() => {
      sp.hidden = true; sp.classList.remove("leaving");
      document.body.classList.remove("splash-on");
      cancelAnimationFrame(splashRAF); hideSplash.cleanup && hideSplash.cleanup();
      then && then();
    }, 550);
  }

  /* ═════════ Reading room ═════════ */
  function readingLinesHTML(r) {
    const convo = r.lines.every(l => /^[^:：]{1,6}:\s/.test(l));
    if (convo) return `<div class="read-chat" lang="ko">${r.lines.map(l => { const [who, ...rest] = l.split(":"); const t = rest.join(":").trim(); return `<p class="read-line"><span class="read-who">${esc(who)}</span><span class="read-t">${esc(t)}</span>${speakBtn(t)}</p>`; }).join("")}</div>`;
    const short = r.lines.every(l => l.length < 40);
    return `<div class="${short ? "read-sign" : "read-prose"}" lang="ko">${r.lines.map(l => `<p><span class="read-t">${esc(l)}</span>${speakBtn(l)}</p>`).join("")}</div>`;
  }
  function renderReading(id) {
    const box = $("#readingBody");
    const r = id && READINGS.find(x => x.id === id);
    if (!r) {
      box.innerHTML = `
        <header class="page-head">
          <p class="kicker" lang="ko">읽기</p>
          <h1 class="display">Reading <em>room</em></h1>
          <p class="lede">Everyday Korean the way you'd actually meet it: signs, menus, group chats, a diary, a blog, an email, a news story, a column, an essay. One for every neighborhood, written for this course.</p>
        </header>
        ${LEVEL_ORDER.filter(code => READINGS.some(x => x.level === code)).map(code => `
          <section class="deep-level">
            <h2 class="deep-level-h"><span class="lv-dot" style="background:${LEVELS[code].color}"></span>${code} <span lang="ko">${LEVELS[code].ko}</span> <span class="muted">${LEVELS[code].en}</span></h2>
            <ol class="deep-index read-index">
              ${READINGS.filter(x => x.level === code).map(x => { const u = UNITS.find(y => y.id === x.unit); return `<li><a href="#/reading/${x.id}">
                <span class="read-type">${esc(x.type)}</span>
                <span class="deep-main"><span class="deep-title">${esc(x.title)}</span><span class="deep-ko" lang="ko">${esc(x.titleKo)}</span></span>
                <span class="deep-meta"><span class="read-place" lang="ko">${esc(u ? u.place : "")}</span>${state.readDone.includes(x.id) ? `<span class="read-done">Read ✓</span>` : ""}</span>
              </a></li>`; }).join("")}
            </ol>
          </section>`).join("")}`;
      return;
    }
    const i = UNITS.findIndex(u => u.id === r.unit), u = UNITS[i];
    const qs = r.q.map((q, k) => ({ id: `read#${r.id}#${k}`, type: "mc", q: q[0], o: q[1], a: q[2], why: q[3], src: null }));
    const done = state.readDone.includes(r.id);
    const k = READINGS.indexOf(r), next = READINGS[k + 1];
    box.innerHTML = `
      <article class="deep-article reading">
        <a class="back-link" href="#/reading">${arrowL}<span>All readings</span></a>
        <header class="deep-head">
          <p class="kicker">${esc(r.type)} <span class="kicker-sep"></span> <span class="lv-tag" style="--c:${LEVELS[r.level].color}">${r.level}</span></p>
          <h1 class="display">${esc(r.title)}</h1>
          <p class="deep-ko-big" lang="ko">${esc(r.titleKo)}</p>
          <p class="lede">${esc(r.intro)}</p>
          ${u ? `<p class="deep-places">Goes with <a href="${placeHref(i)}"><span lang="ko">${esc(u.place)}</span> ${esc(u.placeEn)}</a></p>` : ""}
        </header>
        ${readingLinesHTML(r)}
        <section class="lesson-block">
          <h3 class="block-h">Words</h3>
          <ul class="gloss" lang="ko">${r.gloss.map(([w, m]) => `<li><a href="#/dictionary?q=${encodeURIComponent(w.split(/[ /]/)[0])}">${esc(w)}</a><span>${esc(m)}</span></li>`).join("")}</ul>
        </section>
        <section class="lesson-block">
          <div class="practice-head"><h3 class="block-h">Check your understanding</h3><span class="score" id="score"></span></div>
          <div class="qlist">${qs.map((q, n) => questionHTML(q, n + 1)).join("")}</div>
        </section>
        <div class="lesson-actions">
          <button class="btn ${done ? "btn-done" : "btn-primary"}" type="button" id="readToggle">${done ? "Read ✓ Mark as unread" : "Mark as read"}</button>
          ${next ? `<a class="btn btn-ghost" href="#/reading/${next.id}">Next: ${esc(next.title)}</a>` : ""}
        </div>
      </article>`;
    let right = 0, n = 0;
    wireQuestions(box, qs, (q, ok) => { n++; if (ok) right++; $("#score").textContent = `${right} of ${qs.length} correct`; recordResult(q, ok); });
    $("#readToggle").addEventListener("click", () => {
      if (done) state.readDone = state.readDone.filter(x => x !== r.id); else { state.readDone.push(r.id); markActive(); }
      save(); const y = scrollY; renderReading(r.id); scrollTo(0, y);
    });
  }

  /* ═════════ Daily diary ═════════ */
  const DIARY_PROMPTS = [
    { lv: "A1", ko: "오늘 아침에 뭐 먹었어요?", en: "What did you eat this morning?" },
    { lv: "A1", ko: "오늘 날씨가 어땠어요?", en: "How was the weather today?" },
    { lv: "A1", ko: "오늘 누구를 만났어요?", en: "Who did you meet today?" },
    { lv: "A1", ko: "지금 어디에 있어요? 거기에 뭐가 있어요?", en: "Where are you now? What's there?" },
    { lv: "A2", ko: "이번 주말에 뭘 할 거예요?", en: "What will you do this weekend?" },
    { lv: "A2", ko: "요즘 제일 좋아하는 음식은 뭐예요? 왜요?", en: "What's your favorite food these days, and why?" },
    { lv: "A2", ko: "오늘 하고 싶었는데 못 한 일이 있어요?", en: "Is there something you wanted to do today but couldn't?" },
    { lv: "A2", ko: "집에서 학교나 회사까지 어떻게 가요?", en: "How do you get from home to school or work?" },
    { lv: "B1", ko: "최근에 처음 해 본 일을 써 보세요.", en: "Write about something you did for the first time recently." },
    { lv: "B1", ko: "요즘 보고 있는 드라마나 책을 소개해 주세요.", en: "Introduce a show or book you're into." },
    { lv: "B1", ko: "오늘 고마웠던 사람에게 짧은 편지를 써 보세요.", en: "Write a short note to someone you're grateful to today." },
    { lv: "B1", ko: "어렸을 때 자주 하던 놀이는 뭐였어요?", en: "What did you often play as a child?" },
    { lv: "B2", ko: "요즘 관심 있는 뉴스와 내 생각을 써 보세요.", en: "A news story you've been following, and what you think." },
    { lv: "B2", ko: "내가 사는 도시의 장점과 단점을 비교해 보세요.", en: "Compare the pros and cons of the city you live in." },
    { lv: "B2", ko: "한국어를 배우면서 가장 어려웠던 점은 뭐예요?", en: "What has been hardest about learning Korean?" },
    { lv: "C1", ko: "최근에 생각이 바뀐 일이 있다면 그 과정을 써 보세요.", en: "Something you changed your mind about, and how." },
    { lv: "C1", ko: "10년 후의 나에게 편지를 써 보세요.", en: "Write a letter to yourself in ten years." },
    { lv: "C2", ko: "오늘 하루를 한 편의 짧은 수필처럼 써 보세요.", en: "Write today as a short essay." },
    { lv: "C2", ko: "좋아하는 속담 하나를 골라 내 경험과 연결해 보세요.", en: "Pick a proverb you like and connect it to your own life." }
  ];
  function diaryLevel() {
    const u = UNITS[currentUnit()];
    const lv = state.startLevel && levelIdx(state.startLevel) > levelIdx(u.level) ? state.startLevel : u.level;
    return lv === "A0" ? "A1" : lv;
  }
  function diaryPrompt(dayKey) {
    const pool = DIARY_PROMPTS.filter(p => p.lv === diaryLevel());
    const n = [...dayKey].reduce((s, c) => s + c.charCodeAt(0), 0);
    return (pool.length ? pool : DIARY_PROMPTS)[n % (pool.length || DIARY_PROMPTS.length)];
  }
  function diaryStreak() {
    let n = 0, t = Date.now();
    const has = k => state.diary[k] && state.diary[k].trim();
    if (!has(todayKey(t))) t -= DAY;
    while (has(todayKey(t))) { n++; t -= DAY; }
    return n;
  }
  function renderDiary() {
    const today = todayKey();
    const p = diaryPrompt(today);
    const past = Object.entries(state.diary).filter(([k, t]) => k !== today && t && t.trim()).sort((a, b) => b[0].localeCompare(a[0]));
    const fmt = k => new Date(k + "T12:00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    $("#diaryBody").innerHTML = `
      <section class="diary-today">
        <div class="diary-top">
          <p class="kicker">${fmt(today)}</p>
          <p class="diary-streak"><span class="today-num">${diaryStreak()}</span> ${diaryStreak() === 1 ? "day" : "days"} in a row</p>
        </div>
        <p class="diary-prompt" lang="ko">${esc(p.ko)} ${speakBtn(p.ko)}</p>
        <p class="diary-prompt-en">${esc(p.en)} <span class="muted">· ${p.lv} prompt. Write about anything you like, too.</span></p>
        <label class="sr-only" for="diaryIn">Today's diary</label>
        <textarea id="diaryIn" class="draft diary-text" lang="ko" rows="9" placeholder="오늘은…">${esc(state.diary[today] || "")}</textarea>
        <p class="draft-meta"><span id="diaryCount"></span> Saved as you type.</p>
        <button type="button" class="btn btn-small btn-ghost" id="diaryCheck">Check common mistakes</button>
        <div class="tool-out" id="diaryOut" aria-live="polite"></div>
      </section>
      ${past.length ? `<section class="diary-past"><h2 class="sub-h">Earlier entries</h2><ul class="drafts">${past.map(([k, t]) => `<li><p class="draft-title">${fmt(k)}</p><p class="draft-text" lang="ko">${esc(t)}</p></li>`).join("")}</ul></section>` : ""}`;
    const ta = $("#diaryIn"), cnt = $("#diaryCount");
    const count = () => { const n = (ta.value.match(/[가-힣]/g) || []).length; cnt.textContent = `${n} Korean ${n === 1 ? "syllable" : "syllables"}.`; };
    count();
    let t;
    ta.addEventListener("input", () => {
      count(); clearTimeout(t);
      t = setTimeout(() => { state.diary[today] = ta.value; if (ta.value.trim()) markActive(); save(); $(".diary-streak .today-num").textContent = diaryStreak(); }, 400);
    });
    $("#diaryCheck").addEventListener("click", () => { $("#diaryOut").innerHTML = spellHTML(ta.value); });
  }

  /* ═════════ Settings ═════════ */
  function renderSettings() {
    $("#settingsBody").innerHTML = `
      <section class="set-block">
        <h2 class="sub-h">Backup</h2>
        <p class="backup-title">Your progress lives in this browser only.</p>
        <p class="backup-sub" id="backupStatus"></p>
        <div class="backup-actions">
          <button class="btn btn-small btn-ghost" id="exportBtn" type="button">Download backup</button>
          <button class="btn btn-small btn-ghost" id="importBtn" type="button">Restore from backup</button>
          <input type="file" id="importFile" accept="application/json,.json" hidden />
        </div>
      </section>
      <section class="set-block">
        <h2 class="sub-h">Learning</h2>
        <label class="switch"><input type="checkbox" id="setRoam" ${state.freeRoam ? "checked" : ""} /><span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span><span class="switch-label">Unlock all places on the map</span></label>
        <label class="switch"><input type="checkbox" id="setSplash" ${state.showSplash !== false ? "checked" : ""} /><span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span><span class="switch-label">Show the start screen when the app opens</span></label>
      </section>
      <section class="set-block">
        <h2 class="sub-h">Audio</h2>
        <label class="switch"><input type="checkbox" id="setTTS" ${state.ttsFallback !== false ? "checked" : ""} /><span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span><span class="switch-label">Use the browser's voice when a recording is missing</span></label>
        <p class="backup-sub">Recordings are played from the <code>voices</code> folder. The list has one line per file: its name, the Korean text, and where it appears.</p>
        <div class="backup-actions"><button class="btn btn-small btn-ghost" id="voiceListBtn" type="button">Download the recording list</button><span class="muted" id="voiceCount"></span></div>
      </section>
      <section class="set-block">
        <h2 class="sub-h">Start over</h2>
        <p class="backup-sub">Clears lessons, saved words, mistakes, writing, diary and notes in this browser.</p>
        <div class="backup-actions"><button class="btn btn-small btn-ghost danger" id="resetBtn" type="button">Reset progress</button></div>
      </section>`;
    renderBackupStatus();
    $("#voiceCount").textContent = `${collectVoiceLines().length} lines`;
    $("#voiceListBtn").addEventListener("click", downloadVoiceList);
    $("#setRoam").addEventListener("change", e => { state.freeRoam = e.target.checked; $("#freeRoam").checked = state.freeRoam; save(); });
    $("#setSplash").addEventListener("change", e => { state.showSplash = e.target.checked; save(); });
    $("#setTTS").addEventListener("change", e => { state.ttsFallback = e.target.checked; save(); });
    $("#resetBtn").addEventListener("click", () => {
      if (!confirm("Reset all progress? Lessons, saved words, mistakes, writing, diary and notes will be cleared. Download a backup first if you might want them back.")) return;
      try { localStorage.removeItem(STORE_KEY); localStorage.removeItem("lss:progress:v1"); } catch {}
      Object.assign(state, freshState());
      $("#freeRoam").checked = false;
      save(); renderSettings(); toast("Progress reset.");
    });
  }

  /* ═════════ Init ═════════ */
  function init() {
    renderLegend();
    updateBadges();
    const roam = $("#freeRoam");
    roam.checked = state.freeRoam;
    roam.addEventListener("change", () => { state.freeRoam = roam.checked; save(); renderMap(); });
    $("#heroStart").addEventListener("click", () => openUnit(currentUnit()));
    $("#placementBtn").addEventListener("click", e => openPlacement(e.currentTarget));
    $("#notesFab").addEventListener("click", toggleNotes);
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#notesPanel").hidden && !drawer.classList.contains("open")) toggleNotes(); });
    $("#splashGo").addEventListener("click", () => hideSplash());
    $("#splashPlace").addEventListener("click", () => hideSplash(() => openPlacement()));
    let seen = false;
    try { seen = sessionStorage.getItem("lss:splash") === "1"; } catch {}
    const atHome = !location.hash || location.hash === "#/" || location.hash === "#";
    if (atHome && !seen && state.showSplash !== false) showSplash();
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register("sw.js").catch(() => {});
    route();
    const scroller = $("#mapScroll"), u = UNITS[currentUnit()];
    requestAnimationFrame(() => {
      const scale = $("#mapSvg").getBoundingClientRect().width / 1000;
      scroller.scrollLeft = Math.max(0, u.x * scale - scroller.clientWidth / 2);
    });
  }
  init();
})();
