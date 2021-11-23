import { RouteProps } from 'itinero'
import { FunctionalComponent } from 'preact'
import { useState } from 'preact/hooks'
import data from '../data/stories.json'

const Story: FunctionalComponent<RouteProps<{}, { id: keyof typeof data }>> = (
  props
) => {
  const [story] = useState(() => data[props.match.id])

  return (
    <div>
      <h1>{story.title[0]}</h1>
      {story.sections.map(([v], i) => (
        <p key={i}>{v}</p>
      ))}
    </div>
  )
}

export default Story
