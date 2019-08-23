const server = require('kth-node-server')

// Now read the server config etc.
const config = require('./configuration').server
require('./api')
const AppRouter = require('kth-node-express-routing').PageRouter
const getPaths = require('kth-node-express-routing').getPaths

if (config.appInsights && config.appInsights.instrumentationKey) {
  let appInsights = require('applicationinsights')
  appInsights.setup(config.appInsights.instrumentationKey)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .start()
}

// Expose the server and paths
server.locals.secret = new Map()
module.exports = server
module.exports.getPaths = () => getPaths()

/* ***********************
 * ******* LOGGING *******
 * ***********************
 */
const log = require('kth-node-log')
const packageFile = require('../package.json')

let logConfiguration = {
  name: packageFile.name,
  app: packageFile.name,
  env: process.env.NODE_ENV,
  level: config.logging.log.level,
  console: config.logging.console,
  stdout: config.logging.stdout,
  src: config.logging.src
}
log.init(logConfiguration)

/* **************************
 * ******* TEMPLATING *******
 * **************************
 */
const exphbs = require('express-handlebars')
const path = require('path')
server.set('views', path.join(__dirname, '/views'))
server.set('layouts', path.join(__dirname, '/views/layouts'))
server.set('partials', path.join(__dirname, '/views/partials'))
server.engine('handlebars', exphbs({
  defaultLayout: 'publicLayout',
  layoutsDir: server.settings.layouts,
  partialsDir: server.settings.partials
}))
server.set('view engine', 'handlebars')
// Register handlebar helpers
require('./views/helpers')

/* ******************************
 * ******* ACCESS LOGGING *******
 * ******************************
 */
const accessLog = require('kth-node-access-log')
server.use(accessLog(config.logging.accessLog))

/* ****************************
 * ******* STATIC FILES *******
 * ****************************
 */
const browserConfig = require('./configuration').browser
const browserConfigHandler = require('kth-node-configuration').getHandler(browserConfig, getPaths())
const express = require('express')

// const compression = require('compression')
// server.use(compression({
// filter: function () { return true }
// }))
// const minify = require('express-minify')
// server.use(minify())

// helper
function setCustomCacheControl (res, path) {
  if (express.static.mime.lookup(path) === 'text/html') {
    // Custom Cache-Control for HTML files
    res.setHeader('Cache-Control', 'no-cache')
  }
}

// Files/statics routes--
// Map components HTML files as static content, but set custom cache control header, currently no-cache to force If-modified-since/Etag check.
server.use(config.proxyPrefixPath.uri + '/static/js/components', express.static('./dist/js/components', { setHeaders: setCustomCacheControl }))
// Expose browser configurations
server.use(config.proxyPrefixPath.uri + '/static/browserConfig', browserConfigHandler)
// Map Bootstrap.
server.use(config.proxyPrefixPath.uri + '/static/bootstrap', express.static('./node_modules/bootstrap/dist'))
// Map kth-style.
server.use(config.proxyPrefixPath.uri + '/static/kth-style', express.static('./node_modules/kth-style/dist'))

// server.use(config.proxyPrefixPath.uri + '/static/js/app.js', express.static('./dist/js/app.js'))
// Map static content like images, css and js.
server.use(config.proxyPrefixPath.uri + '/static', express.static('./dist'))
// Return 404 if static file isn't found so we don't go through the rest of the pipeline
server.use(config.proxyPrefixPath.uri + '/static', function (req, res, next) {
  var error = new Error('File not found: ' + req.originalUrl)
  error.statusCode = 404
  next(error)
})

// QUESTION: Should this really be set here?
// http://expressjs.com/en/api.html#app.set
server.set('case sensitive routing', true)

/* *******************************
 * ******* REQUEST PARSING *******
 * *******************************
 */
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(cookieParser())

/* ***********************
 * ******* SESSION *******
 * ***********************
 */
const session = require('kth-node-session')
const options = config.session
options.sessionOptions.secret = config.sessionSecret
server.use(session(options))

/* ************************
 * ******* LANGUAGE *******
 * ************************
 */
const { languageHandler } = require('kth-node-web-common/lib/language')
server.use(config.proxyPrefixPath.uri, languageHandler)

/* ******************************
 * ******* AUTHENTICATION *******
 * ******************************
 */
const passport = require('passport')
// const ldapClient = require('./adldapClient')
const { authLoginHandler, authCheckHandler, logoutHandler, pgtCallbackHandler, serverLogin, getServerGatewayLogin } = require('kth-node-passport-cas').routeHandlers({
  casLoginUri: config.proxyPrefixPath.uri + '/login',
  casGatewayUri: config.proxyPrefixPath.uri + '/loginGateway',
  proxyPrefixPath: config.proxyPrefixPath.uri,
  server: server
})
const { redirectAuthenticatedUserHandler } = require('./authentication')
server.use(passport.initialize())
server.use(passport.session())

