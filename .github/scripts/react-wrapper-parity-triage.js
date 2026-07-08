#!/usr/bin/env node

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const EVENT_PATH = process.env.GITHUB_EVENT_PATH;
const OUTPUT_DIR = process.env.PARITY_OUTPUT_DIR || path.join(os.tmpdir(), 'react-wrapper-parity');
const DEFAULT_UPSTREAM_REPO = process.env.DEFAULT_UPSTREAM_REPO || 'verygoodsecurity/vgs-collect';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) return;
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${String(value)}\n`);
}

function runGh(args) {
  const env = {
    ...process.env,
    GH_TOKEN: process.env.GH_TOKEN || process.env.GITHUB_TOKEN
  };

  return execFileSync('gh', args, { encoding: 'utf8', env }).trim();
}

function slugify(value) {
  return String(value || 'collect-js-feature')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'collect-js-feature';
}

function normalizeLabels(labels) {
  return (labels || [])
    .map((label) => (typeof label === 'string' ? label : label.name))
    .filter(Boolean);
}

function prFromMergeSha(repository, mergeSha) {
  const pulls = JSON.parse(
    runGh([
      'api',
      `repos/${repository}/commits/${mergeSha}/pulls`,
      '-H',
      'Accept: application/vnd.github+json'
    ]) || '[]'
  );

  if (!pulls.length) {
    throw new Error(`No pull request found for merge SHA ${mergeSha}`);
  }

  return pulls[0].number;
}

function loadPr(repository, prNumber) {
  return JSON.parse(
    runGh([
      'pr',
      'view',
      String(prNumber),
      '--repo',
      repository,
      '--json',
      'number,title,body,labels,mergeCommit,url,baseRefName,headRefName,mergedAt'
    ])
  );
}

function changedFiles(repository, prNumber) {
  const output = runGh(['pr', 'diff', String(prNumber), '--repo', repository, '--name-only']);
  return output ? output.split('\n').filter(Boolean) : [];
}

function manualPayload(event) {
  const inputs = event.inputs || {};
  const repository = inputs.upstream_repo || DEFAULT_UPSTREAM_REPO;
  let prNumber = inputs.upstream_pr_number || '';

  if (!prNumber && inputs.upstream_merge_sha) {
    prNumber = prFromMergeSha(repository, inputs.upstream_merge_sha);
  }

  if (!prNumber) {
    throw new Error('Manual dispatch requires upstream_pr_number or upstream_merge_sha.');
  }

  const pr = loadPr(repository, prNumber);
  const files = changedFiles(repository, prNumber);
  const labels = normalizeLabels(pr.labels);
  const sourceMarker = `collect-react-parity-source: ${repository}#${pr.number}`;

  return {
    source: 'manual-react-wrapper-parity-dispatch',
    source_marker: sourceMarker,
    dispatched_at: new Date().toISOString(),
    upstream_repository: repository,
    upstream_pr_number: pr.number,
    upstream_pr_url: pr.url,
    upstream_pr_title: pr.title,
    upstream_pr_body: pr.body || '',
    upstream_pr_labels: labels,
    upstream_base_ref: pr.baseRefName,
    upstream_head_ref: pr.headRefName,
    upstream_merge_sha: pr.mergeCommit ? pr.mergeCommit.oid : inputs.upstream_merge_sha,
    upstream_merged_at: pr.mergedAt,
    upstream_changed_files: files,
    react_wrapper_impact: inputs.react_wrapper_impact || 'unknown',
    release_notes: inputs.release_notes || ''
  };
}

function currentPayload() {
  const event = EVENT_PATH && fs.existsSync(EVENT_PATH) ? readJson(EVENT_PATH) : {};

  if (event.client_payload) return event.client_payload;
  if (event.inputs) return manualPayload(event);

  throw new Error('Unsupported event: expected repository_dispatch or workflow_dispatch.');
}

function docsOnly(files) {
  return files.length > 0 && files.every((file) => {
    return (
      file.endsWith('.md') ||
      file.startsWith('docs/') ||
      file.startsWith('skills/') ||
      file.startsWith('examples/') ||
      file === 'README.md'
    );
  });
}

function wrapperSensitiveFiles(files) {
  return files.filter((file) => (
    file.startsWith('public-lib/') ||
    file.startsWith('secure-frame/') ||
    file.startsWith('src/') ||
    file.startsWith('skills/') ||
    file.startsWith('examples/') ||
    file === 'README.md' ||
    file === 'package.json' ||
    file.endsWith('.d.ts')
  ));
}

function githubCustomerImpactFiles(files) {
  return files.filter((file) => (
    file === '.github/PULL_REQUEST_TEMPLATE.md' ||
    file === '.github/ISSUE_TEMPLATE.md' ||
    file.startsWith('.github/workflows/release') ||
    file.startsWith('.github/workflows/validate-skills') ||
    file.startsWith('.github/workflows/test') ||
    file.startsWith('.github/workflows/security')
  ));
}

function mentionsAny(value, words) {
  const normalized = String(value || '').toLowerCase();
  return words.some((word) => normalized.includes(word));
}

