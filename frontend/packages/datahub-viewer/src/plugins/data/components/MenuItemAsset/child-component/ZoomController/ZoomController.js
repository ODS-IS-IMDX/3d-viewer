// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { IconMapZoomPin } from '@ehv/datahub-icons'

import type { AssetID, Asset, AssetRenderingState } from 'plugins/asset/reducer'

const IconWrapper = styled.div`
  display: block;
  width: 30px;
  height: 18px;
  text-align: center;
  line-height: 0;
`
const LoadingIconWrapper = styled(IconWrapper)`
  transform: scale(0.4) translate(-8px, -10px);
`
const IconLoading = props => (
  <svg width={40} height={40} {...props}>
    <defs>
      <radialGradient
        id='asset_loading_svg'
        cx={0.805}
        cy={0.845}
        r={0.678}
        gradientTransform='matrix(-.449 -.893 2.037 -1.024 -.554 2.428)'
      >
        <stop offset={0} stopColor='#000' />
        <stop offset={0.36} stopColor='#000' />
        <stop offset={1} stopColor='#000' stopOpacity={0.141} />
      </radialGradient>
    </defs>
    <path
      d='M2052.586-4360.344l4.715-9.58V-4359a21.06 21.06 0 01-4.715-1.344zm9.565-9.975l5.377 9.459a20.906 20.906 0 01-4.744 1.232zm-18.045 4.176l8.8-5.9-5.377 9.456a21.2 21.2 0 01-3.423-3.556zm22.054-6.981l9.311 5.461a21.487 21.487 0 01-3.5 3.477zm-26.544-2.347l10.527-.643-9.311 5.462a21.8 21.8 0 01-1.216-4.819zm28.632-2.118H2079a21.978 21.978 0 01-1.32 4.792zM2039-4381.04a21.9 21.9 0 011.322-4.789l9.432 4.789zm3.53-9.923a21.288 21.288 0 013.5-3.479l5.81 8.939zm7.941-6.8a21.04 21.04 0 014.746-1.235l.628 10.692z'
      data-name='Union 157'
      transform='translate(-2039 4399.001)'
      fill='url(#asset_loading_svg)'
    />
  </svg>
)
const LoadingIcon = styled(IconLoading)`
  animation: rotate 1s infinite;
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
const iconStyle = (isMobile: boolean) => ({
  width: isMobile ? '18px' : '15px',
  height: isMobile ? '18px' : '15px',
  verticalAlign: 'middle',
  textAlign: 'center'
})

type ZoomControllerProps = {|
  asset: Asset,
  assetRenderingStatus: AssetRenderingState,
  flyToFunctionList: Array<(id: AssetID) => void>,
  isLoading: boolean,
  subFileType: number,
  isMobile: boolean
|}

const Controller = (props: ZoomControllerProps) => {
  const {
    asset,
    assetRenderingStatus,
    subFileType,
    flyToFunctionList,
    isLoading,
    isMobile
  } = props
  const { id, isDisplay } = asset

  const flyToAsset = event => {
    event.stopPropagation()
    // アセットが非表示のときには、オブジェクトが存在せずflyToが実行できないため、
    // 表示時のみflyToを実行する
    if (isDisplay) {
      flyToFunctionList[subFileType](id)
    }
  }

  return assetRenderingStatus[id] === undefined ||
    (!assetRenderingStatus[id] && !isLoading) ? (
    <IconWrapper onClick={flyToAsset}>
      <IconMapZoomPin
        style={iconStyle(isMobile)}
        color={isDisplay ? '#3a4248' : '#8e96a0'}
      />
    </IconWrapper>
  ) : (
    <LoadingIconWrapper>
      <LoadingIcon />
    </LoadingIconWrapper>
  )
}

export const ZoomController = React.memo<ZoomControllerProps>(Controller)
