import AgentSelect from './AgentSelect'
import { Check, TextAreaField, TextField } from './PolicyBuilderFields'
import type { Backend } from './policyBuilderModel'

type Setter<T> = (value: T) => void

export function AgentBackendFieldset({
  agent,
  backend,
  setAgent,
  setBackend,
}: {
  agent: string
  backend: Backend
  setAgent: Setter<string>
  setBackend: Setter<Backend>
}) {
  return (
    <fieldset>
      <legend>Agent &amp; backend</legend>
      <label className="field">
        <span>Agent</span>
        <AgentSelect value={agent} onChange={setAgent} />
      </label>
      <div className="seg">
        {(['docker', 'native'] as const).map((value) => (
          <button key={value} type="button" className={backend === value ? 'on' : ''} onClick={() => setBackend(value)}>
            {value}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function OptionsFieldset({
  backend,
  ephemeral,
  shareHome,
  strict,
  setEphemeral,
  setShareHome,
  setStrict,
}: {
  backend: Backend
  ephemeral: boolean
  shareHome: boolean
  strict: boolean
  setEphemeral: Setter<boolean>
  setShareHome: Setter<boolean>
  setStrict: Setter<boolean>
}) {
  return (
    <fieldset>
      <legend>Options</legend>
      {backend === 'docker' && (
        <Check checked={strict} onChange={setStrict} label="Strict egress allowlist" code="--strict" />
      )}
      <Check checked={ephemeral} onChange={setEphemeral} label="Throwaway workspace" code="--ephemeral-workspace" />
      {backend === 'native' && <Check checked={shareHome} onChange={setShareHome} label="Keep real $HOME" code="--share-home" />}
    </fieldset>
  )
}

export function PromptFieldset({ prompt, setPrompt }: { prompt: string; setPrompt: Setter<string> }) {
  return (
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
  )
}

export function NativeFileSystemFieldset({
  homeDir,
  projectDir,
  setHomeDir,
  setProjectDir,
}: {
  homeDir: string
  projectDir: string
  setHomeDir: Setter<string>
  setProjectDir: Setter<string>
}) {
  return (
    <fieldset>
      <legend>File system (native)</legend>
      <TextField label="Home dir (for secret denials)" value={homeDir} onChange={setHomeDir} />
      <TextField label="Project dir (read/write)" value={projectDir} onChange={setProjectDir} />
    </fieldset>
  )
}

export function ExtraDirectoriesFieldset({
  backend,
  denyRead,
  roDirs,
  rwDirs,
  setDenyRead,
  setRoDirs,
  setRwDirs,
}: {
  backend: Backend
  denyRead: string
  roDirs: string
  rwDirs: string
  setDenyRead: Setter<string>
  setRoDirs: Setter<string>
  setRwDirs: Setter<string>
}) {
  return (
    <fieldset>
      <legend>Extra directories</legend>
      <TextAreaField label="Read-only (one per line) → --ro-dir" value={roDirs} onChange={setRoDirs} placeholder="~/.cache/go-build" />
      <TextAreaField label="Read-write (one per line) → --add-dir" value={rwDirs} onChange={setRwDirs} placeholder="../shared-lib" />
      {backend === 'native' && (
        <TextAreaField label="Extra read denials → FUGUE_DENY_READ" value={denyRead} onChange={setDenyRead} placeholder="/Users/you/secrets" />
      )}
    </fieldset>
  )
}