const authRoute = AppRouter()
authRoute.get('cas.login', config.proxyPrefixPath.uri + '/login', authLoginHandler, redirectAuthenticatedUserHandler)
authRoute.get('cas.gateway', config.proxyPrefixPath.uri + '/loginGateway', authCheckHandler, redirectAuthenticatedUserHandler)
authRoute.get('cas.logout', config.proxyPrefixPath.uri + '/logout', logoutHandler)
// Optional pgtCallback (use config.cas.pgtUrl?)
authRoute.get('cas.pgtCallback', config.proxyPrefixPath.uri + '/pgtCallback', pgtCallbackHandler)
server.use('/', authRoute.getRouter())

// Convenience methods that should really be removed
server.login = serverLogin
server.gatewayLogin = getServerGatewayLogin

/* ******************************
 * ******* CORTINA BLOCKS *******
 * ******************************
 */
server.use(config.proxyPrefixPath.uri, require('kth-node-web-common/lib/web/cortina')({
  blockUrl: config.blockApi.blockUrl,
  proxyPrefixPath: config.proxyPrefixPath.uri,
  hostUrl: config.hostUrl,
  redisConfig: config.cache.cortinaBlock.redis
}))

/* ********************************
 * ******* CRAWLER REDIRECT *******
 * ********************************
 */
const excludePath = config.proxyPrefixPath.uri + '(?!/static).*'
const excludeExpression = new RegExp(excludePath)
server.use(excludeExpression, require('kth-node-web-common/lib/web/crawlerRedirect')({
  hostUrl: config.hostUrl
}))

/* ********************************
 * ******* FILE UPLOAD*******
 * ********************************
 */

const fileUpload = require('express-fileupload')
server.use(fileUpload())
server.use(bodyParser.json({ limit: '50mb' }))
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

/* **********************************
 * ******* APPLICATION ROUTES *******
 * **********************************
 */
const { System, Admin } = require('./controllers')
const { requireRole } = require('./authentication')

// System routes
const systemRoute = AppRouter()
systemRoute.get('system.monitor', config.proxyPrefixPath.uri + '/_monitor', System.monitor)
systemRoute.get('system.about', config.proxyPrefixPath.uri + '/_about', System.about)
systemRoute.get('system.paths', config.proxyPrefixPath.uri + '/_paths', System.paths)
systemRoute.get('system.robots', '/robots.txt', System.robotsTxt)
server.use('/', systemRoute.getRouter())

// App routes
const appRoute = AppRouter()
appRoute.get('system.index', config.proxyPrefixPath.uri + '/:id', serverLogin, requireRole('isCourseResponsible', 'isExaminator', 'isSuperUser'), Admin.getIndex)
appRoute.get('system.index', config.proxyPrefixPath.uri + '/:preview/:id', serverLogin, requireRole('isCourseResponsible', 'isExaminator', 'isSuperUser', 'isCourseTeacher'), Admin.getIndex)
appRoute.get('system.gateway', config.proxyPrefixPath.uri + '/gateway', getServerGatewayLogin('/'), requireRole('isAdmin'), Admin.getIndex)

appRoute.get('api.kursutvecklingGetById', config.proxyPrefixPath.uri + '/apicall/getRoundAnalysisById/:id', Admin.getRoundAnalysis)
appRoute.all('api.kursutvecklingPost', config.proxyPrefixPath.uri + '/apicall/postRoundAnalysisById/:id/:status', Admin.postRoundAnalysis)
// appRoute.post('api.kursutvecklingPost', config.proxyPrefixPath.uri + '/apicall/postRoundAnalysisById/:id/:status', Admin.postRoundAnalysis)
appRoute.delete('api.kursutvecklingDelete', config.proxyPrefixPath.uri + '/apicall/deleteRoundAnalysisById/:id', Admin.deleteRoundAnalysis)
appRoute.get('api.kursutvecklingGetUsedRounds', config.proxyPrefixPath.uri + '/apicall/kursutvecklingGetUsedRounds/:courseCode/:semester', Admin.getUsedRounds)
appRoute.get('api.koppsCourseData', config.proxyPrefixPath.uri + '/api/kursutveckling-admin/getKoppsCourseDataByCourse/:courseCode/:language', Admin.getKoppsCourseData)
appRoute.post('storage.saveFile', config.proxyPrefixPath.uri + '/storage/saveFile/:semester/:courseCode/:rounds', Admin.saveFileToStorage)
appRoute.post('storage.updateFile', config.proxyPrefixPath.uri + '/storage/updateFile/:fileName/', Admin.updateFileInStorage)
appRoute.post('storage.deleteFile', config.proxyPrefixPath.uri + '/storage/deleteFile/:id', Admin.deleteFileInStorage)
server.use('/', appRoute.getRouter())

// Not found etc
server.use(System.notFound)
server.use(System.final)

// Register handlebar helpers
require('./views/helpers')
