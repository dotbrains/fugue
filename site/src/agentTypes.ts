export type Agent = { name: string; label: string; backends: string }

// Per-agent monogram badges for the icon set (distinct 2-letter mark + brand-ish
// color). Used in the agent dropdown and the agents grid.
export type Badge = { code: string; color: string; dark?: boolean }
