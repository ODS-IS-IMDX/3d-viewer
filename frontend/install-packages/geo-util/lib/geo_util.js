'use strict'

const Turf = require('@turf/turf')

module.exports = {
  /**
   * getCenter - get centroid of a set of coordinates
   *
   * @param  {array} coordinates [{lat: lat1, lon: lon1}, {lat: lat2, lon: lon2}, ...]
   * @return {type}             description
   */
  getCenter (coordinates) {
    const points = coordinates.map(coord => {
      return Turf.point([coord.lon, coord.lat])
    })
    const features = Turf.featureCollection(points)
    const center = Turf.center(features)
    const coord = Turf.getCoord(center)
    return {
      lon: coord[0],
      lat: coord[1]
    }
  }
}
