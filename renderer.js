const isNewSession = !sessionStorage.getItem("sessionInit");
if (isNewSession) sessionStorage.setItem("sessionInit", "1");

/************ Google Drive Sync (appDataFolder) ************/
const GDRIVE_CLIENT_ID = "675841428134-bdjtlimn587qqgdaiev0pk9a1m42lt9h.apps.googleusercontent.com"; // ← 교체
const GDRIVE_SCOPES = "https://www.googleapis.com/auth/drive.appdata";
let googleTokenClient = null;
let gapiInited = false;
let gisInited = false;
let driveFileId = null; // cozy-korean.json fileId

window.addEventListener("load", () => {
  gapi.load("client", async () => {
    await gapi.client.init({});
    await gapi.client.load("drive", "v3");
    gapiInited = true;
  });
  google.accounts.id.initialize({ client_id: GDRIVE_CLIENT_ID, callback: () => {} });
  googleTokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GDRIVE_CLIENT_ID,
    scope: GDRIVE_SCOPES,
    prompt: "",
    callback: () => {}
  });
  gisInited = true;
});

async function ensureDriveAuth() {
  if (!gapiInited || !gisInited) throw new Error("Google APIs not ready yet");
  if (!gapi.client.getToken()) {
    await new Promise((resolve, reject) => {
      googleTokenClient.callback = (resp) => resp.error ? reject(resp) : resolve(resp);
      googleTokenClient.requestAccessToken();
    });
  }
}

async function ensureCozyFile() {
  if (driveFileId) return driveFileId;
  await ensureDriveAuth();
  const listRes = await gapi.client.drive.files.list({
    spaces: "appDataFolder",
    q: "name = 'cozy-korean.json' and trashed = false",
    fields: "files(id,name)"
  });
  if (listRes.result.files?.length) {
    driveFileId = listRes.result.files[0].id;
    return driveFileId;
  }
  const createRes = await gapi.client.drive.files.create({
    resource: { name: "cozy-korean.json", parents: ["appDataFolder"] },
    media: { mimeType: "application/json", body: JSON.stringify({ createdAt: new Date().toISOString() }) },
    fields: "id"
  });
  driveFileId = createRes.result.id;
  return driveFileId;
}

async function driveSaveState(stateObj) {
  const fileId = await ensureCozyFile();
  await ensureDriveAuth();
  await gapi.client.request({
    path: `/upload/drive/v3/files/${fileId}`,
    method: "PATCH",
    params: { uploadType: "media" },
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stateObj)
  });
  return true;
}

async function driveLoadState() {
  const fileId = await ensureCozyFile();
  await ensureDriveAuth();
  const res = await gapi.client.drive.files.get({ fileId, alt: "media" });
  const data = typeof res.body === "string" ? JSON.parse(res.body) : (res.result || res);
  return data || {};
}

function driveSignOut() {
  const token = gapi.client.getToken();
  if (token) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
  }
  driveFileId = null;
}

// 메인탭 active 표시용
function setActiveTabUI(containerEl, activeTab) {
  const tabs = containerEl.querySelectorAll(".tab");
  tabs.forEach(t => {
    const isActive = t.textContent.trim() === activeTab;
    t.classList.toggle("active", isActive);
  });
}

// renderer.js 최상단 DOMContentLoaded 근처에 추가
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then(granted => {
    console.log(granted ? "Persistent storage granted" : "Persistent storage not granted");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // 기존 로컬스토리지 데이터 읽기
  const savedName = localStorage.getItem("username");
  const savedLevel = localStorage.getItem("level");

  // 첫 방문: 로컬에 이름이 없으면 곧바로 이름 입력 화면으로
if (!savedName) {
  renderNameInput();
  return;
}

  // 2) ★ 새 세션이면: 이전 state 무시하고 타이틀 보여주기
  if (isNewSession) {
    const titleStartBtn = document.getElementById("startBtn");
    const titleJoinBtn = document.getElementById("joinBtn");

    // Start 눌렀을 때, 사용자 진행상태에 따라 다음 화면
    if (titleStartBtn) titleStartBtn.addEventListener("click", () => {
      if (savedName && savedLevel) return showMainAppScreen();
      if (savedName && !savedLevel) return showLevelSelection();
      return renderNameInput();
    });
    if (titleJoinBtn) titleJoinBtn.addEventListener("click", showMembershipPage);

    saveAppState("title"); // 현재 화면 기록
    return; // ← 중요: 복원 로직으로 내려가지 않게
  }

  const state = loadAppState();
  // 1) 상태가 있으면 우선 복원
  if (state.page) {
    switch (state.page) {
        case "myCornerPanel":
        openMyCornerPanel();
        return;
      case "mainLearning":
        showMainLearningScreen((state.tab || "Home"));
        return;
      case "mainApp":
        showMainAppScreen();
        return;
      case "levelSelection":
        showLevelSelection();
        return;
      case "membershipCompare":
        showMembershipPage();
        return;
      case "membershipPayment":
        showMembershipPaymentPage();
        return;
      case "placementIntro":
        showPlacementIntro();
        return;
      case "placementTest":
        // 진행 중이던 테스트 복원
        startPlacementTest(state.testState || null); 
        return;
      case "placementResult":
        showPlacementResult(state.recommendedLevel || "A1");
        return;
      case "nameInput":
        renderNameInput();
        return;
      case "title": {
  const titleStartBtn = document.getElementById("startBtn");
  const titleJoinBtn = document.getElementById("joinBtn");
  if (titleStartBtn) titleStartBtn.addEventListener("click", () => {
    if (savedName && savedLevel) return showMainAppScreen();
    if (savedName && !savedLevel) return showLevelSelection();
    return renderNameInput();
  });
if (titleJoinBtn) titleJoinBtn.addEventListener("click", showMembershipPage);
return;
  }
}
  }

// 2) 상태 없으면 기존 로직 + 현재 페이지 상태 저장
if (savedName && savedLevel) {
    const titleStartBtn = document.getElementById("startBtn");
    const titleJoinBtn = document.getElementById("joinBtn");
    if (titleStartBtn) titleStartBtn.addEventListener("click", () => { showMainLearningScreen(); });
    if (titleJoinBtn) titleJoinBtn.addEventListener("click", showMembershipPage);
    saveAppState("title");
    return;
  }

  if (savedName && !savedLevel) {
    showLevelSelection();
  } else {
    renderNameInput();
  }
});

