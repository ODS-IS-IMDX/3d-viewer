// Copyright (c) 2025 NTT InfraNet
const turf = require('@turf/turf')

const METER_DISTANCE = 3000

const createSiteDefaultStructure = ({
  lat,
  lng,
  distance = METER_DISTANCE
}) => {
  const point = turf.point([lng, lat])
  const buffer = turf.buffer(point, distance, { units: 'meters' })
  const bbox = turf.bbox(buffer)

  const [left, bottom, right, top] = bbox
  const polygonArea = turf.bboxPolygon(bbox)

  const location = {
    lat,
    lng,
    zoom: 17,
    bounds: { top, left, right, bottom }
  }

  return { location, polygonArea }
}

export default createSiteDefaultStructure
