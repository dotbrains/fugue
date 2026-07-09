import AgentSelect from './AgentSelect'
import type { Backend } from './policyBuilderModel'

type PolicyBuilderFormProps = {
  agent: string
  backend: Backend
  denyRead: string
  ephemeral: boolean
  homeDir: string
  prompt: string
  projectDir: string
  roDirs: string
  rwDirs: string
  shareHome: boolean
  strict: boolean
  setAgent: (value: string) => void
  setBackend: (value: Backend) => void
  setDenyRead: (value: string) => void
  setEphemeral: (value: boolean) => void
  setHomeDir: (value: string) => void
  setPrompt: (value: string) => void
  setProjectDir: (value: string) => void
  setRoDirs: (value: string) => void
  setRwDirs: (value: string) => void
  setShareHome: (value: boolean) => void
  setStrict: (value: boolean) => void
}

export function PolicyBuilderForm({
  agent,
  backend,
  denyRead,
  ephemeral,
  homeDir,
  prompt,
  projectDir,
  roDirs,
  rwDirs,
  shareHome,
  strict,
  setAgent,
  setBackend,
  setDenyRead,
  setEphemeral,
  setHomeDir,
  setPrompt,
  setProjectDir,
  setRoDirs,
  setRwDirs,
  setShareHome,
  setStrict,
}: PolicyBuilderFormProps) {
  return (
    <form className="builder-form" onSubmit={(e) => e.preventDefault()}>
      <fieldset>
        <legend>Agent &amp; backend</legend>
        <label className="field">
          <span>Agent</span>
          <AgentSelect value={agent} onChange={setAgent} />
        </label>
        <div className="seg">
          <button type="button" className={backend === 'docker' ? 'on' : ''} onClick={() => setBackend('docker')}>
            docker
          </button>
          <button type="button" className={backend === 'native' ? 'on' : ''} onClick={() => setBackend('native')}>
            native
          </button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Options</legend>
        {backend === 'docker' && (
          <label className="check">
            <input type="checkbox" checked={strict} onChange={(e) => setStrict(e.target.checked)} />
            <span>
              Strict egress allowlist <code>--strict</code>
            </span>
          </label>
        )}
        <label className="check">
          <input type="checkbox" checked={ephemeral} onChange={(e) => setEphemeral(e.target.checked)} />
          <span>
            Throwaway workspace <code>--ephemeral-workspace</code>
          </span>
        </label>
        {backend === 'native' && (
          <label className="check">
            <input type="checkbox" checked={shareHome} onChange={(e) => setShareHome(e.target.checked)} />
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
            <input type="text" value={homeDir} onChange={(e) => setHomeDir(e.target.value)} />
          </label>
          <label className="field">
            <span>Project dir (read/write)</span>
            <input type="text" value={projectDir} onChange={(e) => setProjectDir(e.target.value)} />
          </label>
        </fieldset>
      )}

      <fieldset>
        <legend>Extra directories</legend>
        <label className="field">
          <span>Read-only (one per line) → --ro-dir</span>
          <textarea rows={2} value={roDirs} onChange={(e) => setRoDirs(e.target.value)} placeholder={'~/.cache/go-build'} />
        </label>
        <label className="field">
          <span>Read-write (one per line) → --add-dir</span>
          <textarea rows={2} value={rwDirs} onChange={(e) => setRwDirs(e.target.value)} placeholder={'../shared-lib'} />
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
  )
}
