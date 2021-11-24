const panes = [...document.querySelectorAll('.split-view > div')]

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
