import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import fs from 'fs'

main(process.argv[2])

async function main(url) {
  const { document } = await fetch(url)
    .then((v) => v.text())
    .then((v) => new JSDOM(v).window)

  const tl1 = document.querySelector('.hcovertitle').textContent
  const tl2 = document.querySelector('.hcoversub').textContent

  const l1 = [...document.querySelectorAll('.l1')].map((v) => v.textContent)
  const l2 = [...document.querySelectorAll('.l2')].map((v) => v.textContent)

  const story = {
    title: [tl1, tl2],
    sections: l1.map((v, i) => [v, l2[i]]),
  }

  fs.writeFileSync('story.json', JSON.stringify(story))
}
