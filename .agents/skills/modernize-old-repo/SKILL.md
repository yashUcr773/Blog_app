---
name: modernize-old-repo
description: Audit and carefully modernize old, stale, hobby, experimental, or personal software repositories without blindly rewriting them.
---

# Modernize Old Repo

Use this skill when asked to inspect, revive, audit, maintain, clean up, or modernize an old software repository.

First understand the project's intent and architecture. Do not blindly rewrite it. Preserve original behavior unless there is a clear, well-justified reason to change it.

Before making code changes, produce an audit summary covering what works, what is broken, what is outdated, what is risky, and what can be safely improved.

For the full audit workflow, read [references/audit-checklist.md](references/audit-checklist.md).

## Working Style

- Prefer small, incremental, well-justified improvements.
- Avoid unnecessary dependencies and unnecessary major upgrades.
- Distinguish setup/environment failures from real application bugs.
- Verify the project after changes with available tests, builds, linting, type checks, or manual smoke tests.
- If something cannot be verified, state that clearly.
- Do not rewrite git history unless explicitly instructed.
- Do not expose real secrets if found; identify locations, recommend rotation, and remove or replace them safely where appropriate.
