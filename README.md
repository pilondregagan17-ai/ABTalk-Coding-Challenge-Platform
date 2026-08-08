# Website:

https://abtalk.netlify.app/

# AI Input Logs File is in repository as PROMPTS.md

# Website Information:
# 🚀 AlgoPioneers | ABTalk Redesign Challenge | Coding Challenge Platform

An advanced algorithmic practice, coding challenge, and competition platform with real-time testcase execution, Google Authentication, Cloud Firestore sync, dynamic 100% Beats percentile calculations, and custom challenge creation.

---

## 🌟 Key Features

- **⚡ Multi-Language IDE Workspace**:
  - Sandboxed execution for JavaScript & TypeScript.
  - Reference-validated execution for Python 3, C++ 20, and Java 21.
  - Interactive testcase runner with stdout console interception and diff viewer.
- **🏆 100% Real-Time Beats Percentile Engine**:
  - Pioneers who submit the fastest runtime or lowest memory usage achieve **`Beats 100.0% 🏆`**.
  - Dynamic benchmarking calculated against historical database submissions.
- **🔑 Google Authentication via Firebase SDK**:
  - Direct popup Google OAuth sign-in (`signInWithPopup`).
  - Automatically loads your Google Display Name, verified avatar photo, and Firebase UID.
- **🔥 Cloud Firestore Backend Integration**:
  - `submissions`: Records execution time, memory usage, status, code, and user UID.
  - `users`: Tracks practice streaks, solved counts, and 365-day activity heatmaps.
  - `problem_stats`: Computes real-time global acceptance rates.
  - `discussions`: Real-time community solutions and discussion threads.
- **⚔️ Timed Contest Arena & Standings**:
  - Live countdown timer with dynamic point scoring and penalty tracking.
- **🛠️ Custom Challenge Creator Wizard**:
  - Build custom problems with automated testcases, input/output validation, and JSON package export/import.
- **🤖 Pioneer AI Code Doctor**:
  - Socratic hints, edge-case debugging, and Big-O asymptotic complexity analysis.
- **⌨️ Global Keyboard Shortcuts**:
  - `Ctrl + K` / `⌘K`: Quick search dialog.
  - `Ctrl + Enter`: Run visible testcases.
  - `Ctrl + Shift + Enter`: Submit solution for grading.
  - `Ctrl + H`: Open AI Assistant.
  - `Ctrl + U`: Upload solution / Import problem package.
  - `Alt + 1..5`: Quick tab navigation.
  - `ESC`: Dismiss all modals.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React
- **Backend & Auth**: Firebase Auth (Google OAuth), Cloud Firestore
- **Deployment**: Firebase Hosting

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/pilondregagan17-ai/ABTalk-Coding-Challenge-Platform.git
cd ABTalk-Coding-Challenge-Platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment file and add your Firebase credentials:
```bash
cp .env.example .env
```

Fill in your `.env` file:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Run Locally
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

---

## 📦 Deployment to Firebase Hosting

```bash
# Build the production bundle
npm run build

# Deploy to Firebase
firebase deploy
```

---

## 📄 License
MIT License
