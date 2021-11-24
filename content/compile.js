const fs = require('fs')
const path = require('path')

search().forEach(compile)

function search(dir = '.') {
  return fs.readdirSync(dir).flatMap((v) => {
    const p = path.join(dir, v)
    if (fs.lstatSync(p).isDirectory()) return search(p)
    return v.endsWith('.txt') ? [p] : []
  })
}

function compile(file) {
  const html = fs
    .readFileSync(file, 'utf-8')
    .replace(/(?<!\n)\n(?!\n)/g, ' ')
    .replace(/^\n*|\n*$/g, '')
    .replace(/_([^_]+)_/g, (_, v) => `<i>${v}</i>`)
    .split('\n\n\n')
    .map((row) =>
      row.split('\n\n').map(
        (v) =>
          `<p>${v
            .split('|')
            .map((v) => `<span>${v}</span>`)
            .join('')}</p>`
      )
    )
    .map((v) => (v.length > 1 ? `<div>${v.join('')}</div>` : v[0]))
    .map((v, i) => v.replace(/>/, ` style="--row: ${i + 1}">`))
    .join('')

  fs.writeFileSync(file.replace(/\.txt$/, '.html'), html)
}
