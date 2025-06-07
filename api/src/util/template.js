import fs from 'node:fs'

const cache = new Map()

function getFilePath(path) {
  return path.endsWith('.html') ? path : path.concat('.html')
}

function getFileCached(path) {
  const resolved = getFilePath(path)
  if (!cache.has(resolved) || true) {
    cache.set(resolved, fs.readFileSync(resolved).toString())
  }
  return cache.get(resolved)
}

export function html(file, data) {
  let htmlRaw = getFileCached(file)

  const startInclude = '$${'
  const endsInclude = '}'

  while (htmlRaw.includes(startInclude)) {
    const start = htmlRaw.indexOf(startInclude) + startInclude.length
    const end = htmlRaw.indexOf(endsInclude, start)

    const includeFile = htmlRaw.slice(start, end)

    const startCut = htmlRaw.slice(0, start - startInclude.length)
    const endsCut = htmlRaw.slice(end + endsInclude.length)

    htmlRaw = `${startCut}${html(getFilePath(includeFile), data)}${endsCut}`
  }

  for (const key in data) {
    htmlRaw = htmlRaw.replaceAll(`\${${key}}`, data[key])
  }

  return htmlRaw
}
