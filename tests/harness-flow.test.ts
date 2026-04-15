import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

const harnessSource = path.join(process.cwd(), "harness.sh");

type RunOptions = {
  cwd: string;
  env?: NodeJS.ProcessEnv;
  expect?: number;
};

function run(command: string, args: string[], options: RunOptions) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: { ...process.env, ...options.env },
    encoding: "utf8",
  });
  const status = result.status ?? 1;
  const expected = options.expect ?? 0;

  if (status !== expected) {
    assert.fail(
      [
        `expected exit ${expected}, received ${status}`,
        `command: ${command} ${args.join(" ")}`,
        `stdout:\n${result.stdout}`,
        `stderr:\n${result.stderr}`,
      ].join("\n\n"),
    );
  }

  return result;
}

function runFailure(command: string, args: string[], options: Omit<RunOptions, "expect">) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: { ...process.env, ...options.env },
    encoding: "utf8",
  });

  assert.notEqual(result.status, 0, `expected failure: ${command} ${args.join(" ")}`);
  return `${result.stdout}\n${result.stderr}`;
}

test("harness enforces the AGENTS flow and allows rerunning stale stages", (t) => {
  const sandboxRoot = mkdtempSync(path.join(tmpdir(), "tech-log-harness-"));
  t.after(() => rmSync(sandboxRoot, { recursive: true, force: true }));

  const repoRoot = path.join(sandboxRoot, "repo");
  const taskId = "shell-flow";
  const planRelativePath = path.join("docs", "exec-plans", "active", "task.md");
  const worktreeRoot = path.join(sandboxRoot, "shell-flow-worktree");
  const completedPlanPath = path.join(
    worktreeRoot,
    "docs",
    "exec-plans",
    "completed",
    "task.md",
  );
  const fakeBin = path.join(sandboxRoot, "bin");
  const npmLog = path.join(sandboxRoot, "npm.log");

  mkdirSync(repoRoot, { recursive: true });
  mkdirSync(path.join(repoRoot, "docs", "exec-plans", "active"), { recursive: true });
  mkdirSync(path.join(repoRoot, "docs", "exec-plans", "completed"), { recursive: true });
  mkdirSync(fakeBin, { recursive: true });

  copyFileSync(harnessSource, path.join(repoRoot, "harness.sh"));
  chmodSync(path.join(repoRoot, "harness.sh"), 0o755);

  writeFileSync(
    path.join(fakeBin, "npm"),
    `#!/bin/sh
echo "$*" >> "${npmLog}"
exit 0
`,
    "utf8",
  );
  chmodSync(path.join(fakeBin, "npm"), 0o755);

  run("git", ["init", "-b", "develop"], { cwd: repoRoot });
  run("git", ["config", "user.name", "Harness Test"], { cwd: repoRoot });
  run("git", ["config", "user.email", "harness@example.com"], { cwd: repoRoot });
  run("git", ["add", "harness.sh"], { cwd: repoRoot });
  run("git", ["commit", "-m", "chore: seed harness"], { cwd: repoRoot });

  writeFileSync(path.join(repoRoot, planRelativePath), "# task\n", "utf8");

  const blockedBeforePlan = runFailure("sh", ["./harness.sh", "implementation-done", taskId], {
    cwd: repoRoot,
  });
  assert.match(blockedBeforePlan, /worktree-prepared/);

  run("sh", ["./harness.sh", "record-plan", taskId, planRelativePath], { cwd: repoRoot });
  const nestedWorktreeError = runFailure(
    "sh",
    [
      "./harness.sh",
      "prepare-worktree",
      taskId,
      "feat-shell-flow",
      path.join(repoRoot, "nested-worktree"),
      "develop",
    ],
    { cwd: repoRoot },
  );
  assert.match(nestedWorktreeError, /outside the main repo root/);

  run(
    "sh",
    ["./harness.sh", "prepare-worktree", taskId, "feat-shell-flow", worktreeRoot, "develop"],
    { cwd: repoRoot },
  );

  assert.equal(existsSync(path.join(repoRoot, planRelativePath)), false);
  assert.equal(
    existsSync(path.join(worktreeRoot, "docs", "exec-plans", "active", "task.md")),
    true,
  );

  writeFileSync(path.join(worktreeRoot, "harness-notes.txt"), "implementation\n", "utf8");

  const blockedBeforeImplementation = runFailure("sh", ["./harness.sh", "tests-done", taskId], {
    cwd: worktreeRoot,
  });
  assert.match(blockedBeforeImplementation, /implementation-done/);

  run("sh", ["./harness.sh", "implementation-done", taskId], { cwd: worktreeRoot });

  const missingTests = runFailure("sh", ["./harness.sh", "tests-done", taskId], {
    cwd: worktreeRoot,
  });
  assert.match(missingTests, /without test changes/);

  mkdirSync(path.join(worktreeRoot, "tests"), { recursive: true });
  writeFileSync(path.join(worktreeRoot, "tests", "harness.test.ts"), "export {};\n", "utf8");
  run("sh", ["./harness.sh", "tests-done", taskId], { cwd: worktreeRoot });

  writeFileSync(path.join(worktreeRoot, "another-change.txt"), "stale\n", "utf8");
  const staleVerify = runFailure("sh", ["./harness.sh", "verify", taskId], {
    cwd: worktreeRoot,
    env: { PATH: `${fakeBin}:${process.env.PATH}` },
  });
  assert.match(staleVerify, /workspace changed after step 'tests-done'/);

  run("sh", ["./harness.sh", "implementation-done", taskId], { cwd: worktreeRoot });
  writeFileSync(path.join(worktreeRoot, "tests", "harness.test.ts"), "export const ok = true;\n", "utf8");
  run("sh", ["./harness.sh", "tests-done", taskId], { cwd: worktreeRoot });
  run("sh", ["./harness.sh", "verify", taskId], {
    cwd: worktreeRoot,
    env: { PATH: `${fakeBin}:${process.env.PATH}` },
  });

  assert.deepEqual(readFileSync(npmLog, "utf8").trim().split("\n"), [
    "run build",
    "run lint",
    "test",
  ]);

  run("sh", ["./harness.sh", "complete-plan", taskId], { cwd: worktreeRoot });
  assert.equal(existsSync(path.join(worktreeRoot, "docs", "exec-plans", "active", "task.md")), false);
  assert.equal(existsSync(completedPlanPath), true);

  writeFileSync(path.join(worktreeRoot, "post-plan.txt"), "requires re-complete\n", "utf8");
  const staleCommit = runFailure(
    "sh",
    ["./harness.sh", "commit", taskId, "chore: commit shell flow"],
    { cwd: worktreeRoot },
  );
  assert.match(staleCommit, /workspace changed after step 'plan-completed'/);

  run("sh", ["./harness.sh", "implementation-done", taskId], { cwd: worktreeRoot });
  run("sh", ["./harness.sh", "tests-done", taskId], { cwd: worktreeRoot });
  run("sh", ["./harness.sh", "verify", taskId], {
    cwd: worktreeRoot,
    env: { PATH: `${fakeBin}:${process.env.PATH}` },
  });
  run("sh", ["./harness.sh", "complete-plan", taskId], { cwd: worktreeRoot });
  run("sh", ["./harness.sh", "commit", taskId, "chore: commit shell flow"], {
    cwd: worktreeRoot,
  });
  run("sh", ["./harness.sh", "merge", taskId, "develop"], { cwd: worktreeRoot });

  const report = run("sh", ["./harness.sh", "report", taskId], { cwd: worktreeRoot });
  assert.match(report.stdout, /merged-into: develop/);
  assert.match(
    run("git", ["-C", repoRoot, "rev-parse", "--abbrev-ref", "HEAD"], { cwd: repoRoot }).stdout,
    /develop/,
  );

  const status = run("sh", ["./harness.sh", "status", taskId], { cwd: worktreeRoot });
  assert.match(status.stdout, /reported: done/);
});
