// Copyright (c) 2025 NTT InfraNet
'use strict'
const SQL = require('@nearform/sql')
const mapAttributeForSorting = require('./map-attribute-for-sorting')
const { convertDataToSQLParam } = require('./convert')

/**
 * Database filter utilities
 * @module lib/utils/db-filters
 */

/**
 * Add Id filter clause to a SQL query
 *
 * @function addIdFilter
 * @param {Object} query - The SQL query
 * @param {Object} options
 * @param {String} options.id - The id to filter on
 * @param {Object} filter
 * @param {Boolean} filter.exists - If true uses `AND`, otherwise uses `WHERE`
 * @memberof lib/utils/db-filters
 */

const addIdFilter = (
  query,
  options,
  filter = { exists: false },
  tableName = ''
) => {
  if (options.id) {
    !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)
    query.append(SQL`${tableName !== '' ? tableName + '.' : ''}id = `, {
      unsafe: true
    })
    query.append(SQL`${options.id} `)
    filter.exists = true
  }
}

/**
 * Add Site Id filter to a SQL query
 *
 * @function addSiteIdFilter
 * @param {Object} query - The SQL query
 * @param {Object} options
 * @param {String} options.siteId - The id to filter on
 * @param {Object} filter
 * @param {Boolean} filter.exists - If true uses `AND`, otherwise uses `WHERE`
 * @param {String} tableName - The table name to include
 * @memberof lib/utils/db-filters
 */

const addSiteIdFilter = (
  query,
  options,
  filter = { exists: false },
  tableName = ''
) => {
  !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)

  query.append(SQL`${tableName !== '' ? tableName + '.' : ''}contentId = `, {
    unsafe: true
  })
  query.append(SQL`${options.siteId} `)

  filter.exists = true
}

/**
 * Add Dataset Id filter to a SQL query
 *
 * @function addDatasetIdFilter
 * @param {Object} query - The SQL query
 * @param {Object} options
 * @param {String} options.datasetId - The id to filter on
 * @param {Object} filter
 * @param {Boolean} filter.exists - If true uses `AND`, otherwise uses `WHERE`
 * @param {String} tableName - The table name to include
 * @memberof lib/utils/db-filters
 */

const addDatasetIdFilter = (
  query,
  options,
  filter = { exists: false },
  tableName = ''
) => {
  !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)

  query.append(SQL`${tableName !== '' ? tableName + '.' : ''}datasetId = `, {
    unsafe: true
  })
  query.append(SQL`${options.datasetId} `)

  filter.exists = true
}

/**
 * Add Date filter to a SQL query based on created, updated or delete timestamp
 *
 * @function addDateFilter
 * @param {Object} query - The SQL query
 * @param {Object} options
 * @param {String} [options.created] - The created timestamp
 * @param {String} [options.updated] - The updated timestamp
 * @param {String} [options.deleted] - The deleted timestamp
 * @param {Object} filter
 * @param {Boolean} filter.exists - If true uses `AND`, otherwise uses `WHERE`
 * @param {String} tableName - The table name to include
 * @returns {Boolean} True if filtered, filter.exists value otherwise.
 * @memberof lib/utils/db-filters
 */

const addDateFilter = (
  query,
  options,
  filter = { exists: false },
  tableName = ''
) => {
  if (options.created) {
    !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)
    query.append(
      SQL` DATE(${tableName !== '' ? tableName + '.' : ''}createdAt) = `,
      {
        unsafe: true
      }
    )
    query.append(SQL` ${options.created} `)
    filter.exists = true
    return true
  }
  if (options.updated) {
    !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)
    query.append(SQL` DATE(${tableName ? tableName + '.' : ''}updatedAt) = `, {
      unsafe: true
    })
    query.append(SQL` ${options.updated} `)
    filter.exists = true
    return true
  }
  if (options.deleted) {
    !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)
    query.append(SQL` DATE(${tableName ? tableName + '.' : ''}deletedAt) = `, {
      unsafe: true
    })
    query.append(SQL` ${options.deleted} `)
    filter.exists = true
    return true
  }
  return filter.exists
}

