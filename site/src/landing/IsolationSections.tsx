import { BACKENDS, GRANTS, TRACE } from '../data'

export function Trace() {
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

export function Backends() {
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

export function Grants() {
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
