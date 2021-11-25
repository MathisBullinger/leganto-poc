const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const port = 5000
app.use(cors())
app.use(express.json())

app.listen(port, () => {
  console.log(`segmenter at ${port}`)
})

app.post('/', (req, res) => {
  const txt = fs.readFileSync(
    path.join(__dirname, '../content', req.body.file),
    'utf-8'
  )

  const matcher = new RegExp(
    [
      '',
      ...req.body.segment
        .split('')
        .map((v) => (v === ' ' ? '\\s' : v.match(/[()?]/) ? `\\${v}` : v)),
      '',
    ].join('\\n*_?')
  )

  const match = txt.match(matcher)
  if (!match) throw Error("couldn't find segment")

  const comp = (a, b) => a === b || (a === ' ' && b === '\n')

  let offset = 0
  for (let i = 0; i <= req.body.index; i++)
    while (!comp(req.body.segment[i], match[0][i + offset])) offset++

  const index = req.body.index + match.index + offset + 1

  console.log(`matched [${index}] offset ${offset}`, match[0])
  const updated = txt.slice(0, index) + '|' + txt.slice(index)

  fs.writeFileSync(path.join(__dirname, '../content', req.body.file), updated)

  res.send(200)
})
