import { Code } from '../Code'
import { AgentsTable, ExitCodesTable, FlagsTable, ProfileFieldsTable } from '../DocsTables'
import { REPO } from '../data'
import { REPO_DOCS } from '../docsContent'

export function CliSection() {
  return (
    <section id="cli" className="doc-section">
      <h2>CLI reference</h2>
      <Code>{'fugue [flags] <agent> [agent args...]\nfugue shellenv [bash|zsh|fish]'}</Code>
      <h3>Flags</h3>
      <FlagsTable />
      <h3>Exit codes</h3>
      <ExitCodesTable />
    </section>
  )
}

export function AgentsSection() {
  return (
    <section id="agents" className="doc-section">
      <h2>Agents</h2>
      <p>
        The agent name maps to a profile in <code>profiles/</code>. Native runs
        your host’s installed CLI; the three first-class agents are also baked
        into the docker image.
      </p>
      <AgentsTable />
    </section>
  )
}

export function ConfigurationSection() {
  return (
    <section id="configuration" className="doc-section">
      <h2>Configuration</h2>
      <h3>Profile fields</h3>
      <p>
        Each agent is one file, <code>profiles/&lt;agent&gt;.env</code>, sourced
        by the launcher:
      </p>
      <ProfileFieldsTable />
      <h3>Environment</h3>
      <p>
        <code>FUGUE_BACKEND</code> sets the default backend.{' '}
        <code>FUGUE_IMAGE</code> overrides the docker image.{' '}
        <code>FUGUE_DENY_READ</code> adds extra read denials to the native
        sandbox. Credentials are read from your host env per the agent’s{' '}
        <code>API_KEY_VARS</code>.
      </p>
    </section>
  )
}

export function SecuritySection() {
  return (
    <section id="security" className="doc-section">
      <h2>Security</h2>
      <p>
        In <code>--strict</code> mode fugue <strong>fails closed</strong>: if it
        cannot install the egress firewall, it refuses to run rather than
        silently leak.
      </p>
      <p>
        The native backend is weaker than docker on several axes — no host-level
        egress allowlist, reads are a denylist (not an allowlist), and there is
        no process/kernel isolation. Read the threat model before relying on it
        adversarially.
      </p>
      <p>
        <a className="btn" href={`${REPO}/blob/main/docs/threat-model.md`} target="_blank" rel="noreferrer">
          Read the threat model ↗
        </a>
      </p>
    </section>
  )
}

export function ReferenceSection() {
  return (
    <section id="reference" className="doc-section">
      <h2>Full reference</h2>
      <p>The complete, authoritative docs live in the repository. Each links to GitHub:</p>
      <ul className="doc-links">
        {REPO_DOCS.map(([file, desc]) => (
          <li key={file}>
            <a href={`${REPO}/blob/main/docs/${file}`} target="_blank" rel="noreferrer">
              {file}
            </a>{' '}
            — {desc}
          </li>
        ))}
      </ul>
    </section>
  )
}
