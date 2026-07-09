import { Code } from './Code'
import { AgentsTable, ExitCodesTable, FlagsTable, ProfileFieldsTable } from './DocsTables'
import { GhostMark } from './GhostMark'
import { BACKENDS, INSTALL, REPO, USAGE } from './data'
import { DOCS_NAV, REPO_DOCS } from './docsContent'

function DocsNav() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <GhostMark />
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
            {DOCS_NAV.map((n) => (
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
            <FlagsTable />
            <h3>Exit codes</h3>
            <ExitCodesTable />
          </section>

          <section id="agents" className="doc-section">
            <h2>Agents</h2>
            <p>
              The agent name maps to a profile in <code>profiles/</code>. Native
              runs your host’s installed CLI; the three first-class agents are
              also baked into the docker image.
            </p>
            <AgentsTable />
          </section>

          <section id="configuration" className="doc-section">
            <h2>Configuration</h2>
            <h3>Profile fields</h3>
            <p>
              Each agent is one file, <code>profiles/&lt;agent&gt;.env</code>,
              sourced by the launcher:
            </p>
            <ProfileFieldsTable />
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
              <GhostMark />
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
