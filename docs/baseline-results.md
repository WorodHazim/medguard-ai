# MedGuard Baseline Results

Current baseline:
- The system accepts symptoms and urgency from the UI
- Sends them to the backend recommendation API
- Returns a recommendation in real time

Tested examples:
- chest pain -> cardiac recommendation
- accident -> trauma recommendation
- general symptoms -> general hospital recommendation

Baseline quality:
- Rule-based logic works for simple mapped cases
- UI and backend integration is functional
- Recommendation output updates live on the screen