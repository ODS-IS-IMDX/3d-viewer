// Copyright (c) 2025 NTT InfraNet
// @flow
// cesium.jsについてのテストコードがないため作成する必要がある
// ただし、テスト実行時にCesiumのインポートが原因と思われるエラーが発生するので、エラーの解決が必要
// 発生するエラー： ReferenceError: requirejsVars is not defined
// import { memoize } from 'lodash'
import {
  Cartographic,
  Cartesian3,
  Cesium3DTileset,
  Color,
  computeFlyToLocationForRectangle,
  DataSource,
  Ellipsoid,
  Entity,
  EntityCollection,
  ImageryLayer,
  Ion,
  Math as CesiumMath,
  Matrix4,
  Material,
  sampleTerrainMostDetailed,
  Transforms,
  TimeDynamicPointCloud,
  PointCloudShading,
  Rectangle,
  Viewer,
  Cesium3DTileStyle,
  SceneMode,
  JulianDate
} from 'cesium'
import { createWorldTerrainAsync } from '@cesium/engine'
import { GP3DT_ID } from '../constants'
export { CLUSTER_DATASOURCE_NAME } from '../react-cesium'

type DegreesCoordinates = [number, number, number]

export const getPositionByCartographic = (viewer: Viewer): Cartographic => {
  const ellipsoid = viewer.scene.globe.ellipsoid
  const camera = viewer.camera
  return ellipsoid.cartesianToCartographic(camera.position)
}

export const convertDateToJulian = (date: Date) => {
  return JulianDate.fromDate(date)
}

export function convertPositionToGeoJSONCoordinate (
  position: {},
  id: number
): DegreesCoordinates {
  const cartographic = Cartographic.fromCartesian(position)

  const lon = CesiumMath.toDegrees(cartographic.longitude)
  const lat = CesiumMath.toDegrees(cartographic.latitude)

  return id
    ? [lon, lat, cartographic.height, id]
    : [lon, lat, cartographic.height]
}

// export const getCesiumMapboxStyleImageryProvider = memoize(
//   (styleId, accessToken) => {
//     return new MapboxStyleImageryProvider({
//       // minimum level-of-detail (デフォルト値は0)
//       minimumLevel: 0,
//       // maximum level-of-detail (22以上になるとmapboxの422エラーが発生する)
//       maximumLevel: 22,
//       styleId,
//       accessToken
//     })
//   }
// )

// export const getCesiumTerrainProvider = memoize(resource => {
//   return new CesiumTerrainProvider({ url: resource })
// })

// export const sampleCesiumTerrainMostDetailed = (
//   provider,
//   cartographicCenters
// ) => {
//   return sampleTerrainMostDetailed(provider, cartographicCenters)
// }

// export function pickPosition (position, camera, scene) {
//   let depthIntersection
//   if (scene.pickPositionSupported) {
//     depthIntersection = scene.pickPosition(position)
//   }

//   const ray = camera.getPickRay(position)
//   const rayIntersection = scene.globe.pick(ray, scene)

//   const pickDistance = depthIntersection
//     ? Cartesian3.distance(depthIntersection, camera.positionWC)
//     : Number.POSITIVE_INFINITY
//   const rayDistance = rayIntersection
//     ? Cartesian3.distance(rayIntersection, camera.positionWC)
//     : Number.POSITIVE_INFINITY

//   return pickDistance < rayDistance ? depthIntersection : rayIntersection
// }

// export function takeSceenScreenshot (scene) {
//   return new Promise(resolve => {
//     // http://cesiumjs.org.s3-website-us-east-1.amazonaws.com/forum/#!msg/cesium-dev/FdQk03zgOMI/JrW22gMpBgAJ
//     const takeScreenshot = () => {
//       scene.postRender.removeEventListener(takeScreenshot)
//       scene.canvas.toBlob(blob => {
//         const url = URL.createObjectURL(blob)
//         resolve(url)
//       })
//     }

//     const prepareScreenshot = () => {
//       scene.preRender.removeEventListener(prepareScreenshot)
//       setTimeout(() => {
//         scene.postRender.addEventListener(takeScreenshot)
//       }, 1000)
//     }

//     scene.preRender.addEventListener(prepareScreenshot)
//   })
// }

// export const cartographicHeightRange = coordinates => {
//   return coordinates.reduce(({ high, low }, coordinates) => {
//     if (!high && !low) {
//       return {
//         high: coordinates,
//         low: coordinates
//       }
//     }

