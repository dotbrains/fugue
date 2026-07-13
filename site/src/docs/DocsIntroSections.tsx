import { Code } from '../Code'
import { BACKENDS, INSTALL, USAGE } from '../data'

export function OverviewSection() {
  return (
    <section id="overview" className="doc-section">
      <h1>fugue documentation</h1>
      <p>
        fugue runs an AI coding agent — Claude, Codex, Gemini, and a dozen more —
        in a no-trace, sandboxed session. The agent does the work and leaves
        nothing behind: no transcript, telemetry, phone-home, credentials, or
        caches. The guarantee comes from the environment, not from the agent
        behaving.
      </p>
      <p>
        It has two backends: <strong>docker</strong> (a <code>--rm</code>{' '}
        container with a tmpfs <code>$HOME</code> and an nftables egress
        allowlist) and <strong>native</strong> (the host’s agent under macOS{' '}
        <code>sandbox-exec</code>, with writes leashed to the project and reads
        of secrets denied by the kernel).
      </p>
    </section>
  )
}

export function InstallSection() {
  return (
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
  )
}

export function QuickstartSection() {
  return (
    <section id="quickstart" className="doc-section">
      <h2>Quickstart</h2>
      <p>
        You need Docker (for the default backend) or macOS (for the native
        backend), and an API key for at least one agent in your environment.
        Then:
      </p>
      <Code>{USAGE}</Code>
    </section>
  )
}

export function BackendsSection() {
  return (
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
  )
}
