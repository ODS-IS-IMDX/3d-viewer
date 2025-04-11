// Copyright (c) 2025 NTT InfraNet
'use strict'
const timezones = require('../lib/utils/timezones')

/**
 * Common fastify schema types
 *
 * @param {Object} fastify - The fastify instance
 * @returns {Object} A fastify schema
 * @module lib/common-schema-types
 */
module.exports = fastify => {
  const schemas = [
    {
      $id: 'createdAt',
      description: 'The creation date',
      type: 'string',
      format: 'date-time'
    },
    {
      $id: 'updatedAt',
      description: 'The last modify date',
      type: 'string',
      format: 'date-time'
    },
    {
      $id: 'deletedAt',
      description: 'The delete date, if null the entity is not deleted',
      type: 'string',
      nullable: true
    },
    {
      $id: 'locked',
      description: 'If set to true the entity is readonly',
      type: 'boolean',
      examples: [false]
    },
    {
      $id: 'timezone',
      description: 'The timezone',
      type: 'string',
      enum: timezones.map(tz => tz.value),
      examples: ['Asia/Tokyo']
    },
    {
      $id: 'purge',
      type: 'string',
      enum: ['yes', 'no'],
      description:
        'If set to yes and the user is authorized, the entity is deleted permanently'
    },
    {
      $id: 'archivedAt',
      description: 'The archive date, if null the entity is not archived',
      type: 'string',
      nullable: true
    },
    {
      $id: 'startDateTime',
      description: '開始日時',
      type: 'string',
      format: 'date-time',
      nullable: true
    },
    {
      $id: 'endDateTime',
      description: '終了日時',
      type: 'string',
      format: 'date-time',
      nullable: true
    }
  ]

  fastify && schemas.map(schema => fastify.addSchema(schema))
  return schemas
}
