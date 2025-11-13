import { useEffect, useState } from 'react'
import { fetchBreaches } from './lib/firebase'
import { fetchArticles, fetchStreams } from './lib/content'

function Section({ title, children }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>
      <div className="bg-white/70 backdrop-blur rounded-xl shadow-sm ring-1 ring-gray-100 p-6">
        {children}
      </div>
    </section>
  )
}

function BreachCard({ item }) {
  return (
    <div className="p-4 rounded-lg border border-gray-100 bg-white hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">{item.target}</h4>
        <span className="text-xs text-gray-500">{item.date || 'Unknown date'}</span>
      </div>
      <p className="text-sm text-gray-600 mt-2">{item.description}</p>
      {item.usefulness && (
        <span className="inline-block mt-3 text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded">Useful</span>
      )}
    </div>
  )
}

function ArticleCard({ article }) {
  return (
    <article className="p-4 rounded-lg border border-gray-100 bg-white hover:shadow-md transition">
      <h4 className="font-medium text-gray-900">{article.title}</h4>
      <p className="text-sm text-gray-600 mt-2">{article.excerpt}</p>
      <div className="flex items-center gap-3 mt-3">
        <img src={article.authorAvatar} alt={article.author} className="w-6 h-6 rounded-full" />
        <span className="text-xs text-gray-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
      </div>
    </article>
  )
}

function StreamCard({ stream }) {
  return (
    <div className="p-4 rounded-lg border border-gray-100 bg-white hover:shadow-md transition">
      <h4 className="font-medium text-gray-900">{stream.title}</h4>
      <p className="text-sm text-gray-600 mt-2">{stream.description}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-500">{new Date(stream.date).toLocaleString()}</span>
        <span className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-700">{stream.type}</span>
      </div>
    </div>
  )
}

function App() {
  const [breaches, setBreaches] = useState([])
  const [articles, setArticles] = useState([])
  const [streams, setStreams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [b, a, s] = await Promise.all([
        fetchBreaches().catch(() => []),
        fetchArticles().catch(() => []),
        fetchStreams().catch(() => []),
      ])
      setBreaches(b)
      setArticles(a)
      setStreams(s)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      <header className="bg-white/80 backdrop-blur sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">CM</span>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">CyberSecMA</h1>
              <p className="text-xs text-gray-500">Moroccan Cybersecurity Community</p>
            </div>
          </div>
          <nav className="hidden sm:flex gap-6 text-sm text-gray-600">
            <a className="hover:text-gray-900" href="#breaches">Breaches</a>
            <a className="hover:text-gray-900" href="#articles">Articles</a>
            <a className="hover:text-gray-900" href="#streams">Streams</a>
          </nav>
        </div>
      </header>

      <main className="pb-16">
        <Section title="Latest Breaches" id="breaches">
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {breaches.map((b) => (
                <BreachCard key={b.id} item={b} />
              ))}
              {breaches.length === 0 && (
                <div className="text-gray-500">No breaches available.</div>
              )}
            </div>
          )}
        </Section>

        <Section title="Community Articles" id="articles">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
            {articles.length === 0 && (
              <div className="text-gray-500">No articles available.</div>
            )}
          </div>
        </Section>

        <Section title="Live Streams" id="streams">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {streams.map((s) => (
              <StreamCard key={s.id} stream={s} />
            ))}
            {streams.length === 0 && (
              <div className="text-gray-500">No streams available.</div>
            )}
          </div>
        </Section>
      </main>

      <footer className="py-10 text-center text-sm text-gray-500">
        Built with love by the Moroccan cybersecurity community.
      </footer>
    </div>
  )
}

export default App