//     const { height: highestHeight } = high
//     const { height: lowestHeight } = low
//     const { height } = coordinates

//     const isLowest = height < lowestHeight
//     const isHighest = height > highestHeight
//     return {
//       high: isHighest ? coordinates : high,
//       low: isLowest ? coordinates : low
//     }
//   }, {})
// }

// export const calculateHighestLowestPoints = async (
//   polygon,
//   terrainProvider
// ) => {
//   const grid = samplePolygon(polygon, turfPointGrid)
//   const allCoordinates = grid.features.map(feature =>
//     Cartographic.fromDegrees(...get(feature, 'geometry.coordinates'))
//   )

//   // This method updates the properties of allCoordinates
//   await sampleCesiumTerrainMostDetailed(terrainProvider, allCoordinates)

//   const { high, low } = cartographicHeightRange(allCoordinates)
//   const highestCoordinates = [
//     CesiumMath.toDegrees(high.longitude),
//     CesiumMath.toDegrees(high.latitude),
//     high.height
//   ]
//   const lowestCoordinates = [
//     CesiumMath.toDegrees(low.longitude),
//     CesiumMath.toDegrees(low.latitude),
//     low.height
//   ]

//   const highestPoint = point(highestCoordinates, {
//     id: `feature-${polygon.id}-highest-point`
//   })
//   const lowestPoint = point(lowestCoordinates, {
//     id: `feature-${polygon.id}-lowest-point`
//   })
//   return { highestPoint, lowestPoint }
// }

// Mapboxのstyleの定数値
// https://docs.mapbox.com/api/maps/#mapbox-styles
export const mapboxStyles = {
  satellite: 'satellite-v9',
  streets: 'streets-v11',
  outdoors: 'outdoors-v11'
}

export const flyToTarget = (
  viewer: Viewer,
  target:
    | Entity
    | Array<Entity>
    | EntityCollection
    | DataSource
    | ImageryLayer
    | Cesium3DTileset
    | TimeDynamicPointCloud
) => {
  viewer.flyTo(target)
}

// export const getEntityByIdFromViewerEntities = (viewer: Viewer, id: String) => {
//   return viewer.entities.getById(id)
// }
// export const getEntityByLikeIdFromViewerEntities = (
//   viewer: Viewer,
//   id: String
// ) => {
//   const entity = viewer.entities.values.filter(val => val.id.includes(id))
//   return entity.length > 0 ? entity[0] : null
// }

/* ------------------------------------------
 * 名前でviewerから該当名前のDataSourceの配列を取得
 *
 * 引数：
 *  viewer : Cesium.Viewer
 *  dataSourceName : string | number DataSource名
 * 返り値：
 *  該当名前のDataSourceの配列
 * ------------------------------------------ */
export const getDataSourceListByName = (
  viewer: Viewer,
  dataSourceName: string | number
): DataSource => viewer.dataSources.getByName(dataSourceName)

/* ------------------------------------------
 * dataSourceから該当IDのEntityを取得
 *
 * 引数：
 *  dataSource : DataSource
 *  id : string EntityのID
 * 返り値：
 *  Entity
 * ------------------------------------------ */
export const getEntityByIdFromDataSource = (
  dataSource: DataSource,
  id: String
) => dataSource.entities.getById(id)

// /* ------------------------------------------
//  * 注釈のクラスタ解除
//  *
//  * 引数：
//  *  viewer : Cesium.Viewer
//  * 返り値：
//  *  boolean
//  * ------------------------------------------ */
// export const cancelClusterEntityListFromViewer: (viewer: Viewer) => boolean = (
//   viewer: Viewer
// ) => {
//   const isClustering = (viewer.dataSources.getByName(
//     'ANNOTATION_POINT'
//   )[0].clustering.enabled = false)

//   return isClustering
// }
// /* ------------------------------------------
//  * 注釈のクラスタ表示
//  *
//  * 引数：
//  *  viewer : Cesium.Viewer
//  * 返り値：
//  *  boolean
//  * ------------------------------------------ */
// export const showClusterEntityListFromViewer: (viewer: Viewer) => boolean = (
//   viewer: Viewer
// ) => {
//   const isClustering = (viewer.dataSources.getByName(
//     'ANNOTATION_POINT'
//   )[0].clustering.enabled = true)

//   return isClustering
// }

