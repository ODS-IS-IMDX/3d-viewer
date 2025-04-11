// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { createContext } from 'react'
import type { WithNamespaces } from 'react-i18next'
import styled, { createGlobalStyle } from 'styled-components'
import { MapMore, Absolute, Fixed, MapNavigator } from '@ehv/datahub-components'
import {
  ImageryLayer,
  Viewer,
  CameraContext,
  GlobeContext,
  ScreenSpaceCameraController
} from '../../../../react-cesium'
import {
  Cartesian3,
  Color,
  Rectangle,
  ScreenSpaceEventType,
  Math as CesiumMath,
  NearFarScalar,
  CesiumTerrainProvider,
  EllipsoidTerrainProvider,
  OpenStreetMapImageryProvider
  // createGooglePhotorealistic3DTileset TODO:Google Photorealistic 3DTileset機能ペンディング
} from 'cesium'
import { Slot } from '@ehv/react-slots'
import { BASE_TERRAIN_DEFAULT_ION_ASSET_ID } from 'plugins/file/constants'
import { SITE_PERMISSION_TEXT } from '../../constants'
// import { GP3DT_ID } from '../../../../constants' TODO:Google Photorealistic 3DTileset機能ペンディング

import { getPositionByCartographic } from 'utils/cesium'
import MapSettingsMenu from '../MapSettingsMenu'
import Scale from '../Scale'
import SiteTermsOfService from '../SiteTermsOfService'
import SitePermissionToUse from '../SitePermissionToUse'
import type {
  MaterialContourOptions,
  MapControlFlags,
  MapControlKeyType
} from '../../types'
import { FullscreenButton } from '../FullscreenButton'

export const ModalWindowsContext: Object = createContext()

type Props = WithNamespaces & {
  timeline: boolean,
  fullscreenButton: boolean,
  baseLayerPicker: boolean,
  geocoder: boolean,
  homeButton: boolean,
  sceneModePicker: boolean,
  navigationHelpButton: boolean,
  isTimelineDrawerOpen: boolean,
  getVisTimeline: any,
  contourOptions: MaterialContourOptions,
  isMobile: boolean,
  mapControlKeySettings: MapControlKeyType,
  baseTerrainList: any,
  isAssetDrawerOpen: boolean,
  closeTimelineDrawer: () => void,
  removeVisTimeline: (visTimelineInstance: any) => void,
  notifyInit: () => void,
  changeSceneMode: () => void,
  flyToCurrentLocation: () => void,
  setContourOptions: (
    enable?: boolean,
    spacing?: number,
    color?: string
  ) => void,
  cancelEditAsset: () => void,
  isMapSetting: boolean,
  isMobile: boolean
}

type State = {
  mapType: string,
  renderQualityName: string,
  mapviewName: string,
  mapSettingsOpen: boolean,
  globeTranslucencyFade: boolean,
  globeTranslucencyAlpha: number,
  lightControllerMenuOpen: boolean,
  baseTerrain: string | null,
  globeContourOpen: boolean,
  mapControlFlags: MapControlFlags,
  isFullscreen: boolean,
  isFullscreenDisabled: boolean
}
const RENDER_QUALITY = {
  low: 0.5,
  standard: 1,
  high: 1.5
}
const MAPVIEW = {
  d2: 2,
  notD3: 3,
  d3: 3,
  real3D: 4
}
const CesiumCreditStyle = createGlobalStyle`
  .cesium-widget-credits {
    display: block !important;
  }

  .cesium-credit-lightbox ul {
    list-style-type: disc;
  }
`
const TooltipWrapper = styled.div`
  position: relative;
  &:hover .description {
    display: flex;
    justify-content: center;
  }
`
const Tooltip = styled.div`
  display: none;
  position: absolute;
  top: 23px;
  right: 53px;
  padding: 8px;
  font-size: 12px;
  line-height: 1.6em;
  color: #fff;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.8);
  white-space: nowrap;
  transform: translateY(-50%);
`
export class SiteViewer extends React.PureComponent<Props, State> {
  viewer = React.createRef<any>()
  coordinatesPickerRef = React.createRef<HTMLDivElement>()
  state = {
    mapType: 'openStreetMap',
    renderQualityName: this.props.isMobile ? 'low' : 'standard',
    mapviewName: 'd3',
    mapSettingsOpen: false,
    globeTranslucencyFade: true,
    lightControllerMenuOpen: false,
    baseTerrain: BASE_TERRAIN_DEFAULT_ION_ASSET_ID,
    globeContourOpen: false,
    mapControlFlags: {
      zoomIn: false,
      zoomOut: false,
      moveUp: false,
      moveDown: false,
      moveFoward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
      rotateUp: false,
      rotateDown: false,
      rotateLeft: false,
      rotateRight: false,
      twistLeft: false,
      twistRight: false
    },
    globeTranslucencyAlpha: 0.0,
    animationDeleteOpen: false,
    animationDelete: null,
    viewpointListOpen: false,
    viewpointDeleteOpen: false,
    viewpointDelete: null,
    isFullscreen: false,
    isFullscreenDisabled: false,
    isHiddenBelowTerrain: false,
    imageryProvider: null
  }

