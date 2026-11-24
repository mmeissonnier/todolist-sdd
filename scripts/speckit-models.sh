#!/usr/bin/env bash
# Force the Claude model used by each Spec Kit skill.
# Idempotent: safe to run any number of times (inserts or fixes the `model:` line).
# Skills not listed here keep the session's default model.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_DIR="$ROOT/.claude/skills"

MODELS=(
  "constitution:haiku"
  "checklist:haiku"
  "specify:sonnet"
  "clarify:sonnet"
  "tasks:sonnet"
  "analyze:sonnet"
)

changed=()
for entry in "${MODELS[@]}"; do
  skill="${entry%%:*}"
  model="${entry##*:}"
  file="$SKILLS_DIR/speckit-$skill/SKILL.md"
  [[ -f "$file" ]] || continue

  current="$(grep -m1 '^model:' "$file" | sed 's/^model:[[:space:]]*//' || true)"
  [[ "$current" == "$model" ]] && continue

  if [[ -n "$current" ]]; then
    perl -i -pe "s/^model:.*\$/model: $model/" "$file"
  else
    perl -i -pe "s/^(name: .*\n)/\$1model: $model\n/" "$file"
  fi
  changed+=("speckit-$skill=$model")
done

if ((${#changed[@]})); then
  echo "speckit-models: updated ${changed[*]}"
fi
