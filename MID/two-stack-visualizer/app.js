/* ========================================
   TWO-STACK QUEUE VISUALIZER — Logic
   114AB0041 林杰陞
   ======================================== */

// --- i18n ---
const LANG = {
  zh: {
    title: 'Two-Stack Queue',
    subtitle: '視覺化模擬器',
    stack1Title: '進件區',
    stack2Title: '出件區',
    stack1Label: 'PUSH 從這裡進入',
    stack2Label: 'POP 從這裡取出',
    empty: '空',
    transferLabel: '倒轉搬移',
    totalLabel: '佇列長度',
    opsLabel: '操作次數',
    logTitle: '操作紀錄',
    logClear: '清除',
    logReady: '系統就緒，按下 PUSH 開始操作',
    footerText: '資料結構期中考',
    logPush: (n) => `PUSH ${n} → Stack 1（進件區）`,
    logPop: (n) => `POP ${n} ← Stack 2（出件區）`,
    logTransfer: (n) => `搬移 ${n} 個元素：Stack 1 → Stack 2（反轉順序）`,
    logEmpty: '佇列為空，無法 POP',
    topTag: '頂端',
    pageTitle: 'Two-Stack Queue 視覺化模擬器',
    langAria: '切換語言',
    themeAria: '切換主題',
    recStart: '開始錄影',
    recStop: '停止並下載',
    recLog: '開始錄製畫面',
    recStopLog: '錄影結束，影片已下載',
    recError: '錄影啟動失敗，請允許畫面擷取權限',
  },
  en: {
    title: 'Two-Stack Queue',
    subtitle: 'Visual Simulator',
    stack1Title: 'Inbox',
    stack2Title: 'Outbox',
    stack1Label: 'PUSH enters here',
    stack2Label: 'POP exits here',
    empty: 'empty',
    transferLabel: 'Transfer',
    totalLabel: 'Queue size',
    opsLabel: 'Operations',
    logTitle: 'Operation Log',
    logClear: 'Clear',
    logReady: 'System ready. Press PUSH to start.',
    footerText: 'Data Structures Midterm',
    logPush: (n) => `PUSH ${n} → Stack 1 (Inbox)`,
    logPop: (n) => `POP ${n} ← Stack 2 (Outbox)`,
    logTransfer: (n) => `Transfer ${n} elements: Stack 1 → Stack 2 (reversed)`,
    logEmpty: 'Queue is empty, cannot POP',
    topTag: 'TOP',
    pageTitle: 'Two-Stack Queue Visual Simulator',
    langAria: 'Toggle language',
    themeAria: 'Toggle theme',
    recStart: 'Record',
    recStop: 'Stop & Download',
    recLog: 'Screen recording started',
    recStopLog: 'Recording finished, video downloaded',
    recError: 'Recording failed. Please allow screen capture.',
  },
};

// --- State ---
const state = {
  s1: [],
  s2: [],
  nextId: 1,
  ops: 0,
  lang: 'zh',
  theme: 'dark',
  transferring: false,
};

const BLOCK_COLORS = [
  'block-amber', 'block-teal', 'block-rose', 'block-sage',
  'block-lavender', 'block-slate', 'block-coral', 'block-sky',
];

// --- DOM ---
const $ = (sel) => document.querySelector(sel);
const s1Container = $('#stack1Container');
const s2Container = $('#stack2Container');
const s1Count = $('#s1Count');
const s2Count = $('#s2Count');
const totalCount = $('#totalCount');
const opsCount = $('#opsCount');
const logContainer = $('#logContainer');
const btnPush = $('#btnPush');
const btnPop = $('#btnPop');
const btnClearLog = $('#btnClearLog');
const langToggle = $('#langToggle');
const themeToggle = $('#themeToggle');
const transferArrow = $('#transferArrow');
const btnRec = $('#btnRec');
const recLabel = $('#recLabel');
const recDot = $('#recDot');

// --- Helpers ---
function getTime() {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((v) => String(v).padStart(2, '0'))
    .join(':');
}

function t(key) {
  return LANG[state.lang][key] || key;
}

function pickColor(id) {
  return BLOCK_COLORS[id % BLOCK_COLORS.length];
}

// --- Rendering ---
function renderStack(container, stack, isS2) {
  container.innerHTML = '';
  if (stack.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'stack-empty';
    empty.textContent = t('empty');
    container.appendChild(empty);
    return;
  }
  stack.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = `block ${pickColor(item.id)}`;
    el.textContent = item.id;
    if (i === stack.length - 1) {
      const tag = document.createElement('span');
      tag.className = 'block-top-tag';
      tag.textContent = t('topTag');
      el.appendChild(tag);
    }
    if (item._anim) {
      el.classList.add(item._anim);
      item._anim = null;
    }
    container.appendChild(el);
  });
}

