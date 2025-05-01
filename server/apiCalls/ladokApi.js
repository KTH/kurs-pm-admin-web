'use strict'

const { createApiClient } = require('@kth/om-kursen-ladok-client')
const serverConfig = require('../configuration').server

const client = createApiClient(serverConfig.ladokMellanlagerApi)

async function getLadokCourseData(courseCode, lang) {
  const course = await client.getLatestCourseVersion(courseCode, lang)
  return course
}

async function getCourseRoundsData(courseCode, lang) {
  const previousYear = new Date().getFullYear() - 1
  const rounds = await client.getCourseRoundsFromPeriod(courseCode, `VT${previousYear}`, lang)
  return rounds
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
  getCourseRoundsData,
  getCourseSchoolCode,
}
