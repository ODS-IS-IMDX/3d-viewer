// Copyright (c) 2025 NTT InfraNet
'use strict'

const SQL = require('@nearform/sql')

const {
  GenericServerError,
  EntityNotFoundError
} = require('../../../lib/errors')

const {
  addIdFilter,
  addColumnFilter,
  addPaginationFilter
} = require('../../../lib/utils/db-filters')

const { getUuid } = require('../../../lib/utils/uuid')
const { PROCESSING_STATUS } = require('../constants')

/**
 * Cloud Database adapter to support processing status managements
 *
 * @class ProcessingStatusManagementsDbCloudAdapter
 * @param {Object} options - An Object containing logger and database instances
 * @param {Object} options.mysql - The MySQL client instance
 * @param {Object} options.fastify - The Fastify instance
 * @param {Object} options.log - Logger instance
 */
class ProcessingStatusManagementsDbCloudAdapter {
  constructor(options) {
    this.mysql = options.mysql
    this.log = options.log
    this.fastify = options.fastify
  }

  /**
   * Get a list of processing status management data
   *
   * @param {Object} options
   * @param {String} options.id - The processing status management identifier
   * @param {String} options.processingType - The processing type
   * @param {String} options.resourceCategory - The processing resource category
   * @param {String} options.resourceValue - The processing resource value
   * @param {Number} options.identityNumber - The processing identity number
   * @param {String} options.status - The processing status
   * @param {String} options.sort - Sort by column (identityNumber, createdAt, updatedAt)
   * @param {String} options.direction - Sort direction (ASC, DESC)
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @returns {Object} A processing status management object
   * @memberof ProcessingStatusManagementsDbCloudAdapter
   */
  async list(
    {
      id = null,
      processingType = null,
      resourceCategory = null,
      resourceValue = null,
      identityNumber = null,
      status = null,
      sort = 'createdAt',
      direction = 'DESC'
    },
    connection = null
  ) {
    const notExistsConnection = !connection
    try {
      const query = SQL`SELECT * FROM processing_status_managements`
      const filter = { exists: false }
      id && addIdFilter(query, { id }, filter)

      const whereTargets = {
        processingType,
        resourceCategory,
        resourceValue,
        identityNumber,
        status
      }
      Object.keys(whereTargets).forEach(column => {
        whereTargets[column] &&
          addColumnFilter(
            query,
            {
              column,
              value: whereTargets[column]
            },
            filter
          )
      })
      addPaginationFilter(query, { sort, direction })

      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      const result = await connection.query(query)

      return {
        totalItems: result[0].length,
        items: result[0]
      }
    } catch (e) {
      throw new GenericServerError(e.message)
    } finally {
      notExistsConnection && connection.release()
    }
  }

  /**
   * Get processing status management data
   *
   * @param {Object} options
   * @param {String} options.id - The processing status management identifier
   * @param {String} options.processingType - The processing type
   * @param {String} options.resourceCategory - The processing resource category
   * @param {String} options.resourceValue - The processing resource value
   * @param {Number} options.identityNumber - The processing identity number
   * @param {String} options.status - The processing status
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @returns {Object} A processing status management object
   * @memberof ProcessingStatusManagementsDbCloudAdapter
   */
  async get(
    {
      id = null,
      processingType = null,
      resourceCategory = null,
      resourceValue = null,
      identityNumber = null,
      status = null
    },
    connection = null
  ) {
    if (
      !id &&
      !(processingType && resourceCategory && resourceValue && identityNumber)
    ) {
      throw new GenericServerError('Missing required parameters')
    }

    const { items } = await this.list(
      {
        id,
        processingType,
        resourceCategory,
        resourceValue,
        identityNumber,
        status
      },
      connection
    )

    if (items.length === 0) {
      const whereTargets = {
        id,
        processingType,
        resourceCategory,
        resourceValue,
        identityNumber,
        status
      }
      const addMessage = Object.keys(whereTargets).reduce((pre, cur) => {
        if (whereTargets[cur]) {
          return `${pre.length ? `${pre}, ` : ``}${cur} ${whereTargets[cur]}`
        }
        return pre
      }, '')
      throw new EntityNotFoundError(
        `Cannot find processing status management with ${addMessage}`
      )
    }

    return items[0]
  }

