'use strict'

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { WebContextProvider } from './context/WebContext'
import { uncompressData } from './context/compress'
import AdminPage from './views/AdminPage'
import '../../css/memo-admin.scss'

function appFactory(applicationStore, context) {
  return (
    <WebContextProvider configIn={context}>
      <Routes>
        <Route exact path="/:id" element={<AdminPage />} />
      </Routes>
    </WebContextProvider>
  )
}
function _renderOnClientSide() {
  const isClientSide = typeof window !== 'undefined'
  if (!isClientSide) {
    return
  }

  const webContext = {}
  uncompressData(webContext)

  const basename = webContext.proxyPrefixPath.uri

  const app = <BrowserRouter basename={basename}>{appFactory({}, webContext)}</BrowserRouter>

  const container = document.getElementById('app')
  hydrateRoot(container, app)
}

_renderOnClientSide()

export default appFactory