  /** 地図操作フラグをセット */
  setMapControlFlags = (key: string, value: boolean) => {
    if (key in this.state.mapControlFlags) {
      this.setState(prevState => {
        return {
          ...prevState,
          mapControlFlags: {
            ...prevState.mapControlFlags,
            [key]: value
          }
        }
      })
    }
  }

  setMapType = (mapType: string) => this.setState({ mapType })

  setRenderQuality = (renderQualityName: string) =>
    this.setState({ renderQualityName })

  setMapview = (mapviewName: string) => {
    // 地形設定切り替え
    if (mapviewName === 'notD3') {
      this.viewer.current.terrainProvider = new EllipsoidTerrainProvider()
    } else {
      this.setBaseTerrain(this.state.baseTerrain)
    }
    this.setState({ mapviewName })
  }

  setMapSettingsOpen = (mapSettingsOpen: boolean) =>
    this.setState({ mapSettingsOpen })

  setGlobeTranslucencyFade = (globeTranslucencyFade: boolean) =>
    this.setState({ globeTranslucencyFade })

  setGlobeTranslucencyAlpha = (globeTranslucencyAlpha: number) =>
    this.setState({ globeTranslucencyAlpha })

  setIsHiddenBelowTerrain = (isHiddenBelowTerrain: boolean) =>
    this.setState({ isHiddenBelowTerrain })

  /** 地形設定 */
  setBaseTerrain = (baseTerrain: number) => {
    CesiumTerrainProvider.fromIonAssetId(baseTerrain).then(v => {
      this.setState({ baseTerrain })
      this.viewer.current.terrainProvider = v
    })
  }

  setGlobeContourOpen = (globeContourOpen: boolean) =>
    this.setState({ globeContourOpen })

  setViewpointListOpen = (viewpointListOpen: boolean) =>
    this.setState({ viewpointListOpen })

  setViewpointDeleteOpen = (viewpointDeleteOpen: boolean) =>
    this.setState({ viewpointDeleteOpen })

  setViewpointDelete = (viewpointDelete: Viewpoint | null) =>
    this.setState({ viewpointDelete })

  setAnimationDeleteOpen = (animationDeleteOpen: boolean) =>
    this.setState({ animationDeleteOpen })

  setAnimationDelete = (animationDelete: Animation | null) =>
    this.setState({ animationDelete })

  setImageryProvider = (imageryProvider: any) =>
    this.setState({ imageryProvider })

  /** 等高線の表示切替 */
  setContourEnable = (enable: boolean) =>
    this.props.setContourOptions(enable, undefined, undefined)
  /** 等高線の間隔設定 */
  setContourSpacing = (spacing: number) =>
    this.props.setContourOptions(undefined, spacing, undefined)
  /** 等高線の色設定 */
  setContourColor = (color: string) =>
    this.props.setContourOptions(undefined, undefined, color)

