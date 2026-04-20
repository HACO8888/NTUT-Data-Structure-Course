# Data Structures Midterm Exam

> **114AB0041 林杰陞** | 北科大資料結構期中考

## Overview

本次期中考共 8 題（滿分 110，上限 100），使用 Claude Code (AI) 輔助完成。以下記錄每一題使用的 Prompt、實作邏輯與最終功能。

---

## Q1 — Stack：分散式平衡復原系統（15%）

### Prompt

> 「寫一個 `balanced_pop(stacks)` 函式，從多個 Stack 中找到元素最多的那個進行 POP。若長度相同，取編號最小的。若全部為空，輸出 `"Server Empty"` 並回傳 `None`。」

### 實作邏輯

- 用 `all(len(s) == 0 for s in stacks)` 做空檢查
- 迴圈遍歷所有 stack，用 `>` 嚴格大於比較，自然保留較小 index（tie-breaking）
- 對目標 stack 執行 `.pop()`

### 測資驗證

```
輸入: [['A', 'B'], ['C', 'D', 'E'], ['F']]
輸出: 取出 E，剩餘 [['A', 'B'], ['C', 'D'], ['F']]
```

---

## Q2 — Two-Stack：圖書館自動化系統（15%）

### Prompt

> 「實作 `library_process(s1, s2, q, action, book)`，s1 是還書箱（Stack），s2 是整理車（Stack），q 是書架（Queue/deque）。RETURN 把書放入 s1，SHELF 時若 s2 為空先把 s1 全部倒入 s2，再從 s2 取一本放到 q。兩個都空就印 `"No books to shelf"`。」

### 實作邏輯

- Two-Stack 反轉技巧實現 FIFO：s1 → s2 倒轉後，s2 的 top 就是最早放入的書
- `RETURN`: `s1.append(book)`
- `SHELF`: 檢查雙空 → 若 s2 空則全部搬移 → `s2.pop()` 放入 `q.append()`

### 測資驗證

```
RETURN "Python入門" → RETURN "資料結構" → SHELF → SHELF
書架: ['Python入門', '資料結構']（FIFO 順序正確）
```

---

## Q3 — 演唱會多開雙層售票系統（20%）

### Prompt

> 「實作 `ticket_system(counters, action, user, q_idx)`，每個窗口有 s1 和 s2 兩個 Stack。ARRIVE 時找總人數最少的窗口（同數取小編號），一般客排入 s1，VIP 客排入 s2（下一個被服務）。SERVE 時用 Two-Stack 倒裝邏輯從指定窗口服務客人。」

### 實作邏輯

- 負載平衡：遍歷所有窗口，計算 `len(s1) + len(s2)`，找最小值
- VIP 偵測：`user.startswith("VIP")` → 推入 s2（立即被服務）
- SERVE：Two-Stack 倒裝（s1 → s2），再從 s2 pop

### 測資驗證

```
A→窗口0, B→窗口1, C→窗口2, D→窗口0, E→窗口1, F→窗口2
SERVE 窗口0 → 服務完成：A（FIFO 正確）
```

---

## Q4 — 雲霄飛車系統（20%）

### Prompt

> 「實作 `theme_park_system(q, action, name, patience, batch_size)`。JOIN 加入佇列（帶耐心值），RIDE 時依 batch_size 逐一上車，每上一人其餘人耐心 -1，耐心歸零者離開。**只能用 `popleft()` 和 `append()` 操作 Queue，禁止迭代和索引存取。**」

### 實作邏輯

- JOIN: `q.append((name, patience))`
- RIDE: 用 `popleft()` 取出乘客，再用 `popleft/append` 循環更新剩餘人的耐心值（純 Queue 操作，不使用 `for...in q` 或 `q[i]`）
- 耐心歸零者不再 `append` 回去

### 測資驗證

```
Alice(5), Bob(5), Charlie(5) → RIDE batch=2
Alice 上車。Bob(耐心剩4), Charlie(耐心剩4)
Bob 上車。Charlie(耐心剩3)
發車: ['Alice', 'Bob']
```

---

## Q5 — 思考題：Debug Deque（10%）

### Prompt