function renderNameInput() {
  saveAppState("nameInput");
  const frameBox = document.querySelector(".frame-box");
  clearMembershipFrame();
  frameBox.innerHTML = `
    <h2>A Guide<br>to Becoming<br>a Lost Soul in Seoul</h2>
    <p class="description">Welcome, wanderer. This app is your cozy guide to learning Korean.</p>
    <input type="text" id="username" name="username" placeholder="Enter your name" />
    <div class="buttons">
      <button class="btn" id="startBtn">Start Learning</button>
      <button class="btn secondary" id="joinBtn">Join Our Secret Society</button>
    </div>
    <p class="credit">Made by Sooya with 💖</p>
  `;

  document.getElementById("startBtn").addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    if (!username) {
      alert("Please enter your name!");
    } else {
      localStorage.setItem("username", username);
      localStorage.setItem("firstVisit", "true");
      showLevelSelection();
    }
  });

  document.getElementById("joinBtn").addEventListener("click", showMembershipPage);
  mountButterflies();
}

function showLevelSelection() {
  saveAppState("levelSelection");
  const frameBox = document.querySelector(".frame-box");
  const username = localStorage.getItem("username");

  frameBox.innerHTML = `
    <h2 class="choose-level">Choose Your Level</h2>
    <p class="description">Hi ${username}! Let's begin where you're comfortable.</p>
    <div class="level-buttons">
      ${["A0", "A1", "A2", "B1", "B2", "C1"].map(level => `<button class="btn level">${level}</button>`).join("")}
    </div>
    <p class="beginner">Please choose A0 if you're a complete beginner without any Korean knowledge.</p>
    <button class="btn test">Would you like to take a placement test?</button>
  `;

  document.querySelectorAll(".btn.level").forEach(button => {
    button.addEventListener("click", () => {
      localStorage.setItem("level", button.textContent);
      showMainAppScreen();
    });
  });
}

function showMainAppScreen() {
  saveAppState("mainApp");
  const frameBox = document.querySelector(".frame-box");
  const name = localStorage.getItem("username");
  const level = localStorage.getItem("level");

  frameBox.innerHTML = `
    <h2 class="welcome">Welcome, ${name}!</h2>
    <p class="description">You're currently studying at <strong>Level ${level}</strong>.</p>
    <div class="buttons" style="margin-top: 2rem;">
      <button class="btn">Start Learning</button>
      <button class="btn secondary change-level">Change Level</button>
    </div>
  `;

  document.querySelector(".btn").addEventListener("click", () => showMainLearningScreen("Home"));
  document.querySelector(".change-level").addEventListener("click", () => {
    localStorage.removeItem("level");
    localStorage.setItem("firstVisit", "true");
    showLevelSelection();
  });
}

