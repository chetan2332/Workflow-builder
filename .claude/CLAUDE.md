## Project Basics
- Use pnpm, not npm
- This is a Turborepo monorepo
- Run `pnpm dev` in the root location — it starts both backend and frontend
- Don't directly give code for any query unless asked. Always prefer to give logic or the flow.

## Vibe Coding Standards

### Core Loop: Plan → Build → Verify → Commit
1. **Plan** — Explain the logic/flow first. Wait for approval before writing code.
2. **Build** — Write code only after go-ahead. Keep diffs small and reviewable.
3. **Verify** — Run dev server / tests after every change to confirm nothing breaks.
4. **Commit** — Small, atomic commits per feature. Never bundle unrelated changes.

### Rules
- **One thing at a time** — Finish one feature/fix completely before starting the next.
- **Logic first, code second** — Always explain the approach before implementing.
- **Small diffs, frequent checkpoints** — If something breaks, roll back just that piece.
- **Security by default** — No hardcoded secrets, validate all inputs, sandbox untrusted code.
- **Match existing patterns** — Follow NestJS conventions (modules/services/controllers) and existing node registration patterns. Don't reinvent what's already there.
- **Test after every modification** — Run `pnpm dev` after changes. If tests exist, run them.
- **Context hygiene** — Start fresh per feature. Compact when context gets long.

### Anti-patterns to Avoid
- **Doom Loop** — If a fix takes 3+ attempts, stop and rethink the design entirely.
- **Scope creep** — Finish what's in front of us before adding new ideas.
- **Mega-files** — If a file exceeds ~300 lines, split it.
- **Silent assumptions** — Always surface uncertainties rather than guessing.

### Working Style
- Interrupt/escape if going down a rabbit hole.
- Say "roll back" if a change made things worse.
- Paste screenshots of UI issues for precise fixes.
- Say "just the logic" to prevent premature code generation.