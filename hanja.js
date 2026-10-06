/* =========================================================
   한자 서당 — Hanja data (premium content)
   Set 1: the 50 characters of 한국어문회 8급
   [char, 훈 (meaning), 음 (sound), english, [[word, hanja, meaning], ...]]
   ========================================================= */

const HANJA_SETS = [
  { id: "8", name: "8급", en: "First 50 characters", free: 10 }
];

const HANJA = [
  ["一", "한", "일", "one", [["일월", "一月", "January"], ["제일", "第一", "the most, number one"]]],
  ["二", "두", "이", "two", [["이월", "二月", "February"]]],
  ["三", "석", "삼", "three", [["삼월", "三月", "March"], ["삼촌", "三寸", "uncle (father's brother)"]]],
  ["四", "넉", "사", "four", [["사월", "四月", "April"], ["사촌", "四寸", "cousin"]]],
  ["五", "다섯", "오", "five", [["오월", "五月", "May"]]],
  ["六", "여섯", "륙", "six", [["유월", "六月", "June (육 → 유)"], ["육십", "六十", "sixty"]]],
  ["七", "일곱", "칠", "seven", [["칠월", "七月", "July"]]],
  ["八", "여덟", "팔", "eight", [["팔월", "八月", "August"]]],
  ["九", "아홉", "구", "nine", [["구월", "九月", "September"]]],
  ["十", "열", "십", "ten", [["시월", "十月", "October (십 → 시)"], ["십대", "十代", "teens"]]],

  ["日", "날", "일", "day, sun", [["일요일", "日曜日", "Sunday"], ["생일", "生日", "birthday"]]],
  ["月", "달", "월", "moon, month", [["월요일", "月曜日", "Monday"], ["일월", "一月", "January"]]],
  ["火", "불", "화", "fire", [["화요일", "火曜日", "Tuesday"], ["화산", "火山", "volcano"]]],
  ["水", "물", "수", "water", [["수요일", "水曜日", "Wednesday"], ["생수", "生水", "bottled water"]]],
  ["木", "나무", "목", "tree, wood", [["목요일", "木曜日", "Thursday"]]],
  ["金", "쇠 / 성", "금 / 김", "metal, gold; the surname Kim", [["금요일", "金曜日", "Friday"], ["김", "金", "the surname Kim"]]],
  ["土", "흙", "토", "earth, soil", [["토요일", "土曜日", "Saturday"], ["국토", "國土", "national territory"]]],

  ["山", "메", "산", "mountain", [["남산", "南山", "Namsan"], ["화산", "火山", "volcano"]]],
  ["人", "사람", "인", "person", [["한국인", "韓國人", "a Korean"], ["외국인", "外國人", "foreigner"]]],
  ["大", "큰", "대", "big", [["대학", "大學", "university"], ["대한민국", "大韓民國", "Republic of Korea"]]],
  ["小", "작을", "소", "small", [["대소", "大小", "large and small"]]],
  ["中", "가운데", "중", "middle", [["중국", "中國", "China"], ["중학생", "中學生", "middle-school student"]]],
  ["門", "문", "문", "gate, door", [["동대문", "東大門", "Dongdaemun, the Great East Gate"], ["대문", "大門", "main gate"]]],
  ["王", "임금", "왕", "king", [["국왕", "國王", "monarch"]]],
  ["寸", "마디", "촌", "joint, degree of kinship", [["삼촌", "三寸", "uncle (3rd degree)"], ["사촌", "四寸", "cousin (4th degree)"]]],

  ["東", "동녘", "동", "east", [["동대문", "東大門", "Dongdaemun"], ["동서", "東西", "east and west"]]],
  ["西", "서녘", "서", "west", [["동서", "東西", "east and west"], ["서해", "西海", "Yellow Sea (west sea)"]]],
  ["南", "남녘", "남", "south", [["남산", "南山", "Namsan"], ["남북", "南北", "South and North"]]],
  ["北", "북녘", "북", "north", [["남북", "南北", "South and North"], ["북한", "北韓", "North Korea"]]],
  ["外", "바깥", "외", "outside", [["외국", "外國", "foreign country"], ["외국인", "外國人", "foreigner"]]],

  ["父", "아비", "부", "father", [["부모", "父母", "parents"]]],
  ["母", "어미", "모", "mother", [["부모", "父母", "parents"], ["모국", "母國", "home country"]]],
  ["兄", "형", "형", "older brother", [["형제", "兄弟", "brothers, siblings"]]],
  ["弟", "아우", "제", "younger brother", [["형제", "兄弟", "brothers, siblings"]]],
  ["女", "계집", "녀", "woman", [["여자", "女子", "woman"], ["장녀", "長女", "eldest daughter"]]],
  ["長", "긴", "장", "long; elder, head", [["교장", "校長", "principal"], ["장녀", "長女", "eldest daughter"]]],

  ["學", "배울", "학", "learn", [["학생", "學生", "student"], ["대학", "大學", "university"], ["학교", "學校", "school"]]],
  ["校", "학교", "교", "school", [["학교", "學校", "school"], ["교장", "校長", "principal"]]],
  ["敎", "가르칠", "교", "teach", [["교실", "敎室", "classroom"], ["교사", "敎師", "teacher"]]],
  ["室", "집", "실", "room", [["교실", "敎室", "classroom"]]],
  ["先", "먼저", "선", "first, before", [["선생", "先生", "teacher"]]],
  ["生", "날", "생", "be born, live", [["학생", "學生", "student"], ["생일", "生日", "birthday"], ["선생", "先生", "teacher"]]],
  ["年", "해", "년", "year", [["청년", "靑年", "young adult"], ["연말", "年末", "end of the year"]]],

  ["國", "나라", "국", "country", [["한국", "韓國", "Korea"], ["외국", "外國", "foreign country"], ["국민", "國民", "citizens"]]],
  ["韓", "한국 / 나라", "한", "Korea", [["한국", "韓國", "Korea"], ["대한민국", "大韓民國", "Republic of Korea"]]],
  ["民", "백성", "민", "people, citizens", [["국민", "國民", "citizens"], ["민주", "民主", "democracy"]]],
  ["軍", "군사", "군", "army", [["군인", "軍人", "soldier"], ["국군", "國軍", "national army"]]],

  ["白", "흰", "백", "white", [["백지", "白紙", "blank paper"]]],
  ["靑", "푸를", "청", "blue, green; young", [["청년", "靑年", "young adult"], ["청춘", "靑春", "youth"]]],
  ["萬", "일만", "만", "ten thousand", [["만일", "萬一", "if by any chance"]]]
];

