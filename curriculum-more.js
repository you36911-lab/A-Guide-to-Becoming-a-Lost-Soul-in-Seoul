/* =========================================================
   Additions: grammar roadmap (A1–C1) and textbook topics
   Each lesson is slotted into its neighborhood just before the
   mission. q = one question per key idea (same order as p).
   Loaded after curriculum.js and practice.js.
   ========================================================= */

const MORE_LESSONS = {
  /* ── A0 광화문 ── */
  gwanghwamun: [
    { at: 0, t: "Hangul at a glance", k: "", figure: "hangul-chart",
      s: "Before the details, here is the whole alphabet on one page: 19 consonants and 21 vowels. You'll learn how each one works in this neighborhood and the next.",
      p: ["Hangul has ==14 basic consonants and 10 basic vowels==.",
          "==Five double consonants== (ㄲ ㄸ ㅃ ㅆ ㅉ) and ==eleven compound vowels== are built from the basic letters.",
          "Every syllable is a ==block== made from these letters: a consonant, a vowel, and sometimes a final consonant."],
      ex: [], noPractice: true,
      q: [] }
  ],

  /* ── A0 서촌 ── */
  seochon: [
    { t: "Where sounds are made", k: "조음 위치와 조음 방법", figure: "vocal-tract",
      s: "Every consonant has an address: where in the mouth it's made, and how the air gets through.",
      p: ["Place: both lips (ㅂ ㅃ ㅍ ㅁ), the ridge behind the teeth (ㄷ ㄸ ㅌ ㄴ ㄹ ㅅ ㅆ), the hard palate (ㅈ ㅉ ㅊ), the soft palate (ㄱ ㄲ ㅋ ㅇ), the throat (ㅎ).",
          "Manner: stops close and release (ㄱ ㄷ ㅂ), affricates release slowly (ㅈ ㅉ ㅊ), fricatives hiss (ㅅ ㅆ ㅎ), nasals send air through the nose (ㄴ ㅁ ㅇ), and ㄹ is the liquid.",
          "Nasals and ㄹ are always voiced (울림소리); the rest are voiceless at the start of a word (안울림소리)."],
      table: { head: ["", "Lips", "Ridge", "Hard palate", "Soft palate", "Throat"], rows: [
        ["Stops", "ㅂ ㅃ ㅍ", "ㄷ ㄸ ㅌ", "", "ㄱ ㄲ ㅋ", ""],
        ["Affricates", "", "", "ㅈ ㅉ ㅊ", "", ""],
        ["Fricatives", "", "ㅅ ㅆ", "", "", "ㅎ"],
        ["Nasals", "ㅁ", "ㄴ", "", "ㅇ", ""],
        ["Liquid", "", "ㄹ", "", "", ""]] },
      ex: ["밤 · 담 · 감", "사 · 자 · 차", "나 · 마 · 아"],
      q: [["Which consonant is made with both lips?", ["ㄷ", "ㅁ", "ㄱ", "ㅈ"], 1, "ㅂ ㅃ ㅍ ㅁ are made with both lips."],
          ["ㅈ ㅉ ㅊ are…", ["stops", "affricates", "nasals", "liquids"], 1, "Affricates start like a stop and release like a fricative."],
          ["Which group is always voiced?", ["ㄱ ㄷ ㅂ", "ㅅ ㅆ ㅎ", "ㄴ ㅁ ㅇ ㄹ", "ㅋ ㅌ ㅍ"], 2, "Nasals and the liquid are 울림소리."]] },
    { t: "Writing by hand", k: "획순 (쓰는 순서)", figure: "handwriting", ghost: "한글",
      s: "Hangul is written stroke by stroke in a fixed order. Following it keeps your letters even and easy to read.",
      p: ["Strokes go from top to bottom and from left to right.",
          "ㅇ is a single stroke: start at the top and go round counterclockwise.",
          "Inside a block, write in sound order: first consonant, then the vowel, then the final consonant at the bottom.",
          "Some letters change shape in a block: before ㅏ, ㄱ leans and sweeps down (가); above ㅗ it sits flat (고)."],
      ex: ["ㄱ (1) · ㄴ (1) · ㄷ (2) · ㄹ (3)", "ㅁ (3) · ㅂ (4) · ㅇ (1) · ㅎ (3)", "가 · 고 · 각"],
      q: [["Which way do strokes usually go?", ["bottom to top, right to left", "top to bottom, left to right", "in any order", "right to left only"], 1, "Top to bottom, left to right."],
          ["How do you draw ㅇ?", ["two half circles", "one stroke from the top, counterclockwise", "one stroke from the bottom, clockwise", "a square"], 1, "One stroke, starting at the top."],
          ["In which order do you write 한?", ["ㄴ, ㅏ, ㅎ", "ㅎ, ㅏ, ㄴ", "ㅏ, ㅎ, ㄴ", "ㅎ, ㄴ, ㅏ"], 1, "First consonant, vowel, then the final."],
          ["In 가, compared with 고, the ㄱ…", ["looks exactly the same", "leans and sweeps down", "is written in two strokes", "is written last"], 1, "Next to a vertical vowel, ㄱ leans."]] },
    { t: "Typing Hangul", k: "한글 자판 (두벌식)", figure: "keyboard",
      s: "On a Korean keyboard you type the letters in sound order, and the blocks build themselves.",
      p: ["The standard layout (두벌식) puts consonants under the left hand and vowels under the right.",
          "Type in sound order: ㅎ ㅏ ㄴ ㄱ ㅡ ㄹ becomes 한글. A final consonant jumps to the next block when a vowel follows it.",
          "Shift gives the tense consonants ㄲ ㄸ ㅃ ㅆ ㅉ and the vowels ㅒ ㅖ.",
          "To type on your own device, add Korean (2-Set / 두벌식) in the language or keyboard settings, then switch with the 한/영 key, Right Alt on Windows, or Ctrl+Space or Caps Lock on a Mac.",
          "Korean keyboards add a 한자 key left of the space bar and a 한/영 key to its right, and show ₩ where others have a backslash. Other symbols sit where they do on a US keyboard. On Windows, type a consonant such as ㅁ and press 한자 to pick symbols like ※ ★ ○."],
      ex: ["ㅎ ㅏ ㄴ ㄱ ㅡ ㄹ → 한글", "ㅇ ㅏ ㄴ ㄴ ㅕ ㅇ → 안녕", "Shift + ㄱ → ㄲ"],
      q: [["On a 두벌식 keyboard, the consonants are under…", ["the left hand", "the right hand", "the top row only", "both hands equally"], 0, "Consonants left, vowels right."],
          ["What do you get when you type ㅎ ㅏ ㄴ ㄱ ㅡ ㄹ?", ["한글", "하ㄴ글", "핟글", "한그ㄹ"], 0, "The keyboard assembles the blocks."],
          ["How do you type ㄲ?", ["press ㄱ twice", "Shift + ㄱ", "Alt + ㄱ", "it isn't on the keyboard"], 1, "Shift gives the tense consonants."],
          ["Which keyboard should you add in your settings?", ["Korean (2-Set / 두벌식)", "Korean (3-Set) only", "Japanese", "Chinese"], 0, "2-Set is the standard layout."],
          ["On a Korean keyboard, what does the key right of the space bar do?", ["types ₩", "switches between Korean and English (한/영)", "opens the symbol list", "types a space"], 1, "한/영 switches input; 한자 is on the left."]] }
  ],

  /* ── A0 홍대 ── */
  hongdae: [
    // first in Hongdae: the overview, then each kind of change in detail
    { at: 0, t: "Four ways sounds change", k: "음운 변동의 네 유형",
      s: "Every rule you've met in Hongdae is one of four kinds of change.",
      p: ["Replacement (교체): one sound turns into another. 비음화, 유음화, 구개음화, 된소리되기 and the seven final sounds.",
          "Deletion (탈락): a sound disappears. Final ㅎ before a vowel, one consonant of a double final, ㄹ and ㅡ in verb endings.",
          "Addition (첨가): a sound appears. ㄴ 첨가 in 솜이불, and a glide in 되어 [되여].",
          "Contraction (축약): two sounds become one. ㄱ + ㅎ → ㅋ in 축하, and ㅗ + ㅏ → ㅘ in 보아 → 봐."],
      ex: ["국물 [궁물] 교체", "좋아요 [조아요] 탈락", "솜이불 [솜니불] 첨가", "축하 [추카] 축약"],
      q: [["국물 → [궁물] is which kind of change?", ["replacement", "deletion", "addition", "contraction"], 0, "ㄱ is replaced by ㅇ: 교체."],
          ["좋아요 → [조아요] is…", ["replacement", "deletion", "addition", "contraction"], 1, "ㅎ disappears: 탈락."],
          ["솜이불 → [솜니불] is…", ["replacement", "deletion", "addition", "contraction"], 2, "A ㄴ appears: 첨가."],
          ["축하 → [추카] is…", ["replacement", "deletion", "addition", "contraction"], 3, "ㄱ and ㅎ merge into ㅋ: 축약."]] },
    { t: "Vowels that merge or grow", k: "모음 축약과 반모음 첨가",
      s: "Two vowels side by side often fuse into one, and sometimes a glide slips in between them.",
      p: ["Contraction: 보아 → 봐, 주어 → 줘, 되어 → 돼, 하여 → 해. This is the same fusion you used for 해요체.",
          "Glide addition is allowed in pronunciation: 되어 [되어/되여], 피어 [피어/피여] (표준 발음법 제22항).",
          "The same goes for 이오 [이오/이요] and 아니오 [아니오/아니요], though the spelling stays the same."],
      ex: ["보아요 → 봐요", "되어요 → 돼요", "피어 [피어/피여]", "아니오 [아니오/아니요]"],
      q: [["주어요 contracts to…", ["주요", "줘요", "좌요", "쥐요"], 1, "ㅜ + ㅓ → ㅝ: 줘요."],
          ["Which pronunciation of 되어 is allowed besides [되어]?", ["[되여]", "[대어]", "[되요]", "[돼어]"], 0, "A y-glide may be added: [되여]."],
          ["아니오 may be pronounced…", ["only [아니오]", "[아니오] or [아니요]", "only [아니요]", "[아뇨] only"], 1, "제22항 allows both."]] }
  ],

  /* ── A1 신촌 ── */
  sinchon: [
    { t: "Asking questions", k: "의문사",
      s: "Question words sit exactly where the answer will go. The verb stays at the end.",
      p: ["누구 (who), 뭐/무엇 (what), 어디 (where), 언제 (when), 왜 (why), 어떻게 (how).",
          "누구 + 가 becomes 누가: 누가 왔어요? 뭐 is the spoken form of 무엇.",
          "몇 (how many) needs a counter: 몇 시, 몇 개, 몇 명. 얼마 asks a price: 얼마예요?"],
      ex: ["이게 뭐예요?", "어디에 가요?", "누가 왔어요?", "지금 몇 시예요?", "이거 얼마예요?"],
      q: [["\"Where are you going?\" is…", ["어디에 가요?", "언제 가요?", "왜 가요?", "누가 가요?"], 0, "어디 = where."],
          ["누구 + 가 becomes…", ["누구가", "누가", "누구이", "누군가"], 1, "The subject form is 누가."],
          ["\"How many people?\" is…", ["몇 명이에요?", "얼마 명이에요?", "몇 사람이에요?", "무슨 명이에요?"], 0, "몇 + counter: 몇 명."]] }
  ],

  /* ── A2 노량진 ── */
  noryangjin: [
    { at: 0, t: "Parts of a sentence", k: "문장 성분",
      s: "School grammar names seven jobs a word or phrase can do in a sentence. Particles and endings usually tell you which job.",
      p: ["Main parts (주성분): subject 주어, predicate 서술어, object 목적어, complement 보어 (the noun before 되다 / 아니다: 물이 얼음이 되었다).",
          "Supporting parts (부속 성분): 관형어 describes a noun (새 책, 내가 산 책); 부사어 describes a verb, adjective or the whole sentence (빨리, 학교에서).",
          "Independent part (독립 성분): 독립어 stands apart from the rest: 아, 네, 민수야.",
          "A sentence with one subject–predicate pair is 홑문장; with two or more, 겹문장. You'll build those in Seongsu."],
      table: { head: ["Part", "Korean term", "Example"], rows: [
        ["Subject", "주어", "민수가 책을 읽는다."], ["Predicate", "서술어", "민수가 책을 읽는다."], ["Object", "목적어", "민수가 책을 읽는다."],
        ["Complement", "보어", "물이 얼음이 되었다."], ["Noun modifier", "관형어", "새 책을 샀다."], ["Adverbial", "부사어", "빨리 읽었다."], ["Independent", "독립어", "아, 비가 온다."]] },
      ex: ["민수가 도서관에서 새 책을 빨리 읽었다.", "아, 물이 얼음이 되었네."],
      q: [["In 물이 얼음이 되었다, 얼음이 is the…", ["subject (주어)", "object (목적어)", "complement (보어)", "adverbial (부사어)"], 2, "The noun before 되다 / 아니다 is the 보어."],
          ["In 새 책을 샀다, 새 is a…", ["관형어", "부사어", "주어", "독립어"], 0, "It describes the noun 책."],
          ["In 민수야, 밥 먹었어?, 민수야 is a…", ["주어", "독립어", "목적어", "서술어"], 1, "A call-out stands apart: 독립어."],
          ["민수가 학교에 가고 지수가 집에 왔다 is a…", ["홑문장", "겹문장", "명사절", "관형절"], 1, "Two subject–predicate pairs: 겹문장."]] },
    { t: "With and and", k: "하고 · (이)랑 · 와/과",
      s: "Three particles mean both 'and' between nouns and 'with' someone. They differ in register.",
      p: ["하고 is neutral and spoken, (이)랑 is casual, 와/과 is written or formal.",
          "Forms: 이랑 after a consonant, 랑 after a vowel; 과 after a consonant, 와 after a vowel.",
          "With someone: 친구하고 같이 갔어요. 같이 (together) often follows."],
      ex: ["빵하고 우유", "동생이랑 영화를 봤어요.", "책과 연필", "친구와 함께"],
      q: [["Which is the most casual?", ["하고", "(이)랑", "와/과", "에게"], 1, "(이)랑 is casual speech."],
          ["책 ___ 연필 (written)", ["와", "과", "이랑", "랑"], 1, "책 ends in a consonant: 과."],
          ["\"I went with a friend\" is…", ["친구하고 같이 갔어요.", "친구를 같이 갔어요.", "친구에 같이 갔어요.", "친구랑을 같이 갔어요."], 0, "N하고 같이 = with N."]] },
    { t: "Than, and nothing but", k: "보다 · 밖에",
      s: "보다 compares; 밖에 means 'only', but always with a negative verb.",
      p: ["N보다 (더) + adjective: 사과보다 배가 더 맛있어요.",
          "N밖에 + negative: 물밖에 없어요 (there's nothing but water).",
          "만 and 밖에 both mean 'only', but 만 takes a positive verb and 밖에 a negative one."],
      ex: ["서울이 부산보다 커요.", "천 원밖에 없어요.", "물만 마셔요. / 물밖에 안 마셔요."],
      q: [["\"Seoul is bigger than Busan\": 서울이 부산___ 커요.", ["보다", "밖에", "만", "처럼"], 0, "보다 marks what you compare with."],
          ["\"I only have 1,000 won\" is…", ["천 원밖에 있어요.", "천 원밖에 없어요.", "천 원만 없어요.", "천 원보다 없어요."], 1, "밖에 + negative."],
          ["Which is correct?", ["물밖에 마셔요.", "물만 안 마셔요. (= only water)", "물밖에 안 마셔요.", "물보다 마셔요."], 2, "밖에 needs a negative verb."]] }
  ],

  /* ── A2 반포 ── */
  banpo: [
    { t: "Can, and good at", k: "-(으)ㄹ 수 있다/없다 · 잘하다/못하다",
      s: "Two ways to talk about ability: what you can do, and what you're good at.",
      p: ["-(으)ㄹ 수 있다/없다: ability or possibility. 수영할 수 있어요, 오늘은 갈 수 없어요.",
          "잘하다 / 못하다 with a noun: 한국어를 잘해요, 노래를 못해요. 잘 못해요 means 'not very well'.",
          "못 + verb and -(으)ㄹ 수 없다 are close; -(으)ㄹ 수 없다 often points to circumstances."],
      ex: ["한국어를 읽을 수 있어요.", "요리를 잘해요.", "운전을 잘 못해요.", "오늘은 만날 수 없어요."],
      q: [["\"I can swim\" is…", ["수영할 수 있어요.", "수영할 수 해요.", "수영하는 수 있어요.", "수영 수 있어요."], 0, "Stem + -(으)ㄹ 수 있다."],
          ["\"I'm not very good at singing\" is…", ["노래를 잘해요.", "노래를 잘 못해요.", "노래를 못 잘해요.", "노래를 안 잘해요."], 1, "잘 못하다 = not very well."],
          ["\"I can't meet today (I have plans)\" sounds most natural as…", ["오늘은 만날 수 없어요.", "오늘은 만나 수 없어요.", "오늘은 못 만날 수 있어요.", "오늘은 만날 수 안 있어요."], 0, "-(으)ㄹ 수 없다 fits circumstances."]] },
    { t: "Have to, and don't", k: "-아/어야 하다 · -지 마세요",
      s: "Obligation and prohibition, two of the most useful patterns in daily life.",
      p: ["-아/어야 하다 (or 되다): have to. 공부해야 해요, 가야 돼요.",
          "-지 마세요: please don't. Between friends: -지 마.",
          "Not having to: 안 -아/어도 돼요 or -지 않아도 돼요. 오늘은 안 와도 돼요."],
      ex: ["내일 일찍 일어나야 해요.", "여기에서 사진 찍지 마세요.", "걱정하지 마.", "오늘은 안 와도 돼요."],
      q: [["\"I have to study\" is…", ["공부해야 해요.", "공부하야 해요.", "공부해야 있어요.", "공부해서 해요."], 0, "하다 → 해야 해요."],
          ["\"Please don't go\" is…", ["가지 마세요.", "안 가세요.", "가지 않세요.", "가 마세요."], 0, "Stem + -지 마세요."],
          ["\"You don't have to come today\" is…", ["오늘은 오지 마세요.", "오늘은 안 와도 돼요.", "오늘은 와야 해요.", "오늘은 못 와요."], 1, "안 -아/어도 되다 = don't need to."]] },
    { t: "Right now, or one or the other", k: "-고 있다 · -는 중이다 · -거나",
      s: "Talk about what's in progress, and offer choices.",
      p: ["-고 있다: in progress. 지금 밥을 먹고 있어요.",
          "-는 중이다: in the middle of. 회의하는 중이에요; with nouns, 회의 중이에요.",
          "-거나 joins verbs with 'or': 주말에 영화를 보거나 쉬어요. Between nouns, use (이)나: 밥이나 빵."],
      ex: ["친구를 기다리고 있어요.", "지금 운전하는 중이에요.", "통화 중이에요.", "밥이나 빵을 먹어요."],
      q: [["\"I'm waiting for a friend\" is…", ["친구를 기다리고 있어요.", "친구를 기다려 있어요.", "친구를 기다리는 있어요.", "친구를 기다리 중이에요."], 0, "-고 있다 = progressive."],
          ["\"I'm in a meeting\" is…", ["회의 중이에요.", "회의하고 중이에요.", "회의는 중이에요.", "회의를 중이에요."], 0, "N 중이다."],
          ["\"I watch a movie or rest\" is…", ["영화를 보거나 쉬어요.", "영화를 보나 쉬어요.", "영화를 봐서 쉬어요.", "영화를 보고나 쉬어요."], 0, "-거나 = or between verbs."]] }
  ],

  /* ── A2 강남 ── */
  gangnam: [
    { t: "Days and dates", k: "요일 · 날짜",
      s: "Days of the week come from the sun, the moon and the five elements. Dates use Sino-Korean numbers, biggest unit first.",
      p: ["월요일, 화요일, 수요일, 목요일, 금요일, 토요일, 일요일: moon, fire, water, wood, metal, earth, sun.",
          "Dates use Sino-Korean numbers: 2026년 10월 6일. Remember 유월 and 시월.",
          "Order runs from big to small: year, month, day, weekday, time. 10월 6일 화요일 오후 세 시."],
      ex: ["오늘은 화요일이에요.", "생일이 몇 월 며칠이에요?", "시월 구일은 한글날이에요."],
      q: [["Which day is named after water?", ["목요일", "수요일", "금요일", "화요일"], 1, "水 = 수: Wednesday."],
          ["How do you say June 6?", ["육월 육일", "유월 육일", "여섯월 여섯일", "유월 여섯일"], 1, "June is 유월; days use Sino numbers."],
          ["Which order is natural?", ["화요일 10월 6일", "6일 10월 화요일", "10월 6일 화요일", "10월 화요일 6일"], 2, "Biggest unit first."]] },
    { t: "Colors", k: "색깔 말",
      s: "The basic colors are adjectives with ㅎ irregular forms. Others are nouns with 색.",
      p: ["빨갛다, 파랗다, 노랗다, 하얗다, 까맣다 are adjectives: 하늘이 파래요.",
          "Before a noun they drop ㅎ: 빨간 가방, 하얀 옷. As nouns: 빨간색, 파란색.",
          "Other colors are nouns + 색: 초록색, 보라색, 분홍색, 회색, 갈색. 파랗다 also covers green: a green traffic light is 파란불."],
      ex: ["사과가 빨개요.", "하얀 운동화를 샀어요.", "보라색을 좋아해요.", "파란불이에요. 건너세요."],
      q: [["\"The sky is blue\" is…", ["하늘이 파래요.", "하늘이 파랗어요.", "하늘이 파란요.", "하늘이 푸래요."], 0, "ㅎ irregular: 파랗다 → 파래요."],
          ["\"A white shirt\" is…", ["하얗은 셔츠", "하얀 셔츠", "하얘 셔츠", "하얗는 셔츠"], 1, "Before a noun: 하얀."],
          ["A green traffic light is usually called…", ["초록불 only", "파란불", "노란불", "푸른불"], 1, "파랗다 traditionally covers green too."]] }
  ],

  /* ── B1 잠실 ── */
  jamsil: [
    { t: "Trying and having tried", k: "-아/어 보다 · -아/어 본 적이 있다",
      s: "보다 after a verb means 'try doing'. Add 적 and you're talking about experience.",
      p: ["-아/어 보다: try. 이 옷 입어 보세요. 한번 먹어 볼게요.",
          "-아/어 본 적이 있다/없다: have (never) tried. 한국에 가 본 적이 있어요.",
          "-(으)ㄴ 적이 있다 is general experience without the 'trying' sense: 길을 잃은 적이 있어요."],
      ex: ["이거 먹어 봐요.", "번지점프를 해 본 적이 있어요?", "아직 가 본 적이 없어요."],
      q: [["\"Try this on\" (polite) is…", ["이거 입어 보세요.", "이거 입고 보세요.", "이거 입어 봤어요.", "이거 입을 보세요."], 0, "-아/어 보다 = try."],
          ["\"Have you been to Jeju?\" is…", ["제주도에 가 본 적이 있어요?", "제주도에 가 본 적을 있어요?", "제주도에 가 보는 적이 있어요?", "제주도에 가 봐 적이 있어요?"], 0, "-아/어 본 적이 있다."],
          ["\"I've gotten lost before\" is…", ["길을 잃은 적이 있어요.", "길을 잃는 적이 있어요.", "길을 잃을 적이 있어요.", "길을 잃고 적이 있어요."], 0, "-(으)ㄴ 적이 있다."]] },
    { t: "How things turned out", k: "-게 되다",
      s: "-게 되다 says something came about, not purely by your own choice.",
      p: ["Change or result: 알게 됐어요 (I came to know), 한국에 살게 됐어요 (I ended up living in Korea).",
          "For adjectives, change uses -아/어지다 instead: 예뻐졌어요, 추워졌어요.",
          "It's also a polite way to announce news: 다음 달에 회사를 그만두게 됐어요."],
      ex: ["그 사람을 좋아하게 됐어요.", "날씨가 따뜻해졌어요.", "다음 주에 이사하게 됐어요."],
      q: [["\"I came to like kimchi\" is…", ["김치를 좋아하게 됐어요.", "김치를 좋아해졌어요.", "김치를 좋아하게 했어요.", "김치를 좋아하고 됐어요."], 0, "-게 되다 = came to."],
          ["\"It got cold\" is…", ["춥게 됐어요.", "추워졌어요.", "춥게 했어요.", "추워 됐어요."], 1, "Adjective change: -아/어지다."],
          ["Announcing news politely: \"I'll be moving to Busan\"", ["부산으로 이사하게 됐어요.", "부산으로 이사해졌어요.", "부산으로 이사했게요.", "부산으로 이사하게 했어요."], 0, "-게 되다 softens an announcement."]] }
  ],

  /* ── B1 성수 ── */
  seongsu: [
    { t: "When and while", k: "-(으)ㄹ 때 · -(으)면서",
      s: "Two ways to put events in time.",
      p: ["-(으)ㄹ 때: when. 밥을 먹을 때, 어렸을 때 (past: -았/었을 때).",
          "-(으)면서: while, two actions by the same person. 음악을 들으면서 공부해요.",
          "With nouns: N 때. 방학 때, 점심 때."],
      ex: ["한국에 갔을 때 친구를 만났어요.", "걸으면서 전화해요.", "휴가 때 뭐 할 거예요?"],
      q: [["\"When I was young\" is…", ["어렸을 때", "어릴 때었을", "어려서 때", "어렸는 때"], 0, "Past: -았/었을 때."],
          ["\"I study while listening to music\" is…", ["음악을 들으면서 공부해요.", "음악을 듣으면서 공부해요.", "음악을 들을 때면서 공부해요.", "음악을 들고 공부해요."], 0, "듣다 → 들으면서."],
          ["\"During vacation\" is…", ["방학 때", "방학할 때에서", "방학 동안에 때", "방학을 때"], 0, "N 때."]] },
    { t: "Before and after", k: "-기 전에 · -(으)ㄴ 후에/다음에",
      s: "Two patterns, each with a noun version.",
      p: ["-기 전에: before doing. 자기 전에 이를 닦아요.",
          "-(으)ㄴ 후에 / -(으)ㄴ 다음에: after doing. 밥을 먹은 후에 산책해요.",
          "With nouns: 수업 전에, 수업 후에, 한 시간 후에."],
      ex: ["출발하기 전에 연락하세요.", "숙제를 한 다음에 놀아요.", "식사 후에 커피를 마셔요."],
      q: [["\"Before sleeping\" is…", ["자기 전에", "자는 전에", "잔 전에", "자기 후에"], 0, "-기 전에."],
          ["\"After eating\" is…", ["먹은 후에", "먹는 후에", "먹기 후에", "먹을 후에"], 0, "-(으)ㄴ 후에."],
          ["\"After class\" is…", ["수업 후에", "수업한 전에", "수업기 후에", "수업은 후에"], 0, "N 후에."]] },
    { t: "Because, and in order to", k: "-기 때문에 · -기 위해(서)",
      s: "A firmer way to give reasons, and a formal way to give purposes.",
      p: ["-기 때문에 / N 때문에: because. Clear and a little formal; not used before commands or suggestions.",
          "-기 위해(서) / N을 위해(서): in order to, for the sake of. 건강을 위해 운동해요.",
          "-(으)려고 is everyday speech; -기 위해서 sounds more deliberate and works with any ending."],
      ex: ["피곤하기 때문에 일찍 잤어요.", "비 때문에 경기가 취소됐어요.", "한국어를 배우기 위해서 서울에 왔어요."],
      q: [["Which is WRONG?", ["피곤하기 때문에 쉬었어요.", "비 때문에 못 갔어요.", "늦었기 때문에 빨리 가세요.", "바쁘기 때문에 못 만났어요."], 2, "-기 때문에 doesn't go before a command."],
          ["\"I exercise for my health\" is…", ["건강을 위해 운동해요.", "건강이 위해 운동해요.", "건강하기 때문에 운동해요.", "건강을 때문에 운동해요."], 0, "N을 위해."],
          ["Which sounds more deliberate and formal?", ["배우려고", "배우기 위해서", "배워서", "배우니까"], 1, "-기 위해서 is the formal purpose form."]] },
    { t: "Whether and what", k: "-(으)ㄴ/는지 알다/모르다",
      s: "Turn a question into part of a sentence: do you know where, whether, when…",
      p: ["Form: verbs take -는지, adjectives -(으)ㄴ지, past -았/었는지, future -(으)ㄹ지.",
          "With question words: 어디 가는지 알아요? 누가 왔는지 몰라요.",
          "-(으)ㄹ지 모르겠다 expresses uncertainty: 갈지 안 갈지 모르겠어요."],
      ex: ["그 사람이 누구인지 알아요?", "얼마나 비싼지 몰랐어요.", "내일 비가 올지 모르겠어요."],
      q: [["\"Do you know where he lives?\" 그 사람이 어디 ___ 알아요?", ["사는지", "살은지", "산지", "살지는"], 0, "Verb: -는지 (ㄹ drops: 사는지)."],
          ["\"I didn't know how expensive it was\": 얼마나 ___ 몰랐어요.", ["비싸는지", "비싼지", "비쌀는지", "비싸지"], 1, "Adjective: -(으)ㄴ지."],
          ["\"I'm not sure whether I'll go\" is…", ["갈지 모르겠어요.", "가는지 모르겠어요.", "간지 모르겠어요.", "가지 모르겠어요."], 0, "Future uncertainty: -(으)ㄹ지."]] },
    { t: "Words for feelings", k: "감정 어휘 (희로애락)",
      s: "Korean sorts feelings into joy, anger, sorrow and pleasure, with very precise words for each.",
      p: ["Joy and pleasure: 기쁘다, 즐겁다, 반갑다 (glad to see), 신나다 (excited), 뿌듯하다 (proud of yourself).",
          "Anger and frustration: 화나다, 짜증 나다, 억울하다 (wronged), 답답하다 (stifled, frustrated).",
          "Sorrow: 슬프다, 서운하다 (hurt by someone close), 속상하다 (upset), 우울하다, 외롭다, 그립다 (miss).",
          "For someone else's feelings, use -아/어하다: 동생이 슬퍼해요, 친구가 기뻐했어요."],
      ex: ["시험에 합격해서 뿌듯해요.", "친구가 생일을 잊어서 서운했어요.", "가족이 그리워요.", "동생이 많이 속상해해요."],
      q: [["You finished a hard project and feel proud of yourself:", ["뿌듯해요", "억울해요", "서운해요", "답답해요"], 0, "뿌듯하다 = quietly proud."],
          ["You were blamed for something you didn't do:", ["신나요", "억울해요", "반가워요", "그리워요"], 1, "억울하다 = feel wronged."],
          ["A close friend forgot your birthday:", ["서운해요", "즐거워요", "뿌듯해요", "신나요"], 0, "서운하다 = hurt by someone close."],
          ["\"My sister is sad\" (describing her) is…", ["동생이 슬퍼요.", "동생이 슬퍼해요.", "동생이 슬퍼하어요.", "동생을 슬퍼요."], 1, "Third person: -아/어하다."]] }
  ],

  /* ── B1 동대문 ── */
  dongdaemun: [
    { t: "May I? You mustn't", k: "-아/어도 되다 · -(으)면 안 되다",
      s: "Asking permission and stating rules, both essential for polite life.",
      p: ["-아/어도 되다: may. 여기 앉아도 돼요? Answer: 네, 앉으세요.",
          "-(으)면 안 되다: must not. 여기에서 담배를 피우면 안 돼요.",
          "To say something isn't necessary: 안 -아/어도 되다. 오늘은 일찍 안 와도 돼요."],
      ex: ["사진 찍어도 돼요?", "수업 시간에 휴대폰을 쓰면 안 돼요.", "신발을 안 벗어도 돼요."],
      q: [["\"May I open the window?\" is…", ["창문을 열어도 돼요?", "창문을 열면 돼요?", "창문을 열어야 돼요?", "창문을 열지 돼요?"], 0, "-아/어도 되다 = may."],
          ["\"You mustn't run here\" is…", ["여기에서 뛰면 안 돼요.", "여기에서 뛰어도 안 돼요.", "여기에서 안 뛰면 돼요.", "여기에서 뛰지 돼요."], 0, "-(으)면 안 되다."],
          ["\"You don't need to take off your shoes\" is…", ["신발을 벗으면 안 돼요.", "신발을 안 벗어도 돼요.", "신발을 벗어야 돼요.", "신발을 벗지 마세요."], 1, "안 -아/어도 되다."]] }
  ],

  /* ── B2 대학로 ── */
  daehakro: [
    { t: "In sequence", k: "-고 나서 · -자마자 · -다가",
      s: "Three ways to line up actions in time, each with its own nuance.",
      p: ["-고 나서: after finishing. 숙제를 하고 나서 잤어요.",
          "-자마자: as soon as. 집에 도착하자마자 전화했어요.",
          "-다가: while doing, then something interrupts or changes. 걸어가다가 친구를 만났어요. -았/었다가: after doing (and undoing): 갔다가 왔어요."],
      ex: ["밥을 먹고 나서 이를 닦아요.", "눕자마자 잠들었어요.", "공부하다가 잠이 들었어요.", "창문을 열었다가 닫았어요."],
      q: [["\"After finishing work, I'll call\" is…", ["일을 끝내고 나서 전화할게요.", "일을 끝내자마자서 전화할게요.", "일을 끝내다가 전화할게요.", "일을 끝냈고 나서 전화할게요."], 0, "-고 나서 = after finishing."],
          ["\"As soon as I lay down, I fell asleep\" is…", ["눕자마자 잠들었어요.", "누웠자마자 잠들었어요.", "눕고 나서 바로마자 잠들었어요.", "눕다가 잠들었어요."], 0, "-자마자 takes no past tense."],
          ["\"I met a friend on my way\" is…", ["가다가 친구를 만났어요.", "가자마자 친구를 만났어요.", "가고 나서 친구를 만났어요.", "갔다가 친구를 만나요."], 0, "-다가: during an action, something else happens."]] },
    { t: "Busy with, and what came of it", k: "-느라고 · -았/었더니",
      s: "Two ways to link a cause to a result you experienced.",
      p: ["-느라고: because I was busy doing X (usually with a bad outcome). Same subject, verbs only. 일하느라고 못 갔어요.",
          "-았/었더니: I did X, and then found or caused Y. 아침을 많이 먹었더니 배가 아파요.",
          "-더니 (without the past) reports a change you saw in someone else: 동생이 열심히 하더니 합격했어요."],
      ex: ["시험 공부하느라고 바빴어요.", "창문을 열었더니 시원해졌어요.", "어제는 춥더니 오늘은 따뜻해요."],
      q: [["\"I couldn't call because I was working\" is…", ["일하느라고 전화 못 했어요.", "일했느라고 전화 못 했어요.", "일하느라고 전화하세요.", "일하더니 전화 못 했어요."], 0, "-느라고, no past tense on the first verb."],
          ["\"I ate a lot, and now my stomach hurts\" is…", ["많이 먹었더니 배가 아파요.", "많이 먹느라고 배가 아파요.", "많이 먹자마자서 배가 아파요.", "많이 먹더니 배가 아파요."], 0, "-았/었더니 for your own action and its result."],
          ["About your brother's change you observed:", ["동생이 열심히 하더니 합격했어요.", "동생이 열심히 했더니 합격했어요.", "동생이 열심히 하느라고 합격했어요.", "동생이 열심히 하자마자 합격했어요."], 0, "-더니 reports someone else's observed change."]] },
    { t: "Guessing and conceding", k: "-나 보다 · -기는 하지만 · -(으)ㄴ 채로",
      s: "Guess from evidence, admit a point before adding a 'but', and keep a state going.",
      p: ["-나 보다 (verbs) / -(으)ㄴ가 보다 (adjectives): I guess, judging from what I see. 비가 오나 봐요.",
          "-기는 하지만 / -기는 -지만: it's true that…, but. 좋기는 하지만 비싸요.",
          "-(으)ㄴ 채(로): while still in a state. 신발을 신은 채로 들어왔어요."],
      ex: ["밖이 시끄러운 걸 보니 무슨 일이 있나 봐요.", "맛있기는 맛있지만 너무 매워요.", "불을 켠 채로 잤어요."],
      q: [["Seeing wet umbrellas: \"It must be raining\" is…", ["비가 오나 봐요.", "비가 온가 봐요.", "비가 오기는 해요.", "비가 오는 채로요."], 0, "Verbs: -나 보다."],
          ["\"It's good, but expensive\" (conceding) is…", ["좋기는 하지만 비싸요.", "좋기는 하는데 비싸기 때문에요.", "좋은 채로 비싸요.", "좋나 봐요 비싸요."], 0, "-기는 하지만 concedes."],
          ["\"I slept with the light on\" is…", ["불을 켠 채로 잤어요.", "불을 켜는 채로 잤어요.", "불을 켜고 채로 잤어요.", "불을 켤 채로 잤어요."], 0, "Past modifier + 채로."]] },
    { t: "Making sure", k: "-도록 (하다)",
      s: "-도록 points toward an outcome: make sure, so that, until.",
      p: ["-도록 하다: make sure to, a polite instruction. 늦지 않도록 하세요.",
          "-도록: so that. 잘 들리도록 크게 말해 주세요.",
          "-도록: until, to the point of. 밤새도록 이야기했어요."],
      ex: ["회의에 늦지 않도록 하세요.", "아이들이 볼 수 있도록 낮게 걸었어요.", "목이 아프도록 노래했어요."],
      q: [["\"Please make sure you're not late\" is…", ["늦지 않도록 하세요.", "늦지 않게 되세요.", "늦도록 하지 마세요.", "늦지 않도록 돼요."], 0, "-도록 하다 = make sure."],
          ["\"Speak loudly so everyone can hear\" is…", ["모두 들을 수 있도록 크게 말하세요.", "모두 들을 수 있느라고 크게 말하세요.", "모두 듣자마자 크게 말하세요.", "모두 들어서 크게 말하세요."], 0, "-도록 = so that."],
          ["\"We talked all night\" is…", ["밤새도록 이야기했어요.", "밤새느라고 이야기했어요.", "밤새자마자 이야기했어요.", "밤새는 채로 이야기했어요."], 0, "-도록 = until."]] }
  ],

  /* ── C1 인사동 ── */
  insadong: [
    { t: "The first rule of spelling", k: "한글 맞춤법의 원리",
      s: "Article 1 of the spelling rules explains almost everything: write standard words as they sound, but keep the grammar visible.",
      p: ["Article 1 of the spelling rules: 표준어를 소리대로 적되, 어법에 맞도록 함을 원칙으로 한다. Write standard Korean as it sounds, but keep each word's grammatical shape.",
          "'As they sound': 나무, 사람, 하늘 are written exactly as pronounced.",
          "'According to grammar': each morpheme keeps one spelling. 꽃 stays 꽃 in 꽃이 [꼬치], 꽃도 [꼳또], 꽃만 [꼰만]."],
      ex: ["꽃이 [꼬치]", "꽃도 [꼳또]", "꽃만 [꼰만]", "먹어 [머거]"],
      q: [["Article 1 says to write standard words…", ["only as they sound", "as they sound, but according to grammar", "in Chinese characters", "as in Middle Korean"], 1, "소리대로 적되 어법에 맞도록."],
          ["Which word is simply written as it sounds?", ["꽃이", "사람", "먹어", "앉아"], 1, "사람 [사람]: no change."],
          ["Why do we write 꽃만, not 꼰만?", ["Both are fine", "The morpheme 꽃 keeps one spelling", "꼰 isn't a syllable", "Because of 사이시옷"], 1, "Keeping 꽃 makes the word recognizable."]] },
    { t: "The initial-sound rule", k: "두음 법칙",
      s: "At the start of a Sino-Korean word, some sounds change. Inside a word, the original shows up again.",
      p: ["녀, 뇨, 뉴, 니 → 여, 요, 유, 이 at the start: 女子 여자, but 남녀.",
          "랴, 려, 례, 료, 류, 리 → 야, 여, 예, 요, 유, 이: 理由 이유, 歷史 역사, but 원리, 경력.",
          "라, 래, 로, 뢰, 루, 르 → 나, 내, 노, 뇌, 누, 느: 老人 노인, but 경로."],
      ex: ["여자 / 남녀", "이유 / 원리", "노인 / 경로", "역사 / 경력"],
      q: [["女子 is written…", ["녀자", "여자", "니자", "요자"], 1, "녀 → 여 at the start."],
          ["理由 is written…", ["리유", "이유", "니유", "리우"], 1, "리 → 이 at the start."],
          ["老人 is written…", ["로인", "노인", "오인", "뇌인"], 1, "로 → 노 at the start."]] },
    { t: "Words that look alike", k: "헷갈리는 말",
      s: "Pairs that differ by one letter and mean very different things.",
      p: ["낫다 (get better; be better), 낳다 (give birth), 낮다 (low), 나다 (come out, happen).",
          "잊다 (forget) vs 잃다 (lose).",
          "맞추다 (fit, adjust, compare) vs 맞히다 (get the answer right, hit).",
          "가르치다 (teach) vs 가리키다 (point at)."],
      ex: ["감기가 다 나았어요.", "아기를 낳았어요.", "지갑을 잃어버렸어요.", "정답을 맞혔어요.", "손가락으로 가리켰어요."],
      q: [["\"I got over my cold\": 감기가 다 ___.", ["나았어요", "낳았어요", "낮았어요", "났어요"], 0, "낫다 → 나았어요."],
          ["\"I lost my wallet\": 지갑을 ___.", ["잊어버렸어요", "잃어버렸어요", "잊었어요", "잃었버렸어요"], 1, "잃다 = lose."],
          ["\"I got the answer right\": 정답을 ___.", ["맞췄어요", "맞혔어요", "맞았어요", "맞쳤어요"], 1, "맞히다 = hit the answer."],
          ["\"She pointed at the map\": 지도를 ___.", ["가르쳤어요", "가리켰어요", "가르켰어요", "가리쳤어요"], 1, "가리키다 = point."]] },
    { t: "Sounds that shouldn't be there", k: "불필요한 음운이 덧붙은 활용",
      s: "Common forms that add a sound the standard doesn't have.",
      p: ["Extra 이: 설레이다 → 설레다 (설레는), 개이다 → 개다, 헤매이다 → 헤매다, 되뇌이다 → 되뇌다.",
          "ㄹ must drop before -(으)ㄴ, -는: 날으는 → 나는, 거칠은 → 거친, 낯설은 → 낯선.",
          "바라다 (wish) gives 바라요, 바람. 바래요 belongs to 바래다 (fade)."],
      ex: ["마음이 설레요.", "하늘을 나는 새", "거친 손", "건강하길 바라요."],
      q: [["Which is standard?", ["설레이는 마음", "설레는 마음", "설래는 마음", "설레여지는 마음"], 1, "설레다 → 설레는."],
          ["\"A flying bird\" is…", ["날으는 새", "나는 새", "날는 새", "날은 새"], 1, "ㄹ drops before -는: 나는."],
          ["\"I hope you're well\" (standard) is…", ["잘 지내길 바래요.", "잘 지내길 바라요.", "잘 지내길 바랬어요.", "잘 지내길 바레요."], 1, "바라다 → 바라요."]] },
    { t: "Allowed variants", k: "복수 표준어와 허용 발음",
      s: "Standard Korean sometimes accepts two forms, in spelling or in pronunciation.",
      p: ["Two standard words: 자장면 and 짜장면, 먹을거리 and 먹거리 (both accepted in 2011), 넝쿨 and 덩굴.",
          "Allowed pronunciations: the particle 의 as [에], 맛있다 as [마딛따] or [마싣따], 되어 as [되어] or [되여].",
          "When the rules allow both, neither is a mistake. Dictionaries mark the variants."],
      ex: ["짜장면 = 자장면", "우리의 [우리의/우리에]", "맛있다 [마딛따/마싣따]"],
      q: [["Which pair are both standard?", ["짜장면 / 자장면", "설레다 / 설레이다", "날다 / 날으다", "바라다 / 바래다 (wish)"], 0, "짜장면 was added in 2011."],
          ["맛있다 may be pronounced…", ["only [마싣따]", "only [마딛따]", "[마딛따] or [마싣따]", "[마시따] only"], 2, "Both are allowed."],
          ["When two forms are both standard…", ["the older one is correct", "neither is a mistake", "only one is used in writing", "you must use the longer one"], 1, "Both are correct."]] }
  ],

  /* ── C1 북촌 ── */
  bukchon: [
    { t: "Bound to, merely", k: "-기 마련이다 · -(으)ㄹ 뿐이다 · -에 불과하다",
      s: "Three ways to frame something as natural, as the only thing, or as nothing more.",
      p: ["-기 마련이다: it's natural, bound to happen. 사람은 누구나 실수하기 마련이다.",
          "-(으)ㄹ 뿐이다: only, nothing more. 저는 할 일을 했을 뿐이에요.",
          "N에 불과하다: be merely. 그건 소문에 불과해요."],
      ex: ["시간이 지나면 잊히기 마련이에요.", "그냥 궁금했을 뿐이에요.", "참가자는 열 명에 불과했다."],
      q: [["\"Everyone makes mistakes, naturally\" is…", ["누구나 실수하기 마련이에요.", "누구나 실수할 뿐이에요.", "누구나 실수에 불과해요.", "누구나 실수하기는커녕이에요."], 0, "-기 마련이다."],
          ["\"I just did my job\" is…", ["제 일을 했을 뿐이에요.", "제 일을 하기 마련이에요.", "제 일에 불과했어요.", "제 일을 하느니 차라리요."], 0, "-(으)ㄹ 뿐이다."],
          ["\"That's merely a rumor\" is…", ["그건 소문에 불과해요.", "그건 소문일 마련이에요.", "그건 소문하기 뿐이에요.", "그건 소문을 불과해요."], 0, "N에 불과하다."]] },
    { t: "Far from it, rather", k: "-기는커녕 · -느니 차라리",
      s: "Strong contrasts: the opposite of what was expected, and the lesser of two evils.",
      p: ["-기는커녕 / N은커녕: far from, let alone. 칭찬은커녕 혼만 났어요.",
          "-느니 (차라리): rather than X, I'd (sooner) Y. 그렇게 사느니 차라리 혼자 살겠어요."],
      ex: ["쉬기는커녕 더 바빠졌어요.", "밥은커녕 물도 못 마셨어요.", "줄을 서느니 차라리 다른 데 가요."],
      q: [["\"Far from resting, I got busier\" is…", ["쉬기는커녕 더 바빠졌어요.", "쉬느니 더 바빠졌어요.", "쉬기 마련이라 바빠졌어요.", "쉬었을 뿐 바빠졌어요."], 0, "-기는커녕 = far from."],
          ["\"I'd rather go elsewhere than wait in line\" is…", ["줄을 서느니 차라리 다른 데 가요.", "줄을 서기는커녕 다른 데 가요.", "줄을 섰더라면 다른 데 가요.", "줄을 서고 말아 다른 데 가요."], 0, "-느니 차라리."]] },
    { t: "Even if, if only", k: "-더라도 · -았/었더라면",
      s: "Concession and regret.",
      p: ["-더라도: even if (stronger than -아/어도). 비가 오더라도 갈 거예요.",
          "-았/었더라면: if only, had I…, usually with -았/었을 텐데 or -았/었을 거예요. 일찍 왔더라면 만났을 텐데.",
          "Both lean on the speaker's attitude: firm resolve with -더라도, regret with -더라면."],
      ex: ["힘들더라도 포기하지 마세요.", "조금만 더 일찍 출발했더라면 좋았을 텐데요."],
      q: [["\"Even if it's hard, don't give up\" is…", ["힘들더라도 포기하지 마세요.", "힘들었더라면 포기하지 마세요.", "힘들기는커녕 포기하지 마세요.", "힘들느니 포기하지 마세요."], 0, "-더라도 = even if."],
          ["\"If I had studied, I'd have passed\" is…", ["공부했더라면 합격했을 거예요.", "공부하더라도 합격했을 거예요.", "공부하느니 합격했을 거예요.", "공부했더니 합격했을 거예요."], 0, "-았/었더라면 = had I."],
          ["Which expresses regret?", ["가더라도", "갔더라면", "가기 마련이다", "가느라고"], 1, "-았/었더라면 looks back with regret."]] },
    { t: "Ending up, only after", k: "-고 말다 · -고서야",
      s: "Outcomes you didn't want, and conditions that had to be met first.",
      p: ["-고 말다: ended up (often regretful), or a firm will (-고 말겠다). 결국 울고 말았어요. 꼭 합격하고 말겠어요.",
          "-고서야: only after. 실패하고서야 깨달았어요."],
      ex: ["참다가 결국 웃고 말았어요.", "다 읽고서야 잠이 들었어요.", "이번에는 꼭 이기고 말 거예요."],
      q: [["\"I ended up crying\" is…", ["울고 말았어요.", "울고서야 했어요.", "울기 마련이에요.", "울었을 뿐이에요."], 0, "-고 말다 = ended up."],
          ["\"Only after I failed did I realize\" is…", ["실패하고서야 깨달았어요.", "실패하고 말아 깨달았어요.", "실패하더라도 깨달았어요.", "실패하느니 깨달았어요."], 0, "-고서야 = only after."]] },
    { t: "As soon as, because of, as you know", k: "-는 대로 · -는 바람에 · -다시피",
      s: "Three connectors that show up in news, work emails and storytelling.",
      p: ["-는 대로: as soon as (future actions), or as/in the way that. 도착하는 대로 연락드리겠습니다.",
          "-는 바람에: because of (an unexpected cause, usually bad). 버스를 놓치는 바람에 늦었어요.",
          "-다시피: as (you know, I said). 아시다시피 내일은 휴일입니다. Also 'almost as if': 매일 오다시피 해요."],
      ex: ["결과가 나오는 대로 알려 드릴게요.", "알람이 안 울리는 바람에 지각했어요.", "보시다시피 자리가 없어요."],
      q: [["\"I'll contact you as soon as I arrive\" (formal) is…", ["도착하는 대로 연락드리겠습니다.", "도착하는 바람에 연락드리겠습니다.", "도착하다시피 연락드리겠습니다.", "도착하고서야 연락드리겠습니다."], 0, "-는 대로 = as soon as."],
          ["\"I was late because I missed the bus\" (unexpected) is…", ["버스를 놓치는 바람에 늦었어요.", "버스를 놓치는 대로 늦었어요.", "버스를 놓치다시피 늦었어요.", "버스를 놓치기 마련이라 늦었어요."], 0, "-는 바람에 = because of something unexpected."],
          ["\"As you know\" (formal) is…", ["아시다시피", "아는 대로요", "아는 바람에", "알기는커녕"], 0, "-다시피 = as."]] },
    { t: "Might", k: "-(으)ㄹ지도 모르다",
      s: "A softer way to say something may happen or may be true.",
      p: ["-(으)ㄹ지도 모르다: might. 내일 비가 올지도 몰라요.",
          "For the past: -았/었을지도 모르다. 벌써 도착했을지도 몰라요."],
      ex: ["늦을지도 모르니까 먼저 드세요.", "그 사람이 이미 알았을지도 몰라요."],
      q: [["\"It might rain tomorrow\" is…", ["내일 비가 올지도 몰라요.", "내일 비가 오는지도 몰라요.", "내일 비가 왔지도 몰라요.", "내일 비가 올지 몰라도요."], 0, "-(으)ㄹ지도 모르다."],
          ["\"He might have arrived already\" is…", ["벌써 도착했을지도 몰라요.", "벌써 도착할지도 몰랐어요.", "벌써 도착하는지도 몰라요.", "벌써 도착했지도 몰라요."], 0, "Past: -았/었을지도 모르다."]] },
    { t: "Switching registers", k: "격식체와 비격식체 전환",
      s: "Fluent speakers move between formal and informal speech within one conversation, and that switch carries meaning.",
      p: ["Formal -(스)ㅂ니다 for announcements, presentations, the start and end of a meeting, and official emails.",
          "Polite 해요체 for most face-to-face talk, even at work, once the formal opening is done.",
          "Switching up to -습니다 mid-conversation can signal seriousness or distance; switching down to 반말 signals closeness or, if uninvited, rudeness."],
      ex: ["지금부터 회의를 시작하겠습니다.", "그럼 이 부분은 어떻게 할까요?", "이상으로 발표를 마치겠습니다."],
      q: [["Opening a meeting, which is most natural?", ["회의 시작해.", "회의를 시작하겠습니다.", "회의 시작하자.", "회의를 시작하네."], 1, "Openings use the formal style."],
          ["During discussion with colleagues, most people use…", ["해라체", "해요체", "하게체", "하오체"], 1, "해요체 for most face-to-face talk."],
          ["Suddenly switching from 해요체 to -습니다 can signal…", ["closeness", "seriousness or distance", "a joke only", "nothing at all"], 1, "Going up in formality adds distance."]] }
  ]
};

/* Splice the new lessons in before each unit's mission and register their practice */
(function () {
  Object.entries(MORE_LESSONS).forEach(([id, lessons]) => {
    const u = UNITS.find(x => x.id === id);
    if (!u) return;
    const m = u.lessons.findIndex(l => l.kind === "mission");
    const at = m === -1 ? u.lessons.length : m;
    let k = 0;
    lessons.filter(l => l.at == null).forEach(l => {
      const { q, ...lesson } = l;
      u.lessons.splice(at + k, 0, lesson);
      PRACTICE[`${id}:${at + k}`] = q;
      k++;
    });
    // lessons with a fixed position: shift the practice of everything after them
    lessons.filter(l => l.at != null).forEach(l => {
      const { q, at: pos, ...lesson } = l;
      for (let j = u.lessons.length - 1; j >= pos; j--) {
        if (PRACTICE[`${id}:${j}`]) { PRACTICE[`${id}:${j + 1}`] = PRACTICE[`${id}:${j}`]; delete PRACTICE[`${id}:${j}`]; }
      }
      u.lessons.splice(pos, 0, lesson);
      PRACTICE[`${id}:${pos}`] = q;
    });
  });
})();
