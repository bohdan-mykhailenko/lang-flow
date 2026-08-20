# GitHub Projects & Kanban Discipline

## 1. Board & Column Structure
LangFlow uses **GitHub Projects v2** (`https://github.com/users/bohdan-mykhailenko/projects/1`).

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Backlog   │ ──► │    Todo     │ ──► │ In Progress │ ──► │  In Review  │ ──► │    Done     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

- **Backlog**: Candidate stories, feature ideas, and technical debt.
- **Todo**: Prioritized stories ready for immediate pickup in the active milestone.
- **In Progress**: Currently active implementation task/branch. *Move here BEFORE the first commit.*
- **In Review**: Implementation complete, verification passed, post-implementation audit ready.
- **Done**: Merged into `main` and verified.

---

## 2. Issue Hierarchy & Conventions

1. **User Stories (`type: story`)**:
   - High-level value delivery for the language learner.
   - Must link to requirements (`specs/requirements/MVP.md`).
   - Carries an explicit QA acceptance checklist.
2. **Technical Tasks (`type: task`)**:
   - Concrete sub-tasks attached to a parent story.
   - Focuses on specific crate/package changes and unit tests.
3. **QA Bugs (`type: bug`)**:
   - Defect reports with reproduction steps and fixes.

---

## 3. GitHub CLI Automation Commands

| Action | Command |
| :--- | :--- |
| **List Issues** | `gh issue list --repo bohdan-mykhailenko/lang-flow` |
| **Create Story** | `gh issue create --title "Story: <TITLE>" --label "type: story" --body-file ...` |
| **Create Task** | `gh issue create --title "feat(<SCOPE>): <TITLE>" --label "type: task" --body-file ...` |
| **Add to Project** | `gh project item-create 1 --owner bohdan-mykhailenko --url <ISSUE_URL>` |
| **View Project** | `gh project view 1 --owner bohdan-mykhailenko` |