/* Day-of-week set used in the 요일 table */
const HANJA_WEEK = ["月", "火", "水", "木", "金", "土", "日"];

/* ───────── Set 2: a selection from 한국어문회 7급 — characters you meet constantly ───────── */
HANJA_SETS.push({ id: "7", name: "7급", en: "Everyday characters (selection)" });
const HANJA_7 = [
  ["家", "집", "가", "house, family", [["가족", "家族", "family"], ["국가", "國家", "nation"]]],
  ["間", "사이", "간", "between, interval", [["시간", "時間", "time"], ["인간", "人間", "human being"]]],
  ["車", "수레", "거/차", "vehicle", [["자동차", "自動車", "car"], ["하차", "下車", "getting off"]]],
  ["工", "장인", "공", "work, craft", [["공장", "工場", "factory"], ["공학", "工學", "engineering"]]],
  ["空", "빌", "공", "empty, sky", [["공항", "空港", "airport"], ["공기", "空氣", "air"]]],
  ["口", "입", "구", "mouth, opening", [["입구", "入口", "entrance"], ["인구", "人口", "population"]]],
  ["記", "기록할", "기", "record", [["일기", "日記", "diary"], ["기자", "記者", "reporter"]]],
  ["男", "사내", "남", "man", [["남자", "男子", "man"], ["장남", "長男", "eldest son"]]],
  ["內", "안", "내", "inside", [["국내", "國內", "domestic"], ["내용", "內容", "content"]]],
  ["答", "대답", "답", "answer", [["대답", "對答", "reply"], ["정답", "正答", "correct answer"]]],
  ["道", "길", "도", "road, way", [["도로", "道路", "road"], ["태권도", "跆拳道", "taekwondo"]]],
  ["動", "움직일", "동", "move", [["운동", "運動", "exercise"], ["동물", "動物", "animal"]]],
  ["力", "힘", "력", "strength", [["노력", "努力", "effort"], ["능력", "能力", "ability"]]],
  ["立", "설", "립", "stand", [["국립", "國立", "national (institution)"], ["독립", "獨立", "independence"]]],
  ["每", "매양", "매", "every", [["매일", "每日", "every day"], ["매년", "每年", "every year"]]],
  ["名", "이름", "명", "name", [["유명", "有名", "famous"], ["성명", "姓名", "full name"]]],
  ["文", "글월", "문", "writing", [["문화", "文化", "culture"], ["문법", "文法", "grammar"]]],
  ["物", "물건", "물", "thing", [["동물", "動物", "animal"], ["선물", "膳物", "present"]]],
  ["方", "모", "방", "direction, way", [["방법", "方法", "method"], ["지방", "地方", "region"]]],
  ["不", "아닐", "불/부", "not", [["불안", "不安", "anxiety"], ["부족", "不足", "shortage"]]],
  ["事", "일", "사", "affair, work", [["식사", "食事", "meal"], ["사고", "事故", "accident"]]],
  ["上", "윗", "상", "up, above", [["세상", "世上", "the world"], ["이상", "以上", "more than; above"]]],
  ["下", "아래", "하", "down, below", [["지하철", "地下鐵", "subway"], ["하차", "下車", "getting off"]]],
  ["世", "인간", "세", "world, generation", [["세계", "世界", "world"], ["세상", "世上", "the world"]]],
  ["手", "손", "수", "hand", [["가수", "歌手", "singer"], ["박수", "拍手", "applause"]]],
  ["時", "때", "시", "time, hour", [["시간", "時間", "time"], ["동시", "同時", "same time"]]],
  ["市", "저자", "시", "market, city", [["시장", "市場", "market"], ["시민", "市民", "citizen"]]],
  ["食", "밥/먹을", "식", "food, eat", [["식당", "食堂", "restaurant"], ["음식", "飮食", "food"]]],
  ["安", "편안", "안", "peaceful", [["안녕", "安寧", "peace, well-being"], ["안전", "安全", "safety"]]],
  ["自", "스스로", "자", "self", [["자동차", "自動車", "car"], ["자유", "自由", "freedom"]]],
  ["子", "아들", "자", "child, person", [["여자", "女子", "woman"], ["남자", "男子", "man"]]],
  ["場", "마당", "장", "place, ground", [["시장", "市場", "market"], ["공장", "工場", "factory"]]],
  ["電", "번개", "전", "electricity", [["전화", "電話", "telephone"], ["전기", "電氣", "electricity"]]],
  ["前", "앞", "전", "front, before", [["오전", "午前", "morning, a.m."], ["전후", "前後", "before and after"]]],
  ["後", "뒤", "후", "back, after", [["오후", "午後", "afternoon, p.m."], ["최후", "最後", "the very end"]]],
  ["午", "낮", "오", "noon", [["오전", "午前", "a.m."], ["정오", "正午", "noon"]]],
  ["話", "말씀", "화", "speech", [["전화", "電話", "telephone"], ["대화", "對話", "conversation"]]],
  ["花", "꽃", "화", "flower", [["국화", "菊花", "chrysanthemum"], ["화분", "花盆", "flowerpot"]]],
  ["天", "하늘", "천", "sky, heaven", [["천국", "天國", "heaven"], ["천재", "天才", "genius"]]],
  ["春", "봄", "춘", "spring", [["청춘", "靑春", "youth"], ["춘하추동", "春夏秋冬", "the four seasons"]]],
  ["夏", "여름", "하", "summer", [["하계", "夏季", "summer season"], ["춘하추동", "春夏秋冬", "the four seasons"]]],
  ["秋", "가을", "추", "autumn", [["추석", "秋夕", "Chuseok"], ["춘하추동", "春夏秋冬", "the four seasons"]]],
  ["冬", "겨울", "동", "winter", [["동지", "冬至", "winter solstice"], ["춘하추동", "春夏秋冬", "the four seasons"]]],
  ["海", "바다", "해", "sea", [["해외", "海外", "overseas"], ["동해", "東海", "East Sea"]]],
  ["心", "마음", "심", "heart, mind", [["중심", "中心", "center"], ["안심", "安心", "relief"]]],
  ["語", "말씀", "어", "language", [["한국어", "韓國語", "Korean"], ["외국어", "外國語", "foreign language"]]],
  ["休", "쉴", "휴", "rest", [["휴일", "休日", "day off"], ["휴가", "休暇", "vacation"]]],
  ["來", "올", "래", "come", [["미래", "未來", "future"], ["내일", "來日", "tomorrow"]]],
  ["入", "들", "입", "enter", [["입구", "入口", "entrance"], ["입학", "入學", "school admission"]]],
  ["出", "날", "출", "go out", [["출구", "出口", "exit"], ["출발", "出發", "departure"]]]
];
HANJA.forEach(h => { h[5] = "8"; });
HANJA_7.forEach(h => { h[5] = "7"; HANJA.push(h); });
