import { useMemo, useState } from 'react'
import { PolicyBuilderForm } from './PolicyBuilderForm'
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
          <PolicyBuilderForm
            agent={agent}
            backend={backend}
            denyRead={denyRead}
            ephemeral={ephemeral}
            homeDir={homeDir}
            prompt={prompt}
            projectDir={projectDir}
            roDirs={roDirs}
            rwDirs={rwDirs}
            shareHome={shareHome}
            strict={strict}
            setAgent={setAgent}
            setBackend={setBackend}
            setDenyRead={setDenyRead}
            setEphemeral={setEphemeral}
            setHomeDir={setHomeDir}
            setPrompt={setPrompt}
            setProjectDir={setProjectDir}
            setRoDirs={setRoDirs}
            setRwDirs={setRwDirs}
            setShareHome={setShareHome}
            setStrict={setStrict}
          />
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
