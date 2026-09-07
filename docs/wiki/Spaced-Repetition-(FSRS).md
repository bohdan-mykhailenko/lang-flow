# ⏱️ Spaced Repetition (FSRS Engine)

LangFlow utilizes the **Free Spaced Repetition Scheduler (FSRS)** algorithm rather than legacy SM-2 curves.

---

## 📈 Why FSRS?

Legacy SRS algorithms (like SuperMemo SM-2) use rigid, static multipliers that do not account for individual memory decay variations. FSRS provides:

- **Stability ($S$)**: Time (in days) for retention probability to decrease from 100% to 90%.
- **Difficulty ($D$)**: Inherent complexity of the linguistic item (1.0 to 10.0 scale).
- **Retrievability ($R$)**: Probability of successfully recalling the word at any given moment.

---

## 🎮 Review Ergonomics & Controls

Active recall study sessions support both desktop keyboard bindings and mobile gestures:

| Key     | Rating                | Interval Impact                                                         |
| :------ | :-------------------- | :---------------------------------------------------------------------- |
| `1`     | **Again**             | Lapses counter increments; card enters `Relearning` state (10m review). |
| `2`     | **Hard**              | Stability multiplier adjusted with minimal interval growth.             |
| `3`     | **Good**              | Standard FSRS stability curve progression.                              |
| `4`     | **Easy**              | Accelerated interval growth and difficulty reduction.                   |
| `Space` | **TTS Pronunciation** | Native browser Web Speech API audio in target locale (`bg-BG`).         |