function impactedSurfaces(payload) {
  const files = payload.upstream_changed_files || [];
  const text = `${payload.upstream_pr_title || ''}\n${payload.upstream_pr_body || ''}\n${files.join('\n')}`;
  const surfaces = new Set();

  if (mentionsAny(text, ['field', 'validation', 'mask', 'serializer', 'iframe', 'placeholder', 'input'])) {
    surfaces.add('src/Fields.tsx');
    surfaces.add('src/types/*');
  }

  if (mentionsAny(text, ['session', 'submit', 'tokenize', 'tokenization', 'createcard', 'updatecard', 'createaliases', 'auth', 'routeid', 'cname', 'formid'])) {
    surfaces.add('src/Session.tsx');
    surfaces.add('src/Form.tsx');
    surfaces.add('src/types/*');
  }

  if (files.some((file) => file.startsWith('skills/') || file.startsWith('examples/') || file.endsWith('.md'))) {
    surfaces.add('README.md');
    surfaces.add('skills/vgs-collect-react-guide/*');
  }

  if (!surfaces.size) {
    surfaces.add('src/types/*');
    surfaces.add('src/tests/*');
    surfaces.add('skills/vgs-collect-react-guide/*');
  }

  return Array.from(surfaces).sort();
}

function securitySensitive(payload) {
  const files = payload.upstream_changed_files || [];
  const text = `${payload.upstream_pr_title || ''}\n${payload.upstream_pr_body || ''}\n${files.join('\n')}`;

  if (files.some((file) => (
    file.startsWith('public-lib/') ||
    file.startsWith('secure-frame/') ||
    file.startsWith('src/') ||
    file === 'package.json'
  ))) {
    return true;
  }

  return mentionsAny(text, [
    'pan',
    'cvc',
    'cvv',
    'ssn',
    'password',
    'oauth',
    'token',
    'auth',
    'secret',
    'submit',
    'tokenize',
    'tokenization',
    'routeid',
    'cname',
    'formid',
    'field',
    'validation',
    'session'
  ]);
}

function triage(payload) {
  const labels = normalizeLabels(payload.upstream_pr_labels).map((label) => label.toLowerCase());
  const impact = String(payload.react_wrapper_impact || 'unknown').toLowerCase();
  const files = payload.upstream_changed_files || [];
  const text = `${payload.upstream_pr_title || ''}\n${payload.upstream_pr_body || ''}\n${files.join('\n')}`;
  const sensitiveFiles = wrapperSensitiveFiles(files);
  const githubImpactFiles = githubCustomerImpactFiles(files);

  if (labels.includes('react-wrapper-noop') || impact === 'not-needed') {
    if (sensitiveFiles.length) {
      return {
        result: 'blocked',
        reason: `Upstream declared no React wrapper impact, but wrapper-sensitive files changed: ${sensitiveFiles.join(', ')}. Maintainer triage is required.`
      };
    }

    return {
      result: 'no-op',
      reason: 'Upstream PR explicitly declares no React wrapper impact.'
    };
  }

  if (impact === 'docs-only') {
    return {
      result: 'docs-only',
      reason: 'Upstream PR declares React wrapper documentation-only impact.'
    };
  }

  if (impact === 'required' || labels.includes('react-wrapper-impact')) {
    return {
      result: 'code-required',
      reason: 'Upstream PR declares React wrapper parity work is required.'
    };
  }

  if (!files.length) {
    return {
      result: 'blocked',
      reason: 'Changed files were not available, so wrapper impact cannot be evaluated safely.'
    };
  }

  if (docsOnly(files)) {
    return {
      result: 'docs-only',
      reason: 'Only docs, examples, or public skill files changed upstream.'
    };
  }

  if (githubImpactFiles.length) {
    return {
      result: 'blocked',
      reason: `Upstream GitHub workflow/template changes may affect public release, validation, or contributor behavior: ${githubImpactFiles.join(', ')}. Maintainer triage is required.`
    };
  }

  if (labels.includes('public-api') || labels.includes('needs-react-triage')) {
    return {
      result: 'code-required',
      reason: 'Upstream PR is labeled public API or needs React triage.'
    };
  }

  if (mentionsAny(text, ['public-lib/', 'secure-frame/', 'src/', 'field', 'session', 'submit', 'tokenize', 'validation', 'collect.', 'vgscollect'])) {
    return {
      result: 'code-required',
      reason: 'Upstream changed Collect.js runtime or public API surfaces that may need wrapper parity.'
    };
  }

  return {
    result: 'no-op',
    reason: 'No public API, docs, examples, or wrapper-sensitive changes were detected.'
  };
}

function markdownList(items) {
  if (!items || !items.length) return '- None';
  return items.map((item) => `- ${item}`).join('\n');
}