  resetImageryProvider = async () => {
    this.setImageryProvider(
      new OpenStreetMapImageryProvider({
        url: 'https://tile.openstreetmap.org/'
      })
    )
  }

  flyToSite = (isInit: boolean = false) => {
    // force update to trigger re-render on components that use cesium camera values as props
    this.forceUpdate()

    // ホームビューに設定されたビューポイントを適用
    let homeViewSetting
    const viewpointList = this.props.viewpointList || []
    const homeViewpoint = viewpointList.find(viewpoint => viewpoint.isHomeView)

    if (homeViewpoint) {
      homeViewSetting = homeViewpoint.cesiumParams
    } else if (isInit && this.props.site.homeView) {
      // ビューポイント未取得の初期化処理の場合、現場取得時の設定を適用
      homeViewSetting = this.props.site.homeView
    }

    if (homeViewSetting) {
      const { position, direction, up } = homeViewSetting
      this.viewer.current.camera.flyTo({
        destination: position,
        orientation: { direction, up }
      })
    } else {
      const { left, bottom, right, top } = this.props.site?.location
        ?.bounds || {
        top: 35.888679610911744,
        left: 139.61210965314862,
        right: 139.67869034685137,
        bottom: 35.83472038908827
      } // TODO: EHVではDBの値が削除されてしまったので、ダミーの値
      const rectangle = Rectangle.fromDegrees(left, bottom, right, top)
      const center = Rectangle.center(rectangle)
      const destination = Cartesian3.fromRadians(
        center.longitude,
        center.latitude,
        500
      )
      this.viewer.current.camera.flyTo({ destination })
    }
  }

  onZoomInClick = () => {
    this.viewer.current.camera.moveForward(200)
  }

  onZoomOutClick = () => {
    this.viewer.current.camera.moveBackward(200)
  }

  /**
   * 現在地ボタンクリックイベント
   */
  onCurrentLocationClick = () => {
    // 現在地を取得し、地図表示を移動させる
    this.props.flyToCurrentLocation()
  }

  /**
   * 全画面表示ボタンクリックイベント
   */
  onFullscreenButtonClick = () => {
    // フルスクリーン対象の要素を取得
    const fullscreenTarget = this.viewer.current
      ? this.viewer.current.container
      : null
    if (fullscreenTarget) {
      if (!this.state.isFullscreen) {
        // 対象要素を全画面表示
        fullscreenTarget.requestFullscreen()
      } else {
        // 全画面表示の解除
        // $FlowFixMe
        document.exitFullscreen()
      }
    }
  }

  /**
   * 全画面表示切り替えイベント
   */
  // $FlowFixMe
  onFullscreenChange = (event: Event) => [
    this.setState({ isFullscreen: document.fullscreenElement != null })
  ]

  /** キーダウンイベント */
  onKeyDown = (ev: KeyboardEvent) => {
    // フォーカスが編集可能要素に当たっていない時のみ地図操作を実行
    let isControllable = true
    const activeElement = document.activeElement
    if (activeElement != null) {
      if (
        activeElement.nodeName === 'INPUT' || // input要素
        activeElement.nodeName === 'TEXTAREA' || // テキスト要素
        activeElement.getAttribute('contenteditable') === 'true' // 編集可能要素
      ) {
        isControllable = false
      }
    }
    if (isControllable) {
      // 押されたキーに該当する地図操作のフラグを立てる
      const keySettings = this.props.mapControlKeySettings
      switch (ev.code) {
        case keySettings.zoomIn:
          this.setMapControlFlags('zoomIn', true)
          break
        case keySettings.zoomOut:
          this.setMapControlFlags('zoomOut', true)
          break
        case keySettings.moveUp:
          this.setMapControlFlags('moveUp', true)
          break
        case keySettings.moveDown:
          this.setMapControlFlags('moveDown', true)
          break
        case keySettings.moveFoward:
          this.setMapControlFlags('moveFoward', true)
          break
        case keySettings.moveBackward:
          this.setMapControlFlags('moveBackward', true)
          break
        case keySettings.moveLeft:
          this.setMapControlFlags('moveLeft', true)
          break
        case keySettings.moveRight:
          this.setMapControlFlags('moveRight', true)
          break
        case keySettings.rotateUp:
          this.setMapControlFlags('rotateUp', true)
          break
        case keySettings.rotateDown:
          this.setMapControlFlags('rotateDown', true)
          break
        case keySettings.rotateLeft:
          this.setMapControlFlags('rotateLeft', true)
          break
        case keySettings.rotateRight:
          this.setMapControlFlags('rotateRight', true)
          break
        case keySettings.twistLeft:
          this.setMapControlFlags('twistLeft', true)
          break
        case keySettings.twistRight:
          this.setMapControlFlags('twistRight', true)
          break
        default:
          break
      }
    }
  }

