import { AGENT_BADGE } from './data'

export function AgentIcon({ name, size = 20 }: { name: string; size?: number }) {
  const b = AGENT_BADGE[name] ?? { code: name.slice(0, 2).toUpperCase(), color: '#3a3f4a' }
  return (
    <span
      className="aicon"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        background: b.color,
        color: b.dark ? '#0b0c0e' : '#fff',
        fontSize: Math.round(size * 0.42),
      }}
    >
      {b.code}
    </span>
  )
}
