export const DOCS_NAV = [
  { id: 'overview', label: 'Overview' },
  { id: 'install', label: 'Install' },
  { id: 'quickstart', label: 'Quickstart' },
  { id: 'backends', label: 'Backends' },
  { id: 'cli', label: 'CLI reference' },
  { id: 'agents', label: 'Agents' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'security', label: 'Security' },
  { id: 'reference', label: 'Full reference' },
]

export const FLAGS: [string, string][] = [
  ['--backend <docker|native>', 'Execution backend (default docker; or FUGUE_BACKEND).'],
  ['--strict', 'docker: hard nftables egress allowlist (default). Fails closed.'],
  ['--no-net-isolation', 'docker: env-only mode, no firewall. Weaker, portable.'],
  ['--ephemeral-workspace', 'Run against a throwaway copy of the cwd.'],
  ['--add-dir <path>', 'Expose a path read-write inside the sandbox (repeatable).'],
  ['--ro-dir <path>', 'Expose a path read-only inside the sandbox (repeatable).'],
  ['--share-home', 'native: keep the real $HOME (for agents that need a host login).'],
  ['--keep-on-error', 'Skip the scrub if the agent exits non-zero (debug).'],
  ['--image <ref>', 'docker: use a specific image.'],
  ['-h, --help', 'Print usage and exit.'],
]

export const EXIT_CODES: [string, string][] = [
  ['0', 'The agent ran and exited successfully.'],
  ['2', 'Launcher usage error (unknown agent/flag/backend, missing credential).'],
  ['3', 'docker --strict could not install the egress allowlist; refused to run.'],
  ['other', "The agent's own exit code, propagated unchanged."],
]

export const PROFILE_FIELDS: [string, string][] = [
  ['AGENT_CMD', 'The command that runs the agent (e.g. claude).'],
  ['API_KEY_VARS', 'Host env var(s) holding the credential; the first one set is forwarded.'],
  ['API_HOSTS', 'Hosts egress may reach under docker --strict (TCP 443). Keep minimal.'],
  ['TELEMETRY_ENV', 'KEY=VALUE pairs that kill telemetry, analytics, and autoupdate.'],
  ['BACKENDS', 'Which backends the agent runs under: docker and/or native.'],
]

export const REPO_DOCS: [string, string][] = [
  ['quickstart.md', 'First no-trace session in minutes.'],
  ['installation.md', 'Install fugue and the developer toolchain.'],
  ['usage.md', 'Every flag, agent, and exit code.'],
  ['configuration.md', 'The profile contract and the FUGUE_* environment.'],
  ['architecture.md', 'How each backend sandboxes, end to end.'],
  ['security.md', 'Trust boundaries and the fail-closed contract.'],
  ['threat-model.md', 'What each backend does and does not defend against.'],
  ['development.md', 'The quality gate and contributor workflow.'],
  ['releasing.md', 'How the image is published, and version pinning.'],
  ['troubleshooting.md', 'Common local and runtime failures.'],
]
