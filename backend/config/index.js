// Copyright (c) 2025 NTT InfraNet
'use strict'
const getenv = require('getenv')
const { getSecret } = require('../lib/vault/index.js')
const { assume } = require('../lib/utils/aws-sts-client.js')

const getSecretData = async params => {
  try {
    const secret = await getSecret(params)
    return secret.data
  } catch (e) {
    console.error(e)
  }
  return {}
}

const config = async function() {
  if (process.env.EHV_IS_DOCKER_CONTAINER !== 'true') {
    require('dotenv').config({
      path: `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`
    })
  }

  const VAULT_TOKEN = getenv('VAULT_TOKEN', '')
  const secrets = await getSecretData({
    token: VAULT_TOKEN,
    role: getenv('VAULT_VALUE_ROLE', ''),
    path: getenv('VAULT_VALUE_PATH', '')
  })
  const getVault = (key, fallback = '') => getenv(key, secrets[key] || fallback)

  const EHV_CORE_SERVER_HOST = getenv('EHV_CORE_SERVER_HOST')
  const EHV_CORE_SERVER_PORT = getenv('EHV_CORE_SERVER_PORT')
  const EHV_CORE_SERVER_PUBLIC_URL = getenv('EHV_CORE_SERVER_PUBLIC_URL')
  const EHV_CORE_MYSQL_HOST = getenv('EHV_CORE_MYSQL_HOST')
  const EHV_CORE_MYSQL_PORT = getenv('EHV_CORE_MYSQL_PORT')
  const EHV_CORE_MYSQL_DATABASE = getenv('EHV_CORE_MYSQL_DATABASE')

  const EHV_CORE_MYSQL_USER = getVault('EHV_CORE_MYSQL_USER', '')
  const EHV_CORE_MYSQL_PASSWORD = getVault('EHV_CORE_MYSQL_PASSWORD', '')
  const VAULT_DB_CREDENTIALS_ROLE = getenv('VAULT_DB_CREDENTIALS_ROLE', '')
  const VAULT_DB_CREDENTIALS_PATH = getenv('VAULT_DB_CREDENTIALS_PATH', '')
  const VAULT_DB_CREDENTIALS_REFRESH = getenv.int(
    'VAULT_DB_CREDENTIALS_REFRESH',
    1 * 60000
  )

  const FRONTEND_ADDR = getenv('FRONTEND_ADDR')
  const AWS_ENDPOINT = getenv('AWS_ENDPOINT', null)

  const STS = {
    region: getenv('STS_REGION', 'ap-northeast-1'),
    roleArn: getVault('STS_ROLE_ARN'),
    duration: getenv.int('STS_DURATION', 1800) // 30分
  }

  const S3_BUCKET_EHV = getenv('S3_BUCKET_EHV', '')
  const S3_BUCKET_B2 = getenv('S3_BUCKET_B2', '')
  const S3_BUCKET_VS_INPUT = getenv('S3_BUCKET_VS_INPUT', '')
  const S3_BUCKET_VS_RESULT_OK = getenv('S3_BUCKET_VS_RESULT_OK', '')
  const S3_BUCKET_VS_RESULT_NG = getenv('S3_BUCKET_VS_RESULT_NG', '')

  const S3_ACCESS_KEY_ID_B2 = getVault('S3_ACCESS_KEY_ID_B2')
  const S3_SECRET_ACCESS_KEY_B2 = getVault('S3_SECRET_ACCESS_KEY_B2')
  const S3_SESSION_TOKEN_B2 = getVault('S3_SESSION_TOKEN_B2')

  const S3_ACCESS_KEY_ID_EHV = getVault('S3_ACCESS_KEY_ID_EHV')
  const S3_SECRET_ACCESS_KEY_EHV = getVault('S3_SECRET_ACCESS_KEY_EHV')
  const S3_SESSION_TOKEN_EHV = getVault('S3_SESSION_TOKEN_EHV')

  const S3_ACCESS_KEY_ID_VS_INPUT = getVault('S3_ACCESS_KEY_ID_VS_INPUT')
  const S3_SECRET_ACCESS_KEY_VS_INPUT = getVault(
    'S3_SECRET_ACCESS_KEY_VS_INPUT'
  )
  const S3_SESSION_TOKEN_VS_INPUT = getVault('S3_SESSION_TOKEN_VS_INPUT')

  const S3_ACCESS_KEY_ID_VS_RESULT_OK = getVault(
    'S3_ACCESS_KEY_ID_VS_RESULT_OK'
  )
  const S3_SECRET_ACCESS_KEY_VS_RESULT_OK = getVault(
    'S3_SECRET_ACCESS_KEY_VS_RESULT_OK'
  )
  const S3_SESSION_TOKEN_VS_RESULT_OK = getVault(
    'S3_SESSION_TOKEN_VS_RESULT_OK'
  )

  const S3_ACCESS_KEY_ID_VS_RESULT_NG = getVault(
    'S3_ACCESS_KEY_ID_VS_RESULT_NG'
  )
  const S3_SECRET_ACCESS_KEY_VS_RESULT_NG = getVault(
    'S3_SECRET_ACCESS_KEY_VS_RESULT_NG'
  )
  const S3_SESSION_TOKEN_VS_RESULT_NG = getVault(
    'S3_SESSION_TOKEN_VS_RESULT_NG'
  )

  const S3_PREFIX_EHV_LAS_INPUT = getenv('S3_PREFIX_EHV_LAS_INPUT', '')
  const S3_PREFIX_EHV_LAS_ERROR = getenv('S3_PREFIX_EHV_LAS_ERROR', '')
  const S3_PREFIX_EHV_CITY_GML_INPUT = getenv(
    'S3_PREFIX_EHV_CITY_GML_INPUT',
    ''
  )
  const S3_PREFIX_EHV_CITY_GML_ERROR = getenv(
    'S3_PREFIX_EHV_CITY_GML_ERROR',
    ''
  )
  const S3_PREFIX_EHV_SPACE_INFO_BE_INPUT = getenv(
    'S3_PREFIX_EHV_SPACE_INFO_BE_INPUT',
    ''
  )
  const S3_PREFIX_EHV_SPACE_INFO_BE_ERROR = getenv(
    'S3_PREFIX_EHV_SPACE_INFO_BE_ERROR',
    ''
  )
  const S3_PREFIX_EHV_SPACE_INFO_AF_INPUT = getenv(
    'S3_PREFIX_EHV_SPACE_INFO_AF_INPUT',
    ''
  )
  const S3_PREFIX_EHV_SPACE_INFO_AF_ERROR = getenv(
    'S3_PREFIX_EHV_SPACE_INFO_AF_ERROR',
    ''
  )
  const S3_PREFIX_EHV_CONVERT_TOOL_INPUT = getenv(
    'S3_PREFIX_EHV_CONVERT_TOOL_INPUT',
    ''
  )
  const S3_PREFIX_B2_CONVERT_TOOL_OUTPUT = getenv(
    'S3_PREFIX_B2_CONVERT_TOOL_OUTPUT',
    ''
  )
  const S3_PREFIX_EHV_CONVERT_TOOL_ERROR = getenv(
    'S3_PREFIX_EHV_CONVERT_TOOL_ERROR',
    ''
  )

  const S3_PREFIX_B2_TILE_BEFORE_APPROVAL = getenv(
    'S3_PREFIX_B2_TILE_BEFORE_APPROVAL',
    ''
  )
  const S3_PREFIX_B2_TILE_AFTER_APPROVAL = getenv(
    'S3_PREFIX_B2_TILE_AFTER_APPROVAL',
    ''
  )
  const S3_PREFIX_B2_SPACE_BEFORE_APPROVAL = getenv(
    'S3_PREFIX_B2_SPACE_BEFORE_APPROVAL',
    ''
  )
  const S3_PREFIX_B2_SPACE_AFTER_APPROVAL = getenv(
    'S3_PREFIX_B2_SPACE_AFTER_APPROVAL',
    ''
  )

  const S3_PREFIX_VS_INPUT = getenv('S3_PREFIX_VS_INPUT', '')
  const S3_PREFIX_VS_RESULT_OK = getenv('S3_PREFIX_VS_RESULT_OK', '')
  const S3_PREFIX_VS_RESULT_NG = getenv('S3_PREFIX_VS_RESULT_NG', '')

  const FILE_UPLOAD_MAX_SIZE = getenv('FILE_UPLOAD_MAX_SIZE', '1GB')

  const MAX_EVENT_LOOP_DELAY = getenv.int('MAX_EVENT_LOOP_DELAY', 200)

  const WEBSOCKET_URL = getenv('WEBSOCKET_URL', '')
  const WEBSOCKET_TIMEOUT = getenv.int('WEBSOCKET_TIMEOUT', 10) * 1000 // ミリ秒に変換

  const SITE_MULTIPLE_DATA_DELETE_REQUEST_LIMIT = getenv.int(
    'SITE_MULTIPLE_DATA_DELETE_REQUEST_LIMIT'
  )

  const ASSET_REGISTERABLE_NUM = getenv.int('ASSET_REGISTERABLE_NUM')
  const ASSET_BATCH_CONVERT_LIMIT = getenv.int('ASSET_BATCH_CONVERT_LIMIT', 10)
  const ASSET_AVAILABLE_TIME = getenv.float('ASSET_AVAILABLE_TIME') // Ints cannot support exponential notation
  const ASSET_SYSTEM_USER_ID = getenv('ASSET_SYSTEM_USER_ID')

  const CESIUM_ION_ACCESS_TOKEN = getVault('CESIUM_ION_ACCESS_TOKEN')
  const CESIUM_ION_API_URL = getenv('CESIUM_ION_API_URL')

  const VIEW_API_DOCUMENT = getenv.bool('VIEW_API_DOCUMENT', false)

  const cfg = {
    server: {
      host: EHV_CORE_SERVER_HOST,
      port: EHV_CORE_SERVER_PORT,
      publicUrl: EHV_CORE_SERVER_PUBLIC_URL
    },
    dbAdapter: {},
    helmet: {
      development: {
        contentSecurityPolicy: false
      },
      production: {
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"]
          }
        }
      }
    },
    swagger: {
      routePrefix: '/documentation',
      hideUntagged: true,
      exposeRoute: VIEW_API_DOCUMENT,
      swagger: {
        info: {
          title: 'Early Harvest Viewer',
          description: 'Early Harvest Viewer API',
          version: '1.0.0'
        },
        externalDocs: {
          url: 'https://swagger.io',
          description: 'Find more info here'
        },
        host: 'localhost',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json']
      }
    },
    aws: {
      endpoint: AWS_ENDPOINT
    },
    filemanager: {
      bucket: S3_BUCKET_EHV,
      key: S3_ACCESS_KEY_ID_EHV,
      secret: S3_SECRET_ACCESS_KEY_EHV
    },
    site: {
      multipleData: {
        deleteRequestLimit: SITE_MULTIPLE_DATA_DELETE_REQUEST_LIMIT
      }
    },
    asset: {
      b2: {
        bucket: S3_BUCKET_B2,
        accessKeyId: S3_ACCESS_KEY_ID_B2,
        secretAccessKey: S3_SECRET_ACCESS_KEY_B2,
        sessionToken: S3_SESSION_TOKEN_B2,
        prefixes: {
          convertTool: {
            output: S3_PREFIX_B2_CONVERT_TOOL_OUTPUT
          },
          tile: {
            approval: {
              before: S3_PREFIX_B2_TILE_BEFORE_APPROVAL,
              after: S3_PREFIX_B2_TILE_AFTER_APPROVAL
            }
          },
          spaceInfo: {
            approval: {
              before: S3_PREFIX_B2_SPACE_BEFORE_APPROVAL,
              after: S3_PREFIX_B2_SPACE_AFTER_APPROVAL
            }
          }
        },
        assumeRole: assume({
          ...STS,
          accessKeyId: S3_ACCESS_KEY_ID_B2,
          secretAccessKey: S3_SECRET_ACCESS_KEY_B2,
          sessionToken: S3_SESSION_TOKEN_B2
        })
      },
      ehv: {
        bucket: S3_BUCKET_EHV,
        accessKeyId: S3_ACCESS_KEY_ID_EHV,
        secretAccessKey: S3_SECRET_ACCESS_KEY_EHV,
        sessionToken: S3_SESSION_TOKEN_EHV,
        registerableNum: ASSET_REGISTERABLE_NUM,
        availableTime: ASSET_AVAILABLE_TIME,
        systemUserId: ASSET_SYSTEM_USER_ID,
        fileUploadMaxSize: FILE_UPLOAD_MAX_SIZE,
        assetBatchConvertLimit: ASSET_BATCH_CONVERT_LIMIT,
        prefixes: {
          convertTool: {
            input: S3_PREFIX_EHV_CONVERT_TOOL_INPUT,
            error: S3_PREFIX_EHV_CONVERT_TOOL_ERROR
          },
          tile: {
            las: {
              input: S3_PREFIX_EHV_LAS_INPUT,
              error: S3_PREFIX_EHV_LAS_ERROR
            },
            cityGml: {
              input: S3_PREFIX_EHV_CITY_GML_INPUT,
              error: S3_PREFIX_EHV_CITY_GML_ERROR
            }
          },
          spaceInfo: {
            input: {
              approval: {
                before: S3_PREFIX_EHV_SPACE_INFO_BE_INPUT,
                after: S3_PREFIX_EHV_SPACE_INFO_AF_INPUT
              }
            },
            error: {
              approval: {
                before: S3_PREFIX_EHV_SPACE_INFO_BE_ERROR,
                after: S3_PREFIX_EHV_SPACE_INFO_AF_ERROR
              }
            }
          }
        },
        assumeRole: assume({
          ...STS,
          accessKeyId: S3_ACCESS_KEY_ID_EHV,
          secretAccessKey: S3_SECRET_ACCESS_KEY_EHV,
          sessionToken: S3_SESSION_TOKEN_EHV
        })
      },
      vs: {
        input: {
          bucket: S3_BUCKET_VS_INPUT,
          accessKeyId: S3_ACCESS_KEY_ID_VS_INPUT,
          secretAccessKey: S3_SECRET_ACCESS_KEY_VS_INPUT,
          sessionToken: S3_SESSION_TOKEN_VS_INPUT,
          prefix: S3_PREFIX_VS_INPUT,
          assumeRole: assume({
            ...STS,
            accessKeyId: S3_ACCESS_KEY_ID_VS_INPUT,
            secretAccessKey: S3_SECRET_ACCESS_KEY_VS_INPUT,
            sessionToken: S3_SESSION_TOKEN_VS_INPUT
          })
        },
        result: {
          ok: {
            bucket: S3_BUCKET_VS_RESULT_OK,
            accessKeyId: S3_ACCESS_KEY_ID_VS_RESULT_OK,
            secretAccessKey: S3_SECRET_ACCESS_KEY_VS_RESULT_OK,
            sessionToken: S3_SESSION_TOKEN_VS_RESULT_OK,
            prefix: S3_PREFIX_VS_RESULT_OK,
            assumeRole: assume({
              ...STS,
              accessKeyId: S3_ACCESS_KEY_ID_VS_RESULT_OK,
              secretAccessKey: S3_SECRET_ACCESS_KEY_VS_RESULT_OK,
              sessionToken: S3_SESSION_TOKEN_VS_RESULT_OK
            })
          },
          ng: {
            bucket: S3_BUCKET_VS_RESULT_NG,
            accessKeyId: S3_ACCESS_KEY_ID_VS_RESULT_NG,
            secretAccessKey: S3_SECRET_ACCESS_KEY_VS_RESULT_NG,
            sessionToken: S3_SESSION_TOKEN_VS_RESULT_NG,
            prefix: S3_PREFIX_VS_RESULT_NG,
            assumeRole: assume({
              ...STS,
              accessKeyId: S3_ACCESS_KEY_ID_VS_RESULT_NG,
              secretAccessKey: S3_SECRET_ACCESS_KEY_VS_RESULT_NG,
              sessionToken: S3_SESSION_TOKEN_VS_RESULT_NG
            })
          }
        }
      },
      cesiumIon: {
        host: CESIUM_ION_API_URL,
        token: CESIUM_ION_ACCESS_TOKEN
      }
    },
    frontend: {
      addr: FRONTEND_ADDR
    },
    monitoring: {
      maxEventLoopDelay: MAX_EVENT_LOOP_DELAY
    },
    websocket: {
      url: WEBSOCKET_URL,
      timeout: WEBSOCKET_TIMEOUT
    }
  }

  cfg.dbAdapter.cloud = {
    name: 'cloud',
    host: EHV_CORE_MYSQL_HOST,
    port: EHV_CORE_MYSQL_PORT,
    database: EHV_CORE_MYSQL_DATABASE
  }
  // user/password for db will come from vault or from env (ie, for test enviroments)
  if (!EHV_CORE_MYSQL_USER) {
    cfg.dbAdapter.cloud.vault = {
      dbCredentialsRefresh: VAULT_DB_CREDENTIALS_REFRESH,
      role: VAULT_DB_CREDENTIALS_ROLE,
      path: VAULT_DB_CREDENTIALS_PATH,
      // in AWS resources we login to vault using a role, locally we can test using a token
      token: VAULT_TOKEN || undefined
    }
  } else {
    cfg.dbAdapter.cloud.user = EHV_CORE_MYSQL_USER
    cfg.dbAdapter.cloud.password = EHV_CORE_MYSQL_PASSWORD
  }

  return cfg
}

module.exports = config