function updateCounts() {
  s1Count.textContent = state.s1.length;
  s2Count.textContent = state.s2.length;
  totalCount.textContent = state.s1.length + state.s2.length;
  opsCount.textContent = state.ops;
}

function renderAll() {
  renderStack(s1Container, state.s1, false);
  renderStack(s2Container, state.s2, true);
  updateCounts();
}

function addLog(msg, type) {
  const entry = document.createElement('div');
  entry.className = `log-entry log-${type} log-entry-new`;
  entry.innerHTML = `<span class="log-time">${getTime()}</span><span class="log-msg">${msg}</span>`;
  logContainer.prepend(entry);
  setTimeout(() => entry.classList.remove('log-entry-new'), 300);
}

function updateI18n() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (typeof val === 'string') el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    const val = t(key);
    if (typeof val === 'string') el.setAttribute('aria-label', val);
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    const val = t(key);
    if (typeof val === 'string') el.textContent = val;
  });
}

// --- Actions ---
function doPush() {
  if (state.transferring) return;
  const id = state.nextId++;
  state.s1.push({ id, _anim: 'block-enter' });
  state.ops++;
  addLog(t('logPush')(id), 'push');
  renderAll();
}

function doPop() {
  if (state.transferring) return;

  if (state.s1.length === 0 && state.s2.length === 0) {
    addLog(t('logEmpty'), 'error');
    btnPop.classList.add('shake');
    setTimeout(() => btnPop.classList.remove('shake'), 400);
    return;
  }

  state.ops++;

  if (state.s2.length === 0) {
    doTransferThenPop();
  } else {
    popFromS2();
  }
}

function popFromS2() {
  const top = state.s2[state.s2.length - 1];
  top._anim = 'block-exit';
  renderAll();

  setTimeout(() => {
    state.s2.pop();
    addLog(t('logPop')(top.id), 'pop');
    renderAll();
  }, 300);
}

function doTransferThenPop() {
  state.transferring = true;
  const count = state.s1.length;
  addLog(t('logTransfer')(count), 'transfer');

  transferArrow.classList.add('active');

  state.s1.forEach((item) => { item._anim = 'block-transfer-out'; });
  renderAll();

  setTimeout(() => {
    while (state.s1.length > 0) {
      const item = state.s1.pop();
      item._anim = 'block-transfer-in';
      state.s2.push(item);
    }
    renderAll();

    setTimeout(() => {
      transferArrow.classList.remove('active');
      state.transferring = false;
      popFromS2();
    }, 400);
  }, 300);
}

// --- Theme & Lang ---
function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'light') {
    themeToggle.classList.add('active');
  } else {
    themeToggle.classList.remove('active');
  }
}

function setLang(lang) {
  state.lang = lang;
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-TW' : 'en');
  if (lang === 'en') {
    langToggle.classList.add('active');
  } else {
    langToggle.classList.remove('active');
  }
  updateI18n();
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    recLabel.textContent = t('recStop');
  } else {
    recLabel.textContent = t('recStart');
  }
  renderAll();
}

// --- Screen Recording ---
let mediaRecorder = null;
let recordedChunks = [];
let recordingStream = null;

async function toggleRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    return;
  }

  try {
    recordingStream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: 'browser' },
      audio: false,
      preferCurrentTab: true,
    });

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(recordingStream, {
      mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm',
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `two-stack-queue-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.webm`;
      a.click();
      URL.revokeObjectURL(url);

      recordingStream.getTracks().forEach((track) => track.stop());
      recordingStream = null;
      mediaRecorder = null;
      recordedChunks = [];

      btnRec.classList.remove('recording');
      recLabel.textContent = t('recStart');
      addLog(t('recStopLog'), 'info');
    };

    recordingStream.getVideoTracks()[0].onended = () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    };

    mediaRecorder.start();
    btnRec.classList.add('recording');
    recLabel.textContent = t('recStop');
    addLog(t('recLog'), 'info');
  } catch (err) {
    addLog(t('recError'), 'error');
  }
}

// --- Events ---
btnPush.addEventListener('click', doPush);
btnPop.addEventListener('click', doPop);
btnRec.addEventListener('click', toggleRecording);
btnClearLog.addEventListener('click', () => {
  logContainer.innerHTML = '';
  addLog(t('logReady'), 'info');
});

themeToggle.addEventListener('click', () => {
  setTheme(state.theme === 'dark' ? 'light' : 'dark');
});

langToggle.addEventListener('click', () => {
  setLang(state.lang === 'zh' ? 'en' : 'zh');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'p' || e.key === 'P' || e.key === 'Enter') doPush();
  if (e.key === 'o' || e.key === 'O' || e.key === 'Backspace') doPop();
});

// --- Init ---
renderAll();
