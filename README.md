#  MedGuard AI  
### AI-powered Emergency Triage & Smart Hospital Routing Assistant

MedGuard AI is a decision-support system designed to help users make fast, informed, and safer decisions during medical emergencies.

It transforms raw symptoms into structured triage insights and routes users to the most appropriate healthcare facility — not just the nearest one.

##  Live Demo
[https://your-demo-link.vercel.app](https://medguard-ai-git-main-worodhazims-projects.vercel.app/)
---

# Core Concept

Most people in emergencies ask:

> “Where should I go right now?”

MedGuard AI answers:

> “Based on your condition, THIS is the safest and fastest medical destination — and here’s why.”

---

#  What Makes This Different?

Unlike:
-  hospital directories  
-  symptom checkers  

MedGuard AI is:

**A real-time decision support system**  
that combines:
- triage logic
- urgency classification
- specialty matching
- contextual routing

---

#  System Workflow (VERY IMPORTANT)

##  Full Decision Flow

User Input --> Symptom Analysis --> Urgency Classification --> Clinical Specialty Matching -> Scoring Engine --> Best Facility Selection --> AI Explanation Generation --> Comparison + Map Visualization

---

#  Internal Logic Flow (Chart)

Symptoms → Weight Score
Urgency → Risk Multiplier
Specialty → Match Score
Distance → Penalty
Availability → Boost

Final Score =
(Symptoms + Specialty + Urgency)

Distance
Availability

<img width="1536" height="1024" alt="workflow" src="https://github.com/user-attachments/assets/27655967-7310-488a-86ee-a8656e08b89b" />

---

#  Architecture Overview

Frontend (Next.js) --> State Management (React) --> Triage Engine (Rule-Based Logic) --> Decision Generator --> UI Rendering (AI Panel + Map + Comparison)

<img width="1536" height="1024" alt="Architacture_overview" src="https://github.com/user-attachments/assets/30b40afb-d6d7-46eb-b2c5-918957d489bb" />

---

#  User Flow (Step-by-Step)

## 1️ Symptoms
- Select from categories
- AI suggests related symptoms

## 2️ Urgency
- Routine / Urgent / Emergency
- Affects risk level + routing

## 3️ Specialty
- Cardiac / Trauma / Stroke / General

## 4️ Patient Context
- Age (optional)
- Location (required)

## 5️ Decision Trigger
- System analyzes inputs
- Generates final recommendation

---

#  AI Decision Model (Explainable)

The system produces:

-  Best hospital
-  Risk level
-  Confidence score
-  Clinical reasoning
-  Distance + time
-  Alternative options

---

#  Example Output

> “High-risk trauma case detected.  
> Level 1 trauma center selected due to specialization and proximity.”

---

#  Safety & Trust Layer

MedGuard AI includes:

- ✔ No data persistence
- ✔ Privacy-first approach
- ✔ Clinical disclaimer
- ✔ Emergency alert triggers
- ✔ Fallback logic for uncertainty

---

#  Fallback System (Critical Thinking)

If system is unsure:

No strong match →
Recommend nearest major hospital →
Show safety reasoning


---

#  Smart Features

###  Scenario Simulator
- Adjust urgency dynamically
- See how decision changes

###  Facility Comparison
- Distance
- Availability
- Clinical score

###  Tactical Routing Map
- Patient location
- Best match
- Alternatives

---

#  Screenshots

##  Homepage

<img width="1793" height="977" alt="Screenshot 2026-04-23 at 2 57 49 PM" src="https://github.com/user-attachments/assets/471b03e0-1e07-4173-83d7-ea303cd5be01" />


##  Step Flow
<img width="1795" height="626" alt="Screenshot 2026-04-23 at 2 58 18 PM" src="https://github.com/user-attachments/assets/e60ad7d2-5725-4c0c-afca-4bb3a719d00b" />


##  AI Decision Panel

<img width="1785" height="764" alt="Screenshot 2026-04-23 at 2 58 31 PM" src="https://github.com/user-attachments/assets/c0d87759-d8cd-4131-afbe-b3b0171b45c5" />


##  Map + Comparison
<img width="1798" height="1043" alt="Screenshot 2026-04-23 at 2 58 47 PM" src="https://github.com/user-attachments/assets/346bbdf2-515a-424a-89e3-75f3d45a42b9" />

<img width="1594" height="627" alt="Screenshot 2026-04-23 at 3 12 17 PM" src="https://github.com/user-attachments/assets/636a86e4-e71f-4980-a365-20667d6c29e1" />




---

#  Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS

---

# Validation & Error Handling

- Required fields enforcement
- Disabled progression if incomplete
- User-friendly error states
- Safe fallback recommendations
- No crashes or blank screens

---

#  Security Considerations

Key risks addressed:

- Prompt injection (future-ready)
- Data exposure prevention
- Safe logging (no sensitive data)
- Controlled UI inputs

---

#  Demo Strength

This project demonstrates:

- Strong UX flow
- Explainable AI decisions
- Real-world problem solving
- High-quality frontend execution
- System-level thinking

---

#  Future Improvements

- Real hospital APIs
- Live availability
- Ambulance integration
- Voice input
- AI model integration
- Pediatric routing
- Smart alerts

---

#  Disclaimer

MedGuard AI is a **decision-support tool** and does not replace professional medical advice.


