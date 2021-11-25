const fs = require('fs')
const path = require('path')
const eta = require('eta')

const root = path.resolve(__dirname, '..')
eta.config.views = path.resolve(root, 'views')
eta.config.root = root
const content = path.resolve(root, 'content')
const outDir = path.resolve(root, 'build')

const permutate = (langs) =>
  !langs.length
    ? []
    : langs.flatMap((lang) => [
        [lang],
        ...permutate(langs.filter((v) => v !== lang)).map((v) => [lang, ...v]),
      ])

const stories = fs.readdirSync(content)
stories.forEach(async (id) => {
  const files = fs
    .readdirSync(path.resolve(content, id))
    .filter((v) => /.*[a-z]{2}\.txt$/.exec(v))

  const chapterLangs = [
    ...new Set(files.map((v) => v.replace(/[a-z]{2}\.txt$/, ''))),
  ].map((name) => [
    name,
    files
      .filter((v) => v.startsWith(name))
      .map((v) => v.match(/([a-z]{2})\.txt$/)[1]),
  ])

  for (const [chapter, langSet] of chapterLangs) {
    for (const langs of permutate(langSet)) {
      // console.log(langs)
      let pre = `${id}/${chapter}`
      // if (chapter) path += chapter + '_'
      // console.log(path)
      const out = await compile(id, pre, langs)
      // console.log(out)
      const dir = path.join(outDir, ...langs, id, chapter.replace(/_$/, ''))
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, 'index.html'), out)
    }
  }
})

// console.log(
//   eta.renderFile('story.eta', {
//     title: 'Alice in Wonderland',
//     path: 'alice/c1_',
//     langs: ['en'],
//   })
// )

async function compile(title, path, langs) {
  return await eta.renderFile('story.eta', { title, path, langs })
}
