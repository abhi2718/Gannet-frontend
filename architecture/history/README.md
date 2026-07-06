# Change History

Append-only log of every meaningful change, **one file per change**, newest
first. Future work should skim the latest entries for precedent before making
similar changes.

## How to add an entry

1. Create a file `YYYY-MM-DD-<short-slug>.md` in this folder.
2. Fill in the template below.
3. Add a link at the **top** of the index.
4. (Per `CLAUDE.md`) only do this **after the user has approved** the change.

### Template

```markdown
# YYYY-MM-DD — <short title>

- **What:** <what changed, which files>
- **Why:** <reason / trigger>
- **Tests:** <tests added/updated + result (lint/typecheck/jest)>
- **Notes:** <decisions, trade-offs, follow-ups>
```

## Index (newest first)

- [2026-07-06 — Customer account features + docs system](2026-07-06-user-account-features.md)
