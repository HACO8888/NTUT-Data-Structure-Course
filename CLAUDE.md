# CLAUDE.md

## Project Overview

北科大資料結構課程作業與考試 repo（114AB0041 林杰陞）。

## Repository Structure

```
data-structure/
├── HW1/          # 作業 1
├── HW3/          # 作業 3
├── HW4/          # 作業 4
└── MID/          # 期中考
    ├── 114AB0041.ipynb          # 主作答 notebook（Q1-Q8）
    ├── server_log.txt           # Q7 用的 100 萬行日誌
    └── two-stack-visualizer/    # Q8 互動式網頁
```

## Conventions

- 所有程式碼檔案第一行標註 `# 114AB0041 林杰陞`
- HTML/CSS/JS 檔案頂部用註解標註學號姓名
- Notebook 的 markdown cell 用粗體標註 `**114AB0041 林杰陞**`
- 繳交檔案格式：`.py` 或 `.ipynb`
- 繳交信件標題格式：`[DS] 林杰陞 114AB0041`

## Tech Stack

- Python 3 + collections.deque
- Jupyter Notebook
- Vanilla HTML / CSS / JS（無框架）

## Key Patterns

- Two-Stack Queue：用兩個 Stack 實現 FIFO（s1 進件、s2 出件，s2 空時從 s1 全部倒入）
- 純 Queue 操作：只用 `popleft()` / `append()`，不使用索引或迭代
- i18n：用 `data-i18n` 屬性 + JS 物件實現中英文切換

## Testing

- Notebook 每個 cell 底部有測資區，執行即可驗證
- Q8 網頁直接用瀏覽器開啟 `two-stack-visualizer/index.html`
