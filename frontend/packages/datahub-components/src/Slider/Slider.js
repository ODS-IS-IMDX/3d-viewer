// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { Box, themed, Text } from '@ehv/design-system'

import theme from './theme'

type SliderLabelProps = {
  label: string,
  value: number,
  unit: string
}

export type SliderProps = {
  format?: number => number,
  label?: string,
  max?: number,
  min?: number,
  onChange: number => void,
  step?: number,
  unit?: string,
  value: number
}

const StyledSlider = styled.input`
  flex: 6;
  -webkit-appearance: none;
  width: 100%;

  &:focus {
    outline: none;
  }

  ${// $FlowFixMe
  themed('Slider', theme)}
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    ${// $FlowFixMe
    themed('Slider.Thumb', theme.Thumb)}
  }
  &::-moz-range-thumb {
    ${// $FlowFixMe
    themed('Slider.Thumb', theme.Thumb)}
  }
`

const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const Label = styled.label`
  display: inline-flex;
  ${// $FlowFixMe
  themed('Slider.Label', theme.Label)}
`

const SliderLabel = ({ label, unit, value }: SliderLabelProps) => {
  const labelValue = `${value}${unit}`
  return (
    <Label>
      <Text size='0'>{label}</Text>
      <Text ml='3px' fontWeight='600' size='0'>
        {labelValue}
      </Text>
    </Label>
  )
}

export function Slider ({
  format = value => value,
  label = '',
  max = 100,
  min = 0,
  onChange = () => {},
  step = 1,
  unit = '',
  value = 50
}: SliderProps) {
  const handleOnChange = e => {
    onChange(e.target.value)
  }

  return (
    <Box>
      {label && <SliderLabel label={label} unit={unit} value={format(value)} />}
      <SliderWrapper>
        <StyledSlider
          type='range'
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleOnChange}
        />
      </SliderWrapper>
    </Box>
  )
}

export default Slider
