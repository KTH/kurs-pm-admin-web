/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

// eslint-disable-next-line no-unused-vars
import axios from 'axios'
import { getAccess } from '../util/helpers'

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
/*                                               MEMO ACTIONS (PM - API)                                                      */
/** ***************************************************************************************************************************************** */

function postMemoData(postObject, fileName, uploadDate) {
  for (let index = 0; index < postObject.length; index++) {
    postObject[index].courseMemoFileName = fileName
    postObject[index].pdfMemoUploadDate = uploadDate
  }
  return axios
    .post(this.buildApiUrl(this.paths.api.memoPost.uri, { id: 'default' }), { params: JSON.stringify(postObject) })
    .then(apiResponse => {
      if (apiResponse.statusCode >= 400) {
        this.errorMessage = apiResponse.statusText
        return 'ERROR-' + apiResponse.statusCode
      }
      return apiResponse.data
    })
    .catch(err => {
      if (err.response) {
        this.errorMessage = err.message
        return err.message
      }
      throw err
    })
}

function getUsedRounds(courseCode, semester) {
  this.courseCode = courseCode
  return axios
    .get(this.buildApiUrl(this.paths.api.memoGetUsedRounds.uri, { courseCode, semester }))
    .then(result => {
      if (result.status >= 400) {
        return 'ERROR-' + result.status
      }
      return (this.usedRounds = result.data)
    })
    .catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
}
/** ***************************************************************************************************************************************** */
/*                                             GET COURSE INFORMATION ACTION (KOPPS - API)                                                    */
/** ***************************************************************************************************************************************** */
function getCourseInformation(courseCode, userName, lang = 'sv') {
  this.courseCode = courseCode
  return axios
    .get(this.buildApiUrl(this.paths.api.koppsCourseData.uri, { courseCode, language: lang }))
    .then(result => {
      if (result.status >= 400) {
        this.errorMessage = result.statusText
        return 'ERROR-' + result.status
      }
      this.handleCourseData(result.data, courseCode, userName, lang)
      return result.body
    })
    .catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
}

/** ***************************************************************************************************************************************** */
/*                                             HANDLE DATA FROM API    (DUPLICATED IN SERVER SIDE AS WELL)                                                              */
/** ***************************************************************************************************************************************** */

function handleCourseData(courseObject, courseCode, userName, language) {
  // Building up courseTitle, courseData, semesters and roundData
  if (courseObject === undefined) {
    this.errorMessage = 'Whoopsi daisy... kan just nu inte hämta data från kopps'
    return undefined
  }
  try {
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

function createMemoData(semester, rounds) {
  // Creates a list with memo object with information from selected rounds
  this.status = 'new'
  let newMemo = {}
  this.newMemoList = []
  this.activeSemester = semester
  let id = ''

  for (let round = 0; round < rounds.length; round++) {
    const id = `${this.courseData.courseCode}_${semester}_${rounds[round]}`
    const newMemo = {
      _id: id,
      courseMemoFileName: '',
      changedBy: this.user,
      courseCode: this.courseData.courseCode,
      pdfMemoUploadDate: '',
      semester: semester,
      koppsRoundId: rounds[round],
    }
    this.newMemoList.push(newMemo)
  }
  return this.newMemoList
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

function createStoreClientFunctions() {
  const functions = {
    buildApiUrl,
    createMemoData,
    deleteFileInStorage,
    getCourseInformation,
    getUsedRounds,
    postMemoData,
    updateFileInStorage,
  }
  return functions
}

export { createStoreClientFunctions }