  /** キーアップイベント */
  onKeyUp = (ev: KeyboardEvent) => {
    // 離されたキーに該当する地図操作のフラグを解除する
    const keySettings = this.props.mapControlKeySettings
    switch (ev.code) {
      case keySettings.zoomIn:
        this.setMapControlFlags('zoomIn', false)
        break
      case keySettings.zoomOut:
        this.setMapControlFlags('zoomOut', false)
        break
      case keySettings.moveUp:
        this.setMapControlFlags('moveUp', false)
        break
      case keySettings.moveDown:
        this.setMapControlFlags('moveDown', false)
        break
      case keySettings.moveFoward:
        this.setMapControlFlags('moveFoward', false)
        break
      case keySettings.moveBackward:
        this.setMapControlFlags('moveBackward', false)
        break
      case keySettings.moveLeft:
        this.setMapControlFlags('moveLeft', false)
        break
      case keySettings.moveRight:
        this.setMapControlFlags('moveRight', false)
        break
      case keySettings.rotateUp:
        this.setMapControlFlags('rotateUp', false)
        break
      case keySettings.rotateDown:
        this.setMapControlFlags('rotateDown', false)
        break
      case keySettings.rotateLeft:
        this.setMapControlFlags('rotateLeft', false)
        break
      case keySettings.rotateRight:
        this.setMapControlFlags('rotateRight', false)
        break
      case keySettings.twistLeft:
        this.setMapControlFlags('twistLeft', false)
        break
      case keySettings.twistRight:
        this.setMapControlFlags('twistRight', false)
        break
      default:
        break
    }
  }

  /** Cesium.Viewerの定期イベント */
  onTick = (clock: any) => {
    if (this.viewer.current && this.viewer.current.camera) {
      // 操作感度設定
      const camera = this.viewer.current.camera
      const cartographic = getPositionByCartographic(this.viewer.current)

      /** ズームの感度[m] */
      const zoomRate = 100
      /**
       * 移動操作の感度[m]
       * 画面の高度から算出
       */
      const moveRate = cartographic.height / 100.0
      /** 捻り操作の感度[radian] */
      const twistRate = (2 * Math.PI) / 100.0

      // 操作設定に該当するキーが押下されていれば、地図を操作する
      const flags = this.state.mapControlFlags
      if (flags.zoomIn) {
        camera.zoomIn(zoomRate)
      }
      if (flags.zoomOut) {
        camera.zoomOut(zoomRate)
      }
      if (flags.moveUp) {
        camera.moveUp(moveRate)
      }
      if (flags.moveDown) {
        camera.moveDown(moveRate)
      }
      if (flags.moveFoward) {
        camera.moveForward(moveRate)
      }
      if (flags.moveBackward) {
        camera.moveBackward(moveRate)
      }
      if (flags.moveLeft) {
        camera.moveLeft(moveRate)
      }
      if (flags.moveRight) {
        camera.moveRight(moveRate)
      }
      if (flags.rotateUp) {
        camera.lookUp()
      }
      if (flags.rotateDown) {
        camera.lookDown()
      }
      if (flags.rotateLeft) {
        camera.lookLeft()
      }
      if (flags.rotateRight) {
        camera.lookRight()
      }
      if (flags.twistLeft) {
        camera.twistLeft(twistRate)
      }
      if (flags.twistRight) {
        camera.twistRight(twistRate)
      }
    }
  }