// /* ------------------------------------------
//  * クラスタ表示対象のEntity配列を取得
//  *
//  * 引数：
//  *  viewer : Cesium.Viewer
//  * 返り値：
//  *  Array<Entity>
//  * ------------------------------------------ */
// export const getClusterEntityListFromViewer: (
//   viewer: Viewer
// ) => Array<Entity> = (viewer: Viewer) => {
//   // viewer.dataSourcesがArray<DataSource>ではないため、javascriptのArrayAPIが使えない
//   const entityList = []
//   for (
//     let dataSourceIndex = 0;
//     dataSourceIndex < viewer.dataSources.length;
//     ++dataSourceIndex
//   ) {
//     const dataSource = viewer.dataSources.get(dataSourceIndex)
//     if (dataSource.clustering.enabled) {
//       entityList.push(...dataSource.entities.values)
//     }
//   }
//   return entityList
// }

export const convertCartesian3ToCoordinates = (
  position: Cartesian3
): DegreesCoordinates => {
  const cartographic = Cartographic.fromCartesian(position)

  const coordinates = [
    CesiumMath.toDegrees(cartographic.longitude),
    CesiumMath.toDegrees(cartographic.latitude),
    cartographic.height
  ]

  return coordinates
}

export const convertCoordinatesToCartesian3 = (
  longitude: number,
  latitude: number,
  height: number = 0
): Cartesian3 => {
  // 2Dマップ時を考慮し、heightのフィルタリングはしない。
  if (typeof longitude !== 'number' || typeof latitude !== 'number') {
    return
  }

  return Cartesian3.fromDegrees(longitude, latitude, height)
}

// export const getValuePositionProperty = (
//   position: PositionProperty
// ): Cartesian3 => {
//   return position.getValue()
// }

export const newCartesian3 = (x: number, y: number, z: number): Cartesian3 => {
  return new Cartesian3(x, y, z)
}

// export const calculateMidpoint = (
//   point1: DegreesCoordinates,
//   point2: DegreesCoordinates
// ): DegreesCoordinates => {
//   const position1 = convertCoordinatesToCartesian3(...point1)
//   const position2 = convertCoordinatesToCartesian3(...point2)
//   const result = new Cartesian3(0, 0, 0) // Cartesian3.midpointの第3引数にCartesian3の値を入れないとエラーになる

//   if (!position1 || !position2) return

//   const midpoint = Cartesian3.midpoint(position1, position2, result)
//   return convertCartesian3ToCoordinates(midpoint)
// }

// export const convertCssColorToCesiumColor = (
//   cssColor: string,
//   opacity: number = 1.0
// ): Color => {
//   return Color.fromCssColorString(cssColor).withAlpha(opacity)
// }

// export const convertToCesiumArrow = (cesiumColor: Color) => {
//   return new PolylineArrowMaterialProperty(cesiumColor)
// }

// export const convertToCesiumOutlinePolyline = (
//   color: Color,
//   outlineColor: Color,
//   outlineWidth: Number
// ) => {
//   return new PolylineOutlineMaterialProperty({
//     color: color,
//     outlineColor: outlineColor,
//     outlineWidth: outlineWidth
//   })
// }

export const convertCssColorToCesiumColor = (
  cssColor: string,
  opacity: number = 1.0
): Color => {
  return Color.fromCssColorString(cssColor).withAlpha(opacity)
}

// export const convertToCesiumArrow = (cesiumColor: Color) => {
//   return new PolylineArrowMaterialProperty(cesiumColor)
// }

// export const convertToCesiumOutlinePolyline = (color: Color, outlineColor: Color, outlineWidth: Number) => {
//   return new PolylineOutlineMaterialProperty({
//     color: color,
//     outlineColor: outlineColor,
//     outlineWidth: outlineWidth
//   })
// }

export const getMaterialFromType = (type: string) => {
  return Material.fromType(type)
}

// export const getPositionsFromEntity = (viewer: Viewer, entity: Entity) => {
//   const pointPosition = entity.position
//     ? [entity.position.getValue(viewer.clock.currentTime)]
//     : []
//   const polylinePositions = entity.polyline
//     ? entity.polyline.positions.getValue()
//     : []
//   const polygonPositions = entity.polygon
//     ? entity.polygon.hierarchy.getValue().positions
//     : []
//   return [...polygonPositions, ...polylinePositions, ...pointPosition]
// }

