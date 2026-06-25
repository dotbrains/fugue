import { AgentIcon } from './AgentIcon'
import { Code } from './Code'
import { AGENT_HOSTS, AGENTS, BACKENDS, INSTALL, REPO, USAGE } from './data'

const NAV = [
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

const FLAGS: [string, string][] = [
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

const EXIT_CODES: [string, string][] = [
  ['0', 'The agent ran and exited successfully.'],
  ['2', 'Launcher usage error (unknown agent/flag/backend, missing credential).'],
  ['3', 'docker --strict could not install the egress allowlist; refused to run.'],
  ['other', "The agent's own exit code, propagated unchanged."],
]

const PROFILE_FIELDS: [string, string][] = [
  ['AGENT_CMD', 'The command that runs the agent (e.g. claude).'],
  ['API_KEY_VARS', 'Host env var(s) holding the credential; the first one set is forwarded.'],
  ['API_HOSTS', 'Hosts egress may reach under docker --strict (TCP 443). Keep minimal.'],
  ['TELEMETRY_ENV', 'KEY=VALUE pairs that kill telemetry, analytics, and autoupdate.'],
  ['BACKENDS', 'Which backends the agent runs under: docker and/or native.'],
]

const REPO_DOCS: [string, string][] = [
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

function DocsNav() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            {'>_'}
          </span>
          fugue <span className="brand-sub">/ docs</span>
        </a>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="#cli">CLI</a>
          <a href="#agents">Agents</a>
          <a className="nav-cta" href={REPO} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>
  )
}

export default function Docs() {
  return (
    <>
      <DocsNav />
      <div className="container docs-layout">
        <aside className="docs-side">
          <nav>
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`}>
                {n.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="doc">
          <section id="overview" className="doc-section">
            <h1>fugue documentation</h1>
            <p>
              fugue runs an AI coding agent — Claude, Codex, Gemini, and a dozen
              more — in a no-trace, sandboxed session. The agent does the work
              and leaves nothing behind: no transcript, telemetry, phone-home,
              credentials, or caches. The guarantee comes from the environment,
              not from the agent behaving.
            </p>
            <p>
              It has two backends: <strong>docker</strong> (a <code>--rm</code>{' '}
              container with a tmpfs <code>$HOME</code> and an nftables egress
              allowlist) and <strong>native</strong> (the host’s agent under
              macOS <code>sandbox-exec</code>, with writes leashed to the project
              and reads of secrets denied by the kernel).
            </p>
          </section>

          <section id="install" className="doc-section">
            <h2>Install</h2>
            {INSTALL.map((i) => (
              <div key={i.id} className="doc-install">
                <h3>{i.label}</h3>
                <Code>{i.code}</Code>
                <p className="muted">{i.note}</p>
              </div>
            ))}
          </section>

          <section id="quickstart" className="doc-section">
            <h2>Quickstart</h2>
            <p>
              You need Docker (for the default backend) or macOS (for the native
              backend), and an API key for at least one agent in your
              environment. Then:
            </p>
            <Code>{USAGE}</Code>
          </section>

          <section id="backends" className="doc-section">
            <h2>Backends</h2>
            <p>
              Pick isolation with <code>--backend</code>. Both forward exactly one
              credential and kill telemetry; they differ in how they sandbox.
            </p>
            <div className="doc-cards">
              {BACKENDS.map((b) => (
                <div className="card backend" key={b.id}>
                  <div className="card-tag">{b.name}</div>
                  <p className="card-tagline">{b.tagline}</p>
                  <ul className="ticks">
                    {b.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section id="cli" className="doc-section">
            <h2>CLI reference</h2>
            <Code>{'fugue [flags] <agent> [agent args...]\nfugue shellenv [bash|zsh|fish]'}</Code>
            <h3>Flags</h3>
            <div className="doc-table-wrap">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Flag</th>
                  <th>Effect</th>
                </tr>
              </thead>
              <tbody>
                {FLAGS.map(([f, d]) => (
                  <tr key={f}>
                    <td>
                      <code>{f}</code>
                    </td>
                    <td>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <h3>Exit codes</h3>
            <div className="doc-table-wrap">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Meaning</th>
                </tr>
              </thead>
              <tbody>
                {EXIT_CODES.map(([c, d]) => (
                  <tr key={c}>
                    <td>
                      <code>{c}</code>
                    </td>
                    <td>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </section>

          <section id="agents" className="doc-section">
            <h2>Agents</h2>
            <p>
              The agent name maps to a profile in <code>profiles/</code>. Native
              runs your host’s installed CLI; the three first-class agents are
              also baked into the docker image.
            </p>
            <div className="doc-table-wrap">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Backends</th>
                  <th>API host(s)</th>
                </tr>
              </thead>
              <tbody>
                {AGENTS.map((a) => (
                  <tr key={a.name}>
                    <td>
                      <span className="doc-agent">
                        <AgentIcon name={a.name} size={18} />
                        <code>{a.name}</code>
                      </span>
                    </td>
                    <td>{a.backends}</td>
                    <td className="doc-hosts">{AGENT_HOSTS[a.name]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </section>

          <section id="configuration" className="doc-section">
            <h2>Configuration</h2>
            <h3>Profile fields</h3>
            <p>
              Each agent is one file, <code>profiles/&lt;agent&gt;.env</code>,
              sourced by the launcher:
            </p>
            <div className="doc-table-wrap">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                {PROFILE_FIELDS.map(([f, d]) => (
                  <tr key={f}>
                    <td>
                      <code>{f}</code>
                    </td>
                    <td>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <h3>Environment</h3>
            <p>
              <code>FUGUE_BACKEND</code> sets the default backend.{' '}
              <code>FUGUE_IMAGE</code> overrides the docker image.{' '}
              <code>FUGUE_DENY_READ</code> adds extra read denials to the native
              sandbox. Credentials are read from your host env per the agent’s{' '}
              <code>API_KEY_VARS</code>.
            </p>
          </section>

          <section id="security" className="doc-section">
            <h2>Security</h2>
            <p>
              In <code>--strict</code> mode fugue <strong>fails closed</strong>:
              if it cannot install the egress firewall, it refuses to run rather
              than silently leak.
            </p>
            <p>
              The native backend is weaker than docker on several axes — no
              host-level egress allowlist, reads are a denylist (not an
              allowlist), and there is no process/kernel isolation. Read the
              threat model before relying on it adversarially.
            </p>
            <p>
              <a
                className="btn"
                href={`${REPO}/blob/main/docs/threat-model.md`}
                target="_blank"
                rel="noreferrer"
              >
                Read the threat model ↗
              </a>
            </p>
          </section>

          <section id="reference" className="doc-section">
            <h2>Full reference</h2>
            <p>
              The complete, authoritative docs live in the repository. Each links
              to GitHub:
            </p>
            <ul className="doc-links">
              {REPO_DOCS.map(([file, desc]) => (
                <li key={file}>
                  <a
                    href={`${REPO}/blob/main/docs/${file}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {file}
                  </a>{' '}
                  — {desc}
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">
              {'>_'}
            </span>
            fugue
          </a>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href={REPO} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={`${REPO}/tree/main/docs`} target="_blank" rel="noreferrer">
              Docs source
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
