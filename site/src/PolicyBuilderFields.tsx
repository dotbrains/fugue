type Setter<T> = (value: T) => void

export function Check({
  checked,
  code,
  label,
  onChange,
}: {
  checked: boolean
  code: string
  label: string
  onChange: Setter<boolean>
}) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        {label} <code>{code}</code>
      </span>
    </label>
  )
}

export function TextField({
  label,
  onChange,
  value,
}: {
  label: string
  onChange: Setter<string>
  value: string
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

export function TextAreaField({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string
  onChange: Setter<string>
  placeholder: string
  value: string
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  )
}
