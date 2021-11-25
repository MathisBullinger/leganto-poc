const colors = [...Array(50)].map(
  (_, i) =>
    '#' +
    [...Array(3)]
      .map((__, e) =>
        (
          '00' +
          Math.floor(
            0xff - ((e * 0x22 + i * ((e + 1) / 4) * 123) % 0x44)
          ).toString(16)
        ).slice(-2)
      )
      .join('')
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
    }).then(() => setTimeout(() => location.reload(), 3500))
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
