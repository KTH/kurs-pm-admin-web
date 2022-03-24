'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// Store
import { MobxStoreProvider, uncompressStoreInPlaceFromDocument } from './mobx'
import createApplicationStore from './stores/createApplicationStore'
import AdminPage from './views/AdminPage'
import '../../css/memo-admin.scss'

export default appFactory

function _renderOnClientSide() {
  const isClientSide = typeof window !== 'undefined'
  console.log('1111')

  if (!isClientSide) {
    return
  }
  console.log('2222')

  const basename = window.config.proxyPrefixPath.uri
  const applicationStore = createApplicationStore()
  uncompressStoreInPlaceFromDocument(applicationStore)
  console.log('3333')

  // Removed basename because it is causing empty string basename={basename}
  const app = <BrowserRouter>{appFactory(applicationStore)}</BrowserRouter>
  const domElement = document.getElementById('app')
  console.log('domElement', domElement)
  ReactDOM.render(app, domElement)
  // ReactDOM.render(<BrowserRouter>{appFactory(applicationStore)}</BrowserRouter>, domElement)
}

_renderOnClientSide()

function appFactory(applicationStore) {
  return (
    <MobxStoreProvider initCallback={() => applicationStore}>
      <Routes>
        {/* <AdminPage /> */}

        {/* <Route exact path="/kursinfoadmin/pm/:id" component={Hello} /> */}
        <Route path="/kursinfoadmin/pm" component={AdminPage} />
        {/* <Route path="/kursinfoadmin/pm" component={AdminPage} /> */}
      </Routes>
    </MobxStoreProvider>
  )
}
