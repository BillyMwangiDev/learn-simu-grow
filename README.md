# Learn · Simu · Grow

> A mobile-first Progressive Web App (PWA) built for learners and educators in Kenya — combining structured courses, voice-based lessons, daily quizzes, and a job board in one offline-capable experience.

---

## Screenshots

| Home | Courses | Voice Lesson |
|------|---------|--------------|
| ![Home screen showing greeting, streak stats, and quick actions](screenshots/Screenshot%202026-03-30%20205355.png) | ![All Courses page listing 5 subjects](screenshots/Screenshot%202026-03-30%20205414.png) | ![Voice Lesson page with mic prompt](screenshots/Screenshot%202026-03-30%20205427.png) |

| Job Board | Quick Quiz |
|-----------|------------|
| ![Job Board with search and filter](screenshots/Screenshot%202026-03-30%20205440.png) | ![Quick Quiz with multiple choice questions](screenshots/Screenshot%202026-03-30%20205523.png) |

---

## Features

| Feature | Description |
|---------|-------------|
| **Onboarding** | Name, role (Learner / Teacher), language, and offline opt-in |
| **Home Dashboard** | Streak counter, points, lessons-done stats, continue-learning card, quick-action shortcuts |
| **Course Catalogue** | 5 subjects (Alphabet & Reading, Numbers & Maths, Computer Basics, Kiswahili Basics, Science & Nature) |
| **Video Player** | Playback with captions toggle, transcript drawer, playback speed control, and progress tracking |
| **Voice Lesson** | Web Speech API — read a prompt aloud and earn points for correct pronunciation |
| **Quick Quiz / Assessment** | Multiple-choice questions with high-score tracking and badge awards |
| **Teacher Upload** | TSC-verified content upload with simulated verification status |
| **Job Board** | 12 real-style Kenyan job listings with keyword search, location/type filters, and offline-queued applications |
| **Gamification** | Points system, badges (First Lesson, 5/10 Lessons Done, Century Club, Top Scorer, Verified Teacher) |
| **Offline / PWA** | Service Worker with cache-first strategy; queued job applications sync on reconnect |
| **i18n** | Full English / Kiswahili UI toggle persisted in app state |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite 8 (SWC) |
| Routing | React Router DOM v6 |
| UI components | shadcn/ui (Radix UI primitives) |
| Icons | Phosphor Icons + Lucide React |
| Styling | Tailwind CSS v3 |
| State | React Context + `localStorage` persistence |
| Data fetching | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Speech | Web Speech API (`SpeechRecognition`) |
| PWA | Custom Service Worker (`public/sw.js`) |

---

## Project Structure

```
learn-simu-grow/
├── public/
│   └── sw.js                  # Service Worker (cache-first PWA)
├── screenshots/               # App screenshots used in this README
├── src/
│   ├── components/
│   │   ├── MobileShell.tsx    # Root mobile frame (bottom nav, header)
│   │   ├── ProgressBar.tsx
│   │   └── Waveform.tsx       # Animated mic waveform for Voice Lesson
│   ├── data/
│   │   ├── content.ts         # Course & lesson definitions
│   │   ├── questions.ts       # Quiz question bank
│   │   └── teachers.ts        # Uploaded teacher content stubs
│   ├── hooks/
│   │   └── useSpeechRecognition.ts
│   ├── pages/
│   │   ├── Onboarding.tsx
│   │   ├── Home.tsx
│   │   ├── Category.tsx       # Course catalogue
│   │   ├── Course.tsx         # Lesson list for a course
│   │   ├── Player.tsx         # Video/audio lesson player
│   │   ├── VoiceLesson.tsx
│   │   ├── Assessment.tsx     # Quiz
│   │   ├── TeacherUpload.tsx
│   │   └── Jobs.tsx
│   ├── state/
│   │   └── AppContext.tsx     # Global state (language, points, streaks, badges …)
│   └── App.tsx                # Route definitions
├── index.html
├── tailwind.config.ts
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9 (or Bun)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/learn-simu-grow.git
cd learn-simu-grow

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Build for Production

```bash
npm run build       # outputs to dist/
npm run preview     # serve the production build locally
```

### Lint

```bash
npm run lint
```

---

## PWA / Offline Support

The app ships a custom Service Worker (`public/sw.js`) that:

- Pre-caches the app shell on install
- Uses a **cache-first** strategy for static assets
- Falls back to the network for dynamic requests
- Queues job applications made offline and flushes them automatically when the connection is restored

To test offline mode, open DevTools → Application → Service Workers → check "Offline", or toggle the in-app offline switch on the Home screen.

---

## Gamification & State Persistence

All progress is persisted to `localStorage` under the key `lsw_app_state_v2`:

| Key | Description |
|-----|-------------|
| `points` | Earned by completing lessons (+20) and quiz questions (+10 per point above previous high score) |
| `streakDays` | Incremented when the user is active on consecutive calendar days |
| `completedLessons` | Array of lesson IDs; drives the lessons-done counter |
| `lessonProgress` | Map of `lessonId → 0-100` (highest seen value) |
| `highScores` | Map of `quizId → score` |
| `badges` | Unlocked badge names; badges are awarded automatically by business rules in `AppContext` |
| `queuedApplications` | Job applications pending sync |

---

## Internationalisation

The app supports **English** and **Kiswahili** via a lightweight i18n layer in `AppContext.tsx`. The language choice is persisted in app state and can be toggled from the header language switcher at any time.

---

## Roadmap

- [ ] Backend API + user accounts (replace `localStorage`)
- [ ] Real video/audio content delivery (CDN)
- [ ] Push notifications for streak reminders
- [ ] Teacher dashboard with upload moderation queue
- [ ] Integration with Kenya's TSC (Teachers Service Commission) verification API
- [ ] Expanded job board with live KNEC / government listings

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## License

MIT © Learn Simu Grow contributors
