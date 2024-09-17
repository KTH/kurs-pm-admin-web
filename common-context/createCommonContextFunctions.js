const { roundIsNotOutdated } = require('../server/utils-shared/helpers')

const paramRegex = /\/(:[^/\s]*)/g

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

const resolveUserAccessRights = (member, round, courseCode, semester) => {
  const { memberOfCourseRelatedGroups, otherRoles } = member
  const { isExaminator, isKursinfoAdmin, isSchoolAdmin, isSuperUser } = otherRoles

  const memberOfStr = memberOfCourseRelatedGroups.toString()
  if (isExaminator || isKursinfoAdmin || isSchoolAdmin || isSuperUser) {
    return true
  }
  // TODO: We are using ladokRoundId for now because UG Rest Api is not updated with application codes. Once the api is updated then we can use application code here
  const roundCourseResponsiblesGroup = `${courseCode.toUpperCase()}.${semester}.${round.ladokRoundId}.courseresponsible`

  if (memberOfStr.includes(roundCourseResponsiblesGroup)) {
    return true
  }

  const roundCourseTeachersGroup = `${courseCode.toUpperCase()}.${semester}.${round.ladokRoundId}.teachers`

  if (memberOfStr.includes(roundCourseTeachersGroup)) {
    return true
  }

  return false
}

// --- Building up courseTitle, courseData, semesters and roundData and check access for rounds ---//
function handleCourseData(ladokCourseObject, koppsCourseObject, courseCode, userName, language) {
  if (!koppsCourseObject) {
    this.errorMessage = 'Whoopsi daisy... kan just nu inte hämta data från kopps'
    return
  }
  try {
    const { termsWithCourseRounds } = koppsCourseObject
    const { benamning, omfattning } = ladokCourseObject

    this.courseData = {
      courseCode,
      semesterObjectList: {},
    }
    this.courseTitle = {
      name: benamning,
      credits: omfattning,
    }

    for (let semesterIndex = 0; semesterIndex < koppsCourseObject.termsWithCourseRounds.length; semesterIndex++) {
      const { term: roundSemester, rounds } = termsWithCourseRounds[semesterIndex]
      this.courseData.semesterObjectList[roundSemester] = {
        rounds,
      }
    }

    const thisStore = this
    koppsCourseObject.termsWithCourseRounds.forEach(term => {
      const { term: semester, rounds: semesterRounds } = term
      const rounds = semesterRounds.filter(
        round => roundIsNotOutdated(round.lastTuitionDate) && round.state !== 'CANCELLED'
      )
      if (rounds.length > 0) {
        if (thisStore.semesters.indexOf(semester) < 0) thisStore.semesters.push(term)
      }

      if (!Object.prototype.hasOwnProperty.call(thisStore.roundData, 'semester')) {
        thisStore.roundData[semester] = []
        thisStore.roundAccess[semester] = {}
      }

      thisStore.roundData[semester] = semesterRounds.map(
        round =>
          (round.applicationCode = {
            courseCode: this.courseCode,
            language: round.language[language],
            shortName: round.shortName,
            startDate: round.firstTuitionDate,
            ladokUID: round.ladokUID,
            applicationCode: round.applicationCode,
            canBeAccessedByUser: resolveUserAccessRights(this.member, round, this.courseCode, semester),
            state: round.state,
          })
      )
    })
  } catch (err) {
    if (err.response) {
      throw new Error(err.message)
    }
    throw err
  }
}

function createCommonContextFunctions() {
  const context = {
    buildApiUrl,
    handleCourseData,
  }
  return context
}

module.exports = { createCommonContextFunctions }
