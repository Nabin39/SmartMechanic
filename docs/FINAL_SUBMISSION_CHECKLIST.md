# Final submission checklist (repository copy)

Tick items in Markdown (`[x]`) as you complete them. A duplicate checklist appears in the assistant delivery message for convenience.

## App development

- [ ] Functional mobile app created  
- [ ] Clear navigation between screens  
- [ ] All required screens implemented  
- [ ] Data passes between screens (mechanic → booking → details)  
- [ ] Firebase Authentication implemented  
- [ ] Firestore implemented (`users`, `mechanics`, `bookings`)  
- [ ] Firebase Test Lab plan / evidence placeholders prepared  
- [ ] SQLite cache implemented  
- [ ] GPS / location feature implemented  
- [ ] Maps integration implemented  
- [ ] Camera / photo workflow implemented  
- [ ] Notifications implemented (local baseline)  
- [ ] Background task implemented (`backgroundSyncService`)  
- [ ] Parallel / async patterns documented in code  
- [ ] Battery-aware approach documented (`Settings`, README)  
- [ ] AdMob test placements included  
- [ ] APK / build instructions documented (`README`, EAS)  

## Code quality

- [ ] Clean `/src` structure  
- [ ] Components separated from screens  
- [ ] Services separated from UI  
- [ ] No hard-coded secrets (use `.env`)  
- [ ] `.gitignore` excludes sensitive files  
- [ ] Useful comments on security / async sections  
- [ ] Error handling & loading states  
- [ ] Form validation  

## Agile & collaboration

- [ ] Three sprints documented (`docs/AGILE_SPRINTS.md`)  
- [ ] User stories + acceptance criteria recorded  
- [ ] Task allocation guidance captured  
- [ ] GitHub workflow documented (`README`, `evidence/github-commits/`)  
- [ ] Azure DevOps evidence guidance (`evidence/azure-devops/`)  

## Testing

- [ ] Jest unit tests (`src/tests/unit`)  
- [ ] Jest integration-style test (`src/tests/integration`)  
- [ ] E2E structure (`src/tests/e2e`, `maestro/`)  
- [ ] Firebase Test Lab instructions (`docs/TESTING_AND_DEPLOYMENT_REPORT.md`)  
- [ ] Evidence folders populated before zip submission  

## Documentation & presentation

- [ ] `README.md`  
- [ ] `docs/USER_MANUAL.md`  
- [ ] `docs/TESTING_AND_DEPLOYMENT_REPORT.md`  
- [ ] `docs/FIREBASE_EXPLANATION.md`  
- [ ] `docs/LIMITATIONS_AND_FUTURE.md`  
- [ ] `docs/PITCH_PRESENTATION.md`  
- [ ] Presentation rehearsal logged (optional Teams note)  

## Packaging

- [ ] Zip archive excludes `.env`, keystores, `node_modules` (optional)  
- [ ] Include PDF exports of manuals/reports if required by rubric  
- [ ] Upload APK + evidence to learning management system per instructor instructions  
