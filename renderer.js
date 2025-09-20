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
    await gapi.client.init({
  discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
});
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

async function ensureDriveAuth(forceConsent = false) {
  if (!gapiInited || !gisInited) throw new Error("Google APIs not ready");
  const token = gapi.client.getToken();
  if (!token || forceConsent) {
    await new Promise((resolve, reject) => {
      googleTokenClient.callback = (resp) => resp?.error ? reject(resp) : resolve(resp);
      googleTokenClient.requestAccessToken({ prompt: "consent" });
      driveFileId = null; // ★ 계정/스코프 바뀌면 다시 찾게
    });
    driveFileId = null; // ★ 계정/스코프 바뀌면 다시 찾게
  }
}

async function ensureCozyFile() {
  if (driveFileId) return driveFileId;
  await ensureDriveAuth();
  const list = await gapi.client.drive.files.list({
  spaces: "appDataFolder",
  q: "name = 'cozy-korean.json' and trashed = false",
  fields: "files(id,name)"
  });
  if (list.result.files?.length) {
    driveFileId = list.result.files[0].id;
    return driveFileId;
  }
  const boundary = "foo_bar_baz";
  const metadata = { name: "cozy-korean.json", parents: ["appDataFolder"] };
  const data = { createdAt: new Date().toISOString() };
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify(metadata) +
    `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n` +   
    JSON.stringify(data) + 
    `\r\n--${boundary}--`;
  const createRes = await gapi.client.request({
    path: "/upload/drive/v3/files",
    method: "POST",
    params: { uploadType: "multipart" },
    headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
    body
  });
  driveFileId = createRes.result?.id || (createRes.body && JSON.parse(createRes.body).id);
  return driveFileId;
}

async function driveSaveState(stateObj) {
  await ensureDriveAuth();
  if (!driveFileId) await ensureCozyFile();

  try {
    return await gapi.client.request({
      path: `/upload/drive/v3/files/${driveFileId}`,
      method: "PATCH",
      params: { uploadType: "media" },
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stateObj)
    });
  } catch (e) {
    // ★ 권한/소유 안 맞을 때 재생성 후 1회 재시도
    const msg = (e?.result?.error?.message || e?.status || "").toString().toLowerCase();
    if (msg.includes("insufficient") || msg.includes("forbidden") || e.status === 403 || e.status === 404) {
      driveFileId = null;
      await ensureCozyFile(); // appDataFolder에 새로 만듦
      return await gapi.client.request({
        path: `/upload/drive/v3/files/${driveFileId}`,
        method: "PATCH",
        params: { uploadType: "media" },
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stateObj)
      });
    }
    throw e;
  }
}

async function driveLoadState() {
  await ensureDriveAuth();
  if (!driveFileId) await ensureCozyFile();
  try {
    const res = await gapi.client.drive.files.get({ fileId: driveFileId, alt: "media" });
    return typeof res.body === "string" ? JSON.parse(res.body) : (res.result || {});
  } catch (e) {
    if (e.status === 403 || e.status === 404) {
      driveFileId = null;
      await ensureCozyFile();
      const res = await gapi.client.drive.files.get({ fileId: driveFileId, alt: "media" });
      return typeof res.body === "string" ? JSON.parse(res.body) : (res.result || {});
    }
    throw e;
  }
}

function driveSignOut() {
  const t = gapi.client.getToken();
  if (t) google.accounts.oauth2.revoke(t.access_token);
  gapi.client.setToken("");
  driveFileId = null; // ★ 캐시된 파일ID 버리기
}

// 메인탭 active 표시용
function setActiveTabUI(containerEl, activeTab) {
  const tabs = containerEl.querySelectorAll(".tab");
  tabs.forEach(t => {
    const isActive = t.textContent.trim() === activeTab;
    t.classList.toggle("active", isActive);
  });
}

if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then(granted => {
    console.log(granted ? "Persistent storage granted" : "Persistent storage not granted");
  });
}

function setScreenFlag(flag) {
  document.body.classList.toggle('screen-learning', flag === 'learning');
}

