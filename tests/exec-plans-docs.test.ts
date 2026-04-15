import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const repoRoot = process.cwd();
const execPlansRoot = path.join(repoRoot, "docs", "exec-plans");
const activeDir = path.join(execPlansRoot, "active");
const completedDir = path.join(execPlansRoot, "completed");

const requiredActiveSections = [
  "## 목표",
  "## 범위",
  "## 변경 대상",
  "## 검증",
  "## 종료 조건",
];

function readUtf8(...segments: string[]) {
  return readFileSync(path.join(...segments), "utf8");
}

function markdownFiles(dir: string) {
  return readdirSync(dir)
    .filter((entry) => entry.endsWith(".md"))
    .sort();
}

test("exec-plans lifecycle doc separates milestones from execution units", () => {
  const content = readUtf8(execPlansRoot, "README.md");

  assert.match(content, /docs\/PLANS\.md.*마일스톤/);
  assert.match(content, /docs\/exec-plans\/active\/.*작은 단위 실행 계획/);
  assert.match(content, /docs\/exec-plans\/completed\/.*완료, 취소, 대체됨/);
});

test("active exec plans stay in-progress and keep the required planning sections", () => {
  const activeFiles = markdownFiles(activeDir).filter((file) => file !== "README.md");

  assert.ok(!activeFiles.includes("M0-harness-setup.md"));

  for (const file of activeFiles) {
    const content = readUtf8(activeDir, file);

    assert.match(content, /> 상태: 진행 중/);

    for (const section of requiredActiveSections) {
      assert.ok(content.includes(section), `${file} is missing ${section}`);
    }
  }
});

test("completed exec plans carry terminal status, closure metadata, and index links", () => {
  const completedFiles = markdownFiles(completedDir).filter((file) => file !== "README.md");
  const completedReadme = readUtf8(completedDir, "README.md");

  assert.ok(completedFiles.length > 0);

  for (const file of completedFiles) {
    const content = readUtf8(completedDir, file);

    assert.doesNotMatch(content, /> 상태: 진행 중/);
    assert.match(content, /> 상태: (완료|취소|대체됨)/);
    assert.match(content, /> 종료일: \d{4}-\d{2}-\d{2}/);
    assert.ok(
      completedReadme.includes(`](./${file})`),
      `${file} is missing from completed/README.md`,
    );
  }
});