  /**
   * Add processing status management data
   *
   * @param {Object} options
   * @param {String} options.processingType - The processing type
   * @param {String} options.resourceCategory - The processing resource category
   * @param {String} options.resourceValue - The processing resource value
   * @param {Number} options.identityNumber - The processing identity number
   * @param {String} options.status - The processing status
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @returns {Object} The new processing status management object
   * @throws {GenericServerError}
   * @memberof ProcessingStatusManagementsDbCloudAdapter
   */
  async add(
    { processingType, resourceCategory, resourceValue, identityNumber, status },
    connection = null
  ) {
    const id = getUuid()
    const query = SQL`INSERT INTO processing_status_managements (\`id\`, \`processingType\`, \`resourceCategory\`, \`resourceValue\`, \`identityNumber\`, \`status\`) VALUES ( `
    const vars = [
      id,
      processingType,
      resourceCategory,
      resourceValue,
      identityNumber,
      status
    ]
    const varsSql = vars.map(c => SQL`${c}`)
    query.append(query.glue(varsSql, ', '))
    query.append(SQL`)`)

    const notExistsConnection = !connection
    try {
      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      notExistsConnection && (await connection.query('START TRANSACTION'))
      await connection.query(query)
      const result = await this.get({ id }, connection)
      notExistsConnection && (await connection.query('COMMIT'))
      return result
    } catch (e) {
      notExistsConnection && (await connection.query('ROLLBACK'))
      throw new GenericServerError(e.message)
    } finally {
      notExistsConnection && connection.release()
    }
  }

  /**
   * Update processing status management data
   *
   * @param {Object} options
   * @param {String} options.id - The processing status management identifier
   * @param {String} options.processingType - The processing type
   * @param {String} options.resourceCategory - The processing resource category
   * @param {String} options.resourceValue - The processing resource value
   * @param {Number} options.identityNumber - The processing identity number
   * @param {String} options.status - The processing status
   * @param {Date} options.baseUpdatedAt - The reference date and time to determine whether the date and time have been updated.
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @throws {GenericServerError}
   * @throws {EntityNotFoundError}
   * @memberof ProcessingStatusManagementsDbCloudAdapter
   */
  async update(
    {
      id = null,
      processingType = null,
      resourceCategory = null,
      resourceValue = null,
      identityNumber = null,
      status = null,
      baseUpdatedAt
    },
    connection = null
  ) {
    if (
      !id &&
      !(processingType && resourceCategory && resourceValue && identityNumber)
    ) {
      throw new GenericServerError('Missing required parameters')
    }

    const query = SQL`UPDATE processing_status_managements SET `

    const updates = []
    status && updates.push(SQL` \`status\`=${status} `)
    updates.push(SQL` \`updatedAt\`=now() `)
    query.append(query.glue(updates, ', '))

    const filter = { exists: false }
    id && addIdFilter(query, { id }, filter)

    const whereTargets = {
      processingType,
      resourceCategory,
      resourceValue,
      identityNumber,
      status
    }
    Object.keys(whereTargets).forEach(column => {
      whereTargets[column] &&
        addColumnFilter(
          query,
          {
            column,
            value: whereTargets[column]
          },
          filter
        )
    })

    baseUpdatedAt &&
      addColumnFilter(
        query,
        {
          column: 'updatedAt',
          value: baseUpdatedAt,
          comparison: '<'
        },
        filter
      )

    const notExistsConnection = !connection
    let result
    try {
      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      notExistsConnection && (await connection.query('START TRANSACTION'))
      result = await connection.query(query)
      if (result[0].affectedRows !== 1) {
        const whereTargets = {
          id,
          processingType,
          resourceCategory,
          resourceValue,
          identityNumber
        }
        const addMessage = Object.keys(whereTargets).reduce((pre, cur) => {
          if (whereTargets[cur]) {
            return `${pre.length ? `${pre}, ` : ``}${cur} ${whereTargets[cur]}`
          }
          return pre
        }, '')
        throw new EntityNotFoundError(
          `Cannot find processing status management with ${addMessage}`
        )
      }
      notExistsConnection && (await connection.query('COMMIT'))
    } catch (e) {
      notExistsConnection && (await connection.query('ROLLBACK'))
      if (e.name === 'EntityNotFound') {
        throw e
      }
      throw new GenericServerError(e.message)
    } finally {
      notExistsConnection && connection.release()
    }
  }

