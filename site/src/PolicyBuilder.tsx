import { useMemo, useState } from 'react'
import AgentSelect from './AgentSelect'
import { PolicyBuilderOutput } from './PolicyBuilderOutput'
import { AGENTS } from './data'
import { type Backend, buildCommand, buildDockerSummary, buildSbpl, toLines } from './policyBuilderModel'

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

  const command = useMemo(
    () => buildCommand({ agent, backend, prompt, strict, ephemeral, shareHome, ro, rw, deny }),
    [agent, backend, prompt, strict, ephemeral, shareHome, ro, rw, deny],
  )

  const sbpl = useMemo(
    () => buildSbpl({ homeDir, projectDir, ephemeral, shareHome, rw, deny }),
    [homeDir, projectDir, ephemeral, shareHome, rw, deny],
  )

  const dockerSummary = useMemo(
    () => buildDockerSummary({ agent, strict, ephemeral, ro, rw }),
    [agent, strict, ephemeral, ro, rw],
  )

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

          <PolicyBuilderOutput
            agent={agent}
            backend={backend}
            command={command}
            dockerSummary={dockerSummary}
            invalid={invalid}
            sbpl={sbpl}
          />
        </div>
      </div>
    </section>
  )
}
