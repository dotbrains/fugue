#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { spawnSync } from 'node:child_process'

const budgetPath = process.argv[2] ?? 'scripts/flat-directory-budgets.json'
const budget = JSON.parse(readFileSync(budgetPath, 'utf8'))
const defaultFiles = Number(budget.default_files ?? 25)
const directoryBudgets = budget.directories ?? {}

const excludedPathPatterns = [
  /(^|\/)node_modules\//,
  /(^|\/)(dist|build|target|deps|_build|fixtures|vendor)\//,
  /(^|\/)\.git\//,
  /(^|\/)\.flox\/env\/manifest\.lock$/,
  /(^|\/)package-lock\.json$/,
]

function gitLsFiles() {
  const result = spawnSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  if (result.status !== 0) {
    process.stderr.write(result.stderr)
    process.exit(result.status ?? 1)
  }
  return result.stdout.split('\0').filter(Boolean)
}

function shouldCheck(file) {
  return !excludedPathPatterns.some((pattern) => pattern.test(file))
}

const counts = new Map()
for (const file of gitLsFiles().filter(shouldCheck)) {
  const dir = dirname(file)
  counts.set(dir, (counts.get(dir) ?? 0) + 1)
}

const failures = []
for (const [dir, count] of [...counts.entries()].sort()) {
  const configured = directoryBudgets[dir]
  const limit = Number(configured?.limit ?? configured ?? defaultFiles)
  if (count > limit) {
    failures.push(`${dir}: ${count} files > budget ${limit}`)
  }
}

if (failures.length > 0) {
  console.error('flat-directory budget failures:')
  for (const failure of failures) console.error(`  ${failure}`)
  process.exit(1)
}
