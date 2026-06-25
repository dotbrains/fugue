import { useEffect, useRef, useState } from 'react'
import { AGENTS } from './data'
import { AgentIcon } from './AgentIcon'

// A custom listbox so each option can show the agent's icon — a native <select>
// can only render plain text in its options.
export default function AgentSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (name: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(() =>
    Math.max(0, AGENTS.findIndex((a) => a.name === value)),
  )
  const ref = useRef<HTMLDivElement>(null)
  const selected = AGENTS.find((a) => a.name === value) ?? AGENTS[0]

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const choose = (name: string) => {
    onChange(name)
    setOpen(false)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      setOpen(true)
      return
    }
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(AGENTS.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      choose(AGENTS[active].name)
    }
  }

  return (
    <div className="adrop" ref={ref}>
      <button
        type="button"
        className="adrop-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
      >
        <AgentIcon name={selected.name} />
        <span className="adrop-name">
          {selected.name} <span className="adrop-label">— {selected.label}</span>
        </span>
        <span className="adrop-caret" aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <ul className="adrop-list" role="listbox" tabIndex={-1}>
          {AGENTS.map((a, i) => (
            <li
              key={a.name}
              role="option"
              aria-selected={a.name === value}
              className={
                'adrop-opt' +
                (a.name === value ? ' sel' : '') +
                (i === active ? ' active' : '')
              }
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(a.name)}
            >
              <AgentIcon name={a.name} />
              <span className="adrop-name">
                {a.name} <span className="adrop-label">— {a.label}</span>
              </span>
              <span className="adrop-be">{a.backends}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
