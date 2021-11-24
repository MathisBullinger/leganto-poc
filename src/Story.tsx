import { RouteProps } from 'itinero'
import { FunctionalComponent as FC } from 'preact'
import { useState } from 'preact/hooks'
import styled from 'styled-components'
import data from '../data/stories.json'

const Split: FC<{ title?: string; parts: string[]; lang: string }> = ({
  title,
  parts,
  lang,
}) => (
  <S.Split>
    <S.Text>
      {title && <h1>{title}</h1>}
      {parts.map((v, i) => (
        <p id={lang + i}>{v}</p>
      ))}
    </S.Text>
  </S.Split>
)

const Story: FC<RouteProps<{}, { id: keyof typeof data }>> = (props) => {
  const [{ title, sections }] = useState(() => data[props.match.id])

  return (
    <S.SplitView ref={onRef}>
      <Split lang="es" title={title[0]} parts={sections.map((v) => v[0])} />
      <Split lang="en" title={title[1]} parts={sections.map((v) => v[1])} />
    </S.SplitView>
  )
}

function onRef(el: HTMLElement | null) {
  if (!el) return

  const panes = [
    ...el.getElementsByClassName(S.Text.styledComponentId),
  ] as HTMLElement[]
  console.log(panes)

  let cur = [0, 0]

  const onScroll = ({ currentTarget, isTrusted }: Event) => {
    const el = currentTarget as HTMLElement

    const other = panes[+(panes[0] === el)]

    const top = Math.round(
      (el.scrollTop / (el.scrollHeight - el.offsetHeight)) *
        (other.scrollHeight - other.offsetHeight)
    )

    const next = panes[0] === el ? [el.scrollTop, top] : [top, el.scrollTop]
    if (next[0] === cur[0] && next[1] === cur[1]) return
    cur = next

    other.scrollTo({ top, behavior: 'auto' })
  }

  panes.forEach((el) => el.addEventListener('scroll', onScroll))

  return () => panes.forEach((el) => el.removeEventListener('scroll', onScroll))
}

export default Story

const S = {
  SplitView: styled.div`
    width: 100%;
    --gap: 1px;
    height: calc(100vh - var(--gap));
    grid-gap: var(--gap);
    display: grid;
    grid-template-rows: [es] 50% [en] 50%;
    background-color: #000;
  `,

  Split: styled.div`
    overflow: hidden;
    background-color: #fff;
    position: relative;

    &:first-of-type::after,
    &:last-of-type::before {
      content: '';
      display: block;
      width: 100%;
      height: 0.5rem;
      position: absolute;
      left: 0;
    }

    &::before {
      top: 0;
      --dir: to bottom;
      background: linear-gradient(to bottom, #ffff, #fff0);
    }

    &::after {
      bottom: 0;
      background: linear-gradient(to top, #ffff, #fff0);
    }
  `,

  Text: styled.div`
    height: 100%;
    padding: 1rem;
    overflow-y: auto;
  `,
}