function showMainLearningScreen(initialTab = "Home") {
  if (typeof initialTab !== "string") initialTab = "Home";
  saveAppState("mainLearning", { tab: initialTab });
  // 탭 바 생성
  const tabBarWrapper = document.createElement("div");
  tabBarWrapper.classList.add("tab-bar-wrapper");
  tabBarWrapper.innerHTML = `
    <div class="tab-bar">
      <div class="tab-group">
        <div class="tab active">Home</div>
        <div class="tab">Reading</div>
        <div class="tab">Listening</div>
        <div class="tab">Writing</div>
        <div class="tab">Speaking</div>
        <div class="tab">Grammar+</div>
        <div class="tab">Vocabulary+</div>
      </div>
     <button class="my-corner">My Corner</button>
    </div>
  `;

  // frame-box 생성
  const frameBox = document.createElement("div");
  frameBox.classList.add("main-screen");
  frameBox.innerHTML = `
    <div class="main-header">
    </div>
      
    <div class="tab-content" id="tabContent"></div>
  `;

  // 3. 둘을 감싸는 그룹 만들기
  const tabAndFrameContainer = document.createElement("div");
  tabAndFrameContainer.classList.add("tab-and-frame-container");
  tabAndFrameContainer.appendChild(tabBarWrapper);
  tabAndFrameContainer.appendChild(frameBox);

  // 4. background에 붙이기
  const background = document.querySelector(".background");
  background.innerHTML = "";
  background.appendChild(tabAndFrameContainer);

  // 탭 클릭 이벤트
  const tabs = tabBarWrapper.querySelectorAll(".tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      saveAppState("mainLearning", { tab: tab.textContent.trim() });
      updateTabContent(tab.textContent.trim());
    });
  });

  // My Corner → 같은 프레임(#tabContent)에 세팅 화면 렌더
const myCornerBtn = tabBarWrapper.querySelector(".my-corner");
if (myCornerBtn) {
  myCornerBtn.addEventListener("click", () => {
    const prevTab = (loadAppState().tab) || "Home"; // 현재 탭 기억
    saveAppState("myCornerPanel", { lastTab: prevTab });
    openMyCornerPanel(); // 같은 프레임에 패널 렌더
  });
}

  // 저장된 탭 반영
  setActiveTabUI(tabBarWrapper, initialTab);
  updateTabContent(initialTab);
}