  /**
   * Delete processing status management data
   *
   * @param {Object} options
   * @param {String} options.id - The processing status management identifier
   * @param {String} options.processingType - The processing type
   * @param {String} options.resourceCategory - The processing resource category
   * @param {String} options.resourceValue - The processing resource value
   * @param {Number} options.identityNumber - The processing identity number
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @throws {GenericServerError}
   * @throws {EntityNotFoundError}
   * @memberof ProcessingStatusManagementsDbCloudAdapter
   */
  async delete(
    {
      id = null,
      processingType = null,
      resourceCategory = null,
      resourceValue = null,
      identityNumber = null
    },
    connection = null
  ) {
    if (
      !id &&
      !(processingType && resourceCategory && resourceValue && identityNumber)
    ) {
      throw new GenericServerError('Missing required parameters')
    }

    const query = SQL`DELETE FROM processing_status_managements `
    const filter = { exists: false }
    id && addIdFilter(query, { id }, filter)

    const whereTargets = {
      processingType,
      resourceCategory,
      resourceValue,
      identityNumber
    }
    Object.keys(whereTargets).forEach(column => {
      whereTargets[column] &&
        addColumnFilter(
          query,
          {
            column,
            value: whereTargets[column]
          },
          filter
        )
    })

    const notExistsConnection = !connection
    let result
    try {
      connection = notExistsConnection
        ? await this.mysql.getConnection()
        : connection

      notExistsConnection && (await connection.query('START TRANSACTION'))
      result = await connection.query(query)
      if (result[0].affectedRows === 0) {
        const whereTargets = {
          id,
          processingType,
          resourceCategory,
          resourceValue,
          identityNumber
        }
        const addMessage = Object.keys(whereTargets).reduce((pre, cur) => {
          if (whereTargets[cur]) {
            return `${pre.length ? `${pre}, ` : ``}${cur} ${whereTargets[cur]}`
          }
          return pre
        }, '')
        throw new EntityNotFoundError(
          `Cannot find processing status management with ${addMessage}`
        )
      }
      notExistsConnection && (await connection.query('COMMIT'))
    } catch (e) {
      notExistsConnection && (await connection.query('ROLLBACK'))
      if (e.name === 'EntityNotFound') {
        throw e
      }
      throw new GenericServerError(e.message)
    } finally {
      notExistsConnection && connection.release()
    }
  }

  /**
   * Start processing
   *
   * @param {Object} options
   * @param {String} options.processingType - The processing type
   * @param {String} options.resourceCategory - The processing resource category
   * @param {String} options.resourceValue - The processing resource value
   * @param {Number} options.limitProcessing - Maximum number of processes
   * @param {String} options.status - The processing status
   * @param {Number} options.rerunCount - Number of reprocessing
   * @param {Number} options.rerunIntervalMin - Waiting time for reprocessing(Min)
   * @param {Number} options.rerunIntervalMax - Waiting time for reprocessing(Max)
   * @param {Object} connection - The optional mysql connection, used to force the same connection in the pool
   * @throws {GenericServerError}
   * @throws {EntityNotFoundError}
   * @memberof ProcessingStatusManagementsDbCloudAdapter
   */
  async startProcessing({
    processingType,
    resourceCategory,
    resourceValue,
    limitProcessing = 1,
    status,
    rerunCount = 1,
    rerunIntervalMin = 500,
    rerunIntervalMax = 1000
  }) {
    const rerunInterval =
      Math.floor(Math.random() * (rerunIntervalMax - rerunIntervalMin + 1)) +
      rerunIntervalMin
    for (let i = 1; i <= rerunCount; i++) {
      try {
        i > 1 &&
          (await this.waitStatusUpdate({
            processingType,
            resourceCategory,
            resourceValue,
            beforeStatus: status,
            interval: rerunInterval
          }).catch(e => this.log.error(e)))

        await new Promise(resolve =>
          setTimeout(resolve, rerunInterval)
        ).catch(e => this.log.error(e))

        const { totalItems, items } = await this.list({
          processingType,
          resourceCategory,
          resourceValue,
          sort: 'identityNumber',
          direction: 'ASC'
        })

        if (totalItems >= limitProcessing) {
          return
        }

        const identityNumber = items.findIndex((v, i) => v.identityNumber !== i)
        return await this.add({
          processingType,
          resourceCategory,
          resourceValue,
          identityNumber: identityNumber !== -1 ? identityNumber : totalItems,
          status
        })
      } catch (e) {
        this.log.error(e)
        if (i >= rerunCount) {
          throw e
        }
      }
    }
  }

