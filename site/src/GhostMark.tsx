// Brand mark: a ghost. Fugue is incognito mode for AI agents — the agent runs,
// does the work, and leaves nothing behind. Inherits the accent via
// currentColor; eyes are punched out with fill-rule="evenodd" so it reads on
// any background.
export function GhostMark({ size = '1em' }: { size?: number | string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role="img"
      style={{ verticalAlign: '-0.15em' }}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4 20 V11 a8 8 0 0 1 16 0 V20
           l-2.667 -2.5 -2.667 2.5 -2.667 -2.5 -2.667 2.5 -2.667 -2.5 -2.667 2.5 Z
           M7.2 10 a1.8 1.8 0 1 0 3.6 0 a1.8 1.8 0 1 0 -3.6 0 Z
           M13.2 10 a1.8 1.8 0 1 0 3.6 0 a1.8 1.8 0 1 0 -3.6 0 Z"
      />
    </svg>
  )
}
