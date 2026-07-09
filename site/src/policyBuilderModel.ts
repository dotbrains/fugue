import {
  AGENT_HOSTS,
  IMAGE,
  SECRET_DENY_FILES,
  SECRET_DENYLIST,
} from './data'

export type Backend = 'docker' | 'native'

export function toLines(s: string): string[] {
  return s
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}

export function buildCommand(input: {
  agent: string
  backend: Backend
  prompt: string
  strict: boolean
  ephemeral: boolean
  shareHome: boolean
  ro: string[]
  rw: string[]
  deny: string[]
}): string {
  const env: string[] = []
  if (input.backend === 'native' && input.deny.length) {
    env.push(`FUGUE_DENY_READ="${input.deny.join(' ')}"`)
  }
  const parts = ['fugue']
  if (input.backend === 'native') parts.push('--backend native')
  if (input.backend === 'docker' && !input.strict) parts.push('--no-net-isolation')
  if (input.ephemeral) parts.push('--ephemeral-workspace')
  if (input.backend === 'native' && input.shareHome) parts.push('--share-home')
  for (const d of input.ro) parts.push(`--ro-dir ${d}`)
  for (const d of input.rw) parts.push(`--add-dir ${d}`)
  parts.push(input.agent)
  parts.push(`"${input.prompt || '...'}"`)
  const cmd = parts.join(' ')
  return (env.length ? env.join(' ') + ' ' : '') + cmd
}

export function buildSbpl(input: {
  homeDir: string
  projectDir: string
  ephemeral: boolean
  shareHome: boolean
  rw: string[]
  deny: string[]
}): string {
  const home = input.homeDir.replace(/\/+$/, '') || '~'
  const work = input.ephemeral
    ? '<TMPDIR>/fugue.XXXXXX/workspace'
    : input.projectDir.replace(/\/+$/, '')
  const runHome = input.shareHome ? home : '<TMPDIR>/fugue.XXXXXX/home'
  const out: string[] = []
  out.push('(version 1)')
  out.push('(allow default)')
  out.push('')
  out.push(';; --- writes: deny everywhere, then re-allow project + scratch ---')
  out.push('(deny file-write*)')
  out.push(`(allow file-write* (subpath "${work}"))`)
  out.push(`(allow file-write* (subpath "${runHome}"))`)
  out.push('(allow file-write* (subpath "/private/tmp"))')
  out.push('(allow file-write* (subpath "/private/var/tmp"))')
  out.push('(allow file-write* (subpath "/private/var/folders"))')
  out.push('(allow file-write* (subpath "/dev"))')
  for (const d of input.rw) out.push(`(allow file-write* (subpath "${d}"))`)
  out.push('')
  out.push(';; --- reads: deny secrets (kernel-enforced) ---')
  for (const s of SECRET_DENYLIST) out.push(`(deny file-read* (subpath "${home}/${s}"))`)
  for (const f of SECRET_DENY_FILES) out.push(`(deny file-read* (literal "${home}/${f}"))`)
  for (const d of input.deny) out.push(`(deny file-read* (subpath "${d}"))`)
  return out.join('\n')
}

export function buildDockerSummary(input: {
  agent: string
  strict: boolean
  ephemeral: boolean
  ro: string[]
  rw: string[]
}): string {
  const hosts = AGENT_HOSTS[input.agent] ?? '<agent API host>'
  const mounts: string[] = []
  mounts.push(
    input.ephemeral
      ? 'tmpfs /workspace (throwaway copy of cwd)'
      : '$(pwd) -> /workspace (rw)',
  )
  for (const d of input.rw) mounts.push(`${d} -> ${d} (rw)`)
  for (const d of input.ro) mounts.push(`${d} -> ${d} (ro)`)
  const egress = input.strict
    ? `policy drop; allow DNS + loopback + established\n           allow ${hosts.split(' ').join(':443\n           allow ')}:443`
    : 'no firewall — env-only telemetry kill (weaker)'
  return [
    '# docker backend — what fugue assembles',
    `image      ${IMAGE}:latest`,
    'home       tmpfs $HOME (ephemeral, mode 0700)',
    `workspace  ${mounts.join('\n           ')}`,
    `egress     ${egress}`,
    'hardening  --cap-drop ALL · no-new-privileges · uid 1001',
    'teardown   --rm — nothing persists',
  ].join('\n')
}
