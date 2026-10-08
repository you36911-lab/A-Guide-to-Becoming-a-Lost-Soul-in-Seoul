/* =========================================================
   build-review-doc.js
   Exports every piece of learning material in the app into one Word
   document for review. Run from the project folder:
     node tools/build-review-doc.js  →  learning-material-review.docx
   IDs in [brackets] tell the app where each item lives; keep them.
   ========================================================= */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, AlignmentType, TableOfContents, PageBreak, LevelFormat, Footer, PageNumber
} = require("docx");

const root = path.resolve(__dirname, "..");
const read = f => fs.readFileSync(path.join(root, f), "utf8");

// ── load the app's data in a sandbox
const ctx = { window: {}, console };
vm.createContext(ctx);
const K = require(path.join(root, "engine.js"));
for (const f of ["curriculum.js", "practice.js", "curriculum-more.js", "curriculum-edits.js", "dictionary.js", "hanja.js", "deepdives.js", "readings.js"]) {
  vm.runInContext(read(f).replace(/^const (\w+) =/gm, "var $1 =").replace(/^let (\w+) =/gm, "var $1 ="), ctx, { filename: f });
}
const { LEVELS, UNITS, PRACTICE, PLACEMENT, PROVERBS, DICTIONARY, HANJA, HANJA_SETS, DEEP_DIVES, READINGS } = ctx;

// texts that live in renderer.js
const R = read("renderer.js");
const between = (a, b) => { const i = R.indexOf(a); const j = R.indexOf(b, i); return i < 0 || j < 0 ? "" : R.slice(i, j); };
const guidesBlock = between("const GUIDES = {", "function guideKey()");
const diaryPrompts = [...between("const DIARY_PROMPTS = [", "];").matchAll(/\{ lv: "(\w+)", ko: "([^"]+)", en: "([^"]+)" \}/g)].map(m => ({ lv: m[1], ko: m[2], en: m[3] }));
const introLead = (R.match(/<p class="intro-lead">([^<]+)<\/p>/) || [])[1] || "";
const introHow = [...(between('<ul class="intro-list-how">', "</ul>").matchAll(/<li>([^<]+)<\/li>/g))].map(m => m[1]);
const toolSubs = [...R.matchAll(/<h2 id="t\w">([^<]+)<\/h2>\s*<p class="tool-sub">([^<]+)<\/p>/g)].map(m => ({ t: m[1].trim(), sub: m[2] }));
const samplesPron = (R.match(/\["같이", "신라"[^\]]*\]/) || [""])[0];
const samplesConj = (R.match(/\["먹다", "가다", "하다"[^\]]*\]/) || [""])[0];
const glyphNotes = [...R.matchAll(/<li><span class="gn-l" lang="ko">([^<]+)<\/span><span>([^<]+)<\/span><\/li>/g)].map(m => [m[1], m[2]]);
const H = read("index.html");
const splashKo = (H.match(/<p class="splash-ko" lang="ko">([^<]+)<\/p>/) || [])[1];
const splashSub = (H.match(/<p class="splash-sub">([^<]+)<\/p>/) || [])[1];

// ── document helpers
const FONT = { ascii: "Arial", hAnsi: "Arial", eastAsia: "Malgun Gothic", cs: "Arial" };
const body = [];
const P = (runs, opt = {}) => body.push(new Paragraph({ children: (Array.isArray(runs) ? runs : [runs]).map(r => typeof r === "string" ? new TextRun(r) : r), ...opt }));
const T = (text, o = {}) => new TextRun({ text, ...o });
const id = s => T(`  [${s}]`, { color: "8C827B", size: 18 });
const h1 = t => body.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [T(t)] }));
const h2 = (t, tag) => body.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [T(t), ...(tag ? [id(tag)] : [])] }));
const h3 = (t, tag) => body.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: [T(t), ...(tag ? [id(tag)] : [])] }));
const label = t => P(T(t, { bold: true, color: "B4445C", size: 18 }), { spacing: { before: 160, after: 60 } });
const bullet = (runs, lvl = 0) => P(runs, { numbering: { reference: "bullets", level: lvl } });
const para = t => P(T(t), { spacing: { after: 100 } });

