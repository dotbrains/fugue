export type TraceRow = { surface: string; normally: string; fugue: string }

export const TRACE: TraceRow[] = [
  {
    surface: 'Session state / history',
    normally: '~/.claude, ~/.codex, ~/.gemini persist',
    fugue: '$HOME on tmpfs — gone on exit',
  },
  {
    surface: 'Telemetry / analytics / error reports',
    normally: 'enabled by default',
    fugue: 'killed per-agent via env',
  },
  {
    surface: 'Autoupdate checks',
    normally: 'phone home on launch',
    fugue: 'disabled',
  },
  {
    surface: 'Network egress',
    normally: 'unrestricted',
    fugue: 'nftables allowlist → model API only',
  },
  {
    surface: 'Workspace artifacts / caches',
    normally: 'linger on disk',
    fugue: 'container is --rm; optional tmpfs workspace',
  },
]

export type Backend = {
  id: string
  name: string
  tagline: string
  points: string[]
}

export const BACKENDS: Backend[] = [
  {
    id: 'docker',
    name: 'docker',
    tagline: 'Full isolation in a --rm container. The strongest guarantee.',
    points: [
      'tmpfs $HOME — every transcript, cache, and credential dies on exit',
      'nftables egress allowlist — only the model API IP:443 is reachable',
      'per-agent telemetry / analytics / autoupdate kill-env',
      '--cap-drop ALL, no-new-privileges, unprivileged uid',
    ],
  },
  {
    id: 'native',
    name: 'native',
    tagline: 'No container. Your host agent under the macOS kernel sandbox.',
    points: [
      'sandbox-exec (Seatbelt) denies writes outside the project',
      'reads of SSH keys & cloud creds blocked by the kernel',
      'ephemeral $HOME by default; --share-home when you need a login',
      'runs any of the 14 agents you have installed — no image needed',
    ],
  },
]

export const GRANTS = {
  allowed: [
    'Read & write your project directory (the cwd / git root)',
    'Read your installed toolchains and the system',
    'Reach the agent’s model API (allowlisted under --strict)',
    'Extra paths you opt in with --add-dir / --ro-dir',
  ],
  denied: [
    'Reading your SSH keys, cloud creds, and keychains',
    'Writing anything outside the project directory',
    'Phoning home — telemetry, analytics, autoupdate',
    'Exfiltrating code to any non-API host (docker --strict)',
  ],
}

export type ConfigItem = {
  title: string
  tag: string
  body: string
  code?: string
}

export const CONFIG: ConfigItem[] = [
  {
    title: 'Extra directories',
    tag: '--add-dir · --ro-dir',
    body: 'Expose more paths read-write or read-only — a shared cache, a sibling library.',
    code: 'fugue --ro-dir ~/.cache/go-build \\\n      --add-dir ../shared-lib \\\n      claude "..."',
  },
  {
    title: 'Shell wrappers',
    tag: 'fugue shellenv',
    body: 'Route every agent through fugue automatically. POSIX (bash/zsh) and fish. Run command <agent> to bypass.',
    code: 'eval "$(fugue shellenv)"   # bash/zsh\nfugue shellenv fish | source\n\nclaude "..."      # sandboxed\ncommand claude    # bypass',
  },
  {
    title: 'Add any agent',
    tag: 'profiles/<name>.env',
    body: 'A profile is five fields. Feed an agent’s docs to the bundled prompt template and drop the result in profiles/.',
    code: 'AGENT_CMD="myagent"\nAPI_KEY_VARS="MY_API_KEY"\nAPI_HOSTS="api.example.com"\nTELEMETRY_ENV=("DO_NOT_TRACK=1")\nBACKENDS="native"',
  },
]
