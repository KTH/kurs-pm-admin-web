'use strict'

const { createApiClient } = require('om-kursen-ladok-client')
const serverConfig = require('../configuration').server

async function getLadokCourseData(courseCode, lang) {
  const client = createApiClient(serverConfig.ladokMellanlagerApi)
  const course = await client.getLatestCourseVersion(courseCode, lang)
  return course
}

async function getCourseSchoolCode(courseCode) {
  try {
    const ladokCourseData = await getLadokCourseData(courseCode)
    if (!ladokCourseData || ladokCourseData.statusCode !== 200) return 'ladok_get_fails'
    const { schoolCode } = ladokCourseData
    if (!schoolCode) return 'missing_school_code'
    return schoolCode
  } catch (err) {
    return err
  }
}

module.exports = {
  getLadokCourseData,
  getCourseSchoolCode,
}
