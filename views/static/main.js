const panes = [...document.querySelectorAll('.split-view > div')]

const stops = panes.map((v) => [...v.querySelectorAll('[data-align]')])
for (const step of stops[0].map((_, i) => stops.map((v) => v[i]))) {
  const max = Math.max(...step.map((v) => v.offsetTop))

  for (const stop of step) {
    const offset = stop.offsetTop
    if (offset >= max) continue
    const padd = document.createElement('div')
    padd.style.height = `${max - offset}px`
    padd.className = 'align'
    stop.parentElement.insertBefore(padd, stop)
  }
}

let lastPos = Array(panes.length).fill(0)
const height = new Map(panes.map((v) => [v, v.scrollHeight - v.offsetHeight]))

panes.forEach((el) => {
  el.addEventListener('scroll', onScroll)
})

function onScroll({ currentTarget: el }) {
  const pos = panes.map((v) =>
    v === el
      ? el.scrollTop
      : Math.round((el.scrollTop / height.get(el)) * height.get(v))
  )
  if (pos.every((v, i) => lastPos[i] === v)) return
  lastPos = pos

  pos.forEach((top, i) => {
    if (panes[i] !== el) panes[i].scrollTo({ top, behavior: 'auto' })
  })
}
