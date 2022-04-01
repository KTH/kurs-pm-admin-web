/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

// eslint-disable-next-line no-unused-vars

const axios = require('axios')

const SUPERUSER_PART = 'kursinfo-admins'

const getAccess = (memberOf, round, courseCode, semester) => {
  if (
    memberOf.toString().indexOf(courseCode.toUpperCase() + '.examiner') > -1 ||
    memberOf.toString().indexOf(SUPERUSER_PART) > -1
  ) {
    return true
  }

  if (
    memberOf.toString().indexOf(`${courseCode.toUpperCase()}.${semester}.${round.ladokRoundId}.courseresponsible`) > -1
  ) {
    return true
  }

  if (memberOf.toString().indexOf(`${courseCode.toUpperCase()}.${semester}.${round.ladokRoundId}.teachers`) > -1) {
    return true
  }

  return false
}
const paramRegex = /\/(:[^\/\s]*)/g

function _paramReplace(path, params) {
  let tmpPath = path
  const tmpArray = tmpPath.match(paramRegex)
  tmpArray &&
    tmpArray.forEach(element => {
      tmpPath = tmpPath.replace(element, '/' + params[element.slice(2)])
    })
  return tmpPath
}

function buildApiUrl(path, params) {
  let host
  if (typeof window !== 'undefined') {
    host = this.apiHost
  } else {
    host = 'http://localhost:' + this.browserConfig.port
  }
  if (host[host.length - 1] === '/') {
    host = host.slice(0, host.length - 1)
  }
  const newPath = params ? _paramReplace(path, params) : path
  return [host, newPath].join('')
}

/** ***************************************************************************************************************************************** */
/*                                                       FILE STORAGE ACTIONS                                                      */
/** ***************************************************************************************************************************************** */
function updateFileInStorage(fileName, metadata) {
  return axios
    .post(this.buildApiUrl(this.paths.storage.updateFile.uri, { fileName }), { params: { metadata } })
    .then(apiResponse => {
      if (apiResponse.statusCode >= 400) {
        return 'ERROR-' + apiResponse.statusCode
      }
      return apiResponse.data
    })
    .catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
}

function deleteFileInStorage(fileName) {
  return axios.post(this.buildApiUrl(this.paths.storage.deleteFile.uri, { fileName })).then(apiResponse => {
    if (apiResponse.statusCode >= 400) {
      return 'ERROR-' + apiResponse.statusCode
    }
    return apiResponse.data
  })
}

/** ***************************************************************************************************************************************** */
/*                                                     HANDLE DATA FROM API                                                                  */
/** ***************************************************************************************************************************************** */

function handleCourseData(courseObject, courseCode, userName, language) {
  // Building up courseTitle, courseData, semesters and roundData
  if (courseObject === undefined) {
    this.errorMessage = 'Whoopsi daisy... kan just nu inte hämta data från kopps'
    return undefined
  }
  try {
    // console.log('courseObject', courseObject)
    this.courseData = {
      courseCode,
      gradeScale: courseObject.formattedGradeScales,
      semesterObjectList: {},
    }
    this.courseTitle = {
      name: courseObject.course.title[this.language === 0 ? 'en' : 'sv'],
      credits:
        courseObject.course.credits.toString().indexOf('.') < 0
          ? courseObject.course.credits + '.0'
          : courseObject.course.credits,
    }

    for (let semester = 0; semester < courseObject.termsWithCourseRounds.length; semester++) {
      this.courseData.semesterObjectList[courseObject.termsWithCourseRounds[semester].term] = {
        rounds: courseObject.termsWithCourseRounds[semester].rounds,
      }
    }

    const thisStore = this
    courseObject.termsWithCourseRounds.map(semester => {
      if (thisStore.semesters.indexOf(semester.term) < 0) thisStore.semesters.push(semester.term)

      if (!thisStore.roundData.hasOwnProperty(semester.term)) {
        thisStore.roundData[semester.term] = []
        thisStore.roundAccess[semester.term] = {}
      }

      thisStore.roundData[semester.term] = semester.rounds.map(round => {
        return (round.ladokRoundId = {
          courseCode: this.courseCode,
          roundId: round.ladokRoundId,
          language: round.language[language],
          shortName: round.shortName,
          startDate: round.firstTuitionDate,
          ladokUID: round.ladokUID,
          hasAccess: getAccess(this.member, round, this.courseCode, semester.term),
        })
      })
    })
  } catch (err) {
    if (err.response) {
      throw new Error(err.message)
    }
    throw err
  }
}

function getMemberOf(memberOf = [], id, userName, superUser) {
  if (id.length > 7) {
    let splitId = id.split('_')
    this.courseCode = splitId[0].length > 12 ? id.slice(0, 7).toUpperCase() : id.slice(0, 6).toUpperCase()
  } else {
    this.courseCode = id.toUpperCase()
  }
  this.member = memberOf.filter(member => member.indexOf(this.courseCode) > -1 || member.indexOf(superUser) > -1)
  this.user = userName
}

function setLanguage(lang = 'sv') {
  this.language = lang === 'en' ? 0 : 1
}

function setBrowserConfig(config, paths, apiHost, profileBaseUrl) {
  this.browserConfig = config
  this.paths = paths
  this.apiHost = apiHost
  this.profileBaseUrl = profileBaseUrl
}

function createServerSideContext() {
  const context = {
    roundData: {},
    courseData: {},
    semesters: [],
    newMemoList: [],
    language: 1,
    status: '',
    usedRounds: [],
    hasChangedStatus: false,
    courseTitle: '',
    courseCode: '',
    errorMessage: '',
    service: '',
    member: [],
    roundAccess: {},
    user: '',
    activeSemester: '',
    buildApiUrl,
    getMemberOf,
    handleCourseData,
    setBrowserConfig,
    setLanguage,
  }
  return context
}

module.exports = { createServerSideContext }
