#!/usr/bin/env bash

set -euo pipefail

: "${BASE_SHA:?BASE_SHA is required}"
: "${HEAD_REF:?HEAD_REF is required}"
: "${GH_TOKEN:?GH_TOKEN is required}"
: "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"

PR_BODY="${PR_BODY:-}"
MANUAL_WRAPPER_TEST="${MANUAL_WRAPPER_TEST:-false}"
manual_marker='collect-react-parity-source: manual-wrapper-test/no-upstream'

if [[ "$PR_BODY" == *"$manual_marker"* && "$MANUAL_WRAPPER_TEST" != "true" ]]; then
  echo "Manual wrapper test marker requires the manual-wrapper-test label." >&2
  exit 1
fi

git -c http.extraheader="AUTHORIZATION: bearer $GH_TOKEN" fetch origin "$HEAD_REF"
IMPLEMENTATION_SHA="$(git rev-parse FETCH_HEAD)"

if [[ "$IMPLEMENTATION_SHA" == "$BASE_SHA" ]]; then
  echo "Claude completed without committing implementation changes." >&2
  exit 1
fi

mapfile -t CHANGED_FILES < <(git diff --name-only "$BASE_SHA" "$IMPLEMENTATION_SHA")

if [[ "${#CHANGED_FILES[@]}" -eq 0 ]]; then
  echo "Claude created a commit without an implementation diff." >&2
  exit 1
fi

while IFS= read -r commit_sha; do
  verified="$(gh api "repos/$GITHUB_REPOSITORY/commits/$commit_sha" --jq '.commit.verification.verified')"
  if [[ "$verified" != "true" ]]; then
    echo "Implementation commit $commit_sha is not signed and verified by GitHub." >&2
    exit 1
  fi
done < <(git rev-list --reverse "$BASE_SHA..$IMPLEMENTATION_SHA")

if [[ "$MANUAL_WRAPPER_TEST" == "true" ]]; then
  if [[ "$PR_BODY" != *"$manual_marker"* ]]; then
    echo "manual-wrapper-test label requires the manual wrapper test source marker." >&2
    exit 1
  fi

  for required_file in src/Fields.tsx src/tests/index.test.tsx; do
    if ! printf '%s\n' "${CHANGED_FILES[@]}" | grep -Fxq "$required_file"; then
      echo "Controlled wrapper test did not change required file: $required_file" >&2
      exit 1
    fi
  done
fi

printf 'Verified signed parity implementation commit %s with files:\n' "$IMPLEMENTATION_SHA"
printf -- '- %s\n' "${CHANGED_FILES[@]}"
