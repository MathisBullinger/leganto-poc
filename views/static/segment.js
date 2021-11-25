let colors = []

for (let i = 0; i < 50; i++) {
  let last = colors[colors.length - 1] || Array(3).fill(0x00)
  let color
  do {
    color = Array(3)
      .fill()
      .map((v) => Math.floor(0xff - Math.random() * 0x55))
  } while (color.reduce((a, c, i) => a + Math.abs(c - last[i]), 0) < 0x22)
  colors.push(color)
}
colors = colors.map(
  (cl) => '#' + cl.map((v) => ('00' + v.toString(16)).slice(-2)).join('')
)

colorSegments()

function colorSegments() {
  for (const lang of document.querySelectorAll('.split-view > div')) {
    const segs = [...lang.querySelectorAll('span')]
    for (let i = 0; i < segs.length; i++) {
      segs[i].style.backgroundColor = colors[i % colors.length]
    }
  }
}

for (const lang of document.querySelectorAll('.split-view > div')) {
  lang.addEventListener('click', ({ target }) => {
    if (![...target.classList].includes('char')) return

    const [story, chapter] = location.pathname
      .split('/')
      .filter(Boolean)
      .slice(-2)
    const file = `${story}/${chapter}_${lang.lang}.txt`
    console.log(file)

    fetch('http://localhost:5000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file,
        segment: target.parentNode.textContent,
        index: [...target.parentNode.childNodes].indexOf(target),
      }),
    })
  })
}

document.querySelectorAll('i').forEach((el) => {
  const text = document.createTextNode(el.textContent)
  el.parentElement.insertBefore(text, el)
  el.parentElement.removeChild(el)
})

document.querySelectorAll('.split-view *').forEach((el) => {
  if ([...el.childNodes].some((v) => v.nodeType !== Node.TEXT_NODE)) return

  const text = (el.innerHTML = el.textContent)
  el.removeChild(el.childNodes[0])

  for (const c of text) {
    const node = document.createElement('span')
    node.className = 'char'
    node.innerText = c
    el.appendChild(node)
  }
})
