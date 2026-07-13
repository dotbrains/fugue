import type { Backend } from './policyBuilderModel'
import {
  AgentBackendFieldset,
  ExtraDirectoriesFieldset,
  NativeFileSystemFieldset,
  OptionsFieldset,
  PromptFieldset,
} from './PolicyBuilderFormSections'

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
      <AgentBackendFieldset agent={agent} backend={backend} setAgent={setAgent} setBackend={setBackend} />
      <OptionsFieldset
        backend={backend}
        ephemeral={ephemeral}
        shareHome={shareHome}
        strict={strict}
        setEphemeral={setEphemeral}
        setShareHome={setShareHome}
        setStrict={setStrict}
      />
      <PromptFieldset prompt={prompt} setPrompt={setPrompt} />
      {backend === 'native' && (
        <NativeFileSystemFieldset
          homeDir={homeDir}
          projectDir={projectDir}
          setHomeDir={setHomeDir}
          setProjectDir={setProjectDir}
        />
      )}
      <ExtraDirectoriesFieldset
        backend={backend}
        denyRead={denyRead}
        roDirs={roDirs}
        rwDirs={rwDirs}
        setDenyRead={setDenyRead}
        setRoDirs={setRoDirs}
        setRwDirs={setRwDirs}
      />
    </form>
  )
}
