#!/usr/bin/env node

const fs = require('fs');

const METADATA_PATH = process.env.PARITY_METADATA_PATH;
const JIRA_BASE_URL = (process.env.JIRA_BASE_URL || '').replace(/\/$/, '');
const JIRA_EMAIL = process.env.JIRA_EMAIL || '';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || '';
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || '';
const JIRA_ISSUE_TYPE = process.env.JIRA_ISSUE_TYPE || 'Task';

function writeOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) return;
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${String(value)}\n`);
}

function requireEnv(name, value) {
  if (!value) throw new Error(`${name} is required for Jira parity automation.`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function authHeader() {
  return `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`;
}

function adf(text) {
  const paragraphs = String(text || '')
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => ({
      type: 'paragraph',
      content: [{ type: 'text', text: part }]
    }));

  return {
    type: 'doc',
    version: 1,
    content: paragraphs.length ? paragraphs : [{ type: 'paragraph', content: [{ type: 'text', text: 'No details provided.' }] }]
  };
}

async function jira(path, options = {}) {
  const response = await fetch(`${JIRA_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: authHeader(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`Jira request failed (${response.status}): ${text}`);
  }

  return body;
}

function sanitizeSummary(value) {
  return String(value || 'Collect.js feature')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

function escapeJqlText(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

async function searchIssues(jql, options = {}) {
  return jira('/rest/api/3/search/jql', {
    method: 'POST',
    body: JSON.stringify({
      jql,
      maxResults: options.maxResults || 1,
      fields: options.fields || ['summary']
    })
  });
}

function issueBody(metadata) {
  const files = metadata.upstream_changed_files || [];
  const surfaces = metadata.impacted_wrapper_surfaces || [];
  const warnings = metadata.audit_warnings || [];

  return `Automated React wrapper parity triage for a merged Collect.js PR.

Upstream PR: ${metadata.upstream_pr_url || `#${metadata.upstream_pr_number}`}
Merge SHA: ${metadata.upstream_merge_sha || 'unknown'}
Source marker: ${metadata.source_marker || `collect-react-parity-source: ${metadata.upstream_repository}#${metadata.upstream_pr_number}`}
Triage result: ${metadata.triage_result}
Reason: ${metadata.triage_reason}
Security-sensitive: ${metadata.security_sensitive ? 'yes' : 'no'}

Audit warnings:
${warnings.length ? warnings.map((warning) => `- ${warning}`).join('\n') : '- None'}

Release notes:
${metadata.release_notes || 'None provided.'}

Changed files:
${files.length ? files.map((file) => `- ${file}`).join('\n') : '- None'}

Wrapper surfaces to check:
${surfaces.length ? surfaces.map((surface) => `- ${surface}`).join('\n') : '- None'}

Acceptance criteria:
- Confirm whether the upstream feature is stable and customer-facing.
- Mirror Collect.js public API in the React wrapper only when appropriate.
- Update public TypeScript types, tests, demo usage, README, and public skills when wrapper behavior changes.
- Keep README changes customer-facing only.
- Keep draft PRs draft until human review is complete for security-sensitive changes.

Validation:
- yarn test:unit
- yarn test:lint
- yarn test:build
- yarn test:demobuild
- yarn test:compatbuild
- git diff --check
- full yarn test for shared session, form, field, submit, tokenization, or public type changes`;
}

async function findExistingIssue(summary, sourceMarker) {
  if (sourceMarker) {
    const markerTerm = escapeJqlText(sourceMarker);
    const markerResult = await searchIssues(
      `project = ${JIRA_PROJECT_KEY} AND text ~ "${markerTerm}" ORDER BY created DESC`
    );

    if (markerResult.issues && markerResult.issues.length) {
      return markerResult.issues[0];
    }
  }

  const summaryTerm = escapeJqlText(summary.slice(0, 80));
  const jql = `project = ${JIRA_PROJECT_KEY} AND summary ~ "${summaryTerm}" ORDER BY created DESC`;

  const result = await searchIssues(jql);

  return result.issues && result.issues.length ? result.issues[0] : undefined;
}

async function addComment(issueKey, body) {
  await jira(`/rest/api/3/issue/${issueKey}/comment`, {
    method: 'POST',
    body: JSON.stringify({ body: adf(body) })
  });
}

async function createIssue(summary, body) {
  return jira('/rest/api/3/issue', {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        project: { key: JIRA_PROJECT_KEY },
        issuetype: { name: JIRA_ISSUE_TYPE },
        summary,
        description: adf(body),
        labels: ['collect-react-parity', 'agent-triaged']
      }
    })
  });
}

async function main() {
  requireEnv('PARITY_METADATA_PATH', METADATA_PATH);
  requireEnv('JIRA_BASE_URL', JIRA_BASE_URL);
  requireEnv('JIRA_EMAIL', JIRA_EMAIL);
  requireEnv('JIRA_API_TOKEN', JIRA_API_TOKEN);
  requireEnv('JIRA_PROJECT_KEY', JIRA_PROJECT_KEY);

  const metadata = readJson(METADATA_PATH);
  const summary = `[Collect React] Wrapper parity for ${sanitizeSummary(metadata.upstream_pr_title)}`;
  const body = issueBody(metadata);
  const sourceMarker = metadata.source_marker || `collect-react-parity-source: ${metadata.upstream_repository}#${metadata.upstream_pr_number}`;
  const existing = await findExistingIssue(summary, sourceMarker);

  let issueKey;

  if (existing) {
    issueKey = existing.key;
    await addComment(issueKey, body);
  } else {
    const created = await createIssue(summary, body);
    issueKey = created.key;
  }

  const issueUrl = `${JIRA_BASE_URL}/browse/${issueKey}`;
  writeOutput('jira_key', issueKey);
  writeOutput('jira_url', issueUrl);

  console.log(`Jira issue: ${issueUrl}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
