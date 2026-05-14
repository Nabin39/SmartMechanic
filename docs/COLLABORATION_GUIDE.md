# Collaboration guide (GitHub + Azure DevOps)

## GitHub workflow

1. **Repository:** create `smart-mechanic` (private or public). Add partner as collaborator with **Write** access.  
2. **Branching:** `main` protected; feature branches `feature/sprint<number>-topic`.  
3. **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`). Aim for ≥2 commits per contributor per sprint (screenshot `evidence/github-commits/`).  
4. **Pull requests:** even if fast-forward merges are allowed, open PRs to narrate intent; attach checklist of tests executed.  
5. **Issues:** map user story IDs (`S2-01`) to GitHub issues for traceability.

## Azure DevOps Boards

1. Create project **SmartMechanicCoursework**.  
2. Areas: `Mobile`, `Docs`, `QA`.  
3. Iterations aligned to Weeks 3–5, 6–8, 9–11.  
4. Import user stories from `docs/AGILE_SPRINTS.md`.  
5. Add child **Tasks** (dev, QA, documentation). Assign capacity per student.  
6. Capture screenshots: **Boards → Sprints**, **Work → Queries → Assigned to me**, **Test Plans → Test Suite** (if used). Store under `evidence/azure-devops/`.

## MS Teams (optional)

Maintain a channel `#smart-mechanic` with weekly meeting notes + links to PRs. Export a PDF snippet for evidence.

## Individual contribution evidence

Each student should export:

- GitHub **Contributors** graph (last 30 days).  
- Two PR descriptions they authored.  
- Short reflection paragraph in the final PDF tying commits to sprint goals.
