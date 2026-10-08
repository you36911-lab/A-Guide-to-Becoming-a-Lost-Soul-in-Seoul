/* =========================================================
   Review edits, applied on top of curriculum.js + curriculum-more.js
   1) Sooya's review of Gwanghwamun and Seochon (Oct 2026)
   2) No Korean terminology: Korean grammar *names* are removed or put
      into English; Korean *forms* learners must learn (은/는, -아요) stay.
   Lessons are matched by unit id and their title before this file runs.
   Fields given here replace the lesson's fields; q replaces its practice.
   ========================================================= */

const LESSON_EDITS = {
  gwanghwamun: {
    "Five shapes of the mouth": {
      k: "ㄱ ㄴ ㅁ ㅅ ㅇ",
      p: ["ㄱ: the back of the tongue lifting to block the throat.",
          "ㄴ: the tongue tip touching the ridge behind the upper teeth.",
          "ㅁ: the shape of the mouth.",
          "ㅅ: a tooth.",
          "ㅇ: the round throat."],
      q: [["Which letter shows the back of the tongue lifting to block the throat?", ["ㄱ", "ㄴ", "ㅁ", "ㅅ"], 0, "ㄱ pictures the back of the tongue rising."],
          ["Which letter shows the tongue tip touching the ridge behind the teeth?", ["ㄱ", "ㄴ", "ㅁ", "ㅇ"], 1, "ㄴ pictures the tongue tip raised to the upper gum."],
          ["ㅁ is based on the shape of…", ["the tongue", "the mouth", "a tooth", "the throat"], 1, "ㅁ pictures the shape of the mouth."],
          ["Which basic letter is based on the shape of a tooth?", ["ㅅ", "ㅁ", "ㅇ", "ㄱ"], 0, "ㅅ is the shape of a tooth; it's a sound made with the teeth."],
          ["ㅇ is based on the shape of…", ["the lips", "the round throat", "a tooth", "the nose"], 1, "ㅇ pictures the round throat."]]
    },
    "One more stroke, one more breath": {
      t: "Adding Strokes to Create New Consonants", k: "",
      s: "Adding a stroke creates a related consonant with a stronger, more aspirated sound. This is the principle of adding strokes. Learn the pattern, and you can predict how other consonants are formed.",
      p: ["ㄴ → ㄷ → ㅌ, ㅁ → ㅂ → ㅍ, ㅅ → ㅈ → ㅊ, ㅇ → ㅎ.",
          "Doubling a letter makes it tense: ㄲ ㄸ ㅃ ㅆ ㅉ.",
          "ㄹ is the odd one out: it doesn't follow the stroke rule."],
      q: [["Add a stroke to ㄷ. Which letter do you get?", ["ㄸ", "ㅌ", "ㄹ", "ㅍ"], 1, "ㄴ → ㄷ → ㅌ: each stroke adds breath."],
          ["Doubling ㅂ gives…", ["ㅍ", "ㅃ", "ㅁ", "ㅄ"], 1, "Doubled letters are tense: ㅃ."],
          ["Which consonant does NOT follow the stroke-adding rule?", ["ㅋ", "ㅊ", "ㄹ", "ㅍ"], 2, "ㄹ is a letter shaped differently from its group."]]
    },
    "Heaven, earth, human": {
      t: "The Principle of Vowel Formation", k: "Heaven, earth, human",
      p: ["ㆍ, ㅡ, and ㅣ combine in specific ways to form all Korean vowels.",
          "Vowels are grouped into bright and dark vowels. Bright vowels ㅏ ㅗ point outward or up; dark vowels ㅓ ㅜ point inward or down.",
          "When vowels combine, they follow this bright/dark pattern. For example, ㅗ + ㅏ → ㅘ, while ㅜ + ㅏ does not form a vowel.",
          "This vowel harmony also appears in Korean grammar, such as the verb endings -아요 / -어요."],
      ex: ["ㅣ + ㆍ → ㅏ", "ㆍ + ㅡ → ㅗ", "ㅗ + ㅏ → ㅘ", "ㅜ + ㅣ → ㅟ"],
      q: [["The three symbols behind all vowels stand for…", ["sun, moon, star", "heaven, earth, human", "fire, water, wood", "mouth, tongue, teeth"], 1, "ㆍ heaven, ㅡ earth, ㅣ human."],
          ["Which of these is a bright vowel?", ["ㅓ", "ㅜ", "ㅗ", "ㅡ"], 2, "ㅏ and ㅗ are bright; ㅓ and ㅜ are dark."],
          ["ㅜ + ㅓ makes…", ["ㅘ", "ㅝ", "ㅙ", "ㅚ"], 1, "ㅜ + ㅓ = ㅝ. Dark goes with dark."],
          ["살다 has the bright vowel ㅏ. Which ending fits?", ["살아요", "살어요", "살요", "살이요"], 0, "A bright vowel takes -아요."]]
    },
    "Building a syllable block": {
      k: "",
      s: "Letters stack into syllable blocks: first consonant, vowel, and an optional final consonant.",
      p: ["Vertical vowels (ㅏ ㅓ ㅣ) go to the right; horizontal vowels (ㅗ ㅜ ㅡ) go below.",
          "Every syllable block starts with a consonant. ㅇ is the silent placeholder.",
          "The final consonant goes at the bottom. A syllable does not always have a final consonant."],
      q: [["Which vowel is written to the RIGHT of the consonant?", ["ㅗ", "ㅜ", "ㅡ", "ㅓ"], 3, "Vertical vowels (ㅏ ㅓ ㅣ) go right; horizontal ones (ㅗ ㅜ ㅡ) go below."],
          ["What does ㅇ do at the start of 아?", ["It sounds like ng", "Nothing", "It makes the vowel long", "It sounds like h"], 1, "A block must start with a consonant, so ㅇ acts as a silent placeholder."],
          ["ㅂ + ㅗ + ㅁ makes…", ["봄", "밤", "붐", "범"], 0, "ㅗ is horizontal, so ㅂ sits on top and ㅁ at the bottom: 봄."]]
    },
    "Write your name in Hangul": {
      k: "",
      s: "Turn the sounds of your name into syllable blocks, write them by hand, then type them. There may be more than one correct way to write a name in Hangul.",
      p: ["Break your name into sounds, not individual letters.",
          "Group the sounds into syllable blocks: consonant + vowel (+ final consonant).",
          "Write it by hand first, stroke by stroke, then type it."]
    }
  },

  seochon: {
    "The ten pure vowels": {
      t: "The ten simple vowels", k: "Monophthongs",
      s: "Standard Korean lists ten simple vowels.",
      p: ["Standard Korean has ten simple vowels: ㅏ ㅐ ㅓ ㅔ ㅗ ㅚ ㅜ ㅟ ㅡ ㅣ.",
          "ㅚ and ㅟ are traditionally classified as simple vowels, but in modern Korean, they are often pronounced with a glide: ㅚ as [we] and ㅟ as [ɥi].",
          "Many speakers no longer distinguish between ㅐ and ㅔ, so 개 and 게 can sound the same."],
      q: [["How many simple vowels does the standard pronunciation list?", ["7", "8", "10", "21"], 2, "The standard lists ten: ㅏ ㅐ ㅓ ㅔ ㅗ ㅚ ㅜ ㅟ ㅡ ㅣ."],
          ["ㅚ and ㅟ are often pronounced…", ["with a glide", "silently", "like ㅐ", "like ㅢ"], 0, "In modern Korean they are usually said with a glide."],
          ["In everyday Seoul speech, 새 (bird) and 세 (three) sound…", ["clearly different", "the same", "different only in length", "different only in pitch"], 1, "Most speakers have merged ㅐ and ㅔ. Context tells them apart."]]
    },
    "Gliding vowels": {
      t: "Compound vowels", k: "Diphthongs",
      s: "Compound vowels combine a y- or w-glide with a vowel. ㅢ has its own pronunciation rules.",
      p: ["y-glide: ㅑ ㅕ ㅛ ㅠ ㅒ ㅖ. w-glide: ㅘ ㅝ ㅙ ㅞ.",
          "When ㅢ appears after an initial consonant, it is pronounced [i]: 희망 [히망].",
          "The particle 의 may be pronounced 에 [e]: 우리의 [우리의/우리에].",
          "In modern Korean, ㅙ is often pronounced very similarly to ㅚ."],
      q: [["Which vowel starts with a w-glide?", ["ㅑ", "ㅕ", "ㅘ", "ㅠ"], 2, "ㅘ = w + ㅏ."],
          ["How is 희망 pronounced?", ["[희망]", "[히망]", "[흐망]", "[회망]"], 1, "After an initial consonant, ㅢ is pronounced [i]."],
          ["The particle in 우리의 can be pronounced…", ["only [의]", "[의] or [에]", "[의] or [으]", "[이] or [으]"], 1, "The particle 의 may be pronounced [에]."],
          ["In everyday speech, ㅙ sounds very similar to…", ["ㅚ", "ㅏ", "ㅢ", "ㅜ"], 0, "ㅙ and ㅚ (and ㅞ) are usually said almost the same."]]
    },
    "Plain, tense, aspirated": {
      k: "",
      s: "Korean contrasts three kinds of consonants where English generally contrasts two. The difference is mainly in breath and tension, not voicing.",
      p: ["Plain (ㄱ ㄷ ㅂ ㅈ ㅅ): relaxed, with relatively little breath.",
          "Tense (ㄲ ㄸ ㅃ ㅉ ㅆ): tense and firm, with very little breath.",
          "Aspirated (ㅋ ㅌ ㅍ ㅊ): released with a strong burst of air. Hold a tissue in front of your mouth to feel the difference."],
      q: [["Which one has a plain first consonant?", ["뿔", "풀", "불", "쁠"], 2, "ㅂ is plain: relaxed, with little breath."],
          ["Which one is tense?", ["자다", "짜다", "차다", "사다"], 1, "ㅉ is the tense member of ㅈ ㅉ ㅊ."],
          ["Which word has an aspirated first consonant?", ["불", "뿔", "풀", "물"], 2, "ㅍ is aspirated: a strong burst of air."],
          ["What separates ㄷ, ㄸ, ㅌ?", ["Voicing, like d and t", "Breath and tension", "Tongue position", "Lip rounding"], 1, "Korean contrasts breath and tension, not voicing."]]
    },
    "Between k and g": {
      k: "Allophones of plain consonants",
      s: "A plain consonant like ㄱ is neither exactly k nor exactly g. Its pronunciation changes depending on its neighbors, but Korean speakers don't use these differences to distinguish words.",
      p: ["At the start of a word, ㄱ ㄷ ㅂ ㅈ are voiceless, with little aspiration. The first ㄱ in 고기 is close to a soft [k].",
          "Between vowels or after a voiced consonant (ㄴ ㄹ ㅁ ㅇ), they become voiced. The second ㄱ in 고기 sounds like [g]. The same happens in 바보, 두부, 아저씨.",
          "ㄹ is a quick flap [ɾ] between vowels (나라) and a clear [l] at the end of a syllable or when doubled (발, 빨래).",
          "ㅅ before ㅣ sounds close to English sh (시).",
          "In modern standard Korean, pitch also plays a role: syllables beginning with an aspirated or tense consonant tend to have higher pitch than those beginning with a plain consonant."],
      q: [["Why don't Koreans notice the k/g difference in 고기?", ["They do: the two are written differently", "Korean never uses it to tell words apart", "It only exists in dialects", "Because ㄱ is always g"], 1, "[k] and [g] are variants of one sound, so they never distinguish words."],
          ["In 바다, how does the second ㄷ sound?", ["like t with a strong burst of air", "like d", "like n", "like th"], 1, "Between vowels, plain ㄷ becomes voiced: [pada]."],
          ["How does ㄹ sound in 나라?", ["like an English l", "a quick flap, like the tt in American “better”", "like a French r", "like n"], 1, "Between vowels ㄹ is a flap [ɾ]; at the end of a syllable it's [l]."],
          ["How does ㅅ sound in 시?", ["close to English sh", "like the s in “sun”", "like t", "silent"], 0, "Before ㅣ, ㅅ moves toward sh: [ɕi]."],
          ["In modern Korean speech, what else helps tell 달 from 탈?", ["vowel length", "pitch", "stress on the second syllable", "nothing"], 1, "Pitch is an important cue in modern Korean. Vowel length can also help distinguish words, but it does not always do so."]]
    },
    "The seven final sounds": {
      k: "",
      s: "No matter which consonant is written, a syllable can end in only seven final sounds. In final position, these sounds are not fully released, meaning they end without a burst of air.",
      p: ["Different consonants can be written, but in final position, many of them merge into the same sound.",
          "Only seven sounds can occur at the end of a syllable: [ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅇ].",
          "ㄲ ㅋ → [ㄱ], ㅅ ㅆ ㅈ ㅊ ㅌ ㅎ → [ㄷ], ㅍ → [ㅂ].",
          "That's why 낫, 낮, 낯, and 낱 are all pronounced [낟]."],
      q: [{ drill: "pron", words: ["부엌", "뭍", "숲", "낯", "꽃", "밖"] },
          ["낫, 낮, 낯, 낱 all sound like…", ["[낫]", "[낟]", "[낙]", "[날]"], 1, "At the end of a syllable, ㅅ, ㅈ, ㅊ, and ㅌ are all pronounced as [ㄷ]."]]
    },
    "Where sounds are made": {
      k: "",
      s: "Every consonant has an address: where it's made, and how the air gets through.",
      p: ["Place: Korean consonants are made at different places in the vocal tract. These include the lips (ㅂ ㅃ ㅍ ㅁ), the alveolar ridge behind the upper teeth (ㄷ ㄸ ㅌ ㄴ ㄹ ㅅ ㅆ), the area just behind the alveolar ridge / hard palate (ㅈ ㅉ ㅊ), the soft palate (ㄱ ㄲ ㅋ ㅇ), and the glottis (ㅎ).",
          "Manner: Stops completely block the airflow, then release it (ㄱ ㄷ ㅂ). Affricates begin like stops, then release through a narrow opening (ㅈ ㅉ ㅊ). Fricatives let air pass through a narrow opening, creating friction (ㅅ ㅆ ㅎ). Nasals let air flow through the nose (ㄴ ㅁ ㅇ). ㄹ is a liquid consonant, made with a quick movement of the tongue.",
          "Voicing: Nasals and ㄹ are normally voiced. Other Korean consonants are generally voiceless at the beginning of a word."],
      table: { head: ["", "Lips", "(Alveolar) Ridge", "Alveolo-palatal / Hard palate", "Soft palate", "Throat"], rows: [
        ["Stops", "ㅂ ㅃ ㅍ", "ㄷ ㄸ ㅌ", "", "ㄱ ㄲ ㅋ", ""],
        ["Affricates", "", "", "ㅈ ㅉ ㅊ", "", ""],
        ["Fricatives", "", "ㅅ ㅆ", "", "", "ㅎ"],
        ["Nasals", "ㅁ", "ㄴ", "", "ㅇ", ""],
        ["Liquid", "", "ㄹ", "", "", ""]] },
      ex: [["밤 · 담 · 감", "Same vowel, different places of articulation: lips · alveolar ridge · soft palate."],
           ["사 · 자 · 차", "Same general area, different manners and consonant types."],
           ["나 · 마 · 아", "Nasal sounds at different places, followed by a vowel with no initial consonant."]],
      q: [["Which consonant is made with both lips?", ["ㄷ", "ㅁ", "ㄱ", "ㅈ"], 1, "ㅂ ㅃ ㅍ ㅁ are made with both lips."],
          ["ㅈ ㅉ ㅊ are…", ["stops", "affricates", "nasals", "liquids"], 1, "Affricates start like a stop and release through a narrow opening."],
          ["Which group is always voiced?", ["ㄱ ㄷ ㅂ", "ㅅ ㅆ ㅎ", "ㄴ ㅁ ㅇ ㄹ", "ㅋ ㅌ ㅍ"], 2, "Nasals and ㄹ are voiced."]]
    },
    "Writing by hand": {
      k: "Stroke order", figure: "stroke-order",
      s: "Now that you've met every letter, learn to write them. Hangul is written stroke by stroke in a fixed order, which keeps your letters even and easy to read.",
      p: ["Strokes generally go from top to bottom and from left to right. Horizontal strokes go from left to right; vertical strokes usually go from top to bottom.",
          "ㅇ is written in one stroke: start at the top and move counterclockwise around the circle.",
          "Inside a block, write in order: first the consonant, then the vowel, then the final consonant at the bottom.",
          "Some letters change shape when combined into a block: before ㅏ, ㄱ leans and sweeps down (가); above ㅗ, it sits flat (고).",
          "Some letters have more than one common handwritten form: ㅈ, ㅊ, ㅎ, ㄹ and ㅂ can each be written in a couple of ways, and all of them are correct."],
      q: [["Which way do strokes usually go?", ["bottom to top, right to left", "top to bottom, left to right", "in any order", "right to left only"], 1, "Top to bottom, left to right."],
          ["How do you draw ㅇ?", ["two half circles", "one stroke from the top, counterclockwise", "one stroke from the bottom, clockwise", "a square"], 1, "One stroke, starting at the top."],
          ["In which order do you write 한?", ["ㄴ, ㅏ, ㅎ", "ㅎ, ㅏ, ㄴ", "ㅏ, ㅎ, ㄴ", "ㅎ, ㄴ, ㅏ"], 1, "First consonant, vowel, then the final."],
          ["In 가, compared with 고, the ㄱ…", ["looks exactly the same", "leans and sweeps down", "is written in two strokes", "is written last"], 1, "Next to a vertical vowel, ㄱ leans."],
          ["The top of ㅎ can be written as…", ["only a short vertical tick", "only a short flat dash", "either a short tick or a short dash", "a small circle"], 2, "Both forms are common and correct."]]
    },
    "Typing Hangul": {
      k: "",
      p: ["The standard Korean layout puts consonants on the left and vowels on the right.",
          "Type syllables in sound order: ㅎ ㅏ ㄴ ㄱ ㅡ ㄹ → 한글. When a final consonant is followed by a vowel, it can become the initial consonant of the next syllable.",
          "Shift gives the tense consonants ㄲ ㄸ ㅃ ㅆ ㅉ and the vowels ㅒ ㅖ.",
          "To type Korean on your own device, add Korean (2-Set) in your keyboard settings. Then switch between Korean and English with the 한/영 key.",
          "On a standard Korean keyboard, the 한자 key is to the left of the space bar, and the 한/영 key is to its right.",
          "The ₩ key is in the position where many keyboards have the backslash key.",
          "On Windows, pressing 한자 after typing a consonant can open a list of symbols, such as ※, ★, and ○."],
      q: [["On a Korean keyboard, the consonants are under…", ["the left hand", "the right hand", "the top row only", "both hands equally"], 0, "Consonants left, vowels right."],
          ["What do you get when you type ㅎ ㅏ ㄴ ㄱ ㅜ ㄱ ㅇ ㅓ?", ["한국어", "한구거", "한궁거", "하눅어"], 0, "The keyboard assembles the blocks in sound order: 한 · 국 · 어."],
          ["How do you type ㄲ?", ["press ㄱ twice", "Shift + ㄱ", "Alt + ㄱ", "it isn't on the keyboard"], 1, "Shift gives the tense consonants."],
          ["Which keyboard should you add in your settings?", ["Korean (2-Set)", "Korean (3-Set) only", "Japanese", "Chinese"], 0, "2-Set is the standard layout."],
          ["On a Korean keyboard, what does the key right of the space bar do?", ["types ₩", "switches between Korean and English (한/영)", "opens the symbol list", "types a space"], 1, "The 한/영 key switches between Korean and English input. The 한자 key, usually next to it, is used for Hanja."],
          ["Where is the ₩ key?", ["where many keyboards have the backslash", "next to Enter, replacing Shift", "on the number 4", "it isn't on Korean keyboards"], 0, "₩ takes the backslash position."],
          ["On Windows, how can you type symbols like ※ ★ ○?", ["Type a consonant such as ㅁ, then press 한자", "Hold Shift and press space", "Press 한/영 twice", "You can't"], 0, "한자 after a consonant opens a symbol list."]]
    },
    "Read and write by ear": {
      k: "",
      s: "Read short words aloud, then write down words you hear. Start with one-syllable words like 산, 말, and 밤.",
      p: ["Read each word twice: slowly, then naturally.",
          "Cover the list and write the words from memory or from a recording.",
          "Pay close attention to final consonants. They can be easy to miss when listening."]
    }
  },

  /* term-heavy lessons, put into English */
  hongdae: {
    "Four ways sounds change": {
      k: "",
      p: ["Replacement: one sound turns into another, as in nasalization, ㄹ-assimilation, palatalization, tensing and the seven final sounds.",
          "Deletion: a sound disappears. Final ㅎ before a vowel, one consonant of a double final, ㄹ and ㅡ in verb endings.",
          "Addition: a sound appears. An extra ㄴ in 솜이불, and a glide in 되어 [되여].",
          "Contraction: two sounds become one. ㄱ + ㅎ → ㅋ in 축하, and ㅗ + ㅏ → ㅘ in 보아 → 봐."],
      ex: [["국물 [궁물]", "replacement"], ["좋아요 [조아요]", "deletion"], ["솜이불 [솜니불]", "addition"], ["축하 [추카]", "contraction"]],
      q: [["국물 → [궁물] is which kind of change?", ["replacement", "deletion", "addition", "contraction"], 0, "ㄱ is replaced by ㅇ."],
          ["좋아요 → [조아요] is…", ["replacement", "deletion", "addition", "contraction"], 1, "ㅎ disappears."],
          ["솜이불 → [솜니불] is…", ["replacement", "deletion", "addition", "contraction"], 2, "A ㄴ appears."],
          ["축하 → [추카] is…", ["replacement", "deletion", "addition", "contraction"], 3, "ㄱ and ㅎ merge into ㅋ."]]
    }
  },
  noryangjin: {
    "Parts of a sentence": {
      k: "",
      s: "Every word or phrase in a sentence has a job. Particles and endings usually tell you which job it's doing.",
      p: ["Main parts: the subject, the predicate, the object, and the complement (the noun before 되다 or 아니다: 물이 얼음이 되었다).",
          "Supporting parts: a noun modifier describes a noun (새 책, 내가 산 책); an adverbial describes a verb, an adjective or the whole sentence (빨리, 학교에서).",
          "Independent part: a word that stands apart from the rest, like 아, 네, 민수야.",
          "A sentence with one subject–predicate pair is a simple sentence; with two or more, a complex sentence. You'll build those in Seongsu."],
      table: { head: ["Part", "Example"], rows: [
        ["Subject", "민수가 책을 읽는다."], ["Predicate", "민수가 책을 읽는다."], ["Object", "민수가 책을 읽는다."],
        ["Complement", "물이 얼음이 되었다."], ["Noun modifier", "새 책을 샀다."], ["Adverbial", "빨리 읽었다."], ["Independent", "아, 비가 온다."]] },
      q: [["In 물이 얼음이 되었다, 얼음이 is…", ["the subject", "the object", "the complement", "an adverbial"], 2, "The noun before 되다 or 아니다 is the complement."],
          ["In 새 책을 샀다, 새 is…", ["a noun modifier", "an adverbial", "the subject", "an independent word"], 0, "It describes the noun 책."],
          ["In 민수야, 밥 먹었어?, 민수야 is…", ["the subject", "an independent word", "the object", "the predicate"], 1, "A call-out stands apart from the rest of the sentence."],
          ["민수가 학교에 가고 지수가 집에 왔다 is…", ["a simple sentence", "a complex sentence", "a noun clause", "a modifying clause"], 1, "Two subject–predicate pairs make a complex sentence."]]
    }
  },
  seongsu: {
    "Sentences inside sentences": {
      k: "",
      p: ["As a noun: 그가 오기를 바랐다.", "As a description: 내가 만든 케이크.", "As a quote: 친구가 바쁘다고 했다."],
      q: [["In 나는 그가 성공하기를 바란다, the clause 그가 성공하기 acts as…", ["a noun", "a description", "a quote", "an adverb"], 0, "-기 turns the clause into a noun."],
          ["In 내가 만든 케이크, 내가 만든 works as…", ["a noun", "a description of the noun", "a quote", "an adverb"], 1, "It describes the noun after it."],
          ["In 친구가 바쁘다고 했다, 바쁘다고 is…", ["a noun clause", "a description", "a quoted clause", "a condition"], 2, "-다고 marks an indirect quote."]]
    }
  },
  jongno: {
    "The smallest pieces of meaning": {
      k: "",
      p: ["Free morphemes can stand alone (하늘); bound ones can't (-다).",
          "Content morphemes carry meaning (하늘, 맑-); grammatical ones carry grammar (이, -다).",
          "하늘이 맑다 → 하늘 / 이 / 맑- / -다."],
      q: [["Which is a free morpheme?", ["-었-", "이 (particle)", "하늘", "-다"], 2, "하늘 stands alone."],
          ["Which is a bound, grammatical morpheme?", ["하늘", "맑-", "-다", "책"], 2, "Endings are bound and grammatical."],
          ["How many morphemes are in 하늘이 맑다?", ["2", "3", "4", "5"], 2, "하늘 / 이 / 맑- / -다."]]
    },
    "The nine parts of speech": {
      k: "",
      p: ["Nouns, pronouns and numerals name things; verbs and adjectives conjugate.",
          "Determiners and adverbs modify; particles mark relationships; interjections stand alone.",
          "Korean adjectives conjugate like verbs: 예뻐요, 예뻤어요."],
      ex: [["새 책", "새 is a determiner"], ["아주 빨리", "아주 is an adverb"], ["아이고", "an interjection"]],
      q: [["Which group names things?", ["nouns, pronouns, numerals", "verbs, adjectives", "determiners, adverbs", "particles"], 0, "Nouns, pronouns and numerals."],
          ["In 새 책, 새 is…", ["an adjective", "a determiner", "an adverb", "a noun"], 1, "A determiner describes a noun and never conjugates."],
          ["How many parts of speech does school grammar list?", ["7", "8", "9", "10"], 2, "School grammar lists nine."]]
    },
    "Compounds and derivatives": {
      k: "",
      s: "New words are made by joining two roots (compounds) or adding a prefix or suffix to one (derivatives).",
      p: ["Compounds: 손 + 목 → 손목, 밤 + 낮 → 밤낮.",
          "Derivatives with a prefix: 풋- + 사과 → 풋사과.",
          "With a suffix: 먹- + -이 → 먹이, 지우- + -개 → 지우개."],
      q: [["Which word is a compound?", ["풋사과", "먹이", "손목", "지우개"], 2, "손 + 목: two roots."],
          ["Which word is a derived word?", ["손목", "밤낮", "풋사과", "눈물"], 2, "풋- is a prefix."],
          ["지우개 is made of…", ["two nouns", "a stem + suffix", "a prefix + noun", "a loanword"], 1, "지우- + -개 (a tool for …)."]]
    }
  }
};

