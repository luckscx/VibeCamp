import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Tools from './pages/Tools'
import Paths from './pages/Paths'
import Templates from './pages/Templates'
import Prompts from './pages/Prompts'
import Issues from './pages/Issues'
import Glossary from './pages/Glossary'
import Chapters from './pages/Chapters'
import Cases from './pages/Cases'

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/paths" element={<Paths />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/prompts" element={<Prompts />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/chapters/:slug" element={<Chapters />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/:slug" element={<Cases />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