document.addEventListener("DOMContentLoaded", () => {
  // 기존 로컬스토리지 데이터 읽기
  const savedName = localStorage.getItem("username");
  const savedLevel = localStorage.getItem("level");
  const state = loadAppState(); // ★ 먼저 상태 읽기

    // A) ★ 최우선: My Corner 패널 복원 (새 세션이어도 이게 우선)
  if (state?.page === "myCornerPanel") {
    const last = state.lastTab || "Home";
    showMainLearningScreen(last); // 먼저 레이아웃 생성
    openMyCornerPanel();          // 같은 프레임에 패널 오픈
    return;
  }
  // 한글 이름이면 전역 한글 폰트 적용
  applyGlobalKoreanFontIfNeeded();

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

  // 1) 상태가 있으면 우선 복원
  if (state.page) {
    switch (state.page) {
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

function isKoreanName(str = "") {
  // 자음/모음 단독 포함까지 체크
  return /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(str);
}

function applyGlobalKoreanFontIfNeeded() {
  const name = localStorage.getItem("username") || "";
  const root = document.documentElement; // <html>
  if (isKoreanName(name)) {
    root.classList.add("korean-global");
  } else {
    root.classList.remove("korean-global");
  }
}

function renderNameInput() {
  setScreenFlag(null);
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
      applyGlobalKoreanFontIfNeeded();
      localStorage.setItem("firstVisit", "true");
      showLevelSelection();
    }

  document.getElementById("startBtn").addEventListener("click", () => {
    const username = nameInput.value.trim();
    if (!username) {
      alert("Please enter your name!");
    } else {
      localStorage.setItem("username", username);
      applyGlobalKoreanFontIfNeeded();
      localStorage.setItem("firstVisit", "true");
      showLevelSelection();
    }
  });
  });

  document.getElementById("joinBtn").addEventListener("click", showMembershipPage);
  mountButterflies();
}

function showLevelSelection() {
  setScreenFlag(null);
  saveAppState("levelSelection");
  const frameBox = document.querySelector(".frame-box");
  const username = localStorage.getItem("username");

  frameBox.innerHTML = `
    <h2 class="choose-level">Choose Your Level</h2>
    <p class="description">Hi <span class="user-name">${username}</span>! Let's begin where you're comfortable.</p>
    <div class="level-buttons">
      ${["A0", "A1", "A2", "B1", "B2", "C1"].map(level => `<button class="btn level">${level}</button>`).join("")}
    </div>
    <p class="beginner">Please choose A0 if you're a complete beginner without any Korean knowledge.</p>
    <button class="btn test">Would you like to take a placement test?</button>
  `;

const nameEl1 = frameBox.querySelector(".user-name");
if (nameEl1 && isKoreanName(username)) nameEl1.classList.add("ko");

  document.querySelectorAll(".btn.level").forEach(button => {
    button.addEventListener("click", () => {
      localStorage.setItem("level", button.textContent);
      showMainAppScreen();
    });
  });
}

function showMainAppScreen() {
  setScreenFlag(null);
  applyGlobalKoreanFontIfNeeded();
  saveAppState("mainApp");
  const frameBox = document.querySelector(".frame-box");
  const name = localStorage.getItem("username");
  const level = localStorage.getItem("level");

  frameBox.innerHTML = `
    <h2 class="welcome wlc">Welcome, <span class="user-name funny">${name}</span>!</h2>
    <p class="description">You're currently studying at <strong>Level ${level}</strong>.</p>
    <div class="buttons">
      <button class="btn wb">Start Learning</button>
      <button class="btn secondary change-level wb">Change Level</button>
    </div>
  `;

  const nameEl2 = frameBox.querySelector(".user-name");
if (nameEl2 && isKoreanName(name)) nameEl2.classList.add("ko");

  document.querySelector(".btn").addEventListener("click", () => showMainLearningScreen("Home"));
  document.querySelector(".change-level").addEventListener("click", () => {
    localStorage.removeItem("level");
    localStorage.setItem("firstVisit", "true");
    showLevelSelection();
  });
}

function showMainLearningScreen(initialTab = "Home") {
  setScreenFlag('learning');
  if (typeof initialTab !== "string") initialTab = "Home";
  saveAppState("mainLearning", { tab: initialTab });
  // 탭 바 생성
  applyGlobalKoreanFontIfNeeded();
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
    myCornerBtn.classList.add("active"); // ⬅️ 글자 볼드 on
    openMyCornerPanel(); // 같은 프레임에 패널 렌더
  });
}

  // 저장된 탭 반영
  setActiveTabUI(tabBarWrapper, initialTab);
  updateTabContent(initialTab);
}

