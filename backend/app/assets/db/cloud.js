// Copyright (c) 2025 NTT InfraNet
'use strict'

const path = require('path')
const SQL = require('@nearform/sql')
const NodeCache = require('node-cache')
const Boom = require('@hapi/boom')
const isArray = require('lodash/isArray')
const cesiumIonApi = require('../../../lib/external/cesium-ion-api')
const { instance: stsClient } = require('../../../lib/utils/aws-sts-client')

const {
  GenericServerError,
  EntityNotFoundError
} = require('../../../lib/errors')

const {
  addSiteIdFilter,
  addPaginationFilter,
  addShowNotDeletedFilter,
  addAssetStatusFilter,
  addAssetNameFilter,
  addIdFilter,
  addColumnFilter,
  addLinkageFileNameFilter,
  addEhvAssetTypeFilter
} = require('../../../lib/utils/db-filters')
const connect = require('../../../lib/utils/db-connection')

const { getUuid } = require('../../../lib/utils/uuid')
const utilNotification = require('../../../lib/utils/notification')
const {
  uploadObject,
  copyObject,
  deleteObject,
  getStreamAndHeader,
  getObjectByPrefix
} = require('../../../lib/utils/aws-s3-client')
const { getUniqueName } = require('../../../lib/utils/get-unique-name')
const { convertDataToSQLParam } = require('../../../lib/utils/convert')
const { generateMessage } = require('../../../lib/utils/generate-message')

const {
  PROCESSING_TYPE,
  RESOURCE_CATEGORY
} = require('../../processing-status-managements/constants')

const mapAssetsFromDb = require('./map-assets-from-db')

const {
  ASSET_STATUS,
  EHV_ASSET_TYPE,
  ASSET_FORMAT_TYPE,
  ASSET_CATEGORY,
  CESIUM_ION_API_TYPE_INFO,
  VIEW_STRUCTURE_DEFAULT,
  VIEW_STRUCTURE_BRANCH
} = require('../constants')

const {
  ERROR_MESSAGES: { ASSET_UPLOAD_NOT_FOUND }
} = require('../../../lib/utils/message-codes')

const { LINKED_ASSET_TYPE } = require('../../assets-assets/constants')

const AssetInfo = require('../utils/asset-info')

const {
  NOTIFICATION_MESSAGES,
  ERROR_MESSAGES
} = require('../../../lib/utils/message-codes')
const { LOG_PREFIX, LOG_ERROR } = require('../../../lib/constants')

const EXCLUDE_STATUS_LIST = [
  ASSET_STATUS.DELETE_WAIT,
  ASSET_STATUS.DELETE_ERROR,
  ASSET_STATUS.DELETE_COMPLETE
]

/**
 * Batch log level
 */
const BATCH_LOG_LEVEL = {
  /**
   * debug
   */
  DEBUG: 'DEBUG',
  /**
   * information
   */
  INFO: 'INFO',
  /**
   * error
   */
  ERROR: 'ERROR'
}

/**
 * Cloud Database adapter to support Assets
 *
 * @class AssetsDbAdapter
 * @param {Object} options - An Object containing logger and database instances
 * @param {Object} options.mysql - The MySQL client instance
 * @param {Object} options.fastify - The Fastify instance
 * @param {Object} options.log - Logger instance
 */
class AssetsDbAdapter {
  constructor(options) {
    this.mysql = options.mysql
    this.log = options.log
    this.fastify = options.fastify
    this.cache = new NodeCache()
  }

  /**
   * Get a list of assets
   *
   * @param {Object} options
   * @param {String|Array} [options.id] - The asset identifier
   * @param {String} [options.siteId] - The site identifier
   * @param {String} [options.name] - The asset name
   * @param {String|Array} [options.status] - The asset status
   * @param {String|Array} [options.category] - asset category
   * @param {String|Array} [options.ionType] - cesium-ion-api request parmeters
   * @param {String} [options.userId] - The login user id
   * @param {String} [options.sort] - Sort by createdAt, updatedAt or deletedAt
   * @param {String} [options.direction] - Sort direction (ASC,DSC)
   * @param {number} [options.offset] - Row offset for pagination
   * @param {number} [options.limit] - Row limit for pagination
   * @param {Boolean} [options.showdeleted] - Show deleted rows
   * @param {Boolean} [options.allValidData] - All valid records can be retrieved
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @returns {Object} An object containing an array of assets and a total items.
   * @memberof AssetsDbAdapter
   */
  async list(options, connection = null) {
    if (
      !(options.id && options.id.length) &&
      !options.siteId &&
      !options.allValidData
    ) {
      throw new GenericServerError('Missing required parameters')
    }

    const notExistsConnection = !connection
    try {
      const query = SQL`
        FROM assets AS ast
          LEFT OUTER JOIN users AS usr ON usr.id = ast.createdBy
      `

      const filter = { exists: false }
      options.id &&
        options.id.length &&
        addColumnFilter(
          query,
          {
            column: 'id',
            value: options.id
          },
          filter,
          'ast'
        )

      options.siteId && addSiteIdFilter(query, options, filter, 'ast')
      options.name && addAssetNameFilter(query, options, filter, 'ast')
      options.status && addAssetStatusFilter(query, options, filter, 'ast')
      options.category &&
        options.category.length &&
        addColumnFilter(
          query,
          {
            column: 'category',
            value: options.category
          },
          filter,
          'ast'
        )
      addShowNotDeletedFilter(query, options, filter, 'ast')

      const getDataQuery = SQL`
        SELECT
          ast.id,
          ast.contentId,
          ast.ehvAssetType,
          ast.ionAssetId,
          ast.ionType,
          ast.ionSourceType,
          ast.ionPercentComplete,
          ast.ionOnComplete,
          ast.name,
          ast.displayName,
          ast.status,
          ast.formatType,
          ast.category,
          ast.customPosition,
          ast.customStyle,
          ast.startDateTime,
          ast.endDateTime,
          ast.cesiumOptions,
          usr.firstName,
          usr.lastName,
          usr.id AS userId,
          usr.email,
          ast.createdAt,
          ast.updatedAt,
          ast.deletedAt
        ${query}
      `

      addPaginationFilter(getDataQuery, options, 'ast')

      const getTotalQuery = SQL`
        SELECT
          COUNT(ast.id) as totalItems
        ${query}
      `

      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      const result = await connection.query(getDataQuery)
      const [[{ totalItems }]] = await connection.query(getTotalQuery)

      return {
        items: result[0].map(mapAssetsFromDb),
        totalItems
      }
    } catch (e) {
      this.log.error(LOG_ERROR + e)
      throw new GenericServerError(e.message)
    } finally {
      notExistsConnection && connection?.release()
    }
  }

  /**
   * Get a asset by id,status...
   *
   * @param {Object} options
   * @param {String} options.id - The asset identifier
   * @param {String} options.siteId - The site identifier
   * @param {String} optinos.name - File name
   * @param {String} options.status - The asset status
   * @param {String} options.linkageFileName - External linkage file name
   * @param {String} options.ehvAssetType - EHV Asset Type
   * @param {Boolean} options.disableErrorResponse - Avoid returning 404 error responses
   * @param {String} options.errorMessageCode - error message code
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @returns {Object} A asset object
   * @memberof AssetsDbAdapter
   */
  async getAsset(options, connection) {
    const query = SQL`SELECT * FROM assets`

    let result
    try {
      const filter = { exists: false }
      addIdFilter(query, options, filter)
      if (options.siteId) {
        addSiteIdFilter(query, options, filter)
      }
      if (options.status) {
        addAssetStatusFilter(query, options, filter)
      }
      if (options.linkageFileName) {
        addLinkageFileNameFilter(query, options, filter)
      }
      if (options.name) {
        addAssetNameFilter(query, options, filter)
      }
      if (options.ehvAssetType) {
        addEhvAssetTypeFilter(query, options, filter)
      }
      addShowNotDeletedFilter(query, options, filter)

      result = connection
        ? await connection.query(query)
        : await this.mysql.query(query)
    } catch (e) {
      this.log.error(LOG_ERROR + e)
      throw new GenericServerError(e.message)
    }

    if (result[0].length === 0) {
      if (options.disableErrorResponse) {
        return null
      }

      const addMessage = generateMessage({
        id: options.id,
        siteId: options.siteId,
        status: options.status
      })
      const errorRes = Boom.notFound(`Cannot find asset with ${addMessage}`)
      if (options.errorMessageCode) {
        errorRes.output.payload.messageCode = options.errorMessageCode
      }
      throw errorRes
    }

    return result[0][0]
  }

  /**
   * Get assets records for space IDs linked to assets records for 3DTile
   *
   * @param {string} siteId
   * @param {string} assetId
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @throws {GenericServerError}
   * @memberof AssetsDbAdapter
   */
  async getLinkedAssetByTile(siteId, assetId, connection = null) {
    const query = SQL`
      SELECT * FROM assets WHERE assets.id = 
        (
          SELECT asts.linkedAssetId FROM assets AS ast
              JOIN assets_assets AS asts ON asts.assetId = ast.id
              JOIN contents AS conts ON conts.id = ast.contentId
              WHERE ast.id = ${assetId}
              AND ast.contentId = ${siteId}
        )
    `
    let result

    try {
      const filter = { exists: true }
      addShowNotDeletedFilter(query, {}, filter)

      const notExistsConnection = !connection
      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      result = connection
        ? await connection.query(query)
        : await this.mysql.query(query)
    } catch (e) {
      this.log.error(LOG_ERROR + e)
      throw new GenericServerError(e.message)
    }

    if (result[0].length === 0) {
      return null
    }

    return result[0][0]
  }

