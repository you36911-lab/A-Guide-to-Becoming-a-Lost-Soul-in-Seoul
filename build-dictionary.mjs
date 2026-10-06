/* =========================================================
   build-dictionary.mjs
   Turns the 한국어기초사전 full download (XML, LMF) into the files the
   app loads on demand:
     dictionary-full.js          search index: every entry, small fields
     dict-details/NN.js          details per block of 2,000 entries
                                 (Korean definition, examples), loaded when
                                 an entry is opened

   Usage:
     node tools/build-dictionary.mjs <folder with the .xml files>

   Source: 국립국어원 한국어기초사전 (https://krdict.korean.go.kr),
   CC BY-SA 2.0 KR. The generated files keep that license.
   ========================================================= */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, statSync } from "node:fs";
import { join, extname, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const inDir = resolve(process.argv[2] || "./krdict");
const BLOCK = 2000;

const files = readdirSync(inDir).filter(f => extname(f).toLowerCase() === ".xml")
  .sort((a, b) => parseInt(a) - parseInt(b) || a.localeCompare(b));
if (!files.length) { console.error(`No .xml files found in ${inDir}`); process.exit(1); }

const decodeOnce = s => s
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&amp;/g, "&");
const decode = s => decodeOnce(decodeOnce(s)); // some values are escaped twice
const feat = (xml, name) => {
  const m = xml.match(new RegExp(`<feat\\s+att="${name}"\\s+val="([^"]*)"`));
  return m ? decode(m[1]).trim() : "";
};
const feats = (xml, name) => [...xml.matchAll(new RegExp(`<feat\\s+att="${name}"\\s+val="([^"]*)"`, "g"))].map(m => decode(m[1]).trim());

const POS = { "명사": "noun", "대명사": "pronoun", "수사": "numeral", "동사": "verb", "형용사": "adjective",
  "관형사": "determiner", "부사": "adverb", "조사": "particle", "감탄사": "interjection", "의존 명사": "bound noun",
  "보조 동사": "auxiliary verb", "보조 형용사": "auxiliary adjective", "어미": "ending", "접사": "affix", "품사 없음": "" };
const UNIT = { "단어": "", "구": "phrase", "관용구": "idiom", "속담": "proverb", "문법‧표현": "grammar" };
const LEVEL = { "초급": "초급", "중급": "중급", "고급": "고급" };
const noEquivalent = s => !s || /^\(.*\)$/.test(s) || /no equivalent/i.test(s);
const short = (s, n) => s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s;

const index = [];   // [word, pos, english, level, hanja, pronunciation, homonym, unit]
const details = []; // [korean definitions (up to 3), english definition, examples (up to 3)]
let total = 0;

for (const f of files) {
  const xml = readFileSync(join(inDir, f), "utf8");
  for (const raw of xml.split(/<LexicalEntry\b/).slice(1)) {
    total++;
    const end = raw.indexOf("</LexicalEntry>");
    const b = end >= 0 ? raw.slice(0, end) : raw;
    const head = b.split(/<Sense\b/)[0];
    const lemmaBlock = (head.match(/<Lemma>([\s\S]*?)<\/Lemma>/) || [])[1] || head;
    const word = feat(lemmaBlock, "writtenForm");
    if (!word || !/[가-힣]/.test(word)) continue;

    const posKo = feat(head, "partOfSpeech");
    const unit = UNIT[feat(head, "lexicalUnit")] ?? "";
    const level = LEVEL[feat(head, "vocabularyLevel")] || "";
    const homonym = parseInt(feat(head, "homonym_number")) || 0;
    const origin = feat(head, "origin");
    const hanja = /[\u4E00-\u9FFF]/.test(origin) ? origin : "";
    const wf = (head.match(/<WordForm>[\s\S]*?<\/WordForm>/) || [""])[0];
    const pron = feat(wf, "pronunciation");

    const senses = b.split(/<Sense\b/).slice(1);
    const en = [], defsKo = [], ex = [];
    let enDef = "";
    for (const s of senses) {
      const sBody = s.split(/<Equivalent\b/)[0];
      const d = feat(sBody, "definition");
      if (d && defsKo.length < 3) defsKo.push(d);
      if (ex.length < 3) {
        const exBlocks = sBody.split(/<SenseExample\b/).slice(1);
        for (const e of exBlocks) {
          if (feat(e, "type") === "문장") { const t = feat(e, "example"); if (t && !ex.includes(t)) { ex.push(t); break; } }
        }
      }
      for (const e of s.split(/<Equivalent\b/).slice(1)) {
        if (feat(e, "language") !== "영어") continue;
        const l = feat(e, "lemma");
        if (!noEquivalent(l)) { if (!en.includes(l) && en.length < 3) en.push(l); }
        if (!enDef) enDef = feat(e, "definition");
        break;
      }
    }
    // Endings, particles and affixes often get only a romanization as their "equivalent"
    // (e.g. -아서 → "-aseo"); grammar patterns and proverbs often get none. Use the
    // English definition for those instead.
    const functional = ["particle", "ending", "affix", "auxiliary verb", "auxiliary adjective", "bound noun"].includes(POS[posKo]) || unit === "grammar";
    const parts = [...new Set(en.join(", ").split(/\s*[;,]\s*/).filter(Boolean))].slice(0, 5);
    const onlyRomanized = parts.length === 1 && /^-?[a-z]+$/.test(parts[0]) && functional;
    const english = parts.length && !onlyRomanized ? parts.join("; ") : enDef ? short(enDef, 110) : parts.join("; ");
    if (!english && !defsKo.length) continue;

    index.push([word, POS[posKo] ?? posKo, english, level, hanja, pron, homonym, unit]);
    details.push([defsKo, enDef, ex]);
  }
}

// sort by word, then homonym number; keep details aligned
const order = index.map((_, i) => i).sort((a, b) => index[a][0].localeCompare(index[b][0], "ko") || index[a][6] - index[b][6]);
const idx = order.map(i => index[i]);
const det = order.map(i => details[i]);

const license = `Source: 국립국어원 한국어기초사전 (https://krdict.korean.go.kr), CC BY-SA 2.0 KR.
   This file is licensed under CC BY-SA 2.0 KR.`;
writeFileSync(join(root, "dictionary-full.js"),
  `/* Generated by tools/build-dictionary.mjs on ${new Date().toISOString().slice(0, 10)}.
   ${license}
   [word, part of speech, english, 초급/중급/고급, hanja, pronunciation, homonym number, unit] */
window.DICTIONARY_FULL = ${JSON.stringify(idx)};
window.DICTIONARY_FULL_BLOCK = ${BLOCK};\n`);

const detDir = join(root, "dict-details");
rmSync(detDir, { recursive: true, force: true });
mkdirSync(detDir);
for (let i = 0; i * BLOCK < det.length; i++) {
  const name = String(i).padStart(2, "0");
  writeFileSync(join(detDir, `${name}.js`),
    `/* ${license} */\n(window.DICTIONARY_DETAILS = window.DICTIONARY_DETAILS || {})[${i}] = ${JSON.stringify(det.slice(i * BLOCK, (i + 1) * BLOCK))};\n`);
}

const mb = p => (statSync(p).size / 1048576).toFixed(1);
const units = idx.reduce((m, e) => (m[e[7] || "word"] = (m[e[7] || "word"] || 0) + 1, m), {});
console.log(`Read ${total} entries from ${files.length} files.`);
console.log(`dictionary-full.js: ${idx.length} entries, ${mb(join(root, "dictionary-full.js"))} MB`, units);
console.log(`dict-details/: ${Math.ceil(det.length / BLOCK)} files`);
