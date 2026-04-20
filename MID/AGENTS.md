# AGENTS.md — MID (期中考)

## Context

這是北科大資料結構期中考的作答目錄（114AB0041 林杰陞）。所有答案已完成，主要維護工作為修正、優化、或補充說明。

## Guiding Principles

- 保持學號姓名標註格式不變（`# 114AB0041 林杰陞`）
- 不要改動已通過測資的程式邏輯，除非明確要求修正
- Q5、Q6 為 Markdown 思考題，修改時保持證明邏輯完整
- Q8 視覺化為純前端（Vanilla HTML/CSS/JS），不引入框架或 bundler

## File Roles

### `114AB0041.ipynb`
主作答 notebook，包含 Q1-Q8 所有程式碼與思考題答案。每個 cell 對應一題，底部附帶測資。修改時注意：
- 不要重新排列 cell 順序
- 保留每題的測資區塊與預期輸出註解

### `server_log.txt`
Q7 使用的 100 萬行伺服器日誌（約 19MB）。格式為 `[時間戳] 操作 [參數]`。這是唯讀測試資料，不應修改。

### `two-stack-visualizer/`
Q8 的互動式 Two-Stack Queue 視覺化網頁：
- `index.html` — 結構與佈局
- `style.css` — 樣式、主題變數、動畫
- `app.js` — Two-Stack 邏輯、i18n、錄影功能

修改前端時：
- 維持三檔分離架構
- i18n 文字更新需同時改 `app.js` 中的 `translations` 物件
- 支援亮/暗主題切換（CSS variables）

### `README.md`
完整的題目說明文件，記錄每題的 Prompt、實作邏輯、測資結果。更新程式碼後應同步更新對應段落。
