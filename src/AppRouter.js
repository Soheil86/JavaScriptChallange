import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import config from './config'
import Search from './Pages/Search'
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={config.routes.root} component={Search} />
      </Switch>
    </BrowserRouter>
  )
}
