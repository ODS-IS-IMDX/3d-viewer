// Copyright (c) 2025 NTT InfraNet
const timezonesJson = require('timezones.json')
const { orderBy } = require('lodash')

/**
 * Get an ordered list of timezones
 *
 * @returns {Array} A list of timezones
 * @module lib/utils/timezones
 */
module.exports = orderBy(
  timezonesJson.reduce(
    (acc, tz) => [
      ...acc,
      ...tz.utc
        .filter(value => !acc.find(utc => utc.value === value))
        .map(utc => {
          const offset = tz.isdst ? tz.offset - 1 : tz.offset
          return {
            value: utc,
            label: `${utc} (${offset > 0 ? '+' : ''}${offset})`,
            offset: offset,
            tz
          }
        })
    ],
    []
  ),
  ['offset', 'value']
)
