import {
  AgentsSection,
  BackendsSection,
  CliSection,
  ConfigurationSection,
  InstallSection,
  OverviewSection,
  QuickstartSection,
  ReferenceSection,
  SecuritySection,
} from './DocsSections'
import { GhostMark } from './GhostMark'
import { REPO } from './data'
import { DOCS_NAV } from './docsContent'

function DocsNav() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <GhostMark />
          </span>
          fugue <span className="brand-sub">/ docs</span>
        </a>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="#cli">CLI</a>
          <a href="#agents">Agents</a>
          <a className="nav-cta" href={REPO} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>
  )
}

export default function Docs() {
  return (
    <>
      <DocsNav />
      <div className="container docs-layout">
        <aside className="docs-side">
          <nav>
            {DOCS_NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`}>
                {n.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="doc">
          <OverviewSection />
          <InstallSection />
          <QuickstartSection />
          <BackendsSection />
          <CliSection />
          <AgentsSection />
          <ConfigurationSection />
          <SecuritySection />
          <ReferenceSection />
        </main>
      </div>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">
              <GhostMark />
            </span>
            fugue
          </a>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href={REPO} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={`${REPO}/tree/main/docs`} target="_blank" rel="noreferrer">
              Docs source
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