/* Korean term lines under lesson titles: keep forms learners use, drop grammar names */
const K_KEEP = new Set(["ㄱ ㄴ ㅁ ㅅ ㅇ", "이에요 / 예요, 아니에요", "있어요 / 없어요", "-았/었-", "안 / 못", "하고 · (이)랑 · 와/과", "보다 · 밖에",
  "-고 싶다", "-(으)ㄹ 거예요", "-(으)려고", "-는 것 / -기", "-(으)ㄹ 수 있다/없다 · 잘하다/못하다", "-아/어야 하다 · -지 마세요", "-고 있다 · -는 중이다 · -거나",
  "-(으)세요", "-아/어 주세요", "요일 · 날짜", "-아/어 보다 · -아/어 본 적이 있다", "-게 되다", "-(으)ㄹ 때 · -(으)면서", "-기 전에 · -(으)ㄴ 후에/다음에",
  "-기 때문에 · -기 위해(서)", "-(으)ㄴ/는지 알다/모르다", "-아/어도 되다 · -(으)면 안 되다", "-고 나서 · -자마자 · -다가", "-느라고 · -았/었더니",
  "-나 보다 · -기는 하지만 · -(으)ㄴ 채로", "-도록 (하다)", "-기 마련이다 · -(으)ㄹ 뿐이다 · -에 불과하다", "-기는커녕 · -느니 차라리", "-더라도 · -았/었더라면",
  "-고 말다 · -고서야", "-는 대로 · -는 바람에 · -다시피", "-(으)ㄹ지도 모르다", "Heaven, earth, human", "Monophthongs", "Diphthongs", "Allophones of plain consonants", "Stroke order"]);
