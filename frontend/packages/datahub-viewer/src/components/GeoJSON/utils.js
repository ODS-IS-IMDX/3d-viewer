// Copyright (c) 2025 NTT InfraNet
// @flow
import { VerticalOrigin, HeightReference } from 'cesium'

import { mapPointBuilding } from 'assets/img/map-point-building.js'
import { mapPointCaution } from 'assets/img/map-point-caution.js'
import { mapPointChain } from 'assets/img/map-point-chain.js'
import { mapPointConstructionWorker } from 'assets/img/map-point-construction-worker.js'
import { mapPointDrone } from 'assets/img/map-point-drone.js'
import { mapPointFlag } from 'assets/img/map-point-flag.js'
import { mapPointMeasure } from 'assets/img/map-point-measure.js'
import { mapPointPin } from 'assets/img/map-point-pin.js'
import { mapPointPinWhite } from 'assets/img/map-point-pin-white.js'
import { mapPointRecord } from 'assets/img/map-point-record.js'
import { mapPointTriangularCone } from 'assets/img/map-point-triangular-cone.js'
import { mapPointTruck } from 'assets/img/map-point-truck.js'
import { mapPointTs } from 'assets/img/map-point-ts.js'
import { mapPointCircle } from 'assets/img/map-point-circle.js'
import { plusCircleSvg } from 'assets/img/plusCircle.js'

import { convertCoordinatesToCartesian3, newCartesian3 } from 'utils/cesium'
import { trimId } from 'utils/geojson'
import { PointIcon } from './constants'
import type { PointIconType, IconProperty } from './types'

export const generateBillboardProperty = (
  icon: IconProperty,
  zIndex: number
) => {
  const iconSvg = getIconSvg(icon)

  return {
    color: null,
    eyeOffset: newCartesian3(0, 0, zIndex),
    height: iconSvg.size,
    heightReference: HeightReference.NONE,
    image: iconSvg.svg,
    verticalOrigin: VerticalOrigin.BOTTOM,
    width: iconSvg.size
  }
}

const getIconSvg = (icon: IconProperty): { svg: ?string, size: number } => {
  const MAP_ICON_SIZE_PX_DEFAULT = 40
  const MAP_ICON_SIZE_PX_SMALL = 20

  let iconType: PointIconType = icon.type

  if (!iconType) {
    return { svg: null, size: 0 }
  }

  const iconTypeToSvg = {
    [PointIcon.BUILDING]: {
      svg: mapPointBuilding,
      size: MAP_ICON_SIZE_PX_DEFAULT
    },
    [PointIcon.CAUTION]: {
      svg: mapPointCaution,
      size: MAP_ICON_SIZE_PX_DEFAULT
    },
    [PointIcon.CHAIN]: { svg: mapPointChain, size: MAP_ICON_SIZE_PX_DEFAULT },
    [PointIcon.CONSTRUCTION_WORKER]: {
      svg: mapPointConstructionWorker,
      size: MAP_ICON_SIZE_PX_DEFAULT
    },
    [PointIcon.DRONE]: { svg: mapPointDrone, size: MAP_ICON_SIZE_PX_DEFAULT },
    [PointIcon.FLAG]: { svg: mapPointFlag, size: MAP_ICON_SIZE_PX_DEFAULT },
    [PointIcon.MEASURE]: {
      svg: mapPointMeasure,
      size: MAP_ICON_SIZE_PX_DEFAULT
    },
    [PointIcon.PIN]: { svg: mapPointPin, size: MAP_ICON_SIZE_PX_DEFAULT },
    [PointIcon.PIN_WHITE]: {
      svg: mapPointPinWhite,
      size: MAP_ICON_SIZE_PX_DEFAULT
    },
    [PointIcon.PLUS_CIRCLE]: {
      svg: plusCircleSvg,
      size: MAP_ICON_SIZE_PX_SMALL
    },
    [PointIcon.RECORD]: { svg: mapPointRecord, size: MAP_ICON_SIZE_PX_DEFAULT },
    [PointIcon.TRIANGULAR_CONE]: {
      svg: mapPointTriangularCone,
      size: MAP_ICON_SIZE_PX_DEFAULT
    },
    [PointIcon.TRUCK]: { svg: mapPointTruck, size: MAP_ICON_SIZE_PX_DEFAULT },
    [PointIcon.TS]: { svg: mapPointTs, size: MAP_ICON_SIZE_PX_DEFAULT },
    [PointIcon.CIRCLE]: { svg: mapPointCircle, size: MAP_ICON_SIZE_PX_DEFAULT },
    [PointIcon.NONE]: { svg: null, size: MAP_ICON_SIZE_PX_DEFAULT }
  }

  if (!(iconType in iconTypeToSvg)) {
    iconType = PointIcon.PIN
  }

  if ('options' in icon) {
    iconTypeToSvg[iconType] = {
      svg: exportSVG(
        iconTypeToSvg[iconType].svg.replace(
          /fill:#(.{6})/g,
          'fill:' + icon.options.color
        )
      ),
      size: iconTypeToSvg[iconType].size
    }
  } else {
    iconTypeToSvg[iconType] = {
      svg: exportSVG(iconTypeToSvg[iconType].svg),
      size: iconTypeToSvg[iconType].size
    }
  }

  return iconTypeToSvg[iconType]
}
export const exportSVG = (svg: string) => {
  // https://developer.mozilla.org/en/DOM/window.btoa;
  return 'data:image/svg+xml;base64,' + btoa(svg)
}