  /**
   * Obtain the assets record for 3DTile, which is the source of the assets record for spatial ID.
   *
   * @param {string} siteId
   * @param {string} userId
   * @param {string} assetId
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @throws {GenericServerError}
   * @memberof AssetsDbAdapter
   */
  async getLinkedAssetBySpaceId(siteId, userId, assetId, connection = null) {
    const query = SQL`
      SELECT * FROM assets WHERE assets.id = 
        (
          SELECT asts.assetId FROM assets AS ast
              JOIN assets_assets AS asts ON asts.assetId = ast.id
              JOIN contents AS conts ON conts.id = ast.contentId
              JOIN corporations AS corp ON corp.id = conts.corporationId
              JOIN users AS usr ON usr.corporationId = corp.id
              WHERE asts.linkedAssetId = ${assetId}
              AND ast.contentId = ${siteId}
              AND usr.id = ${userId}
        )
    `
    let result

    try {
      const filter = { exists: true }
      addShowNotDeletedFilter(query, {}, filter)

      const notExistsConnection = !connection
      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      result = connection
        ? await connection.query(query)
        : await this.mysql.query(query)
    } catch (e) {
      this.log.error(LOG_ERROR + e)
      throw new GenericServerError(e.message)
    }

    if (result[0].length === 0) {
      return null
    }

    return result[0][0]
  }

  /**
   * Get asset info and validation assets
   *
   * @param {Object} options
   * @param {String} options.siteId - The site identifier
   * @param {String} options.originName - The asset name
   * @param {String} options.category - Asset Classification
   * @param {String} options.formatType - Asset format type
   * @param {Object} options.cesiumOptions - Configuring CesiumIon Uploads
   * @param {Object} options.customPosition - Asset location information
   * @param {String} options.startDateTime - The asset start date and time
   * @param {String} options.endDateTime - The asset end date and time
   * @param {Boolean} options.isAddMessageCode - Additional messages when ERROR
   * @returns {Promise}
   * @memberof AssetsDbAdapter
   */
  async getAssetInfoAndValidation({
    siteId,
    originName,
    category,
    formatType,
    cesiumOptions,
    customPosition,
    startDateTime,
    endDateTime,
    isAddMessageCode = false
  }) {
    const { enableItems, isRegistrable } = await this.checkRegistrable({
      siteId
    })

    if (!isRegistrable) {
      const boomRes = Boom.conflict(ERROR_MESSAGES.ASSET_UPLOAD_LIMIT)
      if (isAddMessageCode) {
        boomRes.output.payload.messageCode = ERROR_MESSAGES.ASSET_UPLOAD_LIMIT
      }
      throw boomRes
    }

    const name = getUniqueName({
      originName,
      nameList: enableItems
        .filter(a => a.category === category)
        .map(a => a.name)
    })

    const assetInfo = new AssetInfo({
      name,
      category,
      formatType,
      cesiumOptions
    })
    const assetTypeInfo = assetInfo.get()
    if (!assetTypeInfo) {
      const boomRes = Boom.badRequest(
        `Bad file ${generateMessage({
          name,
          category,
          formatType,
          cesiumOptions
        })}`
      )
      if (isAddMessageCode) {
        boomRes.output.payload.messageCode =
          ERROR_MESSAGES.ASSET_UPLOAD_VALIDATION_FAILED
      }
      throw boomRes
    }

    this.validation({
      formatType,
      cesiumOptions,
      customPosition,
      startDateTime,
      endDateTime,
      isAddMessageCode
    })

    return assetInfo
  }

  /**
   * Update an existing asset
   *
   * @param {Object} options
   * @param {String|Array} options.id - The asset identifier
   * @param {String} options.siteId - The site identifier
   * @param {String} options.userId - The user identifier
   * @param {String} options.ionAssetId - The ion asset status
   * @param {String} options.ionOnComplete - json object for notification of upload completion to cesium-ion-api
   * @param {String} options.fileStorageNodeId - The node identifier
   * @param {String} options.conversionOperationId - The conversion operation identifier
   * @param {String} options.name - The asset name
   * @param {String} options.displayName - The asset display name
   * @param {String} options.startDateTime - The asset start date and time
   * @param {String} options.endDateTime - The asset end date and time
   * @param {String} options.status - The asset status
   * @param {String} options.category - Asset Classification
   * @param {String} options.formatType - Asset format type
   * @param {Object} options.customPosition - Asset location information
   * @param {String} options.ionType - Request parameters for cesium-ion-api
   * @param {String} options.ionSourceType - Request parameters for cesium-ion-api
   * @param {number} options.ionPercentComplete - Asset conversion progress 0-100
   * @param {string} options.updatedBy - Update User ID
   * @throws {GenericServerError} An unexpected server error
   * @throws {EntityNotFoundError} No matching asset found
   * @param {Object} [connection] - The optional mysql connection, used to force the same connection in the pool
   * @memberof AssetsDbAdapter
   */
  async updateAsset(
    {
      id,
      siteId,
      userId,
      ionAssetId,
      ionOnComplete,
      s3ObjectKey,
      name,
      displayName,
      startDateTime,
      endDateTime,
      status,
      category,
      formatType,
      customPosition,
      customStyle,
      ionType,
      ionSourceType,
      ionPercentComplete,
      updatedBy
    },
    connection
  ) {
    if (!id || !id.length) {
      throw new GenericServerError(
        'When you update the asset, you must have the id'
      )
    }

    const query = SQL`UPDATE assets SET `

    const updates = []

    if (ionAssetId || ionAssetId === 0) {
      updates.push(SQL` ionAssetId=${ionAssetId} `)
    }
    if (ionPercentComplete || ionAssetId === 0) {
      updates.push(SQL` ionPercentComplete=${ionPercentComplete}`)
    }

    ionOnComplete &&
      updates.push(SQL` ionOnComplete=${JSON.stringify(ionOnComplete)} `)
    s3ObjectKey && updates.push(SQL` s3ObjectKey=${s3ObjectKey} `)
    name && updates.push(SQL` name=${name} `)
    displayName && updates.push(SQL` displayName=${displayName} `)

    if (startDateTime === null) {
      updates.push(SQL` startDateTime=null `)
    } else {
      startDateTime &&
        updates.push(SQL` startDateTime=${new Date(startDateTime)} `)
    }
    if (endDateTime === null) {
      updates.push(SQL` endDateTime=null `)
    } else {
      endDateTime && updates.push(SQL` endDateTime=${new Date(endDateTime)} `)
    }

    status && updates.push(SQL`status=${status}`)
    category && updates.push(SQL` category=${category}`)
    formatType && updates.push(SQL` formatType=${formatType} `)
    customPosition &&
      updates.push(SQL` customPosition=${JSON.stringify(customPosition)} `)

    if (customStyle === null) {
      updates.push(SQL` customStyle=null `)
    } else {
      customStyle &&
        updates.push(SQL` customStyle=${JSON.stringify(customStyle)} `)
    }

    ionType && updates.push(SQL` ionType=${ionType} `)
    ionSourceType && updates.push(SQL` ionSourceType=${ionSourceType} `)
    ionPercentComplete &&
      updates.push(SQL` ionPercentComplete=${ionPercentComplete}`)
    updates.push(SQL` updatedAt=now() `)
    updatedBy && updates.push(SQL` updatedBy=${updatedBy} `)

    query.append(query.glue(updates, ' , '))
    query.append(SQL` WHERE deletedAt IS NULL `)

    const filter = { exists: true }
    siteId && addSiteIdFilter(query, { siteId }, filter)
    addColumnFilter(
      query,
      {
        column: 'id',
        value: id
      },
      filter
    )

    const notExistsConnection = !connection
    try {
      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      notExistsConnection && (await connection.query('START TRANSACTION'))
      const result = await connection.query(query)
      if (result[0].affectedRows === 0) {
        throw new EntityNotFoundError(`Cannot find asset with id ${id}`)
      }
      notExistsConnection && (await connection.query('COMMIT'))
      const { items } = await this.list({ id, siteId, userId }, connection)
      return items
    } catch (e) {
      notExistsConnection && (await connection.query('ROLLBACK'))
      if (e.name === 'EntityNotFound') {
        throw e
      }
      this.log.error(LOG_ERROR + e)
      throw new GenericServerError(e.message)
    } finally {
      notExistsConnection && connection?.release()
    }
  }

  /**
   * Add a new asset history
   *
   * @param {Object} options
   * @param {String|Array} options.assetId - The asset identifier
   * @param {Array} options.status - The asset status
   * @param {String} options.userId The user identifier
   * @returns {Object} The newly created asset history object
   * @param {Object} [connection] - The optional mysql connection, used to force the same connection in the pool
   * @throws {GenericServerError} An unexpected server error occurred
   * @memberof AssetsDbAdapter
   * @todo See if this method and corresponding route can be removed in favour of create
   */
  async addAssetHistory({ assetId, statuses, userId }, connection) {
    const notExistsConnection = !connection
    try {
      const ids = !isArray(assetId) ? [assetId] : assetId
      const columns = ['assetId', 'status', 'userId']
      const query = SQL`
      INSERT INTO assets_history
      ( ${SQL.unsafe(columns.join(', '))} )
      VALUES
      ( ${SQL.glue(
        ids.reduce((pre, id) => {
          statuses.forEach(sts => {
            pre.push(SQL.glue([SQL`${id}`, SQL`${sts}`, SQL`${userId}`], ', '))
          })
          return pre
        }, []),
        ` ),
          ( `
      )} )`

      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      notExistsConnection && (await connection.query('START TRANSACTION'))
      await connection.query(query)
      notExistsConnection && (await connection.query('COMMIT'))
    } catch (e) {
      this.log.error(LOG_ERROR + e)
      notExistsConnection && (await connection.query('ROLLBACK'))
      throw new GenericServerError(e.message)
    } finally {
      notExistsConnection && connection?.release()
    }
  }