function updateTabContent(tab) {
  saveAppState("mainLearning", { tab });
  const state = loadAppState();
  const tabContent = document.getElementById("tabContent");
  const level = localStorage.getItem("level");
  const username = localStorage.getItem("username");
  const weeklyMessage = "📣 Weekly News: You can now unlock Cozy Study Corner items with quiz streaks!";

   const cheerUps = [
    "<span class='korean ko-first'>평생소원이 누룽지🍚</span><br>A lifelong wish as humble as scorched rice.",
    "<span class='korean ko-first'>열 길 물속은 알아도 한 길 사람의 속은 모른다🧠</span><br>You may fathom deep water, but never a person's mind.",
    "<span class='korean ko-first'>토끼 입에 콩가루 먹은 것 같다🐇</span><br>Someone has food traces around their mouth, like a rabbit with bean powder around its mouth.",
    "<span class='korean ko-first'>식혜 먹은 고양이 속🧋</span><br>Like a guilty cat afraid its misdeed will be found out.",
    "<span class='korean ko-first'>빌려 온 고양이같이🐈</span><br>Sitting quietly in a room full of chatter, like a borrowed cat that doesn’t quite belong.",
    "<span class='korean ko-first'>검은 고양이 눈 감은 듯🐈‍⬛</span><br>Hard to tell things apart, like trying to tell if a black cat's eyes are open or shut.",
    "<span class='korean ko-first'>구슬이 서 말이라도 꿰어야 보배다🦪</span><br>A pearl is worthless as long as it is in it's shell.",
    "<span class='korean ko-first'>서당개 삼년이면 풍월을 읊는다🐕</span><br>Everybody learns with time.",
    "<span class='korean ko-first'>고양이 달걀 굴리듯🥚</span><br>Handling something cleverly and skillfully, like a cat rolling an egg without breaking it.",
    "<span class='korean ko-first'>호랑이 굴에 가야 호랑이를 잡는다🐅</span><br>Nothing ventured, nothing gained.",
    "<span class='korean ko-first'>고양이한테 생선을 맡기다🐟</span><br>Leaving something with someone untrustworthy, like entrusting fish to a cat.",
    "<span class='korean ko-first'>개 꼬락서니 미워서 낙지 산다🐙</span><br>Doing something just because it annoys the person you dislike.",
    "<span class='korean ko-first'>고양이 쥐 생각😿</span><br>Acting as if you care for someone when you clearly don’t,<br>like a cat pretending to care about a mouse.",
    "<span class='korean ko-first'>원숭이도 나무에서 떨어진다🐒</span><br>No matter how skilled you are, you still make mistakes sometimes,<br>like a monkey falling from a tree.",
    "<span class='korean ko-first'>원숭이 달 잡기🌙</span><br>Someone overreaching beyond their means and getting harmed,<br>like a monkey drowning while reaching for the moon’s reflection.",
    "<span class='korean ko-first'>토끼가 제 방귀에 놀란다💨</span><br>Being frightened by one’s own secret misdeed, like a rabbit startled by its own fart.",
    "<span class='korean ko-first'>개구리 낯짝에 물 붓기🫗</span><br>Like water off a frog’s face.",
    "<span class='korean ko-first'>개구리 올챙이 적 생각 못 한다🐸</span><br>After success, forgetting where you came from,<br>like a frog forgetting when it was a tadpole.",
    "<span class='korean ko-first'>돼지 발톱에 봉숭아를 들인다🐷</span><br>Overdressing or decorating in a way that doesn’t suit, like dying a pig's hoof.",
    "<span class='korean ko-first'>팥죽 단지에 생쥐 달랑거리듯🥣</span><br>Keep coming back again and again, like a mouse dangling around a jar of red bean porridge.",
    "<span class='korean ko-first'>생쥐 소금 먹듯 한다🧂</span><br>Tasting a little, without really eating much, like a mouse nibbling at salt.",
    "<span class='korean ko-first'>하룻강아지 범 무서운 줄 모른다🐯</span><br>Ignorance makes one bold, like a one-day-old puppy that doesn't know to fear the tiger.",
    "<span class='korean ko-first'>작은 절에 고양이가 두 마리라🐾</span><br>Too many for the place, more than needed,<br>like two cats living in a small temple where there’s hardly any food.",
    "<span class='korean ko-first'>똥 묻은 개가 겨 묻은 개 나무란다💩</span><br>Someone with a bigger flaw criticizes another for a much smaller one,<br>like a dog with dung on it scolding a dog with chaff on it.",
    "<span class='korean ko-first'>꽃 본 나비 불을 헤아리랴🦋</span><br>When love runs deep, a man and woman will risk even death to be together,<br>like butterflies that has spotted a flower.",
    "<span class='korean ko-first'>꿀도 약이라면 쓰다🍯</span><br>Even sweet words sound unpleasant when they’re admonitions directed at oneself,<br>like honey that tastes bitter when it's used as medicine.",
    "<span class='korean ko-first'>미운 놈 떡 하나 더 준다🍡</span><br>Treat someone you dislike better, so you won't suffer consequences.",
    "<span class='korean ko-first'>향기가 있는 꽃은 가시 돋친 나무에 핀다🌹</span><br>A fragrant flower blooms on a thorny tree, so value the substance, not the appearance.",
    "<span class='korean ko-first'>사촌이 땅을 사면 배가 아프다🫃</span><br>When a cousin buys land, your stomach aches. Another’s gain becomes your pain.",
    "<span class='korean ko-first'>빈대 잡으려고 초가삼간 태운다🛖</span><br>Burning down the house to kill a bedbug.",
  ];

  const randomMessage = cheerUps[Math.floor(Math.random() * cheerUps.length)].replace("[username]", username);

  if (tab === "Home") {
    tabContent.innerHTML = `
      <div class="main-header-flex">
        <div class="level-indicator">Level ${localStorage.getItem("level")}</div>
        <h2 class="hi">{ <span class="korean">반가워요</span>, ${username}! }</h2>
      </div>
      <p class="cheer-message">${randomMessage}</p>
      <div class="weekly-banner">${weeklyMessage}</div>
    `;
  } else if (["Reading", "Listening", "Writing", "Speaking"].includes(tab)) {
    tabContent.innerHTML = `
      <div class="learning-frame" style="display: flex; gap: 2rem;">
        <div class="main-section" style="flex: 2;">
          ${getLevelSpecificContent(tab, level)}
        </div>
        <div class="dict-column">
          <h3>📚 KRDict Quick Search</h3>
          <div class="dict-input-wrapper">
            <input class="input-row" id="krdictSearch" type="text" placeholder="Search a word..." />
            <button id="krdictGo" class="input-button input-row">🔍</button>
            <p>
              🔸 The word you enter will open in a new window<br>
              on the <strong>KRDict</strong> website.<br>
              🔸 This feature uses text-based content from
              <a href="https://krdict.korean.go.kr" target="_blank">KRDict</a><br>
              🔸 © National Institute of Korean Language<br>
              🔸 Licensed under <strong>CC BY-SA 2.0 KR</strong>
            </p>
          </div>
        </div>
      </div>
    `;

   setTimeout(() => {
    const input = document.getElementById("krdictSearch");
    const btn = document.getElementById("krdictGo");

    if (!input || !btn) return;

    const openKRDictExternal = (rawTerm) => {
      const term = (rawTerm || "").trim();
      if (!term) return;

      const url = `https://krdict.korean.go.kr/eng/dicMarinerSearch/search?nation=eng&nationCode=6&ParaWordNo=&mainSearchWord=${encodeURIComponent(term)}`;
      window.open(url, "_blank", "noopener");
    };

    const go = () => openKRDictExternal(input.value);

    btn.addEventListener("click", go);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") go();
    });
  }, 0);

  } else if (tab === "Grammar+") {
  tabContent.innerHTML = `
    <div class="learning-frame" style="display: flex;">
      <div class="main-section" style="flex: 1;">
        ${getLevelSpecificContent(tab, level)}
      </div>
    </div>
  `;
}
  else if (tab === "Vocabulary+") {
    tabContent.innerHTML = `
    <div class="learning-frame" style="display: flex;">
      <div class="main-section" style="flex: 1;">
        ${getLevelSpecificContent(tab, level)}
      </div>
    </div>
  `;
  }
}

