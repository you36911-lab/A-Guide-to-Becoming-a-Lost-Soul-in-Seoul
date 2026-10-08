/* =========================================================
   KoEngine — Hangul tools that power the lab, drills and dictionary
   - decompose / compose syllables
   - pronounce(): standard pronunciation by rule (표준 발음법)
   - conjugate(): verb/adjective endings incl. irregulars
   - readSino / readNative / readTime / readPrice
   ========================================================= */

(function (root) {
  "use strict";

  const CHO  = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
  const JUNG = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];
  const JONG = ["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];

  const isSyl = ch => { const c = ch.charCodeAt(0); return c >= 0xAC00 && c <= 0xD7A3; };
  function decompose(ch) {
    const i = ch.charCodeAt(0) - 0xAC00;
    return { cho: CHO[Math.floor(i / 588)], jung: JUNG[Math.floor((i % 588) / 28)], jong: JONG[i % 28] };
  }
  function compose(cho, jung, jong = "") {
    const a = CHO.indexOf(cho), b = JUNG.indexOf(jung), c = JONG.indexOf(jong);
    if (a < 0 || b < 0 || c < 0) return "?";
    return String.fromCharCode(0xAC00 + a * 588 + b * 28 + c);
  }

  /* ───────── Pronunciation ───────── */
  const REP = { // 받침의 대표음 (single finals)
    "ㄱ":"ㄱ","ㄲ":"ㄱ","ㅋ":"ㄱ","ㄴ":"ㄴ","ㄷ":"ㄷ","ㅅ":"ㄷ","ㅆ":"ㄷ","ㅈ":"ㄷ","ㅊ":"ㄷ","ㅌ":"ㄷ","ㅎ":"ㄷ",
    "ㄹ":"ㄹ","ㅁ":"ㅁ","ㅂ":"ㅂ","ㅍ":"ㅂ","ㅇ":"ㅇ"
  };
  const DOUBLE = { // [kept before consonant/end, moved before vowel]
    "ㄳ":["ㄱ","ㅅ"],"ㄵ":["ㄴ","ㅈ"],"ㄶ":["ㄴ","ㅎ"],"ㄺ":["ㄱ","ㄱ"],"ㄻ":["ㅁ","ㅁ"],"ㄼ":["ㄹ","ㅂ"],
    "ㄽ":["ㄹ","ㅅ"],"ㄾ":["ㄹ","ㅌ"],"ㄿ":["ㅂ","ㅍ"],"ㅀ":["ㄹ","ㅎ"],"ㅄ":["ㅂ","ㅅ"]
  };
  const TENSE = { "ㄱ":"ㄲ","ㄷ":"ㄸ","ㅂ":"ㅃ","ㅅ":"ㅆ","ㅈ":"ㅉ" };
  const ASP   = { "ㄱ":"ㅋ","ㄷ":"ㅌ","ㅂ":"ㅍ","ㅈ":"ㅊ" };
  const NASAL = { "ㄱ":"ㅇ","ㄷ":"ㄴ","ㅂ":"ㅁ" };

  const RULES = {
    link:   { ko: "연음", name: "Linking",            en: "A final consonant moves to the next syllable", ref: "제13·14항" },
    rep:    { ko: "받침의 대표음", name: "Seven final sounds",    en: "Finals reduce to one of seven sounds",         ref: "제9·10·11항" },
    hDrop:  { ko: "ㅎ 탈락", name: "Silent ㅎ",          en: "Final ㅎ is silent before a vowel",            ref: "제12항" },
    asp:    { ko: "거센소리되기", name: "Aspiration",      en: "ㅎ merges into ㅋ ㅌ ㅍ ㅊ",                   ref: "제12항" },
    pal:    { ko: "구개음화", name: "Palatalization",          en: "ㄷ, ㅌ + 이 become 지, 치",                      ref: "제17항" },
    nasal:  { ko: "비음화", name: "Nasalization",            en: "ㄱ ㄷ ㅂ become ㅇ ㄴ ㅁ before ㄴ, ㅁ",        ref: "제18항" },
    rNasal: { ko: "ㄹ의 비음화", name: "ㄹ becomes ㄴ",       en: "ㄹ becomes ㄴ after ㅁ, ㅇ (and ㄱ, ㅂ)",        ref: "제19항" },
    liquid: { ko: "유음화", name: "ㄹ-assimilation",            en: "ㄴ next to ㄹ becomes ㄹ",                      ref: "제20항" },
    tense:  { ko: "된소리되기", name: "Tensing",        en: "Plain consonants become tense after ㄱ ㄷ ㅂ", ref: "제23~25항" },
    ui:     { ko: "ㅢ의 발음", name: "ㅢ read as ㅣ",         en: "ㅢ after a consonant is read [ㅣ]",            ref: "제5항" },
    nIns:   { ko: "ㄴ 첨가", name: "Added ㄴ",           en: "An extra ㄴ is added in some compounds",       ref: "제29항" },
    saisiot:{ ko: "사잇소리", name: "Hidden tensing in compounds",          en: "Compound with a hidden tensing (사이시옷)",     ref: "제30항" },
    exception:{ ko: "개별 단어", name: "Set word by word",        en: "Pronunciation set word by word",               ref: "표준국어대사전" }
  };

  // Words whose pronunciation cannot be derived from spelling alone
  const EXCEPTIONS = {
    "물약": ["물략", ["nIns", "liquid"]], "알약": ["알략", ["nIns", "liquid"]],
    "서울역": ["서울력", ["nIns", "liquid"]], "휘발유": ["휘발류", ["nIns", "liquid"]],
    "솜이불": ["솜니불", ["nIns"]], "한여름": ["한녀름", ["nIns"]], "맨입": ["맨닙", ["nIns"]],
    "색연필": ["생년필", ["nIns", "nasal"]], "식용유": ["시굥뉴", ["nIns", "link"]],
    "담요": ["담뇨", ["nIns"]], "깻잎": ["깬닙", ["nIns", "nasal"]], "나뭇잎": ["나문닙", ["nIns", "nasal"]],
    "의견란": ["의견난", ["exception"]], "결단력": ["결딴녁", ["exception"]],
    "맛있다": ["마딛따 / 마싣따", ["exception", "tense"]], "멋있다": ["머딛따 / 머싣따", ["exception", "tense"]],
    "밟다": ["밥따", ["exception", "tense"]], "밟고": ["밥꼬", ["exception", "tense"]],
    "넓죽하다": ["넙쭈카다", ["exception", "tense", "asp"]],
    "물고기": ["물꼬기", ["saisiot"]], "바닷가": ["바다까", ["saisiot"]], "햇빛": ["해삗", ["saisiot", "rep"]],
    "콧물": ["콘물", ["saisiot", "nasal"]], "냇물": ["낸물", ["saisiot", "nasal"]],
    "강가": ["강까", ["saisiot"]], "길가": ["길까", ["saisiot"]], "등불": ["등뿔", ["saisiot"]],
    "문법": ["문뻡", ["saisiot"]], "인기": ["인끼", ["saisiot"]], "효과": ["효과", ["exception"]],
    "겉옷": ["거돋", ["rep", "link"]], "헛웃음": ["허두슴", ["rep", "link"]], "첫인상": ["처딘상", ["rep", "link"]]
  };

  /**
   * pronounce("국물이") → { text: "궁무리", rules: ["nasal","link"], exception: false }
   * Works phrase by phrase. Morpheme boundaries inside compounds can't be seen from
   * spelling, so known compounds are looked up in EXCEPTIONS first.
   */
  function pronounce(input) {
    const raw = (input || "").trim();
    if (!raw) return { text: "", rules: [], exception: false };
    if (EXCEPTIONS[raw]) {
      const [text, rules] = EXCEPTIONS[raw];
      return { text, rules: [...rules], exception: true };
    }

    // build a list of syllables; spaces become boundary flags on the next syllable
    const syl = [];
    let space = false;
    for (const ch of raw) {
      if (ch === " ") { space = true; continue; }
      if (!isSyl(ch)) { syl.push({ other: ch, spaceBefore: space }); space = false; continue; }
      const d = decompose(ch);
      syl.push({ ...d, orig: ch, spaceBefore: space, joinPrev: false });
      space = false;
    }

    const used = new Set();
    const add = r => used.add(r);

    for (let i = 0; i < syl.length; i++) {
      const a = syl[i], b = syl[i + 1];
      if (a.other) continue;
      // special stems
      const stemBalp = a.orig === "밟";

      if (!b || b.other) {
        // end of phrase
        finalize(a, stemBalp);
        continue;
      }
      const J = a.jong, C = b.cho, cross = b.spaceBefore;
      if (!J) continue;

      // ── next syllable starts with a vowel
      if (C === "ㅇ") {
        if (J === "ㅇ") continue;
        if (cross) {
          // across a word boundary: reduce first, then link (옷 안 → [오단])
          const r = DOUBLE[J] ? simplifyEnd(J, stemBalp) : REP[J];
          if (r !== J) add("rep");
          if (r === "ㅇ") { a.jong = r; continue; }
          a.jong = ""; b.cho = r; b.joinPrev = true; add("link");
          continue;
        }
        if (J === "ㅎ") { a.jong = ""; add("hDrop"); continue; }
        if (J === "ㄶ" || J === "ㅀ") { a.jong = ""; b.cho = J === "ㄶ" ? "ㄴ" : "ㄹ"; add("hDrop"); add("link"); continue; }
        if ((J === "ㄷ" || J === "ㅌ" || J === "ㄾ") && b.jung === "ㅣ") {
          if (J === "ㄾ") { a.jong = "ㄹ"; b.cho = "ㅊ"; }
          else { a.jong = ""; b.cho = J === "ㄷ" ? "ㅈ" : "ㅊ"; }
          add("pal"); continue;
        }
        if (DOUBLE[J]) {
          const [keep, move] = DOUBLE[J];
          const first = J === "ㄺ" ? "ㄹ" : J === "ㄻ" ? "ㄹ" : J === "ㄿ" ? "ㄹ" : keep;
          a.jong = first;
          b.cho = move === "ㅅ" ? "ㅆ" : move;
          add("link"); if (move === "ㅅ") add("tense");
          continue;
        }
        a.jong = ""; b.cho = J; add("link");
        continue;
      }

      // ── next syllable starts with ㅎ
      if (C === "ㅎ") {
        if (DOUBLE[J] && (J === "ㄺ" || J === "ㄼ" || J === "ㄵ")) {
          const map = { "ㄺ": ["ㄹ", "ㅋ"], "ㄼ": ["ㄹ", "ㅍ"], "ㄵ": ["ㄴ", "ㅊ"] }[J];
          a.jong = map[0]; b.cho = map[1]; add("asp"); continue;
        }
        if (J === "ㅈ") { a.jong = ""; b.cho = "ㅊ"; add("asp"); joinIfCross(b); continue; }
        const r = REP[J];
        if (r && ASP[r]) { a.jong = ""; b.cho = ASP[r]; add("asp"); if (r !== J) add("rep"); joinIfCross(b); continue; }
        if (DOUBLE[J]) { a.jong = simplifyEnd(J, stemBalp); add("rep"); }
        continue;
      }

      // ── next syllable starts with another consonant
      // final ㅎ family
      if (J === "ㅎ" || J === "ㄶ" || J === "ㅀ") {
        const keep = J === "ㅎ" ? "" : J === "ㄶ" ? "ㄴ" : "ㄹ";
        if (ASP[C]) { a.jong = keep; b.cho = ASP[C]; add("asp"); continue; }
        if (C === "ㅅ") { a.jong = keep; b.cho = "ㅆ"; add("tense"); continue; }
        if (C === "ㄴ") {
          if (J === "ㅎ") { a.jong = "ㄴ"; add("rep"); add("nasal"); }
          else if (J === "ㄶ") { a.jong = "ㄴ"; add("hDrop"); }
          else { a.jong = "ㄹ"; b.cho = "ㄹ"; add("hDrop"); add("liquid"); }
          continue;
        }
        a.jong = keep || "ㄷ"; continue;
      }

      // reduce the final
      let rj, tenseAfter = false;
      if (DOUBLE[J]) {
        if (J === "ㄺ" && C === "ㄱ") { rj = "ㄹ"; tenseAfter = true; }
        else if (stemBalp) { rj = "ㅂ"; }
        else rj = DOUBLE[J][0];
        if (J === "ㄼ" || J === "ㄾ" || J === "ㄵ" || J === "ㄻ") tenseAfter = true; // 제24·25항 (verb stems)
        add("rep");
      } else {
        rj = REP[J];
        if (rj !== J) add("rep");
      }
      a.jong = rj;

      // ㄹ after ㅁ ㅇ ㄱ ㅂ, and ㄴ + ㄹ
      if (C === "ㄹ") {
        if (rj === "ㅁ" || rj === "ㅇ") { b.cho = "ㄴ"; add("rNasal"); continue; }
        if (rj === "ㄱ" || rj === "ㅂ") { b.cho = "ㄴ"; a.jong = NASAL[rj]; add("rNasal"); add("nasal"); continue; }
        if (rj === "ㄴ") { a.jong = "ㄹ"; add("liquid"); continue; }
        continue;
      }
      if (rj === "ㄹ" && C === "ㄴ") { b.cho = "ㄹ"; add("liquid"); continue; }

      if (NASAL[rj] && (C === "ㄴ" || C === "ㅁ")) { a.jong = NASAL[rj]; add("nasal"); continue; }

      if ((NASAL[rj] || tenseAfter) && TENSE[C]) { b.cho = TENSE[C]; add("tense"); continue; }
    }

    // ㅢ after a consonant
    syl.forEach(s => {
      if (!s.other && s.jung === "ㅢ" && s.cho !== "ㅇ" && decompose(s.orig).cho !== "ㅇ") { s.jung = "ㅣ"; add("ui"); }
    });

    let out = "";
    syl.forEach(s => {
      if (s.spaceBefore && !s.joinPrev) out += " ";
      out += s.other ? s.other : compose(s.cho, s.jung, s.jong);
    });

    const order = ["link","rep","hDrop","asp","pal","nasal","rNasal","liquid","tense","ui"];
    return { text: out.trim(), rules: order.filter(r => used.has(r)), exception: false };

    function finalize(s, balp) {
      if (!s.jong) return;
      const r = DOUBLE[s.jong] ? simplifyEnd(s.jong, balp) : REP[s.jong];
      if (r !== s.jong) add("rep");
      s.jong = r;
    }
    function simplifyEnd(J, balp) {
      if (balp && J === "ㄼ") return "ㅂ";
      return DOUBLE[J][0];
    }
    function joinIfCross(b) { if (b.spaceBefore) b.joinPrev = true; }
  }

  /* ───────── Conjugation ───────── */
  // irregular types: "ㅂ", "ㅂ와"(돕다/곱다), "ㄷ", "ㅅ", "르", "ㅎ", "러"
  const IRREGULAR = {
    "덥다":"ㅂ","춥다":"ㅂ","맵다":"ㅂ","어렵다":"ㅂ","쉽다":"ㅂ","가볍다":"ㅂ","무겁다":"ㅂ","귀엽다":"ㅂ","아름답다":"ㅂ","고맙다":"ㅂ","반갑다":"ㅂ","즐겁다":"ㅂ","눕다":"ㅂ","굽다":"ㅂ","가깝다":"ㅂ","뜨겁다":"ㅂ","차갑다":"ㅂ","시끄럽다":"ㅂ","부럽다":"ㅂ",
    "돕다":"ㅂ와","곱다":"ㅂ와",
    "듣다":"ㄷ","걷다":"ㄷ","묻다":"ㄷ","싣다":"ㄷ","깨닫다":"ㄷ",
    "낫다":"ㅅ","짓다":"ㅅ","붓다":"ㅅ","잇다":"ㅅ","긋다":"ㅅ",
    "모르다":"르","빠르다":"르","부르다":"르","다르다":"르","고르다":"르","기르다":"르","오르다":"르","자르다":"르","흐르다":"르","서두르다":"르","마르다":"르","누르다":"르",
    "그렇다":"ㅎ","이렇다":"ㅎ","저렇다":"ㅎ","어떻다":"ㅎ","하얗다":"ㅎ","빨갛다":"ㅎ","파랗다":"ㅎ","노랗다":"ㅎ","까맣다":"ㅎ",
    "이르다":"러","푸르다":"러"
  };

  const BRIGHT = new Set(["ㅏ","ㅗ","ㅑ"]); // ㅑ: 얇다 → 얇아요

  function lastSyl(stem) { return decompose(stem[stem.length - 1]); }
  function replaceLast(stem, cho, jung, jong) { return stem.slice(0, -1) + compose(cho, jung, jong); }

  // attach 아/어-initial ending (ending given without 아/어, e.g. "요", "ㅆ어요")
  function attachAEo(stem, rest, type) {
    // rest: "요" (해요체), "ㅆ어요" (past), "서" (-아서)
    const pastPart = rest.startsWith("ㅆ");
    const tail = pastPart ? rest.slice(1) : rest;

    // 하다
    if (stem.endsWith("하")) {
      const base = stem.slice(0, -1);
      return pastPart ? base + "했" + tail : base + "해" + tail;
    }

    let s = stem;
    let L = lastSyl(s);

    // irregular stem changes before a vowel
    if (type === "ㅂ" || type === "ㅂ와") {
      s = replaceLast(s, L.cho, L.jung, "");
      const glide = type === "ㅂ와" ? "와" : "워";
      return pastPart ? s + (type === "ㅂ와" ? "왔" : "웠") + tail : s + glide + tail;
    }
    if (type === "ㄷ") { s = replaceLast(s, L.cho, L.jung, "ㄹ"); L = lastSyl(s); }
    if (type === "ㅅ") { s = replaceLast(s, L.cho, L.jung, ""); L = lastSyl(s);
      const v = BRIGHT.has(L.jung) ? "아" : "어";
      return pastPart ? s + (v === "아" ? "았" : "었") + tail : s + v + tail; }
    if (type === "르") {
      const prev = s.length > 1 ? decompose(s[s.length - 2]) : null;
      const bright = prev && BRIGHT.has(prev.jung);
      const pre = s.length > 1 ? replaceLast(s.slice(0, -1), prev.cho, prev.jung, "ㄹ") : "";
      const syl = bright ? "라" : "러";
      return pastPart ? pre + (bright ? "랐" : "렀") + tail : pre + syl + tail;
    }
    if (type === "ㅎ") {
      const jung = L.jung === "ㅑ" ? "ㅒ" : "ㅐ";
      const syl = compose(L.cho, jung, pastPart ? "ㅆ" : "");
      return s.slice(0, -1) + syl + tail;
    }
    if (type === "러") {
      return pastPart ? s + "렀" + tail : s + "러" + tail;
    }

    // regular
    L = lastSyl(s);
    if (L.jong) {
      const v = BRIGHT.has(L.jung) ? "아" : "어";
      return pastPart ? s + (v === "아" ? "았" : "었") + tail : s + v + tail;
    }
    // vowel-final stems contract
    const j = L.jung;
    let newJung, absorb = true;
    switch (j) {
      case "ㅏ": newJung = "ㅏ"; break;
      case "ㅓ": newJung = "ㅓ"; break;
      case "ㅐ": newJung = "ㅐ"; break;
      case "ㅔ": newJung = "ㅔ"; break;
      case "ㅕ": newJung = "ㅕ"; break;
      case "ㅗ": newJung = "ㅘ"; break;
      case "ㅜ": newJung = "ㅝ"; break;
      case "ㅣ": newJung = "ㅕ"; break;
      case "ㅚ": newJung = "ㅙ"; break;
      case "ㅡ": {
        // ㅡ drops; harmony from previous syllable
        const prev = s.length > 1 ? decompose(s[s.length - 2]) : null;
        newJung = prev && BRIGHT.has(prev.jung) ? "ㅏ" : "ㅓ"; break;
      }
      default: absorb = false;
    }
    if (!absorb) {
      const v = BRIGHT.has(j) ? "아" : "어";
      return pastPart ? s + (v === "아" ? "았" : "었") + tail : s + v + tail;
    }
    const syl = compose(L.cho, newJung, pastPart ? "ㅆ" : "");
    return s.slice(0, -1) + syl + tail;
  }

  // attach 으-initial ending ("(으)세요", "(으)니까", "(으)면"); rest without 으, e.g. "세요"
  function attachEu(stem, rest, type) {
    let s = stem, L = lastSyl(s);
    if (!L.jong) return s + rest;
    if (L.jong === "ㄹ") {
      // ㄹ drops before ㄴ ㅂ ㅅ, and 으 never appears
      const first = decompose(rest[0]).cho;
      if (["ㄴ","ㅅ","ㅂ"].includes(first)) return replaceLast(s, L.cho, L.jung, "") + rest;
      return s + rest; // 만들면
    }
    if (type === "ㅂ" || type === "ㅂ와") return replaceLast(s, L.cho, L.jung, "") + "우" + rest;
    if (type === "ㄷ") return replaceLast(s, L.cho, L.jung, "ㄹ") + "으" + rest;
    if (type === "ㅅ") return replaceLast(s, L.cho, L.jung, "") + "으" + rest;
    if (type === "ㅎ") return replaceLast(s, L.cho, L.jung, "") + rest;
    return s + "으" + rest;
  }

  function attachSeumnida(stem) {
    const L = lastSyl(stem);
    if (!L.jong) return replaceLast(stem, L.cho, L.jung, "ㅂ") + "니다";
    if (L.jong === "ㄹ") return replaceLast(stem, L.cho, L.jung, "ㅂ") + "니다";
    return stem + "습니다";
  }

  const FORMS = {
    haeyo:  { ko: "-아/어요",     en: "polite present" },
    past:   { ko: "-았/었어요",   en: "polite past" },
    seyo:   { ko: "-(으)세요",    en: "honorific / request" },
    nikka:  { ko: "-(으)니까",    en: "because" },
    myeon:  { ko: "-(으)면",      en: "if" },
    seumnida:{ ko: "-(스)ㅂ니다", en: "formal" },
    go:     { ko: "-고",          en: "and" }
  };

  function conjugate(dict, form, opts = {}) {
    if (!dict.endsWith("다")) return null;
    const stem = dict.slice(0, -1);
    const type = opts.regular ? null : (IRREGULAR[dict] || null);
    switch (form) {
      case "haeyo":    return attachAEo(stem, "요", type);
      case "past":     return attachAEo(stem, "ㅆ어요", type);
      case "seyo":     return attachEu(stem, "세요", type);
      case "nikka":    return attachEu(stem, "니까", type);
      case "myeon":    return attachEu(stem, "면", type);
      case "seumnida": return attachSeumnida(stem);
      case "go":       return stem + "고";
      default: return null;
    }
  }
  function irregularType(dict) {
    if (IRREGULAR[dict]) return IRREGULAR[dict].replace("와", "");
    const L = lastSyl(dict.slice(0, -1));
    if (L.jong === "ㄹ") return "ㄹ 탈락";
    if (!L.jong && L.jung === "ㅡ") return "ㅡ 탈락";
    return null;
  }

  /* ───────── Numbers ───────── */
  const SINO = ["","일","이","삼","사","오","육","칠","팔","구"];
  function readSino(n) {
    if (n === 0) return "영";
    const units = [[100000000,"억"],[10000,"만"]];
    let out = [];
    let rest = n;
    for (const [v, name] of units) {
      if (rest >= v) {
        const q = Math.floor(rest / v);
        out.push((q === 1 && name === "만" ? "" : readUnder10000(q)) + name);
        rest %= v;
      }
    }
    if (rest) out.push(readUnder10000(rest));
    return out.join(" ").trim();
  }
  function readUnder10000(n) {
    const parts = [[1000,"천"],[100,"백"],[10,"십"]];
    let s = "";
    for (const [v, name] of parts) {
      const q = Math.floor(n / v);
      if (q) s += (q === 1 ? "" : SINO[q]) + name;
      n %= v;
    }
    if (n) s += SINO[n];
    return s;
  }
  const NATIVE_ONES = ["","하나","둘","셋","넷","다섯","여섯","일곱","여덟","아홉"];
  const NATIVE_ONES_ATTR = ["","한","두","세","네","다섯","여섯","일곱","여덟","아홉"];
  const NATIVE_TENS = ["","열","스물","서른","마흔","쉰","예순","일흔","여든","아흔"];
  function readNative(n, attributive = false) {
    if (n < 1 || n > 99) return readSino(n);
    const t = Math.floor(n / 10), o = n % 10;
    let tens = NATIVE_TENS[t];
    if (attributive && n === 20) tens = "스무";
    const ones = attributive ? NATIVE_ONES_ATTR[o] : NATIVE_ONES[o];
    return tens + ones;
  }
  function readTime(h, m) {
    const hh = readNative(((h + 11) % 12) + 1, true) + " 시";
    if (!m) return hh;
    if (m === 30) return `${hh} ${readSino(m)} 분`;
    return `${hh} ${readSino(m)} 분`;
  }
  function readPrice(won) { return `${readSino(won)} 원`; }
  function readMonth(m) { return m === 6 ? "유월" : m === 10 ? "시월" : `${readSino(m)}월`; }


  /* ───────── Common-mistake checker (not a full spell checker) ─────────
     Each rule only fires on spellings that are always wrong, so it
     stays quiet rather than guessing.                                   */
  const hasJong = ch => isSyl(ch) && decompose(ch).jong !== "";
  const endsInL = ch => isSyl(ch) && decompose(ch).jong === "ㄹ";
  const SPELL_RULES = [
    { re: /되요/g, fix: "돼요", note: "돼요 = 되어요. If 되어 fits, write 돼." },
    { re: /됬/g, fix: "됐", note: "됐 = 되었." },
    { re: /뵈요/g, fix: "봬요", note: "봬요 = 뵈어요." },
    { re: /않\s?(되|돼)/g, fix: m => "안 " + (m.endsWith("되") ? "돼" : "돼"), note: "안 = 아니. 않 = 아니하, which only follows -지." },
    { re: /몇\s?일/g, fix: "며칠", note: "The standard spelling is always 며칠." },
    { re: /웬지/g, fix: "왠지", note: "왠지 comes from 왜인지." },
    { re: /왠일/g, fix: "웬일", note: "웬 means \u201cwhat kind of\u201d: 웬일, 웬만하면." },
    { re: /어떻해/g, fix: "어떡해", note: "어떡해 = 어떻게 해." },
    { re: /금새/g, fix: "금세", note: "금세 = 금시에." },
    { re: /오랫만/g, fix: "오랜만", note: "오랜만 = 오래간만." },
    { re: /(할|갈|줄|볼|올|을|살|만들|놀|열)께/g, fix: m => m.slice(0, -1) + "게", note: "The ending is -(으)ㄹ게, written without a tense ㄲ." },
    { re: /설겆이/g, fix: "설거지", note: "" },
    { re: /역활/g, fix: "역할", note: "" },
    { re: /희안/g, fix: "희한", note: "" },
    { re: /어의없/g, fix: "어이없", note: "" },
    { re: /일일히/g, fix: "일일이", note: "" },
    { re: /깨끗히/g, fix: "깨끗이", note: "Words ending in ㅅ take -이: 깨끗이, 따뜻이." },
    { re: /꼼꼼이/g, fix: "꼼꼼히", note: "" },
    { re: /내꺼/g, fix: "내 거", note: "거 is short for 것 and is spaced." },
    { re: /아니예요/g, fix: "아니에요", note: "아니에요 = 아니어요." },
    { re: /([가-힣])이예요/g, fix: m => m[0] + (hasJong(m[0]) ? "이에요" : "예요"), note: "After a consonant: 이에요. After a vowel: 예요." },
    { re: /([가-힣])예요/g, when: m => hasJong(m[0]) && !/아니|이/.test(m[0]), fix: m => m[0] + "이에요", note: "After a consonant, use 이에요: 학생이에요." },
    { re: /([가-힣])수\s?(있|없)/g, when: m => endsInL(m[0]), fix: m => m[0] + " 수 " + m.slice(-1), note: "수 is a bound noun: 할 수 있다." },
    { re: /([가-힣]) 수(있|없)/g, when: m => endsInL(m[0]), fix: m => m[0] + " 수 " + m.slice(-1), note: "Space both sides of 수: 할 수 있다." },
    { re: /최대값|최소값|절대값|결과값/g, fix: m => ({ "최대값": "최댓값", "최소값": "최솟값", "절대값": "절댓값", "결과값": "결괏값" })[m], note: "사이시옷: the 값 is pronounced tense." }
  ];
  function checkSpelling(text) {
    const out = [];
    SPELL_RULES.forEach(r => {
      r.re.lastIndex = 0;
      let m;
      while ((m = r.re.exec(text))) {
        const s = m[0];
        if (r.when && !r.when(s)) continue;
        const fix = typeof r.fix === "function" ? r.fix(s) : r.fix;
        if (fix === s) continue;
        // widen to the whole word (어절) so the learner sees it in context
        const stop = /[\s.,!?;:"'()\[\]…·]/;
        let a = m.index, b = m.index + s.length;
        while (a > 0 && !stop.test(text[a - 1])) a--;
        while (b < text.length && !stop.test(text[b])) b++;
        const word = text.slice(a, b);
        out.push({ index: a, found: word, fix: word.slice(0, m.index - a) + fix + word.slice(m.index - a + s.length), note: r.note });
      }
    });
    // drop overlapping hits, keep the first
    out.sort((a, b) => a.index - b.index);
    return out.filter((h, i) => i === 0 || h.index >= out[i - 1].index + out[i - 1].found.length);
  }


  /* ───────── Romanization ─────────
     rr   : Revised Romanization (국어의 로마자 표기법, 2000). Follows pronunciation,
            but tensing is not written and ㅢ stays "ui".
     mr   : McCune–Reischauer (1939). Follows pronunciation; plain stops are voiced
            between voiced sounds; aspiration marked with an apostrophe.
     yale : Yale (1942). Letter-by-letter transliteration of the spelling.      */
  const RR_I = { "ㄱ":"g","ㄲ":"kk","ㄴ":"n","ㄷ":"d","ㄸ":"tt","ㄹ":"r","ㅁ":"m","ㅂ":"b","ㅃ":"pp","ㅅ":"s","ㅆ":"ss","ㅇ":"","ㅈ":"j","ㅉ":"jj","ㅊ":"ch","ㅋ":"k","ㅌ":"t","ㅍ":"p","ㅎ":"h" };
  const RR_V = { "ㅏ":"a","ㅐ":"ae","ㅑ":"ya","ㅒ":"yae","ㅓ":"eo","ㅔ":"e","ㅕ":"yeo","ㅖ":"ye","ㅗ":"o","ㅘ":"wa","ㅙ":"wae","ㅚ":"oe","ㅛ":"yo","ㅜ":"u","ㅝ":"wo","ㅞ":"we","ㅟ":"wi","ㅠ":"yu","ㅡ":"eu","ㅢ":"ui","ㅣ":"i" };
  const FIN  = { "":"","ㄱ":"k","ㄴ":"n","ㄷ":"t","ㄹ":"l","ㅁ":"m","ㅂ":"p","ㅇ":"ng" };
  const MR_V = { ...RR_V, "ㅓ":"ŏ","ㅕ":"yŏ","ㅝ":"wŏ","ㅡ":"ŭ","ㅢ":"ŭi" };
  const MR_PLAIN = { "ㄱ":["k","g"],"ㄷ":["t","d"],"ㅂ":["p","b"],"ㅈ":["ch","j"] };
  const MR_OTHER = { "ㄲ":"kk","ㄸ":"tt","ㅃ":"pp","ㅆ":"ss","ㅉ":"tch","ㅋ":"k'","ㅌ":"t'","ㅍ":"p'","ㅊ":"ch'","ㄴ":"n","ㅁ":"m","ㅅ":"s","ㅎ":"h","ㅇ":"","ㄹ":"r" };
  const MR_TENSE_BASE = { "ㄲ":"k","ㄸ":"t","ㅃ":"p","ㅆ":"s","ㅉ":"ch" };
  const Y_I = { "ㄱ":"k","ㄲ":"kk","ㄴ":"n","ㄷ":"t","ㄸ":"tt","ㄹ":"l","ㅁ":"m","ㅂ":"p","ㅃ":"pp","ㅅ":"s","ㅆ":"ss","ㅇ":"","ㅈ":"c","ㅉ":"cc","ㅊ":"ch","ㅋ":"kh","ㅌ":"th","ㅍ":"ph","ㅎ":"h" };
  const Y_F = { ...Y_I, "ㅇ":"ng","":"","ㄳ":"ks","ㄵ":"nc","ㄶ":"nh","ㄺ":"lk","ㄻ":"lm","ㄼ":"lp","ㄽ":"ls","ㄾ":"lth","ㄿ":"lph","ㅀ":"lh","ㅄ":"ps" };
  const Y_V = { "ㅏ":"a","ㅐ":"ay","ㅑ":"ya","ㅒ":"yay","ㅓ":"e","ㅔ":"ey","ㅕ":"ye","ㅖ":"yey","ㅗ":"o","ㅘ":"wa","ㅙ":"way","ㅚ":"oy","ㅛ":"yo","ㅜ":"wu","ㅝ":"we","ㅞ":"wey","ㅟ":"wi","ㅠ":"yu","ㅡ":"u","ㅢ":"uy","ㅣ":"i" };
  const PLAIN_OF = { "ㄲ":"ㄱ","ㄸ":"ㄷ","ㅃ":"ㅂ","ㅆ":"ㅅ","ㅉ":"ㅈ" };

  function romanizeWord(word, system) {
    const O = [...word].filter(isSyl).map(decompose);
    if (!O.length) return word;
    if (system === "yale") return O.map(s => Y_I[s.cho] + Y_V[s.jung] + Y_F[s.jong]).join("");
    const pText = pronounce(word).text.split(" / ")[0].replace(/\s/g, "");
    const P = [...pText].filter(isSyl).map(decompose);
    const S = P.length === O.length ? P : O;
    let out = "";
    S.forEach((s, i) => {
      const prev = i > 0 ? S[i - 1] : null;
      if (system === "rr") {
        let cho = s.cho;
        if (PLAIN_OF[cho] && PLAIN_OF[cho] === O[i].cho) cho = O[i].cho; // tensing isn't written
        let ini = RR_I[cho];
        if (cho === "ㄹ" && prev && prev.jong === "ㄹ") ini = "l";
        out += ini + RR_V[O[i].jung] + FIN[s.jong];
      } else {
        let ini;
        const voicedBefore = prev && ["", "ㄴ", "ㄹ", "ㅁ", "ㅇ"].includes(prev.jong);
        if (MR_PLAIN[s.cho]) ini = MR_PLAIN[s.cho][voicedBefore ? 1 : 0];
        else if (MR_TENSE_BASE[s.cho] && prev && ["ㄱ", "ㄷ", "ㅂ"].includes(prev.jong)) ini = MR_TENSE_BASE[s.cho];
        else ini = MR_OTHER[s.cho];
        if (s.cho === "ㄹ" && prev && prev.jong === "ㄹ") ini = "l";
        if (s.cho === "ㄱ" && prev && prev.jong === "ㄴ") ini = "'g";
        out += ini + MR_V[s.jung] + FIN[s.jong];
      }
    });
    return out;
  }
  function romanize(text, system) {
    return (text || "").trim().split(/\s+/).map(w => romanizeWord(w, system)).join(" ");
  }

  const api = { SPELL_RULES, romanize, checkSpelling, decompose, compose, isSyl, pronounce, RULES, EXCEPTIONS, conjugate, FORMS, IRREGULAR, irregularType,
                readSino, readNative, readTime, readPrice, readMonth };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.KoEngine = api;
})(typeof window !== "undefined" ? window : globalThis);