  /**
   * End processing
   *
   * @param {Object} options
   * @param {String} options.id - The processing status management identifier
   * @param {Number} options.rerunCount - Number of reprocessing
   * @param {Number} options.rerunInterval - Waiting time for reprocessing
   * @throws {GenericServerError}
   * @throws {EntityNotFoundError}
   * @memberof ProcessingStatusManagementsDbCloudAdapter
   */
  async endProcessing({ id, rerunCount = 3, rerunInterval = 5000 }) {
    for (let i = 1; i <= rerunCount; i++) {
      try {
        i > 1 &&
          (await new Promise(resolve =>
            setTimeout(resolve, rerunInterval)
          ).catch(this.log.error))
        const psm = await this.get({ id }).catch(e => {
          if (e.name !== 'EntityNotFound') {
            throw e
          }
        })
        psm && (await this.delete({ id }))
        return
      } catch (e) {
        this.log.error(e)
        if (i >= rerunCount) {
          throw e
        }
      }
    }
  }

  /**
   * Wait status update
   *
   * @param {Object} options
   * @param {String} options.processingType - The processing type
   * @param {String} options.resourceCategory - The processing resource category
   * @param {String} options.resourceValue - The processing resource value
   * @param {String} options.beforeStatus - The processing before status
   * @param {String} options.afterStatus - The processing after status
   * @param {Number} options.interval - The processing interval
   * @throws {GenericServerError}
   * @throws {EntityNotFoundError}
   * @memberof ProcessingStatusManagementsDbCloudAdapter
   */
  waitStatusUpdate({
    processingType,
    resourceCategory,
    resourceValue,
    beforeStatus,
    afterStatus = null,
    interval = 1000
  }) {
    return this.list({
      processingType,
      resourceCategory,
      resourceValue,
      status: beforeStatus,
      sort: 'identityNumber',
      direction: 'ASC'
    })
      .then(beforePsmList => {
        return Promise.allSettled(
          beforePsmList.items.map(beforePsm => {
            const targetId = beforePsm.id
            return new Promise((resolve, reject) => {
              const timerObj = setInterval(() => {
                this.get({ id: targetId })
                  .then(afterPsm => {
                    const now = new Date()
                    const latest = new Date(afterPsm.updatedAt)
                    const diff = now.getTime() - latest.getTime()
                    const isAvailability = diff <= interval * 5
                    if (!isAvailability) {
                      clearInterval(timerObj)

                      this.delete({ id: targetId })
                        .then(resolve)
                        .catch(e => {
                          e.name === 'EntityNotFound' ? resolve() : reject(e)
                        })
                    } else if (afterPsm.status === afterStatus) {
                      clearInterval(timerObj)
                      resolve()
                    }
                  })
                  .catch(e => {
                    clearInterval(timerObj)
                    e.name === 'EntityNotFound' ? resolve() : reject(e)
                  })
              }, interval)
            })
          })
        )
      })
      .catch(e => {
        if (e.name !== 'EntityNotFound') {
          throw e
        }
      })
  }

  /**
   * Maintenance record data
   *
   * @param {Object} options
   * @param {String} options.processingType - The processing type
   * @param {String} options.resourceCategory - The processing resource category
   * @param {String} options.resourceValue - The processing resource value
   * @param {Number} options.interval - The processing interval
   * @throws {GenericServerError}
   * @throws {EntityNotFoundError}
   * @memberof ProcessingStatusManagementsDbCloudAdapter
   */
  maintenance({
    processingType,
    resourceCategory,
    resourceValue,
    interval = 500
  }) {
    return this.list({
      processingType,
      resourceCategory,
      resourceValue,
      sort: 'identityNumber',
      direction: 'ASC'
    })
      .then(psmList => {
        return Promise.allSettled(
          psmList.items.map(psm => {
            const now = new Date()
            const latest = new Date(psm.updatedAt)
            const diff = now.getTime() - latest.getTime()
            const isAvailability = diff <= interval
            if (!isAvailability) {
              return this.delete({ id: psm.id })
            }
          })
        )
      })
      .catch(e => {
        if (e.name !== 'EntityNotFound') {
          throw e
        }
      })
  }