export const isPointValid = coordinates => {
  // 座標値が配列か
  if (Array.isArray(coordinates)) {
    // 座標値が2次元配列か
    if (Array.isArray(coordinates[0])) {
      // 座標値が少なくとも緯度経度の2つの値を持っていない場合
      if (coordinates[0].length < 2) {
        return false
      }
      // 座標値が少なくとも緯度経度の2つの値を持っていない場合
    } else if (coordinates.length < 2) {
      return false
    }
  } else {
    return false
  }
  return true
}

export const convertCoordinatesToPointPosition = coordinates => {
  // 座標値が2次元配列の場合
  if (Array.isArray(coordinates[0])) {
    return convertCoordinatesToCartesian3(...trimId(coordinates[0]))
    // 座標値が1次元配列の場合
  } else {
    return convertCoordinatesToCartesian3(...trimId(coordinates))
  }
}

export const changeBillboardColor = ({ entity, iconType, color }) => {
  entity.billboard = generateBillboardProperty(
    {
      type: iconType,
      options: { color }
    },
    0
  )
  entity.viewer &&
    entity.viewer.scene.requestRenderMode &&
    entity.viewer.scene.requestRender()
}

export const getIconColor = (iconType: string): string | null => {
  const icon = {
    [PointIcon.BUILDING]: mapPointBuilding,
    [PointIcon.CAUTION]: mapPointCaution,
    [PointIcon.CHAIN]: mapPointChain,
    [PointIcon.CONSTRUCTION_WORKER]: mapPointConstructionWorker,
    [PointIcon.DRONE]: mapPointDrone,
    [PointIcon.FLAG]: mapPointFlag,
    [PointIcon.MEASURE]: mapPointMeasure,
    [PointIcon.PIN]: mapPointPin,
    [PointIcon.PIN_WHITE]: mapPointPinWhite,
    [PointIcon.PLUS_CIRCLE]: plusCircleSvg,
    [PointIcon.RECORD]: mapPointRecord,
    [PointIcon.TRIANGULAR_CONE]: mapPointTriangularCone,
    [PointIcon.TRUCK]: mapPointTruck,
    [PointIcon.TS]: mapPointTs,
    [PointIcon.CIRCLE]: mapPointCircle
  }[iconType]

  if (!icon || !icon.match(/fill:#(.{6})/g)) {
    return null
  }
  return icon.match(/fill:#(.{6})/g)[0].replaceAll('fill:', '')
}
