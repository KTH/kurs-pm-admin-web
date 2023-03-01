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

async function _getApplicationCodeFromLadokUID(ladokUID) {
  try {
    log.debug('Going to fetch application for ladokUID: ', ladokUID)
    const { body } = await koppsApi.getAsync(`courses/offerings/roundnumber?ladokuid=${ladokUID}`)
    if (body) {
      const { application_code } = body
      return application_code
    } else {
      return ''
    }
  } catch (error) {
    log.error('Kopps is not available', error)
  }
}

async function getKoppsCourseData(courseCode) {
  try {
    const res = await koppsApi.getAsync(`course/${encodeURIComponent(courseCode)}/courseroundterms`)
    const { body, statusCode, statusMessage } = res
    if (body) {
      const { termsWithCourseRounds = [] } = body
      if (termsWithCourseRounds && termsWithCourseRounds.length > 0) {
        for await (const { rounds = [] } of termsWithCourseRounds) {
          for await (const round of rounds) {
            const { ladokUID } = round
            if (ladokUID && ladokUID !== '') {
              round.applicationCode = await _getApplicationCodeFromLadokUID(ladokUID)
            } else {
              round.applicationCode = ''
            }
          }
        }
      }
    }
    return { body, statusCode, statusMessage }
  } catch (err) {
    log.debug('api call to getKoppsCourseData has failed:', { message: err })
    return err
  }
}

async function getCourseSchool(courseCode) {
  try {
    const { body: course, statusCode } = await koppsApi.getAsync(`course/${encodeURIComponent(courseCode)}`)
    if (!course || statusCode !== 200) return 'kopps_get_fails'

    const { school } = course
    if (!school) return 'missing_school_code'
    const { code } = school
    if (!code) return 'missing_school_code'
    return code
  } catch (err) {
    log.debug('api call to getCourseSchool has failed:', { message: err })

    return err
  }
}
module.exports = {
  getCourseSchool,
  getKoppsCourseData,
}
