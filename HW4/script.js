// 預設設定
const DEFAULT_SETTINGS = {
    gold: 150,
    capacity: 2,
    units: {
        '劍士': 20,
        '弓手': 30,
        '騎士': 50,
        '投石車': 40
    }
};

// 單位圖示
const UNIT_ICONS = {
    '劍士': '⚔️',
    '弓手': '🏹',
    '騎士': '🐴',
    '投石車': '🪨'
};

// 遊戲狀態
let gameState = {
    settings: null,
    gold: 0,
    round: 0,
    barracksA: [],
    barracksB: []
};

// 當前選擇的模式
let currentMode = 'preset';

// 選擇模式
function selectMode(mode) {
    currentMode = mode;
    document.getElementById('presetMode').classList.toggle('active', mode === 'preset');
    document.getElementById('customMode').classList.toggle('active', mode === 'custom');
    document.getElementById('settingsForm').classList.toggle('show', mode === 'custom');
    document.getElementById('presetInfo').style.display = mode === 'preset' ? 'block' : 'none';
}

// 開始遊戲
function startGame() {
    // 取得設定
    if (currentMode === 'preset') {
        gameState.settings = { ...DEFAULT_SETTINGS };
    } else {
        gameState.settings = {
            gold: parseInt(document.getElementById('initialGold').value) || 150,
            capacity: parseInt(document.getElementById('queueCapacity').value) || 2,
            units: {
                '劍士': parseInt(document.getElementById('costSword').value) || 20,
                '弓手': parseInt(document.getElementById('costArcher').value) || 30,
                '騎士': parseInt(document.getElementById('costKnight').value) || 50,
                '投石車': parseInt(document.getElementById('costCatapult').value) || 40
            }
        };
    }

    // 初始化遊戲狀態
    gameState.gold = gameState.settings.gold;
    gameState.round = 0;
    gameState.barracksA = [];
    gameState.barracksB = [];

    // 更新容量顯示
    document.querySelectorAll('.capacity').forEach(el => {
        el.textContent = gameState.settings.capacity;
    });

    // 生成佇列格子
    generateQueueSlots();

    // 生成單位按鈕
    generateUnitButtons();

    // 切換畫面
    document.getElementById('setupPanel').style.display = 'none';
    document.getElementById('gamePanel').classList.add('show');

    // 更新顯示
    updateDisplay();
    addLog('遊戲開始！');
}

// 生成佇列格子
function generateQueueSlots() {
    const capacity = gameState.settings.capacity;
    
    ['A', 'B'].forEach(barrack => {
        const container = document.getElementById(`queue${barrack}`);
        container.innerHTML = '';
        for (let i = 0; i < capacity; i++) {
            const slot = document.createElement('div');
            slot.className = 'queue-slot';
            slot.id = `slot${barrack}${i}`;
            container.appendChild(slot);
        }
    });
}

// 生成單位按鈕
function generateUnitButtons() {
    const container = document.getElementById('unitButtons');
    container.innerHTML = '';
    
    Object.entries(gameState.settings.units).forEach(([unit, cost]) => {
        const btn = document.createElement('button');
        btn.className = 'unit-btn';
        btn.onclick = () => placeOrder(unit);
        btn.innerHTML = `
            <span class="name">${UNIT_ICONS[unit]} ${unit}</span>
            <span class="cost">${cost} 金</span>
        `;
        container.appendChild(btn);
    });
}

// 重新開始
function resetGame() {
    document.getElementById('gamePanel').classList.remove('show');
    document.getElementById('setupPanel').style.display = 'block';
    document.getElementById('logContent').innerHTML = '<div class="log-entry">遊戲開始！請下達生產指令。</div>';
}

