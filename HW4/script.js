// 遊戲狀態
let gameState = {
    gold: 150,
    round: 0,
    barracksA: [],
    barracksB: []
};

// 單位資料
const units = {
    '劍士': { icon: '⚔️', cost: 20 },
    '弓手': { icon: '🏹', cost: 30 },
    '騎士': { icon: '🐴', cost: 50 },
    '投石車': { icon: '🪨', cost: 40 }
};

// DOM 元素
const goldAmountEl = document.getElementById('goldAmount');
const roundNumEl = document.getElementById('roundNum');
const nextRoundBtn = document.getElementById('nextRoundBtn');
const logContent = document.getElementById('logContent');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    bindEvents();
});

// 綁定事件
function bindEvents() {
    // 生產按鈕
    document.querySelectorAll('.unit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const unit = btn.dataset.unit;
            const cost = parseInt(btn.dataset.cost);
            placeOrder(unit, cost);
        });
    });

    // 下一回合按鈕
    nextRoundBtn.addEventListener('click', nextRound);
}

// 下訂單
function placeOrder(unit, cost) {
    // 檢查金額
    if (gameState.gold < cost) {
        addLog(`黃金不足 (剩:${gameState.gold})！取消生產 ${unit}`, 'error');
        return;
    }

    // 檢查產線是否全滿
    if (gameState.barracksA.length >= 2 && gameState.barracksB.length >= 2) {
        addLog(`產線全滿！${unit} 訂單被拒絕`, 'warning');
        return;
    }

    // 負載平衡：選擇較空的兵營
    let targetBarrack;
    if (gameState.barracksA.length <= gameState.barracksB.length && gameState.barracksA.length < 2) {
        targetBarrack = 'A';
        gameState.barracksA.push(unit);
    } else if (gameState.barracksB.length < 2) {
        targetBarrack = 'B';
        gameState.barracksB.push(unit);
    } else {
        targetBarrack = 'A';
        gameState.barracksA.push(unit);
    }

    // 扣除金額
    gameState.gold -= cost;
    
    addLog(`${unit} 分派至 ${targetBarrack} 廠 (剩餘黃金: ${gameState.gold})`, 'success');
    updateDisplay();
    animateUnitEntry(targetBarrack);
}

// 下一回合
function nextRound() {
    gameState.round++;
    roundNumEl.textContent = gameState.round;
    
    addLog(`\n--- 第 ${gameState.round} 回合 ---`, 'system');

    // 只在偶數回合生產
    if (gameState.round % 2 === 0) {
        processProduction();
    } else {
        addLog('本回合為準備回合，不生產單位', 'system');
    }

    updateDisplay();
}

// 處理生產
function processProduction() {
    // A 廠生產
    const outputA = document.getElementById('outputA');
    if (gameState.barracksA.length > 0) {
        const unitA = gameState.barracksA.shift();
        showProduction(outputA, unitA, 'A');
    } else {
        showUnderflow(outputA, 'A');
    }

    // B 廠生產 (延遲一點顯示，有順序感)
    setTimeout(() => {
        const outputB = document.getElementById('outputB');
        if (gameState.barracksB.length > 0) {
            const unitB = gameState.barracksB.shift();
            showProduction(outputB, unitB, 'B');
        } else {
            showUnderflow(outputB, 'B');
        }
        updateDisplay();
    }, 300);
}

// 顯示生產動畫
function showProduction(element, unit, barrackName) {
    element.classList.add('producing');
    element.innerHTML = '<span class="empty-text">生產中...</span>';
    
    setTimeout(() => {
        element.classList.remove('producing');
        element.classList.add('completed');
        element.innerHTML = `
            <div class="unit-card unit-appear">
                <span class="icon">${units[unit].icon}</span>
                <span>${unit} 完成!</span>
            </div>
        `;
        addLog(`${barrackName} 廠生產完成：${unit} 出列！`, 'success');
        
        // 3秒後清空
        setTimeout(() => {
            element.classList.remove('completed');
            element.innerHTML = '<span class="empty-text">等待生產...</span>';
        }, 3000);
    }, 800);
}

// 顯示 Underflow 訊息
function showUnderflow(element, barrackName) {
    element.innerHTML = '<span class="empty-text" style="color: #e94560;">⚠️ 無訂單</span>';
    addLog(`${barrackName} 廠沒東西可做 (Underflow 防護成功)`, 'warning');
    
    setTimeout(() => {
        element.innerHTML = '<span class="empty-text">等待生產...</span>';
    }, 2000);
}

// 更新畫面
function updateDisplay() {
    // 更新金額
    goldAmountEl.textContent = gameState.gold;
    
    // 更新佇列計數
    document.getElementById('countA').textContent = gameState.barracksA.length;
    document.getElementById('countB').textContent = gameState.barracksB.length;

    // 更新 A 廠佇列顯示
    updateQueueSlots('A', gameState.barracksA);
    
    // 更新 B 廠佇列顯示
    updateQueueSlots('B', gameState.barracksB);

    // 更新按鈕狀態
    updateButtonStates();
}

// 更新佇列格子
function updateQueueSlots(barrack, queue) {
    for (let i = 0; i < 2; i++) {
        const slot = document.getElementById(`slot${barrack}${i}`);
        if (queue[i]) {
            slot.classList.add('filled');
            slot.innerHTML = `
                <div class="unit-card">
                    <span class="icon">${units[queue[i]].icon}</span>
                    <span>${queue[i]}</span>
                </div>
            `;
        } else {
            slot.classList.remove('filled');
            slot.innerHTML = '';
        }
    }
}

// 更新按鈕狀態
function updateButtonStates() {
    document.querySelectorAll('.unit-btn').forEach(btn => {
        const cost = parseInt(btn.dataset.cost);
        btn.disabled = gameState.gold < cost;
    });
}

// 新增日誌
function addLog(message, type = 'system') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    logContent.insertBefore(entry, logContent.firstChild);
    
    // 限制日誌數量
    while (logContent.children.length > 50) {
        logContent.removeChild(logContent.lastChild);
    }
}

// 單位進入動畫
function animateUnitEntry(barrack) {
    const queue = barrack === 'A' ? gameState.barracksA : gameState.barracksB;
    const index = queue.length - 1;
    if (index >= 0) {
        const slot = document.getElementById(`slot${barrack}${index}`);
        if (slot) {
            slot.style.animation = 'none';
            setTimeout(() => {
                slot.style.animation = 'unitAppear 0.5s ease';
            }, 10);
        }
    }
}
