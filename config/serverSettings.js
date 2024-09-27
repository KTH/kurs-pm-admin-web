/**
 *
 *            Server specific settings
 *
 * *************************************************
 * * WARNING! Secrets should be read from env-vars *
 * *************************************************
 *
 */
const {
  getEnv,
  devDefaults,
  unpackKOPPSConfig,
  unpackRedisConfig,
  unpackNodeApiConfig,
} = require('kth-node-configuration')
const { safeGet } = require('safe-utils')

// DEFAULT SETTINGS used for dev, if you want to override these for you local environment, use env-vars in .env
const devPort = devDefaults(3000)
const devSsl = devDefaults(false)
const devUrl = devDefaults('http://localhost:' + devPort)
const devmemoApi = devDefaults('https://api-r.referens.sys.kth.se/api/kurs-pm?defaultTimeout=10000')
const devKoppsApi = devDefaults('https://api-r.referens.sys.kth.se/api/kopps/v2/')
const devSessionKey = devDefaults('kurs-pm-admin-web.sid')
const devSessionUseRedis = devDefaults(true)
const devRedis = devDefaults('redis://localhost:6379/')
const devStorageContainerName = devDefaults('memo-blob-container')

// END DEFAULT SETTINGS
const devOidcIssuerURL = devDefaults('https://login.ref.ug.kth.se/adfs')
const devOidcConfigurationURL = devDefaults(`${devOidcIssuerURL}/.well-known/openid-configuration`)
const devOidcTokenSecret = devDefaults('tokenSecretString')
const prefixPath = devDefaults('/kursinfoadmin/pm') // Change this to your prefixPath!!!
const devOidcCallbackURL = devDefaults(`http://localhost:3000${prefixPath}/auth/login/callback`)
const devOidcCallbackSilentURL = devDefaults(`http://localhost:3000${prefixPath}/auth/silent/callback`)
const devOidcLogoutCallbackURL = devDefaults(`http://localhost:3000${prefixPath}/auth/logout/callback`)

module.exports = {
  hostUrl: getEnv('SERVER_HOST_URL', devUrl),
  useSsl: safeGet(() => getEnv('SERVER_SSL', devSsl + '').toLowerCase() === 'true'),
  port: getEnv('SERVER_PORT', devPort),
  ssl: {
    // In development we don't have SSL feature enabled
    pfx: getEnv('SERVER_CERT_FILE', ''),
    passphrase: getEnv('SERVER_CERT_PASSPHRASE', ''),
  },

  oidc: {
    configurationUrl: getEnv('OIDC_CONFIGURATION_URL', devDefaults(devOidcConfigurationURL)),
    clientId: getEnv('OIDC_APPLICATION_ID', null),
    clientSecret: getEnv('OIDC_CLIENT_SECRET', null),
    tokenSecret: getEnv('OIDC_TOKEN_SECRET', devDefaults(devOidcTokenSecret)),
    callbackLoginUrl: getEnv('OIDC_CALLBACK_URL', devDefaults(devOidcCallbackURL)),
    callbackSilentLoginUrl: getEnv('OIDC_CALLBACK_SILENT_URL', devDefaults(devOidcCallbackSilentURL)),
    callbackLogoutUrl: getEnv('OIDC_CALLBACK_LOGOUT_URL', devDefaults(devOidcLogoutCallbackURL)),
  },

  // API keys
  apiKey: {
    memoApi: getEnv('KURS_PM_API_KEY', devDefaults('9876')),
  },

  ladokMellanlagerApi: {
    clientId: getEnv('LADOK_AUTH_CLIENT_ID', devDefaults('c978bff4-80c6-42d2-8d64-a6d90227013b')),
    clientSecret: getEnv('LADOK_AUTH_CLIENT_SECRET', null),
    tokenUrl: getEnv(
      'LADOK_AUTH_TOKEN_URL',
      devDefaults('https://login.microsoftonline.com/acd7f330-d613-48d9-85f2-258b1ac4a015/oauth2/v2.0/token')
    ),
    scope: getEnv('LADOK_AUTH_SCOPE', devDefaults('api://4afd7e46-019e-44e1-9630-12fdf9d31d02/.default')),
    baseUrl: getEnv('LADOK_BASE_URL', devDefaults('https://ladok-mellanlagring-lab.azure-api.net')),
    ocpApimSubscriptionKey: getEnv('LADOK_OCP_APIM_SUBSCRIPTION_KEY', null),
  },

  // Authentication
  auth: {
    // app.kursinfo.superuser = personer tillagda där ska kunna lägga till folk som adminanvändare
    // app.kursinfo.kursinfo-admins = personer som är tillagda där ska kunna logga in i Om kursen via länken "Administera Om kursen" för alla skolor och alla kurser.
    superuserGroup: 'app.kursinfo.superuser',
    kursinfoAdmins: 'app.kursinfo.kursinfo-admins',
  },

  // Service API's
  nodeApi: {
    memoApi: unpackNodeApiConfig('KURS_PM_API_URI', devmemoApi),
  },

  // Cortina
  blockApi: {
    blockUrl: getEnv('CM_HOST_URL', devDefaults('https://www-r.referens.sys.kth.se/cm/')), // Block API base URL
  },

  // Logging
  logging: {
    log: {
      level: getEnv('LOGGING_LEVEL', 'debug'),
    },
    accessLog: {
      useAccessLog: getEnv('LOGGING_ACCESS_LOG', true),
    },
  },
  clientLogging: {
    level: 'debug',
  },
  cache: {
    cortinaBlock: {
      redis: unpackRedisConfig('REDIS_URI', devRedis),
    },
  },

  // Session
  sessionSecret: getEnv('SESSION_SECRET', devDefaults('1234567890')),
  session: {
    key: getEnv('SESSION_KEY', devSessionKey),
    useRedis: safeGet(() => getEnv('SESSION_USE_REDIS', devSessionUseRedis) === 'true'),
    sessionOptions: {
      // do not set session secret here!!
      cookie: {
        secure: String(getEnv('SESSION_SECURE_COOKIE', false)).toLowerCase() === 'true',
        path: getEnv('SERVICE_PUBLISH', '/kursinfoadmin/pm'),
        sameSite: getEnv('SESSION_SAME_SITE_COOKIE', 'Lax'),
      },
      proxy: safeGet(() => getEnv('SESSION_TRUST_PROXY', true) === 'true'),
    },
    redisOptions: unpackRedisConfig('REDIS_URI', devRedis),
  },

  koppsApi: unpackKOPPSConfig('KOPPS_URI', devKoppsApi),

  toolbar: {
    url: getEnv('TOOLBAR_URL', devDefaults('https://www-r.referens.sys.kth.se/social/toolbar/widget.js')),
  },

  fileStorage: {
    kursPMStorage: {
      containerName: getEnv('STORAGE_CONTAINER_NAME', devStorageContainerName),
      blobServiceSasUrl: getEnv('BLOB_SERVICE_SAS_URL', ''),
    },
  },
}