  /**
   * Add including linked assets
   *
   * @param {Object} options
   * @param {String} options.siteId - The site identifier
   * @param {String} options.userId - The user identifier
   * @param {String} options.originName - The asset name (base)
   * @param {String} options.displayName - The asset display name
   * @param {String} options.category - Asset Classification
   * @param {String} options.formatType - Asset format type
   * @param {Object} options.customPosition - Asset location information
   * @param {String} options.startDateTime - The asset start date and time
   * @param {String} options.endDateTime - The asset end date and time
   * @param {Object} options.cesiumOptions - Configuring CesiumIon Uploads
   * @param {Boolean} options.isSpace - Whether or not to register additional space IDs?
   * @param {Boolean} options.isAddMessageCode - Additional messages when ERROR
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @throws {GenericServerError}
   * @memberof AssetsDbAdapter
   */
  async addIncludingLinkedData(
    {
      siteId,
      userId,
      originName,
      displayName = null,
      category,
      formatType,
      customPosition = null,
      customStyle = null,
      startDateTime = null,
      endDateTime = null,
      cesiumOptions,
      isSpace,
      isAddMessageCode = false
    },
    connection = null
  ) {
    const mainHandler = async () => {
      const getName = async (siteId, name, ehvAssetType) => {
        const sameNameAsset = await this.getAsset({
          siteId,
          name,
          ehvAssetType,
          disableErrorResponse: true
        })

        if (!sameNameAsset) {
          return name
        }

        const extname = path.extname(originName)
        const baseName = path.basename(originName, path.extname(originName))
        const timeStamp = Date.now()
        return `${baseName}_${timeStamp}${extname}`
      }

      const assetInfo = await this.getAssetInfoAndValidation({
        siteId,
        originName,
        category,
        formatType,
        cesiumOptions,
        customPosition,
        startDateTime,
        endDateTime,
        isAddMessageCode
      })

      if (!assetInfo) {
        throw Boom.badRequest()
      }

      const insertAssets = []
      const insertAssetsAssets = []

      const tileAssetId = getUuid()
      let spaceAssetId = null

      insertAssets.push({
        id: tileAssetId,
        contentId: siteId,
        ehvAssetType: EHV_ASSET_TYPE.EHV_TILE,
        ionAssetId: null,
        ionOnComplete: null,
        s3ObjectKey: null,
        name: await getName(siteId, originName, EHV_ASSET_TYPE.EHV_TILE),
        displayName,
        status: ASSET_STATUS.S3_UPLOAD_WAIT,
        category,
        formatType,
        customPosition,
        customStyle,
        linkageFileName: null,
        isSpace: false,
        isApproval: null,
        ionType: assetInfo.assetInfo.cesiumIon.type,
        ionSourceType: assetInfo.assetInfo.cesiumIon.sourceType,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        cesiumOptions: assetInfo.cesiumOptions,
        createdBy: userId,
        updatedBy: userId
      })

      if (isSpace) {
        spaceAssetId = getUuid()

        insertAssets.push({
          id: spaceAssetId,
          contentId: siteId,
          ehvAssetType: EHV_ASSET_TYPE.EHV_SPACE_INFO,
          ionAssetId: null,
          ionOnComplete: null,
          s3ObjectKey: null,
          name: await getName(
            siteId,
            originName,
            EHV_ASSET_TYPE.EHV_SPACE_INFO
          ),
          displayName,
          status: ASSET_STATUS.S3_UPLOAD_WAIT,
          category: ASSET_CATEGORY.DESIGN_FILE,
          formatType: ASSET_FORMAT_TYPE.GLTF,
          customPosition,
          customStyle,
          linkageFileName: null,
          isSpace: true,
          isApproval: null,
          ionType: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
          ionSourceType: CESIUM_ION_API_TYPE_INFO.SOURCE_TYPE.TILES3D,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
          cesiumOptions: {
            tilesetJsonPath: '/tileset.json'
          },
          createdBy: userId,
          updatedBy: userId
        })

        insertAssetsAssets.push({
          id: getUuid(),
          contentId: siteId,
          assetId: tileAssetId,
          linkedAssetId: spaceAssetId,
          type: LINKED_ASSET_TYPE.SPATIAL_ID,
          createdBy: userId,
          updatedBy: userId
        })
      }

      const notExistsConnection = !connection
      try {
        connection = notExistsConnection
          ? await this.mysql.getConnection()
          : connection

        notExistsConnection && (await connection.query('START TRANSACTION'))

        insertAssets.length && (await this.bulkInsert(insertAssets, connection))

        insertAssetsAssets.length &&
          (await this.fastify.dbAdapters.assetsAssets.bulkInsert(
            insertAssetsAssets,
            connection
          ))

        notExistsConnection && (await connection.query('COMMIT'))

        try {
          this.addAssetHistory({
            assetId: tileAssetId,
            statuses: [ASSET_STATUS.S3_UPLOAD_WAIT],
            userId: userId
          })

          if (isSpace) {
            this.addAssetHistory({
              assetId: spaceAssetId,
              statuses: [ASSET_STATUS.S3_UPLOAD_WAIT],
              userId: userId
            })
          }
        } catch (e) {
          // Continue processing
        }

        return mapAssetsFromDb(
          await this.getAsset({ id: tileAssetId }, connection)
        )
      } catch (e) {
        this.log.error(LOG_ERROR + e)
        notExistsConnection && (await connection.query('ROLLBACK'))
        throw e
      } finally {
        notExistsConnection && connection?.release()
      }
    }

    return this.fastify.dbAdapters.processingStatusManagements.exclusionControl(
      {
        processingType: PROCESSING_TYPE.ASSET_CREATE,
        resourceCategory: RESOURCE_CATEGORY.SITE,
        resourceValue: siteId
      },
      mainHandler,
      () => {
        throw Boom.conflict(ERROR_MESSAGES.ASSET_CONCURRENT_ACCESS)
      }
    )
  }

  /**
   * Update an existing asset and add history
   *
   * @param {Object} options
   * @param {String|Array} options.id - The asset identifier
   * @param {String} options.siteId - The site identifier
   * @param {String} options.ionAssetId - The ion asset status
   * @param {number} options.ionPercentComplete - cesium-ion asset conversion progress rate
   * @param {String} options.ionOnComplete - json object for notification of upload completion to cesium-ion-api
   * @param {String} options.fileStorageNodeId - The node identifier
   * @param {String} options.conversionOperationId - The conversion operation identifier
   * @param {String} options.name - The asset name
   * @param {String} options.displayName - The asset display name
   * @param {String} options.status - The asset status
   * @param {String} options.category - Asset Classification
   * @param {String} options.formatType - Asset format type
   * @param {String} options.ionType - Request parameters for cesium-ion-api
   * @param {String} options.ionSourceType - Request parameters for cesium-ion-api
   * @param {String} options.userId - The user identifier
   * @param {String} options.historyStatus - Asset status to set in tracking log
   * @param {boolean} options.isUpdateCesiumIonToken - Whether to update the asset reference range for CesiumIon tokens
   * @throws {GenericServerError} An unexpected server error
   * @throws {EntityNotFoundError} No matching asset found
   * @memberof AssetsDbAdapter
   */
  async updateAssetAndHistory(
    {
      id,
      siteId,
      ionAssetId = '',
      ionPercentComplete = '',
      ionOnComplete = null,
      s3ObjectKey = '',
      name = '',
      displayName = '',
      status,
      category = '',
      formatType = '',
      ionType = '',
      ionSourceType = '',
      userId,
      historyStatus,
      isUpdateCesiumIonToken = false
    },
    connection = null
  ) {
    const notExistsConnection = !connection
    try {
      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      notExistsConnection && (await connection.query('START TRANSACTION'))

      await this.updateAsset(
        {
          id,
          siteId,
          userId,
          ionAssetId,
          ionPercentComplete,
          ionOnComplete,
          s3ObjectKey,
          name,
          displayName,
          status,
          category,
          formatType,
          ionType,
          ionSourceType,
          updatedBy: userId
        },
        connection
      )

      await this.addAssetHistory(
        {
          assetId: id,
          statuses: historyStatus,
          userId
        },
        connection
      )

      if (status === ASSET_STATUS.DELETE_COMPLETE) {
        await this.delete({ id, siteId, userId }, connection)
      }

      if (isUpdateCesiumIonToken && this.fastify.config.asset.cesiumIon.token) {
        const assets = await this.list(
          {
            siteId,
            status: ASSET_STATUS.CONVERTED
          },
          connection
        )
        const assetIds = assets.items.map(a => a.ionAssetId)
        const tokenIds = await this.fastify.dbAdapters.sites.getCesiumIonTokenIds(
          { id: siteId }
        )
        tokenIds &&
          tokenIds.length &&
          (await Promise.all(
            tokenIds.map(tokenId =>
              cesiumIonApi.modifyToken({
                baseUrl: this.fastify.config.asset.cesiumIon.host,
                accessToken: this.fastify.config.asset.cesiumIon.token,
                tokenId,
                assetIds
              })
            )
          ))
      }

      notExistsConnection && (await connection.query('COMMIT'))
    } catch (e) {
      this.log.error(LOG_ERROR + e)
      notExistsConnection && (await connection.query('ROLLBACK'))
      throw e
    } finally {
      notExistsConnection && connection?.release()
    }
  }