function updateTabContent(tab) {
  document.querySelector('.my-corner')?.classList.remove('active');
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
    document.getElementById('studyNotes')?.remove();
    tabContent.innerHTML = `
      <div class="main-header-flex">
        <div class="level-indicator">Level ${localStorage.getItem("level")}</div>
        <h2 class="hi">{ <span class='korean ko-first'>반가워요</span>, <span class="user-name funny">${username}</span>! }</h2>
      </div>
      <p class="cheer-message">${randomMessage}</p>
      <div class="weekly-banner">${weeklyMessage}</div>
    `;
    
    const nameEl3 = tabContent.querySelector(".user-name");
if (nameEl3 && isKoreanName(username)) nameEl3.classList.add("ko");

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
            <p class="dict-note">
              🔸 The word you enter will open in a new window<br>
              on the <strong>KRDict</strong> website.<br>
              🔸 This feature uses text-based content from
              <a href="https://krdict.korean.go.kr" target="_blank">KRDict</a><br>
              🔸 © National Institute of Korean Language<br>
              🔸 Licensed under <strong>CC BY-SA 2.0 KR</strong>
            </p>
          </div>
          <div id="studyNotes" class="notes-box">
          <form class="notes-form">
            <textarea class="notes-input" placeholder="Write a note..." rows="1"></textarea>
            <button type="submit" class="nt-add">+</button>
          </form>
          <ul class="notes-list"></ul>
          <div class="notes-clear-bar">
            <button type="button" class="notes-clear">🗑️</button>
          </div>
        </div>
        </div>
      </div>
    `;

    if (tab === "Reading" && level === "A0") initA0Reading();

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
      <div id="studyNotes" class="notes-box">
          <form class="notes-form">
            <textarea class="notes-input" placeholder="Write a note..." rows="1"></textarea>
            <button type="submit" class="nt-add">+</button>
          </form>
          <ul class="notes-list"></ul>
          <div class="notes-clear-bar">
            <button type="button" class="notes-clear">🗑️</button>
          </div>
      </div>
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
      <div id="studyNotes" class="notes-box">
          <form class="notes-form">
            <textarea class="notes-input" placeholder="Write a note..." rows="1"></textarea>
            <button type="submit" class="nt-add">+</button>
          </form>
          <ul class="notes-list"></ul>
          <div class="notes-clear-bar">
            <button type="button" class="notes-clear">🗑️</button>
          </div>
      </div>
      </div>
    </div>
  `;
  }

if (tab !== 'Home') {
  try {
    ensureGlobalNotesMounted && ensureGlobalNotesMounted();
  } catch (e) { /* no-op */ }
}
}

function getLevelSpecificContent(section, level) {
   if (section === "Reading" && level === "A0") {
    return `
    <div id="a0-reading">
        <div class="hangul-overview">
          <p class="hg-t">Hangul</p><br/>
          <p class="hg-e">Invented in 1443 by <span class="hg-e-hl">King Sejong</span> and scholars for the instruction of the common people, Hangul was officially published in 1446.</p>
          <p class="hg-e">In modern Korean, there are 19 consonants and 21 vowels, 40 in total. 
          Consonants were designed to represent the shape of the speech organs when pronouncing them, while vowels were inspired by the concepts of heaven, earth, and human.</p>
          <p class="hg-e">The consonants and the vowels are <span class="hg-e-hl">combined to form a syllable block</span>.</p>
        </div>
        <div class="grid-style">
        <h3 class="grid-title">Consonants</h3>
        <div id="jamoConsonantGrid" class="jamo-grid" aria-label="Consonant grid"></div>
        <div id="consonantDetail" class="detail-frame hidden" aria-live="polite"></div>

        <h3 class="grid-title" style="margin-top:1.5rem;">Vowels</h3>
        <div id="jamoVowelGrid" class="jamo-grid" aria-label="Vowel grid"></div>
        <div id="vowelDetail" class="detail-frame hidden" aria-live="polite"></div>

        <div class="drill-wrap">
          <button id="openDrill" class="btn drill-btn">Open Short Reading Drill</button>
        </div>

        <div id="drillModal" class="drill-modal hidden" role="dialog" aria-modal="true" aria-labelledby="drillTitle">
          <div class="drill-panel">
            <div class="drill-head">
              <h4 id="drillTitle">A0 Reading Drill</h4>
              <button id="closeDrill" class="btn small">Close</button>
            </div>
            <p class="drill-note">Read out loud. These use only A0 letters and simple batchim.</p>
            <div id="drillList" class="drill-list"></div>
          </div>
        </div>
        </div>
      </div>
    `;
   }
    return `
    <p><strong>${section} - Level ${level}</strong></p>
    <p style="margin-top: 1rem;">📝 Content for ${section} at ${level} level coming soon...</p>
  `;
}