  /**
   * Notice processing
   *
   * @param {Object} options
   * @param {String} options.id - The processing status management identifier
   * @param {String} options.status - The processing status
   * @param {Number} options.interval - The processing interval
   * @param {Number} options.timeout - The processing timeout
   * @param {Object} isProcessing - Determine whether or not processing is in progress (true: continuation/false: end)
   * @param {Object} abortInfo - Forced termination parameters
   * @throws {GenericServerError}
   * @throws {EntityNotFoundError}
   * @memberof ProcessingStatusManagementsDbCloudAdapter
   */
  noticeProcessing({
    id,
    status = null,
    interval = 500,
    timeout = 60 * 60 * 1000,
    isProcessing = { val: false },
    abortInfo = { is: false, message: '' }
  }) {
    return new Promise((resolve, reject) => {
      const errorFunc = e => {
        e.name === 'EntityNotFound' ? resolve() : reject(e)
      }
      const timerObj = setInterval(() => {
        if (!isProcessing.val) {
          clearInterval(timerObj)
          return resolve()
        }
        this.get({ id, status })
          .then(psm => {
            const now = new Date()
            const createdAt = new Date(psm.createdAt)
            const diff = now.getTime() - createdAt.getTime()
            const isTimeout = diff > timeout
            if (isTimeout) {
              abortInfo.is = true
              abortInfo.message =
                '[PROCESSING-STATUS-MANAGEMENT][ABORT] Timeout error'
              clearInterval(timerObj)
              this.delete({ id: psm.id }).catch(errorFunc)
              return resolve()
            }
            return this.update({ id: psm.id })
          })
          .catch(e => {
            clearInterval(timerObj)
            errorFunc(e)
          })
      }, interval)
    })
  }

  /**
   * Exclusion control
   *
   * @param {Object} options
   * @param {String} options.processingType - The processing type
   * @param {String} options.resourceCategory - The processing resource category
   * @param {String} options.resourceValue - The processing resource value
   * @param {Number} options.limitProcessing - Maximum number of processes
   * @param {Number} options.intervalBase - Base Interval Value [ms]
   * @param {Boolean} options.isMaintenance - Can the maintenance process be executed?
   * @param {Boolean} options.isPreWait - Whether or not there is a waiting waiting process for other processing before the start of processing
   * @param {Boolean} options.waitUntilComplete - Cannot execute the standby process for other processing that is currently being executed?
   * @param {Promise} mainProcessing - Main Processing
   * @param {Function} breakProcessing - Processing when interrupted
   * @throws {GenericServerError}
   * @throws {EntityNotFoundError}
   * @memberof ProcessingStatusManagementsDbCloudAdapter
   */
  async exclusionControl(
    {
      processingType,
      resourceCategory,
      resourceValue,
      limitProcessing = 1,
      intervalBase = 500,
      isMaintenance = true,
      isPreWait = false,
      waitUntilComplete = false
    },
    mainProcessing,
    breakProcessing
  ) {
    const abortInfo = { is: false, message: '' }
    const abortProcess = () => {
      if (abortInfo.is) {
        throw new GenericServerError(abortInfo.message)
      }
    }

    isMaintenance &&
      (await this.maintenance({
        processingType,
        resourceCategory,
        resourceValue,
        interval: intervalBase * 5
      }).catch(e => this.log.error(e)))

    isPreWait &&
      (await this.waitStatusUpdate({
        processingType,
        resourceCategory,
        resourceValue,
        beforeStatus: PROCESSING_STATUS.PROCESSING,
        interval: intervalBase
      }).catch(e => this.log.error(e)))

    const psm = await this.startProcessing({
      processingType,
      resourceCategory,
      resourceValue,
      limitProcessing,
      status: PROCESSING_STATUS.PROCESSING,
      rerunCount: 3
    }).catch(e => this.log.error(e))

    if (!psm) {
      waitUntilComplete &&
        (await this.waitStatusUpdate({
          processingType,
          resourceCategory,
          resourceValue,
          beforeStatus: PROCESSING_STATUS.PROCESSING,
          interval: intervalBase * 2
        }).catch(e => this.log.error(e)))

      if (typeof breakProcessing === 'function') {
        breakProcessing()
      }
      return
    }

    const isProcessing = { val: true }
    this.noticeProcessing({
      id: psm.id,
      status: PROCESSING_STATUS.PROCESSING,
      interval: intervalBase,
      isProcessing,
      timeout: 60 * 60 * 1000,
      abortInfo
    }).catch(e => this.log.error(e))

    try {
      return await mainProcessing(abortProcess)
    } finally {
      isProcessing.val = false
      await this.endProcessing({ id: psm.id })
    }
  }
}

module.exports = ProcessingStatusManagementsDbCloudAdapter
