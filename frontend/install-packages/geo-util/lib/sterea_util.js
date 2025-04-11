'use strict'

const Proj4 = require('proj4')

module.exports = {
  /**
   * getProj4 - get proj4 string for sterea projection centered at lat/lon
   *
   * @param  {string} lat latitude of origin
   * @param  {string} lon longtitude of origin
   * @return {string}      proj4 string
   */
  getProj4: function (lat, lon) {
    return `+proj=sterea +lat_0=${lat} +lon_0=${lon} +k_0=1 +x_0=0 +y_0=0`
  },

  /**
   * getCoord - get projected coord from lat/lon
   * using oblique stereographic projection centered at lat0/lon0
   *
   * @param  {float} lat Latitude
   * @param  {float} lon Longitude
   * @return {object}     {northing, easting, utm zone}
   */
  getCoord: function (lat, lon, lat0, lon0) {
    const proj4str = this.getProj4(lat0, lon0)

    const point = Proj4(proj4str).forward([lon, lat])

    return {
      northing: point[1],
      easting: point[0]
    }
  },

  /**
   * getLatLon - get lat lon for given NE & origin
   *
   * @param  {float} n    northing
   * @param  {float} e    easting
   * @param  {float} lat0 latitude of origin
   * @param  {float} lon0 longitude of origin
   * @return {object}      {lat, lon}
   */
  getLatLon: function (n, e, lat0, lon0) {
    const proj4str = this.getProj4(lat0, lon0)
    const point = Proj4(proj4str).inverse([e, n])
    return {
      lon: point[0],
      lat: point[1]
    }
  }
}
