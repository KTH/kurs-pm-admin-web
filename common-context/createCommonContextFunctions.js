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
function handleCourseData(courseData, courseCode) {
  const { ladokCourseRounds, ladokData: ladokCourseObject } = courseData
  if (!ladokCourseObject) {
    this.errorMessage = 'Whoopsi daisy... kan just nu inte hämta data från Ladok'
    return
  }
  try {
    const { benamning, omfattning } = ladokCourseObject

    this.courseData = {
      courseCode,
      semesterObjectList: {},
    }
    this.courseTitle = {
      name: benamning,
      credits: omfattning,
    }

    const thisStore = this

    const groupedLadokCourseRounds = []
    ladokCourseRounds.forEach(round => {
      if (groupedLadokCourseRounds.length > 0) {
        groupedLadokCourseRounds.forEach(group => {
          if (Object.prototype.hasOwnProperty.call(group, round.startperiod.inDigits)) {
            group[round.startperiod.inDigits].push(round)
          } else {
            groupedLadokCourseRounds.push({ [round.startperiod.inDigits]: [round] })
          }
        })
      } else {
        groupedLadokCourseRounds.push({ [round.startperiod.inDigits]: [round] })
      }
    })

    groupedLadokCourseRounds.forEach(semester => {
      const [term] = Object.keys(semester)

      if (thisStore.semesters.indexOf(term) < 0) thisStore.semesters.push({ term, semester })

      if (!Object.prototype.hasOwnProperty.call(thisStore.roundData, 'semester')) {
        thisStore.roundData[term] = []
        thisStore.roundAccess[term] = {}
      }

      // TODO: Need to handle state somehow instead of just hardcoding it
      thisStore.roundData[term] = semester[term].map(
        round =>
          (round.tillfalleskod = {
            courseCode: this.courseCode,
            language: round.undervisningssprak.name,
            shortName: round.kortnamn,
            startDate: round.forstaUndervisningsdatum.date,
            ladokUID: round.ladokUID,
            applicationCode: round.tillfalleskod,
            canBeAccessedByUser: resolveUserAccessRights(this.member, round, this.courseCode, term),
            state: 'APPROVED',
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
