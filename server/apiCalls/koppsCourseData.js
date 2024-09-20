'use strict'

const { BasicAPI } = require('@kth/api-call')
const log = require('@kth/log')

const config = require('../configuration').server

const koppsApi = new BasicAPI({
  hostname: config.koppsApi.host,
  basePath: config.koppsApi.basePath,
  https: config.koppsApi.https,
  json: true,
  // Kopps is a public API and needs no API-key
  defaultTimeout: 10000, // config.koppsApi.defaultTimeout
})

async function getKoppsCourseData(courseCode) {
  try {
    return await koppsApi.getAsync(`course/${encodeURIComponent(courseCode)}/courseroundterms`)
  } catch (err) {
    log.debug('api call to getKoppsCourseData has failed:', { message: err })
    return err
  }
}
module.exports = {
  getKoppsCourseData,
}
