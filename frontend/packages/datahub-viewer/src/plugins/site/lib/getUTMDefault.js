// Copyright (c) 2025 NTT InfraNet
// @flow

import utmUtil from '@ehv/geo-util/lib/utm_util'
import turfCentroid from '@turf/centroid'
import type { Site, SiteCCRS } from '../reducer'

const getEPSGCode = utmUtil.getEPSGCode.bind(utmUtil)
const getZone = utmUtil.getZone.bind(utmUtil)
const getProj4 = utmUtil.getProj4.bind(utmUtil)

// returns the default ccrs for a site to prefill the coordinate system creation UI
const getUTMZoneCCRS = (site: Site) => {
  let zone, epsg, bbox, center

  try {
    if (site && site.location) {
      bbox =
        typeof site.location === 'string'
          ? JSON.parse(site.location)
          : site.location
      zone = getZone(bbox.lat, bbox.lng)
      epsg = getEPSGCode(bbox.lat, bbox.lng)
    } else {
      center = turfCentroid(site.polygonArea.geometry)
      zone = getZone(
        center.geometry.coordinates[1],
        center.geometry.coordinates[0]
      )
      epsg = getEPSGCode(
        center.geometry.coordinates[1],
        center.geometry.coordinates[0]
      )
    }
  } catch (e) {
    console.error(e) // eslint-disable-line
  }

  return {
    parameters: {
      code: epsg,
      geoid: '', // This means no geoid (this should be Height above Ellipsoid in the dropdown)
      projection: {
        epsgCode: epsg,
        proj4: getProj4(zone)
      },
      translation: {},
      rotation: {},
      verticalShift: {}
    }
  }
}

const getUTMDefault = (site: Site): SiteCCRS => ({
  name: 'UTM (Default)',
  type: 'UTM',
  rawControlPoints: [],
  version: 0,
  ...getUTMZoneCCRS(site)
})

export default getUTMDefault
