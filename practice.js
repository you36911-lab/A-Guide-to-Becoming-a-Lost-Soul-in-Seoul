/* =========================================================
   Practice content
   PRACTICE["unitId:lessonIndex"] = list of items:
     [question, [options], answerIndex, explanation]   multiple choice
     { order: [...words in correct order], q, why }       tap words in order
     { drill: "pron", words: [...] }                      auto: pronunciation (engine)
     { drill: "conj", form: "haeyo"|"past"|"seyo"|..., words: [...] }
     { drill: "num", items: [...] }                       auto: reading numbers
   ========================================================= */

const PRACTICE = {
  /* 광화문 */
  "gwanghwamun:0": [
    ["Which letter shows the tongue tip touching the ridge behind the teeth?", ["ㄱ", "ㄴ", "ㅁ", "ㅇ"], 1, "ㄴ pictures the tongue tip raised to the upper gum."],
    ["Which basic letter is modeled on a tooth?", ["ㅅ", "ㅁ", "ㅇ", "ㄱ"], 0, "ㅅ is the shape of a tooth; it's a sound made with the teeth."]
  ],
  "gwanghwamun:1": [
    ["Add a stroke to ㄷ. Which letter do you get?", ["ㄸ", "ㅌ", "ㄹ", "ㅍ"], 1, "ㄴ → ㄷ → ㅌ: each stroke adds breath."],
    ["Which letter does NOT follow the stroke-adding rule?", ["ㅋ", "ㅊ", "ㄹ", "ㅍ"], 2, "ㄹ is an 이체자, a letter shaped differently from its group."],
    ["Doubling ㅂ gives…", ["ㅍ", "ㅃ", "ㅁ", "ㅄ"], 1, "Doubled letters are tense: ㅃ."]
  ],
  "gwanghwamun:2": [
    ["The three symbols behind all vowels stand for…", ["sun, moon, star", "heaven, earth, human", "fire, water, wood", "mouth, tongue, teeth"], 1, "천지인: ㆍ heaven, ㅡ earth, ㅣ human."],
    ["Which of these is a bright vowel (양성 모음)?", ["ㅓ", "ㅜ", "ㅗ", "ㅡ"], 2, "ㅏ and ㅗ are bright; ㅓ and ㅜ are dark."]
  ],
  "gwanghwamun:3": [
    ["ㅂ + ㅗ + ㅁ makes…", ["봄", "밤", "붐", "봄ㅁ"], 0, "ㅗ is a flat vowel, so ㅂ sits on top and ㅁ at the bottom: 봄."],
    ["What does ㅇ do at the start of 아?", ["It sounds like ng", "Nothing: it's a silent placeholder", "It makes the vowel long", "It sounds like h"], 1, "A block must start with a consonant; ㅇ fills the seat silently."],
    ["Which vowel is written to the RIGHT of the consonant?", ["ㅗ", "ㅜ", "ㅡ", "ㅓ"], 3, "Tall vowels (ㅏ ㅓ ㅣ) go right; flat ones (ㅗ ㅜ ㅡ) go below."]
  ],

  /* 서촌 */
  "seochon:0": [
    ["In everyday Seoul speech, 개 (dog) and 게 (crab) sound…", ["clearly different", "the same", "different only in length", "different only in pitch"], 1, "Most speakers have merged ㅐ and ㅔ. Context tells them apart."],
    ["How many single vowels does the standard pronunciation list?", ["7", "8", "10", "21"], 2, "표준 발음법 제4항 lists ten: ㅏ ㅐ ㅓ ㅔ ㅗ ㅚ ㅜ ㅟ ㅡ ㅣ."]
  ],
  "seochon:1": [
    ["How is 희망 pronounced?", ["[희망]", "[히망]", "[흐망]", "[회망]"], 1, "ㅢ after a consonant is read [ㅣ]."],
    ["The particle in 우리의 can be pronounced…", ["only [의]", "[의] or [에]", "only [이]", "[으]"], 1, "The possessive 의 may be read [에]."]
  ],
  "seochon:2": [
    ["Which word has an aspirated (거센소리) first consonant?", ["불", "뿔", "풀", "물"], 2, "ㅍ is aspirated: a strong puff of air."],
    ["What separates ㄷ, ㄸ, ㅌ?", ["Voicing, like d and t", "Breath and tension", "Tongue position", "Lip rounding"], 1, "Korean contrasts breath (aspiration) and tension, not voicing."],
    ["Which one is tense (된소리)?", ["자다", "짜다", "차다", "사다"], 1, "ㅉ is the tense member of ㅈ ㅉ ㅊ."]
  ],
  "seochon:3": [
    ["In 고기, how does the second ㄱ sound?", ["like k with a strong puff", "like g", "like ng", "silent"], 1, "Between vowels, plain ㄱ becomes voiced: [kogi]."],
    ["Why don't Koreans notice the k/g difference in 고기?", ["They do: the two are written differently", "Korean never uses it to tell words apart", "It only exists in dialects", "Because ㄱ is always g"], 1, "[k] and [g] are variants of one sound (변이음), so they never distinguish words."],
    ["How does ㄹ sound in 나라?", ["like English l", "a quick flap, like the tt in American \u201cbetter\u201d", "like a French r", "silent"], 1, "Between vowels ㄹ is a flap [ɾ]; at the end of a syllable it's [l]."]
  ],
  "seochon:4": [
    { drill: "pron", words: ["부엌", "옷", "앞", "낮", "꽃", "밖"] },
    ["낫, 낮, 낯, 낱 all sound like…", ["[낫]", "[낟]", "[낙]", "[날]"], 1, "ㅅ ㅈ ㅊ ㅌ all reduce to [ㄷ] at the end."]
  ],

  /* 홍대 */
  "hongdae:0": [{ drill: "pron", words: ["음악", "옷이", "꽃을", "앉아", "한국어", "읽어요"] }],
  "hongdae:1": [{ drill: "pron", words: ["옷 안", "꽃 위", "같이", "밭이", "굳이", "끝이"] }],
  "hongdae:2": [{ drill: "pron", words: ["축하", "좋다", "놓고", "입학", "많이", "좋아요"] }],
  "hongdae:3": [{ drill: "pron", words: ["국물", "밥만", "있는", "꽃망울", "종로", "음료", "닫는"] }],
  "hongdae:4": [{ drill: "pron", words: ["신라", "연락", "설날", "칼날", "물난리"] }],
  "hongdae:5": [{ drill: "pron", words: ["학교", "식당", "숙제", "국밥", "잡지", "약국"] }],
  "hongdae:6": [
    { drill: "pron", words: ["물약", "서울역", "휘발유", "알약"] },
    ["Why can't you predict 물약 [물략] from the spelling alone?", ["ㄹ is always doubled", "ㄴ is added only in certain compounds", "약 is a loanword", "It's a spelling mistake"], 1, "ㄴ 첨가 depends on the word being a compound, which spelling doesn't show."]
  ],

  /* 신촌 */
  "sinchon:0": [
    { order: ["저는", "커피를", "마셔요"], q: "Put the words in order: I drink coffee.", why: "Subject – object – verb. The verb comes last." },
    { order: ["민지가", "도서관에서", "책을", "읽어요"], q: "Minji reads a book in the library.", why: "Time and place usually come before the object; the verb ends the sentence." }
  ],
  "sinchon:1": [
    ["학생 + ___", ["예요", "이에요", "이예요", "에요"], 1, "학생 ends in a consonant, so 이에요."],
    ["의사 + ___", ["이에요", "예요", "이예요", "에요"], 1, "의사 ends in a vowel, so 예요."],
    ["\"I'm not Korean\" is…", ["저는 한국 사람이에요.", "저는 한국 사람이 아니에요.", "저는 한국 사람 없어요.", "저는 한국 사람을 아니에요."], 1, "N이/가 아니에요."]
  ],
  "sinchon:2": [
    ["빵___ 먹어요. (object)", ["은", "이", "을", "를"], 2, "빵 ends in a consonant: 을."],
    ["누가 왔어요? — 민수___ 왔어요.", ["는", "가", "를", "도"], 1, "Answering 누가 (who) takes 이/가: it's the new information."],
    ["Which particle marks the topic?", ["이/가", "을/를", "은/는", "에"], 2, "은/는 marks what the sentence is about."]
  ],
  "sinchon:3": [
    ["\"I have time\" is…", ["시간이 있어요.", "시간을 있어요.", "시간이에요.", "시간에 있어요."], 0, "Possession uses N이/가 있어요."],
    ["\"The bag is on the chair\": 가방이 의자___ 있어요.", ["에서", "에", "를", "가"], 1, "Location of existence takes 에."]
  ],

  /* 여의도 */
  "yeouido:0": [
    ["What is the stem of 읽다?", ["읽다", "읽", "이", "읽어"], 1, "Remove -다 from the dictionary form."],
    ["In 가셨어요, which part marks the past?", ["가", "시", "었", "어요"], 2, "가 + 시 + 었 + 어요: 었 is the past marker."]
  ],
  "yeouido:1": [{ drill: "conj", form: "haeyo", words: ["가다", "보다", "먹다", "마시다", "배우다", "공부하다", "오다", "기다리다"] }],
  "yeouido:2": [{ drill: "conj", form: "past", words: ["가다", "먹다", "보다", "하다", "주다", "만나다", "마시다"] }],
  "yeouido:3": [
    ["\"I can't eat spicy food\" is…", ["매운 음식을 안 먹어요.", "매운 음식을 못 먹어요.", "매운 음식을 먹지 마요.", "매운 음식이 없어요."], 1, "못 = inability."],
    ["Where does 안 go with 공부하다?", ["안 공부해요", "공부 안 해요", "공부해요 안", "공부안해요"], 1, "With N+하다 verbs, 안 goes before 하다."]
  ],

  /* 노량진 */
  "noryangjin:0": [
    ["도서관___ 책을 읽어요.", ["에", "에서", "으로", "에게"], 1, "An action happens there: 에서."],
    ["학교___ 가요.", ["에", "에서", "를", "도"], 0, "A destination with 가다: 에."],
    ["독일___ 왔어요. (from Germany)", ["에", "에서", "으로", "한테"], 1, "에서 also means \"from\" a place."]
  ],
  "noryangjin:1": [
    ["버스___ 왔어요. (by bus)", ["로", "으로", "에", "에서"], 0, "버스 ends in a vowel: 로."],
    ["연필___ 써요.", ["으로", "로", "에", "을"], 1, "After ㄹ, use 로, not 으로."],
    ["오른쪽___ 가세요.", ["로", "으로", "에서", "을"], 1, "오른쪽 ends in a consonant other than ㄹ: 으로."]
  ],
  "noryangjin:2": [
    ["친구___ 전화했어요. (spoken)", ["에", "한테", "에서", "께서"], 1, "For people in speech: 한테."],
    ["선생님___ 드렸어요.", ["에게", "한테", "께", "께서"], 2, "To someone you respect: 께."]
  ],
  "noryangjin:3": [
    ["\"I only drink water\": 물___ 마셔요.", ["도", "만", "까지", "부터"], 1, "만 = only."],
    ["서울___ 부산까지", ["부터", "에서", "에", "도"], 1, "Places: 에서 … 까지. Times: 부터 … 까지."],
    ["\"I'm a student too\": 저___ 학생이에요.", ["는", "도", "만", "가"], 1, "도 replaces 은/는 and means \"also\"."]
  ],

  /* 반포 */
  "banpo:0": [
    ["\"My brother wants to rest\" is…", ["동생이 쉬고 싶어요.", "동생이 쉬고 싶어해요.", "동생이 쉬고 싶다요.", "동생이 쉬고 있어요."], 1, "For a third person, use -고 싶어하다."]
  ],
  "banpo:1": [
    ["먹다 → ___ 거예요", ["먹을", "먹을을", "먹ㄹ", "먹는"], 0, "Consonant stem: -을 거예요."],
    ["In 내일 비가 올 거예요, -(으)ㄹ 거예요 means…", ["a plan", "a guess", "a command", "a past event"], 1, "Rain isn't planned: it's a guess."]
  ],
  "banpo:2": [
    ["\"I work part-time to save money\" is…", ["돈을 모으려고 아르바이트를 해요.", "돈을 모으고 싶어 아르바이트를 해요.", "돈을 모아서 아르바이트를 해요.", "돈을 모으면 아르바이트를 해요."], 0, "-(으)려고 states the purpose of the action."]
  ],
  "banpo:3": [
    ["\"My hobby is cooking\": 제 취미는 ___ 것이에요.", ["요리하는", "요리한", "요리할", "요리하기"], 0, "Habitual activity: -는 것."],
    ["In speech, 노래하는 것이 좋아요 often becomes…", ["노래하는 거 좋아요", "노래하는 게 좋아요", "노래하는 걸 좋아요", "노래하는 건 좋아요"], 1, "것이 → 게."]
  ],

  /* 강남 */
  "gangnam:0": [
    { drill: "num", items: [["time", 3, 30], ["time", 12, 5], ["price", 15000], ["price", 3500], ["month", 6], ["month", 10]] },
    ["Which numbers do Koreans use for hours?", ["Sino-Korean (일, 이, 삼)", "Native (한, 두, 세)", "Either", "English"], 1, "Hours are native, minutes are Sino-Korean."]
  ],
  "gangnam:1": [
    ["\"Two cups of coffee\" is…", ["커피 두 개", "커피 두 잔", "커피 이 잔", "커피 둘 잔"], 1, "Cups: 잔, and 둘 becomes 두 before a counter."],
    ["\"Three students\" is…", ["학생 세 명", "학생 삼 명", "학생 셋 명", "학생 세 마리"], 0, "People: 명, with native numbers."],
    ["Which counter is for animals?", ["권", "장", "마리", "병"], 2, "마리 counts animals."]
  ],
  "gangnam:2": [{ drill: "conj", form: "seyo", words: ["가다", "앉다", "읽다", "기다리다", "만들다", "듣다"] }],
  "gangnam:3": [
    ["\"Please say it again\" is…", ["다시 말해요.", "다시 말해 주세요.", "다시 말하고 주세요.", "다시 말을 주세요."], 1, "Verb + -아/어 주세요."],
    ["\"Water, please\" is…", ["물 주세요.", "물 해 주세요.", "물이 주세요.", "물 줘요 주세요."], 0, "Noun + 주세요."]
  ],

  /* 잠실 */
  "jamsil:0": [{ drill: "conj", form: "seyo", words: ["살다", "만들다", "알다"] }, { drill: "conj", form: "haeyo", words: ["쓰다", "바쁘다", "예쁘다", "크다"] }],
  "jamsil:1": [{ drill: "conj", form: "haeyo", words: ["덥다", "춥다", "어렵다", "돕다", "입다", "좁다"] }],
  "jamsil:2": [{ drill: "conj", form: "haeyo", words: ["듣다", "걷다", "닫다", "받다", "낫다", "짓다", "웃다"] }],
  "jamsil:3": [{ drill: "conj", form: "haeyo", words: ["모르다", "빠르다", "부르다", "그렇다", "하얗다", "파랗다", "좋다"] }],

  /* 성수 */
  "seongsu:0": [
    ["Which sentence is WRONG?", ["비가 와서 집에 있었어요.", "비가 왔어서 집에 있었어요.", "비가 오니까 우산 가져가세요.", "비싸지만 맛있어요."], 1, "-아/어서 doesn't take the past tense."],
    ["\"It's cold, so close the door\" (command) is…", ["추워서 문 닫으세요.", "추우니까 문 닫으세요.", "춥고 문 닫으세요.", "춥지만 문 닫으세요."], 1, "Commands after a reason take -(으)니까, not -아/어서."]
  ],
  "seongsu:1": [
    ["\"The movie I saw yesterday\" is…", ["어제 보는 영화", "어제 본 영화", "어제 볼 영화", "어제 보고 영화"], 1, "Past for verbs: -(으)ㄴ."],
    ["\"A friend I'll meet tomorrow\" is…", ["내일 만난 친구", "내일 만나는 친구", "내일 만날 친구", "내일 만나 친구"], 2, "Future: -(으)ㄹ."],
    ["\"A quiet café\" is…", ["조용하는 카페", "조용한 카페", "조용할 카페", "조용해 카페"], 1, "Adjectives in the present take -(으)ㄴ."]
  ],
  "seongsu:2": [
    ["In 나는 그가 성공하기를 바란다, the clause 그가 성공하기 acts as…", ["a noun", "a description", "a quote", "an adverb"], 0, "-기 makes a noun clause (명사절)."]
  ],

  /* 동대문 */
  "dongdaemun:0": [
    ["Which ending is formal (하십시오체)?", ["고마워", "고마워요", "감사합니다", "고맙다"], 2, "-(스)ㅂ니다 is the formal polite ending."]
  ],
  "dongdaemun:1": [
    ["Which sentence is correct?", ["할머니께서 자요.", "할머니께서 주무세요.", "할머니가 자세요.", "할머니께 주무세요."], 1, "자다 → 주무시다, and 께서 for the respected subject."],
    ["\"Do you have time?\" to a teacher is…", ["시간이 계세요?", "시간이 있으세요?", "시간께서 있어요?", "시간이 있어요?"], 1, "Possession uses 있으시다, not 계시다."]
  ],
  "dongdaemun:2": [
    ["\"I gave my grandmother a present\" is…", ["할머니께 선물을 줬어요.", "할머니께 선물을 드렸어요.", "할머니께서 선물을 드렸어요.", "할머니한테 선물을 주셨어요."], 1, "주다 → 드리다 when the recipient is respected."],
    ["\"Nice to meet you\" (very formal) is…", ["처음 봅니다", "처음 뵙겠습니다", "처음 만나세요", "처음 보세요"], 1, "보다 → 뵙다."]
  ],
  "dongdaemun:3": [
    ["Which is the honorific word for 이름?", ["연세", "성함", "댁", "진지"], 1, "성함 = name (honorific)."],
    ["Why is 커피 나오셨습니다 wrong?", ["The coffee isn't the one being respected", "나오다 can't take -시-", "It should be 나와요", "It isn't wrong"], 0, "Honorifics are for people, not things."]
  ],

  /* 대학로 */
  "daehakro:0": [
    ["Which sentence is passive?", ["문을 열었어요.", "문이 열렸어요.", "문을 열게 했어요.", "문을 열어 줬어요."], 1, "열리다 is the passive of 열다."],
    ["The passive of 보다 is…", ["보이다", "보히다", "보리다", "보기다"], 0, "보다 → 보이다."]
  ],
  "daehakro:1": [
    ["\"I fed the child\" is…", ["아이가 밥을 먹었어요.", "아이에게 밥을 먹였어요.", "아이에게 밥을 먹혔어요.", "아이가 밥을 먹게 됐어요."], 1, "먹이다 is the causative of 먹다."],
    ["Which one is causative?", ["열리다", "웃기다", "안기다", "보이다"], 1, "웃기다 = make someone laugh. The others here are passive."]
  ],
  "daehakro:2": [
    ["She asked when I'm going: 언제 ___ 물었어요.", ["간다고", "가냐고", "가라고", "가자고"], 1, "Reported questions: -냐고."],
    ["He suggested going together: 같이 ___ 했어요.", ["가자고", "가라고", "간다고", "가냐고"], 0, "Reported suggestions: -자고."]
  ],
  "daehakro:3": [
    ["\"The door is open\" (result) is…", ["문이 열고 있어요.", "문이 열려 있어요.", "문을 열고 있어요.", "문이 열었어요."], 1, "-아/어 있다 describes a resulting state."]
  ],

  /* 종로 */
  "jongno:0": [
    ["How many morphemes are in 하늘이 맑다?", ["2", "3", "4", "5"], 2, "하늘 / 이 / 맑- / -다."],
    ["Which is a bound, grammatical morpheme?", ["하늘", "맑-", "-다", "책"], 2, "Endings are bound (의존) and grammatical (형식)."]
  ],
  "jongno:1": [
    ["In 새 책, 새 is a…", ["형용사", "관형사", "부사", "명사"], 1, "관형사 describes a noun and never conjugates."],
    ["How many parts of speech does school grammar list?", ["7", "8", "9", "10"], 2, "9품사."]
  ],
  "jongno:2": [
    ["Which word is a 파생어 (derived word)?", ["손목", "밤낮", "풋사과", "눈물"], 2, "풋- is a prefix."],
    ["지우개 is made of…", ["two nouns", "a stem + suffix", "a prefix + noun", "a loanword"], 1, "지우- + -개 (a tool for …)."]
  ],
  "jongno:3": [
    ["Which word does NOT contain 學 (학)?", ["학교", "학생", "과학", "한국"], 3, "한국 = 韓國."],
    ["집, 가옥, 하우스 are…", ["three dialects", "native, Sino-Korean, loanword", "three politeness levels", "three spellings of one word"], 1, "Three vocabulary layers for a similar meaning."]
  ],

  /* 인사동 */
  "insadong:0": [
    ["Which spacing is correct?", ["먹을수있다", "먹을 수 있다", "먹을수 있다", "먹을 수있다"], 1, "수 is a bound noun: space it."],
    ["Which is correct?", ["친구 도 왔다", "친구도 왔다", "친구도왔다", "친 구도 왔다"], 1, "Particles attach to the word before them."]
  ],
  "insadong:1": [
    ["Which is spelled correctly?", ["최대값", "최댓값", "최댄값", "최대갑"], 1, "최대 + 값 with tensing: 최댓값."],
    ["Which Sino-Korean compound takes 사이시옷?", ["대가", "숫자", "초점", "개수"], 1, "숫자 is one of the six exceptions."]
  ],
  "insadong:2": [
    ["Which is correct?", ["안 되요", "안 돼요", "않 돼요", "않 되요"], 1, "돼요 = 되어요. 안 = 아니."],
    ["\"As a student\" is…", ["학생으로써", "학생으로서", "학생에서", "학생으로"], 1, "-로서 = in the capacity of."],
    ["\"Solve it through dialogue\" is…", ["대화로서 해결하다", "대화로써 해결하다", "대화에서 해결하다", "대화로서는 해결하다"], 1, "-로써 = by means of."]
  ],
  "insadong:3": [{ drill: "pron", words: ["읽다", "넓다", "닭", "앉다", "없다", "밟다", "솜이불", "값이"] }],

  /* 북촌 */
  "bukchon:0": [
    ["Who broke the vase? Which answer means \"It was me\"?", ["저는 했어요.", "제가 했어요.", "저도 했어요.", "저를 했어요."], 1, "이/가 can single out one person (exhaustive focus)."],
    ["커피는 마시는데 차는 안 마셔요. 은/는 here shows…", ["the subject", "contrast", "the object", "politeness"], 1, "Two topics are contrasted."]
  ],
  "bukchon:1": [
    ["You just noticed it's snowing. You say…", ["눈이 오잖아요!", "눈이 오네요!", "눈이 오거든요!", "눈이 올게요!"], 1, "-네요: noticing now."],
    ["\"I told you!\" (you already know) is…", ["제가 말했잖아요.", "제가 말했네요.", "제가 말했군요.", "제가 말할게요."], 0, "-잖아요 appeals to shared knowledge."],
    ["Explaining why you were late: \"I was a bit sick\" is…", ["좀 아팠잖아요.", "좀 아팠거든요.", "좀 아팠네요.", "좀 아플게요."], 1, "-거든요 gives background the listener lacks."]
  ],
  "bukchon:2": [
    ["Which word points to something near the listener or just mentioned?", ["이", "그", "저", "어느"], 1, "그 = near you, or already mentioned."]
  ],
  "bukchon:3": [
    ["The softest way to say \"That's difficult\" is…", ["그건 어려워요.", "그건 안 돼요.", "그건 좀 어려울 것 같은데요.", "어려워."], 2, "Hedges like 좀, -것 같다, -는데요 soften a refusal."]
  ],

  /* 경복궁 */
  "gyeongbokgung:0": [
    ["When was Hangul proclaimed?", ["1392", "1443", "1446", "1910"], 2, "Created in 1443, proclaimed in 1446."],
    ["How many letters did the original alphabet have?", ["24", "26", "28", "40"], 2, "28: 17 consonants, 11 vowels."],
    ["Which letter is no longer used?", ["ㅎ", "ㆍ", "ㅇ", "ㅅ"], 1, "ㆍ (아래아) disappeared, along with ㅿ ㆆ ㆁ."]
  ],
  "gyeongbokgung:1": [
    ["What did 방점 (side dots) mark?", ["vowel length", "pitch", "stress", "sentence end"], 1, "None for low, one for high, two for rising."],
    ["이어적기 means…", ["writing a final on the next syllable, as pronounced", "writing each morpheme separately", "writing vertically", "leaving out vowels"], 0, "Middle Korean spelled as it sounded across boundaries."]
  ],
  "gyeongbokgung:2": [
    ["The 한글 맞춤법 통일안 was published in…", ["1446", "1894", "1933", "1988"], 2, "By the 조선어 학회, in 1933."],
    ["The current 한글 맞춤법 dates from…", ["1933", "1948", "1988", "2017"], 2, "1988."]
  ],

  /* 인왕산 */
  "inwangsan:0": [
    ["Which style fits a notice board?", ["오늘 회의가 없어요.", "오늘 회의 없음.", "오늘 회의 없어.", "오늘 회의 없잖아."], 1, "Notices use nominal endings like -음."]
  ],
  "inwangsan:1": [
    ["호수같이 맑은 눈 is a…", ["metaphor (은유)", "simile (직유)", "personification (의인)", "symbol (상징)"], 1, "같이 makes the comparison explicit."],
    ["내 마음은 호수요 is a…", ["simile", "metaphor", "personification", "rhyme"], 1, "A는 B이다, with no comparison word."]
  ],
  "inwangsan:2": [
    ["A 시조 has how many lines (장)?", ["2", "3", "4", "8"], 1, "초장, 중장, 종장."]
  ],
  "inwangsan:3": [
    ["발이 넓다 means…", ["to have big feet", "to know many people", "to walk a lot", "to be generous"], 1, "Wide feet: you get around."],
    ["미역국을 먹다 (idiom) means…", ["to celebrate a birthday", "to fail an exam", "to be pregnant", "to eat well"], 1, "Seaweed is slippery: you slipped."],
    ["눈이 높다 means…", ["to be tall", "to have high standards", "to be arrogant", "to see far"], 1, "Your eyes look high up."]
  ]
};

