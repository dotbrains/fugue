import { type ReactNode } from 'react'
import { PROOF } from '../data'

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

export function Proof() {
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

