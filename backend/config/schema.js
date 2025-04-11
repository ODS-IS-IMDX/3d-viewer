// Copyright (c) 2025 NTT InfraNet
const schema = {
  type: 'object',
  required: ['server', 'dbAdapter', 'swagger', 'aws', 'filemanager'],
  properties: {
    dbAdapter: {
      type: 'object',
      properties: {
        cloud: {
          type: 'object',
          required: ['host', 'port', 'database'],
          properties: {
            host: {
              type: 'string'
            },
            port: {
              type: 'string'
            },
            database: {
              type: 'string'
            },
            password: {
              type: 'string'
            },
            user: {
              type: 'string'
            },
            vault: {
              type: 'object',
              required: ['dbCredentialsRefresh', 'path'],
              properties: {
                dbCredentialsRefresh: {
                  type: 'number'
                },
                path: {
                  type: 'string'
                },
                token: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    },
    server: {
      type: 'object',
      properties: {
        publicUrl: {
          type: 'string'
        },
        host: {
          type: 'string',
          default: 'localhost'
        },
        port: {
          type: 'string',
          default: 3000
        },
        cors: {
          type: 'object',
          properties: {
            origin: {
              type: ['boolean', 'array', 'string']
            }
          }
        }
      }
    },
    helmet: {
      type: 'object'
    },
    swagger: {
      type: 'object'
    },
    aws: {
      type: 'object'
    },
    filemanager: {
      type: 'object'
    },
    site: {
      type: 'object'
    },
    asset: {
      type: 'object'
    },
    frontend: {
      type: 'object'
    },
    monitoring: {
      type: 'object',
      properties: {
        maxEventLoopDelay: {
          type: 'number'
        }
      }
    },
    cesiumIon: {
      type: 'object'
    },
    websocket: {
      type: 'object'
    }
  }
}

module.exports = schema
