'use strict'

const co = require('co')
const log = require('kth-node-log')
const redis = require('kth-node-redis')
const language = require('kth-node-web-common/lib/language')
const { toJS } = require('mobx')
const httpResponse = require('kth-node-response')
const paths = require('../server').getPaths()
const ReactDOMServer = require('react-dom/server')

const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server

const api = require('../api')
const { runBlobStorage, updateMetaData, deleteBlob } = require('../blobStorage')
const kursPmApi = require('../apiCalls/kursPmApi')
const koppsCourseData = require('../apiCalls/koppsCourseData')
const i18n = require('../../i18n')

let { staticFactory } = require('../../dist/app.js')

module.exports = {
  getIndex: getIndex,
  getRoundAnalysis: co.wrap(_getRoundAnalysis),
  postRoundAnalysis: co.wrap(_postRoundAnalysis),
  deleteRoundAnalysis: co.wrap(_deleteRoundAnalysis),
  getUsedRounds: co.wrap(_getUsedRounds),
  getKoppsCourseData: co.wrap(_getKoppsCourseData),
  saveFileToStorage: co.wrap(_saveFileToStorage),
  updateFileInStorage: co.wrap(_updateFileInStorage),
  deleteFileInStorage: co.wrap(_deleteFileInStorage)
}

// ------- ANALYSES FROM KURSUTVECKLING-API: POST, GET, DELETE, GET USED ROUNDS ------- /

function * _postRoundAnalysis (req, res, next) {
  const roundAnalysisId = req.params.id
  const isNewAnalysis = req.params.status
  const language = req.params.language || 'sv'
  const sendObject = JSON.parse(req.body.params)
  log.debug('_postRoundAnalysis id:' + req.params.id)
  try {
    let apiResponse = {}
    if (isNewAnalysis === 'true') {
      apiResponse = yield kursutvecklingAPI.setRoundAnalysisData(roundAnalysisId, sendObject, language)
    } else {
      apiResponse = yield kursutvecklingAPI.updateRoundAnalysisData(roundAnalysisId, sendObject, language)
    }

    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception from setRoundAnalysis ', { error: err })
    next(err)
  }
}

function * _getRoundAnalysis (req, res, next) {
  const roundAnalysisId = req.params.id || ''
  const language = req.params.language || 'sv'
  log.info('_getRoundAnalysis id:' + req.params.id)
  try {
    const apiResponse = yield kursutvecklingAPI.getRoundAnalysisData(roundAnalysisId, language)
    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception from getRoundAnalysis ', { error: err })
    next(err)
  }
}

function * _deleteRoundAnalysis (req, res, next) {
  const roundAnalysisId = req.params.id
  log.info('_deleteRoundAnalysis with id:' + req.params.id)
  try {
    const apiResponse = yield kursutvecklingAPI.deleteRoundAnalysisData(roundAnalysisId)
    return httpResponse.json(res, apiResponse)
  } catch (err) {
    log.error('Exception from _deleteRoundAnalysis ', { error: err })
    next(err)
  }
}

function * _getUsedRounds (req, res, next) {
  const courseCode = req.params.courseCode
  const semester = req.params.semester
  log.debug('_getUsedRounds with course code: ' + courseCode + 'and semester: ' + semester)
  try {
    const apiResponse = yield kursPmApi.getUsedRounds(courseCode, semester)
    log.debug('_getUsedRounds response: ', apiResponse.body)
    return httpResponse.json(res, apiResponse.body)
  } catch (error) {
    log.error('Exception from _getUsedRounds ', { error: error })
    next(error)
  }
}

// ------- COURSE DATA FROM KOPPS-API   ------- /
function * _getKoppsCourseData (req, res, next) {
  const courseCode = req.params.courseCode
  const language = req.params.language || 'sv'
  log.info('_getKoppsCourseData with code:' + courseCode)
  try {
    const apiResponse = yield koppsCourseData.getKoppsCourseData(courseCode, language)
    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception from koppsAPI ', { error: err })
    next(err)
  }
}

