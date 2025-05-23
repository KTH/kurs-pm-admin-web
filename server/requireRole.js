'use strict'

const { hasGroup } = require('@kth/kth-node-passport-oidc')
const language = require('@kth/kth-node-web-common/lib/language')
const log = require('@kth/log')
const i18n = require('../i18n')

const ladokCourseData = require('./apiCalls/ladokApi')
const { parseCourseCodeAndRounds } = require('./utils/courseCodeParser')

function _hasCourseResponsibleGroup(courseCode, courseInitials, user, rounds, role, isPreview) {
  // 'edu.courses.SF.SF1624.20192.1.courseresponsible'
  const groups = user.memberOf
  const startWith = `edu.courses.${courseInitials}.${courseCode}.` // TODO: What to do with years 20192. ?
  if (rounds === undefined || rounds.length === 0) {
    const endWith = '.' + role
    if (groups && groups.length > 0) {
      for (let i = 0; i < groups.length; i++) {
        if (groups[i].indexOf(startWith) >= 0 && groups[i].indexOf(endWith) >= 0) {
          return true
        }
      }
    }
  } else {
    const endString = '.' + role
    let endWith = ''
    if (groups && groups.length > 0) {
      for (let round = 0; round < rounds.length; round++) {
        endWith = rounds[round] + endString
        for (let i = 0; i < groups.length; i++) {
          if (groups[i].indexOf(startWith) >= 0 && groups[i].indexOf(endWith) >= 0) {
            return true
          }
          if (groups[i].indexOf(startWith) >= 0 && groups[i].indexOf(role) >= 0 && isPreview) {
            return true
          }
        }
      }
    }
  }
  return false
}

const schools = () => ['abe', 'eecs', 'itm', 'cbh', 'sci']

async function _isAdminOfCourseSchool(courseCode, user) {
  // app.kursinfo.***
  const { memberOf: userGroups } = user

  if (!userGroups || userGroups?.length === 0) return false

  const userSchools = schools().filter(schoolCode => userGroups.includes(`app.kursinfo.${schoolCode}`))

  if (userSchools.length === 0) return false
  const courseSchoolCode = await ladokCourseData.getCourseSchoolCode(courseCode)
  log.debug('Fetched courseSchoolCode to define user role', { courseSchoolCode, userSchools })

  if (courseSchoolCode === 'missing_school_code' || courseSchoolCode === 'ladok_get_fails') {
    log.info('Has problems with fetching school code to define if user is a school admin', {
      message: courseSchoolCode,
    })
    return false
  }

  const hasSchoolCodeInAdminGroup = userSchools.includes(courseSchoolCode.toLowerCase())
  log.debug('User admin role', { hasSchoolCodeInAdminGroup })

  // think about missing course code

  return hasSchoolCodeInAdminGroup
}

function _hasThisTypeGroup(courseCode, courseInitials, user, employeeType) {
  // 'edu.courses.SF.SF1624.20192.1.courseresponsible'
  // 'edu.courses.SF.SF1624.20182.9.teachers'

  const groups = user.memberOf
  const startWith = `edu.courses.${courseInitials}.${courseCode}.` // TODO: What to do with years 20192. ?
  const endWith = `.${employeeType}`
  if (groups && groups.length > 0) {
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].indexOf(startWith) >= 0 && groups[i].indexOf(endWith) >= 0) {
        return true
      }
    }
  }
  return false
}

const messageHaveNotRights = lang => ({
  status: 403,
  message: i18n.message('message_have_not_rights', lang),
})

module.exports.requireRole = (...roles) =>
  // eslint-disable-next-line consistent-return
  async function _hasCourseAcceptedRoles(req, res, next) {
    const lang = language.getLanguage(res)
    const { id, preview: previewParam } = req.params
    const { user = {} } = req.session.passport
    const isPreview = previewParam && previewParam === 'preview'

    const { courseCode, rounds } = parseCourseCodeAndRounds(id.toUpperCase())

    const courseInitials = courseCode.slice(0, 2).toUpperCase()
    // TODO: Add date for courseresponsible
    const basicUserCourseRoles = {
      isCourseResponsible: _hasCourseResponsibleGroup(
        courseCode,
        courseInitials,
        user,
        rounds,
        'courseresponsible',
        isPreview
      ),
      isCourseTeacher: _hasThisTypeGroup(courseCode, courseInitials, user, 'teachers'),
      isExaminator: hasGroup(`edu.courses.${courseInitials}.${courseCode}.examiner`, user),
      isKursinfoAdmin: user.isKursinfoAdmin,
      isSuperUser: user.isSuperUser,
    }

    req.session.passport.user.roles = basicUserCourseRoles

    const hasBasicAuthorizedRole = roles.reduce((prev, curr) => prev || basicUserCourseRoles[curr], false)

    if (hasBasicAuthorizedRole) return next()

    if (!hasBasicAuthorizedRole && !roles.includes('isSchoolAdmin')) return next(messageHaveNotRights(lang))

    _isAdminOfCourseSchool(courseCode, user).then(isAdminOfCourseSchool => {
      req.session.passport.user.roles.isSchoolAdmin = isAdminOfCourseSchool

      if (isAdminOfCourseSchool) return next()
      else return next(messageHaveNotRights(lang))
    })
  }
