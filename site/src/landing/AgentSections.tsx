import { type ReactNode } from 'react'
import { AgentIcon } from '../AgentIcon'
import { CONFIG, AGENTS } from '../data'

export function Agents() {
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

export function Config() {
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