// 下訂單
function placeOrder(unit) {
    const cost = gameState.settings.units[unit];
    const capacity = gameState.settings.capacity;
    
    // 檢查金額
    if (gameState.gold < cost) {
        addLog(`黃金不足 (剩:${gameState.gold})！取消生產 ${unit}`, 'error');
        return;
    }

    // 檢查產線是否全滿
    if (gameState.barracksA.length >= capacity && gameState.barracksB.length >= capacity) {
        addLog(`產線全滿！${unit} 訂單被拒絕`, 'warning');
        return;
    }

    // 負載平衡
    if (gameState.barracksA.length <= gameState.barracksB.length && gameState.barracksA.length < capacity) {
        gameState.barracksA.push(unit);
        addLog(`${unit} 分派至 A 廠 (剩餘黃金: ${gameState.gold - cost})`, 'success');
    } else {
        gameState.barracksB.push(unit);
        addLog(`${unit} 分派至 B 廠 (剩餘黃金: ${gameState.gold - cost})`, 'success');
    }

    gameState.gold -= cost;
    updateDisplay();
}

// 下一回合
document.getElementById('nextRoundBtn').addEventListener('click', () => {
    addLog(`--- 第 ${gameState.round} 回合 ---`, 'round');

    if (gameState.round % 2 === 0) {
        processProduction();
    } else {
        addLog('玩家本回合無動作，單純推進時間');
    }

    gameState.round++;
    updateDisplay();
});

// 處理生產
function processProduction() {
    const capacity = gameState.settings.capacity;
    
    // A 廠
    const outputA = document.getElementById('outputA');
    if (gameState.barracksA.length > 0) {
        const unit = gameState.barracksA.shift();
        showProduction(outputA, unit, 'A');
    } else {
        showUnderflow(outputA, 'A');
    }

    // B 廠
    const outputB = document.getElementById('outputB');
    if (gameState.barracksB.length > 0) {
        const unit = gameState.barracksB.shift();
        showProduction(outputB, unit, 'B');
    } else {
        showUnderflow(outputB, 'B');
    }

    updateDisplay();
}

// 顯示生產
function showProduction(element, unit, barrackName) {
    element.className = 'output-area producing';
    element.textContent = '生產中...';
    
    setTimeout(() => {
        element.className = 'output-area completed';
        element.textContent = `${UNIT_ICONS[unit]} ${unit} 完成！`;
        addLog(`${barrackName} 廠生產完成：${unit} 出列！`, 'success');
        
        setTimeout(() => {
            element.className = 'output-area idle';
            element.textContent = '等待生產...';
        }, 2000);
    }, 500);
}

// 顯示 Underflow
function showUnderflow(element, barrackName) {
    element.className = 'output-area';
    element.style.color = '#f44336';
    element.textContent = '⚠️ 無訂單';
    addLog(`${barrackName} 廠沒東西可做 (Underflow 防護成功)`, 'warning');
    
    setTimeout(() => {
        element.className = 'output-area idle';
        element.style.color = '';
        element.textContent = '等待生產...';
    }, 1500);
}

// 更新顯示
function updateDisplay() {
    document.getElementById('goldAmount').textContent = gameState.gold;
    document.getElementById('roundNum').textContent = gameState.round;
    document.getElementById('countA').textContent = gameState.barracksA.length;
    document.getElementById('countB').textContent = gameState.barracksB.length;

    // 更新佇列顯示
    updateQueue('A', gameState.barracksA);
    updateQueue('B', gameState.barracksB);

    // 更新按鈕狀態
    updateButtons();
}

// 更新佇列顯示
function updateQueue(barrack, queue) {
    const capacity = gameState.settings.capacity;
    for (let i = 0; i < capacity; i++) {
        const slot = document.getElementById(`slot${barrack}${i}`);
        if (queue[i]) {
            slot.className = 'queue-slot filled';
            slot.textContent = `${UNIT_ICONS[queue[i]]} ${queue[i]}`;
        } else {
            slot.className = 'queue-slot';
            slot.textContent = '';
        }
    }
}

// 更新按鈕狀態
function updateButtons() {
    const buttons = document.querySelectorAll('.unit-btn');
    const unitNames = Object.keys(gameState.settings.units);
    
    buttons.forEach((btn, index) => {
        const unit = unitNames[index];
        const cost = gameState.settings.units[unit];
        btn.disabled = gameState.gold < cost;
    });
}

// 新增日誌
function addLog(message, type = '') {
    const content = document.getElementById('logContent');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    content.insertBefore(entry, content.firstChild);
    
    while (content.children.length > 30) {
        content.removeChild(content.lastChild);
    }
}

// 初始化
selectMode('preset');