/* ───────── Placement test ─────────
   Five questions per level, sampled from that level's units.
   Get four right to move up; the first level you miss is where you start. */
const PLACEMENT = {
  A0: [
    ["How is 국물 pronounced?", ["[국물]", "[궁물]", "[굼물]", "[국믈]"], 1],
    ["How is 좋아요 pronounced?", ["[조하요]", "[조아요]", "[졷아요]", "[조타요]"], 1],
    ["How is 같이 pronounced?", ["[가티]", "[갇이]", "[가치]", "[가시]"], 2],
    ["Which word starts with an aspirated consonant (a strong puff of air)?", ["달", "딸", "탈", "날"], 2],
    ["How is 신라 pronounced?", ["[신나]", "[실라]", "[신라]", "[실나]"], 1]
  ],
  A1: [
    ["Choose the correct sentence: \u201cI drink coffee.\u201d", ["저는 커피를 마셔요.", "저는 커피가 마셔요.", "저를 커피를 마셔요.", "저는 커피에 마셔요."], 0],
    ["저는 학생___.", ["이에요", "예요", "이예요", "에요"], 0],
    ["어제 친구를 ___.", ["만나요", "만났어요", "만날 거예요", "만나세요"], 1],
    ["\u201cI can't swim\u201d is…", ["수영을 안 해요.", "수영을 못 해요.", "수영하지 마요.", "수영이 없어요."], 1],
    ["가방이 의자 위___ 있어요.", ["에", "에서", "를", "로"], 0]
  ],
  A2: [
    ["도서관___ 공부해요.", ["에", "에서", "으로", "에게"], 1],
    ["\u201cTwo cups of coffee, please\u201d: 커피 ___ 주세요.", ["두 잔", "이 잔", "둘 잔", "두 명"], 0],
    ["주말에 영화를 ___ 거예요.", ["보는", "봤", "볼", "본"], 2],
    ["한국어를 배우___ 학원에 다녀요. (in order to)", ["려고", "고 싶어", "면", "지만"], 0],
    ["How do you read 3:30?", ["세 시 삼십 분", "삼 시 삼십 분", "세 시 서른 분", "삼 시 서른 분"], 0]
  ],
  B1: [
    ["듣다 → 해요체", ["듣어요", "들어요", "들러요", "드어요"], 1],
    ["날씨가 ___ 창문을 열었어요.", ["더워서", "덥어서", "더웠어서", "덥으니까"], 0],
    ["할머니께서 지금 ___.", ["자요", "주무세요", "잡니다", "자세요"], 1],
    ["What does 어제 본 영화 mean?", ["the movie I'll see tomorrow", "the movie I saw yesterday", "the movie I'm watching", "I watched a movie yesterday"], 1],
    ["선생님께 선물을 ___.", ["줬어요", "주셨어요", "드렸어요", "드셨어요"], 2]
  ],
  B2: [
    ["Which sentence uses a passive verb?", ["문을 열었어요.", "문이 열렸어요.", "문을 열게 했어요.", "문을 열어 줬어요."], 1],
    ["친구가 내일 ___ 했어요. (She said she'd come.)", ["온다고", "오냐고", "오라고", "오자고"], 0],
    ["아이에게 밥을 ___.", ["먹었어요", "먹혔어요", "먹였어요", "먹어졌어요"], 2],
    ["The door is open (it was opened and stays open): 문이 ___ 있어요.", ["열고", "열려", "열어서", "열리고"], 1],
    ["What does 비가 오나 봐요 express?", ["I hope it rains", "It will definitely rain", "It seems to be raining", "I saw the rain coming"], 2]
  ],
  C1: [
    ["Which spacing is correct?", ["먹을수있다", "먹을 수 있다", "먹을수 있다", "먹을 수있다"], 1],
    ["Which spelling is correct?", ["안 되요", "안 돼요", "않 돼요", "않 되요"], 1],
    ["\u201cI told you already!\u201d (you should know): 제가 말했___.", ["잖아요", "네요", "군요", "을게요"], 0],
    ["What does 납득하다 mean?", ["to insist strongly", "to persuade others", "to understand and accept", "to argue against"], 2],
    ["상대방의 입장을 고려하지 않는 발언은 오히려 갈등을 ___ 수 있다.", ["야기할", "회피할", "완화할", "강조할"], 0]
  ],
  C2: [
    ["Which sentence is the most natural?", ["그는 밥을 먹기는커녕 두 그릇이나 비웠어요.", "그는 졸업하다시피 공부를 시작했다.", "좀 더 일찍 도착했더라면 비행기를 놓쳤을 거예요.", "그렇게 눈치 보면서 일하느니 차라리 다른 직장을 구하는 게 낫겠어요."], 3],
    ["Which sentence fits a formal report?", ["조사 결과 만족도가 높게 나타났다.", "조사해 보니까 다들 좋대요.", "결과 진짜 좋았어.", "만족도가 꽤 높더라고요."], 0],
    ["십중팔구 means…", ["half and half", "almost certainly", "ten times over", "rarely"], 1],
    ["열 길 물속은 알아도 한 길 사람 속은 모른다 means…", ["Water is deeper than it looks.", "It's hard to truly know what someone is thinking.", "Don't swim in deep water.", "People change over time."], 1],
    ["사람은 누구나 실수하기 마련이다 means…", ["Everyone tries hard not to make mistakes.", "Everyone is bound to make mistakes.", "Nobody ever makes mistakes.", "Mistakes are easy to fix."], 1]
  ]
};

