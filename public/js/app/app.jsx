'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
// Store
import { WebContextProvider } from './context/WebContext'
import { uncompressData } from './context/compress'
import AdminPage from './views/AdminPage'
import '../../css/memo-admin.scss'

export default appFactory

_renderOnClientSide()

function _renderOnClientSide() {
  const isClientSide = typeof window !== 'undefined'
  if (!isClientSide) {
    return
  }

  const webContext = {}
  uncompressData(webContext)

  const basename = webContext.proxyPrefixPath.uri

  const app = <BrowserRouter basename={basename}>{appFactory({}, webContext)}</BrowserRouter>

  const domElement = document.getElementById('app')
  ReactDOM.hydrate(app, domElement)
}

function appFactory(applicationStore, context) {
  return (
    <WebContextProvider configIn={context}>
      <Routes>
        {/* <AdminPage /> */}

        <Route exact path="/:id" element={<AdminPage />} />
        <Route exact path="/" element={<p>hello</p>} />

        {/* <Route path="/kursinfoadmin/pm" component={AdminPage} /> */}
        {/* <Route path="/kursinfoadmin/pm" component={AdminPage} /> */}
      </Routes>
    </WebContextProvider>
  )
}
