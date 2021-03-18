'use strict'

const passport = require('passport')
const log = require('kth-node-log')
const CasStrategy = require('kth-node-passport-cas').Strategy
const { GatewayStrategy } = require('kth-node-passport-cas')
const i18n = require('../i18n')
const { System } = require('./controllers')
const { server: config } = require('./configuration')

/**
 * Passport will maintain persistent login sessions. In order for persistent sessions to work, the authenticated
 * user must be serialized to the session, and deserialized when subsequent requests are made.
 *
 * Passport does not impose any restrictions on how your user records are stored. Instead, you provide functions
 * to Passport which implements the necessary serialization and deserialization logic. In a typical
 * application, this will be as simple as serializing the user ID, and finding the user by ID when deserializing.
 */
passport.serializeUser((user, done) => {
  if (user) {
    log.debug('User serialized: ' + user)
    done(null, user)
  } else {
    done()
  }
})

passport.deserializeUser((user, done) => {
  if (user) {
    log.debug('User deserialized: ' + user)
    done(null, user)
  } else {
    done()
  }
})

/**
 * Before asking Passport to authenticate a request, the strategy (or strategies) used by an application must
 * be configured.
 *
 * Strategies, and their configuration, are supplied via the use() function. For example, the following uses
 * the passport-cas-kth strategy for CAS authentication.
 */

const casOptions = {
  ssoBaseURL: config.cas.ssoBaseURL,
  serverBaseURL: config.hostUrl,
  log,
}

if (config.cas.pgtUrl) {
  casOptions.pgtURL = config.hostUrl + config.cas.pgtUrl
}

const strategy = new CasStrategy(casOptions, (logOnResult, done) => {
  const { user } = logOnResult
  log.debug(`User from CAS: ${user} ${JSON.stringify(logOnResult)}`)
  return done(null, user, logOnResult)
})

passport.use(strategy)

passport.use(
  new GatewayStrategy(
    {
      casUrl: config.cas.ssoBaseURL,
    },
    (result, done) => {
      log.debug({ result }, `CAS Gateway user: ${result.user}`)
      done(null, result.user, result)
    }
  )
)

// The factory routeHandlers.getRedirectAuthenticatedUser returns a middleware that sets the user in req.session.authUser and
// redirects to appropriate place when returning from CAS login
// The unpackLdapUser function transforms an ldap user to a user object that is stored as
const ldapClient = require('./adldapClient')
const { hasGroup, getGroups } = require('kth-node-ldap').utils
module.exports.redirectAuthenticatedUserHandler = require('kth-node-passport-cas').routeHandlers.getRedirectAuthenticatedUser(
  {
    ldapConfig: config.ldap,
    ldapClient,
    proxyPrefixPath: config.proxyPrefixPath.uri,
    unpackLdapUser: (ldapUser, pgtIou) => ({
      username: ldapUser.ugUsername,
      displayName: ldapUser.displayName,
      email: ldapUser.mail,
      ugKthid: ldapUser.ugKthid,
      pgtIou,
      memberOf: getGroups(ldapUser), // memberOf important for requireRole
      isSuperUser: hasGroup(config.auth.superuserGroup, ldapUser),
    }),
  }
)

/*
  Checks req.session.authUser as created above im unpackLdapUser.
  Usage:
  requireRole('isAdmin', 'isEditor')
*/
function _hasCourseResponsibleGroup(courseCode, courseInitials, ldapUser, rounds, role, isPreview) {
  // 'edu.courses.SF.SF1624.20192.1.courseresponsible'
  const groups = ldapUser.memberOf
  const startWith = `edu.courses.${courseInitials}.${courseCode}.` // TODO: What to do with years 20192. ?
  if (rounds === undefined || rounds.length === 0) {
    // TODO
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

function _hasCourseTeacherGroup(courseCode, courseInitials, ldapUser, rounds, role) {
  // 'edu.courses.SF.SF1624.20192.1.courseresponsible'
  if (rounds === undefined || rounds.length === 0) {
    // TODO
    return false
  }
  const groups = ldapUser.memberOf
  const startWith = `edu.courses.${courseInitials}.${courseCode}.` // TODO: What to do with years 20192. ?
  const endString = '.' + role
  let endWith = ''
  if (groups && groups.length > 0) {
    for (let round = 0; round < rounds.length; round++) {
      endWith = rounds[round] + endString
      for (let i = 0; i < groups.length; i++) {
        if (groups[i].indexOf(startWith) >= 0 && groups[i].indexOf(endWith) >= 0) {
          return true
        }
      }
    }
  }
  return false
}

module.exports.requireRole = function () {
  // TODO:Different roles for selling text and course development
  const roles = Array.prototype.slice.call(arguments)

  return async function _hasCourseAcceptedRoles(req, res, next) {
    const language = req.query.l
    const ldapUser = req.session.authUser || {}
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
      isExaminator: hasGroup(`edu.courses.${courseInitials}.${courseCode}.examiner`, ldapUser),
      isCourseResponsible: _hasCourseResponsibleGroup(
        courseCode,
        courseInitials,
        ldapUser,
        rounds,
        'courseresponsible',
        isPreview
      ),
      isCourseTeacher: _hasCourseTeacherGroup(courseCode, courseInitials, ldapUser, rounds, 'teachers'),
      isSuperUser: ldapUser.isSuperUser,
    }

    // If we don't have one of these then access is forbidden
    const hasAuthorizedRole = roles.reduce((prev, curr) => prev || userCourseRoles[curr], false)

    if (!hasAuthorizedRole) {
      const infoAboutAuth = {
        status: 403,
        message: i18n.messages[language && language === 'sv' ? 1 : 0].messages.error_auth,
      }
      return System.final(infoAboutAuth, req, res)
    }
    return next()
  }
}