/* ───────── Proverb of the day ─────────
   Commonly used proverbs (속담) and four-character idioms (사자성어).
   [korean, english, hanja (사자성어 only)]                          */
const PROVERBS = [
  ["가는 말이 고와야 오는 말이 곱다", "Speak kindly and you'll be spoken to kindly."],
  ["일석이조", "Two birds with one stone.", "一石二鳥"],
  ["낮말은 새가 듣고 밤말은 쥐가 듣는다", "Birds hear what's said by day, mice hear what's said at night. Walls have ears."],
  ["작심삼일", "A resolution that lasts three days.", "作心三日"],
  ["호랑이도 제 말 하면 온다", "Talk about the tiger and the tiger appears. Speak of the devil."],
  ["고진감래", "When the bitter ends, the sweet comes. Hardship is followed by joy.", "苦盡甘來"],
  ["소 잃고 외양간 고친다", "Fixing the barn after the cow is gone. Too little, too late."],
  ["동문서답", "Asked about the east, answering about the west. An answer that misses the question.", "東問西答"],
  ["티끌 모아 태산", "Gather dust and you get a mountain. Small things add up."],
  ["전화위복", "Turning misfortune into fortune. A blessing in disguise.", "轉禍爲福"],
  ["세 살 버릇 여든까지 간다", "Habits formed at three last until eighty."],
  ["과유불급", "Too much is as bad as too little.", "過猶不及"],
  ["시작이 반이다", "Starting is half the work."],
  ["유유상종", "Like keeps company with like. Birds of a feather flock together.", "類類相從"],
  ["고래 싸움에 새우 등 터진다", "When whales fight, the shrimp's back breaks. The small get hurt in the fights of the big."],
  ["대기만성", "Great vessels take long to make. A late bloomer.", "大器晩成"],
  ["누워서 떡 먹기", "Eating rice cake lying down. A piece of cake."],
  ["우왕좌왕", "Going right, then left. Running around in confusion.", "右往左往"],
  ["그림의 떡", "A rice cake in a painting. Something you can see but never have."],
  ["이심전심", "From heart to heart. Understanding each other without words.", "以心傳心"],
  ["금강산도 식후경", "Even Mount Geumgang is best seen after a meal. Food first."],
  ["십중팔구", "Eight or nine out of ten. Almost certainly.", "十中八九"],
  ["발 없는 말이 천 리 간다", "Words without feet travel a thousand li. Rumors spread fast."],
  ["청출어람", "Blue comes from indigo but is bluer. The student surpasses the teacher.", "靑出於藍"],
  ["사공이 많으면 배가 산으로 간다", "Too many boatmen and the boat ends up on a mountain. Too many cooks spoil the broth."],
  ["자업자득", "You reap what you sow.", "自業自得"],
  ["등잔 밑이 어둡다", "It's darkest right under the lamp. What's closest is easiest to miss."],
  ["금상첨화", "Adding flowers to silk. Something good made even better.", "錦上添花"],
  ["원숭이도 나무에서 떨어진다", "Even monkeys fall from trees. Experts make mistakes too."],
  ["동고동락", "Sharing hardship and joy together.", "同苦同樂"],
  ["우물 안 개구리", "A frog in a well. Someone who doesn't know the wider world."],
  ["천 리 길도 한 걸음부터", "A journey of a thousand li begins with one step."],
  ["빈 수레가 요란하다", "Empty carts rattle loudest. Those who know least talk most."],
  ["백지장도 맞들면 낫다", "Even a sheet of paper is lighter with two people lifting it."],
  ["개구리 올챙이 적 생각 못 한다", "A frog forgets it was ever a tadpole. Success makes people forget where they started."],
  ["웃는 얼굴에 침 못 뱉는다", "You can't spit at a smiling face. Kindness disarms anger."],
  ["사촌이 땅을 사면 배가 아프다", "When your cousin buys land, your stomach aches. Envy of others' success."],
  ["될성부른 나무는 떡잎부터 알아본다", "A tree that will grow well shows it from its first leaves."],
  ["구슬이 서 말이라도 꿰어야 보배다", "Even a heap of beads is only a treasure once it's strung. Talent counts when you use it."],
  ["하룻강아지 범 무서운 줄 모른다", "A day-old puppy doesn't know to fear the tiger. Ignorance makes you bold."]
];

