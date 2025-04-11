// Copyright (c) 2025 NTT InfraNet
'use strict'

const jwksClient = require('jwks-rsa')
const { rsaPublicKeyToPEM } = require('jwks-rsa/lib/utils')
const pify = require('pify')

const developmentJWKS = {
  keys: [
    {
      kty: 'RSA',
      e: 'AQAB',
      n:
        'v-uV-zRTqPg_f_pjbfWTckYkINmr6lAwULiEep9bqsTZKy15jGY1cKqfvc231vXUWn02P8J40QorPpEjrKP31qfRkmB1hgqr_AHW7o9CvaxAuCM92D2VcXSTl3zTPE73_tU21FsEut2yU59PqG5lt3bR6UmvKx44c6xiFTRuwhaM9UUOpqMPwiBv8NLnId64zx1yRxb8ikWvbbjKndrcDFWxUBgJn51FQt9xS0276EPxOvwjl5bTHYxBjObHvv5uMMd-YY9RW08CNQZWOI4TtXKk6q4u-ymXgHeGAqeEvQz2qnJfFQUnFEHGacxJSkkG-bPhdyBMqb8DBjGvb-Mpmw',
      kid: 'R5DDVJwLhnVxmx_2ZAvUI_wsnpNJbKD9FTT8Xv6Q8Kw',
      use: 'at_sig'
    }
  ]
}

let client
let publicKey

/**
 * Get the public signing key
 *
 * @param {Object} req - The fastify request object
 * @param {Object} decoded - The decoded JWT
 * @param {Object} options - Plugin options
 * @returns {String} The Public Key
 * @throws {Error} InvalidSigningAlgorithm: Only RS256 is supported
 * @module lib/auth/get-signin-key
 */
const getSigningKey = async (req, decoded, options) => {
  if (options.jwksUri) {
    if (!client) {
      const opts = Object.assign(
        {
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 10,
          cacheMaxEntries: 10, // Default value
          cacheMaxAge: 10 * 60 * 60 * 1000 // Default value
        },
        options
      )

      client = jwksClient(opts)
    }
    if (!decoded.header || decoded.header.alg !== 'RS256') {
      throw new Error('InvalidSigningAlgorithm: Only RS256 is supported')
    }
    const key = await pify(client.getSigningKey)(decoded.header.kid)

    return key.publicKey || key.rsaPublicKey
  } else {
    if (decoded.header.kid !== developmentJWKS.keys[0].kid) {
      throw new Error(
        `Unable to find a signing key that matches '${decoded.header.kid}'`
      )
    }

    if (publicKey) {
      return publicKey
    }

    publicKey = rsaPublicKeyToPEM(
      developmentJWKS.keys[0].n,
      developmentJWKS.keys[0].e
    )
    return publicKey
  }
}

module.exports = getSigningKey