function getLevelSpecificContent(section, level) {
  return `
    <p><strong>${section} - Level ${level}</strong></p>
    <p style="margin-top: 1rem;">📝 Content for ${section} at ${level} level coming soon...</p>
  `;
}

// 멤버십 비교 페이지
function showMembershipPage() {
  saveAppState("membershipCompare");
  const frameBox = document.querySelector(".frame-box");
  frameBox.classList.add("membership-frame");
  frameBox.innerHTML = `
    <div class="membership-comparison">
      <div class="column mem-col">
        <h3>🌿 Free Version</h3>
        <ul>
          <li>🌱 Basic grammar tips in each lesson</li>
          <li>🌱 Unlock a few Cozy Corner items by completing levels or quizzes</li>
          <li>🌱 Limited customizations through achievements</li>
          <li>🌱 No access to Korean proverbs or idioms</li>
        </ul>
      </div>
      <div class="column mem-col">
        <h3>🌸 Membership</h3>
        <ul>
          <li>📘 Full grammar explanations with examples by level</li>
          <li>🔤 Full vocabulary lists by level</li>
          <li>🏡 Full My Corner experience with exclusive items</li>
          <li>🪷 Explore proverbs, idioms & a little bit of Hanja</li>
        </ul>
      </div>
    </div>
    <div class="join-now-wrapper">
      <img src="joinnow.png" alt="Join Now Arrows" class="join-decor" />
      <button class="btn highlight">Join Now</button>
    </div>
    <div class="buttons" style="margin-top: 0;">
      <button class="btn secondary small-go memgb">Go Back</button>
    </div>
  `;

   document.querySelector('.small-go').addEventListener('click', () => {
    const name = localStorage.getItem("username");
    const level = localStorage.getItem("level");
    if (level) return showMainAppScreen();
    if (name) return showLevelSelection();
    return renderNameInput();
  });

  document.querySelector('.highlight').addEventListener('click', () => {
    showMembershipPaymentPage();
  });
}

function clearMembershipFrame() {
  document.querySelector(".frame-box")?.classList.remove("membership-frame");
}

function showMembershipPaymentPage() {
  saveAppState("membershipPayment");
  const frameBox = document.querySelector(".frame-box");
  clearMembershipFrame();
  frameBox.innerHTML = `
    <h2 class="c-p">Choose Your Plan</h2>
    <p class="description">Select your membership plan and payment method💖</p>

    <div class="plan-options">
      <label><input type="radio" name="plan" value="monthly" checked /> $4.99 / month</label><br/>
      <label><input type="radio" name="plan" value="yearly" /> $39.99 / year</label>
    </div>

    <div class="payment-options" style="margin-top: 1.5rem;">
      <button class="btn" id="payWithCard">Pay with Card</button>
      <button class="btn secondary" id="payWithPaypal">Pay with PayPal</button>
    </div>

    <div class="buttons" style="margin-top: 2rem;">
      <button class="btn secondary small-go">Go Back</button>
    </div>
  `;

  document.querySelector(".small-go").addEventListener("click", showMembershipPage);

  document.getElementById("payWithCard").addEventListener("click", () => {
    alert("Card payments are not set up yet. Please use PayPal for now 🙏");
  });

  document.getElementById("payWithPaypal").addEventListener("click", () => {
    const selectedPlan = document.querySelector('input[name="plan"]:checked').value;
    const paypalURL = selectedPlan === "monthly"
      ? ""
      : "";

    window.open(paypalURL, "_blank");
  });
}

function showPlacementIntro() {
  saveAppState("placementIntro");
  const frameBox = document.querySelector(".frame-box");
  frameBox.innerHTML = `
    <h2 class="p-t">Placement Test</h2>
    <p class="description">We'll help you find your perfect starting level.<br>
    The questions will get harder as you go. If it gets too tricky, don't worry.<br>We'll stop and recommend the best level for you.</p>
    <div class="buttons place-b">
      <button class="btn" id="startPlacementBtn">Start Test</button>
      <button class="btn secondary other-gb">Go Back</button>
    </div>
  `;

  document.querySelector(".other-gb").addEventListener("click", showLevelSelection);
  document.getElementById("startPlacementBtn").addEventListener("click", () => {
    startPlacementTest();
  });
}

const PL_LEVELS = ["A0", "A1", "A2", "B1", "B2", "C1"];