  onCameraChange () {
    // force update to trigger re-render on components that use cesium camera values as props
    this.forceUpdate()
  }

  componentDidMount () {
    if (this.props.site) {
      this.flyToSite(true)
    }

    this.viewer.current.screenSpaceEventHandler.removeInputAction(
      ScreenSpaceEventType.LEFT_CLICK
    )
    this.viewer.current.screenSpaceEventHandler.removeInputAction(
      ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    )

    this.viewer.current.camera.percentageChanged = 0.001
    this.viewer.current.camera.changed.addEventListener(
      this.onCameraChange,
      this
    )

    // キーのイベントを定義
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
    // 地図の定期イベントを定義
    if (
      this.viewer.current &&
      this.viewer.current.clock &&
      this.viewer.current.clock.onTick
    ) {
      this.viewer.current.clock.onTick.addEventListener(this.onTick)
    }

    // 全画面表示切り替えイベントを定義
    document.addEventListener('fullscreenchange', this.onFullscreenChange)

    this.resetImageryProvider() // 非同期
  }

  componentWillUnmount () {
    this.viewer.current.camera.changed.removeEventListener(
      this.onCameraChange,
      this
    )
  }

  componentDidUpdate (oldProps: Props, oldState: State) {
    if (this.props.isMobile) {
      this.setMapSettingsOpen(this.props.isMapSetting)
    }

    if (oldProps.site !== this.props.site && this.props.site) {
      this.flyToSite(true)
    }

    if (
      this.props.viewer &&
      ((this.props.viewer.scene.mapViewMode &&
        this.props.viewer.scene.mapViewMode !==
          MAPVIEW[this.state.mapviewName]) ||
        (!this.props.viewer.scene.mapViewMode &&
          this.props.viewer.scene.mode !== MAPVIEW[this.state.mapviewName]))
    ) {
      this.props.changeSceneMode(MAPVIEW[this.state.mapviewName])
    }

    if (oldState.isFullscreen !== this.state.isFullscreen) {
      if (this.viewer.current) {
        const viewerChildren = this.viewer.current.container.children
        for (const element of viewerChildren) {
          // フルスクリーン画面に必要のないパーツを表示を切り替え
          if (
            !element.classList.contains('cesium-viewer') &&
            element.id !== 'fullscreenButton'
          ) {
            element.style.visibility = this.state.isFullscreen
              ? 'hidden'
              : 'visible'
          }
        }
      }
    }

    if (oldState.mapType !== this.state.mapType) {
      this.resetImageryProvider() // 非同期
    }
  }

  onMount = async viewer => {
    // hide cesium credits
    const [credits] = document.getElementsByClassName('cesium-widget-credits')
    if (credits) {
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
        ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      )
      const [cesiumLogo] = document.getElementsByClassName(
        'cesium-credit-logoContainer'
      )
      if (cesiumLogo) {
        cesiumLogo.style.display = 'none'
      }
    }
    /* モバイル表示の場合、copy rightをdata attributionに追加する
       FIXME: メソッドaddDefaultCreditでcopy rightをdata attributionの中に追加することができないため、直接elementを編集する
       issue: https://github.com/CesiumGS/cesium/issues/6215 */
    if (this.props.isMobile) {
      const dataAttributionElement = document.getElementsByClassName(
        'cesium-credit-lightbox'
      )[0]
      const sitePermissionElement = document.createElement('div')
      sitePermissionElement.textContent = SITE_PERMISSION_TEXT
      sitePermissionElement.setAttribute(
        'style',
        'padding: 0 20px 20px 20px; font-size: 12px;'
      )
      dataAttributionElement.appendChild(sitePermissionElement)
    }