const W = 9026; // A4 text width with 1" margins (DXA)
const border = { style: BorderStyle.SINGLE, size: 4, color: "DED4CC" };
const borders = { top: border, bottom: border, left: border, right: border };
function table(head, rows) {
  const n = head.length, w = Math.floor(W / n), widths = Array(n).fill(w);
  widths[n - 1] = W - w * (n - 1);
  const cell = (t, i, hd) => new TableCell({
    borders, width: { size: widths[i], type: WidthType.DXA },
    shading: hd ? { fill: "F4F1ED", type: ShadingType.CLEAR, color: "auto" } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ children: [T(String(t ?? ""), hd ? { bold: true, size: 18 } : { size: 20 })] })]
  });
  body.push(new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: widths,
    rows: [new TableRow({ tableHeader: true, children: head.map((t, i) => cell(t, i, true)) }), ...rows.map(r => new TableRow({ children: r.map((t, i) => cell(t, i, false)) }))]
  }));
  P("");
}
const letters = "ABCDEFGH";
function mcq(n, q, opts, ans, why) {
  P([T(`${n}. `, { bold: true }), T(q, { bold: true })], { spacing: { before: 120, after: 40 } });
  opts.forEach((o, k) => P([T(`${letters[k]}) `), T(o, k === ans ? { bold: true } : {}), ...(k === ans ? [T("   ✓ correct", { color: "3C7A57", bold: true, size: 18 })] : [])], { indent: { left: 400 } }));
  if (why) P([T("Explanation: ", { italics: true, color: "6E6560", size: 19 }), T(why, { italics: true, color: "6E6560", size: 19 })], { indent: { left: 400 }, spacing: { after: 80 } });
}

// practice items, with drills worked out by the engine
function practiceFor(key) {
  const out = [];
  (PRACTICE[key] || []).forEach(item => {
    if (Array.isArray(item)) out.push({ kind: "mc", q: item[0], o: item[1], a: item[2], why: item[3] });
    else if (item.order) out.push({ kind: "order", q: item.q, order: item.order, why: item.why });
    else if (item.drill === "pron") item.words.forEach(w => { const r = K.pronounce(w); out.push({ kind: "drill", q: `How is ${w} pronounced?`, a: `[${r.text}]`, why: r.rules.map(x => K.RULES[x].name).join(", ") || "as written" }); });
    else if (item.drill === "conj") item.words.forEach(w => out.push({ kind: "drill", q: `${w} → ${K.FORMS[item.form].ko} (${K.FORMS[item.form].en})`, a: K.conjugate(w, item.form), why: K.irregularType(w) ? `${K.irregularType(w)}${K.irregularType(w).includes("탈락") ? "" : " 불규칙"}` : "regular" }));
    else if (item.drill === "num") item.items.forEach(([kind, a, b]) => out.push({ kind: "drill", q: kind === "time" ? `How do you read ${a}:${String(b).padStart(2, "0")}?` : kind === "price" ? `How do you read ₩${a.toLocaleString("en-US")}?` : `How do you say month ${a}?`, a: kind === "time" ? K.readTime(a, b) : kind === "price" ? K.readPrice(a) : K.readMonth(a), why: "" }));
  });
  return out;
}
function renderPractice(key) {
  const qs = practiceFor(key);
  if (!qs.length) return;
  label(`PRACTICE (${qs.length})`);
  qs.forEach((q, k) => {
    if (q.kind === "mc") mcq(k + 1, q.q, q.o, q.a, q.why);
    else if (q.kind === "order") { P([T(`${k + 1}. `, { bold: true }), T(q.q, { bold: true }), T("  (word order)", { color: "6E6560", size: 18 })], { spacing: { before: 120 } }); P([T("Answer: "), T(q.order.join(" "), { bold: true })], { indent: { left: 400 } }); if (q.why) P(T(q.why, { italics: true, color: "6E6560", size: 19 }), { indent: { left: 400 } }); }
    else { P([T(`${k + 1}. `, { bold: true }), T(q.q, { bold: true }), T("  (auto-generated from the engine)", { color: "6E6560", size: 16 })], { spacing: { before: 120 } }); P([T("Answer: "), T(q.a, { bold: true }), ...(q.why ? [T(`   (${q.why})`, { color: "6E6560", size: 18 })] : [])], { indent: { left: 400 } }); }
  });
}

