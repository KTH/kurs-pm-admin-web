'use strict'
import { observable, action } from 'mobx'
import axios from 'axios'
import { SUPERUSER_PART } from '../util/constants'
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

function _webUsesSSL(url) {
  return url.startsWith('https:')
}

class RouterStore {
  roundData = {}
  courseData = {}
  semesters = []
  newMemoList = []
  language = 1
  status = ''
  usedRounds = []
  hasChangedStatus = false
  courseTitle = ''
  courseCode = ''
  errorMessage = ''
  service = ''
  member = []
  roundAccess = {}
  user = ''
  activeSemester = ''

  buildApiUrl(path, params) {
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
  @action updateFileInStorage(fileName, metadata) {
    return axios
      .post(this.buildApiUrl(this.paths.storage.updateFile.uri, { fileName }), { params: metadata })
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

  @action deleteFileInStorage(fileName) {
    return axios.post(this.buildApiUrl(this.paths.storage.deleteFile.uri, { fileName: fileName })).then(apiResponse => {
      if (apiResponse.statusCode >= 400) {
        return 'ERROR-' + apiResponse.statusCode
      }
      return apiResponse.data
    })
  }

  /** ***************************************************************************************************************************************** */
  /*                                               MEMO ACTIONS (PM - API)                                                      */
  /** ***************************************************************************************************************************************** */

  @action postMemoData(postObject, fileName, uploadDate) {
    for (let index = 0; index < postObject.length; index++) {
      postObject[index].courseMemoFileName = fileName
      postObject[index].pdfMemoUploadDate = uploadDate
    }
    return axios
      .post(this.buildApiUrl(this.paths.api.memoPost.uri, { id: 'default' }), { params: JSON.stringify(postObject) })
      .then(apiResponse => {
        if (apiResponse.statusCode >= 400) {
          this.errorMessage = result.statusText
          return 'ERROR-' + apiResponse.statusCode
        }
        return apiResponse.data
      })
      .catch(err => {
        if (err.response) {
          this.errorMessage = err.message
          return err.message
          //throw new Error(err.message)
        }
        throw err
      })
  }

  @action putMemoData(postObject, status) {
    return axios
      .post(this.buildApiUrl(this.paths.api.memoPost.uri, { id: postObject._id, status: status /*, lang: lang*/ }), {
        params: JSON.stringify(postObject),
      })
      .then(apiResponse => {
        if (apiResponse.statusCode >= 400) {
          this.errorMessage = result.statusText
          return 'ERROR-' + apiResponse.statusCode
        }
        this.errorMessage = apiResponse.data.message
        if (this.errorMessage !== undefined) {
          if (this.status === 'draft' && apiResponse.data.isPublished) this.hasChangedStatus = true
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

  @action getUsedRounds(courseCode, semester) {
    this.courseCode = courseCode
    return axios
      .get(this.buildApiUrl(this.paths.api.memoGetUsedRounds.uri, { courseCode: courseCode, semester: semester }))
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
  @action getCourseInformation(courseCode, ldapUsername, lang = 'sv') {
    this.courseCode = courseCode
    return axios
      .get(this.buildApiUrl(this.paths.api.koppsCourseData.uri, { courseCode: courseCode, language: lang }))
      .then(result => {
        //log.info('getCourseInformation: ' + result)
        if (result.status >= 400) {
          this.errorMessage = result.statusText
          return 'ERROR-' + result.status
        }
        this.handleCourseData(result.data, courseCode, ldapUsername, lang)
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
  /*                                                     HANDLE DATA FROM API                                                                  */
  /** ***************************************************************************************************************************************** */

  @action handleCourseData(courseObject, courseCode, ldapUsername, language) {
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
      courseObject.termsWithCourseRounds.map((semester, index) => {
        if (thisStore.semesters.indexOf(semester.term) < 0) thisStore.semesters.push(semester.term)

        if (!thisStore.roundData.hasOwnProperty(semester.term)) {
          thisStore.roundData[semester.term] = []
          thisStore.roundAccess[semester.term] = {}
        }

        thisStore.roundData[semester.term] = semester.rounds.map((round, index) => {
          return (round.ladokRoundId = {
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

  @action createMemoData(semester, rounds) {
    // Creates a list with memo object with information from selected rounds
    //const roundLang = language === 'English' || language === 'Engelska' ? 'en' : 'sv'
    this.status = 'new'
    let newMemo = {}
    this.newMemoList = []
    this.activeSemester = semester
    let id = ''

    for (let round = 0; round < rounds.length; round++) {
      ;(id = `${this.courseData.courseCode}_${semester}_${rounds[round]}`),
        //if()
        (newMemo = {
          _id: `${this.courseData.courseCode}_${semester}_${rounds[round]}`,
          courseMemoFileName: '',
          changedBy: this.user,
          courseCode: this.courseData.courseCode,
          pdfMemoUploadDate: '',
          semester: semester,
          koppsRoundId: rounds[round],
        })
      this.newMemoList.push(newMemo)
    }
    return this.newMemoList
  }

  getMemberOf(memberOf, id, ldapUsername, superUser) {
    if (id.length > 7) {
      let splitId = id.split('_')
      this.courseCode = splitId[0].length > 12 ? id.slice(0, 7).toUpperCase() : id.slice(0, 6).toUpperCase()
    } else {
      this.courseCode = id.toUpperCase()
    }
    this.member = memberOf.filter(member => member.indexOf(this.courseCode) > -1 || member.indexOf(superUser) > -1)
    this.user = ldapUsername
  }

  setLanguage(lang = 'sv') {
    this.language = lang === 'en' ? 0 : 1
  }

  @action getBreadcrumbs() {
    return {
      url: '/kursinfoadmin/memo/',
      label: 'TODO',
    }
  }

  @action setBrowserConfig(config, paths, apiHost, profileBaseUrl) {
    this.browserConfig = config
    this.paths = paths
    this.apiHost = apiHost
    this.profileBaseUrl = profileBaseUrl
  }

  @action doSetLanguage(lang) {
    this.language = lang
  }

  @action getBrowserInfo() {
    var navAttrs = [
      'appCodeName',
      'appName',
      'appMinorVersion',
      'cpuClass',
      'platform',
      'opsProfile',
      'userProfile',
      'systemLanguage',
      'userLanguage',
      'appVersion',
      'userAgent',
      'onLine',
      'cookieEnabled',
    ]
    var docAttrs = ['referrer', 'title', 'URL']
    var value = { document: {}, navigator: {} }

    for (let i = 0; i < navAttrs.length; i++) {
      if (navigator[navAttrs[i]] || navigator[navAttrs[i]] === false) {
        value.navigator[navAttrs[i]] = navigator[navAttrs[i]]
      }
    }

    for (let i = 0; i < docAttrs.length; i++) {
      if (document[docAttrs[i]]) {
        value.document[docAttrs[i]] = document[docAttrs[i]]
      }
    }
    return value
  }

  initializeStore(storeName) {
    const store = this

    if (typeof window !== 'undefined' && window.__initialState__ && window.__initialState__[storeName]) {
      const tmp = JSON.parse(decodeURIComponent(window.__initialState__[storeName]))
      for (let key in tmp) {
        store[key] = tmp[key]
        delete tmp[key]
      }

      // Just a nice helper message
      if (Object.keys(window.__initialState__).length === 0) {
        window.__initialState__ = 'Mobx store state initialized'
      }
    }
  }
}

export default RouterStore
