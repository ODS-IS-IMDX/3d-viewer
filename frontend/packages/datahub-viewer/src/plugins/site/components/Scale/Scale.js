// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { defined, EllipsoidGeodesic, Cartesian2 } from 'cesium'
import { Scale as InnerScale } from '@ehv/datahub-components'

import type { UnitConverter } from 'utils/convertUnits'

type Props = {
  canvas: object,
  camera: object,
  scene: object,
  converter: UnitConverter
}

export default class Scale extends React.PureComponent<Props> {
  state = {
    barWidth: null,
    distanceLabel: null
  }

  componentDidMount () {
    this.listenToCameraChanges()
  }

  componentDidUpdate (oldProps: Props) {
    const { camera, converter } = this.props

    // if the camera changes, cleanup the event listeners
    if (camera !== oldProps.camera) {
      oldProps.camera.changed.removeEventListener(this.onCameraChange, this)
      this.listenToCameraChanges()
    }

    if (
      converter &&
      converter.lengthUnit &&
      oldProps.converter &&
      converter.lengthUnit !== oldProps.converter.lengthUnit
    ) {
      this.onCameraChange()
    }
  }

  componentWillUnmount () {
    this.props.camera.changed.removeEventListener(this.onCameraChange, this)
  }

  distances = [
    1,
    2,
    3,
    5,
    10,
    20,
    30,
    50,
    100,
    200,
    300,
    500,
    1000,
    2000,
    3000,
    5000,
    10000,
    20000,
    30000,
    50000,
    100000,
    200000,
    300000,
    500000,
    1000000,
    2000000,
    3000000,
    5000000,
    10000000,
    20000000,
    30000000,
    50000000
  ]

  geodesic = new EllipsoidGeodesic()

  scaleCalculation = () => {
    const { scene, canvas, converter, t } = this.props

    // Find the distance between two pixels at the bottom center of the screen.
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    const left = scene.camera.getPickRay(
      new Cartesian2((width / 2) | 0, height - 1)
    )
    const right = scene.camera.getPickRay(
      new Cartesian2((1 + width / 2) | 0, height - 1)
    )

    const { globe } = scene
    const leftPosition = globe.pick(left, scene)
    const rightPosition = globe.pick(right, scene)

    if (!defined(leftPosition) || !defined(rightPosition)) {
      return
    }

    const leftCartographic = globe.ellipsoid.cartesianToCartographic(
      leftPosition
    )
    const rightCartographic = globe.ellipsoid.cartesianToCartographic(
      rightPosition
    )

    this.geodesic.setEndPoints(leftCartographic, rightCartographic)
    const pixelDistance = this.geodesic.surfaceDistance

    // Find the first distance that makes the scale bar less than 100 pixels.
    const maxBarWidth = 100
    let distance
    for (let i = this.distances.length - 1; !defined(distance) && i >= 0; --i) {
      if (this.distances[i] / pixelDistance < maxBarWidth) {
        distance = this.distances[i]
      }
    }

    let barWidth = null
    let distanceLabel = null

    if (defined(distance)) {
      const unit = converter.lengthUnit
      const convertedDistance = Math.round(
        parseFloat(converter.length(distance))
      )
      if (convertedDistance >= 1000 && unit === 'm') {
        distanceLabel = `${Math.round(convertedDistance / 1000).toString()} ${t(
          `common:units.km`
        )}`
      } else {
        distanceLabel = `${convertedDistance.toString()} ${t(
          `common:units.${unit}`
        )}`
      }

      barWidth = (distance / pixelDistance) | 0
    }

    return { barWidth, distanceLabel }
  }

  listenToCameraChanges () {
    this.props.camera.percentageChanged = 0.001
    this.props.camera.changed.addEventListener(this.onCameraChange, this)
  }

  onCameraChange () {
    const scale = this.scaleCalculation()

    if (!scale) return

    this.setState({
      barWidth: scale.barWidth,
      distanceLabel: scale.distanceLabel
    })
  }

  render () {
    const { barWidth, distanceLabel } = this.state

    if (!barWidth || !distanceLabel) {
      return null
    }

    return <InnerScale value={distanceLabel} width={barWidth} />
  }
}