function startPlacementTest(restoredState = null) {
  saveAppState("placementTest", { testState: restoredState || null });
  const frameBox = document.querySelector(".frame-box");

  const testState = restoredState || {
    currentLevelIndex: 0,
    correctCount: 0,
    questionIndex: 0,
    globalIndex: 0
  };

  // 임시 질문 (나중에 문제 DB 추가 예정)
  const questions = {
    A1: [
      { question: "Choose the grammatically correct sentence.", options: ["<span class='korean'>저는 학교에 가요</span>", "<span class='korean'>학교에 가요 저는</span>", "<span class='korean'>가요 저는 학교에</span>", "<span class='korean'>학교 가요 저는에</span>"], answer: 0 },
      { question: "What does “<span class='korean ko-size'>학교에 가요</span>” mean?", options: ["I study at school", "I go to school", "I come back from school", "I like school"], answer: 1 },
      { question: "Choose the grammatically correct sentence.", options: ["<span class='korean'>학생은 책을 있어요</span>", "<span class='korean'>집은 사람 없어요</span>", "<span class='korean'>저는 회사에 일해요</span>", "<span class='korean'>저는 도서관에 있어요</span>"], answer: 3 },
      { question: "Answer the following question: “<span class='korean ko-size'>이게 뭐예요</span>?”", options: ["<span class='korean'>책이에요</span>", "<span class='korean'>감사합니다</span>", "<span class='korean'>네, 맞아요</span>", "<span class='korean'>괜찮아요</span>"], answer: 0 },
      { question: "How do you say “I want to watch a movie”?", options: ["<span class='korean'>영화를 봐요</span>", "<span class='korean'>영화 보고 싶어요</span>", "<span class='korean'>영화 봤어요</span>", "<span class='korean'>영화 볼 거예요</span>"], answer: 1 },
      { question: "What is the intention of the following sentence:<br>“<span class='korean ko-size'>주스 두 잔 주세요</span>”", options: ["Inviting", "Complimenting", "Ordering", "Apologizing"], answer: 2 }
    ],
    A2: [ {question: "Which sentence means “It’s good but expensive”?", options: ["<span class='korean'>좋지만 비싸요</span>", "<span class='korean'>좋아서 비싸요</span>", "<span class='korean'>좋으면 비싸요</span>", "<span class='korean'>좋고 비싸요</span>"], answer: 0},
          {question: "Choose the word that means “Tuesday.”", options: ["<span class='korean'>금요일</span>", "<span class='korean'>화요일</span>", "<span class='korean'>목요일</span>", "<span class='korean'>월요일</span>"], answer: 1},
          {question: "Choose the sentence with the correct past tense form.", options: ["<span class='korean'>운동했어요</span>", "<span class='korean'>운동하고 있어요</span>", "<span class='korean'>운동해요</span>", "<span class='korean'>운동할 거예요</span>"], answer: 0},
          {question: "Which phrase means “the person who dances/who is dancing”?", options: ["<span class='korean'>춤을 추고 사람</span>", "<span class='korean'>춤을 춰 사람</span>", "<span class='korean'>춤을 추는 사람</span>", "<span class='korean'>춤을 출 사람</span>"], answer: 2},
          {question: "What is the meaning of “<span class='korean ko-size'>가지 마세요</span>”?", options: ["I'm going", "Please go", "You have to go", "Don't go"], answer: 3},
          {question: "What does “<span class='korean ko-size'>공부해야 해요</span>” mean?", options: ["I have to study", "I plan to study", "I am studying", "I want to study"], answer: 0},
    ], 
    B1: [ {question: "What does “<span class='korean ko-size'>한국에 가 본 적 있어요</span>” mean?", options: ["I want to go to Korea", "I often go to Korea", "I’ve been to Korea", "I will go to Korea"], answer: 2},
          {question: "Choose the sentence that expresses intention.", options: ["<span class='korean'>먹으려고 해요</span>", "<span class='korean'>먹는 중이에요</span>", "<span class='korean'>먹고 있어요</span>", "<span class='korean'>먹었어요</span>"], answer: 0},
          {question: "What does “<span class='korean ko-size'>운동할 때 음악을 들어요</span>” mean?", options: ["I listen to music before exercising", "I want to exercise and listen to music", "I exercise after I listen to music", "I listen to music when I exercise"], answer: 3},
          {question: "What does “<span class='korean ko-size'>한국어를 공부하게 되었어요</span>” imply?", options: ["I want to study Korean", "I studied Korean before", "I ended up studying Korean", "I can study Korean"], answer: 2},
          {question: "How would you say 'Because I was tired, I slept' in Korean?", options: ["<span class='korean'>피곤한 다음에 잤어요</span>", "<span class='korean'>피곤하기 때문에 잤어요</span>", "<span class='korean'>피곤할 때 잤어요</span>", "<span class='korean'>피곤하지만 잤어요</span>"], answer: 1},
          {question: "How do you read “<span class='korean ko-size'>7시 26분</span>” in Korean?", options: ["<span class='korean'>칠시 이십육분</span>", "<span class='korean'>일곱시 스물여섯분</span>", "<span class='korean'>일곱시 이십육분</span>", "<span class='korean'>칠시 스물여섯분</span>"], answer: 1},
    ],
    B2: [ {question: "Which sentence uses a passive verb?", options: ["<span class='korean'>문을 열었어요</span>", "<span class='korean'>문이 열렸어요</span>", "<span class='korean'>문을 열게 했어요</span>", "<span class='korean'>문을 열어버렸어요</span>"], answer: 1},
          {question: "What does “<span class='korean ko-size'>비가 오나 봐요</span>” express?", options: ["I hope it rains", "It will rain", "I guess it’s raining", "I see the rain coming"], answer: 2},
          {question: "Choose the sentence that means<br>“I called you as soon as I arrived.”", options: ["<span class='korean'>도착하자마자 전화했어요</span>", "<span class='korean'>도착하느라고 전화했어요</span>", "<span class='korean'>도착하고 나서 전화했어요</span>", "<span class='korean'>전화했더니 도착했어요</span>"], answer: 0},
          {question: "What does “<span class='korean ko-size'>이 책은 읽을 만해요</span>” mean?", options: ["This book is readable", "This book is difficult to read", "This book is easy to read", "This book is not worth reading"], answer: 0},
          {question: "Which of the following uses indirect quotation correctly?", options: ["<span class='korean'>그는 내일 오나 봐요</span>", "<span class='korean'>그는 내일 올 거예요</span>", "<span class='korean'>그는 내일 오기는 해요</span>", "<span class='korean'>그는 내일 온다고 했어요</span>"], answer: 3},
          {question: "Which sentence uses honorific form correctly?", options: ["<span class='korean'>선생님께서 밥을 먹어요</span>", "<span class='korean'>사장님께서 회사에 있어요</span>", "<span class='korean'>할머니께서 주무세요</span>", "<span class='korean'>아버지께서 말해요</span>"], answer: 2}
    ],
    C1: [ {question: "What does “<span class='korean ko-size'>사람은 누구나 실수하기 마련이에요</span>” mean?", options: ["Everyone always tries not to make mistakes", "Everyone is bound to make mistakes", "Everyone never makes mistakes", "Everyone easily makes mistakes"], answer: 1},
          {question: "What is the meaning of “<span class='korean ko-size'>그는 지금쯤 도착했을지도 몰라요</span>”?", options: ["He has definitely arrived by now", "He is probably arriving soon", "He might have arrived by now", "He won’t arrive"], answer: 2},
          {question: "Which sentence expresses regret or unintended consequence?", options: ["<span class='korean'>울게 됐어요</span>", "<span class='korean'>울기 마련이에요</span>", "<span class='korean'>울었을지도 몰라요</span>", "<span class='korean'>울고 말았어요</span>"], answer: 3},
          {question: "What is the meaning of “<span class='korean ko-size'>납득하다</span>”?", options: ["To insist strongly", "To persuade others", "To understand and accept", "To argue against"], answer: 2},
          {question: "Choose a word to fill in the blank:<br><span class='korean ko-size'>상대방의 입장을 고려하지 않는 발언은 오히려 갈등을 _______ 수 있다.</span>", options: ["<span class='korean'>야기할</span>", "<span class='korean'>회피할</span>", "<span class='korean'>완화할</span>", "<span class='korean'>강조할</span>"], answer: 0},
          {question: "Which sentence sounds the most semantically natural?", options: ["<span class='korean'>그는 밥을 먹기는 커녕 두 그릇이나 비웠어요</span>", "<span class='korean'>그는 졸업하다시피 공부를 시작했다</span>", "<span class='korean'>좀 더 일찍 도착했더라면 비행기를 놓쳤을 거예요</span>", "<span class='korean'>그렇게 눈치 보면서 일하느니 차라리 다른 직장을 구하는 게 낫겠어요</span>"], answer: 3}
    ],
  };

  runPlacementStep(testState, PL_LEVELS, questions);
}

