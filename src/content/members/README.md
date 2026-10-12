# Team Members Content Directory

This directory stores personalized folders for each member of the capstone collective.

## How It Works
The system dynamically scans this directory at build/runtime. When you create a new folder here, the system **automatically**:
1. Adds the member to the **Collective Overview** page (`/team`).
2. Generates an interactive **Dossier Page** for them (`/team/<member-slug>`).
3. Adds their name and portrait hover preview to the **Sidebar Directory**.
4. Includes their portrait on the **Home Page** preview strip.

---

## Adding or Editing a Member

To add a new member:
1. Duplicate the `_template` folder or create a new folder named after the member's identifier (e.g. `alex-tan/`).
2. Add the following files into the folder:
   - `profile.json`: The metadata file containing your bio, pillar, stack, artifacts, etc.
   - `portrait.jpg` (or `.png`): Your portrait photo.
   - One or more portfolio/CV documents (PDF or image).

### Example `profile.json` (Single Portfolio)
```json
{
  "id": "alex-tan",
  "index": "08",
  "name": "Alex Tan",
  "pillar": "Frontend Specialist // Interface Systems",
  "pitchReady": true,
  "portrait": "portrait.jpg",
  "portfolio": "portfolio.pdf",
  "stack": ["React", "TypeScript", "TailwindCSS", "Next.js"],
  "summary": "Your executive summary or bio paragraph.",
  "artifacts": [
    {
      "title": "PROJECT NAME — Subtitle",
      "year": "2026",
      "category": "Systems Engineering",
      "description": "Short description of the artifact."
    }
  ],
  "whyMe": "Why you are specifically valuable on this capstone.",
  "contact": "alex@syndicate.capstone"
}
```

### Example `profile.json` (Multiple Portfolios / Documents)
If you have multiple documents (e.g. CV, architecture deck, whitepaper), define a `portfolios` array. The system automatically creates interactive selector tabs on your dossier page:
```json
{
  "portfolios": [
    {
      "title": "Systems Architecture Dossier",
      "file": "architecture-deck.pdf",
      "category": "Architecture"
    },
    {
      "title": "Executive Curriculum Vitae",
      "file": "cv.pdf",
      "category": "CV"
    },
    {
      "title": "Telemetry Research Whitepaper",
      "file": "telemetry-paper.pdf",
      "category": "Research"
    }
  ]
}
```
*(You can also simply write `"portfolios": ["cv.pdf", "architecture.pdf"]` and titles will be auto-formatted).*

> **Note**: Folders starting with an underscore (e.g., `_template`) are ignored automatically.