/* ───────── One question per key idea: top-ups for the original lessons ───────── */
const PRACTICE_MORE = {
  "gwanghwamun:0": [["ㅁ is modeled on…", ["the tongue", "the mouth", "a tooth", "the throat"], 1, "ㅁ pictures the shape of the mouth."]],
  "gwanghwamun:2": [["ㅗ + ㅏ makes…", ["ㅘ", "ㅝ", "ㅙ", "ㅚ"], 0, "ㅗ + ㅏ = ㅘ."]],
  "seochon:0": [["ㅚ and ㅟ may also be pronounced…", ["as diphthongs", "silently", "like ㅐ", "like ㅡ"], 0, "The standard allows them as diphthongs."]],
  "seochon:1": [["Which vowel starts with a w-glide?", ["ㅑ", "ㅕ", "ㅘ", "ㅠ"], 2, "ㅘ = w + ㅏ."]],
  "seochon:3": [["In Seoul speech today, what else helps tell 달 from 탈?", ["vowel length", "pitch: 탈 starts higher", "stress on the second syllable", "nothing"], 1, "Aspirated and tense consonants start on a higher pitch."]],
  "sinchon:0": [["Why can Korean word order move around?", ["Verbs can go anywhere", "Particles mark each word's role", "Korean has no subjects", "It can't"], 1, "Particles carry the roles; only the verb has to stay last."]],
  "sinchon:3": [["\"I don't have money\" is…", ["돈이 없어요.", "돈을 없어요.", "돈이 안 있어요.", "돈이 아니에요."], 0, "없어요 is the opposite of 있어요."]],
  "yeouido:0": [["Which of these can stand alone as a word?", ["-어요", "-었-", "먹-", "None of them"], 3, "Stems and endings always need each other."]],
  "yeouido:3": [["The long negative form of 먹어요 is…", ["먹지 않아요", "안 먹지 않아요", "먹지 안아요", "먹않아요"], 0, "Stem + -지 않다."]],
  "noryangjin:2": [["\"I got a present from my friend\": 친구___ 선물을 받았어요.", ["에게", "한테서", "께", "에"], 1, "From a person: 에게서 / 한테서."]],
  "banpo:0": [["\"I want to eat tteokbokki\" is…", ["떡볶이를 먹고 싶어요.", "떡볶이를 먹어 싶어요.", "떡볶이를 먹을 싶어요.", "떡볶이를 먹기 싶어요."], 0, "Stem + -고 싶어요."],
              ["\"I wanted to go\" is…", ["가고 싶어요", "가고 싶었어요", "갔고 싶어요", "가고 싶을 거예요"], 1, "The past goes on 싶다."]],
  "banpo:1": [["\"I'll meet a friend on Saturday\": 토요일에 친구를 ___.", ["만날 거예요", "만나 거예요", "만났을 거예요", "만날을 거예요"], 0, "Vowel stem: -ㄹ 거예요."]],
  "banpo:2": [["\"I'm planning to get up early tomorrow\" is…", ["내일 일찍 일어나려고 해요.", "내일 일찍 일어나려고 있어요.", "내일 일찍 일어나고 싶어해요.", "내일 일찍 일어나서 해요."], 0, "-(으)려고 하다 states a plan."],
              ["Which sentence is natural?", ["저는 공부하려고 동생이 도서관에 가요.", "저는 책을 사려고 서점에 갔어요.", "비가 오려고 우산을 샀어요.", "저는 먹으려고 친구가 요리해요."], 1, "Both parts of a -(으)려고 sentence share one subject."]],
  "banpo:3": [["\"Korean is easy to read\": 한국어는 ___ 쉬워요.", ["읽기가", "읽는 것을", "읽을", "읽어서"], 0, "-기 often comes before 쉽다, 어렵다, 좋다."]],
  "gangnam:3": [["The softest way to ask \"Could you wrap it?\" is…", ["포장해요.", "포장해 주세요.", "포장해 주시겠어요?", "포장하세요."], 2, "-아/어 주시겠어요? is softer than -아/어 주세요."]],
  "seongsu:0": [["\"If you have time, let's go together\" is…", ["시간이 있으면 같이 가요.", "시간이 있어서 같이 가요.", "시간이 있지만 같이 가요.", "시간이 있고 같이 가요."], 0, "-(으)면 = if."]],
  "seongsu:2": [["In 내가 만든 케이크, 내가 만든 works as…", ["a noun", "a description of the noun", "a quote", "an adverb"], 1, "A 관형절 describes the noun after it."],
                ["In 친구가 바쁘다고 했다, 바쁘다고 is…", ["a noun clause", "a description", "a quoted clause", "a condition"], 2, "-다고 marks an indirect quote (인용절)."]],
  "dongdaemun:0": [["Which is the plain written style (해라체)?", ["먹어요", "먹는다", "먹습니다", "먹어"], 1, "해라체: 먹는다, 했다."],
                   ["Where do you still see 하오체 today?", ["In text messages", "On signs like 출입을 삼가시오", "In children's books", "Nowhere"], 1, "Notices and historical dramas keep it."]],
  "dongdaemun:1": [["The honorific of 먹다 is…", ["드시다", "드리다", "먹으세다", "먹드리다"], 0, "먹다 → 드시다 / 잡수시다."]],
  "dongdaemun:2": [["Which verb honors the person you do it for?", ["주다", "드리다", "하다", "가다"], 1, "드리다, 여쭙다, 모시다, 뵙다."]],
  "dongdaemun:3": [["\"Where do you live?\" to an elder is…", ["집이 어디예요?", "댁이 어디세요?", "댁이 어디야?", "집이 어디세요?"], 1, "집 → 댁, with an honorific ending."]],
  "daehakro:0": [["The passive of 결정하다 is…", ["결정되다", "결정히다", "결정받다", "결정시키다"], 0, "하다 nouns take -되다."]],
  "daehakro:1": [["\"I made him go\" with -게 하다 is…", ["가게 했어요", "가게 됐어요", "가도록 됐어요", "가 하게 했어요"], 0, "-게 하다 makes any verb causative."]],
  "daehakro:2": [["\"He said 'let's go'\" as a direct quote is…", ["\"가자\"라고 했어요.", "\"가자\"고 했어요.", "가자라고 했어요.", "\"가자\"를 했어요."], 0, "Direct quotes take \"…\"라고."]],
  "daehakro:3": [["\"I'm wearing a coat\" is…", ["코트를 입고 있어요.", "코트를 입어 있어요.", "코트가 입혀 있어요.", "코트를 입었었어요."], 0, "With 입다, -고 있다 also describes the worn state."],
                 ["예전에 서울에 살았었어요 suggests…", ["I still live there", "I lived there, but no longer", "I'll live there", "I live there now"], 1, "-았었- marks a past that no longer holds."]],
  "jongno:0": [["Which is a free (자립) morpheme?", ["-었-", "이 (particle)", "하늘", "-다"], 2, "하늘 stands alone."]],
  "jongno:1": [["Which group are 체언?", ["명사, 대명사, 수사", "동사, 형용사", "관형사, 부사", "조사"], 0, "Nouns, pronouns, numerals."]],
  "jongno:2": [["Which word is a compound (합성어)?", ["풋사과", "먹이", "손목", "지우개"], 2, "손 + 목: two roots."]],
  "jongno:3": [["Which vocabulary dominates news writing?", ["Native Korean", "Sino-Korean", "English loanwords", "Dialect"], 1, "News leans on 한자어."]],
  "insadong:0": [["Which is spaced correctly?", ["사과 두개", "사과 두 개", "사과두 개", "사과 두개요"], 1, "Units are spaced: 두 개."]],
  "insadong:1": [["Which word has a 사이시옷?", ["나뭇잎", "나무잎", "나뭇입", "나무닢"], 0, "나무 + 잎 → 나뭇잎 [나문닙]."]],
  "bukchon:0": [["Answers to 누가-questions take…", ["은/는", "이/가", "을/를", "도"], 1, "Question words and their answers take 이/가."]],
  "bukchon:2": [["Which is most natural between friends?", ["너는 밥 먹었어? 응, 나는 밥 먹었어.", "밥 먹었어? 응, 먹었어.", "너는 밥을 먹었어? 응, 나는 먹었어.", "밥? 먹었어 밥."], 1, "Korean drops what context supplies."],
                ["Pointing at a building far from both of you:", ["이 건물", "그 건물", "저 건물", "어느 건물"], 2, "저 = over there."]],
  "bukchon:3": [["The politest way to ask a stranger for help is…", ["이거 해 줘.", "이거 해 주세요.", "혹시 이거 좀 해 주실 수 있을까요?", "이거 해."], 2, "Indirect forms soften a request."],
                ["Disagreeing politely, you might start with…", ["아니에요, 틀렸어요.", "그 말씀도 맞지만…", "그건 아니죠.", "말도 안 돼요."], 1, "Acknowledge first, then add your point."]],
  "gyeongbokgung:1": [["Which vowel did Middle Korean have that's gone today?", ["ㅡ", "ㆍ (아래아)", "ㅣ", "ㅗ"], 1, "아래아 was a real vowel."]],
  "gyeongbokgung:2": [["ㆍ was officially dropped from spelling in…", ["1446", "1894", "1933", "1988"], 2, "The 1933 통일안."]],
  "inwangsan:0": [["Which suits a narrative written in -다 style?", ["그는 아무 말도 하지 않았다.", "그는 아무 말도 안 했어요.", "그는 아무 말도 안 했어.", "그는 아무 말도 안 했습니다요."], 0, "Narrative writing uses 해라체."],
                  ["밥 먹었어 in a formal written register is…", ["밥 먹었습니다", "식사를 마쳤다", "밥을 먹었다요", "식사했어"], 1, "Written register prefers Sino-Korean and -다."]],
  "inwangsan:1": [["바람이 속삭인다 is…", ["a simile", "a metaphor", "personification", "a proverb"], 2, "Human actions for things: 의인."]],
  "inwangsan:2": [["음보 means…", ["a rhyme", "a rhythmic group of syllables", "a stanza", "a pitch accent"], 1, "Korean verse groups syllables into 음보."],
                  ["김소월 is known for which rhythm?", ["3·4", "4·4", "7·5", "none"], 2, "Many of his poems use 7·5."]]
};
Object.entries(PRACTICE_MORE).forEach(([k, qs]) => { PRACTICE[k] = (PRACTICE[k] || []).concat(qs); });