  /**
   * File upload process from front desk
   *
   * @param {string} siteId
   * @param {string} userId
   * @param {string} assetId
   * @param {byte[]} fileByteArray
   * @param {number} fileLength
   * @returns
   * @memberof AssetsDbAdapter
   */
  async upload(siteId, userId, assetId, fileByteArray, fileLength) {
    const configAsset = this.fastify.config.asset

    const tileAsset = await this.getAsset({
      id: assetId,
      siteId,
      status: ASSET_STATUS.S3_UPLOAD_WAIT,
      errorMessageCode: ASSET_UPLOAD_NOT_FOUND
    })

    const spaceAsset = await this.getLinkedAssetByTile(siteId, assetId)

    try {
      const tileFileName = `${tileAsset.contentId}_${tileAsset.id}_${tileAsset.name}`
      const tileS3Key = `${configAsset.vs.input.prefix}/${tileFileName}`

      await this.uploadFileS3(configAsset.vs.input, {
        key: tileS3Key,
        body: fileByteArray,
        length: fileLength
      })
      await this.updateAssetAndHistory({
        id: tileAsset.id,
        siteId,
        s3ObjectKey: tileFileName,
        status: ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS,
        userId,
        historyStatus: [ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS]
      })
    } catch (e) {
      await this.updateAssetAndHistory({
        id: tileAsset.id,
        siteId,
        status: ASSET_STATUS.S3_VIRUS_SCAN_UPLOAD_ERROR,
        userId,
        historyStatus: [ASSET_STATUS.S3_VIRUS_SCAN_UPLOAD_ERROR]
      })

      throw e
    }

    if (spaceAsset) {
      try {
        const spaceFileName = `${spaceAsset.contentId}_${spaceAsset.id}_${spaceAsset.name}`
        const spaceS3Key = `${configAsset.vs.input.prefix}/${spaceFileName}`

        await this.uploadFileS3(configAsset.vs.input, {
          key: spaceS3Key,
          body: fileByteArray,
          length: fileLength
        })
        await this.updateAssetAndHistory({
          id: spaceAsset.id,
          siteId,
          s3ObjectKey: spaceFileName,
          status: ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS,
          userId,
          historyStatus: [ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS]
        })
      } catch (e) {
        await this.updateAssetAndHistory({
          id: tileAsset.id,
          siteId,
          status: ASSET_STATUS.S3_VIRUS_SCAN_UPLOAD_ERROR,
          userId,
          historyStatus: [ASSET_STATUS.S3_VIRUS_SCAN_UPLOAD_ERROR]
        })

        throw e
      }
    }

    await this.notification({
      code: NOTIFICATION_MESSAGES.ASSET_UPLOAD_COMPLETE,
      assetId: tileAsset.id,
      siteId: tileAsset.contentId,
      userId: tileAsset.createdBy
    }).catch(err => this.log.error(err))
  }

  /**
   * Delete the asset
   *
   * @param {string} siteId
   * @param {string} userId
   * @param {string} assetId
   * @param {boolean} isThrowException Throws an exception when an error occurs
   * @memberof AssetsDbAdapter
   */
  async deleteAsset(siteId, userId, assetId, isThrowException = false) {
    const asset = await this.getAsset({
      id: assetId,
      siteId,
      userId,
      status: [
        ASSET_STATUS.S3_UPLOAD_WAIT,
        ASSET_STATUS.S3_UPLOAD_COMPLETE,
        ASSET_STATUS.S3_UPLOAD_COMPLETE_TO_CONVERT_TOOL,
        ASSET_STATUS.S3_UPLOAD_ERROR,
        ASSET_STATUS.S3_UPLOAD_ERROR_TO_CONVERT_TOOL,
        ASSET_STATUS.CONVERTING,
        ASSET_STATUS.CONVERTED,
        ASSET_STATUS.CONVERTED,
        ASSET_STATUS.CONVERT_ERROR
      ]
    })

    const check = new Date(asset.updatedAt)
    const now = new Date()
    const diff = now.getTime() - check.getTime()

    if (
      [
        ASSET_STATUS.S3_UPLOAD_WAIT,
        ASSET_STATUS.S3_UPLOAD_COMPLETE,
        ASSET_STATUS.S3_UPLOAD_COMPLETE_TO_CONVERT_TOOL,
        ASSET_STATUS.CONVERTING
      ].includes(asset.status) &&
      diff <= this.fastify.config.asset.ehv.availableTime
    ) {
      if (isThrowException) {
        throw new Error(`Cannot be deleted due to processing.(id: ${assetId})`)
      } else {
        throw Boom.badRequest(
          `Cannot be deleted due to processing.(id: ${assetId})`
        )
      }
    }

    await this.updateAssetAndHistory({
      id: asset.id,
      siteId,
      userId,
      status: ASSET_STATUS.DELETE_WAIT,
      historyStatus: [ASSET_STATUS.DELETE_WAIT],
      isUpdateCesiumIonToken: true
    })
  }

  /**
   * Delete asset
   *
   * @param {Object} options
   * @param {String} options.id - The asset identifier
   * @param {String} options.siteId - The site identifier
   * @param {String} options.status - The asset status
   * @param {String} options.userId - The user identifier
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @throws {GenericServerError}
   * @throws {EntityNotFoundError}
   * @memberof AssetsDbAdapter
   */
  async delete({ id, siteId, status, userId }, connection = null) {
    const query = SQL`UPDATE assets SET `

    const updates = []

    status && updates.push(SQL` status=${status}`)
    updates.push(SQL` updatedAt=now() `)
    updates.push(SQL` deletedAt=now() `)

    query.append(query.glue(updates, ' , '))
    query.append(SQL` WHERE deletedAt IS NULL `)

    addIdFilter(query, { id }, { exists: true })
    addColumnFilter(
      query,
      {
        column: 'id',
        value: id
      },
      { exists: true }
    )

    const notExistsConnection = !connection
    try {
      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      notExistsConnection && (await connection.query('START TRANSACTION'))
      const result = await connection.query(query)
      if (result[0].affectedRows === 0) {
        throw new EntityNotFoundError(`Cannot find assets with id ${id}`)
      }

      const target = id
        ? [
            { siteId, assetId: id, userId },
            { siteId, linkedAssetId: id, userId }
          ]
        : [{ siteId, userId }]

      await Promise.allSettled(
        target.map(t =>
          this.fastify.dbAdapters.assetsAssets
            .delete(t, connection)
            .catch(e => {
              if (e.name !== 'EntityNotFound') {
                return e
              }
            })
        )
      )

      notExistsConnection && (await connection.query('COMMIT'))
    } catch (e) {
      notExistsConnection && (await connection.query('ROLLBACK'))
      if (e.name === 'EntityNotFound') {
        throw e
      }
      this.log.error(LOG_ERROR + e)
      throw new GenericServerError(e.message)
    } finally {
      notExistsConnection && connection?.release()
    }
  }

  /**
   * Delete asset by site identifier
   *
   * @param {Object} options
   * @param {String} options.siteId - The site identifier
   * @param {String} options.userId - The user identifier
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @throws {GenericServerError}
   * @throws {EntityNotFoundError}
   * @memberof AssetsDbAdapter
   */
  async deleteBySiteId({ siteId, userId }, connection = null) {
    const notExistsConnection = !connection
    try {
      const { items } = await this.list({ siteId, userId })
      const targetAssets = items.filter(
        i =>
          ![ASSET_STATUS.DELETE_WAIT, ASSET_STATUS.DELETE_COMPLETE].includes(
            i.status
          )
      )
      if (targetAssets.length === 0) {
        return
      }

      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      notExistsConnection && (await connection.query('START TRANSACTION'))
      let errors = []
      errors = await Promise.all(
        targetAssets.map(asset =>
          this.updateAssetAndHistory(
            {
              id: asset.id,
              siteId,
              status: ASSET_STATUS.DELETE_WAIT,
              historyUserId: userId,
              historyStatus: [ASSET_STATUS.DELETE_WAIT]
            },
            connection
          ).catch(e => {
            this.log.error(e)
            if (e.name !== 'EntityNotFound') {
              return e
            }
          })
        )
      )
      errors = errors.filter(e => e)
      if (errors.length) {
        throw errors
      }
      notExistsConnection && (await connection.query('COMMIT'))
    } catch (e) {
      notExistsConnection && (await connection.query('ROLLBACK'))
      if (e.name === 'EntityNotFound') {
        throw e
      }
      this.log.error(LOG_ERROR + e)
      throw new GenericServerError(e.message)
    } finally {
      notExistsConnection && connection?.release()
    }
  }

  /**
   * Delete assets from DB and LLFS
   *
   * @param {Object} options
   * @param {String} options.accessToken - Access token
   * @param {Array} options.ids - The multiple asset identifier
   * @param {String} options.siteId - The site identifier
   * @param {String} options.userId - The user identifier
   * @memberof AssetsDbAdapter
   */
  async deleteMultiple({ accessToken, ids, siteId, userId }) {
    const result = {
      isNotification: false,
      isUpdateDataset: false,
      errors: []
    }

    try {
      const { items } = await this.list({
        id: ids,
        siteId,
        status: [
          ASSET_STATUS.S3_UPLOAD_WAIT,
          ASSET_STATUS.S3_UPLOAD_COMPLETE,
          ASSET_STATUS.S3_UPLOAD_COMPLETE_TO_CONVERT_TOOL,
          ASSET_STATUS.CONVERTING,
          ASSET_STATUS.CONVERTED
        ],
        userId
      })

      if (items.length === 0 || ids.length !== items.length) {
        const addMessage = generateMessage({ id: ids, siteId })
        throw Boom.notFound(`Cannot find asset with ${addMessage}`)
      }

      const now = new Date()
      const psrArr = await Promise.allSettled(
        items.map(async asset => {
          const check = new Date(asset.updatedAt)
          const diff = now.getTime() - check.getTime()

          if (
            [ASSET_STATUS.S3_UPLOAD_WAIT, ASSET_STATUS.CONVERTING].includes(
              asset.status
            ) &&
            diff <= this.fastify.config.asset.availableTime
          ) {
            throw Boom.badRequest(
              `Cannot be deleted due to processing.(id: ${asset.id})`
            )
          }

          await this.updateAssetAndHistory({
            id: asset.id,
            siteId,
            status: ASSET_STATUS.DELETE_WAIT,
            historyUserId: userId,
            historyStatus: [ASSET_STATUS.DELETE_WAIT],
            isUpdateCesiumIonToken: true
          })

          result.isNotification = true
          result.isUpdateDataset = true
        })
      )

      const errors = psrArr.filter(r => r.status === 'rejected')
      if (errors.length) {
        throw errors.map(e => e.reason)
      }
    } catch (e) {
      if (isArray(e)) {
        result.errors = e
      } else {
        result.errors.push(e)
      }
    }

    return result
  }

