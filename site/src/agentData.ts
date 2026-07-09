import { type Agent, type Badge } from './agentTypes'
export const AGENT_BADGE: Record<string, Badge> = {
  claude: { code: 'CL', color: '#d97757' },
  codex: { code: 'CX', color: '#10a37f' },
  gemini: { code: 'GE', color: '#4285f4' },
  opencode: { code: 'OC', color: '#f0a92e', dark: true },
  amp: { code: 'AM', color: '#ff5a4d' },
  copilot: { code: 'CP', color: '#8a63f4' },
  aider: { code: 'AI', color: '#0ea5b7' },
  goose: { code: 'GO', color: '#c4823a' },
  auggie: { code: 'AU', color: '#5b8def' },
  pi: { code: 'PI', color: '#b15cf0' },
  cursor: { code: 'CU', color: '#cfd3da', dark: true },
  cline: { code: 'CN', color: '#3b82f6' },
  kilo: { code: 'KI', color: '#f97316' },
  droid: { code: 'DR', color: '#9aa4b2', dark: true },
}

// Egress hosts per agent (from each profile's API_HOSTS), used by the policy
// builder to preview the docker --strict allowlist.
export const AGENT_HOSTS: Record<string, string> = {
  claude: 'api.anthropic.com',
  codex: 'api.openai.com',
  gemini: 'generativelanguage.googleapis.com',
  opencode: 'api.anthropic.com api.openai.com openrouter.ai opencode.ai',
  amp: 'ampcode.com',
  copilot: 'api.githubcopilot.com api.github.com',
  aider: 'api.anthropic.com api.openai.com',
  goose: 'api.openai.com api.anthropic.com generativelanguage.googleapis.com',
  auggie: 'api.augmentcode.com',
  pi: 'api.anthropic.com api.openai.com pi.dev',
  cursor: 'api.cursor.com api2.cursor.com auth.cursor.com',
  cline: 'api.cline.bot api.anthropic.com api.openai.com',
  kilo: 'api.kilo.ai app.kilo.ai api.anthropic.com api.openai.com',
  droid: 'app.factory.ai api.factory.ai',
}

// The reads fugue's native backend denies by default (mirrors bin/fugue).
export const SECRET_DENYLIST = [
  '.ssh',
  '.aws',
  '.gnupg',
  '.config/gh',
  '.config/gcloud',
  '.kube',
  '.docker',
  'Library/Keychains',
]
export const SECRET_DENY_FILES = ['.netrc', '.npmrc', '.pypirc']

export const AGENTS: Agent[] = [
  { name: 'claude', label: 'Claude Code', backends: 'docker · native' },
  { name: 'codex', label: 'Codex', backends: 'docker · native' },
  { name: 'gemini', label: 'Gemini CLI', backends: 'docker · native' },
  { name: 'opencode', label: 'OpenCode', backends: 'native' },
  { name: 'amp', label: 'Amp', backends: 'native' },
  { name: 'copilot', label: 'Copilot CLI', backends: 'native' },
  { name: 'aider', label: 'Aider', backends: 'native' },
  { name: 'goose', label: 'Goose', backends: 'native' },
  { name: 'auggie', label: 'Auggie', backends: 'native' },
  { name: 'pi', label: 'Pi', backends: 'native' },
  { name: 'cursor', label: 'Cursor Agent', backends: 'native' },
  { name: 'cline', label: 'Cline', backends: 'native' },
  { name: 'kilo', label: 'Kilo Code', backends: 'native' },
  { name: 'droid', label: 'Droid', backends: 'native' },
]