/**
 * Add pagination filter to an SQL query
 *
 * @function addPaginationFilter
 * @param {Object} query - The SQL query
 * @param {Object} options
 * @param {String} options.sort - Sort by createdAt, updatedAt or deletedAt
 * @param {String} options.direction - Sort direction (ASC, DESC)
 * @param {Array} options.orderInfo - Sort information
 * @param {number} options.offset - Row offset for pagination
 * @param {number} options.limit - Row limit for pagination
 * @param {String} [options.tableName] - The table name to include
 * @memberof lib/utils/db-filters
 * @todo The security oth the ORDERBY clause is managed by the router filter. Investigate a better solution.
 */

const addPaginationFilter = (
  query,
  { sort, direction, orderInfo = [], uniqueColumn = 'id', offset, limit },
  tableName
) => {
  const orderByBase = ` ORDER BY `
  let addQuery = ``
  const orderByList =
    sort && direction ? [{ sort, direction }].concat(orderInfo) : orderInfo

  if (Array.isArray(orderByList) && orderByList.length) {
    addQuery = orderByList.reduce((acc, cur) => {
      if (cur.sort && cur.direction) {
        acc = `${acc.length ? `${acc}, ` : `${orderByBase}`}${
          tableName ? tableName + '.' : ''
        }${mapAttributeForSorting(cur.sort)} ${cur.direction}`
      }
      return acc
    }, '')
  }

  if (Number.isFinite(limit) && limit >= 0) {
    addQuery = `${addQuery.length ? `${addQuery}, ` : orderByBase}${
      tableName ? tableName + '.' : ''
    }${mapAttributeForSorting(uniqueColumn)} LIMIT ${limit}`

    if (Number.isFinite(offset) && offset >= 0) {
      addQuery = `${addQuery} OFFSET ${offset}`
    }
  }

  addQuery.length && query.append(SQL`${addQuery}`, { unsafe: true })
}

/**
 * Add filter for including/excluding deleted rows to an SQL query
 *
 * @function addShowNotDeletedFilter
 * @param {Object} query - The SQL query
 * @param {Object} options
 * @param {String} options.deleted - Deleted timestamp
 * @param {Boolean} options.showdeleted - Should we show deleted rows?
 * @param {String} [options.tableName] - The table name to include
 * @param {Object} filter
 * @param {Boolean} filter.exists - If true uses `AND`, otherwise uses `WHERE`
 * @returns {Boolean} True if filtered, filter.exists value otherwise.
 * @memberof lib/utils/db-filters
 */

const addShowNotDeletedFilter = (
  query,
  options,
  filter = { exists: false },
  tableName = ''
) => {
  if (!options.deleted && !options.showdeleted) {
    !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)
    query.append(
      SQL` ${tableName !== '' ? tableName + '.' : ''}deletedAt IS NULL `,
      {
        unsafe: true
      }
    )
    filter.exists = true
    return true
  }
  return filter.exists
}

/**
 * Add User Id filter to a SQL query
 *
 * @function addUserIdFilter
 * @param {Object} query - The SQL query
 * @param {Object} options
 * @param {String} options.userID - The id to filter on
 * @param {Object} filter
 * @param {Boolean} filter.exists - If true uses `AND`, otherwise uses `WHERE`
 * @memberof lib/utils/db-filters
 */

const addUserIdFilter = (
  query,
  options,
  filter = { exists: false },
  tableName = ''
) => {
  !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)
  query.append(SQL`${tableName !== '' ? tableName + '.' : ''}userId = `, {
    unsafe: true
  })
  query.append(SQL`${options.userId} `)
  filter.exists = true
}

/**
 * Add asset status filter to a SQL query
 *
 * @function addAssetStatusFilter
 * @param {Object} query - The SQL query
 * @param {Object} options
 * @param {String} options.status - The status to filter on
 * @param {Object} filter
 * @param {Boolean} filter.exists - If true uses `AND`, otherwise uses `WHERE`
 * @param {String} tableName - The table name to include
 * @memberof lib/utils/db-filters
 */

const addAssetStatusFilter = (
  query,
  options,
  filter = { exists: false },
  tableName = ''
) => {
  if (Array.isArray(options.status)) {
    !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)
    query.append(SQL`${tableName !== '' ? tableName + '.' : ''}status IN (`, {
      unsafe: true
    })
    var init = true
    for (const status of options.status.values()) {
      init ? query.append(SQL`${status}`) : query.append(SQL`,${status}`)
      init = false
    }
    query.append(SQL`) `)
  } else {
    !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)
    query.append(SQL`${tableName !== '' ? tableName + '.' : ''}status = `, {
      unsafe: true
    })
    query.append(SQL`${options.status} `)
  }
  filter.exists = true
}