const K_RENAME = {
  "은/는 · 이/가 · 을/를 (조사)": "은/는 · 이/가 · 을/를",
  "에 / 에서 (부사격 조사)": "에 / 에서", "(으)로 (부사격 조사)": "(으)로", "에게 / 한테 / 께 (부사격 조사)": "에게 / 한테 / 께",
  "도 · 만 · 부터 · 까지 (보조사)": "도 · 만 · 부터 · 까지", "-아요 / -어요 (모음 조화)": "-아요 / -어요",
  "된소리되기 (ㄱ·ㄷ·ㅈ → ㄲ·ㄸ·ㅉ)": "ㄱ·ㄷ·ㅈ → ㄲ·ㄸ·ㅉ", "관형사형 어미 -는 / -(으)ㄴ / -(으)ㄹ": "-는 / -(으)ㄴ / -(으)ㄹ",
  "주체 높임 (-(으)시-)": "-(으)시-", "의문사": "누구 · 뭐 · 어디 · 언제 · 왜 · 어떻게",
  "고유어 수 · 한자어 수": "하나, 둘, 셋 · 일, 이, 삼", "색깔 말": "빨간색 · 파란색 · 노란색",
  "감정 어휘 (희로애락)": "기쁘다 · 화나다 · 슬프다 · 즐겁다", "객체 높임": "드리다 · 여쭙다 · 모시다 · 뵙다",
  "높임의 어휘와 잘못된 높임": "댁 · 진지 · 연세 · 말씀", "직접 인용 · 간접 인용": "-다고 · -냐고 · -라고 · -자고"
};
/* Korean grammar names in brackets inside summaries, key ideas and explanations */
const TERM_PARENS = [
  [/\s*\((?:표준 발음법\s*)?제\s?\d+(?:·\d+)*항\)/g, ""],
  [/\(구개음화, 제17항\)/g, "(palatalization)"], [/\(ㄴ 첨가, 제29항\)/g, "(an added ㄴ)"],
  [/\s*\((?:이체자|양성 모음|음성 모음|울림소리|안울림소리|두벌식|받침|보조사|주격 조사|목적격 조사|부사격 조사|명사절|관형절|인용절|변이음|거센소리|된소리|예사소리|유음화|비음화|교체|탈락|첨가|축약|합성어|파생어)\)/g, ""],
  [/(\d+)\s?품사/g, "$1 parts of speech"]
];

(function applyEdits() {
  const clean = s => typeof s === "string" ? TERM_PARENS.reduce((t, [re, to]) => t.replace(re, to), s) : s;
  UNITS.forEach(u => {
    u.titleKo = "";
    const edits = LESSON_EDITS[u.id] || {};
    u.lessons.forEach((l, j) => {
      const e = edits[l.t];
      if (e) {
        const { q, ...fields } = e;
        Object.assign(l, fields);
        if (q) PRACTICE[`${u.id}:${j}`] = q;
      }
      if (!K_KEEP.has(l.k)) l.k = K_RENAME[l.k] ?? (/^[A-Za-z]/.test(l.k || "") ? l.k : "");
      l.s = clean(l.s);
      l.p = l.p.map(clean);
      (PRACTICE[`${u.id}:${j}`] || []).forEach(item => { if (Array.isArray(item)) { item[0] = clean(item[0]); item[3] = clean(item[3]); } else if (item.why) item.why = clean(item.why); });
    });
  });
})();