    this.props.setViewer(viewer)
    const setClusterList = this.props.setClusterList
    // クラスタのイベント定義
    viewer.screenSpaceEventHandler.setInputAction(function (click) {
      // アニメーションキャンセル
      viewer.scene.camera.cancelFlight()
      const pickedClusters = viewer.scene.pick(click.position)
      if (
        pickedClusters &&
        pickedClusters.id &&
        Array.isArray(pickedClusters.id) &&
        pickedClusters.id.length > 1
      ) {
        setClusterList(pickedClusters.id)
      }
    }, ScreenSpaceEventType.LEFT_CLICK)
    // 初期地形設定
    if (BASE_TERRAIN_DEFAULT_ION_ASSET_ID) {
      viewer.terrainProvider = await CesiumTerrainProvider.fromIonAssetId(
        BASE_TERRAIN_DEFAULT_ION_ASSET_ID
      )
    }
    // Websocket初期化
    this.props.notifyInit()
    /* TODO:Google Photorealistic 3DTileset機能ペンディング
    // Google Photorealistic 3DTileset設定(初回は非表示)
    const tileset = await createGooglePhotorealistic3DTileset()
    tileset.show = false
    tileset.assetId = GP3DT_ID
    viewer.scene.primitives.add(tileset)
    */
  }

  onUnmount = () => {
    this.props.unsetViewer()
  }

  render () {
    const {
      mapType,
      renderQualityName,
      mapviewName,
      globeTranslucencyAlpha,
      globeTranslucencyFade,
      baseTerrain,
      imageryProvider
    } = this.state

    const resolutionScale = RENDER_QUALITY[renderQualityName]

    return (
      <Viewer
        ref={this.viewer}
        style={{ position: 'relative', height: '100%' }}
        onMount={this.onMount}
        onUnmount={this.onUnmount}
        animation={false}
        timeline={false}
        fullscreenButton={false}
        baseLayerPicker={false}
        imageryProvider={false} // disable default imagery provider
        geocoder={false}
        homeButton={false}
        scene3DOnly={false}
        sceneModePicker={false}
        requestRenderMode // reduce cpu load by only rendering when things change - may require manual rendering in some places.
        maximumRenderTimeChange={Infinity} // time changes will never cause re-renders - may need to change this is we add time sensitive features.
        selectionIndicator={false}
        navigationHelpButton={false}
        resolutionScale={resolutionScale}
        targetFrameRate={30}
      >
        <CesiumCreditStyle />
        <ScreenSpaceCameraController enableCollisionDetection={false} />
        <GlobeContext.Consumer>
          {globe => {
            // translucency に透明色が設定されていると depthTestAgainstTerrain が無効となるため、
            // 地形の下にあるアセットを透過表示する際には translucency を無効にする。
            globe.translucency.enabled = this.state.isHiddenBelowTerrain
            globe.baseColor = Color.BLACK
            globe.depthTestAgainstTerrain = this.state.isHiddenBelowTerrain
            if (this.state.isHiddenBelowTerrain) {
              // TODO: 特に操作感に違和感がないため、sandcastleの値をそのまま採用。動的に設定する場合は修正対象。
              globe.translucency.frontFaceAlphaByDistance = new NearFarScalar(
                400.0,
                0.0,
                800.0,
                1.0
              )
              globe.translucency.frontFaceAlphaByDistance.nearValue =
                1 - globeTranslucencyAlpha
              globe.translucency.frontFaceAlphaByDistance.farValue = globeTranslucencyFade
                ? 1.0
                : 1 - globeTranslucencyAlpha
            }
            const imageryLayer = globe.imageryLayers.get(0)
            if (imageryLayer) {
              imageryLayer.alpha = this.state.isHiddenBelowTerrain
                ? 1
                : 1 - globeTranslucencyAlpha
            }
            this.viewer.current.scene.requestRenderMode &&
              this.viewer.current.scene.requestRender()
          }}
        </GlobeContext.Consumer>
        {/* 地図操作メニュー(モバイル表示時に方角と現在地のみが表示される) */}
        <Absolute bottom={75} right={15}>
          <CameraContext.Consumer>
            {camera => (
              <MapNavigator
                onHomeClick={() => this.flyToSite()}
                onZoomInClick={this.onZoomInClick}
                onZoomOutClick={this.onZoomOutClick}
                onCurrentLocationClick={this.onCurrentLocationClick}
                rotation={CesiumMath.toDegrees(-camera.heading)}
                isMobile={this.props.isMobile}
              />
            )}
          </CameraContext.Consumer>
        </Absolute>
        {/** 全画面表示ボタン(モバイル表示時に非表示) */}
        {!this.props.isMobile && (
          <Absolute id='fullscreenButton' bottom={15} right={24}>
            <FullscreenButton
              isFullscreen={this.state.isFullscreen}
              isDisabled={this.state.isFullscreenDisabled}
              onClick={this.onFullscreenButtonClick}
            />
          </Absolute>
        )}
        {/* モバイル版用ファイルアップロードモーダルを開くボタン 公開画面では表示しない */}
        {this.props.isMobile && <Fixed bottom={50} left={20} />}
        <Fixed top={25} right={25}>
          {/* モバイル版はマップ表示設定ボタンを非表示 */}
          {!this.props.isMobile && (
            <TooltipWrapper>
              <MapMore
                open={this.state.mapSettingsOpen}
                onClick={() =>
                  this.setMapSettingsOpen(!this.state.mapSettingsOpen)
                }
              />
              <Tooltip className='description'>
                {this.props.t('mapMore.tooltip')}
              </Tooltip>
            </TooltipWrapper>
          )}
        </Fixed>
        {/* スケール(モバイル表示時に非表示) */}
        {!this.props.isMobile && (
          <Fixed bottom={27} right={75}>
            <Scale />
          </Fixed>
        )}
        <Absolute bottom={0} left={90}>
          <SiteTermsOfService />
        </Absolute>
        {/* コピーライト(モバイル表示時にdata attributionの中に表示するため、ここに非表示する) */}
        {!this.props.isMobile && (
          <Absolute bottom={0} left={135}>
            <SitePermissionToUse />
          </Absolute>
        )}
        {this.state.mapSettingsOpen && (
          <ModalWindowsContext.Provider>
            <MapSettingsMenu
              top={this.props.isMobile ? 60 : 80}
              right={this.props.isMobile ? 0 : 25}
              mapView={mapviewName}
              onChangeMapView={this.setMapview}
              baseTerrain={baseTerrain}
              baseTerrainList={this.props.baseTerrainList}
              onChangeBaseTerrain={this.setBaseTerrain}
              mapType={mapType}
              onChangeMapType={this.setMapType}
              renderQuality={renderQualityName}
              onChangeRenderQuality={this.setRenderQuality}
              isFadeByDistance={this.state.globeTranslucencyFade}
              onChangeFadeByDistance={this.setGlobeTranslucencyFade}
              alphaValue={this.state.globeTranslucencyAlpha}
              onChangeAlphaData={this.setGlobeTranslucencyAlpha}
              isEnableContour={this.props.contourOptions.enable}
              onChangeEnableContour={this.setContourEnable}
              spacing={this.props.contourOptions.spacing}
              onChangeSpacing={this.setContourSpacing}
              color={this.props.contourOptions.color}
              onChangeColor={this.setContourColor}
              isHiddenBelowTerrain={this.state.isHiddenBelowTerrain}
              onChangeIsHiddenBelowTerrain={this.setIsHiddenBelowTerrain}
            />
          </ModalWindowsContext.Provider>
        )}
        {imageryProvider && (
          <ImageryLayer index={0} imageryProvider={imageryProvider} />
        )}
        <Slot name='site.cesium' />
      </Viewer>
    )
  }
}

export default SiteViewer
