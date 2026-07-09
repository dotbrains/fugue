import DiceDemo from './DiceDemo'
import PolicyBuilder from './PolicyBuilder'
import { Hero } from './landing/Hero'
import { Agents, Config } from './landing/AgentSections'
import { Generate, Install, FailClosed } from './landing/InstallSections'
import { Backends, Grants, Trace } from './landing/IsolationSections'
import { Footer, Nav } from './landing/Layout'
import { Proof } from './landing/Proof'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <DiceDemo />
        <Trace />
        <Backends />
        <Grants />
        <Proof />
        <Agents />
        <Config />
        <PolicyBuilder />
        <Generate />
        <Install />
        <FailClosed />
      </main>
      <Footer />
    </>
  )
}