function runPlacementStep(state, levels, questions) {
  saveAppState("placementTest", { testState: { ...state } });
  const level = levels[state.currentLevelIndex];
  const currentQuestionSet = questions[level];
  const frameBox = document.querySelector(".frame-box");

  // 테스트 종료 조건
if (!currentQuestionSet || state.questionIndex >= currentQuestionSet.length) {
  const passed = state.correctCount >= 4; // 4개 이상 맞춰야 다음 레벨로
  if (passed && state.currentLevelIndex < levels.length - 1) {
    // 다음 레벨로
    state.currentLevelIndex++;
    state.correctCount = 0;
    state.questionIndex = 0;
    return runPlacementStep(state, levels, questions); // ★ 여기에 return 추가
  } else {
    // 종료 → 결과 보여주기
    const recommendedLevel = passed ? levels[state.currentLevelIndex] : levels[state.currentLevelIndex - 1] || "A1";
    showPlacementResult(recommendedLevel);
    return;
  }
}

  // 현재 질문 출력
  const q = currentQuestionSet[state.questionIndex];
  frameBox.innerHTML = `
  <div class="question-p">
    <h2 class="question-number">Question ${state.globalIndex + 1}</h2>
    <p class="question-text">${q.question}</p>
    <div class="level-buttons">
      ${q.options.map((opt, i) => `<button class="btn option" data-index="${i}">${opt}</button>`).join("")}
    </div>
  </div>
  `;

  document.querySelectorAll(".option").forEach(btn => {
    btn.addEventListener("click", () => {
      const selected = Number(btn.getAttribute("data-index"));
      if (selected === q.answer) state.correctCount++;
      state.questionIndex++;
      state.globalIndex++;
      runPlacementStep(state, levels, questions);
    });
  });
}

