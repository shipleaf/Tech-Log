import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();

function readRepoFile(...segments: string[]) {
  return readFileSync(path.join(repoRoot, ...segments), "utf8");
}

test("harness exposes the full AGENTS workflow as explicit commands", () => {
  const harness = readRepoFile("harness.sh");

  assert.match(harness, /record-plan <task-id> <plan-path>/);
  assert.match(harness, /prepare-worktree <task-id> <branch> <worktree-path> \[base-ref\]/);
  assert.match(harness, /implementation-done <task-id>/);
  assert.match(harness, /tests-done <task-id>/);
  assert.match(harness, /verify <task-id>/);
  assert.match(harness, /complete-plan <task-id>/);
  assert.match(harness, /commit <task-id> <commit-message>/);
  assert.match(harness, /merge <task-id> <target-branch>/);
  assert.match(harness, /report <task-id>/);
});

test("harness normalizes Windows and POSIX worktree paths before comparing them", () => {
  const harness = readRepoFile("harness.sh");

  assert.match(harness, /canonical_pwd\(\)/);
  assert.match(harness, /pwd -W/);
  assert.match(harness, /tr '\\\\' '\//);
  assert.match(harness, /\/\*\|\[A-Za-z\]:\/\*\)/);
  assert.match(harness, /worktree path must differ from the main repo root/);
  assert.match(harness, /worktree path must be outside the main repo root/);
});

test("harness verify and completion stages guard stale snapshots and required checks", () => {
  const harness = readRepoFile("harness.sh");

  assert.match(harness, /require_current_snapshot "\$state_dir" "tests-done"/);
  assert.match(harness, /run_logged "\$worktree_root" "\$verification_log" npm\.cmd run build/);
  assert.match(harness, /run_logged "\$worktree_root" "\$verification_log" npm\.cmd run lint/);
  assert.match(harness, /run_logged "\$worktree_root" "\$verification_log" npm\.cmd test/);
  assert.match(harness, /require_current_snapshot "\$state_dir" "verified"/);
  assert.match(harness, /require_current_snapshot "\$state_dir" "plan-completed"/);
  assert.match(harness, /require_current_snapshot "\$state_dir" "committed"/);
});
