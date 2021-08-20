'use strict'

const log = require('kth-node-log')
const language = require('kth-node-web-common/lib/language')
const { toJS } = require('mobx')
const httpResponse = require('@kth/kth-node-response')
const paths = require('../server').getPaths()
const ReactDOMServer = require('react-dom/server')

const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server

const api = require('../api')
const { runBlobStorage, updateMetaData, deleteBlob } = require('../blobStorage')
const memoApi = require('../apiCalls/memoApi')
const koppsCourseData = require('../apiCalls/koppsCourseData')
const i18n = require('../../i18n')

function _staticRender(context, location) {
  if (process.env.NODE_ENV === 'development') {
    delete require.cache[require.resolve('../../dist/app.js')]
  }

  const { staticFactory } = require('../../dist/app.js')

  return staticFactory(context, location)
}
module.exports = {
  getIndex: getIndex,
  postMemoData: _postMemoData,
  getUsedRounds: _getUsedRounds,
  getKoppsCourseData: _getKoppsCourseData,
  saveFileToStorage: _saveFileToStorage,
  updateFileInStorage: _updateFileInStorage,
  deleteFileInStorage: _deleteFileInStorage,
}

// ------- MEMO FROM PM-API: POST, GET USED ROUNDS ------- /

async function _postMemoData(req, res, next) {
  const sendObject = JSON.parse(req.body.params)
  log.debug('_postMemoData :' + req.body.params)
  try {
    let apiResponse = {}
    apiResponse = await memoApi.setMemoData('default', sendObject)
    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception from _postMemoData ', { error: err })
    next(err)
  }
}

async function _getUsedRounds(req, res, next) {
  const { courseCode, semester } = req.params
  log.debug('_getUsedRounds with course code: ' + courseCode + 'and semester: ' + semester)
  try {
    const apiResponse = await memoApi.getUsedRounds(courseCode, semester)
    log.debug('_getUsedRounds response: ', apiResponse.body)
    return httpResponse.json(res, apiResponse.body)
  } catch (error) {
    log.error('Exception from _getUsedRounds ', { error })
    next(error)
  }
}

// ------- COURSE DATA FROM KOPPS-API   ------- /
async function _getKoppsCourseData(req, res, next) {
  const { courseCode, language = 'sv' } = req.params
  log.info('_getKoppsCourseData with code:' + courseCode)
  try {
    const apiResponse = await koppsCourseData.getKoppsCourseData(courseCode, language)
    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception from koppsAPI ', { error: err })
    next(err)
  }
}

// ------- FILES IN BLOB STORAGE: SAVE, UPDATE, DELETE ------- /
async function _saveFileToStorage(req, res, next) {
  log.info(' Saving uploaded file for course ' + req.params.courseCode)
  log.info(' Saving uploaded file to storage ' + req.files.file)
  let file = req.files.file
  try {
    const fileName = await runBlobStorage(file, req.params.semester, req.params.courseCode, req.params.rounds, req.body)
    log.info(' fileName ' + fileName)

    return httpResponse.json(res, fileName)
  } catch (error) {
    log.error('Exception from saveFileToStorage ', { error })
    next(error)
  }
}

async function _updateFileInStorage(req, res, next) {
  log.info('_updateFileInStorage file name:' + req.params.fileName + ', metadata:' + req.body.params.metadata)
  try {
    const response = await updateMetaData(req.params.fileName, req.body.params.metadata)
    return httpResponse.json(res, response)
  } catch (error) {
    log.error('Exception from updateFileInStorage ', { error })
    next(error)
  }
}

async function _deleteFileInStorage(res, req, next) {
  log.debug('_deleteFileInStorage, fileName:' + req.req.params.fileName)
  try {
    const response = await deleteBlob(req.req.params.fileName)
    log.debug('_deleteFileInStorage, fileName:', response)
    return httpResponse.json(res.res)
  } catch (error) {
    log.error('Exception from _deleteFileInStorage ', { error })
    next(error)
  }
}

async function getIndex(req, res, next) {
  // console.log(api.memoApi)

  /** ------- CHECK OF CONNECTION TO API ------- */
  if (api.memoApi.connected === false) {
    log.error('No connection to kurs-pm-api', api.memoApi)
    const error = new Error('API - ERR_CONNECTION_REFUSED')
    error.status = 500
    return next(error)
  }

  const lang = language.getLanguage(res) || 'sv'
  const { user: loggedInUser } = req.session.passport
  const username = loggedInUser ? loggedInUser.username : 'null'
  const { memberOf } = loggedInUser

  try {
    const renderProps = _staticRender({}, req.url)
    /* ------- Settings ------- */
    renderProps.props.children.props.routerStore.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl)
    renderProps.props.children.props.routerStore.setLanguage(lang)
    await renderProps.props.children.props.routerStore.getMemberOf(
      memberOf,
      req.params.id.toUpperCase(),
      username,
      serverConfig.auth.superuserGroup
    )
    if (req.params.id.length <= 7) {
      /** ------- Got course code -> prepare course data from kopps for Page 1  ------- */
      log.debug(' getIndex, get course data for : ' + req.params.id)
      const apiResponse = await koppsCourseData.getKoppsCourseData(req.params.id.toUpperCase(), lang)
      if (apiResponse.statusCode >= 400) {
        renderProps.props.children.props.routerStore.errorMessage = apiResponse.statusMessage // TODO: ERROR?????
      } else {
        await renderProps.props.children.props.routerStore.handleCourseData(
          apiResponse.body,
          req.params.id.toUpperCase(),
          username,
          lang
        )
      }
    }

    const html = ReactDOMServer.renderToString(renderProps)

    res.render('admin/index', {
      debug: 'debug' in req.query,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      html,
      title: i18n.messages[lang === 'en' ? 0 : 1].messages.title,
      initialState: JSON.stringify(hydrateStores(renderProps)),
      lang,
      description: i18n.messages[lang === 'en' ? 0 : 1].messages.title,
    })
  } catch (err) {
    log.error('Error in getIndex', { error: err })
    next(err)
  }
}

function hydrateStores(renderProps) {
  // This assumes that all stores are specified in a root element called Provider
  const props = renderProps.props.children.props
  const outp = {}
  for (let key in props) {
    if (typeof props[key].initializeStore === 'function') {
      outp[key] = encodeURIComponent(JSON.stringify(toJS(props[key], true)))
    }
  }
  return outp
}