/* ------------------------------------------
 * Cartesian3の配列で構成した位置情報を指定して、目標にズーム
 * ※使用上の注意点：
 * Array<Cartesian3>の要素が１つのみ、また全要素の座標値/経緯度が同じの場合
 * 最大倍率ズームしてしまう
 *
 * 引数：
 *  viewer : Cesium.Viewer
 *  positions : Array<Cartesian3> 位置情報
 * 返り値：
 *  なし
 *------------------------------------------ */
export async function flyToTargetByPositions (
  viewer: Viewer,
  positions: Array<Cartesian3>
) {
  let rectangle = Rectangle.fromCartesianArray(positions)
  rectangle = await computeFlyToLocationForRectangle(rectangle, viewer.scene)
  viewer.scene.camera.flyTo({
    destination: viewer.scene.mapProjection.ellipsoid.cartographicToCartesian(
      rectangle
    )
  })
}

/* ------------------------------------------
 * エンティティにズーム
 * 引数：
 *  viewer : Cesium.Viewer
 *  entity : Cesium.Entity ズーム先のオブジェクト
 * 返り値：
 *  なし
 *------------------------------------------ */
export function flyToEntity (viewer: Viewer, entity: Entity) {
  if (!entity.polyline && !entity.polygon) {
    // 通常のflytoを使用してズームする
    flyToTarget(viewer, entity)
  } else {
    /* ------------------------------------------
     * 線または多角形の場合、バグが原因で下記の条件分岐が必要
     *------------------------------------------ */
    const polylinePositions = entity.polyline
      ? entity.polyline.positions.getValue()
      : []
    const polygonPositions = entity.polygon
      ? entity.polygon.hierarchy.getValue().positions
      : []
    const positions = [...polygonPositions, ...polylinePositions]
    flyToTargetByPositions(viewer, positions)
  }
}

/* ------------------------------------------
 * 点が１つのみのエンティティ（デバイス）にズーム
 * 説明：
 *   点が１つのみのエンティティに対して、
 *   [viewer.flyto]メソッドでズームする場合不具合発生するので、
 *   暫定対策としてこのメソッドを使用する
 * ロジック
 *   地形を加味したエンティティの位置の100メートル上の空中に
 *   カメラを移動する
 * 引数：
 *  viewer : Cesium.Viewer
 *  entity : Cesium.Entity ズーム先のオブジェクト
 * 返り値：
 *  なし
 *------------------------------------------ */
export const flytoOnePointEntity = async (viewer: Viewer, entity: Entity) => {
  // カメラの高さ設定（単位：メートル）
  const CAMERA_HEIGHT = 100
  // 現在エンティティの位置取得
  const entityPosition = entity.position.getValue(viewer.clock.currentTime)
  // 現在エンティティの位置変換
  const positionCartographic = Ellipsoid.WGS84.cartesianToCartographic(
    entityPosition
  )
  // 位置を地形考慮して調整
  const adjustedPositions = await sampleTerrainMostDetailed(
    await createWorldTerrainAsync(),
    [positionCartographic]
  )
  // 位置の高さを地形の高さ + カメラ高さに設定
  positionCartographic.height = adjustedPositions[0].height + CAMERA_HEIGHT
  // 設定した位置にカメラを移動する
  const destination = Ellipsoid.WGS84.cartographicToCartesian(
    positionCartographic
  )
  viewer.scene.camera.flyTo({ destination })
}

// /* ------------------------------------------
//  * 指定のビューポイントを表示
//  * 引数：
//  *  viewer : Cesium.Viewer
//  *  position : 視点の位置
//  *  direction : 視点の方向
//  *  up : 視点の角度
//  * 返り値：
//  *  なし
//  *------------------------------------------ */
// export const flytoViewpoint = async (
//   viewer: Viewer,
//   position: ?number,
//   direction: ?number,
//   up: ?number
// ) => {
//   viewer.camera.position = newCartesian3(position.x, position.y, position.z)
//   viewer.camera.direction = newCartesian3(direction.x, direction.y, direction.z)
//   viewer.camera.up = newCartesian3(up.x, up.y, up.z)
// }

