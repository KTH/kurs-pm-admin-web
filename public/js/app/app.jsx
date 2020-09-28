'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { Component } from 'react'
import { Provider, inject } from 'mobx-react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { configure } from 'mobx'

import { IMobxStore } from './interfaces/utils'
import { StaticRouter } from 'react-router'
import RouterStore from './stores/RouterStore'
import AdminPage from './views/AdminPage'
import '../../css/memo-admin.scss'

function staticFactory() {
  return <StaticRouter>{appFactory()}</StaticRouter>
}

function appFactory() {
  if (process.env['NODE_ENV'] !== 'production') {
    configure({
      isolateGlobalState: true,
    })
  }

  const routerStore = new RouterStore()

  if (typeof window !== 'undefined') {
    routerStore.initializeStore('routerStore')
  }

  return (
    <Provider routerStore={routerStore}>
      <Switch>
        <Route path="/kursinfoadmin/pm" component={AdminPage} />
      </Switch>
    </Provider>
  )
}

if (typeof window !== 'undefined') {
  ReactDOM.render(<BrowserRouter>{appFactory()}</BrowserRouter>, document.getElementById('kth-kurs-pm-admin'))
}

export { staticFactory }
