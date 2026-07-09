export function Hero() {
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
            <a className="btn" href="/docs">
              Read the docs ↗
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