// 멤버십 비교 페이지
function showMembershipPage() {
  setScreenFlag(null);
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
  setScreenFlag(null);
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
  setScreenFlag(null);
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
  setScreenFlag(null);
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
  document.querySelector(".my-corner")?.classList.add("active"); //
  const tabContent = document.getElementById("tabContent");
  const level = localStorage.getItem("level");
  if (!tabContent) return;

  tabContent.innerHTML = `
    <div class="main-header-flex">
      <button class="btn change-level mls-change">Change Level</button>
      <h2 class="hi hi-crn">✨<span class="scrn">🧸<span class="user-name" id="cornerName">${localStorage.getItem("username")}</span>'s Corner🍵</span>✨</h2>
    </div>

    <div class="level-overlay hidden" id="levelOverlay">
      <div class="level-overlay-content">
        <h3>Select a New Level</h3>
        ${["A0","A1","A2","B1","B2","C1"].map(l => `<button class="btn level">${l}</button>`).join("")}
        <div class="buttons" style="margin-top:1rem;">
          <button class="btn secondary" id="closeOverlay">Cancel</button>
        </div>
      </div>
    </div>

    <div class="diary-customizer">
  <div id="diaryCanvas" class="dc-canvas">
    <!-- 배치된 요소들이 이 안에 들어감 -->
  </div>

  <!-- 모달: 프레임 선택 -->
  <div class="dc-modal hidden" id="frameModal">
    <div class="dc-modal-body">
      <h3>Choose a Frame</h3>
      <div class="dc-grid" id="frameGrid"></div>
      <button class="btn secondary" id="frameClose">Close</button>
    </div>
  </div>

  <!-- 모달: 팔레트(스티커/클립/북마크/펜/하이라이터) -->
  <div class="dc-modal hidden" id="paletteModal">
    <div class="dc-modal-body">
      <h3>Palette</h3>
      <div class="dc-tabs">
        <button class="btn small" data-tab="sticker">Sticker</button>
        <button class="btn small" data-tab="clip">Clip</button>
        <button class="btn small" data-tab="bookmark">Bookmark</button>
        <button class="btn small" data-tab="pen">Pen</button>
        <button class="btn small" data-tab="hl">Highlight</button>
      </div>
      <div class="dc-grid" id="paletteGrid"></div>
      <button class="btn secondary" id="paletteClose">Close</button>
    </div>
  </div>
  <div class="dc-toolbar">
      <button class="btn tb-btn" id="dcEditToggle">Edit</button>
      <button class="btn tb-btn" id="dcChooseFrame">Frame</button>
      <button class="btn tb-btn" id="dcPalette">Palette</button>
      <button class="btn tb-btn" id="dcSave">Save</button>
      <button class="btn tb-btn" id="dcReset">Reset</button>
  </div>
</div>

    <div class="gd-connect">
    <p class="description">Save and load your data, using Google Drive.</p>
    <div class="buttons" style="margin-top:1rem;">
      <button class="btn gd-btn" id="driveSave">Save</button>
      <button class="btn gd-btn" id="driveLoad">Load</button>
      <button class="btn gd-btn" id="driveDisconnect">Disconnect</button>
    </div>
    </div>
  `;

const cornerNameEl = tabContent.querySelector("#cornerName");
  const nm = localStorage.getItem("username") || "";
  if (cornerNameEl && isKoreanName(nm)) cornerNameEl.classList.add("ko");

// 이벤트 바인딩
  tabContent.querySelector(".change-level").addEventListener("click", () => {
    document.getElementById("levelOverlay").classList.remove("hidden");
  });
  tabContent.querySelector("#closeOverlay").addEventListener("click", () => {
    document.getElementById("levelOverlay").classList.add("hidden");
  });
  tabContent.querySelectorAll(".level-overlay .btn.level").forEach(btn => {
    btn.addEventListener("click", () => {
      localStorage.setItem("level", btn.textContent);
      document.getElementById("levelOverlay").classList.add("hidden");
      openMyCornerPanel(); // 새 레벨로 다시 렌더
    });
  });

  // 핸들러들
  document.getElementById("driveSave")?.addEventListener("click", async () => {
    try {
      await ensureDriveAuth(true);
      const payload = {
        username: localStorage.getItem("username"),
        level: localStorage.getItem("level"),
        appState: JSON.parse(localStorage.getItem("appState") || "{}"),
        updatedAt: new Date().toISOString()
      };
      await driveSaveState(payload);
      alert("Saved successfully!");
    } catch (e) {
      console.error("Drive error:", e);
      alert("Failed: " + explainError(e));
    }
  });

  document.getElementById("driveLoad")?.addEventListener("click", async () => {
    try {
      await ensureDriveAuth(true);
      const data = await driveLoadState();
      if (data.username) localStorage.setItem("username", data.username);
      if (data.level) localStorage.setItem("level", data.level);
      if (data.appState) localStorage.setItem("appState", JSON.stringify(data.appState));
      alert("Loaded successfully!");
      const name = localStorage.getItem("username");
      applyGlobalKoreanFontIfNeeded();
      const level = localStorage.getItem("level");
      if (level) return showMainAppScreen();
      if (name) return showLevelSelection();
      return renderNameInput();
    } catch (e) {
      console.error("Drive error:", e);
      alert("Failed: " + explainError(e));
    }
  });

  function explainError(e) {
  try {
    if (e?.result?.error?.message) return e.result.error.message;
    if (e?.result?.error?.errors?.[0]?.reason) return e.result.error.errors[0].reason;
    if (e?.body) { const j = JSON.parse(e.body); return j?.error?.message || e.toString(); }
    if (e?.error_description) return e.error_description;
    if (e?.error) return e.error;
    return e?.toString?.() || "Unknown error";
  } catch { return "Unknown error"; }
}

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

/************ A0 READING DATA ************/
const JAMO_CONSONANTS = [
  { ch:"ㄱ", hint:"g/k", sound:"[g] ~ [k]", place:"Velar (back of tongue)", examples:["가", "고", "기", "구", "거"], caution:"Word-final ㄱ is a held [k̚]." },
  { ch:"ㄴ", hint:"n",   sound:"[n]", place:"Alveolar (tongue tip)", examples:["나","누","니"], caution:"Before ㄹ it can nasalize—ignore at A0." },
  { ch:"ㄷ", hint:"d/t", sound:"[d] ~ [t]", place:"Alveolar stop", examples:["다","도","디"], caution:"Word-final ㄷ → [t̚]." },
  { ch:"ㄹ", hint:"r/l", sound:"[ɾ] between vowels; [l] coda", place:"Alveolar flap", examples:["라","로","리"], caution:"Not English R/L exactly—keep it light." },
  { ch:"ㅁ", hint:"m",   sound:"[m]", place:"Bilabial nasal", examples:["마","모","미"], caution:"Keep lips gently closed." },
  { ch:"ㅂ", hint:"b/p", sound:"[b] ~ [p]", place:"Bilabial stop", examples:["바","보","비"], caution:"Word-final ㅂ → held [p̚]." },
  { ch:"ㅅ", hint:"s",   sound:"[s] (≈ [ɕ] before ㅣ)", place:"Alveolar fricative", examples:["사","소","시"], caution:"시 sounds like ‘shi’ but it’s ㅅ+ㅣ." },
  { ch:"ㅇ", hint:"∅/ng", sound:"∅ initial; [ŋ] coda", place:"Null onset / velar nasal", examples:["아","오","이"], caution:"Initial ㅇ is silent; coda ㅇ is [ŋ]." },
  { ch:"ㅈ", hint:"j",   sound:"[d͡ʑ] ~ [t͡ɕ]", place:"Alveolo-palatal affricate", examples:["자","조","지"], caution:"Contrast with ㅉ (tense) and ㅊ (aspirated) by feel, not spelling." },
  { ch:"ㅊ", hint:"ch",  sound:"[t͡ɕʰ]", place:"Aspirated alveolo-palatal affricate", examples:["차","초","치"], caution:"A clear puff of air; not the same as tense ㅉ." },
  { ch:"ㅋ", hint:"k",   sound:"[kʰ]", place:"Aspirated velar stop", examples:["카","코","키"], caution:"Stronger than ㄱ; audible puff." },
  { ch:"ㅌ", hint:"t",   sound:"[tʰ]", place:"Aspirated alveolar stop", examples:["타","토","티"], caution:"Stronger than ㄷ; audible puff." },
  { ch:"ㅍ", hint:"p",   sound:"[pʰ]", place:"Aspirated bilabial stop", examples:["파","포","피"], caution:"Stronger than ㅂ; audible puff." },
  { ch:"ㅎ", hint:"h",   sound:"[h]", place:"Glottal fricative", examples:["하","호","히"], caution:"May weaken in fast speech—ignore nuances at A0." },

  // Tense (fortis) series
  { ch:"ㄲ", hint:"kk",  sound:"[k͈]", place:"Tense velar stop", examples:["까","꼬","끼"], caution:"Tense/tighter; no aspiration." },
  { ch:"ㄸ", hint:"tt",  sound:"[t͈]", place:"Tense alveolar stop", examples:["따","또","띠"], caution:"Tense; not ‘th’, no aspiration." },
  { ch:"ㅃ", hint:"pp",  sound:"[p͈]", place:"Tense bilabial stop", examples:["빠","뽀","삐"], caution:"Tense; lips firm, no puff." },
  { ch:"ㅆ", hint:"ss",  sound:"[s͈]", place:"Tense alveolar fricative", examples:["싸","쏘","씨"], caution:"Stronger ‘s’; before ㅣ it still spells ㅆ+ㅣ = 씨." },
  { ch:"ㅉ", hint:"jj",  sound:"[t͡ɕ͈]", place:"Tense alveolo-palatal affricate", examples:["짜","쪼","찌"], caution:"Tense ‘jj’; no aspiration (compare ㅊ)." }
];

const JAMO_VOWELS = [
  { ch:"ㅏ", hint:"a",  sound:"[a] (ah)", layout:"Vertical (C|V)", examples:["가","나","마"], caution:"Right short bar." },
  { ch:"ㅑ", hint:"ya", sound:"[ja]", layout:"Vertical (C|V)", examples:["야","냐","랴"], caution:"Two right ticks." },
  { ch:"ㅓ", hint:"eo", sound:"[ʌ] (uh)", layout:"Vertical (C|V)", examples:["거","너","머"], caution:"Left short bar." },
  { ch:"ㅕ", hint:"yeo",sound:"[jʌ]", layout:"Vertical (C|V)", examples:["겨","녀","려"], caution:"Two left ticks." },
  { ch:"ㅗ", hint:"o",  sound:"[o]", layout:"Horizontal (C over V)", examples:["고","노","모"], caution:"Short bar above ㅡ." },
  { ch:"ㅛ", hint:"yo", sound:"[jo]", layout:"Horizontal (C over V)", examples:["교","뇨","료"], caution:"Two ticks above." },
  { ch:"ㅜ", hint:"u",  sound:"[u]", layout:"Horizontal (C over V)", examples:["구","누","무"], caution:"Short bar below ㅡ." },
  { ch:"ㅠ", hint:"yu", sound:"[ju]", layout:"Horizontal (C over V)", examples:["규","뉴","류"], caution:"Two ticks below." },
  { ch:"ㅡ", hint:"eu", sound:"[ɯ] (unrounded u)", layout:"Horizontal (C over V)", examples:["그","느","므"], caution:"Lips spread, not rounded." },
  { ch:"ㅣ", hint:"i",  sound:"[i] (ee)", layout:"Vertical (C|V)", examples:["기","니","미"], caution:"Single vertical stroke." },
   // AE/E group
  { ch:"ㅐ", hint:"ae", sound:"[e] (eh)", layout:"Vertical (C|V)", examples:["개","내","매"], caution:"Merges with ㅔ in modern Seoul speech." },
  { ch:"ㅔ", hint:"e",  sound:"[e] (eh)", layout:"Vertical (C|V)", examples:["게","네","메"], caution:"≈ ㅐ; treat both as ‘eh’ at A0." },

  // YE/ YAE
  { ch:"ㅒ", hint:"yae", sound:"[je]", layout:"Vertical (C|V)", examples:["얘","걔","냬"], caution:"Often realized close to ㅖ; low frequency—reading focus only." },
  { ch:"ㅖ", hint:"ye",  sound:"[je]", layout:"Vertical (C|V)", examples:["예","녜","례"], caution:"Frequent word ‘예’; both ㅒ/ㅖ read ~[je] for A0." },

  // W- compounds (based on ㅗ / ㅜ)
  { ch:"ㅘ", hint:"wa",  sound:"[wa]", layout:"Horizontal (C over V)", examples:["과","놔","와"], caution:"Built from ㅗ+ㅏ; top-bottom layout." },
  { ch:"ㅙ", hint:"wae", sound:"[wɛ] ~ [we]", layout:"Horizontal (C over V)", examples:["왜","괘","쇄"], caution:"Close to ㅞ/ㅚ in modern speech; treat as ‘we/wae’." },
  { ch:"ㅚ", hint:"oe",  sound:"[we] (modern)", layout:"Horizontal (C over V)", examples:["외","괴","뇌"], caution:"Commonly ‘we’ today; spelling is ㅗ+ㅣ." },
  { ch:"ㅝ", hint:"wo",  sound:"[wʌ]", layout:"Horizontal (C over V)", examples:["워","궈","눠"], caution:"Built from ㅜ+ㅓ; top-bottom layout." },
  { ch:"ㅞ", hint:"we",  sound:"[we]", layout:"Horizontal (C over V)", examples:["웨","궤","눼"], caution:"Less common; treat as ‘we’." },
  { ch:"ㅟ", hint:"wi",  sound:"[wi]", layout:"Horizontal (C over V)", examples:["위","귀","뉘"], caution:"Rounded lips; distinct from ㅚ/ㅞ awareness only." },

  // UI
  { ch:"ㅢ", hint:"ui",  sound:"[ɯi] ~ [i]", layout:"Horizontal (C over V)", examples:["의","희","늬"], caution:"After consonants often ~[i]; awareness only at A0." }
];

const A0_DRILL_WORDS = [
  "나무", "바다", "누나", "로비", "미로", "라마", "고기", "마모", "노루", "나라",
  "말", "밤", "밥", "국", "물", "날" // with basic batchim
];

/************ A0 READING RENDERER ************/
function initA0Reading() {
  const $cg = document.getElementById("jamoConsonantGrid");
  const $vg = document.getElementById("jamoVowelGrid");
  const $cDetail = document.getElementById("consonantDetail");
  const $vDetail = document.getElementById("vowelDetail");

  // 카드 렌더
  $cg.innerHTML = JAMO_CONSONANTS.map(j => cardHTML(j.ch, j.hint, "consonant")).join("");
  $vg.innerHTML = JAMO_VOWELS.map(j => cardHTML(j.ch, j.hint, "vowel")).join("");

  // 기본 선택: ㄱ, ㅏ
  let openConsonant = "ㄱ";
  let openVowel = "ㅏ";
  renderDetail("consonant", openConsonant, $cDetail);
  renderDetail("vowel", openVowel, $vDetail);

  // 이벤트: 토글 오픈/클로즈 (같은 카드 → 닫기)
  $cg.querySelectorAll(".jamo-card").forEach(btn => {
    btn.addEventListener("click", () => {
      const ch = btn.dataset.ch;
      if (openConsonant === ch && !$cDetail.classList.contains("hidden")) {
        $cDetail.classList.add("hidden"); openConsonant = null; return;
      }
      openConsonant = ch;
      renderDetail("consonant", ch, $cDetail);
      $cDetail.classList.remove("hidden");
    });
  });

  $vg.querySelectorAll(".jamo-card").forEach(btn => {
    btn.addEventListener("click", () => {
      const ch = btn.dataset.ch;
      if (openVowel === ch && !$vDetail.classList.contains("hidden")) {
        $vDetail.classList.add("hidden"); openVowel = null; return;
      }
      openVowel = ch;
      renderDetail("vowel", ch, $vDetail);
      $vDetail.classList.remove("hidden");
    });
  });

  // Drill 모달
  document.getElementById("openDrill").addEventListener("click", () => {
    const $modal = document.getElementById("drillModal");
    const $list = document.getElementById("drillList");
    $list.innerHTML = A0_DRILL_WORDS
      .map(w => `<span class="drill-item korean">${w}</span>`)
      .join("");
    $modal.classList.remove("hidden");
  });
  document.getElementById("closeDrill").addEventListener("click", () => {
    document.getElementById("drillModal").classList.add("hidden");
  });
}

// 카드 UI
function cardHTML(ch, hint, kind) {
  return `
    <button class="jamo-card" data-kind="${kind}" data-ch="${ch}" aria-pressed="false">
      <span class="jamo-big korean" aria-hidden="true">${ch}</span>
      <span class="jamo-hint">${hint}</span>
    </button>
  `;
}

// 디테일 렌더
function renderDetail(kind, ch, container) {
  const data = (kind === "consonant" ? JAMO_CONSONANTS : JAMO_VOWELS).find(x => x.ch === ch);
  if (!data) return;
  const layoutRow = (data.layout
    ? `<div class="detail-row"><span class="label">Layout</span><span class="value">${data.layout}</span></div>`
    : "");
  const examples = (data.examples || []).map(b => `<span class="eg korean">${b}</span>`).join(" ");
  container.innerHTML = `
    <div class="jamo-detail">
      <div class="detail-head">
        <span class="detail-glyph korean" aria-label="Selected character" role="img">${data.ch}</span>
        <div class="detail-meta">
          <div class="detail-row sound-dt"><span class="label">Sound</span><span class="value vcs">${data.sound}</span></div>
          <div class="detail-row"><span class="label">Articulation</span><span class="value">${data.place}</span></div>
          ${layoutRow}
        </div>
      </div>
      <div class="detail-ex">
        <div class="egs">${examples}</div>
      </div>
      <div class="detail-caution">
        <span class="label">Watch out</span>
        <span class="value dt-c">${data.caution}</span>
      </div>
    </div>
  `;
}

/************ Global Study Notes (tab/level 공통) ************/
(function GlobalStudyNotes(){
  const KEY = (() => {
    const u = (localStorage.getItem("username") || "anon").trim().toLowerCase();
    // 유저별 전역 메모 키
    return `notes:${u || "anon"}`;
  })();

  const LS = {
    load(){ try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } },
    save(arr){ try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch {} },
    clear(){ try { localStorage.removeItem(KEY); } catch {} }
  };

  const escapeHTML = (s="") =>
    s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function createNotesBox(){
    const box = document.createElement("div");
    box.id = "studyNotes";
    box.className = "notes-box";
    box.innerHTML = `
      <form class="notes-form" autocomplete="off">
        <textarea class="notes-input" placeholder="Write a note..." rows="1"></textarea>
        <button type="submit" class="nt-add">+</button>
      </form>
      <ul class="notes-list"></ul>
      <div class="notes-clear-bar">
        <button type="button" class="notes-clear">🗑️</button>
      </div>
    `;
    return box;
  }

  function render(listEl){
    const items = LS.load();
    listEl.innerHTML = "";
    items.forEach((t, i) => {
      const li = document.createElement("li");
      li.className = "note-item";
      li.innerHTML = `
        <span class="note-text">${escapeHTML(t)}</span>
        <button type="button" class="note-del" aria-label="delete">×</button>
      `;
      li.querySelector(".note-del").addEventListener("click", () => {
        const next = LS.load().filter((_, idx) => idx !== i);
        LS.save(next);
        render(listEl);
      });
      listEl.appendChild(li);
    });
  }

  // 탭 변경마다 호출해도 안전하게 한 번만 장착
  window.ensureGlobalNotesMounted = function ensureGlobalNotesMounted(){
    // 1) 렌더 대상 결정: 기본은 .dict-column 우선, 없으면 #tabContent 끝에 붙임
    const tabContent = document.getElementById("tabContent");
    if (!tabContent) return;

    let host =
      tabContent.querySelector(".dict-column") // 좌측 학습영역 옆에 있는 컬럼 우선
      || tabContent;                            // 없으면 그냥 탭 콘텐츠 아래쪽

    // 2) 이미 있으면 패스, 없으면 생성/부착
    let notesBox = host.querySelector("#studyNotes") || document.getElementById("studyNotes");
    if (!notesBox) {
      notesBox = createNotesBox();
      // dict-column 있으면 그 안에, 아니면 tabContent 맨 아래
      if (host.classList.contains("dict-column")) {
        host.appendChild(notesBox);
      } else {
        // 레이아웃이 세로일 때도 자연스럽게
        const wrap = document.createElement("div");
        wrap.style.marginTop = "1rem";
        wrap.appendChild(notesBox);
        tabContent.appendChild(wrap);
      }
    }

    // 3) 이벤트 바인딩(중복 방지 위해 한 번씩 정리)
    const formEl  = notesBox.querySelector(".notes-form");
    const inputEl = notesBox.querySelector(".notes-input");
    const listEl  = notesBox.querySelector(".notes-list");
    const clrBtn  = notesBox.querySelector(".notes-clear");

    if (!formEl._bound) {
      formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = (inputEl.value || "").trim();
        if (!text) return;
        const next = [...LS.load(), text];
        LS.save(next);
        inputEl.value = "";
        render(listEl);
      });
      formEl._bound = true;
    }

    if (!clrBtn._bound) {
      clrBtn.addEventListener("click", () => {
        if (confirm("Clear all notes?")) {
          LS.clear();
          render(listEl);
        }
      });
      clrBtn._bound = true;
    }

    // 4) 최초 렌더 + Clear 버튼 노출 토글
    render(listEl);
    const clearBar = notesBox.querySelector('.notes-clear-bar');
    const updateClearBar = () => {
      const hasNotes = (LS.load().length > 0);
      clearBar?.classList.toggle('show', hasNotes);
    };
    updateClearBar();

    // 렌더를 다시 부를 때도 반영되도록 render를 래핑해도 됨
    const _renderOrig = render;
    render = function(listElArg){
      _renderOrig(listElArg);
      updateClearBar();
    };
  }

  // put near other small helpers
function autoSizeTextArea(el) {
  if (!el) return;
  el.style.height = "auto";
  el.style.overflowY = "hidden";
  el.style.height = el.scrollHeight + "px";
}

// after you inject the notes HTML (still inside updateTabContent)
setTimeout(() => {
  const ta = document.querySelector("#studyNotes .notes-input");
  if (ta) {
    autoSizeTextArea(ta);                // 초기 높이 맞추기
    ta.addEventListener("input", () => { // 입력할 때마다 늘어나기
      autoSizeTextArea(ta);
    });
  }
}, 0);

})();