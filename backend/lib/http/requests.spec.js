// Copyright (c) 2025 NTT InfraNet
const tap = require('tap')
const requests = require('./requests')

tap.test('requests/getItemResponse with default values', async t => {
  const response = requests.getCollectionRequestParamsSchema({
    allowed: [
      'created',
      'updated',
      'deleted',
      'offset',
      'limit',
      'sort',
      'direction',
      'filter',
      'showdeleted'
    ]
  })

  t.same(response, {
    created: {
      description:
        'An ISO8601 date. When used, results will only include entries whose createdAt date-time matches. Example value: 2007-03-01',
      type: 'string',
      format: 'date-time'
    },
    updated: {
      description:
        'An ISO8601 date. When used, results will only include entries whose updatedAt date-time matches. Example value: 2007-03-01',
      type: 'string',
      format: 'date-time'
    },
    deleted: {
      description:
        'An ISO8601 date. When used, results will only include entries whose deletedAt date-time matches. Example value: 2007-03-01',
      type: 'string',
      format: 'date-time'
    },
    offset: {
      description:
        'Given a collection of results, the numeric offset (inclusive) of the first item to return',
      type: 'integer',
      minimum: 0
    },
    limit: {
      description: 'The total number of entries to include in a given response',
      type: 'integer',
      minimum: 1,
      maximum: 10000
    },
    showdeleted: {
      description:
        'If set to true and the user is authorized, returns the element even if was deleted',
      type: 'boolean'
    },
    sort: {
      description: 'A string containing the sort attribute (e.g. name)',
      type: 'string',
      enum: null
    },
    direction: {
      description: 'The sort direction',
      type: 'string',
      enum: ['ASC', 'DESC']
    },
    filter: {
      description:
        'A string to filter the results, every API define which attributes are used to apply the filter',
      type: 'string'
    }
  })
})

tap.test('requests/getItemResponse', async t => {
  const response = requests.getCollectionRequestParamsSchema({
    allowedSortValues: ['name', 'created'],
    pageSize: 10,
    allowedLimitValues: [10, 20],
    allowed: [
      'created',
      'updated',
      'deleted',
      'offset',
      'limit',
      'sort',
      'direction',
      'filter',
      'showdeleted'
    ]
  })

  t.same(response, {
    created: {
      description:
        'An ISO8601 date. When used, results will only include entries whose createdAt date-time matches. Example value: 2007-03-01',
      type: 'string',
      format: 'date-time'
    },
    updated: {
      description:
        'An ISO8601 date. When used, results will only include entries whose updatedAt date-time matches. Example value: 2007-03-01',
      type: 'string',
      format: 'date-time'
    },
    deleted: {
      description:
        'An ISO8601 date. When used, results will only include entries whose deletedAt date-time matches. Example value: 2007-03-01',
      type: 'string',
      format: 'date-time'
    },
    offset: {
      description:
        'Given a collection of results, the numeric offset (inclusive) of the first item to return',
      type: 'integer',
      minimum: 0
    },
    limit: {
      description: 'The total number of entries to include in a given response',
      type: 'integer',
      minimum: 1,
      maximum: [10, 20],
    },
    showdeleted: {
      description:
        'If set to true and the user is authorized, returns the element even if was deleted',
      type: 'boolean'
    },
    sort: {
      description: 'A string containing the sort attribute (e.g. name)',
      type: 'string',
      enum: ['name', 'created']
    },
    direction: {
      description: 'The sort direction',
      type: 'string',
      enum: ['ASC', 'DESC']
    },
    filter: {
      description:
        'A string to filter the results, every API define which attributes are used to apply the filter',
      type: 'string'
    }
  })
})
