# 🛡️ MedGuard AI

**AI-powered emergency hospital recommendation system for paramedics and emergency dispatch units.**

MedGuard analyses patient condition, case type, urgency level, and location to instantly recommend the most suitable hospital — reducing critical decision time and improving patient outcomes.

---

## ✨ Current Features

- **Structured Patient Input Form** — Case summary, symptoms, urgency selector, case type cards, age, location, and notes
- **Interactive Urgency Selector** — Click-to-select LOW / MEDIUM / CRITICAL with colour-coded visual feedback
- **Case Type Cards** — Cardiac, Trauma, Stroke, Other — each with icon and subtitle for quick paramedic understanding
- **Real-time AI Recommendation Panel** — Results update dynamically after clicking "Find Best Hospital"
- **Rich Hospital Cards** — Hospital name, type, distance, travel time, availability badge, and tailored reasons
- **Alternative Hospital Suggestion** — Secondary option always shown for informed decision-making
- **Dynamic Priority Banner** — Colour and messaging changes based on selected urgency
- **Confidence Score** — Displayed alongside every recommendation
- **Rule-based Recommendation Engine** — Scores 4 mock Abu Dhabi hospitals across specialty, availability, distance, and patient age
- **Structured API Response** — Rich JSON from `/api/recommend` drives the entire output panel

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

No environment variables or external API keys are required.

---

## 🏗️ Project Structure

```
medguard/
├── app/
│   ├── page.tsx              # Main UI — patient input + recommendation panel
│   ├── layout.tsx            # Root layout with metadata
│   ├── globals.css           # Global styles + shared field-input utility
│   └── api/
│       └── recommend/
│           └── route.ts      # POST /api/recommend — validates input & calls engine
├── lib/
│   └── recommendation.ts     # Rule-based engine, hospital data, scoring logic
└── README.md
```

---

## 🧠 Recommendation Logic Overview

The recommendation engine (`lib/recommendation.ts`) is entirely rule-based and requires no external API.

**Scoring system (per hospital):**

| Factor | Points |
|---|---|
| Primary specialty matches case type | +50 |
| Availability = High | +20 |
| Availability = Medium | +10 |
| Distance penalty (critical cases weighted 2× harder) | −variable |
| Symptom keyword match (e.g. "chest pain" → cardiac) | +15 |
| Elderly patient (≥65) + cardiac/stroke specialty | +10 |

**Hospital pool (mock data, Abu Dhabi region):**
1. Sheikh Khalifa Medical City (SKMC) — Cardiac & Stroke specialist
2. Burjeel Medical City (BMC) — Level 1 Trauma
3. Cleveland Clinic Abu Dhabi (CCAD) — Academic, Stroke & Cardiac
4. Al Zahra Hospital (AZH) — General multi-speciality

**API Response Shape:**
```json
{
  "recommendation": "Immediate transfer required — SKMC is the optimal destination for this cardiac emergency.",
  "hospitalName": "Sheikh Khalifa Medical City",
  "hospitalShortName": "SKMC",
  "hospitalType": "Cardiac & Stroke Centre of Excellence",
  "priority": "CRITICAL",
  "distance": "1.4 km",
  "travelTime": "6 min",
  "availability": "High",
  "why": ["Specialized Cardiac ICU", "Advanced Cath Lab (24/7)", "..."],
  "alternativeHospital": { "name": "...", "distance": "...", "..." },
  "confidence": "98%",
  "urgencyColor": "red"
}
```

---

## 📅 Day 4 Progress

### What was built / improved in Day 4

| Area | Change |
|---|---|
| **Patient Input UX** | Replaced plain textarea-only form with a fully structured panel: case summary, urgency selector cards, case type icon cards, age/location grid, notes field |
| **Case Type Cards** | Redesigned with icon, label, and subtitle — clear, clickable, spacious |
| **Urgency Selector** | Interactive click-to-select buttons (replaces dropdown), colour-coded with glow states |
| **Recommendation Panel** | Now fully driven by API response — hospital name, type, why-list, priority, alternative, confidence, travel time all update on click |
| **Backend Logic** | Rewrote `/api/recommend` to call a structured scoring engine in `lib/recommendation.ts` |
| **API Response** | Changed from a single plain string to a rich JSON object with 10+ fields |
| **Priority Banner** | Dynamically reflects urgency level with matching colour and messaging |
| **Error Handling** | 400 for missing/invalid fields, 500 for unexpected failures, inline error display in UI |
| **Code Quality** | Extracted recommendation logic into `lib/recommendation.ts`; removed duplicated JSX; cleaned malformed nesting |
| **SEO / Metadata** | Updated page title and description |
| **CSS** | Added `field-input` utility class; locked dark background at root level |

### What remains as future work

- [ ] Replace rule-based engine with LLM (e.g. Gemini / GPT-4o) via system prompt wrapping the same structured I/O
- [ ] Integrate real hospital availability from live APIs (e.g. DoH UAE data)
- [ ] Add real geocoding / routing (e.g. Google Maps Distance Matrix API)
- [ ] User authentication for paramedic accounts
- [ ] Case history log / audit trail
- [ ] Mobile-first responsive layout for field tablet usage
- [ ] Offline-capable PWA wrapper

---

> **Note:** This version is intentionally rule-based to remain fully local and free. The structured request/response contract in `lib/recommendation.ts` is designed for a straightforward LLM drop-in replacement in the next phase.
