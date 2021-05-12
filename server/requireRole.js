'use strict'
const { hasGroup } = require('@kth/kth-node-passport-oidc')
const language = require('kth-node-web-common/lib/language')

const i18n = require('../i18n')

function _hasCourseResponsibleGroup(courseCode, courseInitials, userData, rounds, role, isPreview) {
  // 'edu.courses.SF.SF1624.20192.1.courseresponsible'
  const groups = userData.memberOf
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

function _hasThisTypeGroup(courseCode, courseInitials, userData, employeeType) {
  // 'edu.courses.SF.SF1624.20192.1.courseresponsible'
  // 'edu.courses.SF.SF1624.20182.9.teachers'

  const groups = userData.memberOf
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

module.exports.requireRole = (...roles) =>
  async function _hasCourseAcceptedRoles(req, res, next) {
    const lang = language.getLanguage(res) //req.query.l
    const userData = req.session.passport.user || {}
    const { id } = req.params
    const isPreview = req.params.preview && req.params.preview === 'preview'
    let courseCode = ''
    let rounds = []
    if (id.length > 7) {
      const splitId = req.params.id.split('_')
      courseCode = splitId[0].length > 12 ? id.slice(0, 7).toUpperCase() : id.slice(0, 6).toUpperCase()
      rounds = splitId[1]
    } else {
      courseCode = id.toUpperCase()
    }
    const courseInitials = courseCode.slice(0, 2).toUpperCase()
    // TODO: Add date for courseresponsible
    const userCourseRoles = {
      isExaminator: hasGroup(`edu.courses.${courseInitials}.${courseCode}.examiner`, userData),
      isCourseResponsible: _hasCourseResponsibleGroup(
        courseCode,
        courseInitials,
        userData,
        rounds,
        'courseresponsible',
        isPreview
      ),
      isCourseTeacher: _hasThisTypeGroup(courseCode, courseInitials, userData, 'teachers'),
      isSuperUser: userData.isSuperUser,
    }

    // If we don't have one of these then access is forbidden
    const hasAuthorizedRole = roles.reduce((prev, curr) => prev || userCourseRoles[curr], false)

    if (!hasAuthorizedRole) {
      const infoAboutAuth = {
        status: 403,
        showMessage: true,
        message: i18n.message('message_have_not_rights', lang),
      }
      return next(infoAboutAuth)
    }
    return next()
  }
