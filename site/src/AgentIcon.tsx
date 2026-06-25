import {
  siAmp,
  siClaude,
  siCline,
  siCursor,
  siGithubcopilot,
  siGooglegemini,
  siOpencode,
  siPi,
} from 'simple-icons'
import { AGENT_BADGE } from './data'

// Real brand logos where a community icon exists; a monogram for the rest.
// Colors are nudged lighter where a brand's mark is near-black so it reads on
// the dark tile.
type Logo = { path: string; color: string }
const LOGOS: Record<string, Logo> = {
  claude: { path: siClaude.path, color: '#' + siClaude.hex },
  gemini: { path: siGooglegemini.path, color: '#a78bda' },
  opencode: { path: siOpencode.path, color: '#e6e8ec' },
  amp: { path: siAmp.path, color: '#3b7bff' },
  copilot: { path: siGithubcopilot.path, color: '#e6e8ec' },
  pi: { path: siPi.path, color: '#e6e8ec' },
  cursor: { path: siCursor.path, color: '#e6e8ec' },
  cline: { path: siCline.path, color: '#e6e8ec' },
}

export function AgentIcon({ name, size = 22 }: { name: string; size?: number }) {
  const logo = LOGOS[name]
  const badge = AGENT_BADGE[name] ?? {
    code: name.slice(0, 2).toUpperCase(),
    color: '#9aa4b2',
  }
  const glyph = Math.round(size * 0.6)
  return (
    <span className="aicon" style={{ width: size, height: size }} aria-hidden="true">
      {logo ? (
        <svg viewBox="0 0 24 24" width={glyph} height={glyph} role="img">
          <path d={logo.path} fill={logo.color} />
        </svg>
      ) : (
        <span
          className="aicon-code"
          style={{ color: badge.color, fontSize: Math.round(size * 0.4) }}
        >
          {badge.code}
        </span>
      )}
    </span>
  )
}
