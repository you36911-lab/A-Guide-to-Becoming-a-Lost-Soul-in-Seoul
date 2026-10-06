/* =========================================================
   Reading room — original texts written for this course
   One per neighborhood, in everyday formats: signs, menus,
   chats, diaries, blogs, emails, articles, columns, essays.
   lines: paragraphs, or "Name: line" for conversations
   gloss: [word, meaning]   q: [question, options, answer, why]
   ========================================================= */

const READINGS = [
  {
    id: "signs", unit: "gwanghwamun", level: "A0", type: "Street signs", title: "Coming out of the station", titleKo: "광화문역 앞에서",
    intro: "You've just come up the stairs at Gwanghwamun station. Read the signs around you, one syllable block at a time.",
    lines: ["광화문역 2번 출구", "세종대왕 동상", "버스 정류장 →", "화장실 ↓", "편의점 · 약국 · 은행", "우체국은 왼쪽에 있어요."],
    gloss: [["출구", "exit"], ["동상", "statue"], ["정류장", "stop (bus)"], ["화장실", "restroom"], ["편의점", "convenience store"], ["약국", "pharmacy"], ["은행", "bank"], ["우체국", "post office"]],
    q: [["Which sign shows the exit number?", ["광화문역 2번 출구", "화장실", "편의점", "버스 정류장"], 0, "출구 means exit."],
        ["Where would you buy medicine?", ["은행", "약국", "우체국", "편의점"], 1, "약국 = pharmacy."],
        ["Where is the post office?", ["On the right", "On the left", "Downstairs", "Next to the statue"], 1, "왼쪽 = left."]]
  },
  {
    id: "menu", unit: "seochon", level: "A0", type: "Menu", title: "A small café menu", titleKo: "서촌 골목 카페 메뉴",
    intro: "A tiny café in an alley in Seochon. The menu is handwritten on a board.",
    lines: ["오늘의 메뉴", "커피 4,000원", "라떼 4,500원", "녹차 4,000원", "유자차 5,000원", "치즈 케이크 6,000원", "빵은 아침에 구웠어요."],
    gloss: [["오늘의", "today's"], ["녹차", "green tea"], ["유자차", "citron tea"], ["빵", "bread"], ["구웠어요", "baked"]],
    q: [["Which drink is the most expensive?", ["커피", "라떼", "녹차", "유자차"], 3, "유자차 is 5,000원."],
        ["How is 녹차 pronounced?", ["[녹차]", "[농차]", "[녹짜]", "[노차]"], 0, "ㄱ before ㅊ: no change. [녹차]."],
        ["When was the bread baked?", ["Yesterday", "In the morning", "At night", "It doesn't say"], 1, "아침 = morning."]]
  },
  {
    id: "poster", unit: "hongdae", level: "A0", type: "Poster", title: "A gig in Hongdae", titleKo: "홍대 앞 작은 공연",
    intro: "A poster on a lamppost. Read it out loud: half the words change their sound.",
    lines: ["홍대 앞 작은 공연", "오늘 밤 일곱 시", "입장료 만 원", "음료 한 잔 무료", "신나는 음악과 함께해요!", "장소: 놀이터 옆 지하 1층"],
    gloss: [["공연", "performance, gig"], ["입장료", "admission fee"], ["음료", "drink"], ["무료", "free of charge"], ["장소", "place"], ["놀이터", "playground"], ["지하", "basement"]],
    q: [["How is 입장료 pronounced?", ["[입장료]", "[입짱뇨]", "[임장뇨]", "[입짱료]"], 1, "Tensing after ㅂ, and ㄹ → ㄴ after ㅇ."],
        ["How is 음료 pronounced?", ["[음료]", "[음뇨]", "[을료]", "[음노]"], 1, "ㄹ → ㄴ after ㅁ."],
        ["What do you get for free?", ["A ticket", "One drink", "A poster", "A CD"], 1, "음료 한 잔 무료."]]
  },
  {
    id: "tandem-post", unit: "sinchon", level: "A1", type: "Online post", title: "Looking for a language partner", titleKo: "언어 교환 친구를 찾아요",
    intro: "A post in a language-exchange group near the universities in Sinchon.",
    lines: ["안녕하세요! 저는 안나예요.", "독일 사람이에요. 지금 신촌에서 한국어를 배워요.", "저는 대학생이에요. 전공은 디자인이에요.", "한국 친구가 있어요? 아니요, 아직 없어요.", "독일어하고 영어를 가르칠 수 있어요.", "카페에서 같이 이야기해요. 연락 주세요!"],
    gloss: [["배워요", "learn (배우다)"], ["전공", "major"], ["아직", "yet, still"], ["가르칠 수 있어요", "can teach"], ["연락", "contact"]],
    q: [["Where is Anna from?", ["Korea", "Germany", "England", "It doesn't say"], 1, "독일 사람이에요."],
        ["What does Anna study at university?", ["Korean", "German", "Design", "English"], 2, "전공은 디자인이에요."],
        ["What can she teach?", ["Korean and English", "German and English", "Design", "Cooking"], 1, "독일어하고 영어."]]
  },
  {
    id: "picnic-diary", unit: "yeouido", level: "A1", type: "Diary", title: "A picnic by the river", titleKo: "여의도 한강공원 소풍",
    intro: "Minji's diary entry from a Sunday in spring.",
    lines: ["4월 12일 일요일. 날씨가 아주 좋았다.", "오늘 친구들하고 여의도 한강공원에 갔다.", "우리는 김밥하고 치킨을 먹었다. 강에서 바람이 불었다.", "자전거도 탔다. 나는 자전거를 잘 못 타서 조금 무서웠다.", "저녁에 집에 왔다. 피곤했지만 정말 즐거웠다."],
    gloss: [["소풍", "picnic"], ["바람이 불다", "the wind blows"], ["자전거를 타다", "ride a bike"], ["무섭다", "scary"], ["피곤하다", "tired"], ["즐겁다", "fun"]],
    q: [["What did they eat?", ["Gimbap and chicken", "Bread and coffee", "Ramyeon", "Nothing"], 0, "김밥하고 치킨."],
        ["Why was Minji a bit scared?", ["The wind was strong", "She isn't good at riding a bike", "It got dark", "She got lost"], 1, "잘 못 타서 무서웠다."],
        ["This diary is written in which style?", ["해요체", "-다 style (해라체)", "합쇼체", "하게체"], 1, "Diaries usually use the plain -다 style."]]
  },
  {
    id: "directions-chat", unit: "noryangjin", level: "A2", type: "Text messages", title: "Meet me at the fish market", titleKo: "노량진 수산시장에서 만나요",
    intro: "Jiho is waiting at the market. His friend Sara just got off the subway.",
    lines: ["사라: 지호 씨, 저 지금 노량진역에 도착했어요!", "지호: 잘 왔어요. 1번 출구로 나오세요.", "사라: 1번 출구에서 나왔어요. 그다음에는요?", "지호: 오른쪽으로 쭉 오세요. 육교가 보여요?", "사라: 네, 보여요. 육교를 건너요?", "지호: 네, 건너서 왼쪽으로 오세요. 저는 시장 입구에 있어요.", "사라: 알겠어요. 5분 후에 봐요!"],
    gloss: [["도착하다", "arrive"], ["쭉", "straight on"], ["육교", "pedestrian bridge"], ["건너다", "cross"], ["입구", "entrance"]],
    q: [["Which exit should Sara take?", ["Exit 1", "Exit 2", "Exit 5", "Any exit"], 0, "1번 출구로 나오세요."],
        ["After the bridge, which way?", ["Right", "Left", "Straight", "Back"], 1, "건너서 왼쪽으로."],
        ["Where is Jiho waiting?", ["At the station", "On the bridge", "At the market entrance", "In a café"], 2, "시장 입구에 있어요."]]
  },
  {
    id: "weekend-chat", unit: "banpo", level: "A2", type: "Group chat", title: "Plans for Saturday", titleKo: "토요일에 뭐 해?",
    intro: "Three friends in a group chat, deciding what to do this weekend.",
    lines: ["유나: 토요일에 다들 뭐 할 거예요?", "민수: 저는 오전에 운동하고 오후에는 시간이 있어요.", "하린: 저도 오후에 괜찮아요. 어디 가고 싶어요?", "유나: 반포 한강공원에 가고 싶어요. 밤에 무지개 분수를 볼 수 있어요.", "민수: 좋아요! 저는 돗자리를 가져갈게요.", "하린: 그럼 저는 간식을 사 갈게요. 여섯 시에 만날까요?", "유나: 네, 여섯 시에 고속터미널역에서 만나요!"],
    gloss: [["다들", "everyone"], ["오전 / 오후", "morning / afternoon"], ["무지개 분수", "rainbow fountain"], ["돗자리", "picnic mat"], ["간식", "snacks"]],
    q: [["What will Minsu do in the morning?", ["Exercise", "Study", "Work", "Sleep"], 0, "오전에 운동하고."],
        ["What will Harin bring?", ["A mat", "Snacks", "Drinks", "A camera"], 1, "간식을 사 갈게요."],
        ["Where and when will they meet?", ["Banpo, 7 p.m.", "Express Bus Terminal station, 6 p.m.", "Gangnam, 6 a.m.", "Home, noon"], 1, "여섯 시에 고속터미널역에서."]]
  },
  {
    id: "cafe-order", unit: "gangnam", level: "A2", type: "Dialogue", title: "Ordering at a café", titleKo: "카페에서 주문하기",
    intro: "A busy lunchtime café in Gangnam.",
    lines: ["직원: 어서 오세요. 주문하시겠어요?", "손님: 아이스 아메리카노 두 잔하고 치즈 케이크 한 개 주세요.", "직원: 드시고 가세요? 아니면 포장하세요?", "손님: 커피는 포장해 주시고, 케이크는 여기서 먹을게요.", "직원: 네, 모두 만 사천 원입니다. 카드로 계산하시겠어요?", "손님: 네, 여기 있어요.", "직원: 진동벨이 울리면 오세요. 감사합니다."],
    gloss: [["주문하다", "order"], ["드시다", "eat, drink (honorific)"], ["포장", "to go"], ["계산하다", "pay"], ["진동벨", "buzzer"]],
    q: [["How many coffees did the customer order?", ["One", "Two", "Three", "None"], 1, "두 잔."],
        ["What will the customer eat in the café?", ["The coffee", "The cake", "Both", "Neither"], 1, "케이크는 여기서 먹을게요."],
        ["How much was it?", ["₩4,000", "₩10,400", "₩14,000", "₩40,000"], 2, "만 사천 원 = 14,000."]]
  },
  {
    id: "baseball-blog", unit: "jamsil", level: "B1", type: "Blog post", title: "My first baseball game", titleKo: "처음 가 본 야구장",
    intro: "A blog post by an exchange student after a night at the stadium in Jamsil.",
    lines: [
      "지난 금요일에 처음으로 잠실 야구장에 가 봤어요. 한국 친구가 야구는 꼭 직접 봐야 한다고 해서 같이 갔어요.",
      "경기장에 들어가자마자 깜짝 놀랐어요. 사람이 정말 많았고 응원 소리가 너무 커서 친구 목소리가 잘 안 들렸어요. 선수마다 응원가가 있어서 모두 같이 노래를 불렀어요. 저는 가사를 몰라서 그냥 박수만 쳤어요.",
      "날씨가 더웠지만 시원한 맥주하고 치킨을 먹으면서 보니까 정말 즐거웠어요. 우리 팀이 9회에 역전해서 이겼을 때는 모르는 사람들하고 하이파이브도 했어요.",
      "야구 규칙은 아직 잘 모르지만 한국에서 꼭 해 봐야 하는 경험이라고 생각해요. 다음에는 응원가를 외워서 가려고 해요."],
    gloss: [["직접", "in person"], ["응원", "cheering"], ["선수", "player"], ["응원가", "cheer song"], ["가사", "lyrics"], ["역전하다", "come from behind"], ["외우다", "memorize"]],
    q: [["Why couldn't the writer hear her friend?", ["Her phone broke", "The cheering was very loud", "They sat apart", "It rained"], 1, "응원 소리가 너무 커서."],
        ["Why did she only clap?", ["She was tired", "She didn't know the lyrics", "She didn't like the song", "She was eating"], 1, "가사를 몰라서."],
        ["What does she plan to do next time?", ["Learn the rules", "Memorize the cheer songs", "Bring more friends", "Sit closer"], 1, "응원가를 외워서 가려고 해요."]]
  },
  {
    id: "popup-review", unit: "seongsu", level: "B1", type: "Review", title: "A day in Seongsu", titleKo: "성수동 팝업 스토어 후기",
    intro: "A short review posted after a weekend visit to Seongsu.",
    lines: [
      "주말에 성수동에 있는 팝업 스토어에 다녀왔다. 오래된 공장을 고쳐서 만든 공간이라서 천장이 높고 벽돌이 그대로 남아 있었다.",
      "들어가기 전에 30분 정도 줄을 서야 했다. 기다리면서 조금 지루했지만, 안에 들어가니까 생각보다 볼 것이 많았다. 직접 향수를 만들어 볼 수 있는 체험이 제일 재미있었다.",
      "아쉬운 점도 있었다. 사람이 너무 많아서 사진을 찍기 힘들었고, 물건 가격도 비싼 편이었다. 그래도 분위기가 좋아서 친구에게 추천하고 싶다. 평일 오전에 가면 덜 붐빌 것 같다."],
    gloss: [["팝업 스토어", "pop-up store"], ["공장", "factory"], ["벽돌", "brick"], ["줄을 서다", "stand in line"], ["향수", "perfume"], ["체험", "hands-on activity"], ["붐비다", "be crowded"]],
    q: [["What was the building before?", ["A school", "A factory", "A bank", "A house"], 1, "오래된 공장을 고쳐서."],
        ["What did the writer enjoy most?", ["The photos", "Making perfume", "The prices", "The line"], 1, "향수를 만들어 볼 수 있는 체험."],
        ["What advice does the writer give?", ["Go on a weekday morning", "Go at night", "Don't go", "Bring cash"], 0, "평일 오전에 가면 덜 붐빌 것 같다."]]
  },
  {
    id: "email-teacher", unit: "dongdaemun", level: "B1", type: "Email", title: "Asking to change a class", titleKo: "수업 시간 변경 요청 메일",
    intro: "A polite email from a student to her Korean teacher.",
    lines: [
      "김수진 선생님께",
      "선생님, 안녕하세요? 화요일 오전반에서 공부하고 있는 마리아입니다.",
      "다름이 아니라 다음 달부터 회사 일정이 바뀌어서 오전 수업에 참석하기가 어려워졌습니다. 혹시 같은 단계의 저녁반으로 옮길 수 있는지 여쭤봐도 될까요?",
      "바쁘신데 번거롭게 해 드려서 죄송합니다. 가능하지 않으면 다른 방법도 알려 주시면 감사하겠습니다.",
      "날씨가 많이 쌀쌀해졌는데 감기 조심하세요.",
      "마리아 드림"],
    gloss: [["다름이 아니라", "the reason I'm writing is"], ["참석하다", "attend"], ["단계", "level"], ["옮기다", "move, transfer"], ["여쭙다", "ask (humble)"], ["번거롭다", "be a bother"], ["드림", "(sign-off) from"]],
    q: [["Why is Maria writing?", ["To quit the class", "To move to an evening class", "To ask about homework", "To complain"], 1, "저녁반으로 옮길 수 있는지."],
        ["Why can't she attend mornings?", ["She's moving house", "Her work schedule changed", "She's sick", "She has another class"], 1, "회사 일정이 바뀌어서."],
        ["Which word shows humble respect for the teacher?", ["옮기다", "여쭤봐도", "참석하다", "바뀌어서"], 1, "여쭙다 is the humble form of 묻다."]]
  },
  {
    id: "theater-article", unit: "daehakro", level: "B2", type: "News article", title: "A play the audience finishes", titleKo: "관객이 결말을 정하는 연극",
    intro: "A short arts-section article.",
    lines: [
      "대학로의 한 소극장에서 관객이 직접 결말을 고르는 연극이 공연되고 있어 화제다.",
      "공연이 끝나기 10분 전, 배우들은 무대 위에서 잠시 멈추고 관객들에게 두 가지 결말 중 하나를 선택해 달라고 요청한다. 관객들이 휴대 전화로 투표하면 결과가 바로 화면에 나타나고, 배우들은 그 결과에 따라 다른 장면을 연기한다.",
      "연출가는 \"관객이 이야기의 주인공이 되는 경험을 만들고 싶었다\"고 밝혔다. 공연을 본 한 대학생은 \"친구와 다른 결말에 투표했는데, 다음에는 반대 결말을 보러 다시 오기로 했다\"고 말했다.",
      "이 연극은 다음 달 말까지 공연될 예정이며, 매주 목요일에는 공연이 끝난 후 배우와의 대화 시간도 마련된다."],
    gloss: [["소극장", "small theater"], ["결말", "ending"], ["화제", "talk of the town"], ["투표하다", "vote"], ["연출가", "director"], ["마련되다", "be arranged"]],
    q: [["When do the actors stop the play?", ["At the start", "In the middle", "Ten minutes before the end", "After the curtain call"], 2, "공연이 끝나기 10분 전."],
        ["How does the audience choose?", ["By clapping", "By voting on their phones", "By shouting", "By ticket color"], 1, "휴대 전화로 투표하면."],
        ["The sentence 연극이 공연되고 있다 uses…", ["a causative", "a passive", "an honorific", "a quotation"], 1, "공연되다 is the passive of 공연하다."]]
  },
  {
    id: "alley-feature", unit: "jongno", level: "B2", type: "Magazine feature", title: "The alley behind the main road", titleKo: "종로 뒷골목의 시간",
    intro: "A feature from a city magazine about old alleys in Jongno.",
    lines: [
      "종로 큰길에서 한 걸음만 들어가면 전혀 다른 풍경이 펼쳐진다. 좁은 골목 양쪽으로 수십 년 된 식당과 인쇄소, 금은방이 다닥다닥 붙어 있다.",
      "이 골목들은 조선 시대부터 서민들이 오가던 생활의 공간이었다. 높은 빌딩이 들어서면서 많은 골목이 사라졌지만, 남아 있는 가게들은 여전히 단골손님들로 붐빈다.",
      "삼십 년째 국밥집을 운영하는 한 상인은 \"재개발 소식이 나올 때마다 걱정되지만, 손님들이 이 골목의 분위기를 좋아해서 계속 찾아온다\"고 말했다.",
      "최근에는 젊은 세대 사이에서도 이른바 '노포' 탐방이 유행하면서, 오래된 골목이 새로운 관심을 받고 있다."],
    gloss: [["풍경", "scenery"], ["인쇄소", "print shop"], ["금은방", "jewelry shop"], ["서민", "ordinary people"], ["단골손님", "regular customer"], ["재개발", "redevelopment"], ["노포", "long-established shop"]],
    q: [["What lines the alleys?", ["Only cafés", "Old restaurants, print shops and jewelers", "Hotels", "Office buildings"], 1, "식당과 인쇄소, 금은방."],
        ["What worries the restaurant owner?", ["Bad weather", "News of redevelopment", "Young customers", "Rising rent only"], 1, "재개발 소식이 나올 때마다 걱정되지만."],
        ["노포 (老鋪) means…", ["a new shop", "a long-established shop", "a street stall", "an online store"], 1, "老 old + 鋪 shop."]]
  },
  {
    id: "spacing-column", unit: "insadong", level: "C1", type: "Column", title: "What one space can change", titleKo: "띄어쓰기 한 칸의 무게",
    intro: "An opinion column on why spacing matters.",
    lines: [
      "\"아버지가방에들어가신다.\" 띄어쓰기를 어디에 하느냐에 따라 아버지는 방에 들어가기도 하고 가방에 들어가기도 한다. 우스갯소리로 자주 인용되는 문장이지만, 띄어쓰기가 의미를 얼마나 크게 좌우하는지를 잘 보여 준다.",
      "물론 일상의 메시지에서 띄어쓰기를 하나하나 따질 필요는 없다. 맥락이 의미를 보충해 주기 때문이다. 그러나 공문서나 계약서처럼 오해의 여지가 없어야 하는 글에서는 사정이 다르다. 띄어쓰기 하나로 책임의 범위가 달라질 수도 있다.",
      "규범은 언어를 가두는 울타리라기보다 서로 같은 방식으로 읽기 위한 약속에 가깝다. 띄어쓰기를 지키는 일은 결국 읽는 사람을 배려하는 일이다."],
    gloss: [["우스갯소리", "joke"], ["좌우하다", "determine, sway"], ["보충하다", "supplement"], ["공문서", "official document"], ["여지", "room (for)"], ["배려하다", "be considerate of"]],
    q: [["What does the opening example show?", ["Spacing never matters", "Spacing can change meaning", "Fathers like bags", "Old spelling rules"], 1, "The same letters mean two things."],
        ["When, according to the writer, is spacing less important?", ["In contracts", "In official documents", "In everyday messages", "In textbooks"], 2, "일상의 메시지에서는 맥락이 보충해 준다."],
        ["The writer describes language rules as…", ["a fence", "a shared promise for reading", "a burden", "outdated"], 1, "울타리라기보다 약속에 가깝다."]]
  },
  {
    id: "hanok-interview", unit: "bukchon", level: "C1", type: "Interview", title: "Living where tourists walk", titleKo: "북촌 주민 인터뷰",
    intro: "An interview with a long-time resident who runs a small hanok guesthouse.",
    lines: [
      "기자: 북촌에 사신 지 얼마나 되셨어요?",
      "주민: 이 집에서만 이십오 년째예요. 처음 왔을 때는 이렇게 관광객이 많지 않았죠.",
      "기자: 관광객이 늘면서 불편하신 점도 있으실 것 같은데요.",
      "주민: 솔직히 말하면 있죠. 아침 일찍부터 골목에서 사진을 찍으니까 창문을 열기가 좀 그렇더라고요. 그래도 다들 일부러 여기까지 찾아오신 거잖아요. 무조건 막을 수는 없다고 생각해요.",
      "기자: 그럼 방문객들에게 꼭 하고 싶은 말씀이 있다면요?",
      "주민: 여기가 박물관이 아니라 사람이 사는 동네라는 것만 기억해 주셨으면 해요. 조금만 목소리를 낮춰 주시면 저희도 웃으면서 맞이할 수 있거든요."],
    gloss: [["관광객", "tourist"], ["불편하다", "inconvenient"], ["일부러", "on purpose, all the way"], ["무조건", "unconditionally"], ["방문객", "visitor"], ["맞이하다", "welcome"]],
    q: [["How long has the resident lived in this house?", ["5 years", "15 years", "25 years", "Since childhood"], 2, "이십오 년째예요."],
        ["창문을 열기가 좀 그렇더라고요 is…", ["a strong complaint", "a softened way of saying it's uncomfortable", "an invitation", "a joke"], 1, "좀 그렇다 hedges the complaint."],
        ["What does the resident ask visitors to remember?", ["To buy souvenirs", "That this is a neighborhood where people live", "To visit at night", "To book ahead"], 1, "사람이 사는 동네라는 것."]]
  },
  {
    id: "hangul-essay", unit: "gyeongbokgung", level: "C2", type: "Essay", title: "A script designed for its users", titleKo: "쓰는 사람을 위해 만든 문자",
    intro: "An expository essay on what makes Hangul unusual.",
    lines: [
      "세계의 문자 대부분은 오랜 세월에 걸쳐 저절로 변해 온 결과물이다. 그러나 한글은 만든 사람과 만든 시기, 그리고 만든 원리가 기록으로 남아 있는 드문 문자다. 1446년에 펴낸 『훈민정음』 해례본에는 글자를 왜, 어떻게 만들었는지가 자세히 설명되어 있다.",
      "자음은 소리를 낼 때의 발음 기관 모양을 본떴고, 모음은 하늘과 땅과 사람을 상징하는 세 요소를 조합했다. 이처럼 체계적인 설계 덕분에 몇 개의 기본 원리만 익히면 나머지 글자를 짐작할 수 있다.",
      "무엇보다 눈여겨볼 점은 창제의 목적이다. 서문에 따르면 한글은 글을 몰라 뜻을 펴지 못하는 백성을 위해 만들어졌다. 문자를 소수의 특권이 아니라 모두의 도구로 보았다는 점에서, 한글은 오늘날 우리가 말하는 '사용자 중심 설계'를 오백여 년 앞서 실천한 셈이다."],
    gloss: [["저절로", "by itself"], ["결과물", "product, result"], ["해례본", "explanatory edition"], ["본뜨다", "model on"], ["창제", "creation (of a script)"], ["특권", "privilege"], ["셈이다", "amounts to"]],
    q: [["What makes Hangul rare, according to the essay?", ["It's the oldest script", "Its creator, date and design principles are recorded", "It has the most letters", "It came from Chinese"], 1, "만든 사람과 시기, 원리가 기록으로 남아 있다."],
        ["What were the consonants modeled on?", ["Animals", "The speech organs", "Chinese characters", "Stars"], 1, "발음 기관 모양을 본떴다."],
        ["…실천한 셈이다 means…", ["it failed to practice", "it in effect practiced", "it will practice", "it pretended to practice"], 1, "-(으)ㄴ 셈이다 = it amounts to."]]
  },
  {
    id: "inwangsan-essay", unit: "inwangsan", level: "C2", type: "Personal essay", title: "Dusk on Inwangsan", titleKo: "인왕산의 저녁",
    intro: "A short personal essay (수필).",
    lines: [
      "퇴근길에 문득 산에 오르고 싶어지는 날이 있다. 그런 날이면 나는 지하철을 몇 정거장 일찍 내려 인왕산으로 향한다. 숨이 차오를 즈음 바위 위에 서면, 발아래로 도시가 천천히 불을 켜기 시작한다.",
      "낮에는 그토록 시끄럽던 거리도 여기서는 소리 없이 반짝일 뿐이다. 나를 조급하게 만들던 일들이 작은 불빛 하나만큼의 크기로 줄어든다. 길을 잃었다고 느낄 때마다 이곳에 오는 이유는 아마 그 때문일 것이다.",
      "내려오는 길, 어둠 속에서 누군가의 웃음소리가 들려온다. 나는 다시 그 불빛들 사이로 걸어 들어간다. 조금 전보다는 한결 가벼운 걸음으로."],
    gloss: [["문득", "suddenly"], ["숨이 차오르다", "get out of breath"], ["즈음", "around the time"], ["조급하다", "impatient, hurried"], ["한결", "noticeably, much"]],
    q: [["When does the writer go to Inwangsan?", ["Every morning", "On some days after work", "Only on weekends", "Once a year"], 1, "퇴근길에 … 날이 있다."],
        ["What happens to the writer's worries on the mountain?", ["They get bigger", "They shrink to the size of a small light", "They disappear forever", "Nothing"], 1, "작은 불빛 하나만큼의 크기로 줄어든다."],
        ["The last sentence, 조금 전보다는 한결 가벼운 걸음으로, is…", ["a full sentence with a verb", "a fragment that ends on an image", "a question", "a quotation"], 1, "The verb is left out for effect."]]
  }
];
