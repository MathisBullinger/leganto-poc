const panes = [...document.querySelectorAll('.split-view > article')]

let lastPos = Array(panes.length).fill((_, i) => panes[i].scrollTop)
let scrollDir = 1
const height = new Map(panes.map((v) => [v, v.scrollHeight - v.offsetHeight]))

panes.forEach((el) => {
  el.addEventListener('scroll', onScroll)

  el.querySelectorAll('span').forEach((v, i) => {
    v.dataset.seg = i
  })
})

function onScroll({ currentTarget: el }) {
  const pos = panes.map((v) =>
    v === el
      ? el.scrollTop
      : Math.round((el.scrollTop / height.get(el)) * height.get(v))
  )
  if (pos.every((v, i) => lastPos[i] === v)) return

  const i = panes.indexOf(el)
  let dir = Math.sign(pos[i] - lastPos[i]) || scrollDir
  if (dir < 0 !== scrollDir < 0) placeTitleBars(dir > 0)
  scrollDir = dir

  lastPos = pos

  pos.forEach((top, i) => {
    if (panes[i] !== el) panes[i].scrollTo({ top, behavior: 'auto' })
  })
}

const split = document.querySelector('.split-view')
split.addEventListener('mouseover', ({ target }) => {
  if ('seg' in target.dataset && ![...target.classList].includes('active'))
    document
      .querySelectorAll(`[data-seg='${target.dataset.seg}']`)
      .forEach((v) => v.classList.add('active'))
})

split.addEventListener('mouseout', ({ target }) => {
  if ('seg' in target.dataset && [...target.classList].includes('active'))
    document
      .querySelectorAll(`[data-seg='${target.dataset.seg}']`)
      .forEach((v) => v.classList.remove('active'))
})

const BAR_HEIGHT = 2.6 * 16

function placeTitleBars(down) {
  for (const pane of panes) {
    const bar = pane.querySelector('.title-bar')
    const v = bar.offsetTop + bar.offsetHeight - pane.scrollTop
    if (v > 0 && v <= BAR_HEIGHT) continue
    const o = down ? ` - var(--title-height)` : ''
    bar.style.bottom = `calc(100% - ${pane.scrollTop}px${o})`
  }
}

const overflows = {}

const titleObserver = new ResizeObserver((nodes) => {
  const titles = nodes.map((v) => v.target.querySelector('h1'))

  for (const h1 of titles) {
    const a = h1.textContent
    const b = decodeURIComponent(h1.dataset.alt)

    if (h1.scrollWidth > h1.offsetWidth) {
      const padd = 32
      overflows[a] = Math.max(overflows[a] ?? 0, h1.scrollWidth + padd + 10)
      if (b.length < a.length) {
        h1.textContent = b
        h1.dataset.alt = encodeURIComponent(a)
      }
    } else {
      if (
        b.length < a.length ||
        h1.parentElement.offsetWidth <= (overflows[b] ?? 0)
      )
        continue
      h1.textContent = b
      h1.dataset.alt = encodeURIComponent(a)
    }
  }
})
;[...document.querySelectorAll('.title-bar')]
  .filter((v) => v.querySelector('h1[data-alt]'))
  .forEach((title) => titleObserver.observe(title))
