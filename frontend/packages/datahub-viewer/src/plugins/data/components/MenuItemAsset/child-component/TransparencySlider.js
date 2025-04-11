// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import Slider from 'rc-slider'
import styled from 'styled-components'
import { Flex, Text } from '@ehv/datahub-components'

import type { AssetID } from 'plugins/asset/reducer'

type TransparencySliderProps = {
  title: string,
  value: number,
  isMobile: boolean,
  onAfterChange: (id: AssetID, transparency: number) => void
}

const handleStyle = {
  width: 16,
  height: 16,
  marginTop: -8,
  backgroundColor: '#fff',
  border: '2px solid #15aae3'
}
const railStyle = {
  height: 5,
  transform: 'translateY(-50%)'
}
const dotStyle = {
  display: 'none'
}
const StyledFlex = styled(Flex)`
  width: 100%;
  margin: 8px 8px 16px 0;
`
const TextWrapper = styled(Flex)`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ isMobile }) => isMobile && 'max-width: 130px;'}
`
const RangeWrapper = styled.div`
  margin-left: 24px;
  width: ${({ isMobile }) => (isMobile ? 180 : 120)}px;
`

const Component = (props: TransparencySliderProps) => {
  const { title, value, isMobile, onAfterChange } = props

  const createSliderWithTooltip = Slider.createSliderWithTooltip
  const Range = createSliderWithTooltip(Slider)
  return (
    <StyledFlex justifyContent='space-between'>
      <TextWrapper
        justifyContent='center'
        alignItems='center'
        isMobile={isMobile}
      >
        <Text style={{ fontSize: isMobile ? '14px' : '11px' }}>{title}</Text>
      </TextWrapper>
      <RangeWrapper isMobile={isMobile}>
        <Range
          handleStyle={handleStyle}
          railStyle={railStyle}
          dotStyle={dotStyle}
          min={0.0}
          max={1.0}
          step={0.1}
          defaultValue={value}
          // $FlowFixMe[infererror]
          marks={{ 0.0: 'min', 1.0: 'max' }}
          included={false}
          onAfterChange={onAfterChange}
        />
      </RangeWrapper>
    </StyledFlex>
  )
}

export const TransparencySlider = React.memo<TransparencySliderProps>(Component)