// /* ------------------------------------------
//  * flyToの引数（complelte以外）を取得する
//  * 本メソッドはアニメーション用であり、最大高さ0、等速移動
//  *
//  * 引数：
//  *  viewer : Cesium.Viewer
//  *  destination: Cartesian3 目的地座標
//  *  direction: Cartesian3 方向
//  *  up: Cartesian3 上方向
//  *  duration: ?number 移動時間
//  * 返り値：
//  *  flyToの引数（complelte以外）
//  *------------------------------------------ */
// export function getFlyToPointParam (
//   viewer: Viewer,
//   destination: Cartesian3,
//   direction: Cartesian3,
//   up: Cartesian3,
//   duration: ?number
// ) {
//   return {
//     destination: destination,
//     orientation: {
//       direction: direction,
//       up: up
//     },
//     duration: duration,
//     maximumHeight: 0,
//     easingFunction: EasingFunction.LINEAR_NONE
//   }
// }

// /* ------------------------------------------
//  * flyToの引数（complelte）を設定する
//  *
//  * 引数：
//  *  viewer : Cesium.Viewer
//  *  option: Object flyToの引数
//  *  nextOption: Object 次のflyToの引数
//  *  afterTime: Number 次のflyToまでの待機時間
//  * 返り値：
//  *  なし
//  *------------------------------------------ */
// export function setFlyToPointParamComplete (
//   viewer: Viewer,
//   option: Object,
//   nextOption: Object,
//   afterTime: ?number
// ) {
//   option.complete = function () {
//     setTimeout(function () {
//       viewer.scene.camera.flyTo(nextOption)
//     }, afterTime)
//   }
// }

/* ------------------------------------------
 * flyToを実行する
 *
 * 引数：
 *  viewer : Cesium.Viewer
 *  options : Object flyToの引数オプション
 * 返り値：
 *  なし
 *------------------------------------------ */
export function flyToPoint (viewer: Viewer, options: Object) {
  viewer.scene.camera.flyTo(options)
}

export const getCesium3DTilePointCloudStyle = (
  pointSize: number,
  transparency: number,
  color?: String
) => {
  const rgb = color ? convertCssColorToCesiumColor(color) : null
  return new Cesium3DTileStyle({
    // $FlowFixMe
    pointSize: pointSize,
    color:
      'rgba(' +
      (rgb
        ? `${rgb.red * 255}, ${rgb.green * 255}, ${rgb.blue * 255},`
        : '${COLOR.r}*255, ${COLOR.g}*255, ${COLOR.b}*255,') + //eslint-disable-line
      transparency +
      ')'
  })
}

export const getCesium3DTileStyle = ({
  color,
  opacity,
  filter
}: {
  color: string,
  opacity: number,
  filter: any
}) => {
  const colorStyle = color
    ? {
        color: {
          evaluateColor: () => convertCssColorToCesiumColor(color, opacity)
        }
      }
    : {
        color: 'rgba(${COLOR.r}, ${COLOR.g}, ${COLOR.b},' + opacity + ')' //eslint-disable-line
      }
  const filterCondList =
    filter && Object.keys(filter).length > 0
      ? Object.keys(filter).map(
          key =>
            '((${' +
            key +
            '} !== undefined && !isNaN(${' +
            key +
            '}) && Number(${' +
            key +
            '}) >= ' +
            filter[key][0] +
            ' && Number(${' +
            key +
            '}) <= ' +
            filter[key][1] +
            ') || ${' +
            key +
            '} === undefined)'
        )
      : undefined
  const style = filterCondList
    ? { ...colorStyle, show: filterCondList.join(' && ') }
    : colorStyle
  return new Cesium3DTileStyle(style)
}

// export const getDataSourceEntityCollection = (
//   dataSource: any,
//   opacity: number
// ) => {
//   var values = dataSource.entities.values
//   for (var i = 0; i < values.length; i++) {
//     let value = values[i]
//     let colorValue

//     if (
//       value.polygon &&
//       value.polygon.material &&
//       value.polygon.material.color
//     ) {
//       colorValue = Color.fromRandom({
//         red: value.polygon.material.color._value.red,
//         green: value.polygon.material.color._value.green,
//         blue: value.polygon.material.color._value.blue,
//         alpha: opacity
//       })
//       value.polygon.material = colorValue
//     } else if (
//       value.polyline &&
//       value.polyline.material &&
//       value.polyline.material.color
//     ) {
//       colorValue = Color.fromRandom({
//         red: value.polyline.material.color._value.red,
//         green: value.polyline.material.color._value.green,
//         blue: value.polyline.material.color._value.blue,
//         alpha: opacity
//       })
//       value.polyline.material = colorValue
//     }
//   }
//   return new EntityCollection({
//     entities: dataSource.entities
//   })
// }

