#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const budgetPath = process.argv[2] ?? 'scripts/file-size-budgets.json'
const budget = JSON.parse(readFileSync(budgetPath, 'utf8'))
const defaultLines = Number(budget.default_lines ?? 1000)
const fileBudgets = budget.files ?? {}

const checkedSuffixes = new Set([
  '.bash',
  '.bats',
  '.css',
  '.env',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.sh',
  '.ts',
  '.tsx',
  '.txt',
  '.yaml',
  '.yml',
])

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
  if (excludedPathPatterns.some((pattern) => pattern.test(file))) return false
  if (file === 'Dockerfile' || file === 'Makefile') return true
  return checkedSuffixes.has(file.slice(file.lastIndexOf('.')))
}

const failures = []
for (const file of gitLsFiles().filter(shouldCheck)) {
  const lineCount = readFileSync(file, 'utf8').split('\n').length - 1
  const limit = Number(fileBudgets[file] ?? defaultLines)
  if (lineCount > limit) {
    failures.push(`${file}: ${lineCount} lines > budget ${limit}`)
  }
}

if (failures.length > 0) {
  console.error('file-size budget failures:')
  for (const failure of failures) console.error(`  ${failure}`)
  process.exit(1)
}
