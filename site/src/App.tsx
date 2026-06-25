import { type ReactNode } from 'react'
import { AgentIcon } from './AgentIcon'
import { Code } from './Code'
import DiceDemo from './DiceDemo'
import PolicyBuilder from './PolicyBuilder'
import {
  AGENTS,
  BACKENDS,
  CONFIG,
  GRANTS,
  INSTALL,
  PROOF,
  REPO,
  TRACE,
  USAGE,
} from './data'

function Nav() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            {'>_'}
          </span>
          fugue
        </a>
        <nav className="nav-links">
          <a href="#how">How it works</a>
          <a href="#backends">Backends</a>
          <a href="#agents">Agents</a>
          <a href="#policy-builder">Builder</a>
          <a href="/docs">Docs</a>
          <a className="nav-cta" href={REPO} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">incognito mode for AI coding agents</p>
          <h1>
            Go full <span className="accent">--yolo</span>.
            <br />
            Nothing persists.
          </h1>
          <p className="lede">
            A <em>fugue state</em> is dissociative amnesia: you act, then keep no
            memory of having acted. <strong>fugue</strong> does that to a coding
            agent — it runs, does the work, and leaves <strong>nothing
            behind</strong>: no transcript, no telemetry, no phone-home, no
            lingering credentials or caches.
          </p>
          <p className="lede sub">
            The guarantee doesn’t depend on the agent behaving. The environment
            is made <strong>incapable of persisting anything</strong> — the
            kernel blocks the syscall before any file is touched.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#install">
              Install
            </a>
            <a className="btn" href="#how">
              How it works
            </a>
          </div>
        </div>
        <div className="hero-term" aria-hidden="true">
          <div className="term">
            <div className="term-bar">
              <span className="dot dot-r" />
              <span className="dot dot-y" />
              <span className="dot dot-g" />
              <span className="term-title">fugue</span>
            </div>
            <pre className="term-body">
              <span className="ln">
                <span className="prompt">$</span> fugue claude "refactor the auth
                module"
              </span>
              <span className="ln dim">
                fugue: claude session (docker) — strict=1 — no trace will persist
              </span>
              <span className="ln">
                <span className="ok">✓</span> egress allow: api.anthropic.com →
                443
              </span>
              <span className="ln">
                <span className="ok">✓</span> $HOME on tmpfs · container --rm
              </span>
              <span className="ln dim">…agent works…</span>
              <span className="ln">
                <span className="ok">✓</span> done — session evaporated
                <span className="cursor" />
              </span>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

