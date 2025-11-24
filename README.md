🌏 Travel & Weather AI Assistant
次世代の旅行 × 天気 × ファッション AI プランナー

A bilingual README (🇯🇵 Japanese first, 🇺🇸 English below)

🇯🇵 日本語版 — Travel & Weather AI Assistant
✈️ 旅行 & 天気 AI アシスタント

音声入力 × Generative UI × LangGraph AI エージェント

このアプリは、単なるチャットボットではありません。
旅行プラン生成、天気のリアルタイム可視化、ファッション提案など、ユーザーの意図に応じて 動的に UI が変化する新世代の AI 旅行アシスタント です。

🚀 ライブデモ

🔗 フロントエンド (Vercel)
https://travel-assistant-sandy.vercel.app/

🔗 バックエンド API (Render)
https://travel-assistant-xq8l.onrender.com/docs

⚠️ Render 無料プランではスリープが発生するため、
初回アクセスは 50〜60 秒ほど待ってください。

🏗️ システムアーキテクチャ
<img width="1024" height="559" alt="image" src="https://github.com/user-attachments/assets/f364c308-a9a9-4ba0-90e2-80eff4bac37a" />

このプロジェクトは クライアント(UI) と AI ロジック(サーバー) を明確に分離しています。

🔁 全体的なワークフロー

音声入力 — ブラウザで録音し Blob として送信

文字起こし (Whisper v3) — 日/英に対応、Groq により超高速

インテント判定 (LangGraph) — チャット or 旅行プラン

天気データ取得 (Open-Meteo) — 目的地＋近隣都市を並列処理

構造化生成 — Llama-3.3-70B により Pydantic JSON 生成

Generative UI 描画 — チャットUI / ダッシュボードUI を切替

🛠️ 技術スタック
フロントエンド

Next.js 14 (App Router)

TypeScript

Tailwind CSS

Lucide Icons

カスタム音声レコーダー

Generative UI レイアウト

バックエンド

FastAPI

LangGraph / LangChain

Groq Llama-3.3-70B（ロジック）

Groq Whisper-large-v3（音声 → テキスト）

Pydantic（構造化スキーマ）

Open-Meteo API（天気データ）

💡 注目ポイント
1. LangGraph ステートマシン

Planner と Fetcher の2ノード構成。
条件によってチャットかダッシュボード用データ取得へルーティング。

2. Generative UI

Markdown ではなく、AI が JSON で UI 状態を返す → React で動的描画。

3. Pydantic で JSON 形式を強制

壊れたデータでフロントがクラッシュするのを防止。

4. 非同期での天気データの並列取得

asyncio.gather() で 4 都市を同時取得し高速化。

📂 プロジェクト構成
├── frontend/                
│   ├── app/
│   │   ├── components/      
│   │   │   └── dashboard/   
│   │   └── config/          
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── models/          
│   │   ├── routers/         
│   │   ├── services/        
│   └── ...

🧪 ローカル環境構築
1. バックエンド
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

echo "GROQ_API_KEY=your_groq_key_here" > .env

uvicorn app.main:app --reload --port 9007

2. フロントエンド
cd frontend
npm install
npm run dev

🇺🇸 English Version — Travel & Weather AI Assistant
✈️ Travel & Weather AI Assistant

A voice-enabled, AI-powered travel planner that combines Generative UI, LangGraph, and real-time weather to give you an immersive travel experience.

Not just a chatbot — but a full AI dashboard generator.

🚀 Live Demo

🔗 Frontend (Vercel)
https://travel-assistant-sandy.vercel.app/

🔗 Backend API (Render)
https://travel-assistant-xq8l.onrender.com/docs

⚠️ Backend may take 50–60 seconds to wake up on Render free tier.

🏗️ System Architecture
<img width="1024" height="559" alt="image" src="https://github.com/user-attachments/assets/9eb69ac2-c55f-4590-b8be-8d758b83986c" />

A clean Client–Server Architecture:

Frontend handles UI & audio capture

Backend handles transcription, AI logic, weather fetching, and structured responses

🔁 High-Level Workflow

Voice Input → Browser audio recorder

Transcription → Whisper-large-v3 (Groq)

Intent Recognition → LangGraph router

API Fetching → Open-Meteo (parallel)

Structured Output → Llama-3.3-70B + Pydantic

Generative UI Rendering → Dynamic dashboard UI

🛠️ Tech Stack
Frontend

Next.js 14

TypeScript

Tailwind CSS

Lucide React

Custom Audio Recorder

Dynamic UI Rendering

Backend

FastAPI

LangGraph / LangChain

Groq Llama-3.3-70B

Groq Whisper-large-v3

Pydantic

Open-Meteo

💡 Key Features
1. LangGraph State Machine

Planner + Fetcher nodes with conditional routing.

2. Generative UI

No Markdown.
LLM outputs strict JSON → React renders a Dashboard.

3. Strict JSON Validation (Pydantic)

Protection against malformed responses.

4. Parallel Weather Fetching

Fast multi-city aggregation using asyncio.gather().

📂 Project Structure
(Identical to Japanese version)

🧪 Local Setup
Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

echo "GROQ_API_KEY=your_groq_key_here" > .env

uvicorn app.main:app --reload --port 9007

Frontend
cd frontend
npm install
npm run dev