  /**
   * Asset Batch
   *
   * @memberof AssetsDbAdapter
   */
  async proceed() {
    const configAsset = this.fastify.config.asset
    let connection
    let assets
    try {
      const options = {
        status: [
          ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS,
          ASSET_STATUS.S3_UPLOAD_COMPLETE,
          ASSET_STATUS.S3_UPLOAD_COMPLETE_TO_CONVERT_TOOL,
          ASSET_STATUS.S3_COPY_COMPLETE_FROM_CONVERT_TOOL,
          ASSET_STATUS.CONVERTING,
          ASSET_STATUS.DELETE_WAIT
        ]
      }
      const query = SQL`SELECT * FROM assets`
      const filter = { exists: false }
      addAssetStatusFilter(query, options, filter)
      addShowNotDeletedFilter(query, options, filter)

      connection = await this.mysql.getConnection()
      const result = await connection.query(query)
      assets = result[0]
    } catch (e) {
      this.internalBatchOutputLog(
        BATCH_LOG_LEVEL.ERROR,
        'DB connection failed.',
        null,
        e
      )
      throw new GenericServerError(e.message)
    } finally {
      connection?.release()
    }

    let registrationCount = assets.filter(
      asset => asset.status === ASSET_STATUS.CONVERTING
    ).length

    try {
      await stsClient?.assume(true)
    } catch (e) {
      this.internalBatchOutputLog(
        BATCH_LOG_LEVEL.ERROR,
        'Credential update failed.',
        null,
        e
      )
      throw new GenericServerError(e.message)
    }

    for (const asset of assets) {
      switch (asset.status) {
        case ASSET_STATUS.S3_VIRUS_SCAN_IN_PROGRESS:
          await this.internalBatchVirusScanResultCheck(asset)
          break
        case ASSET_STATUS.S3_UPLOAD_COMPLETE:
          if (registrationCount < configAsset.ehv.assetBatchConvertLimit) {
            await this.internalBatchCesiumIonCreateAsset(asset)
            registrationCount++
          }
          break
        case ASSET_STATUS.S3_UPLOAD_COMPLETE_TO_CONVERT_TOOL:
          await this.internalBatchGetConvertedSpaceInfoFile(asset)
          break
        case ASSET_STATUS.S3_COPY_COMPLETE_FROM_CONVERT_TOOL:
          if (registrationCount < configAsset.ehv.assetBatchConvertLimit) {
            await this.internalBatchCesiumIonCreateAsset(asset)
            registrationCount++
          }
          break
        case ASSET_STATUS.CONVERTING:
          await this.internalBatchCheckAssetConvertingProgress(asset)
          break
        case ASSET_STATUS.DELETE_WAIT:
          await this.internalBatchDeleteAsset(asset)
          break
        default:
          this.internalBatchOutputLog(
            BATCH_LOG_LEVEL.ERROR,
            'Invalid asset status.',
            {
              assetId: asset.id,
              status: asset.status
            }
          )
      }
    }

    const externalLinkList = [
      {
        ehvAssetType: EHV_ASSET_TYPE.EXTERNAL_TILE_AF,
        sourcePrefix: configAsset.b2.prefixes.tile.approval.after,
        destPrefix: configAsset.ehv.prefixes.tile.cityGml.input,
        assetFormatType: ASSET_FORMAT_TYPE.GLTF,
        assetCategory: ASSET_CATEGORY.DESIGN_FILE,
        ionType: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
        ionSourceType: CESIUM_ION_API_TYPE_INFO.SOURCE_TYPE.TILES3D,
        cesiumOptions: {
          tilesetJsonPath: '/tileset.json'
        },
        isSpace: null,
        isApproval: true
      },
      {
        ehvAssetType: EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_BE,
        sourcePrefix: configAsset.b2.prefixes.spaceInfo.approval.before,
        destPrefix: configAsset.ehv.prefixes.spaceInfo.input.approval.before,
        assetFormatType: ASSET_FORMAT_TYPE.GLTF,
        assetCategory: ASSET_CATEGORY.DESIGN_FILE,
        ionType: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
        ionSourceType: CESIUM_ION_API_TYPE_INFO.SOURCE_TYPE.TILES3D,
        cesiumOptions: {
          tilesetJsonPath: '/tileset.json'
        },
        isSpace: true,
        isApproval: false
      },
      {
        ehvAssetType: EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_AF,
        sourcePrefix: configAsset.b2.prefixes.spaceInfo.approval.after,
        destPrefix: configAsset.ehv.prefixes.spaceInfo.input.approval.after,
        assetFormatType: ASSET_FORMAT_TYPE.GLTF,
        assetCategory: ASSET_CATEGORY.DESIGN_FILE,
        ionType: CESIUM_ION_API_TYPE_INFO.TYPE.TILES3D,
        ionSourceType: CESIUM_ION_API_TYPE_INFO.SOURCE_TYPE.TILES3D,
        cesiumOptions: {
          tilesetJsonPath: '/tileset.json'
        },
        isSpace: true,
        isApproval: true
      }
    ]

    for await (const target of externalLinkList) {
      await this.internalBatchUpsertExternalLinkFile(target)
    }
  }

  /**
   * Batch internal processing: Processing when CesiumIson asset conversion processing fails
   *
   * @param {Object} asset assets record
   * @param {string} errorFilePrefix Error File Prefix
   */
  async internalBatchAssetConvertFailedProcess(asset, errorFilePrefix) {
    const configAsset = this.fastify.config.asset

    const errorFileKey =
      errorFilePrefix +
      `/${asset.contentId}/${asset.id}/` +
      path.basename(asset.s3ObjectKey)
    await copyObject(configAsset.ehv, {
      sourceObjectKey: configAsset.ehv.bucket + '/' + asset.s3ObjectKey,
      destObjectKey: errorFileKey
    })
    await deleteObject(configAsset.ehv, {
      key: asset.s3ObjectKey
    })

    await this.updateAssetAndHistory({
      id: asset.id,
      siteId: asset.contentId,
      s3ObjectKey: errorFileKey,
      status: ASSET_STATUS.CONVERT_ERROR,
      historyStatus: [ASSET_STATUS.CONVERT_ERROR],
      userId: configAsset.ehv.systemUserId
    })

    await this.notification({
      code: NOTIFICATION_MESSAGES.ASSET_CONVERT_ERROR,
      assetId: asset.id,
      siteId: asset.contentId,
      userId: asset.createdBy
    }).catch(err =>
      this.internalBatchOutputLog(
        BATCH_LOG_LEVEL.ERROR,
        'An exception error occurred during the asset conversion failure processing.',
        null,
        err
      )
    )
  }

  /**
   * Batch internal processing: Check virus scan results
   * @param {Object} asset Asset Record
   */
  async internalBatchVirusScanResultCheck(asset) {
    const configAsset = this.fastify.config.asset

    try {
      const resultOkKey = `${configAsset.vs.result.ok.prefix}/${asset.s3ObjectKey}`
      const resultOk = await getStreamAndHeader(configAsset.vs.result.ok, {
        key: resultOkKey
      })

      if (resultOk.code === 200) {
        const body = await resultOk.fileStream.Body.transformToByteArray()
        let destKey
        let status

        if (asset.isSpace) {
          destKey = `${configAsset.ehv.prefixes.convertTool.input}/${asset.s3ObjectKey}`
          status = ASSET_STATUS.S3_UPLOAD_COMPLETE_TO_CONVERT_TOOL
        } else {
          destKey = `${configAsset.ehv.prefixes.tile.las.input}/${asset.contentId}/${asset.id}/${asset.name}`
          status = ASSET_STATUS.S3_UPLOAD_COMPLETE
        }

        await this.uploadFileS3(configAsset.ehv, {
          key: destKey,
          body: body,
          length: resultOk.header.contentLength
        })
        await deleteObject(configAsset.vs.result.ok, { key: resultOkKey })

        await this.updateAssetAndHistory({
          id: asset.id,
          s3ObjectKey: destKey,
          status,
          userId: configAsset.ehv.systemUserId,
          historyStatus: [status]
        })
      }
    } catch (e) {
      this.internalBatchOutputLog(
        BATCH_LOG_LEVEL.ERROR,
        'An exception error occurred when checking the virus scan result.',
        {
          assetId: asset.id
        },
        e
      )
    }

    try {
      const resultNgKey = `${configAsset.vs.result.ng.prefix}/${asset.s3ObjectKey}`
      const resultNg = await getStreamAndHeader(configAsset.vs.result.ng, {
        key: resultNgKey
      })

      if (resultNg.code === 200) {
        await this.updateAssetAndHistory({
          id: asset.id,
          status: ASSET_STATUS.S3_VIRUS_SCAN_RESULT_NG,
          userId: configAsset.ehv.systemUserId,
          historyStatus: [ASSET_STATUS.S3_VIRUS_SCAN_RESULT_NG]
        })

        await this.notification({
          code: NOTIFICATION_MESSAGES.ASSET_CONVERT_ERROR,
          assetId: asset.id,
          siteId: asset.contentId,
          userId: asset.createdBy
        })
      }
    } catch (e) {
      this.internalBatchOutputLog(
        BATCH_LOG_LEVEL.ERROR,
        'An exception error occurred when checking the virus scan result.',
        {
          assetId: asset.id
        },
        e
      )
    }
  }

