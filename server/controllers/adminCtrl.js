'use strict'

const log = require('@kth/log')
const language = require('@kth/kth-node-web-common/lib/language')
const httpResponse = require('@kth/kth-node-response')
const paths = require('../server').getPaths()

const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const { getServerSideFunctions } = require('../utils/serverSideRendering')
const { createServerSideContext } = require('../ssr-context/createServerSideContext')
const api = require('../api')
const { runBlobStorage, updateMetaData, deleteBlob } = require('../blobStorage')
const memoApi = require('../apiCalls/memoApi')
const koppsCourseData = require('../apiCalls/koppsCourseData')
const i18n = require('../../i18n')
const { parseCourseCode } = require('../utils/courseCodeParser')

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
  const { courseCode } = req.params
  log.info('_getKoppsCourseData with code:' + courseCode)
  try {
    const apiResponse = await koppsCourseData.getKoppsCourseData(courseCode)
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
  let { file } = req.files
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
  const { id: thisId } = req.params

  const memoId = thisId.length <= 7 ? '' : thisId.toUpperCase()
  const courseCode = parseCourseCode(thisId.toUpperCase())

  try {
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()
    const webContext = { lang, proxyPrefixPath: serverConfig.proxyPrefixPath, ...createServerSideContext() }

    /* ------- Settings ------- */
    webContext.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl)
    webContext.setLanguage(lang)
    await webContext.setMemberInfo(loggedInUser, courseCode, username)
    if (!memoId) {
      /** ------- Got course code -> prepare course data from kopps for Page 1  ------- */
      log.debug(' getIndex, get course data for : ', { id: thisId })
      const apiResponse = await koppsCourseData.getKoppsCourseData(courseCode, lang)
      if (apiResponse.statusCode >= 400) {
        webContext.errorMessage = apiResponse.statusMessage // TODO: ERROR?????
      } else {
        await webContext.handleCourseData(apiResponse.body, courseCode, username, lang)
      }
    }
    const compressedData = getCompressedData(webContext)

    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath

    const view = renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })

    res.render('admin/index', {
      compressedData,
      debug: 'debug' in req.query,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      html: view,
      title: i18n.messages[lang === 'en' ? 0 : 1].messages.title,
      lang,
      proxyPrefix,
      description: i18n.messages[lang === 'en' ? 0 : 1].messages.title,
    })
  } catch (err) {
    log.error('Error in getIndex', { error: err })
    next(err)
  }
}

module.exports = {
  getIndex,
  postMemoData: _postMemoData,
  getUsedRounds: _getUsedRounds,
  getKoppsCourseData: _getKoppsCourseData,
  saveFileToStorage: _saveFileToStorage,
  updateFileInStorage: _updateFileInStorage,
  deleteFileInStorage: _deleteFileInStorage,
}
