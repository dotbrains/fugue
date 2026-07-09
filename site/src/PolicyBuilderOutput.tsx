import { useState } from 'react'

function download(name: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function MiniCopy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className="copy"
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1400)
        })
      }}
    >
      {copied ? 'copied' : 'copy'}
    </button>
  )
}

export function PolicyBuilderOutput({
  agent,
  backend,
  command,
  dockerSummary,
  invalid,
  sbpl,
}: {
  agent: string
  backend: 'docker' | 'native'
  command: string
  dockerSummary: string
  invalid: boolean
  sbpl: string
}) {
  return (
    <div className="builder-out">
      {invalid && (
        <div className="warn">
          <strong>{agent}</strong> is native-only — the docker backend can’t run
          it. Switch to <strong>native</strong>, or bake it into the image first.
        </div>
      )}

      <div className="out-block">
        <div className="out-head">
          <span>Command</span>
          <MiniCopy text={command} />
        </div>
        <pre className="out-pre">
          <code>{command}</code>
        </pre>
      </div>

      {backend === 'native' ? (
        <div className="out-block">
          <div className="out-head">
            <span>Sandbox profile (fugue.sb)</span>
            <span className="out-actions">
              <MiniCopy text={sbpl} />
              <button
                type="button"
                className="copy"
                onClick={() => download('fugue.sb', sbpl)}
              >
                download .sb
              </button>
            </span>
          </div>
          <pre className="out-pre tall">
            <code>{sbpl}</code>
          </pre>
          <p className="muted note">
            fugue generates this automatically at run time, substituting your
            real temp paths. Shown here for transparency.
          </p>
        </div>
      ) : (
        <div className="out-block">
          <div className="out-head">
            <span>Effective policy</span>
            <MiniCopy text={dockerSummary} />
          </div>
          <pre className="out-pre tall">
            <code>{dockerSummary}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