  /**
   * Batch internal processing: Register assets to CesiumIon
   * @param {Object} asset Asset Record
   */
  async internalBatchCesiumIonCreateAsset(asset) {
    const configAsset = this.fastify.config.asset
    const configEhv = configAsset.ehv
    const assetInfo = new AssetInfo({
      name: asset.name,
      category: asset.category,
      formatType: asset.formatType,
      cesiumOptions: asset.cesiumOptions,
      bucket: configEhv.bucket,
      assetKey: asset.s3ObjectKey
    })

    let cesiumIonCreateAssetRespone
    let cesiumIonCreateAssetResponeBody

    try {
      cesiumIonCreateAssetRespone = await cesiumIonApi.createAsset(
        this.fastify,
        assetInfo.generateCesiumIonCreateAssetBody(await configEhv.assumeRole())
      )

      if (cesiumIonCreateAssetRespone.status !== 200) {
        throw new Error(
          'Request to the CesiumIon Asset Creation API failed.' +
            JSON.stringify({
              assetInfo: {
                id: asset.id,
                contentId: asset.contentId
              },
              cesiumIonResponse: {
                statusCode: cesiumIonCreateAssetRespone.status,
                body: null
              }
            })
        )
      }

      cesiumIonCreateAssetResponeBody = await cesiumIonCreateAssetRespone.json()
    } catch (e) {
      this.internalBatchOutputLog(
        BATCH_LOG_LEVEL.ERROR,
        'An exception error occurred during the asset creation process.',
        null,
        e
      )

      try {
        await this.internalBatchAssetConvertFailedProcess(
          asset,
          asset.formatType === ASSET_FORMAT_TYPE.LASER
            ? configAsset.ehv.prefixes.tile.las.error
            : configAsset.ehv.prefixes.tile.cityGml.error
        )
      } catch (e) {
        this.internalBatchOutputLog(
          BATCH_LOG_LEVEL.ERROR,
          'An exception error occurred during the asset conversion failure processing.',
          null,
          e
        )
      }
      return
    }

    await this.updateAssetAndHistory({
      id: asset.id,
      siteId: asset.contentId,
      ionAssetId: cesiumIonCreateAssetResponeBody.assetMetadata.id,
      ionSourceType: assetInfo.sourceType,
      ionType: cesiumIonCreateAssetResponeBody.assetMetadata.type,
      ionPercentComplete:
        cesiumIonCreateAssetResponeBody.assetMetadata.percentComplete,
      status: ASSET_STATUS.CONVERTING,
      historyStatus: [ASSET_STATUS.CONVERTING],
      userId: configAsset.ehv.systemUserId
    })
  }

  /**
   * Batch internal processing: Register assets to CesiumIon
   * @param {Object} asset Asset Record
   */
  async internalBatchCheckAssetConvertingProgress(asset) {
    const configAsset = this.fastify.config.asset

    let cesiumIonGetAssetInfoResponse
    let cesiumIonGetAssetInfoResponseBody

    const check = new Date(asset.updatedAt)
    const now = new Date()
    const diff = now.getTime() - check.getTime()
    if (diff > this.fastify.config.asset.ehv.availableTime) {
      try {
        await this.deleteAsset(
          asset.contentId,
          configAsset.ehv.systemUserId,
          asset.id,
          true
        )
      } catch (e) {
        this.internalBatchOutputLog(
          BATCH_LOG_LEVEL.ERROR,
          'Conversion Failed to delete assets failed.',
          null,
          e
        )
      }
      return
    }

    try {
      cesiumIonGetAssetInfoResponse = await cesiumIonApi.getAssetInfo(
        this.fastify,
        asset.ionAssetId
      )

      if (cesiumIonGetAssetInfoResponse.status !== 200) {
        throw new Error(
          'Request to the CesiumIon Asset Information API failed.' +
            JSON.stringify({
              assetInfo: {
                id: asset.id,
                contentId: asset.contentId
              },
              cesiumIonResponse: {
                statusCode: cesiumIonGetAssetInfoResponse.status,
                body: null
              }
            })
        )
      }

      cesiumIonGetAssetInfoResponseBody = await cesiumIonGetAssetInfoResponse.json()

      switch (cesiumIonGetAssetInfoResponseBody.status) {
        case cesiumIonApi.STATUS.COMPLETE:
          await this.updateAssetAndHistory({
            id: asset.id,
            siteId: asset.contentId,
            ionPercentComplete:
              cesiumIonGetAssetInfoResponseBody.percentComplete,
            status: ASSET_STATUS.CONVERTED,
            historyStatus: [ASSET_STATUS.CONVERTED],
            userId: configAsset.ehv.systemUserId,
            isUpdateCesiumIonToken: true
          })

          await this.notification({
            code: NOTIFICATION_MESSAGES.ASSET_CONVERT_SUCCESS,
            assetId: asset.id,
            siteId: asset.contentId,
            userId: asset.createdBy
          }).catch(err => this.log.error(LOG_ERROR + err))
          break

        case cesiumIonApi.STATUS.IN_PROGRESS:
          await this.updateAsset({
            id: asset.id,
            siteId: asset.contentId,
            ionPercentComplete:
              cesiumIonGetAssetInfoResponseBody.percentComplete,
            updatedBy: configAsset.ehv.systemUserId
          })
          break

        case cesiumIonApi.STATUS.DATA_ERROR:
        case cesiumIonApi.STATUS.ERROR:
          let prefix
          switch (asset.ehvAssetType) {
            case EHV_ASSET_TYPE.EHV_TILE:
              prefix = configAsset.ehv.prefixes.tile.las.error
              break
            case EHV_ASSET_TYPE.EHV_SPACE_INFO:
              prefix = configAsset.ehv.prefixes.tile.las.error
              break
            case EHV_ASSET_TYPE.EXTERNAL_TILE_BE:
            case EHV_ASSET_TYPE.EXTERNAL_TILE_AF:
              prefix = configAsset.ehv.prefixes.tile.cityGml.error
              break
            case EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_BE:
              prefix = configAsset.ehv.prefixes.spaceInfo.error.approval.before
              break
            case EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_AF:
              prefix = configAsset.ehv.prefixes.spaceInfo.error.approval.after
              break
          }
          await this.internalBatchAssetConvertFailedProcess(asset, prefix)
          break
      }
    } catch (e) {
      this.internalBatchOutputLog(
        BATCH_LOG_LEVEL.ERROR,
        'An exception error occurred while checking the asset conversion progress.',
        null,
        e
      )
    }
  }

  /**
   * Batch internal processing: Attempt to retrieve the conversion tool output file
   *
   * @param {Object} asset Asset Record
   */
  async internalBatchGetConvertedSpaceInfoFile(asset) {
    const configAsset = this.fastify.config.asset
    const destFileName = path.basename(asset.name, '.las') + '.zip'
    const convertedFilename = `${asset.contentId}_${asset.id}_${destFileName}`
    const sourceKey = `${configAsset.b2.prefixes.convertTool.output}/${convertedFilename}`

    try {
      const convertedFileObject = await getStreamAndHeader(configAsset.b2, {
        key: sourceKey
      })

      if (convertedFileObject.code === 200 && convertedFileObject.fileStream) {
        const destKey = `${configAsset.ehv.prefixes.tile.las.input}/${asset.contentId}/${asset.id}/${destFileName}`
        await copyObject(configAsset.ehv, {
          sourceObjectKey: `${configAsset.b2.bucket}/${sourceKey}`,
          destObjectKey: destKey
        })

        await deleteObject(configAsset.b2, {
          key: sourceKey
        })

        await this.updateAssetAndHistory({
          id: asset.id,
          siteId: asset.contentId,
          name: destFileName,
          s3ObjectKey: destKey,
          status: ASSET_STATUS.S3_COPY_COMPLETE_FROM_CONVERT_TOOL,
          historyStatus: [ASSET_STATUS.S3_COPY_COMPLETE_FROM_CONVERT_TOOL],
          userId: configAsset.ehv.systemUserId
        })

        return
      }

      const errorFileKey = `${configAsset.ehv.prefixes.convertTool.error}/${asset.contentId}_${asset.id}_${asset.name}`
      const convertFailedObject = await getStreamAndHeader(configAsset.ehv, {
        key: errorFileKey
      })

      if (convertFailedObject.code === 200 && convertFailedObject.fileStream) {
        const errorInfos = await getObjectByPrefix(configAsset.ehv, {
          prefix: `${configAsset.ehv.prefixes.convertTool.error}/${asset.contentId}_${asset.id}_`
        })
        let errorMessages = ''

        if (errorInfos.KeyCount > 0) {
          for (const target of errorInfos.Contents) {
            if (target.Size === 0 || path.extname(target.Key) !== '.json') {
              continue
            }
            try {
              const errorInfoObject = await getStreamAndHeader(
                configAsset.ehv,
                {
                  key: target.Key
                }
              )
              if (!errorInfoObject.fileStream) {
                this.internalBatchOutputLog(
                  BATCH_LOG_LEVEL.ERROR,
                  'Failed to retrieve error information for segment tool conversion failure.',
                  {
                    key: target.Key
                  }
                )
              } else {
                const errInfoJson = JSON.parse(
                  await errorInfoObject.fileStream.Body.transformToString()
                )
                errorMessages = errInfoJson['error-info']
              }
            } catch (e) {
              this.internalBatchOutputLog(
                BATCH_LOG_LEVEL.ERROR,
                'Failed to retrieve error information for segment tool conversion failure.',
                {
                  key: target.Key
                },
                null,
                e
              )
            }
            break
          }
        }

        await this.updateAssetAndHistory({
          id: asset.id,
          siteId: asset.contentId,
          s3ObjectKey: errorFileKey,
          status: ASSET_STATUS.CONVERT_TOOL_ERROR,
          historyStatus: [ASSET_STATUS.CONVERT_TOOL_ERROR],
          userId: configAsset.ehv.systemUserId
        })

        await this.notification({
          code: NOTIFICATION_MESSAGES.ASSET_CREATE_EHV_SPACE_INFO_ERROR,
          errorMessages,
          assetId: asset.id,
          siteId: asset.contentId,
          userId: asset.createdBy
        }).catch(err => this.log.error(LOG_ERROR + err))
      }
    } catch (e) {
      this.internalBatchOutputLog(
        BATCH_LOG_LEVEL.ERROR,
        'An exception error occurred while retrieving the conversion tool output file.',
        {
          assetId: asset.id,
          s3ObjectKey: convertedFilename
        },
        e
      )
    }
  }