> 「證明 `deque([4, 2, 1, 5, 3])` 不可能由按 1→2→3→4→5 順序依序 `appendleft()` 或 `append()` 產生。要求詳細證明。」

### 答案重點

- Deque 只有頭尾兩種插入方式，最後插入的元素（5）一定在 index 0 或 index 4
- 但 `deque([4, 2, 1, 5, 3])` 中 5 在 index 3，右邊還有 3
- 5 是最後插入的，之後不可能再有元素插入 → **物理上不可能**

---

## Q6 — 思考題：Deque 的效能災難（10%）

### Prompt

> 「解釋為什麼把 Python list 全部換成 deque 後，用索引做的反轉陣列演算法會從瞬間完成變成卡到當機（N=100,000）。從 Dynamic Array 和 Doubly Linked List 的底層原理解釋。」

### 答案重點

| 資料結構 | `q[i]` 時間複雜度 | 反轉總複雜度 |
|---------|-------------------|-------------|
| list（Dynamic Array） | O(1) | O(n) |
| deque（Doubly Linked List） | O(n) | O(n²) |

- list 連續記憶體 → 索引直接計算位址 → O(1)
- deque 鏈結串列 → 索引需逐節點走訪 → O(n)
- N=100,000 時：O(n²) ≈ 100 億次操作 → 當機

---

## Q7 — 特殊題：伺服器 bug 還原（10%）

### Prompt（即答案 1）

> 「請幫我寫一隻 Python 程式：讀取 server_log.txt（100 萬行日誌），用 `collections.deque` 模擬 Queue，支援 `PUSH <number>`、`POP`、`REVERSE_ALL` 三種操作，執行完後印出最後 5 個訂單編號。」

### 實作邏輯

- 逐行解析 `[時間戳] 操作 [參數]` 格式
- PUSH → `q.append(value)`
- POP → `q.popleft()`
- REVERSE_ALL → `q.reverse()`

### 答案 2

```
隊伍總長度: 249,371
最後 5 個訂單編號: [600702, 600703, 600704, 600705, 600740]
```

---

## Q8 — 特殊題：用 AI 視覺化 Two-Stack 流程（10%）

### Prompt

> 「建立一個 Two-Stack Queue 視覺化網頁，分離為 HTML/CSS/JS 三個檔案。需要：兩個 Stack 視覺容器、PUSH/POP 按鈕、真正的 Two-Stack 邏輯、動畫效果、亮暗主題切換、中英文切換、操作日誌、螢幕錄影下載功能。」

### 功能清單

| 功能 | 說明 |
|------|------|
| Two-Stack Queue 邏輯 | PUSH → S1，POP → 若 S2 空則 S1 全部倒入 S2，再從 S2 取出 |
| 動態動畫 | 推入、彈出、搬移都有獨立動畫效果 |
| 亮/暗主題 | 右上角 toggle 切換，CSS variables 平滑過渡 |
| 中/英文 i18n | 所有 UI 文字即時切換，包含 title、aria-label |
| 操作日誌 | 即時記錄每一步操作，分色顯示 |
| 螢幕錄影 | MediaRecorder API 錄製當前分頁，停止後自動下載 .webm |
| 鍵盤快捷鍵 | P = PUSH, O = POP |
| 響應式設計 | 支援手機瀏覽 |

### 檔案結構

```
two-stack-visualizer/
├── index.html    # 結構與佈局
├── style.css     # 樣式、主題、動畫
└── app.js        # 邏輯、i18n、錄影
```

---

## Tech Stack

- Python 3 + `collections.deque`
- Jupyter Notebook (`.ipynb`)
- Vanilla HTML / CSS / JavaScript
- MediaRecorder API（螢幕錄影）
- Google Fonts（DM Serif Display、IBM Plex Mono、Noto Sans TC）

## File Structure

```
MID/
├── 114AB0041.ipynb          # 主要作答檔案（Q1-Q8）
├── server_log.txt           # Q7 日誌檔（100 萬行）
├── two-stack-visualizer/    # Q8 視覺化網頁
│   ├── index.html
│   ├── style.css
│   └── app.js
└── README.md
```
