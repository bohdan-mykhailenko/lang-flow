# UI/UX & Design Philosophy

## 1. Aesthetic Standards

LangFlow must look and feel like a modern, state-of-the-art language learning tool (comparable to Linear, Supabase, and Raycast).

- **Theme**: Dark-mode first with deep slate/zinc backgrounds (`#0B0F17`, `#111827`, `#1F2937`), subtle glassmorphism borders (`rgba(255, 255, 255, 0.08)`), and vibrant linguistic accent gradients (emerald/cyan for Slavic roots, violet/amber for grammar aspects).
- **Typography**: Clean, geometric sans-serif fonts optimized for Cyrillic and Latin typography (e.g. _Outfit_, _Inter_, _Plus Jakarta Sans_). Target Bulgarian Cyrillic text must have high readability and clear contrast.
- **Micro-Interactions**:
  - Tactile card flip animations.
  - Hover states with smooth scale transforms (`scale(1.02)`).
  - Audio wave pulsating indicators when pronunciation is playing.
  - Progress counters with animated numbers and review completion confetti/praise.

---

## 2. Flashcard Active-Recall Interface

The core study loop is the focal point of the application:

```
┌────────────────────────────────────────────────────────┐
│  Deck: Bulgarian Spoken B1     Card 14 / 32   [ 🔊 TTS ]│
├────────────────────────────────────────────────────────┤
│                                                        │
│                      свиквам                           │
│                 [ глагол • несвършен ]                 │
│                                                        │
│       (Press Space or Click to reveal context)         │
│                                                        │
├────────────────────────────────────────────────────────┤
│  [1] Again (10m)   [2] Hard (1d)   [3] Good (3d)   [4] Easy (7d) │
└────────────────────────────────────────────────────────┘
```

### When Flipped (Reverse Side):

- **Translation**: Contextual Ukrainian equivalent (e.g., _звикати_).
- **In-Situ Context**: The authentic dialogue sentence extracted from the transcript with the target word highlighted.
- **Etymology Badge**: Slavic root comparison, false friend alerts (_⚠️ False Friend_), or Ottoman/French loanword origin.
- **Source Link**: One-click jump to the full archived source transcript.

---

## 3. Responsive & Touch Experience

- **Desktop**: Full multi-column dashboard, keyboard shortcut bindings, side-by-side transcript viewer and AI tutor.
- **Mobile / Tablet**: Large touch targets for FSRS rating buttons (minimum 48px height), swipe gestures for card flipping and rating, sticky bottom action bar.

---

## 4. Audio & Speech Accessibility

- **Web Speech API**: Zero-latency native browser speech synthesis using Bulgarian voice locales (`bg-BG`).
- **Visual Feedback**: Audio waveform / speaker icon animates while speaking.
- **Configurable Auto-Play**: Option in user preferences to automatically pronounce target words upon card presentation.