  /**
   * Batch internal processing: Registration and update of external linkage files
   *
   * @param {string} sourcePrefix B2 target prefix
   * @param {string} destPrefix EHV Input Prefix
   * @param {string} assetFormatType Asset format type
   * @param {string} assetCategory Asset Category
   * @param {string} ionType CesiumIon Asset Type
   * @param {string} ionSourceType CesiumIon Asset Input Type
   * @param {boolean} isSpace Space ID
   * @param {boolean} isApproval After admitting
   */
  async internalBatchUpsertExternalLinkFile({
    ehvAssetType,
    sourcePrefix,
    destPrefix,
    assetFormatType,
    assetCategory,
    ionType,
    ionSourceType,
    cesiumOptions = null,
    isSpace,
    isApproval
  }) {
    const configAsset = this.fastify.config.asset

    const b2Objects = await getObjectByPrefix(configAsset.b2, {
      prefix: sourcePrefix
    })

    if (b2Objects.KeyCount === 0) {
      this.internalBatchOutputLog(
        BATCH_LOG_LEVEL.INFO,
        'There were 0 external linkage files.',
        {
          prefix: sourcePrefix
        }
      )
      return
    }

    for (const target of b2Objects.Contents) {
      let b2FileName = ''
      let asset = null
      try {
        if (target.Size === 0) {
          continue
        }

        const b2File = await getStreamAndHeader(configAsset.b2, {
          key: target.Key
        })
        if (b2File.code !== 200 || !b2File.fileStream) {
          this.internalBatchOutputLog(
            BATCH_LOG_LEVEL.ERROR,
            'Failed to retrieve external linkage file. Try again in the next batch',
            {
              key: target.Key
            }
          )
          continue
        }

        b2FileName = path.basename(target.Key)
        const separatedByUnderscores = b2FileName.split('_')
        if (separatedByUnderscores.length < 2) {
          console.log(
            LOG_ERROR +
              JSON.stringify({
                message: 'Invalid external linkage file name.',
                key: target.Key,
                b2FileName
              })
          )
          this.internalBatchOutputLog(
            BATCH_LOG_LEVEL.ERROR,
            'The externally linked file name is in an invalid format.',
            {
              key: target.Key
            }
          )
          continue
        }

        const contentId = separatedByUnderscores[0]
        const workingFileName = separatedByUnderscores.slice()
        workingFileName.shift()
        const fileName = workingFileName.join('_')
        const content = await b2File.fileStream.Body.transformToByteArray()
        const contentLength = b2File.header.contentLength
        let s3ObjectKey = ''

        try {
          asset = await this.getAsset({
            siteId: contentId,
            ehvAssetType,
            linkageFileName: b2FileName
          })
        } catch (e) {
          // Processing continues
        }

        if (asset) {
          await cesiumIonApi.deleteAsset(this.fastify, asset.ionAssetId)
          s3ObjectKey = asset.s3ObjectKey

          await this.addAssetHistory({
            assetId: asset.id,
            statuses: [ASSET_STATUS.EXTENAL_UPDATE],
            userId: configAsset.ehv.systemUserId
          })
        } else {
          const assetInfo = new AssetInfo({
            name: b2FileName,
            category: assetCategory,
            formatType: assetFormatType,
            verifyParams: {
              ionType,
              ionSourceType
            },
            cesiumOptions
          })

          if (!assetInfo.assetInfo || !assetInfo.assetInfo.cesiumIon) {
            this.internalBatchOutputLog(
              BATCH_LOG_LEVEL.ERROR,
              'External linkage file type is not supported',
              {
                key: target.Key
              }
            )
            continue
          }

          const newAssetId = getUuid()
          const inserts = [
            {
              id: newAssetId,
              contentId,
              ehvAssetType,
              ionAssetId: null,
              ionOnComplete: null,
              s3ObjectKey: null,
              name: fileName,
              displayName: fileName,
              category: assetCategory,
              formatType: assetFormatType,
              linkageFileName: b2FileName,
              isSpace,
              isApproval,
              ionType: assetInfo.assetInfo.cesiumIon.type,
              ionSourceType: assetInfo.assetInfo.cesiumIon.sourceType,
              cesiumOptions,
              createdBy: configAsset.ehv.systemUserId,
              updatedBy: configAsset.ehv.systemUserId
            }
          ]
          await this.bulkInsert(inserts)
          asset = await this.getAsset({
            id: newAssetId,
            siteId: contentId
          })
          s3ObjectKey = `${destPrefix}/${asset.contentId}/${asset.id}/${asset.name}`
        }

        await this.uploadFileS3(configAsset.ehv, {
          key: s3ObjectKey,
          body: content,
          length: contentLength
        })

        await deleteObject(configAsset.b2, {
          key: target.Key
        })

        await this.updateAssetAndHistory({
          id: asset.id,
          siteId: contentId,
          userId: configAsset.ehv.systemUserId,
          s3ObjectKey,
          ionAssetId: 0,
          ionPercentComplete: 0,
          category: assetCategory,
          formatType: assetFormatType,
          status: ASSET_STATUS.S3_UPLOAD_COMPLETE,
          historyStatus: [ASSET_STATUS.S3_UPLOAD_COMPLETE]
        })
      } catch (e) {
        this.internalBatchOutputLog(
          BATCH_LOG_LEVEL.ERROR,
          'An exception error occurred during the external linkage asset registration update process.',
          {
            key: target.Key,
            b2FileName,
            assetId: asset ? asset.id : null
          },
          e
        )
      }
    }
  }

  /**
   * Delete an asset
   *
   * @param {Object} asset
   */
  async internalBatchDeleteAsset(asset) {
    const configAsset = this.fastify.config.asset

    try {
      const cesiumIonDeleteAssetRespone = await cesiumIonApi.deleteAsset(
        this.fastify,
        asset.ionAssetId
      )
      if (cesiumIonDeleteAssetRespone.status !== 204) {
        throw new Error(
          'Request to CesiumIon Asset Deletion API failed.' +
            JSON.stringify({
              assetInfo: {
                id: asset.id,
                contentId: asset.contentId
              },
              cesiumIonResponse: {
                statusCode: cesiumIonDeleteAssetRespone.status,
                body: null
              }
            })
        )
      }

      await deleteObject(configAsset.ehv, {
        key: asset.s3ObjectKey
      })

      await this.delete({
        id: asset.id,
        siteId: asset.contentId,
        status: ASSET_STATUS.DELETE_COMPLETE,
        userId: asset.updatedBy
      })

      await this.addAssetHistory({
        assetId: asset.id,
        statuses: [ASSET_STATUS.DELETE_COMPLETE],
        userId: asset.updatedBy
      })

      await this.notification({
        code: NOTIFICATION_MESSAGES.ASSET_DELETE_COMPLETE,
        assetId: asset.id,
        siteId: asset.contentId,
        userId: asset.updatedBy,
        latestAsset: asset
      })
    } catch (e) {
      this.log.error(
        LOG_ERROR +
          JSON.stringify({
            message: 'Failed to delete the asset.',
            assetId: asset.id,
            exception: e
          })
      )

      await this.updateAssetAndHistory({
        id: asset.id,
        siteId: asset.contentId,
        status: ASSET_STATUS.DELETE_ERROR,
        historyStatus: [ASSET_STATUS.DELETE_ERROR],
        userId: configAsset.ehv.systemUserId
      })

      await this.notification({
        code: NOTIFICATION_MESSAGES.ASSET_DELETE_ERROR,
        assetId: asset.id,
        siteId: asset.contentId,
        userId: asset.updatedBy
      })
    }
  }

