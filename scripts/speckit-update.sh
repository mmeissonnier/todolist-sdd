#!/usr/bin/env bash
# Upgrade Spec Kit files in place, then re-apply project customizations.
# `specify init --force` overwrites .specify/memory/ (constitution), so we back it up and restore it.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

BACKUP="$(mktemp -d)"
trap 'rm -rf "$BACKUP"' EXIT
cp -R .specify/memory "$BACKUP/memory"

uvx --from git+https://github.com/github/spec-kit.git specify init \
  --here --force --integration claude --non-interactive

rm -rf .specify/memory
cp -R "$BACKUP/memory" .specify/memory

"$ROOT/scripts/speckit-models.sh"
echo "Spec Kit updated. Review changes with: git diff"