function Trace() {
  return (
    <section className="section" id="how">
      <div className="container">
        <h2>Every trace surface, closed</h2>
        <p className="section-lede">
          What an agent normally leaves on your machine — and what fugue does
          with it instead.
        </p>
        <div className="trace">
          <div className="trace-head">
            <span>Trace surface</span>
            <span>Normally</span>
            <span>Under fugue</span>
          </div>
          {TRACE.map((row) => (
            <div className="trace-row" key={row.surface}>
              <span className="trace-surface">{row.surface}</span>
              <span className="trace-normal">{row.normally}</span>
              <span className="trace-fugue">
                <span className="ok">✓</span> {row.fugue}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Backends() {
  return (
    <section className="section alt" id="backends">
      <div className="container">
        <h2>Two backends, one promise</h2>
        <p className="section-lede">
          Pick your isolation. Both forward exactly one credential and kill
          telemetry; they differ in how they sandbox.
        </p>
        <div className="cards two">
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
      </div>
    </section>
  )
}

function Grants() {
  return (
    <section className="section">
      <div className="container">
        <h2>What it can — and can’t — touch</h2>
        <p className="section-lede">
          Read/write your project and toolchains by default. Everything
          sensitive is denied, by the kernel, not by trust.
        </p>
        <div className="cards two">
          <div className="card grant ok-card">
            <h3>
              <span className="ok">✓</span> Allowed
            </h3>
            <ul className="ticks">
              {GRANTS.allowed.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          <div className="card grant no-card">
            <h3>
              <span className="no">✗</span> Denied
            </h3>
            <ul className="ticks no">
              {GRANTS.denied.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function proofLine(line: string, i: number): ReactNode {
  let inner: ReactNode = line
  if (line.trim() === '') {
    inner = ' '
  } else if (/Operation not permitted/.test(line)) {
    inner = <span className="hl-deny">{line}</span>
  } else if (line.includes('✓')) {
    inner = <span className="hl-ok">{line}</span>
  } else if (line.trimStart().startsWith('#')) {
    inner = <span className="hl-comment">{line}</span>
  } else if (line.startsWith('fugue:')) {
    inner = <span className="dim">{line}</span>
  } else {
    const m = line.match(/^(\s*)(\[agent\]\s)?(\$)(\s.*)$/)
    if (m) {
      inner = (
        <>
          {m[1]}
          {m[2] ? <span className="dim">{m[2]}</span> : null}
          <span className="hl-prompt">{m[3]}</span>
          <span className="hl-cmd">{m[4]}</span>
        </>
      )
    }
  }
  return (
    <span className="ln" key={i}>
      {inner}
    </span>
  )
}

function Proof() {
  return (
    <section className="section alt">
      <div className="container narrow">
        <h2>Proof, not promises</h2>
        <p className="section-lede">
          Ask the agent to leak your SSH key. Watch the kernel refuse — before a
          byte is read.
        </p>
        <div className="term proof">
          <div className="term-bar">
            <span className="dot dot-r" />
            <span className="dot dot-y" />
            <span className="dot dot-g" />
            <span className="term-title">native backend · sandbox-exec</span>
          </div>
          <pre className="term-body">
            <code>{PROOF.split('\n').map(proofLine)}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}

function Generate() {
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

function Agents() {
  return (
    <section className="section" id="agents">
      <div className="container">
        <h2>14 agents, sandboxed</h2>
        <p className="section-lede">
          All of them run inside their sandbox and can’t impact anything outside
          it. Adding another is one profile.
        </p>
        <div className="agent-grid">
          {AGENTS.map((a) => (
            <div className="agent" key={a.name}>
              <div className="agent-top">
                <AgentIcon name={a.name} size={22} />
                <span className="agent-cmd">{a.name}</span>
              </div>
              <span className="agent-label">{a.label}</span>
              <span className="agent-backends">{a.backends}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function configIcon(title: string): ReactNode {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 } as const
  if (title === 'Extra directories') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" {...p} strokeLinejoin="round">
        <path d="M3 6.5h6l1.5 2H21V18a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18z" />
      </svg>
    )
  }
  if (title === 'Shell wrappers') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" {...p} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 7l4 4-4 4" />
        <line x1="12" y1="16" x2="18" y2="16" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...p} strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function Config() {
  return (
    <section className="section alt">
      <div className="container">
        <h2>Configure to taste</h2>
        <div className="config-list">
          {CONFIG.map((c) => (
            <div className="config-item" key={c.title}>
              <div className="config-text">
                <div className="config-ico">{configIcon(c.title)}</div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
              <div className="term config-term">
                <div className="term-bar">
                  <span className="dot dot-r" />
                  <span className="dot dot-y" />
                  <span className="dot dot-g" />
                  <span className="term-title">{c.tag}</span>
                </div>
                <pre className="term-body small">
                  <code>{c.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Install() {
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

function FailClosed() {
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

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden="true">
              {'>_'}
            </span>
            fugue
          </a>
          <p className="muted">
            Published at <code>ghcr.io/dotbrains/fugue</code> ·{' '}
            <a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
              PolyForm Shield 1.0.0
            </a>
          </p>
        </div>
        <div className="footer-links">
          <a href={REPO} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={`${REPO}/tree/main/docs`} target="_blank" rel="noreferrer">
            Docs
          </a>
          <a href={`${REPO}/blob/main/docs/threat-model.md`} target="_blank" rel="noreferrer">
            Threat model
          </a>
          <a href="https://dotbrains.dev" target="_blank" rel="noreferrer">
            dotbrains
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <DiceDemo />
        <Trace />
        <Backends />
        <Grants />
        <Proof />
        <Agents />
        <Config />
        <PolicyBuilder />
        <Generate />
        <Install />
        <FailClosed />
      </main>
      <Footer />
    </>
  )
}
