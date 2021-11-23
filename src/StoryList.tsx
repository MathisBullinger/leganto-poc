import data from '../data/stories.json'
import { Link } from 'itinero'

export default function StoryList() {
  return (
    <ul>
      {Object.entries(data).map(
        ([
          id,
          {
            title: [name],
          },
        ]) => (
          <li key={id}>
            <Link to={`/${id}`}>{name}</Link>
          </li>
        )
      )}
    </ul>
  )
}
