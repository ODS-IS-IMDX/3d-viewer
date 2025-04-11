// Copyright (c) 2025 NTT InfraNet
// @flow

import type { SiteCCRS } from '../reducer'

const getGeodeticCCRS = (geoid, projection, projectionCode): SiteCCRS => ({
  name: 'Geodetic (projection + geoid)',
  type: 'GEODETIC',
  rawControlPoints: [],
  version: 0,
  parameters: {
    geoid: geoid,
    projection: {
      epsgCode: projectionCode,
      proj4: projection.proj4,
      params: {}
    }
  }
})

export default getGeodeticCCRS