export const getScene3d = () => {
  return SceneMode.SCENE3D
}

export const getScene2d = () => {
  return SceneMode.SCENE2D
}

export const setReal3dShow = (primitives, isVisible) => {
  const primitivesLength = primitives.length
  let primitive
  for (let i = 0; i < primitivesLength; i++) {
    primitive = primitives.get(i)
    if (primitive.assetId && primitive.assetId === GP3DT_ID) {
      primitive.show = isVisible
    }
  }
}

// export const calculateCartesian3Distance = (
//   position1: Object,
//   position2: Object
// ) => {
//   const cartesian31 = newCartesian3(position1.x, position1.y, position1.z)
//   const cartesian32 = newCartesian3(position2.x, position2.y, position2.z)
//   return Cartesian3.distance(cartesian31, cartesian32)
// }

export const setCesiumIonToken = (token: string) => {
  Ion.defaultAccessToken = token
}

// export const getEntityGeometry = (entity: any) => {
//   const { point, polygon, polyline } = entity
//   return point || polyline || polygon
// }

// export const getDataSourceMaterial = (dataSource: any) => {
//   const entity = getEntityGeometry(dataSource.entities.values[0] || {})
//   if (entity && entity.material) {
//     return entity.material
//   }
// }

// export const setDataSourceMaterial = (
//   dataSource: Object,
//   material: { color?: string, opacity: number }
// ) => {
//   const { color, opacity } = material
//   if (color) {
//     for (let index = 0; index < dataSource.entities.values.length; ++index) {
//       const { point, polyline, polygon } = dataSource.entities.values[index]
//       const entity = point || polyline || polygon
//       if (!entity || !entity.material) {
//         continue
//       }
//       const newMaterial = color
//         ? convertCssColorToCesiumColor(color, opacity)
//         : { ...entity.material.color.getValue(), alpha: opacity }
//       entity.material = new ColorMaterialProperty(newMaterial)
//     }
//   } else {
//     getDataSourceEntityCollection(dataSource, opacity)
//   }
// }

// export const resetGeoJsonDataSourceMaterial = (
//   dataSource: Object,
//   ionAssetId: number
// ) => {
//   return IonResource.fromAssetId(ionAssetId)
//     .then(resource => GeoJsonDataSource.load(resource))
//     .then(originSource => {
//       originSource.entities.values.forEach((entity, index) => {
//         const geometry = getEntityGeometry(entity)
//         if (!geometry || !geometry.material) {
//           return
//         }
//         const targetEntity = dataSource.entities.values[index] || {}
//         const targetGeometry = getEntityGeometry(targetEntity)
//         if (targetGeometry) {
//           targetGeometry.material = geometry.material
//         }
//       })
//     })
// }

// /**
//  * 2つCartesian3タイプの点の線形補間
//  * @param {*} startPosition: 1つ目の点(Cartesian3座標)
//  * @param {*} endPosition: 2つ目の点(Cartesian3座標)
//  * @param {*} count: 補間する点の数
//  * @returns 補間された点のCartesian3座標配列
//  */
// export const lerpCartesian3 = (
//   startPosition: Object,
//   endPosition: Object,
//   count: number
// ): Array<Object> => {
//   if (count === 1) {
//     return [endPosition]
//   }
//   const cartesianList = new Array(count)
//   for (let index = 0; index < count; ++index) {
//     const offset = index / (count - 1)
//     cartesianList[index] = Cartesian3.lerp(
//       startPosition,
//       endPosition,
//       offset,
//       new Cartesian3()
//     )
//   }
//   return cartesianList
// }

// export const convertCartesian3ToCartographic = (
//   position: Cartesian3
// ): Cartographic => Cartographic.fromCartesian(position)

// export const convertCartographicToCoordinates = (
//   position: Cartographic
// ): DegreesCoordinates => [
//   CesiumMath.toDegrees(position.longitude),
//   CesiumMath.toDegrees(position.latitude),
//   position.height
// ]

export const createPointCloudShadingInstance = (options: Object): any =>
  new PointCloudShading(options)

export const isSupportedPointCloudShading = (viewer: Viewer): boolean =>
  PointCloudShading.isSupported(viewer.scene)

