import { useMemo, useState } from 'react'
import AgentSelect from './AgentSelect'
import {
  AGENT_HOSTS,
  AGENTS,
  IMAGE,
  SECRET_DENY_FILES,
  SECRET_DENYLIST,
} from './data'

type Backend = 'docker' | 'native'

function toLines(s: string): string[] {
  return s
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}

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

export default function PolicyBuilder() {
  const [agent, setAgent] = useState('claude')
  const [backend, setBackend] = useState<Backend>('docker')
  const [prompt, setPrompt] = useState('refactor the auth module')
  const [strict, setStrict] = useState(true)
  const [ephemeral, setEphemeral] = useState(false)
  const [shareHome, setShareHome] = useState(false)
  const [projectDir, setProjectDir] = useState('/Users/you/code/project')
  const [homeDir, setHomeDir] = useState('/Users/you')
  const [roDirs, setRoDirs] = useState('')
  const [rwDirs, setRwDirs] = useState('')
  const [denyRead, setDenyRead] = useState('')

  const ro = toLines(roDirs)
  const rw = toLines(rwDirs)
  const deny = toLines(denyRead)

  const dockerCapable = useMemo(
    () => AGENTS.find((a) => a.name === agent)?.backends.includes('docker') ?? false,
    [agent],
  )
  const invalid = backend === 'docker' && !dockerCapable

  const command = useMemo(() => {
    const env: string[] = []
    if (backend === 'native' && deny.length) {
      env.push(`FUGUE_DENY_READ="${deny.join(' ')}"`)
    }
    const parts = ['fugue']
    if (backend === 'native') parts.push('--backend native')
    if (backend === 'docker' && !strict) parts.push('--no-net-isolation')
    if (ephemeral) parts.push('--ephemeral-workspace')
    if (backend === 'native' && shareHome) parts.push('--share-home')
    for (const d of ro) parts.push(`--ro-dir ${d}`)
    for (const d of rw) parts.push(`--add-dir ${d}`)
    parts.push(agent)
    parts.push(`"${prompt || '...'}"`)
    const cmd = parts.join(' ')
    return (env.length ? env.join(' ') + ' ' : '') + cmd
  }, [agent, backend, prompt, strict, ephemeral, shareHome, ro, rw, deny])

  const sbpl = useMemo(() => {
    const home = homeDir.replace(/\/+$/, '') || '~'
    const work = ephemeral ? '<TMPDIR>/fugue.XXXXXX/workspace' : projectDir.replace(/\/+$/, '')
    const runHome = shareHome ? home : '<TMPDIR>/fugue.XXXXXX/home'
    const out: string[] = []
    out.push('(version 1)')
    out.push('(allow default)')
    out.push('')
    out.push(';; --- writes: deny everywhere, then re-allow project + scratch ---')
    out.push('(deny file-write*)')
    out.push(`(allow file-write* (subpath "${work}"))`)
    out.push(`(allow file-write* (subpath "${runHome}"))`)
    out.push('(allow file-write* (subpath "/private/tmp"))')
    out.push('(allow file-write* (subpath "/private/var/tmp"))')
    out.push('(allow file-write* (subpath "/private/var/folders"))')
    out.push('(allow file-write* (subpath "/dev"))')
    for (const d of rw) out.push(`(allow file-write* (subpath "${d}"))`)
    out.push('')
    out.push(';; --- reads: deny secrets (kernel-enforced) ---')
    for (const s of SECRET_DENYLIST) out.push(`(deny file-read* (subpath "${home}/${s}"))`)
    for (const f of SECRET_DENY_FILES) out.push(`(deny file-read* (literal "${home}/${f}"))`)
    for (const d of deny) out.push(`(deny file-read* (subpath "${d}"))`)
    return out.join('\n')
  }, [homeDir, projectDir, ephemeral, shareHome, rw, deny])

  const dockerSummary = useMemo(() => {
    const hosts = AGENT_HOSTS[agent] ?? '<agent API host>'
    const mounts: string[] = []
    mounts.push(
      ephemeral
        ? 'tmpfs /workspace (throwaway copy of cwd)'
        : '$(pwd) -> /workspace (rw)',
    )
    for (const d of rw) mounts.push(`${d} -> ${d} (rw)`)
    for (const d of ro) mounts.push(`${d} -> ${d} (ro)`)
    const egress = strict
      ? `policy drop; allow DNS + loopback + established\n           allow ${hosts.split(' ').join(':443\n           allow ')}:443`
      : 'no firewall — env-only telemetry kill (weaker)'
    return [
      '# docker backend — what fugue assembles',
      `image      ${IMAGE}:latest`,
      'home       tmpfs $HOME (ephemeral, mode 0700)',
      `workspace  ${mounts.join('\n           ')}`,
      `egress     ${egress}`,
      'hardening  --cap-drop ALL · no-new-privileges · uid 1001',
      'teardown   --rm — nothing persists',
    ].join('\n')
  }, [agent, strict, ephemeral, ro, rw])

  return (
    <section className="section" id="policy-builder">
      <div className="container">
        <h2>Policy builder</h2>
        <p className="section-lede">
          Pick an agent and your access, and fugue’s exact policy falls out — the
          command to run, plus the egress allowlist (docker) or the kernel
          sandbox profile (native) it will apply.
        </p>

        <div className="builder">
          <form className="builder-form" onSubmit={(e) => e.preventDefault()}>
            <fieldset>
              <legend>Agent &amp; backend</legend>
              <label className="field">
                <span>Agent</span>
                <AgentSelect value={agent} onChange={setAgent} />
              </label>
              <div className="seg">
                <button
                  type="button"
                  className={backend === 'docker' ? 'on' : ''}
                  onClick={() => setBackend('docker')}
                >
                  docker
                </button>
                <button
                  type="button"
                  className={backend === 'native' ? 'on' : ''}
                  onClick={() => setBackend('native')}
                >
                  native
                </button>
              </div>
            </fieldset>

            <fieldset>
              <legend>Options</legend>
              {backend === 'docker' && (
                <label className="check">
                  <input
                    type="checkbox"
                    checked={strict}
                    onChange={(e) => setStrict(e.target.checked)}
                  />
                  <span>
                    Strict egress allowlist <code>--strict</code>
                  </span>
                </label>
              )}
              <label className="check">
                <input
                  type="checkbox"
                  checked={ephemeral}
                  onChange={(e) => setEphemeral(e.target.checked)}
                />
                <span>
                  Throwaway workspace <code>--ephemeral-workspace</code>
                </span>
              </label>
              {backend === 'native' && (
                <label className="check">
                  <input
                    type="checkbox"
                    checked={shareHome}
                    onChange={(e) => setShareHome(e.target.checked)}
                  />
                  <span>
                    Keep real $HOME <code>--share-home</code>
                  </span>
                </label>
              )}
            </fieldset>

            <fieldset>
              <legend>Prompt</legend>
              <label className="field">
                <span>Task for the agent</span>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="refactor the auth module"
                />
              </label>
            </fieldset>

            {backend === 'native' && (
              <fieldset>
                <legend>File system (native)</legend>
                <label className="field">
                  <span>Home dir (for secret denials)</span>
                  <input
                    type="text"
                    value={homeDir}
                    onChange={(e) => setHomeDir(e.target.value)}
                  />
                </label>
                <label className="field">
                  <span>Project dir (read/write)</span>
                  <input
                    type="text"
                    value={projectDir}
                    onChange={(e) => setProjectDir(e.target.value)}
                  />
                </label>
              </fieldset>
            )}

            <fieldset>
              <legend>Extra directories</legend>
              <label className="field">
                <span>Read-only (one per line) → --ro-dir</span>
                <textarea
                  rows={2}
                  value={roDirs}
                  onChange={(e) => setRoDirs(e.target.value)}
                  placeholder={'~/.cache/go-build'}
                />
              </label>
              <label className="field">
                <span>Read-write (one per line) → --add-dir</span>
                <textarea
                  rows={2}
                  value={rwDirs}
                  onChange={(e) => setRwDirs(e.target.value)}
                  placeholder={'../shared-lib'}
                />
              </label>
              {backend === 'native' && (
                <label className="field">
                  <span>Extra read denials → FUGUE_DENY_READ</span>
                  <textarea
                    rows={2}
                    value={denyRead}
                    onChange={(e) => setDenyRead(e.target.value)}
                    placeholder={'/Users/you/secrets'}
                  />
                </label>
              )}
            </fieldset>
          </form>

          <div className="builder-out">
            {invalid && (
              <div className="warn">
                <strong>{agent}</strong> is native-only — the docker backend
                can’t run it. Switch to <strong>native</strong>, or bake it into
                the image first.
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
                  fugue generates this automatically at run time, substituting
                  your real temp paths. Shown here for transparency.
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
        </div>
      </div>
    </section>
  )
}
