'use strict'

const Proj4 = require('proj4').default || require('proj4')
const GsiGeoid = require('./gsigeoidmap')

Proj4.defs(
  'EPSG:6669',
  '+proj=tmerc +lat_0=33 +lon_0=129.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6670',
  '+proj=tmerc +lat_0=33 +lon_0=131 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6671',
  '+proj=tmerc +lat_0=36 +lon_0=132.166666666667 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6672',
  '+proj=tmerc +lat_0=33 +lon_0=133.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6673',
  '+proj=tmerc +lat_0=36 +lon_0=134.333333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6674',
  '+proj=tmerc +lat_0=36 +lon_0=136 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6675',
  '+proj=tmerc +lat_0=36 +lon_0=137.166666666667 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6676',
  '+proj=tmerc +lat_0=36 +lon_0=138.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6677',
  '+proj=tmerc +lat_0=36 +lon_0=139.833333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6678',
  '+proj=tmerc +lat_0=40 +lon_0=140.833333333333 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6679',
  '+proj=tmerc +lat_0=44 +lon_0=140.25 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6680',
  '+proj=tmerc +lat_0=44 +lon_0=142.25 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6681',
  '+proj=tmerc +lat_0=44 +lon_0=144.25 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6682',
  '+proj=tmerc +lat_0=26 +lon_0=142 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6683',
  '+proj=tmerc +lat_0=26 +lon_0=127.5 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6684',
  '+proj=tmerc +lat_0=26 +lon_0=124 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6685',
  '+proj=tmerc +lat_0=26 +lon_0=131 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6686',
  '+proj=tmerc +lat_0=20 +lon_0=136 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)
Proj4.defs(
  'EPSG:6687',
  '+proj=tmerc +lat_0=26 +lon_0=154 +k=0.9999 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
)

/**
 * 平面直角座標から緯度経度を計算
 * @param {number} epsgCode EPSGコード(6669～6687)
 * @param {number} x Ｘ座標(東方向偏移量)
 * @param {number} y Ｙ座標(北方向偏移量)
 * @returns {{ lat: number, lon: number }} 緯度経度
 */
module.exports.getLatLonByXY = (epsgCode, x, y) => {
  if (typeof epsgCode !== 'number') {
    throw new Error('epsgCode is not a number')
  }
  if (epsgCode > 6687 || epsgCode < 6669) {
    throw new Error('epsgCode should be between 6669 and 6687')
  }
  const [lon, lat] = Proj4(`EPSG:${epsgCode}`, 'EPSG:4326', [y, x])
  if (lat === Infinity || lon === Infinity) {
    throw new Error('Can not calculate the result')
  }
  return { lat, lon }
}

/**
 * 緯度経度からジオイド高を計算(Source Data: gsigeo2011_ver2.asc)
 * @param {number} lat 緯度
 * @param {number} lon 経度
 * @returns {number} ジオイド高
 */
module.exports.getGeoidHeight = (lat, lon) => {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('lat or lon is not a number')
  }
  return new GsiGeoid().getGeoid(lat, lon)
}
