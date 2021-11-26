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
  let dir = Math.sign(pos[0] - lastPos[0]) || scrollDir
  if (dir < 0 !== scrollDir < 0) placeTitleBars(dir > 0)
  scrollDir = dir
  if (pos.every((v, i) => lastPos[i] === v)) return
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

function placeTitleBars(down) {
  for (const pane of panes) {
    const o = down ? ` - var(--title-height)` : ''
    pane.querySelector(
      '.title-bar'
    ).style.bottom = `calc(100% - ${pane.scrollTop}px${o})`
  }
}
