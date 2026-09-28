# VLC 2027 — Agentic Christian Camp Signup Platform

Official agentic registration and live delegation analytics portal for **VLC 2027** (*Vision Leadership Camp*).

> **Theme**: *"Arise, shine, for your light has come, and the glory of the Lord rises upon you."* — **Isaiah 60:1**

Built with **Vite + React (TypeScript)**, **Tailwind CSS v4**, **Cloudflare Pages**, **Cloudflare D1 (Serverless SQLite)**, and a **Hybrid AI Engine** combining **Cloudflare Workers AI** and **Google Gemini API**.

---

## 🌟 Key Features

### 1. Unique Church Invite Links & Delegation Tracking
- Every partner church receives a dedicated invite slug (e.g., `/?church=victory-qc` or `/?church=victory-bgc`).
- Opening an invite link automatically binds registrations to the church's delegation, shows their pastor's welcome, and tracks real-time progress against target quotas.
- A built-in **Church Directory** allows delegates and ministry heads to search churches, view capacity, and copy 1-click shareable links.

### 2. "Vicky" — The Conversational AI Camp Guide
An intelligent, faith-filled agentic signup wizard with a 7-step interactive workflow:
1. **Church Confirmation**: Automatically matched from invite link or chosen from directory.
2. **Participant Role Categorization**:
   - 🔵 *Regular Camper*
   - 🟢 *First-Timer Camper* (Special welcome kit & counselor attention)
   - 🟣 *Cabin Leader / Counselor*
   - 🟠 *Camp Staff / Ops & Logistics*
   - 🟡 *Pastor / Minister*
   - 🟣 *Worship & Creative Arts*
   - 🔴 *Medical / First Aid*
3. **Identity & Demographics**: Name, Badge Nickname, Age, Gender, Email, Mobile / WhatsApp, Province, City.
4. **Health, Merch & Camp Safety**: T-shirt size (XS to 3XL), dietary restrictions/allergies, emergency contact person & relationship.
5. **Interactive Selfie Photo Snapper**: Live in-browser webcam capture with 3-second countdown and image crop, or file upload fallback for the camper's official pass.
6. **Ministry Interests & Gifts**: Curated multi-select tag cloud covering Creative Arts, Media/Tech, Care/Hospitality, NextGen, and Camp Operations.
7. **Spiritual Anchor & Favorite Scripture**: Favorite Bible verse picker with real-time AI reflection.

### 3. Hybrid AI Engine: Cloudflare Workers AI + Google Gemini
- **Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct`)**: Runs directly on Cloudflare edge network with ultra-low latency for turn-by-turn chat guidance, dynamic data extraction, and role matchmaking.
- **Google Gemini API (`gemini-1.5-flash`)**: Delivers deep theological reflection, pastoral encouragement connecting their favorite verse to camp, and tailored viral invite copy.
- **Zero-Block Fallback**: Resilient offline/local fallbacks ensure registration never breaks even without active API keys or when developing locally.

### 4. Live Summary Landing Page & Visual Analytics
- Real-time signup counter vs. camp capacity (e.g. 600 slots) with animated progress bar.
- **Signups by Church Leaderboard**: Ranked partner churches with target quotas and instant invite link copy buttons.
- **Geographic Breakdown**: Visual distribution by province across Luzon, Visayas, and Mindanao.
- **Delegation Role Breakdown**: Visual breakdown of campers, counselors, pastors, volunteers, and medics.
- **Live Recent Signups Ticker**: Displays recent campers' nicknames, churches, and favorite verses.

### 5. Post-Signup Digital Camp Pass & Viral Referral CTA
- Generates an official, photorealistic **Digital Camp ID Pass** (lanyard badge style) with camper photo, role badge, QR check-in code, and scripture quote.
- **1-Click Viral Invite**: Instant sharing via WhatsApp, Telegram, SMS, and clipboard with personalized invite copy.
- **Direct Friend Nomination**: Camper can invite friends directly via email or mobile.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Local Cloudflare D1 Database
Execute the database schema and seed data into your local D1 SQLite database:
```bash
npm run d1:init
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

Try testing church invite links:
- `http://localhost:5173/?church=victory-qc`
- `http://localhost:5173/?church=victory-bgc`
- `http://localhost:5173/?church=victory-cebu`

---

## ☁️ Cloudflare Pages & D1 Deployment

### 1. Create Remote D1 Database in Cloudflare
```bash
npx wrangler d1 create vlc2027-camp-db
```
Copy the generated `database_id` into `wrangler.jsonc`.

### 2. Apply Schema & Seed to Remote Cloudflare D1
```bash
npx wrangler d1 execute vlc2027-camp-db --remote --file=./d1/schema.sql
npx wrangler d1 execute vlc2027-camp-db --remote --file=./d1/seed.sql
```

### 3. Set Gemini API Secret (Optional for enhanced reflections)
```bash
npx wrangler pages secret put GEMINI_API_KEY
```

### 4. Build & Deploy to Cloudflare Pages
```bash
npm run deploy
```

---

## 📁 Project Structure

```
├── d1/
│   ├── schema.sql            # Cloudflare D1 SQLite database tables & indexes
│   └── seed.sql              # Initial partner churches and sample registrations
├── functions/api/            # Cloudflare Pages Functions
│   ├── agent.ts              # Hybrid AI (Cloudflare Workers AI + Gemini API)
│   ├── churches.ts           # Church list & slug lookup with D1 counts
│   ├── invite.ts             # Referral tracking
│   ├── signup.ts             # Camper registration endpoint into D1
│   └── stats.ts              # Live summary metrics & geographic aggregations
├── src/
│   ├── components/
│   │   ├── AgenticSignup/
│   │   │   └── AgenticSignupModal.tsx  # Interactive AI signup wizard
│   │   ├── CampPassCard.tsx            # Digital lanyard badge with QR & selfie
│   │   ├── ChurchDirectory.tsx         # Partner churches & unique invite links
│   │   ├── Header.tsx                  # Header with countdown & active church pill
│   │   ├── InviteFriendModal.tsx       # Post-signup viral referral CTA
│   │   ├── LiveDashboard.tsx           # Real-time summary landing page
│   │   └── SelfieCapture.tsx           # Webcam capture & photo uploader
│   ├── services/
│   │   └── api.ts                      # Full API client with reactive offline fallback
│   ├── types/
│   │   └── index.ts                    # TypeScript definitions
│   ├── App.tsx                         # Main view orchestrator & URL slug listener
│   ├── index.css                       # Tailwind CSS v4 styling & animations
│   └── main.tsx                        # React application entry point
├── wrangler.jsonc            # Cloudflare Pages & D1 bindings configuration
└── vite.config.ts            # Vite 8 + React + Tailwind v4 config
```
