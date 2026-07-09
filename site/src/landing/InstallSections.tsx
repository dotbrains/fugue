import { Code } from '../Code'
import { INSTALL, REPO, USAGE } from '../data'

export function Generate() {
  return (
    <section className="section" id="generate">
      <div className="container narrow">
        <h2>Generate your own setup with an LLM</h2>
        <p className="section-lede">
          Hand a ready-made prompt to Claude, Codex, or Gemini. It inspects
          fugue’s real profiles and launcher, detects your toolchains and
          installed agents, then emits the exact command, a new
          <code>profiles/&lt;name&gt;.env</code> if needed, and the sandbox
          policy fugue will apply — tailored to your machine.
        </p>
        <div className="gen-card">
          <p>
            The prompt keeps the egress allowlist minimal, never invents
            telemetry variables, separates read-only from read-write grants, and
            keeps SSH keys, cloud creds, and other secrets denied by default.
          </p>
          <div className="gen-actions">
            <a
              className="btn btn-primary"
              href="/llm-instructions.txt"
              target="_blank"
              rel="noreferrer"
            >
              Open the copy-paste prompt ↗
            </a>
            <a
              className="btn"
              href={`${REPO}/blob/main/prompts/new-agent-profile.md`}
              target="_blank"
              rel="noreferrer"
            >
              New-agent profile prompt ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
export function Install() {
  return (
    <section className="section" id="install">
      <div className="container">
        <h2>Install</h2>
        <div className="cards install-cards">
          {INSTALL.map((i) => (
            <div className="card install" key={i.id}>
              <div className="install-head">
                <h3>{i.label}</h3>
                <p className="muted">{i.note}</p>
              </div>
              <Code>{i.code}</Code>
            </div>
          ))}
        </div>
        <h3 className="usage-title">Then run a session</h3>
        <Code>{USAGE}</Code>
      </div>
    </section>
  )
}

export function FailClosed() {
  return (
    <section className="section alt">
      <div className="container narrow center">
        <h2>Fail-closed by design</h2>
        <p className="section-lede">
          In <code>--strict</code> mode, if fugue can’t install the egress
          firewall, it refuses to run rather than silently leak. An incognito
          promise it can’t keep is worse than an honest refusal.
        </p>
        <p>
          <a className="btn" href={`${REPO}/blob/main/docs/threat-model.md`} target="_blank" rel="noreferrer">
            Read the threat model ↗
          </a>
        </p>
      </div>
    </section>
  )
}
