# .workspace — Development Artifacts

**Status:** Active
**Purpose:** Private engineering workspace per GOVERNANCE.md Rule 2

This `.workspace/` directory contains development artifacts that are **not** part of the shipped project. Per the project's governance, the root must remain minimal and product-oriented.

## Directory layout

| Subdirectory | Purpose |
|---|---|
| `ai/` | AI working files, temporary prompts, reasoning, experiments |
| `generated/` | Generated assets/schemas/documentation |
| `LFI/` | **Logic Flow Index** — behavioral map ("what happens and how") |
| `logs/` | Development/build/execution logs |
| `planning/` | Roadmaps, execution/refactoring plans |
| `PRI/` | **Project Reference Index** — structural map ("what exists and where") |
| `reports/` | Generated reports (audits, validations, investigations, security, deployment) |
| `research/` | Investigations, PoCs, comparisons |
| `sessions/` | Session artifacts/checkpoints/summaries |
| `temp/` | Temporary scratch/drafts |
| `validation/` | Validation/QA/build verification outputs |

## Commit policy

- `PRI/` and `LFI/` are **committed** to git (durable structural/behavioral reference).
- All other subdirectories under `.workspace/` are **transient** and are ignored by `.gitignore`.

See: `~/.config/opencode/governance/WORKSPACE_DEVELOPMENT_ARTIFACT_MANAGEMENT.md`, `~/.config/opencode/governance/PROJECT_REFERENCE_INDEX.md`, `~/.config/opencode/governance/LOGIC_FLOW_INDEX.md`.