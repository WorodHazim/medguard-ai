# MedGuard AI

MedGuard is an AI-powered emergency hospital decision assistant.  
It helps ambulance teams choose the most suitable hospital based on patient symptoms, urgency, distance, and hospital capability.

## Current Features
- Modern emergency dashboard UI
- Patient symptoms input form
- Urgency level selection
- Recommendation API route
- Live recommendation displayed on the interface

## Tech Stack
- Next.js
- Tailwind CSS
- TypeScript
- Rule-based backend logic (current prototype)
- OpenAI API (planned for future enhancement)

## How to Run

```bash
npm install
npm run dev

Then open:

http://localhost:3000
API Endpoints
Recommendation API
POST /api/recommend

Example request body:

{
  "symptoms": "severe chest pain",
  "urgency": "critical"
}

Example response:

{
  "recommendation": "Go to Cardiac Emergency Hospital immediately."
}
Current Project Status
Day 1: project idea and concept defined
Day 2: environment setup, repository, and initial UI created
Day 3: recommendation logic implemented and connected to the UI
Notes
.env.local is used only for local secrets
Secrets should never be pushed to GitHub
Current recommendation logic is rule-based and will later be upgraded to AI/LLM reasoning
