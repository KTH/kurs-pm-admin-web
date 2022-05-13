/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check
const { createCommonContextFunctions } = require('../../common-context/createCommonContextFunctions')

function setMemberInfo(loggedInUser, courseCode, username) {
  this.courseCode = courseCode
  const { memberOf, roles } = loggedInUser

  this.member = {
    memberOfCourseRelatedGroups: memberOf.filter(member => member.indexOf(this.courseCode) > -1),
    otherRoles: roles,
  }
  this.username = username
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
    setMemberInfo,
    setBrowserConfig,
    setLanguage,
    ...createCommonContextFunctions(),
  }
  return context
}

module.exports = { createServerSideContext }