/** 各種交差判定 */
// export const intersectionTestsWithoutHeight = {
//   /**
//    * 直線とBoundingSphereの交差判定
//    * @param {*} p0: 直線端点１(Cartesian3座標)
//    * @param {*} p1: 直線端点２(Cartesian3座標)
//    * @param {*} sphere: 交差判定のBoundingSphere
//    * @returns boolean
//    */
//   lineSegmentSphere: (
//     p0: Cartesian3,
//     p1: Cartesian3,
//     sphere: BoundingSphere
//   ): boolean => {
//     // 2D観点で交差しているかどうかを判定するため、高さを0にする必要がある
//     const newP0 = removeCartesian3Height(p0)
//     const newP1 = removeCartesian3Height(p1)
//     if (newP0.equals(newP1)) {
//       return false
//     }
//     const newBoundingSphere = new BoundingSphere(
//       removeCartesian3Height(sphere.center),
//       sphere.radius
//     )
//     // IntersectionTests.lineSegmentSphereの戻り値 => 交差している場合: Interval; 交差していない場合: undefined
//     return !!IntersectionTests.lineSegmentSphere(
//       newP0,
//       newP1,
//       newBoundingSphere
//     )
//   }
// }

// /**
//  * Cartesian3座標の高さを0にする
//  * @param {*} point: Cartesian3座標
//  * @returns 高さを0にした新しいCartesian3座標
//  */
// export const removeCartesian3Height = (point: Cartesian3): Cartesian3 => {
//   const coordinates = convertCartesian3ToCoordinates(point)
//   return convertCoordinatesToCartesian3(coordinates[0], coordinates[1])
// }

// /**
//  * ２つのCartesian3の水平距離を計算
//  * @param {*} point1: 点１(Cartesian3座標)
//  * @param {*} point2: 点２(Cartesian3座標)
//  * @returns 水平距離
//  */
// export const calculateCartesian3HorizontalDistance = (
//   point1: Cartesian3,
//   point2: Cartesian3
// ): number => {
//   return Cartesian3.distance(
//     removeCartesian3Height(point1),
//     removeCartesian3Height(point2)
//   )
// }

/**
 * 3DTiles のモデル座標系をローカル座標系(EastNorthUp)に設定する
 * @param {*} primitive 3DTiles
 * @returns 3DTiles
 */
export const modelFrameToEastNorthUp = (
  primitive: Cesium3DTileset
): Cesium3DTileset => {
  const rootTransform = primitive.root.transform
  const modelMatrix = primitive.modelMatrix

  const center = Cartesian3.clone(primitive.boundingSphere.center)

  const transform = Transforms.eastNorthUpToFixedFrame(center)
  const inverseTransform = Matrix4.inverse(transform, new Matrix4())

  const adjustedRootTransform = Matrix4.multiplyTransformation(
    inverseTransform,
    modelMatrix,
    new Matrix4()
  )
  Matrix4.multiplyTransformation(
    adjustedRootTransform,
    rootTransform,
    adjustedRootTransform
  )

  Matrix4.clone(transform, modelMatrix)
  Matrix4.clone(adjustedRootTransform, rootTransform)

  return primitive
}

// /**
//  * 2点間の測地線距離を導出する
//  * @param {*} point1 点１(Cartographic座標)
//  * @param {*} point2 点２(Cartographic座標)
//  * @param {*} geodesic 測地系
//  * @returns 距離 [m]
//  */
// export const calculateGeodesicDistance = (
//   point1: Cartographic,
//   point2: Cartographic,
//   geodesic: ?EllipsoidGeodesic
// ): number => {
//   const calc = geodesic ?? new EllipsoidGeodesic()
//   calc.setEndPoints(point1, point2)
//   return calc.surfaceDistance
// }

// /**
//  * polyline生成関数
//  * @param options optionsのtype: https://cesium.com/learn/cesiumjs/ref-doc/PolylineGraphics.html#.ConstructorOptions
//  * @returns PolylineGraphics
//  */
// export const createPolyline = (options: any): PolylineGraphics =>
//   new PolylineGraphics(options)

// /**
//  * 複数の点のBoundingSphereの中心点を取得
//  * @param {*} points 複数の点(Cartesian3座標)
//  * @returns BoundingSphereの中心点(Cartesian3座標)
//  */
// export const getBoundingSphereCenter = (
//   points: Array<Cartesian3>
// ): Cartesian3 => BoundingSphere.fromPoints(points).center

// export const getCesium3DTilesetByIonAssetId = (
//   ionAssetId: number
// ): Cesium3DTileset =>
//   new Cesium3DTileset({ url: IonResource.fromAssetId(ionAssetId) })