/**
 * Add asset type filter to a SQL query
 *
 * @function addAssetTypeFilter
 * @param {Object} query - The SQL query
 * @param {Object} options
 * @param {String} options.type - The type to filter on
 * @param {Object} filter
 * @param {Boolean} filter.exists - If true uses `AND`, otherwise uses `WHERE`
 * @param {String} tableName - The table name to include
 * @memberof lib/utils/db-filters
 */

const addAssetTypeFilter = (
  query,
  options,
  filter = { exists: false },
  tableName = ''
) => {
  !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)
  query.append(SQL`${tableName !== '' ? tableName + '.' : ''}type = `, {
    unsafe: true
  })
  query.append(SQL`${options.type} `)

  filter.exists = true
}

/**
 * Add asset name filter to a SQL query
 *
 * @function addAssetNameFilter
 * @param {Object} query - The SQL query
 * @param {Object} options
 * @param {String} options.name - The name to filter on
 * @param {Object} filter
 * @param {Boolean} filter.exists - If true uses `AND`, otherwise uses `WHERE`
 * @param {String} tableName - The table name to include
 * @memberof lib/utils/db-filters
 */

const addAssetNameFilter = (
  query,
  options,
  filter = { exists: false },
  tableName = ''
) => {
  !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)
  query.append(SQL`${tableName !== '' ? tableName + '.' : ''}name = `, {
    unsafe: true
  })
  query.append(SQL`${options.name} `)

  filter.exists = true
}

/**
 * Add name filter to a SQL query
 *
 * @function addTypeFilter
 * @param {Object} query - The SQL query
 * @param {Object} options
 * @param {String} options.name - The name to filter on
 * @param {Object} filter
 * @param {Boolean} filter.exists - If true uses `AND`, otherwise uses `WHERE`
 * @param {String} tableName - The table name to include
 * @memberof lib/utils/db-filters
 */

const addNameFilter = (
  query,
  options,
  filter = { exists: false },
  tableName = ''
) => {
  !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)
  query.append(SQL`${tableName !== '' ? tableName + '.' : ''}name = `, {
    unsafe: true
  })
  query.append(SQL`${options.name} `)

  filter.exists = true
}

/**
 * Add type filter to a SQL query
 *
 * @function addTypeFilter
 * @param {Object} query - The SQL query
 * @param {Object} options
 * @param {String} options.type - The type to filter on
 * @param {Object} filter
 * @param {Boolean} filter.exists - If true uses `AND`, otherwise uses `WHERE`
 * @param {String} tableName - The table name to include
 * @memberof lib/utils/db-filters
 */

const addTypeFilter = (
  query,
  options,
  filter = { exists: false },
  tableName = ''
) => {
  !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)
  query.append(SQL`${tableName !== '' ? tableName + '.' : ''}type = `, {
    unsafe: true
  })
  query.append(SQL`${options.type} `)

  filter.exists = true
}

/**
 * Add annotation Id filter to a SQL query
 *
 * @function addAnnotationIdFilter
 * @param {Object} query - The SQL query
 * @param {Object} options
 * @param {String} options.annotationId - The id to filter on
 * @param {Object} filter
 * @param {Boolean} filter.exists - If true uses `AND`, otherwise uses `WHERE`
 * @param {String} tableName - The table name to include
 * @memberof lib/utils/db-filters
 */
const addAnnotationIdFilter = (
  query,
  options,
  filter = { exists: false },
  tableName = ''
) => {
  !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)

  query.append(SQL`${tableName !== '' ? tableName + '.' : ''}annotationId = `, {
    unsafe: true
  })
  query.append(SQL`${options.annotationId} `)

  filter.exists = true
}

/**
 * SQL条件に外部連携ファイル名を追加する
 *
 * @function addAnnotationIdFilter
 * @param {Object} query - The SQL query
 * @param {Object} options
 * @param {String} options.linkageFileName 外部連携ファイル名
 * @param {Object} filter
 * @param {Boolean} filter.exists - If true uses `AND`, otherwise uses `WHERE`
 * @param {String} tableName - The table name to include
 * @memberof lib/utils/db-filters
 */
const addLinkageFileNameFilter = (
  query,
  options,
  filter = { exists: false },
  tableName = ''
) => {
  !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)

  query.append(
    SQL`${tableName !== '' ? tableName + '.' : ''}linkageFileName = `,
    {
      unsafe: true
    }
  )
  query.append(SQL`${options.linkageFileName} `)

  filter.exists = true
}