// ── cover and how to review
body.push(new Paragraph({ heading: HeadingLevel.TITLE, children: [T("A Guide to Becoming a Lost Soul in Seoul")] }));
P(T("All learning material, for review", { size: 30, color: "6E6560" }), { spacing: { after: 240 } });
para(`Exported from the app on ${new Date().toISOString().slice(0, 10)}. ${UNITS.length} neighborhoods, ${UNITS.reduce((n, u) => n + u.lessons.length, 0)} lessons and missions, ${READINGS.length} readings, ${DEEP_DIVES.length} deep dives, ${PROVERBS.length} proverbs and idioms, ${HANJA.length} Hanja, ${DICTIONARY.length} core dictionary words.`);
label("HOW TO REVIEW");
bullet("Edit directly with Track Changes on (Review → Track Changes), or leave comments. Both come back to me intact.");
bullet("Keep the grey IDs in [brackets]. They tell the app where each item lives, e.g. [hongdae:3] is lesson 4 in Hongdae.");
bullet("Questions marked “auto-generated” come from the pronunciation and conjugation engine. If an answer is wrong, the fix goes into the engine, so just mark it.");
bullet("You can also suggest moving, adding or deleting items: just write it in a comment next to the item.");
bullet("Word may ask to update fields when you open the file. Say yes to fill in the table of contents.");
body.push(new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-2" }));

// ── Part 1: app texts
h1("Part 1 · App texts");
h2("Start screen");
para(`Title: A Guide to Becoming a Lost Soul in Seoul`);
para(`Korean line: ${splashKo}`);
para(`Description: ${splashSub}`);
h2("Welcome card (before the first tour)", "intro");
para("Welcome, wanderer.");
para(introLead);
label("HOW IT WORKS");
introHow.forEach(t => bullet(t));
h2("Levels (times of day)");
table(["Code", "Korean", "English"], Object.entries(LEVELS).map(([k, v]) => [k, v.ko, v.en]));
h2("Guided tours (red crayon notes)", "guides");
[...guidesBlock.matchAll(/^\s{4}"?([\w-]+)"?: \[([\s\S]*?)^\s{4}\]/gm)].forEach(m => {
  h3(m[1]);
  [...m[2].matchAll(/\[([^\n]*)\]/g)].forEach(line => {
    const strs = [...line[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map(x => x[1]).filter(s => !/^[#.\[]|^nav:|^union:|shape|circle|wave|side|right/.test(s) && s.length > 3);
    if (strs.length) bullet(strs.join("  /  "));
  });
});

// ── Part 2: neighborhoods and lessons
h1("Part 2 · Neighborhoods and lessons");
UNITS.forEach((u, i) => {
  const lv = LEVELS[u.level];
  h2(`${String(i + 1).padStart(2, "0")} · ${u.place} ${u.placeEn} — ${u.level} ${lv.ko}`, u.id);
  P([T(u.title, { bold: true }), T(`  ${u.titleKo}`)]);
  para(u.blurb);
  if (u.fact) { label("FUN FACT (알고 있었나요?)"); para(u.fact); }
  if (u.ref) { label("CURRICULUM REFERENCES (internal, not shown in the app)"); u.ref.forEach(r => bullet(r)); }
  u.lessons.forEach((l, j) => {
    const key = `${u.id}:${j}`;
    h3(`${l.kind === "mission" ? "Mission" : `Lesson ${j + 1}`}: ${l.t} · ${l.k}`, key);
    para(l.s);
    label(l.kind === "mission" ? "CHECKLIST" : "KEY IDEAS");
    l.p.forEach(p => bullet(p.replace(/==/g, "")));
    if (l.table) { label("TABLE"); table(l.table.head, l.table.rows); }
    if (l.figure) para(`[Interactive figure: ${l.figure}${l.ghost ? `, trace text “${l.ghost}”` : ""}]`);
    label(l.kind === "mission" ? "USEFUL EXPRESSIONS" : "EXAMPLES");
    l.ex.forEach(x => Array.isArray(x) ? bullet([T(x[0]), T(`  — ${x[1]}`, { color: "6E6560", italics: true })]) : bullet(x));
    if (l.kind !== "mission") renderPractice(key);
  });
});

// ── Part 3: reading room
h1("Part 3 · Reading room");
READINGS.forEach(r => {
  const u = UNITS.find(x => x.id === r.unit);
  h2(`${r.title} · ${r.titleKo} — ${r.level}, ${r.type}`, `reading:${r.id}`);
  P(T(`Goes with ${u ? `${u.place} ${u.placeEn}` : r.unit}`, { color: "6E6560", size: 18 }));
  para(r.intro);
  label("TEXT");
  r.lines.forEach(l => P(T(l), { indent: { left: 300 }, spacing: { after: 60 } }));
  label("WORDS");
  table(["Korean", "English"], r.gloss);
  label("QUESTIONS");
  r.q.forEach((q, k) => mcq(k + 1, q[0], q[1], q[2], q[3]));
});

// ── Part 4: deep dives
h1("Part 4 · Deep dives (premium)");
DEEP_DIVES.slice().sort((a, b) => Object.keys(LEVELS).indexOf(a.level) - Object.keys(LEVELS).indexOf(b.level)).forEach(d => {
  h2(`${d.title} · ${d.titleKo} — ${d.level}`, `deep:${d.id}`);
  P(T(`Builds on: ${d.places.map(p => (UNITS.find(u => u.id === p) || {}).place || p).join(", ")}`, { color: "6E6560", size: 18 }));
  para(d.lede);
  d.sections.forEach(s => {
    h3(s.h);
    (s.p || []).forEach(t => para(t));
    if (s.table) table(s.table.head, s.table.rows);
    if (s.ex) { label("EXAMPLES"); s.ex.forEach(x => bullet(x)); }
  });
  if (d.tool) para(`[Interactive tool: ${d.tool}]`);
  if (d.q) { label("PRACTICE"); d.q.forEach((q, k) => mcq(k + 1, q[0], q[1], q[2], q[3])); }
});

// ── Part 5: proverbs, diary, placement
h1("Part 5 · Proverbs, diary prompts, level check");
h2("Proverb and idiom of the day", "proverbs");
table(["#", "Korean", "Hanja", "English"], PROVERBS.map((p, k) => [k + 1, p[0], p[2] || "", p[1]]));
h2("Daily diary prompts", "diary");
table(["Level", "Korean", "English"], diaryPrompts.map(p => [p.lv, p.ko, p.en]));
h2("Level check (placement test)", "placement");
Object.entries(PLACEMENT).forEach(([lv, qs]) => { h3(lv); qs.forEach((q, k) => mcq(k + 1, q[0], q[1], q[2])); });

// ── Part 6: Hanja
h1("Part 6 · Hanja (premium)");
HANJA_SETS.forEach(set => {
  h2(`${set.name} · ${set.en}`, `hanja:${set.id}`);
  table(["Hanja", "훈 음", "Meaning", "Example words"], HANJA.filter(h => (h[5] || "8") === set.id).map(h => [h[0], `${h[1]} ${h[2]}`, h[3], h[4].map(w => `${w[0]} ${w[1]} (${w[2]})`).join("; ")]));
});

// ── Part 7: core dictionary
h1("Part 7 · Core dictionary");
para("These are the hand-written core entries. The 56,000 entries from 한국어기초사전 are not included here.");
table(["Word", "Part of speech", "English", "Level", "Hanja"], DICTIONARY.map(e => [e[0], e[1], e[2], e[3], e[4] || ""]));

// ── Part 8: lab
h1("Part 8 · Lab");
h2("Tool descriptions", "lab");
toolSubs.forEach(t => { h3(t.t); para(t.sub); });
h2("Sample words");
para(`Pronunciation: ${samplesPron.replace(/[\[\]"]/g, "")}`);
para(`Conjugation: ${samplesConj.replace(/[\[\]"]/g, "")}`);
h2("Letterform notes");
table(["Letters", "Note"], glyphNotes);
h2("Common-mistake checker rules", "spell");
table(["Pattern", "Correction", "Note"], K.SPELL_RULES.map(r => [String(r.re).replace(/^\/|\/g$/g, ""), typeof r.fix === "function" ? "(computed)" : r.fix, r.note || ""]));
h2("Pronunciation exceptions (words the rules can't predict)", "exceptions");
table(["Word", "Pronunciation", "Why"], Object.entries(K.EXCEPTIONS).map(([w, [p, rs]]) => [w, `[${p}]`, rs.map(x => K.RULES[x].name).join(", ")]));

// ── build
const doc = new Document({
  features: { updateFields: true },
  creator: "Sooya", title: "A Guide to Becoming a Lost Soul in Seoul: learning material",
  styles: {
    default: { document: { run: { font: FONT, size: 21 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal", run: { size: 48, bold: true, font: FONT }, paragraph: { spacing: { after: 120 } } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 36, bold: true, font: FONT, color: "2A2422" }, paragraph: { spacing: { before: 240, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 28, bold: true, font: FONT, color: "2A2422" }, paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 1, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "E46F86", space: 2 } } } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 23, bold: true, font: FONT, color: "B4445C" }, paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 2 } }
    ]
  },
  numbering: { config: [{ reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 500, hanging: 260 } } } }] }] },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "8C827B" })] })] }) },
    children: body
  }]
});
const out = path.join(root, process.argv[2] || "learning-material-review.docx");
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(out, buf); console.log("wrote", out, (buf.length / 1024).toFixed(0) + " KB"); });
