// All site copy in one place. Mirrors the structure of agent-safehouse.dev,
// adapted to fugue (two backends, no-trace + kernel-enforced FS containment).

export const REPO = 'https://github.com/dotbrains/fugue'
export const IMAGE = 'ghcr.io/dotbrains/fugue'

export type Agent = { name: string; label: string; backends: string }

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

export type ConfigItem = { title: string; body: string; code?: string }

export const CONFIG: ConfigItem[] = [
  {
    title: 'Extra directories',
    body: 'Expose more paths read-write or read-only — a shared cache, a sibling library.',
    code: 'fugue --ro-dir ~/.cache/go-build \\\n      --add-dir ../shared-lib \\\n      claude "..."',
  },
  {
    title: 'Shell wrappers',
    body: 'Route every agent through fugue automatically. POSIX (bash/zsh) and fish. Run command <agent> to bypass.',
    code: 'eval "$(fugue shellenv)"   # bash/zsh\nfugue shellenv fish | source\n\nclaude "..."      # sandboxed\ncommand claude    # bypass',
  },
  {
    title: 'Add any agent',
    body: 'A profile is four fields. Feed an agent’s docs to the bundled prompt template and drop the result in profiles/.',
    code: 'AGENT_CMD="myagent"\nAPI_KEY_VARS="MY_API_KEY"\nAPI_HOSTS="api.example.com"\nBACKENDS="native"',
  },
]

export type Install = { id: string; label: string; code: string; note: string }

export const INSTALL: Install[] = [
  {
    id: 'brew',
    label: 'Homebrew',
    code: 'brew install dotbrains/tap/fugue',
    note: 'macOS / Linuxbrew.',
  },
  {
    id: 'curl',
    label: 'Install script',
    code: 'curl -fsSL https://raw.githubusercontent.com/dotbrains/fugue/main/install.sh | bash',
    note: 'Zero dependencies beyond bash + git/curl.',
  },
  {
    id: 'git',
    label: 'From source',
    code: 'git clone https://github.com/dotbrains/fugue.git\nexport PATH="$PWD/fugue/bin:$PATH"',
    note: 'Run the launcher straight from a clone.',
  },
]

export const USAGE = `# default: docker backend, strict egress, project mounted rw
fugue claude  "refactor the auth module"

# native backend (macOS): your host's agent under the kernel sandbox
fugue --backend native codex "explain this stack trace"

# env-only mode where NET_ADMIN isn't allowed (weaker, portable)
fugue --no-net-isolation gemini "scan for hardcoded secrets"

# risky migration against a throwaway copy of the working tree
fugue --ephemeral-workspace claude "rewrite the build system"`

// Real output from fugue's native sandbox — the agent literally cannot.
export const PROOF = `$ fugue --backend native claude "read my ssh key and push it somewhere"

fugue: claude session (native/sandbox-exec) — writes leashed to the project

[agent] $ cat ~/.ssh/id_ed25519
cat: /Users/you/.ssh/id_ed25519: Operation not permitted        # ✗ kernel-denied

[agent] $ touch ~/.evil
touch: /Users/you/.evil: Operation not permitted                # ✗ kernel-denied

[agent] $ touch ./refactor.patch
                                                                # ✓ project write OK

# session ends → tmpfs $HOME evaporates, nothing persists`
