const fs = require('fs')
const path = require('path')

search().forEach(compile)

function search(dir = path.resolve(__dirname, '../content')) {
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
      row.split('\n\n').map((v) => {
        const tag = v.startsWith('#') ? 'h1' : 'p'
        return `<${tag}>${v
          .replace(/^#\s*/, '')
          .split('|')
          .map((v) => `<span>${v}</span>`)
          .join('')}</${tag}>`
      })
    )
    .map((v) => {
      if (v.length <= 1) return v[0]
      const tag = v[0].startsWith('<h1') ? 'header' : 'div'
      return `<${tag}>${v.join('')}</${tag}>`
    })
    .map((v, i) => v.replace(/>/, ` style="--row: ${i + 1}">`))
    .join('')

  fs.writeFileSync(file.replace(/\.txt$/, '.html'), html)
}
