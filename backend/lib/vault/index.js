// Copyright (c) 2025 NTT InfraNet
const vault = require('./vault-iam-auth')

/**
 * Vault Module
 * @module lib/vault
 */

/**
 * Get a vault secret
 *
 * @param {Object} params
 * @param {String} params.token - Token to use
 * @param {String} params.role - Role to secret
 * @param {String} params.path - Path to secret
 * @returns {Object} The required secret
 * @throws A process ending exception.
 * @todo Verify these options.
 * @memberof lib/vault
 */
const getSecret = async ({ token, role, path }) => {
  const client = await vault({ token, role })
  return client.read(path)
}

/**
 * Get dummy vault secret for the test environemnt
 * The request for secrets requires ~0.8 seconds to run and slow down the tests
 * furthermore the test should be run even if the connection is down, everything should work locally
 *
 * @returns {Object} The required dummy secret
 * @memberof lib/vault
 */
const getSecretsForTest = () => ({
  request_id: 'feafc43a-d5d0-cfc5-6d2a-123456789987',
  lease_id: '',
  renewable: false,
  lease_duration: 2764800,
  data: {
    AWS_CF_PK:
      '-----BEGIN RSA PRIVATE KEY-----\nSOME INVALID TEST PK\n-----END RSA PRIVATE KEY-----',
    TEST_CLIENT_SECRET: ''
  },
  wrap_info: null,
  warnings: null,
  auth: null
})

exports.getSecret =
  process.env.EHV_IS_DOCKER_CONTAINER !== 'true' ? getSecretsForTest : getSecret

/**
 * Get database credentials
 *
 * @param {Object} params
 * @param {Object} [params.token] - Token to use
 * @param {Object} [ref] - A reference object
 * @param {String} [ref.user] - The username reference
 * @param {String} [ref.password] - The password reference
 * @returns {Object} The required database credentials
 * @throws A process ending exception.
 * @todo Verify these options.
 * @memberof lib/vault
 */
exports.getDatabaseCredentials = async (params, ref) => {
  const { data } = await getSecret(params)
  if (ref) {
    ref.user = data.username
    ref.password = data.password
  }

  return data
}