/**
 * Add ehvAssetType filter to a SQL query
 *
 * @function addAssetNameFilter
 * @param {Object} query - The SQL query
 * @param {Object} options
 * @param {String} options.ehvAssetType - The ehvAssetType to filter on
 * @param {Object} filter
 * @param {Boolean} filter.exists - If true uses `AND`, otherwise uses `WHERE`
 * @param {String} tableName - The table name to include
 * @memberof lib/utils/db-filters
 */
const addEhvAssetTypeFilter = (
  query,
  options,
  filter = { exists: false },
  tableName = ''
) => {
  !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)
  query.append(SQL`${tableName !== '' ? tableName + '.' : ''}ehvAssetType = `, {
    unsafe: true
  })
  query.append(SQL`${options.ehvAssetType} `)

  filter.exists = true
}

/**
 * Add filter to a SQL query
 *
 * @function addColumnFilter
 * @param {Object} query - The SQL query
 * @param {Object} options
 * @param {String} options.column - Target column name
 * @param {Array}  options.value - Array ok
 * @param {Object} filter
 * @param {Boolean} filter.exists - If true uses `AND`, otherwise uses `WHERE`
 * @param {String} tableName - The table name to include
 * @memberof lib/utils/db-filters
 */

const addColumnFilter = (
  query,
  options,
  filter = { exists: false },
  tableName = ''
) => {
  !filter.exists ? query.append(SQL` WHERE `) : query.append(SQL` AND `)
  if (Array.isArray(options.value)) {
    query.append(
      SQL`${tableName !== '' ? tableName + '.' : ''}${options.column} IN (`,
      {
        unsafe: true
      }
    )
    const varsSql = options.value.map(c => SQL`${c}`)
    query.append(query.glue(varsSql, ', '))
    query.append(SQL`) `)
  } else {
    const comparison = options.comparison ? options.comparison : '='
    query.append(
      SQL`${tableName !== '' ? tableName + '.' : ''}${
        options.column
      } ${comparison} `,
      {
        unsafe: true
      }
    )
    query.append(SQL`${options.value} `)
  }
  filter.exists = true
}

/**
 * Generate insert query
 *
 * @function generateQueryInsert
 * @param {String} tableName - Target table name
 * @param {Object} insertData - Target insert data
 * @memberof lib/utils/db-filters
 */

const generateQueryInsert = (tableName, insertData) => {
  const builder = Object.entries(insertData).reduce(
    (acc, [column, value]) => {
      if (value !== undefined) {
        acc.columns.push(column)
        acc.values.push(SQL`${convertDataToSQLParam(value)}`)
      }
      return acc
    },
    { columns: [], values: [] }
  )
  return SQL`
    INSERT INTO ${SQL.quoteIdent(tableName)} (
      ${SQL.unsafe(builder.columns.join(', '))}
    ) VALUES (
      ${SQL.glue(builder.values, ', ')}
    )`
}

/**
 * Generate update query base (no where clause)
 *
 * @function generateQueryUpdate
 * @param {String} tableName - Target table name
 * @param {Object} updateData - Target update data
 * @memberof lib/utils/db-filters
 */

const generateQueryUpdateBase = (tableName, updateData, isUpdatedAt = true) => {
  const updates = Object.entries(updateData).reduce((acc, [column, value]) => {
    if (value !== undefined) {
      acc.push(
        SQL``
          .append(SQL`${column} = `, { unsafe: true })
          .append(SQL`${convertDataToSQLParam(value)}`)
      )
    }
    return acc
  }, [])
  isUpdatedAt && updates.push(SQL`updatedAt = now()`)

  return SQL`
    UPDATE ${SQL.quoteIdent(tableName)}
    SET ${SQL.glue(updates, ', ')}
  `
}

module.exports = {
  addIdFilter,
  addSiteIdFilter,
  addDatasetIdFilter,
  addDateFilter,
  addShowNotDeletedFilter,
  addPaginationFilter,
  addUserIdFilter,
  addAssetStatusFilter,
  addAssetTypeFilter,
  addAssetNameFilter,
  addNameFilter,
  addTypeFilter,
  addAnnotationIdFilter,
  addLinkageFileNameFilter,
  addEhvAssetTypeFilter,
  addColumnFilter,
  generateQueryInsert,
  generateQueryUpdateBase
}
