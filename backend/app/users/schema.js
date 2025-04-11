// Copyright (c) 2025 NTT InfraNet
'use strict'
/**
 * Fastify schema for User accounts
 * @module app/users/schema
 */

const _pick = require('lodash/pick')

/**
 * Generate a fastify schema for user account requests
 *
 * @function getRequestUserSchema
 * @param {Object} param
 * @param {Object} param.allowed An string array of allowed schema properties
 * @returns {Object} A fastify schema
 * @memberof app/users/schema
 */
const getRequestUserSchema = (fastify, { allowed = ['id'] }) => {
  const schema = {
    id: {
      description: 'The user identifier',
      type: 'string',
      maxLength: 36
    },
    firstName: {
      description: 'The user first name',
      type: 'string',
      maxLength: 45
    },
    lastName: {
      description: 'The user last name',
      type: 'string',
      maxLength: 45
    },
    title: { description: 'The user title', type: 'string', maxLength: 255 },
    company: {
      description: 'The user company',
      type: 'string',
      maxLength: 255
    },
    phone: { description: 'The user phone', type: 'string', maxLength: 32 },
    email: { description: 'The user email', type: 'string', format: 'email' },
    disabled: {
      description: 'User account status',
      type: 'boolean',
      default: false
    },
    language: {
      description: 'The user language',
      type: 'string',
      enum: ['en', 'jp', 'zh'],
      default: 'en'
    },
    timezone: fastify.getSchema('timezone')
  }
  return _pick(schema, allowed)
}

/**
 * Generate a fastify schema for user account responses
 *
 * @function getResponseUserSchema
 * @param {Object} param
 * @param {Object} param.allowed An string array of allowed schema properties
 * @returns {Object} A fastify schema
 * @memberof app/users/schema
 */
const getResponseUserSchema = (fastify, { allowed = ['id'] }) => {
  const schema = {
    id: {
      description: 'The user identifier',
      type: 'string'
    },
    firstName: {
      description: 'The user first name',
      type: 'string',
      maxLength: 45
    },
    lastName: {
      description: 'The user last name',
      type: 'string',
      maxLength: 45
    },
    title: { description: 'The user title', type: 'string', maxLength: 255 },
    company: {
      description: 'The user company',
      type: 'string',
      maxLength: 255
    },
    phone: { description: 'The user phone', type: 'string', maxLength: 32 },
    email: { description: 'The user email', type: 'string', format: 'email' },
    disabled: {
      description: 'User account status',
      type: 'boolean',
      default: false
    },
    role: {
      description: 'The user role',
      type: 'string',
      enum: ['admin', 'user']
    },
    language: {
      description: 'The user language',
      type: 'string',
      enum: ['en', 'jp', 'zh']
    },
    firstLogin: {
      description: 'The first login, if null the user has not logged in yet.',
      type: 'string',
      nullable: true
    },
    timezone: fastify.getSchema('timezone'),
    createdAt: fastify.getSchema('createdAt'),
    updatedAt: fastify.getSchema('updatedAt'),
    deletedAt: fastify.getSchema('deletedAt')
  }

  return _pick(schema, allowed)
}

module.exports = { getRequestUserSchema, getResponseUserSchema }