function reportFor(payload, assessment, surfaces, sensitive) {
  const files = payload.upstream_changed_files || [];
  const labels = normalizeLabels(payload.upstream_pr_labels);

  return `# Collect.js React Wrapper Parity Triage

## Result

- Result: \`${assessment.result}\`
- Reason: ${assessment.reason}
- Security-sensitive: ${sensitive ? 'yes' : 'no'}

## Upstream Evidence

- Repository: ${payload.upstream_repository}
- PR: ${payload.upstream_pr_url || `#${payload.upstream_pr_number}`}
- Merge SHA: ${payload.upstream_merge_sha || 'unknown'}
- Source marker: ${payload.source_marker || `collect-react-parity-source: ${payload.upstream_repository}#${payload.upstream_pr_number}`}
- Impact selection: \`${payload.react_wrapper_impact || 'unknown'}\`
- Labels: ${labels.length ? labels.join(', ') : 'none'}

## Release Notes

${payload.release_notes ? payload.release_notes : 'None provided.'}

## Changed Files

${markdownList(files)}

## Wrapper Surfaces To Check

${markdownList(surfaces)}

## Acceptance Criteria

- Confirm whether the upstream feature is stable and customer-facing.
- Mirror Collect.js public API in the React wrapper only when appropriate.
- Update public TypeScript types, tests, demo usage, README, and public skills when wrapper behavior changes.
- Keep README changes customer-facing only.
- Keep this PR draft until a human reviews security-sensitive fields, submit, tokenization, auth, CNAME, route, session, type, or dependency changes.

## Validation Checklist

- \`yarn test:unit\`
- \`yarn test:lint\`
- \`yarn test:build\`
- \`yarn test:demobuild\`
- \`yarn test:compatbuild\`
- \`yarn test\` for shared session, form, field, submit, tokenization, or public type changes
- \`git diff --check\`

## Codex Handoff

Use the upstream PR, merge SHA, changed files, and impacted wrapper surfaces above as the source of truth. Inspect upstream source before changing wrapper code. Do not copy sensitive values into code, logs, examples, comments, or PR text.
`;
}

function prBodyFor(payload, assessment, surfaces, sensitive) {
  return `## Summary

Draft React wrapper parity PR created from upstream Collect.js merge.

- Upstream PR: ${payload.upstream_pr_url || `#${payload.upstream_pr_number}`}
- Merge SHA: ${payload.upstream_merge_sha || 'unknown'}
- Source marker: ${payload.source_marker || `collect-react-parity-source: ${payload.upstream_repository}#${payload.upstream_pr_number}`}
- Triage result: \`${assessment.result}\`
- Security-sensitive: ${sensitive ? 'yes' : 'no'}

## Release Notes

${payload.release_notes ? payload.release_notes : 'None provided.'}

## Codex Implementation Handoff

Codex should inspect the upstream source evidence, then implement only the required React wrapper parity changes. Keep this PR draft until code, tests, public docs, and public skills are complete.

Wrapper surfaces to check:

${markdownList(surfaces)}

## Validation

- [ ] \`yarn test:unit\`
- [ ] \`yarn test:lint\`
- [ ] \`yarn test:build\`
- [ ] \`yarn test:demobuild\`
- [ ] \`yarn test:compatbuild\`
- [ ] \`git diff --check\`
- [ ] Full \`yarn test\` if shared session/form/field/submit/tokenization/public types changed

## Safety

- [ ] No PAN, CVC, SSN, OAuth tokens, client secrets, bearer tokens, production route IDs, production CNAMEs, or vault credentials were added.
- [ ] README changes are customer-facing only.
- [ ] Public skills were updated when public wrapper behavior or examples changed.
`;
}

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const payload = currentPayload();
  const assessment = triage(payload);
  const surfaces = impactedSurfaces(payload);
  const sensitive = securitySensitive(payload);
  const slug = slugify(payload.upstream_pr_title);

  const metadata = {
    ...payload,
    triage_result: assessment.result,
    triage_reason: assessment.reason,
    impacted_wrapper_surfaces: surfaces,
    security_sensitive: sensitive,
    branch_slug: slug
  };

  const reportPath = path.join(OUTPUT_DIR, 'react-wrapper-parity-report.md');
  const prBodyPath = path.join(OUTPUT_DIR, 'react-wrapper-parity-pr-body.md');
  const metadataPath = path.join(OUTPUT_DIR, 'react-wrapper-parity-metadata.json');

  fs.writeFileSync(reportPath, reportFor(payload, assessment, surfaces, sensitive));
  fs.writeFileSync(prBodyPath, prBodyFor(payload, assessment, surfaces, sensitive));
  writeJson(metadataPath, metadata);

  writeOutput('result', assessment.result);
  writeOutput('should_create_jira', assessment.result === 'no-op' ? 'false' : 'true');
  writeOutput('should_create_pr', ['code-required', 'docs-only'].includes(assessment.result) ? 'true' : 'false');
  writeOutput('security_sensitive', sensitive ? 'true' : 'false');
  writeOutput('branch_slug', slug);
  writeOutput('upstream_repository', payload.upstream_repository);
  writeOutput('upstream_pr_number', payload.upstream_pr_number || '');
  writeOutput('upstream_pr_title', payload.upstream_pr_title || '');
  writeOutput('report_path', reportPath);
  writeOutput('pr_body_path', prBodyPath);
  writeOutput('metadata_path', metadataPath);
}

main();
