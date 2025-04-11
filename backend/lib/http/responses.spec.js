// Copyright (c) 2025 NTT InfraNet
const tap = require('tap')
const responses = require('./responses')

tap.test('responses/getItemResponse', async t => {
  const response = responses.getItemResponse({
    type: 'site',
    data: { foo: 'bar' }
  })

  t.same(response, {
    statusCode: 200,
    data: {
      description: 'The data of the response',
      site: { foo: 'bar' }
    }
  })
})

tap.test('responses/getItemResponseSchema with default values', async t => {
  const schema = responses.getItemResponseSchema({
    type: 'site',
    itemSchema: { type: 'object' }
  })

  t.same(schema, {
    description: '',
    type: 'object',
    additionalProperties: false,
    properties: {
      statusCode: {
        type: 'integer',
        description: 'HTTP status code of the response',
        examples: [200]
      },
      data: {
        type: 'object',
        description: 'The data of the response',
        properties: {
          site: {
            type: 'object',
            description: 'The data of the site',
            properties: { type: 'object' },
            required: undefined,
            examples: undefined,
            additionalProperties: false
          }
        }
      }
    }
  })
})

tap.test('responses/getItemResponseSchema', async t => {
  const schema = responses.getItemResponseSchema({
    type: 'site',
    itemSchema: { type: 'object' },
    description: 'Some description',
    additionalProperties: true
  })

  t.same(schema, {
    description: 'Some description',
    type: 'object',
    additionalProperties: false,
    properties: {
      statusCode: {
        type: 'integer',
        description: 'HTTP status code of the response',
        examples: [200]
      },
      data: {
        type: 'object',
        description: 'The data of the response',
        properties: {
          site: {
            type: 'object',
            description: 'The data of the site',
            properties: { type: 'object' },
            required: undefined,
            examples: undefined,
            additionalProperties: true
          }
        }
      }
    }
  })
})
