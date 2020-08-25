'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { StaticRouter } from 'react-router'
import RouterStore from './stores/RouterStore'
import AdminPage from './views/AdminPage'
import '../../css/memo-admin.scss'

function appFactory() {
  const routerStore = new RouterStore()

  if (typeof window !== 'undefined') {
    routerStore.initializeStore('routerStore')
  }

  return (
    <Provider routerStore={routerStore}>
      <Switch>
        <Route exact path="/kursinfoadmin/pm/:courseCode" component={AdminPage} />
      </Switch>
    </Provider>
  )
}

function staticRender(context, location) {
  return (
    <StaticRouter location={location} context={context}>
      {appFactory()}
    </StaticRouter>
  )
}

if (typeof window !== 'undefined') {
  ReactDOM.render(
    <BrowserRouter>{appFactory()}</BrowserRouter>,
    document.getElementById('kth-kurs-pm-admin')
  )
}

export { staticRender }
