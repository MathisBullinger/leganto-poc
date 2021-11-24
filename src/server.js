const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const eta = require('eta')

app.engine('eta', eta.renderFile)
app.set('view engine', 'eta')
app.set('views', './views')

app.locals.basedir = path.join(__dirname, '..')

app.use('/static', express.static('views/static'))

app.get('/:story/*', (req, res) => {
  res.render('story', {
    title: req.params.story,
    langs: req.params[0].replace(/\/$/, '').split('/'),
  })
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
