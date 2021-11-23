import { Switch, Route } from 'itinero'
import StoryList from './StoryList'
import Story from './Story'

const routes = () => (
  <Switch>
    <Route path="/">{StoryList}</Route>
    <Route path="/:id">{Story}</Route>
  </Switch>
)

export default routes
