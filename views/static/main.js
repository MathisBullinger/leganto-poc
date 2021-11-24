const panes = [...document.querySelectorAll('.split-view > div')]
let lastPos = Array(panes.length).fill(0)

panes.forEach((el) => el.addEventListener('scroll', onScroll))

function onScroll({ currentTarget: el }) {
  const other = panes[+(panes[0] === el)]

  const top = Math.round(
    (el.scrollTop / (el.scrollHeight - el.offsetHeight)) *
      (other.scrollHeight - other.offsetHeight)
  )

  const next = panes[0] === el ? [el.scrollTop, top] : [top, el.scrollTop]
  if (next[0] === lastPos[0] && next[1] === lastPos[1]) return
  lastPos = next

  other.scrollTo({ top, behavior: 'auto' })
}