  /**
   * Batch internal processing: Log output
   *
   * @param {string} level BATCH_LOG_LEVEL
   * @param {string} message content
   * @param {string|null} additionalInfo Additional Information
   * @param {Error|null} error Error object when an exception occurs
   */
  internalBatchOutputLog(level, message, additionalInfo = null, error = null) {
    switch (level) {
      case BATCH_LOG_LEVEL.DEBUG:
        this.fastify.log.debug({
          appName: LOG_PREFIX,
          moduleName: 'Asset Batch',
          message,
          additionalInfo,
          error: error ? error.stack : null
        })
        break
      case BATCH_LOG_LEVEL.ERROR:
        this.fastify.log.error({
          appName: LOG_PREFIX,
          moduleName: 'Asset Batch',
          message,
          additionalInfo,
          error: error ? error.stack : null
        })
        break
      case BATCH_LOG_LEVEL.INFO:
      default:
        this.fastify.log.info({
          appName: LOG_PREFIX,
          moduleName: 'Asset Batch',
          message,
          additionalInfo,
          error: error ? error.stack : null
        })
    }
  }

  /**
   * Asset registration confirmation
   *
   * @param {Object} options
   * @param {String} options.siteId - The site identifier
   * @param {Array}  options.excludeStatusList - Exclusion status list
   * @memberof AssetsDbAdapter
   */
  async checkRegistrable({ siteId, excludeStatusList = EXCLUDE_STATUS_LIST }) {
    const { items } = await this.list({ siteId })
    const enableItems = items.filter(
      asset => !excludeStatusList.includes(asset.status)
    )
    return {
      enableItems,
      isRegistrable:
        enableItems.length < this.fastify.config.asset.ehv.registerableNum
    }
  }

  /**
   * Get asset info and validation assets
   *
   * @param {Object} options
   * @param {String} options.siteId - The site identifier
   * @param {String} options.category - The asset category
   * @param {String} options.name - The asset name
   * @returns {Promise}
   * @memberof AssetsDbAdapter
   */
  validation({
    formatType,
    cesiumOptions,
    customPosition,
    startDateTime,
    endDateTime,
    isAddMessageCode = false,
    isUpdate = false
  }) {
    if (!!startDateTime ^ !!endDateTime) {
      const boomRes = Boom.badRequest(
        `StartDateTime and endDateTime must be ${
          !isUpdate ? 'created' : 'updated'
        } at the same time`
      )
      if (isAddMessageCode) {
        boomRes.output.payload.messageCode =
          ERROR_MESSAGES.ASSET_UPLOAD_VALIDATION_FAILED
      }
      throw boomRes
    }
    if (
      startDateTime &&
      endDateTime &&
      new Date(startDateTime) >= new Date(endDateTime)
    ) {
      const boomRes = Boom.badRequest(
        `Start Datetime:[${startDateTime}] is after or equal end Datetime:[${endDateTime}]`
      )
      if (isAddMessageCode) {
        boomRes.output.payload.messageCode =
          ERROR_MESSAGES.ASSET_UPLOAD_VALIDATION_FAILED
      }
      throw boomRes
    }
    if (
      formatType === ASSET_FORMAT_TYPE.GLTF &&
      (!cesiumOptions || !cesiumOptions.position) &&
      !customPosition
    ) {
      const boomRes = Boom.badRequest(
        'gltf file is need customPosition or global-coordinate'
      )
      if (isAddMessageCode) {
        boomRes.output.payload.messageCode =
          ERROR_MESSAGES.ASSET_UPLOAD_VALIDATION_FAILED
      }
      throw boomRes
    }
  }

  /**
   * Bulk insert assets data
   *
   * @param {Array} records - Target data
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @throws {GenericServerError}
   * @memberof AssetsDbAdapter
   */
  async bulkInsert(records, connection = null) {
    if (!records.length) {
      return
    }

    const notExistsConnection = !connection
    try {
      const columns = Object.keys(records[0])
      const query = SQL`
      INSERT IGNORE INTO assets
      ( ${SQL.unsafe(columns.map(c => `\`${c}\``).join(', '))} )
      VALUES
      ( ${SQL.glue(
        records.map(r =>
          SQL.glue(
            columns.map(c => SQL`${convertDataToSQLParam(r[c])}`),
            ', '
          )
        ),
        ` ),
          ( `
      )} )`

      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      notExistsConnection && (await connection.query('START TRANSACTION'))
      await connection.query(query)
      notExistsConnection && (await connection.query('COMMIT'))
    } catch (e) {
      this.log.error(LOG_ERROR + e)
      notExistsConnection && (await connection.query('ROLLBACK'))
      throw new GenericServerError(e.message)
    } finally {
      notExistsConnection && connection?.release()
    }
  }

  /**
   * Upload to S3
   *
   * @param {Object} config
   * @param {string} config.accessKeyId S3 access key (optional)
   * @param {string} config.secretAccessKey S3 Secret (optional)
   * @param {string} config.sessionToken S3 session token (optional)
   * @param {string} config.bucket Bucket name
   * @param {Object} options
   * @param {string} options.key Object key
   * @param {object} options.body File body
   * @param {number} options.length File Size
   * @returns {object} S3 Upload Response
   * @memberof AssetsDbAdapter
   */
  async uploadFileS3(config, options) {
    if (this.fastify.hasDecorator('mockS3Upload')) {
      return this.fastify.mockS3Upload()
    }

    try {
      return await uploadObject(config, options)
    } catch (e) {
      const { statusCode, message } = e
      this.log.error(
        LOG_ERROR +
          new Date().toISOString() +
          ': [uploadFileS3] error : ' +
          JSON.stringify(e)
      )
      const boomRes = new Boom.Boom(message, {
        statusCode: statusCode >= 400 ? statusCode : 500
      })
      boomRes.output.payload.messageCode =
        ERROR_MESSAGES.ASSET_UPLOAD_ERROR_S3_UPLOAD
      throw boomRes
    }
  }

  /**
   * Notification function using websocket
   *
   * @param {Object} options
   * @param {String} options.code - Message code
   * @param {String} options.errorMessages - error message
   * @param {String} options.assetId - The asset identifier
   * @param {String} options.userId - The  identifier
   */
  async notification({ code, errorMessages, assetId, userId, latestAsset }) {
    const asset = latestAsset || (await this.getAsset({ id: assetId }))
    const opts = { ...this.fastify.config.websocket, log: this.log }
    await utilNotification(
      {
        messageCode: code,
        errorMessages,
        type: 'asset',
        siteId: asset.contentId,
        assetId: asset.id,
        userId: userId,
        targetName: asset.name,
        updatedAt: asset.updatedAt
      },
      opts
    )
  }

  /**
   * Gets viewStructure for the specified contentId
   */
  async getViewStructure(options, connection) {
    const query = SQL`
      SELECT name, displayName, status, id AS referenceId, ehvAssetType, formatType, createdAt
      FROM assets`

    const filter = { exists: false }
    addSiteIdFilter(query, { siteId: options.id }, filter)
    addShowNotDeletedFilter(query, options, filter)

    try {
      connection = await connect(this.mysql, connection)

      const elements = structuredClone(VIEW_STRUCTURE_DEFAULT)

      const items = (await connection.query(query))[0]
      if (items.length === 0) {
        return { elements }
      }

      items.sort(
        (a, b) =>
          b.ehvAssetType.localeCompare(a.ehvAssetType) ||
          b.createdAt.getTime() - a.createdAt.getTime() ||
          a.referenceId.localeCompare(b.referenceId)
      )

      const root = {}
      root[EHV_ASSET_TYPE.EHV_TILE] = elements[0]
      root[EHV_ASSET_TYPE.EHV_SPACE_INFO] = elements[1]
      root[EHV_ASSET_TYPE.EXTERNAL_TILE_BE] = elements[2]
      root[EHV_ASSET_TYPE.EXTERNAL_TILE_AF] = elements[2]
      root[EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_BE] = elements[3]
      root[EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_AF] = elements[3]
      let prev = ''
      let branch = null
      let months = 0

      for (const leaf of items) {
        const type = leaf.ehvAssetType || '@unknown@'
        if (prev !== type) {
          root[prev]?.children.push(branch)

          switch (type) {
            case EHV_ASSET_TYPE.EHV_TILE:
            case EHV_ASSET_TYPE.EHV_SPACE_INFO:
              branch = null
              months = 0
              break
            case EHV_ASSET_TYPE.EXTERNAL_TILE_BE:
            case EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_BE:
              branch = structuredClone(VIEW_STRUCTURE_BRANCH.BEFORE)
              break
            case EHV_ASSET_TYPE.EXTERNAL_TILE_AF:
            case EHV_ASSET_TYPE.EXTERNAL_SPACE_INFO_AF:
              branch = structuredClone(VIEW_STRUCTURE_BRANCH.AFTER)
              break
            default:
              prev = ''
              continue
          }

          prev = type
        }

        switch (type) {
          case EHV_ASSET_TYPE.EHV_TILE:
          case EHV_ASSET_TYPE.EHV_SPACE_INFO:
            const at = leaf.createdAt
            const y = at.getFullYear()
            const m = at.getMonth() + 1
            const now = y * 100 + m
            if (months !== now) {
              if (months) {
                root[prev].children.push(branch)
              }
              months = now

              const name = `${y}年 ${m}月`
              branch = {
                name,
                displayName: name,
                isDirectory: true,
                expanded: true,
                nodeID: 0,
                children: []
              }
            }
            break
        }

        branch.children.push(leaf)
      }
      root[prev]?.children.push(branch)

      elements[2].children = elements[2].children.reduce(
        (prev, item) => [...prev, ...item.children],
        []
      )

      let idx = 1
      for (const r of elements) {
        r.nodeID = idx++
        for (const b of r.children) {
          b.nodeID = idx++
          if (b.children) {
            for (const l of b.children) {
              l.nodeID = idx++
            }
          }
        }
      }

      return { elements }
    } finally {
      connection?.release()
    }
  }
}

module.exports = AssetsDbAdapter
