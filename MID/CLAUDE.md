# CLAUDE.md — MID (期中考)

## Overview

北科大資料結構期中考作答（114AB0041 林杰陞），共 8 題，滿分 110 上限 100。

## File Structure

```
MID/
├── 114AB0041.ipynb          # 主作答 notebook（Q1-Q8 全部答案）
├── server_log.txt           # Q7 用的 100 萬行伺服器日誌
├── two-stack-visualizer/    # Q8 互動式網頁視覺化
│   ├── index.html
│   ├── style.css
│   └── app.js
└── README.md                # 完整題目說明與 Prompt 紀錄
```

## Conventions

- 每個 Python cell 第一行：`# 114AB0041 林杰陞`
- Markdown cell 用粗體標註：`**114AB0041 林杰陞**`
- HTML/CSS/JS 檔案頂部用 `<!-- 114AB0041 林杰陞 -->` 或對應註解標註學號姓名

## Tech Stack

- Python 3 + `collections.deque`
- Jupyter Notebook (`.ipynb`)
- Vanilla HTML / CSS / JS（Q8 視覺化，無框架）

## Topics Covered

| 題號 | 主題 | 類型 |
|------|------|------|
| Q1 | Stack — 分散式平衡復原系統 | 程式題 |
| Q2 | Two-Stack — 圖書館自動化系統 | 程式題 |
| Q3 | 演唱會多開雙層售票系統（負載平衡 + Two-Stack） | 程式題 |
| Q4 | 雲霄飛車系統（Queue + 動態耐心值） | 程式題 |
| Q5 | Debug Deque（證明題） | 思考題 |
| Q6 | Deque 的效能災難（複雜度分析） | 思考題 |
| Q7 | 伺服器 bug 還原（解析 100 萬行日誌） | 特殊題 |
| Q8 | Two-Stack Queue 視覺化網頁 | 特殊題 |

## Key Patterns

- **Two-Stack Queue**：s1 進件、s2 出件，s2 空時從 s1 全部倒入
- **純 Queue 操作**（Q4）：只用 `popleft()` / `append()`，禁止索引和迭代
- **i18n**（Q8）：`data-i18n` 屬性 + JS 物件實現中英文切換

## Testing

- Notebook 每個 cell 底部有測資區，直接執行即可驗證
- Q8 網頁：開啟 `two-stack-visualizer/index.html`
