// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import styled from 'styled-components'
import type { TFunction } from 'react-i18next'

import { IconInfo2 } from '@ehv/datahub-icons'
import { type Asset } from 'plugins/asset/reducer'

export type EditStatusIconProps = {
  asset: Asset,
  isMobile: boolean,
  t: TFunction
}

const iconStyle = (isMobile: boolean) => ({
  width: isMobile ? '18px' : '15px',
  height: isMobile ? '18px' : '15px',
  verticalAlign: 'middle',
  textAlign: 'center'
})

const IconWrapper = styled.div`
  display: block;
  width: 30px;
  height: 18px;
  text-align: center;
  line-height: 0;

  &:hover .description {
    display: flex;
    justify-content: center;
    transform: translate(38px, -24px);
  }
  rect {
    fill: ${({ color }) => color};
  }
`
const Tooltip = styled.div`
  display: none;
  position: fixed;
  padding: 8px;
  font-size: 12px;
  line-height: 1.6em;
  color: #fff;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.8);
  white-space: pre-line;
`
export const EditStatusIcon = (props: EditStatusIconProps) => {
  const { asset, isMobile, t } = props
  const { isDisplay } = asset
  return (
    <IconWrapper color={isDisplay ? '#3a4248' : '#8e96a0'}>
      <IconInfo2 style={iconStyle(isMobile)} />
      <Tooltip className='description'>{t('menu.edit.asset.tooltip')}</Tooltip>
    </IconWrapper>
  )
}

export default EditStatusIcon