// ------- FILES IN BLOB STORAGE: SAVE, UPDATE, DELETE ------- /
function * _saveFileToStorage (req, res, next) {
  log.info('Saving uploaded file to storage ' + req.files.file)
  let file = req.files.file
  try {
    const fileName = yield runBlobStorage(file, req.params.semester, req.params.courseCode, req.params.rounds, req.body)
    return httpResponse.json(res, fileName)
  } catch (error) {
    log.error('Exception from saveFileToStorage ', { error: error })
    next(error)
  }
}

function * _updateFileInStorage (req, res, next) {
  log.info('_updateFileInStorage file name:' + req.params.fileName + ', metadata:' + req.body.params.metadata)
  try {
    const response = yield updateMetaData(req.params.fileName, req.body.params.metadata)
    return httpResponse.json(res, response)
  } catch (error) {
    log.error('Exception from updateFileInStorage ', { error: error })
    next(error)
  }
}

function * _deleteFileInStorage (res, req, next) {
  log.debug('_deleteFileInStorage, id:' + req.req.params.id)
  try {
    const response = yield deleteBlob(req.req.params.id)
    log.debug('_deleteFileInStorage, id:', response)
    return httpResponse.json(res.res)
  } catch (error) {
    log.error('Exception from _deleteFileInStorage ', { error: error })
    next(error)
  }
}

async function getIndex (req, res, next) {
  console.log(api.kursPmApi)

  /** ------- CHECK OF CONNECTION TO API AND UG_REDIS ------- */
  if (api.kursPmApi.connected === false) {
    log.error('No connection to kurs-pm-api', api.kursPmApi)
    const error = new Error('API - ERR_CONNECTION_REFUSED')
    error.status = 500
    return next(error)
  }

  if (process.env['NODE_ENV'] === 'development') {
    delete require.cache[require.resolve('../../dist/app.js')]
    const tmp = require('../../dist/app.js')
    staticFactory = tmp.staticFactory
  }

  let lang = language.getLanguage(res) || 'sv'
  const ldapUser = req.session.authUser ? req.session.authUser.username : 'null'
  let status = req.query.status

  try {
    const renderProps = staticFactory()
    /* ------- Settings ------- */
    renderProps.props.children.props.routerStore.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl)
    renderProps.props.children.props.routerStore.setLanguage(lang)
    await renderProps.props.children.props.routerStore.getMemberOf(req.session.authUser.memberOf, req.params.id.toUpperCase(), req.session.authUser.username, serverConfig.auth.superuserGroup)
    if (req.params.id.length <= 7) {
      /** ------- Got course code -> prepare course data from kopps for Page 1  ------- */
      log.debug(' getIndex, get course data for : ' + req.params.id)
      const apiResponse = await koppsCourseData.getKoppsCourseData(req.params.id.toUpperCase(), lang)
      if (apiResponse.statusCode >= 400) {
        renderProps.props.children.props.routerStore.errorMessage = apiResponse.statusMessage // TODO: ERROR?????
      } else {
        await renderProps.props.children.props.routerStore.handleCourseData(apiResponse.body, req.params.id.toUpperCase(), ldapUser, lang)
      }
    }
    renderProps.props.children.props.routerStore.__SSR__setCookieHeader(req.headers.cookie)

    const html = ReactDOMServer.renderToString(renderProps)

    res.render('admin/index', {
      debug: 'debug' in req.query,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      html: html,
      title: i18n.messages[lang === 'en' ? 0 : 1].messages.title,
      initialState: JSON.stringify(hydrateStores(renderProps)),
      lang: lang,
      description: i18n.messages[lang === 'en' ? 0 : 1].messages.title
    })
  } catch (err) {
    log.error('Error in getIndex', { error: err })
    next(err)
  }
}

function hydrateStores (renderProps) {
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
