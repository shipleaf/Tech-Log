#!/bin/sh

set -eu

usage() {
  cat <<'EOF'
Usage:
  ./harness.sh record-plan <task-id> <plan-path>
  ./harness.sh prepare-worktree <task-id> <branch> <worktree-path> [base-ref]
  ./harness.sh implementation-done <task-id>
  ./harness.sh tests-done <task-id>
  ./harness.sh verify <task-id>
  ./harness.sh complete-plan <task-id>
  ./harness.sh commit <task-id> <commit-message>
  ./harness.sh merge <task-id> <target-branch>
  ./harness.sh report <task-id>
  ./harness.sh status <task-id>
EOF
}

die() {
  printf 'error: %s\n' "$*" >&2
  exit 1
}

absolute_existing_path() {
  input_path=$1
  case "$input_path" in
    /*) target_path=$input_path ;;
    *) target_path=$(pwd -P)/$input_path ;;
  esac

  [ -e "$target_path" ] || die "path does not exist: $input_path"

  target_dir=$(CDPATH= cd -- "$(dirname "$target_path")" && pwd -P)
  printf '%s/%s\n' "$target_dir" "$(basename "$target_path")"
}

absolute_path_allow_missing() {
  input_path=$1
  case "$input_path" in
    /*) target_path=$input_path ;;
    *) target_path=$(pwd -P)/$input_path ;;
  esac

  parent_dir=$(dirname "$target_path")
  [ -d "$parent_dir" ] || die "parent directory does not exist: $parent_dir"

  resolved_parent=$(CDPATH= cd -- "$parent_dir" && pwd -P)
  printf '%s/%s\n' "$resolved_parent" "$(basename "$target_path")"
}

repo_root() {
  root_path=$(git rev-parse --show-toplevel 2>/dev/null) || die "run inside a git worktree"
  CDPATH= cd -- "$root_path" && pwd -P
}

git_common_dir() {
  common_path=$(git rev-parse --git-common-dir 2>/dev/null) || die "run inside a git worktree"
  CDPATH= cd -- "$common_path" && pwd -P
}

task_dir() {
  task_id=$1
  printf '%s/codex-harness/%s\n' "$(git_common_dir)" "$task_id"
}

ensure_task_layout() {
  task_id=$1
  state_dir=$(task_dir "$task_id")
  mkdir -p "$state_dir/meta" "$state_dir/steps" "$state_dir/snapshots"
  printf '%s\n' "$state_dir"
}

meta_file() {
  state_dir=$1
  meta_name=$2
  printf '%s/meta/%s\n' "$state_dir" "$meta_name"
}

write_meta() {
  state_dir=$1
  meta_name=$2
  meta_value=$3
  printf '%s\n' "$meta_value" > "$(meta_file "$state_dir" "$meta_name")"
}

read_meta_required() {
  state_dir=$1
  meta_name=$2
  meta_path=$(meta_file "$state_dir" "$meta_name")
  [ -f "$meta_path" ] || die "missing metadata '$meta_name' for task"
  cat "$meta_path"
}

read_meta_optional() {
  state_dir=$1
  meta_name=$2
  meta_path=$(meta_file "$state_dir" "$meta_name")
  if [ -f "$meta_path" ]; then
    cat "$meta_path"
  fi
}

step_file() {
  state_dir=$1
  step_name=$2
  printf '%s/steps/%s\n' "$state_dir" "$step_name"
}

mark_step() {
  state_dir=$1
  step_name=$2
  date '+%Y-%m-%dT%H:%M:%S%z' > "$(step_file "$state_dir" "$step_name")"
}

has_step() {
  state_dir=$1
  step_name=$2
  [ -f "$(step_file "$state_dir" "$step_name")" ]
}

require_step() {
  state_dir=$1
  step_name=$2
  has_step "$state_dir" "$step_name" || die "step '$step_name' must be completed first"
}

snapshot_file() {
  state_dir=$1
  step_name=$2
  printf '%s/snapshots/%s\n' "$state_dir" "$step_name"
}

capture_snapshot() {
  worktree_root=$1
  printf 'HEAD %s\n' "$(git -C "$worktree_root" rev-parse HEAD)"
  git -C "$worktree_root" status --porcelain=v1 --untracked-files=all
}

save_snapshot() {
  state_dir=$1
  step_name=$2
  worktree_root=$(read_meta_required "$state_dir" "worktree_root")
  capture_snapshot "$worktree_root" > "$(snapshot_file "$state_dir" "$step_name")"
}

snapshot_matches_current() {
  state_dir=$1
  step_name=$2
  worktree_root=$(read_meta_required "$state_dir" "worktree_root")
  saved_snapshot=$(snapshot_file "$state_dir" "$step_name")
  [ -f "$saved_snapshot" ] || return 1

  current_snapshot=$(mktemp "${TMPDIR:-/tmp}/codex-harness-snapshot.XXXXXX")
  capture_snapshot "$worktree_root" > "$current_snapshot"

  if cmp -s "$saved_snapshot" "$current_snapshot"; then
    rm -f "$current_snapshot"
    return 0
  fi

  rm -f "$current_snapshot"
  return 1
}

require_current_snapshot() {
  state_dir=$1
  step_name=$2

  snapshot_matches_current "$state_dir" "$step_name" || die "workspace changed after step '$step_name'; rerun that step before continuing"
}

require_recorded_worktree() {
  state_dir=$1
  expected_worktree=$(read_meta_required "$state_dir" "worktree_root")
  current_worktree=$(repo_root)
  [ "$current_worktree" = "$expected_worktree" ] || die "run this step from the recorded worktree: $expected_worktree"
}

list_changed_files() {
  state_dir=$1
  output_file=$2
  worktree_root=$(read_meta_required "$state_dir" "worktree_root")
  base_commit=$(read_meta_required "$state_dir" "base_commit")

  {
    git -C "$worktree_root" diff --name-only "$base_commit" -- 2>/dev/null || true
    git -C "$worktree_root" diff --name-only --cached -- 2>/dev/null || true
    git -C "$worktree_root" diff --name-only -- 2>/dev/null || true
    git -C "$worktree_root" ls-files --others --exclude-standard 2>/dev/null || true
  } | awk 'NF' | sort -u > "$output_file"
}

run_logged() {
  worktree_root=$1
  log_file=$2
  shift 2

  printf '$ %s\n' "$*" >> "$log_file"
  (
    CDPATH= cd -- "$worktree_root"
    "$@"
  ) >> "$log_file" 2>&1
}

command_record_plan() {
  [ "$#" -eq 2 ] || die "record-plan requires <task-id> <plan-path>"

  task_id=$1
  plan_path=$(absolute_existing_path "$2")
  state_dir=$(ensure_task_layout "$task_id")
  root_path=$(repo_root)

  case "$plan_path" in
    "$root_path"/docs/exec-plans/active/*.md) ;;
    *) die "plan path must be under docs/exec-plans/active/: $plan_path" ;;
  esac

  existing_plan=$(read_meta_optional "$state_dir" "plan_path")
  if has_step "$state_dir" "plan-recorded" && [ -n "$existing_plan" ] && [ "$existing_plan" != "$plan_path" ]; then
    die "task already points to a different plan: $existing_plan"
  fi

  write_meta "$state_dir" "task_id" "$task_id"
  write_meta "$state_dir" "repo_root" "$root_path"
  write_meta "$state_dir" "plan_path" "$plan_path"
  mark_step "$state_dir" "plan-recorded"
  printf 'recorded plan: %s\n' "$plan_path"
}

command_prepare_worktree() {
  [ "$#" -ge 3 ] || die "prepare-worktree requires <task-id> <branch> <worktree-path> [base-ref]"

  task_id=$1
  branch_name=$2
  requested_worktree=$(absolute_path_allow_missing "$3")
  base_ref=${4:-develop}
  state_dir=$(ensure_task_layout "$task_id")

  require_step "$state_dir" "plan-recorded"

  if has_step "$state_dir" "worktree-prepared"; then
    existing_branch=$(read_meta_required "$state_dir" "branch")
    existing_worktree=$(read_meta_required "$state_dir" "worktree_root")
    if [ "$existing_branch" = "$branch_name" ] && [ "$existing_worktree" = "$requested_worktree" ]; then
      printf 'worktree already prepared: %s\n' "$existing_worktree"
      return 0
    fi
    die "task already uses a different worktree: $existing_worktree"
  fi

  root_path=$(read_meta_required "$state_dir" "repo_root")
  [ "$requested_worktree" != "$root_path" ] || die "worktree path must differ from the main repo root"
  case "$requested_worktree" in
    "$root_path"/*)
      die "worktree path must be outside the main repo root: $requested_worktree"
      ;;
  esac

  git -C "$root_path" worktree add "$requested_worktree" -b "$branch_name" "$base_ref"

  actual_worktree=$(absolute_existing_path "$requested_worktree")
  plan_path=$(read_meta_required "$state_dir" "plan_path")
  relative_plan_path=${plan_path#"$root_path"/}
  [ "$relative_plan_path" != "$plan_path" ] || die "plan path must be inside the main repo root"
  worktree_plan_path="$actual_worktree/$relative_plan_path"
  mkdir -p "$(dirname "$worktree_plan_path")"

  if [ -e "$worktree_plan_path" ]; then
    if [ -e "$plan_path" ] && ! cmp -s "$plan_path" "$worktree_plan_path"; then
      die "worktree already has a different plan file: $worktree_plan_path"
    fi
    if [ -e "$plan_path" ]; then
      rm -f "$plan_path"
    fi
  else
    mv "$plan_path" "$worktree_plan_path"
  fi

  write_meta "$state_dir" "plan_path" "$worktree_plan_path"
  write_meta "$state_dir" "branch" "$branch_name"
  write_meta "$state_dir" "worktree_root" "$actual_worktree"
  write_meta "$state_dir" "base_ref" "$base_ref"
  write_meta "$state_dir" "base_commit" "$(git -C "$actual_worktree" rev-parse HEAD)"
  mark_step "$state_dir" "worktree-prepared"
  printf 'prepared worktree: %s\n' "$actual_worktree"
}

command_implementation_done() {
  [ "$#" -eq 1 ] || die "implementation-done requires <task-id>"

  task_id=$1
  state_dir=$(ensure_task_layout "$task_id")

  require_step "$state_dir" "worktree-prepared"
  require_recorded_worktree "$state_dir"

  changed_files=$(mktemp "${TMPDIR:-/tmp}/codex-harness-files.XXXXXX")
  list_changed_files "$state_dir" "$changed_files"

  if [ ! -s "$changed_files" ]; then
    rm -f "$changed_files"
    die "no changes detected in the recorded worktree"
  fi

  rm -f "$changed_files"
  mark_step "$state_dir" "implementation-done"
  save_snapshot "$state_dir" "implementation-done"
  printf 'implementation recorded for %s\n' "$task_id"
}

command_tests_done() {
  [ "$#" -eq 1 ] || die "tests-done requires <task-id>"

  task_id=$1
  state_dir=$(ensure_task_layout "$task_id")

  require_step "$state_dir" "implementation-done"
  require_recorded_worktree "$state_dir"

  changed_files=$(mktemp "${TMPDIR:-/tmp}/codex-harness-files.XXXXXX")
  list_changed_files "$state_dir" "$changed_files"

  if [ ! -s "$changed_files" ]; then
    rm -f "$changed_files"
    die "no changes detected in the recorded worktree"
  fi

  needs_tests=0
  has_test_changes=0

  while IFS= read -r changed_path; do
    [ -n "$changed_path" ] || continue

    case "$changed_path" in
      tests/*|*.test.ts|*_test.sh)
        has_test_changes=1
        ;;
    esac

    case "$changed_path" in
      docs/*|*.md)
        ;;
      tests/*|*.test.ts|*_test.sh)
        ;;
      *)
        needs_tests=1
        ;;
    esac
  done < "$changed_files"

  rm -f "$changed_files"

  if [ "$needs_tests" -eq 1 ] && [ "$has_test_changes" -eq 0 ]; then
    die "non-document changes detected without test changes"
  fi

  mark_step "$state_dir" "tests-done"
  save_snapshot "$state_dir" "tests-done"
  printf 'tests recorded for %s\n' "$task_id"
}

command_verify() {
  [ "$#" -eq 1 ] || die "verify requires <task-id>"

  task_id=$1
  state_dir=$(ensure_task_layout "$task_id")

  require_step "$state_dir" "tests-done"
  require_recorded_worktree "$state_dir"
  require_current_snapshot "$state_dir" "tests-done"

  worktree_root=$(read_meta_required "$state_dir" "worktree_root")
  verification_log="$(task_dir "$task_id")/verification.log"
  : > "$verification_log"

  run_logged "$worktree_root" "$verification_log" npm run build
  run_logged "$worktree_root" "$verification_log" npm run lint
  run_logged "$worktree_root" "$verification_log" npm test

  mark_step "$state_dir" "verified"
  save_snapshot "$state_dir" "verified"
  printf 'verification complete: %s\n' "$verification_log"
}

command_complete_plan() {
  [ "$#" -eq 1 ] || die "complete-plan requires <task-id>"

  task_id=$1
  state_dir=$(ensure_task_layout "$task_id")

  require_step "$state_dir" "verified"
  require_recorded_worktree "$state_dir"
  require_current_snapshot "$state_dir" "verified"

  plan_path=$(read_meta_required "$state_dir" "plan_path")
  case "$plan_path" in
    */docs/exec-plans/completed/*.md)
      completed_path=$plan_path
      ;;
    */docs/exec-plans/active/*.md)
      completed_path=$(printf '%s\n' "$plan_path" | sed 's#/docs/exec-plans/active/#/docs/exec-plans/completed/#')
      [ "$completed_path" != "$plan_path" ] || die "could not derive completed plan path"
      mkdir -p "$(dirname "$completed_path")"
      mv "$plan_path" "$completed_path"
      write_meta "$state_dir" "plan_path" "$completed_path"
      ;;
    *)
      die "plan path must be under docs/exec-plans/active/ or completed/: $plan_path"
      ;;
  esac

  mark_step "$state_dir" "plan-completed"
  save_snapshot "$state_dir" "plan-completed"
  printf 'completed plan moved to: %s\n' "$completed_path"
}

command_commit() {
  [ "$#" -eq 2 ] || die "commit requires <task-id> <commit-message>"

  task_id=$1
  commit_message=$2
  state_dir=$(ensure_task_layout "$task_id")

  require_step "$state_dir" "plan-completed"
  require_recorded_worktree "$state_dir"
  require_current_snapshot "$state_dir" "plan-completed"

  worktree_root=$(read_meta_required "$state_dir" "worktree_root")
  if has_step "$state_dir" "committed"; then
    committed_sha=$(read_meta_optional "$state_dir" "commit_sha")
    if [ -n "$committed_sha" ] && [ "$committed_sha" = "$(git -C "$worktree_root" rev-parse HEAD)" ]; then
      if snapshot_matches_current "$state_dir" "committed"; then
        printf 'already committed: %s\n' "$committed_sha"
        return 0
      fi
    fi
  fi

  if ! git -C "$worktree_root" status --short | grep . >/dev/null; then
    die "no changes to commit"
  fi
  git -C "$worktree_root" add -A
  git -C "$worktree_root" commit -m "$commit_message"

  write_meta "$state_dir" "commit_sha" "$(git -C "$worktree_root" rev-parse HEAD)"
  mark_step "$state_dir" "committed"
  save_snapshot "$state_dir" "committed"
  printf 'created commit: %s\n' "$(read_meta_required "$state_dir" "commit_sha")"
}

command_merge() {
  [ "$#" -eq 2 ] || die "merge requires <task-id> <target-branch>"

  task_id=$1
  target_branch=$2
  state_dir=$(ensure_task_layout "$task_id")

  require_step "$state_dir" "committed"
  require_current_snapshot "$state_dir" "committed"

  root_path=$(read_meta_required "$state_dir" "repo_root")
  task_branch=$(read_meta_required "$state_dir" "branch")
  if has_step "$state_dir" "merged"; then
    existing_target=$(read_meta_optional "$state_dir" "target_branch")
    if [ -n "$existing_target" ] && [ "$existing_target" = "$target_branch" ]; then
      if git -C "$root_path" merge-base --is-ancestor "$task_branch" "$target_branch"; then
        printf 'already merged into %s\n' "$target_branch"
        return 0
      fi
    fi
  fi

  current_branch=$(git -C "$root_path" rev-parse --abbrev-ref HEAD)
  [ "$current_branch" = "$target_branch" ] || die "main repo root must be on '$target_branch' before merge"
  if git -C "$root_path" status --short | grep . >/dev/null; then
    die "main repo root must be clean before merge"
  fi

  git -C "$root_path" merge --ff-only "$task_branch"

  write_meta "$state_dir" "target_branch" "$target_branch"
  write_meta "$state_dir" "merge_commit" "$(git -C "$root_path" rev-parse HEAD)"
  mark_step "$state_dir" "merged"
  printf 'merged %s into %s\n' "$task_branch" "$target_branch"
}

command_report() {
  [ "$#" -eq 1 ] || die "report requires <task-id>"

  task_id=$1
  state_dir=$(ensure_task_layout "$task_id")

  require_step "$state_dir" "merged"

  mark_step "$state_dir" "reported"

  printf 'task: %s\n' "$task_id"
  printf 'plan: %s\n' "$(read_meta_required "$state_dir" "plan_path")"
  printf 'branch: %s\n' "$(read_meta_required "$state_dir" "branch")"
  printf 'worktree: %s\n' "$(read_meta_required "$state_dir" "worktree_root")"
  printf 'commit: %s\n' "$(read_meta_required "$state_dir" "commit_sha")"
  printf 'merged-into: %s\n' "$(read_meta_required "$state_dir" "target_branch")"
}

command_status() {
  [ "$#" -eq 1 ] || die "status requires <task-id>"

  task_id=$1
  state_dir=$(ensure_task_layout "$task_id")

  printf 'task: %s\n' "$task_id"
  for meta_name in repo_root plan_path branch worktree_root base_ref base_commit commit_sha target_branch merge_commit; do
    meta_value=$(read_meta_optional "$state_dir" "$meta_name")
    if [ -n "$meta_value" ]; then
      printf '%s: %s\n' "$meta_name" "$meta_value"
    fi
  done

  for step_name in plan-recorded worktree-prepared implementation-done tests-done verified plan-completed committed merged reported; do
    if has_step "$state_dir" "$step_name"; then
      printf '%s: done\n' "$step_name"
    else
      printf '%s: pending\n' "$step_name"
    fi
  done
}

main() {
  [ "$#" -ge 1 ] || {
    usage
    exit 1
  }

  command_name=$1
  shift

  case "$command_name" in
    record-plan) command_record_plan "$@" ;;
    prepare-worktree) command_prepare_worktree "$@" ;;
    implementation-done) command_implementation_done "$@" ;;
    tests-done) command_tests_done "$@" ;;
    verify) command_verify "$@" ;;
    complete-plan) command_complete_plan "$@" ;;
    commit) command_commit "$@" ;;
    merge) command_merge "$@" ;;
    report) command_report "$@" ;;
    status) command_status "$@" ;;
    help|-h|--help) usage ;;
    *) usage; die "unknown command: $command_name" ;;
  esac
}

main "$@"
