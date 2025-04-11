// Copyright (c) 2025 NTT InfraNet
'use strict'

const { httpClient } = require('../utils/http-client')

// [MEMO] Survey Calculation Site - Geoid High
// https://vldb.gsi.go.jp/sokuchi/surveycalc/api_help.html
module.exports.getGeoidHeight = async (latitude, longitude) => {
  const {
    data: {
      OutputData
    }
  } = await httpClient({
    method: 'GET',
    baseUrl: 'http://vldb.gsi.go.jp/sokuchi/surveycalc/geoid/calcgh/cgi/geoidcalc.pl',
    queryParameters: {
      outputType: 'json',
      latitude,
      longitude
    }
  })

  return OutputData ? Number(OutputData.geoidHeight) : null
}
