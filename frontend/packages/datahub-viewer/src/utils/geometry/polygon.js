// Copyright (c) 2025 NTT InfraNet
// @flow
import {
  point as turfPoint,
  lineString as turfLineString,
  polygon as turfPolygon
} from '@turf/helpers'
import turfKinks from '@turf/kinks'
import turfBooleanPointOnLine from '@turf/boolean-point-on-line'

export type Point = [number, number, number]

export type Segment = [Point, Point]

export const MIN_POLYGON_POINTS = 3

const extractLineSegments = (points: Array<Point>): Array<Segment> => {
  return points.map((point, index) => {
    const p1 = point
    const p2 = points[index === points.length - 1 ? 0 : index + 1]

    return [p1, p2]
  })
}

// 多角形の座標値が正常であるか判定
export const validatePolygon = (points: Array<Point>): boolean => {
  if (!Array.isArray(points)) return false

  if (!isNumberPointsLonLat(points)) return false

  if (points.length < MIN_POLYGON_POINTS) return false

  if (isPointsSamePosition(points)) return false

  if (isPointOnLine(points)) return false

  if (hasCrossingLines(points)) return false

  return true
}

// 緯度経度が数値か確認
const isNumberPointsLonLat = (points: Array<Point>): boolean => {
  const isNotNumberLonLat = point => {
    const [lon, lat] = point
    return !(typeof lon === 'number' && typeof lat === 'number')
  }
  return !points.some(isNotNumberLonLat)
}

// 複数の頂点が同一座標にあるか判定を行う
const isPointsSamePosition = (points: Array<Point>): boolean => {
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (points[i][0] === points[j][0] && points[i][1] === points[j][1]) {
        return true
      }
    }
  }
  return false
}

// 頂点が多角形の辺上にあるか判定
const isPointOnLine = (points: Array<Point>): boolean => {
  const segments = extractLineSegments(points)
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < segments.length; j++) {
      const point = turfPoint(points[i])
      const line = turfLineString(segments[j])
      if (turfBooleanPointOnLine(point, line, { ignoreEndVertices: true })) {
        return true
      }
    }
  }
  return false
}

// 多角形の辺が交差しているか判定
const hasCrossingLines = (points: Array<Point>): boolean => {
  // 交差している点を取得
  var kinks = turfKinks(turfPolygon([[...points, points[0]]]))
  return kinks.features.length > 0
}
