// GitHub content fetching helpers
const BASE_URL =
  'https://raw.githubusercontent.com/cybersecma/CyberSecMain/youssef-remake'
const API_URL =
  'https://api.github.com/repos/cybersecma/CyberSecMain/contents/src/posts?ref=youssef-remake'
const STREAMS_URL =
  'https://raw.githubusercontent.com/cybersecma/CyberSecMain/refs/heads/youssef-remake/src/data/streams.json'

function parseFrontmatter(frontmatterStr) {
  const frontmatter = {}
  const lines = frontmatterStr.split('\n')
  for (let line of lines) {
    line = line.trim()
    if (!line || !line.includes(':')) continue

    const idx = line.indexOf(':')
    const key = line.substring(0, idx).trim()
    let value = line.substring(idx + 1).trim()

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .substring(1, value.length - 1)
        .split(',')
        .map((v) => v.trim().replace(/['"]/g, ''))
    } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
      value = value.toLowerCase() === 'true'
    } else if (!isNaN(Number(value))) {
      value = Number(value)
    }

    frontmatter[key] = value
  }
  return frontmatter
}

export async function fetchFileNames(folder = 'src/posts/general') {
  const url = API_URL.replace('src/posts', folder)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch file list: ${response.status}`)
  const data = await response.json()
  return data
    .filter((f) => f.type === 'file' && f.name.endsWith('.md'))
    .map((f) => f.name)
}

export async function fetchMarkdown(filePath) {
  const url = `${BASE_URL}/src/posts/general/${filePath}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${filePath}`)
  return res.text()
}

export async function fetchPostFromMarkdown(markdown, fileName) {
  let frontmatter = {}
  let content = markdown

  if (markdown.startsWith('---')) {
    const parts = markdown.split('---')
    if (parts.length >= 3) {
      frontmatter = parseFrontmatter(parts[1])
      content = parts.slice(2).join('---').trim()
    }
  }

  return {
    slug: fileName.replace('.md', ''),
    title: frontmatter['title'] || fileName.replace('.md', ''),
    excerpt: frontmatter['excerpt'] || content.substring(0, 150) + '...',
    author: frontmatter['author'] || 'CyberSecMA Team',
    authorAvatar:
      frontmatter['authorAvatar'] ||
      'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
    publishedAt: frontmatter['publishedAt'] || new Date().toISOString(),
    categories: frontmatter['categories'] || ['Cybersecurity'],
    tags: frontmatter['tags'] || ['security', 'tech'],
    content,
  }
}

export async function fetchArticles() {
  const fileNames = await fetchFileNames()
  const articles = []

  for (const fileName of fileNames) {
    const markdown = await fetchMarkdown(fileName)
    const article = await fetchPostFromMarkdown(markdown, fileName)
    articles.push(article)
  }

  return articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export async function fetchStreams() {
  try {
    const response = await fetch(STREAMS_URL)
    if (!response.ok) throw new Error(`Failed to fetch streams: ${response.status}`)
    const list = await response.json()
    return list
  } catch (e) {
    console.warn('Failed to fetch streams, returning empty list', e)
    return []
  }
}
