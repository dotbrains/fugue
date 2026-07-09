import { AgentIcon } from './AgentIcon'
import { AGENT_HOSTS, AGENTS } from './data'
import { EXIT_CODES, FLAGS, PROFILE_FIELDS } from './docsContent'

function KeyValueTable({
  headings,
  rows,
}: {
  headings: [string, string]
  rows: [string, string][]
}) {
  return (
    <div className="doc-table-wrap">
      <table className="doc-table">
        <thead>
          <tr>
            <th>{headings[0]}</th>
            <th>{headings[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([key, value]) => (
            <tr key={key}>
              <td>
                <code>{key}</code>
              </td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function FlagsTable() {
  return <KeyValueTable headings={['Flag', 'Effect']} rows={FLAGS} />
}

export function ExitCodesTable() {
  return <KeyValueTable headings={['Code', 'Meaning']} rows={EXIT_CODES} />
}

export function ProfileFieldsTable() {
  return <KeyValueTable headings={['Field', 'Purpose']} rows={PROFILE_FIELDS} />
}

export function AgentsTable() {
  return (
    <div className="doc-table-wrap">
      <table className="doc-table">
        <thead>
          <tr>
            <th>Agent</th>
            <th>Backends</th>
            <th>API host(s)</th>
          </tr>
        </thead>
        <tbody>
          {AGENTS.map((a) => (
            <tr key={a.name}>
              <td>
                <span className="doc-agent">
                  <AgentIcon name={a.name} size={18} />
                  <code>{a.name}</code>
                </span>
              </td>
              <td>{a.backends}</td>
              <td className="doc-hosts">{AGENT_HOSTS[a.name]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
