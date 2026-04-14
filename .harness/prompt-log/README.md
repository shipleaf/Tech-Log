# Prompt Log Storage

This directory stores local prompt logging artifacts for the harness workflow.

- `events/` keeps append-only daily JSONL files.
- `digests/` keeps readable daily Markdown summaries.
- `archive/` keeps compressed monthly JSONL archives.
- `state/open/` keeps temporary state for prompts that have a question logged but no answer summary yet.
- `templates/` keeps tracked templates for human-readable output.

Generated logs are ignored by Git on purpose to avoid repository bloat.
