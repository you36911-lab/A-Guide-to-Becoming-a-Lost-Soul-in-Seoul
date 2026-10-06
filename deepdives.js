/* =========================================================
   Deep dives (심화) — premium, nice-to-know notes for every level.
   Not required to move on, but they make your Korean richer.
   { id, title, titleKo, level, places: [unit ids], lede,
     sections: [{ h, p: [...], ex: [...], table: { head, rows } }] }
   ========================================================= */

const DEEP_DIVES = [
  {
    id: "romanization", title: "Writing Korean in Latin letters", titleKo: "로마자 표기법", level: "A0", places: ["seochon"],
    lede: "The same city is Busan on road signs and Pusan in older books. Korean has several romanization systems, and they disagree for good reasons.",
    sections: [
      { h: "Three systems",
        table: { head: ["System", "Used for", "부산", "김치", "한국어"], rows: [
          ["Revised Romanization (2000)", "South Korea's official system: signs, maps, passports", "Busan", "gimchi", "hangugeo"],
          ["McCune–Reischauer (1939)", "Western scholarship for decades; basis of North Korea's system", "Pusan", "kimch'i", "han'gugŏ"],
          ["Yale (1942)", "Linguistics; writes the spelling letter by letter", "pwusan", "kimchi", "hankwuke"]] },
        p: ["Revised Romanization uses no special symbols (ㅓ = eo, ㅡ = eu). It follows pronunciation, so 신라 is Silla, but leaves out tensing: 압구정 is Apgujeong, though it's pronounced [압꾸정].",
            "McCune–Reischauer marks aspiration with an apostrophe and uses ŏ and ŭ. It writes ㄱ ㄷ ㅂ ㅈ as k t p ch, or g d b j between voiced sounds, which is why it has Pusan but Taegu."] },
      { h: "Names do their own thing",
        p: ["Personal names follow habit, not rules. 이 appears as Lee, Yi, I or Rhee; 박 is usually Park; 김 is Kim. Many people choose their own spelling for their passport and keep it for life."],
        ex: ["부산 Busan / Pusan", "대구 Daegu / Taegu", "독립문 Dongnimmun / Tongnimmun"] },
      { h: "Why the app teaches Hangul instead",
        p: ["Romanization is for signs and passports. No Latin spelling captures the plain, tense and aspirated contrast cleanly, so learning sounds through Hangul is faster in the end."] }
    ]
  },
  {
    id: "color-words", title: "More than red: shades in Korean", titleKo: "색채어의 세계", level: "B1", places: ["gangnam"],
    lede: "Korean color words stretch and shrink with prefixes and suffixes, so one adjective can paint a whole range of shades.",
    sections: [
      { h: "Deeper: 새-, 샛-, 시-, 싯-",
        p: ["A prefix makes a color vivid. 새- and 샛- go with bright vowels, 시- and 싯- with dark ones, the same bright/dark split you met in the vowels: 새빨갛다, 샛노랗다, 시퍼렇다, 싯누렇다."],
        ex: ["새빨간 거짓말", "샛노란 개나리", "시퍼런 바다"] },
      { h: "Softer: -스름하다, -르스름하다",
        p: ["Suffixes make a color pale or 'a little': 불그스름하다 (reddish), 노르스름하다 (yellowish), 푸르스름하다 (bluish). 발그레하다 is the pink of flushed cheeks."],
        ex: ["얼굴이 발그레해졌어요.", "노르스름하게 구워 주세요."] },
      { h: "Bright and dark vowels again",
        p: ["Swap the vowel and the feeling shifts: 빨갛다 is a clear red, 뻘겋다 a heavier, duller red; 노랗다 bright yellow, 누렇다 a dull, brownish yellow. 하얗다 / 허옇다 and 까맣다 / 꺼멓다 work the same way."],
        table: { head: ["Bright", "Dark"], rows: [["빨갛다", "뻘겋다"], ["노랗다", "누렇다"], ["하얗다", "허옇다"], ["까맣다", "꺼멓다"]] } }
    ]
  },
  {
    id: "addressing-people", title: "씨, 님, 선생님: what to call people", titleKo: "호칭의 기초", level: "A1", places: ["sinchon"],
    lede: "Korean rarely uses 'you'. Instead, people call each other by name plus a title, and choosing the title is half the politeness.",
    sections: [
      { h: "씨 and 님",
        p: ["씨 goes after a full name or a given name: 김민지 씨, 민지 씨. It's polite between equals, but after a surname alone (김 씨) it can sound distant or even condescending, so avoid it for anyone senior. You never use 씨 for yourself.",
            "님 is more respectful and attaches to titles and roles: 선생님, 사장님, 고객님, 팀장님. At work, people are usually called by their position plus 님 rather than by name."],
        ex: ["민지 씨, 안녕하세요?", "팀장님, 회의 시작할까요?", "고객님, 잠시만 기다려 주세요."] },
      { h: "선생님 for almost anyone",
        p: ["선생님 means teacher, but it's also used for doctors, writers and, more generally, adults you want to treat with respect when you don't know their title."] },
      { h: "Family words for strangers",
        p: ["Among friends and in casual settings, family words do the work: a woman calls an older woman 언니 and an older man 오빠; a man says 누나 and 형. In a small restaurant, 이모 (aunt) is a friendly way to call the staff."],
        ex: ["언니, 이거 같이 먹어요.", "이모, 여기 김치 좀 더 주세요."] }
    ]
  },
  {
    id: "yuwol-siwol", title: "유월 and 시월: numbers that change shape", titleKo: "달 이름의 비밀", level: "A2", places: ["gangnam"],
    lede: "Every month is a number plus 월, except two. They're spelled the way people actually said them.",
    sections: [
      { h: "Two exceptions",
        p: ["Six is 육 and ten is 십, but June is 유월 and October is 시월. The consonant dropped out in speech long ago, and the spelling followed. Korean spelling rules allow this for a handful of words written the way they're commonly pronounced (속음)."],
        table: { head: ["Number", "Month", "Not"], rows: [["육 (6)", "유월", "육월"], ["십 (10)", "시월", "십월"]] },
        ex: ["유월 육일", "시월 십일"] },
      { h: "In expressions",
        p: ["The same sound change shows up in 오뉴월, 'May and June', the hottest stretch of early summer in older speech, as in the saying 오뉴월 감기는 개도 안 걸린다 (even a dog doesn't catch a cold in midsummer)."] }
    ]
  },
  {
    id: "hage-hao", title: "The speech levels nobody teaches", titleKo: "하게체와 하오체", level: "C1", places: ["dongdaemun"],
    lede: "Textbooks teach four speech levels and quietly skip two. You'll still hear them: from a father-in-law to his son-in-law, from an old professor to a former student, on signs telling you not to enter.",
    sections: [
      { h: "하게체: respect from above",
        p: ["하게체 is used by someone older or higher in status toward an adult they still want to treat with some dignity. The classic case is a father-in-law speaking to his son-in-law, who is a grown man and part of the family but clearly junior. An elderly professor may use it with a former student, or an older man with a younger friend he has known for decades.",
            "It usually comes with the pronoun 자네 (you), and in-laws call a son-in-law by his surname plus 서방: 김 서방, 이 서방."],
        table: { head: ["Sentence type", "Ending", "Example"], rows: [["Statement", "-네", "비가 오네."], ["Question", "-는가 / -나", "자네 왔는가? 밥은 먹었나?"], ["Command", "-게", "어서 들어오게."], ["Suggestion", "-세", "이 서방, 한잔하세."]] },
        ex: ["자네 왔는가? 어서 들어오게.", "이 서방, 오늘은 자고 가게."] },
      { h: "하오체: the level that slipped away",
        p: ["하오체 once sat between the formal and the plain levels, used between adults of similar status or toward a lower-ranked adult. It survives in historical dramas, in some older couples' speech, and above all in notices and signs.",
            "One piece of it is everywhere: the suggestion ending -ㅂ시다. Because it belongs to 하오체, 갑시다 or 합시다 said to someone older or higher in rank can sound like you're giving them orders. To a superior, people say 가시지요 or 같이 가세요 instead."],
        table: { head: ["Sentence type", "Ending", "Example"], rows: [["Statement", "-오 / -소", "내가 가오. 밥을 먹소."], ["Question", "-오? / -소?", "어디 가오?"], ["Command", "-(으)오 / -구려", "출입을 삼가시오."], ["Suggestion", "-ㅂ시다", "같이 갑시다."]] },
        ex: ["출입을 삼가시오.", "잔디밭에 들어가지 마시오.", "부장님, 같이 가시지요."] },
      { h: "What to do with this",
        p: ["You'll rarely need to produce either level. Recognizing them tells you a lot about the relationship between two speakers, and it explains why 갑시다 can land badly with your boss."] }
    ]
  },
  {
    id: "family-honorifics", title: "Honorifics in the family", titleKo: "압존법과 가족 호칭", level: "C1", places: ["dongdaemun", "bukchon"],
    lede: "Marry into a Korean family and you gain a whole vocabulary of titles, plus a rule about lowering respect for someone in front of someone higher.",
    sections: [
      { h: "압존법: lowering respect in front of someone higher",
        p: ["Traditionally, when you talk about a person to someone who outranks them, you don't use honorifics for that person. A grandchild speaking to a grandfather about their own father would say 아버지가 아직 안 왔습니다, not 아버지께서 아직 안 오셨습니다.",
            "The National Institute of Korean Language's guide to language etiquette (『표준 언어 예절』, 2011) describes this as the traditional practice in the family but also accepts honoring the father in that sentence. At work, it recommends not using 압존법 at all: 부장님, 과장님께서 외출하셨습니다 is the polite version."],
        ex: ["할아버지, 아버지가 아직 안 왔습니다. (traditional)", "할아버지, 아버지께서 아직 안 오셨습니다. (also accepted)", "부장님, 과장님께서 외출하셨습니다. (at work)"] },
      { h: "Your husband's family",
        table: { head: ["Relationship", "What you call them"], rows: [["Husband's father / mother", "아버님 / 어머님"], ["Husband's older brother", "아주버님"], ["Husband's younger brother", "도련님 (unmarried), 서방님 (married)"], ["Husband's older sister", "형님"], ["Husband's younger sister", "아가씨"], ["Wife of husband's older brother", "형님"]] },
        p: ["Many people find 도련님 and 아가씨 lopsided, since the husband's side doesn't use comparably deferential words for the wife's family. More recent guidance from the National Institute accepts simply using the person's name with 씨, and many younger families do."] },
      { h: "Your wife's family",
        table: { head: ["Relationship", "What you call them"], rows: [["Wife's father / mother", "장인어른, 아버님 / 장모님, 어머님"], ["Wife's older brother", "형님"], ["Wife's younger brother", "처남"], ["Wife's older sister", "처형"], ["Wife's younger sister", "처제"]] },
        p: ["In return, parents-in-law usually call a son-in-law 김 서방 or 자네, often in 하게체, and a daughter-in-law 아가, 새아가, or later 어미야 once she has children."] }
    ]
  },
  {
    id: "deo", title: "What you saw with your own eyes", titleKo: "회상의 -더-", level: "B2", places: ["daehakro"],
    lede: "One small syllable, -더-, marks something you witnessed yourself and are now recalling. It changes what you're allowed to say about yourself and others.",
    sections: [
      { h: "Firsthand, then recalled",
        p: ["그 식당 음식 맛있더라 means you went and tasted it. If you only heard, you'd say 맛있대. The -더- form carries your own experience as evidence, which is why it's so common when recommending or warning."],
        ex: ["그 식당 음식 맛있더라. (I ate there.)", "그 식당 음식 맛있대. (I heard.)", "민수가 벌써 와 있더라고요."] },
      { h: "The first-person puzzle",
        p: ["You normally don't report your own deliberate actions with -더-, because you don't witness yourself from outside: 내가 학교에 가더라 sounds strange. It becomes natural when you did watch yourself, in a dream or a video: 꿈에서 내가 하늘을 날더라.",
            "Feelings flip the rule. You can report your own feelings (나는 그 영화가 슬프더라), but not someone else's inner state directly: instead of 그는 슬프더라, say 그는 슬퍼하더라, describing what you saw him do."],
        ex: ["꿈에서 내가 하늘을 날더라.", "나는 그 영화가 너무 슬프더라.", "그 사람은 계속 슬퍼하더라."] },
      { h: "-던데 and -더니",
        p: ["-던데 sets up background from your observation, often to soften a disagreement or a suggestion: 어제 보니까 문이 닫혀 있던데요. -더니 links an observed past to a result or a change: 아침에는 춥더니 오후에는 따뜻하네요, 열심히 공부하더니 결국 합격했구나."],
        ex: ["어제 보니까 문이 닫혀 있던데요.", "아침에는 춥더니 오후에는 따뜻하네요.", "열심히 공부하더니 결국 합격했구나."] }
    ]
  },
  {
    id: "discovery-endings", title: "Noticing, realizing, reminding", titleKo: "-네요, -군요, -잖아요, -거든요, -더라고요", level: "B2", places: ["bukchon"],
    lede: "These endings don't change what happened. They change your relationship to the information, and getting them wrong sounds odd even when the grammar is fine.",
    sections: [
      { h: "Five endings, five stances",
        table: { head: ["Ending", "Stance", "Example"], rows: [
          ["-네요", "I'm noticing this right now.", "밖에 눈이 오네요."],
          ["-군요", "I've just realized this, often from evidence. A little more formal.", "그래서 늦으셨군요."],
          ["-잖아요", "You already know this.", "제가 어제 말했잖아요."],
          ["-거든요", "Here's background you don't have.", "어제 좀 아팠거든요."],
          ["-더라고요", "I experienced this, and I'm telling you about it.", "거기 생각보다 멀더라고요."]] } },
      { h: "Common slips",
        p: ["-네요 can't be used for something you've known for a long time. Telling a friend 저는 독일 사람이네요 sounds like you just found out. -잖아요 can sound accusing if the listener really didn't know, so it's often softened with a laugh or 좀. -거든요 used too often can feel like you're constantly correcting people."],
        ex: ["저는 독일 사람이에요. (not 이네요)", "아, 그 사람이 선생님이셨군요!"] }
    ]
  },
  {
    id: "topic-subject", title: "Topic and subject: the hard parts", titleKo: "은/는과 이/가 심화", level: "C1", places: ["bukchon", "noryangjin"],
    lede: "Beginners learn that 은/는 marks the topic and 이/가 the subject. Here's what that leaves out.",
    sections: [
      { h: "Two subjects in one sentence",
        p: ["코끼리는 코가 길다: elephants (topic) have noses (subject) that are long. 는 sets what we're talking about; 가 marks what the predicate describes. The same pattern gives 저는 머리가 아파요 and 서울은 지하철이 편해요."],
        ex: ["코끼리는 코가 길다.", "저는 머리가 아파요.", "서울은 지하철이 편해요."] },
      { h: "Inside a clause, only 이/가",
        p: ["A clause that describes a noun or sets a condition uses 이/가 for its subject, never 은/는 unless you mean a contrast. 내가 좋아하는 사람, not 나는 좋아하는 사람. 비가 오면, not 비는 오면."],
        ex: ["내가 좋아하는 사람", "비가 오면 집에 있을게요.", "친구가 만든 케이크"] },
      { h: "New, then known",
        p: ["Stories show the switch clearly. A character appears with 이/가 and is then the topic with 은/는: 옛날 옛적에 호랑이가 살았어요. 그 호랑이는 배가 고팠어요."],
        ex: ["옛날 옛적에 호랑이가 살았어요. 그 호랑이는 배가 고팠어요."] },
      { h: "The contrast you didn't mean",
        p: ["Stress a 는 and you imply 'but not something else'. 술은 마셔요 answers 'Do you drink?' with 'alcohol, yes', hinting that something else is a no. A learner who says 김치는 좋아해요 when asked about Korean food may be heard as saying they don't like the rest."],
        ex: ["술은 마셔요. (…but maybe not something else)", "김치는 좋아해요."] }
    ]
  },
  {
    id: "banmal", title: "When to drop the 요", titleKo: "말 놓기와 반말", level: "B1", places: ["sinchon", "dongdaemun"],
    lede: "Switching from polite speech to 반말 is a small social negotiation, and Korean has set phrases for it.",
    sections: [
      { h: "Who offers",
        p: ["Usually the older or more senior person suggests it: 말 편하게 해도 돼요? or 말 놓을까요? The younger person might say 말씀 편하게 하세요, inviting the senior to drop the formality while keeping their own polite speech. Switching on your own, without this exchange, can come across as rude."],
        ex: ["우리 말 놓을까요?", "말씀 편하게 하세요.", "그럼 이제 편하게 할게."] },
      { h: "What counts: age, class year, rank",
        p: ["Age is the default measure, but students also use their entry year (학번), and colleagues their position. Two people of the same age who meet as adults often stay polite until one of them suggests switching."] },
      { h: "Two kinds of 반말",
        p: ["반말 usually means 해체: 먹어, 갔어, 뭐 해? The plain style 해라체 (먹는다, 먹어라) is different: it appears in writing, in diaries and news, toward children, and between very close friends with a teasing or blunt edge."],
        table: { head: ["", "해체", "해라체"], rows: [["Statement", "먹어", "먹는다"], ["Question", "먹어?", "먹니? / 먹냐?"], ["Command", "먹어", "먹어라"], ["Suggestion", "먹어", "먹자"]] } }
    ]
  },
  {
    id: "sound-symbolism", title: "Why 캄캄 is darker than 감감", titleKo: "의성어·의태어와 소리의 느낌", level: "A2", places: ["seochon", "hongdae"],
    lede: "Korean sound-symbolic words use the sound system you already know. Swap a consonant or a vowel and the feeling changes in a predictable way.",
    sections: [
      { h: "Consonants: plain, tense, aspirated",
        p: ["Plain consonants feel softer; tense and aspirated ones feel stronger. 감감하다 is faint and far off; 깜깜하다 and 캄캄하다 are pitch dark. 빙빙 is spinning, 삥삥 and 핑핑 spin harder."],
        ex: ["감감하다 → 깜깜하다 → 캄캄하다", "빙빙 → 삥삥 → 핑핑"] },
      { h: "Vowels: bright and dark",
        p: ["Remember the bright vowels (ㅏ ㅗ) and dark vowels (ㅓ ㅜ) from Gwanghwamun. Bright vowels make things small, light, quick; dark ones make them big, heavy, slow. A pebble goes 퐁당, a big rock goes 풍덩. A small star twinkles 반짝반짝; lightning flashes 번쩍번쩍. A thin stream runs 졸졸, a heavy flow 줄줄."],
        ex: ["퐁당 / 풍덩", "반짝반짝 / 번쩍번쩍", "졸졸 / 줄줄", "동동 / 둥둥"] },
      { h: "Using it",
        p: ["When you meet a new mimetic word, try swapping its vowels or consonants. Often the variant exists and means a smaller, bigger, softer or harsher version of the same thing."] }
    ]
  },
  {
    id: "translationese", title: "Sounding translated", titleKo: "번역 투와 이중 피동", level: "C1", places: ["insadong", "daehakro"],
    lede: "Advanced learners often write correct Korean that still sounds translated. Most of it comes from a handful of patterns borrowed from English or Japanese.",
    sections: [
      { h: "Double passives",
        p: ["잊혀지다 stacks two passives: 잊히다 is already passive, and -어지다 adds another. Style guides, including the National Institute of Korean Language, recommend the single form. The same goes for 쓰여지다 (쓰이다), 보여지다 (보이다) and 되어지다 (되다)."],
        table: { head: ["Avoid", "Prefer"], rows: [["잊혀지다", "잊히다"], ["쓰여진 글", "쓰인 글"], ["보여지다", "보이다"], ["결정되어지다", "결정되다"]] } },
      { h: "Borrowed patterns",
        p: ["Several phrases come straight from other languages and sound stiff in natural Korean. ~에 있어서 (in, regarding) can usually be ~에서 or ~에 대해. 회의를 가지다 (have a meeting) is just 회의를 하다. Passives with an agent, ~에 의해, are often clearer as an active sentence. And 그녀 (she) is rare in speech; Koreans use the person's name or title."],
        table: { head: ["Translated", "Natural"], rows: [["교육에 있어서 중요한 것은", "교육에서 중요한 것은"], ["회의를 가졌다", "회의를 했다"], ["그 문제는 정부에 의해 해결되었다", "정부가 그 문제를 해결했다"], ["그녀는 웃었다", "지수는 웃었다"]] } }
    ]
  }
];
