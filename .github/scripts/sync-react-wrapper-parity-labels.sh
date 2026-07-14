#!/usr/bin/env bash
set -euo pipefail

: "${GH_REPO:?GH_REPO is required}"

upsert_label() {
  local name="$1"
  local color="$2"
  local description="$3"

  if gh label view "$name" --repo "$GH_REPO" >/dev/null 2>&1; then
    gh label edit "$name" --repo "$GH_REPO" --color "$color" --description "$description"
  else
    gh label create "$name" --repo "$GH_REPO" --color "$color" --description "$description"
  fi
}

upsert_label "react-wrapper-parity" "5319e7" "Automated React wrapper parity work from Collect.js"
upsert_label "needs-codex-handoff" "fbca04" "Draft parity PR needs Codex or maintainer implementation handoff"
upsert_label "needs-claude-implementation" "c2e0ff" "Draft parity PR should receive an automated Claude implementation pass"
upsert_label "manual-wrapper-test" "bfdadc" "Controlled wrapper-only parity implementation test"
upsert_label "agent-review" "1d76db" "Run Claude agent review on this PR"
upsert_label "jira-blocked" "d93f0b" "Jira issue creation or update failed"
upsert_label "security-sensitive" "b60205" "Touches or may touch security-sensitive wrapper surfaces"