function showPlacementResult(level) {
  saveAppState("placementResult", { recommendedLevel: level });
  const frameBox = document.querySelector(".frame-box");
  frameBox.innerHTML = `
    <h2 class="lvl-h">Your Level is ${level}🎉</h2>
    <p class="description lvl-re">We recommend you start at <strong>${level}</strong> level. Let’s begin your journey!</p>
    <div class="buttons">
      <button class="btn" id="startAtLevel">Start at this level</button>
    </div>
  `;

  document.getElementById("startAtLevel").addEventListener("click", () => {
    localStorage.setItem("level", level);
    showMainAppScreen();
  });
}

document.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("test")) {
    showPlacementIntro();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("starCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let stars = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars(60);
  }

  function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 4 + 4,
        opacity: Math.random(),
        speed: Math.random() * 0.015 + 0.005,
        direction: Math.random() > 0.5 ? 1 : -1,
      });
    }
  }

  function drawStar(star) {
    ctx.save();
    ctx.globalAlpha = star.opacity;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(star.x - star.r, star.y);
    ctx.lineTo(star.x + star.r, star.y);
    ctx.moveTo(star.x, star.y - star.r);
    ctx.lineTo(star.x, star.y + star.r);
    ctx.stroke();

    ctx.restore();
  }

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      star.opacity += star.speed * star.direction;
      if (star.opacity >= 1 || star.opacity <= 0) {
        star.direction *= -1;
      }
      drawStar(star);
    });
    requestAnimationFrame(animateStars);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  animateStars();
});

function mountButterflies() {
  const frame = document.querySelector('.frame-box');
  if (!frame) return;

  // 중복 생성 방지: frame-box 안만 확인
  if (frame.querySelector('.butterfly-wrapper')) return;

  const left = document.createElement('div');
  left.className = 'butterfly-wrapper';
  left.innerHTML = '<div class="butterfly"></div>';

  const right = document.createElement('div');
  right.className = 'butterfly-wrapper right';
  right.innerHTML = '<div class="butterfly right"></div>';

  frame.appendChild(left);
  frame.appendChild(right);
}

// --- 상태 저장용 유틸 ---
function saveAppState(page, extra = {}) {
  localStorage.setItem("appState", JSON.stringify({ page, ...extra }));
}

function loadAppState() {
  try {
    return JSON.parse(localStorage.getItem("appState")) || {};
  } catch {
    return {};
  }
}

function openMyCornerPanel() {
  const tabContent = document.getElementById("tabContent");
  if (!tabContent) return;

  tabContent.innerHTML = `
    <div class="main-header-flex">
      <div class="level-indicator">Level ${localStorage.getItem("level")}</div>
      <h2 class="hi">My Corner — Sync</h2>
    </div>
    <p class="description">Save and load your data, using Google Drive</p>

    <div class="buttons" style="margin-top:1rem;">
      <button class="btn" id="driveSave">Save to Google Drive</button>
      <button class="btn secondary" id="driveLoad">Load from Google Drive</button>
      <button class="btn" id="driveDisconnect">Disconnect</button>
    </div>
  `;

  // 핸들러들
  document.getElementById("driveSave")?.addEventListener("click", async () => {
    try {
      const payload = {
        username: localStorage.getItem("username"),
        level: localStorage.getItem("level"),
        appState: JSON.parse(localStorage.getItem("appState") || "{}"),
        updatedAt: new Date().toISOString()
      };
      await driveSaveState(payload);
      alert("Saved successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to save due to an error!");
    }
  });

  document.getElementById("driveLoad")?.addEventListener("click", async () => {
    try {
      const data = await driveLoadState();
      if (data.username) localStorage.setItem("username", data.username);
      if (data.level) localStorage.setItem("level", data.level);
      if (data.appState) localStorage.setItem("appState", JSON.stringify(data.appState));
      alert("Loaded successfully!");
      const name = localStorage.getItem("username");
      const level = localStorage.getItem("level");
      if (level) return showMainAppScreen();
      if (name) return showLevelSelection();
      return renderNameInput();
    } catch (e) {
      console.error(e);
      alert("Failed to load due to an error!");
    }
  });

  document.getElementById("driveDisconnect")?.addEventListener("click", () => {
    driveSignOut();
    alert("Disconnected from Google!");
  });

  document.getElementById("backToHome")?.addEventListener("click", () => {
    // 현재 저장된 탭으로 복귀
    const s = (loadAppState().tab) || "Home";
    updateTabContent(s);
  });
}
