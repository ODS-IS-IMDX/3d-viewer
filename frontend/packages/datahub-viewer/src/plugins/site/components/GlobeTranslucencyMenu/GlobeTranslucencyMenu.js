// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useEffect, useState } from 'react'
import {
  Checkbox as BaseCheckbox,
  Flex,
  Input,
  Text
} from '@ehv/datahub-components'
import type { WithNamespaces } from 'react-i18next'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import MapSettingsMenuItem from '../MapSettingsMenuItem/MapSettingsMenuItem'
import styled from 'styled-components'

const createSliderWithTooltip = Slider.createSliderWithTooltip
const Range = createSliderWithTooltip(Slider)

const handleStyle = {
  width: 22,
  height: 22,
  marginTop: -11,
  backgroundColor: '#fff',
  border: '2px solid #15aae3'
}
const railStyle = {
  height: 9,
  transform: 'translateY(-50%)'
}

export type GlobeTranslucencyMenuProps = WithNamespaces & {
  isFadeByDistance: boolean,
  onChangeFadeByDistance: (isFadeByDistance: boolean) => void,
  alphaValue: number,
  setAlphaData: (value: number) => void,
  isHiddenBelowTerrain: boolean,
  onChangeIsHiddenBelowTerrain: (isHiddenBelowTerrain: boolean) => void
}

const FixedSlider = ({ defaultValue, value, min, max, ...props }) => {
  return value != null ? (
    <Range
      min={min}
      max={max}
      value={value < min ? min : value > max ? max : value}
      {...props}
    />
  ) : (
    <Range min={min} max={max} defaultValue={defaultValue} {...props} />
  )
}

const minValue = 0
const maxValue = 100

const Checkbox = styled(BaseCheckbox)`
  &:disabled {
    background: #ccc;
    border: 1px solid #ccc;
  }
`
const GlobeTranslucencyMenu = React.memo(
  ({
    t,
    isFadeByDistance,
    alphaValue,
    onChangeFadeByDistance,
    setAlphaData,
    isHiddenBelowTerrain,
    onChangeIsHiddenBelowTerrain,
    ...props
  }: GlobeTranslucencyMenuProps) => {
    const truncValue = Math.trunc(alphaValue * 100)

    const [alphaValueBySlider, setAlphaValueBySlider] = useState(truncValue)
    const [alphaValueByInput, setAlphaValueByInput] = useState(null)

    const percentAlpha = alphaValue * 100

    useEffect(() => {
      // 手入力の値が反映された後、レンジバーを動かせるようにするためにnullを代入
      setAlphaValueByInput(null)
    }, [alphaValueByInput])

    return (
      <>
        <MapSettingsMenuItem>
          <Text fontWeight={600}>{t('globeTranslucency.label')}</Text>
        </MapSettingsMenuItem>
        <MapSettingsMenuItem>
          <Text>{t('globeTranslucency.alpha')}</Text>
        </MapSettingsMenuItem>
        <MapSettingsMenuItem variant='normal' flexDirection='column'>
          <Flex alignItems='center'>
            <FixedSlider
              railStyle={railStyle}
              handleStyle={handleStyle}
              className='slider'
              min={minValue}
              max={maxValue}
              step={1}
              defaultValue={percentAlpha}
              value={alphaValueByInput}
              included={false}
              // TODO: onChangeを採用するとスライダーの挙動に違和感があるためonAfterChangeを採用。blurイベントの影響がなくなるとonChangeは想定通りの挙動となるところまで判明。
              onAfterChange={value => {
                const alphaValue = value / 100
                setAlphaValueBySlider(value)
                setAlphaData(alphaValue)
              }}
            />
            <InputGlobeTranslucency
              defaultValue={alphaValueBySlider}
              min={minValue}
              max={maxValue}
              onChange={(value: number) => {}}
              onBlur={(value: number) => {
                const alphaValue = value / 100
                setAlphaValueByInput(value)
                setAlphaData(alphaValue)
              }}
            />
            <Text style={{ margin: '0 0 0 10px' }}>%</Text>
          </Flex>
        </MapSettingsMenuItem>
        <MapSettingsMenuItem alignItems='center'>
          <Checkbox
            checked={isHiddenBelowTerrain ? isFadeByDistance : false}
            onChange={() => {
              if (isHiddenBelowTerrain) {
                onChangeFadeByDistance(!isFadeByDistance)
              }
            }}
            disabled={!isHiddenBelowTerrain}
            readOnly
          />
          <Text style={{ margin: '0 0 0 10px' }}>
            {t('globeTranslucency.fade')}
          </Text>
        </MapSettingsMenuItem>
        <MapSettingsMenuItem alignItems='center'>
          <Checkbox
            checked={isHiddenBelowTerrain}
            onChange={() => onChangeIsHiddenBelowTerrain(!isHiddenBelowTerrain)}
            readOnly
          />
          <Text style={{ margin: '0 0 0 10px' }}>
            {t('globeTranslucency.hiddenBelowTerrain')}
          </Text>
        </MapSettingsMenuItem>
      </>
    )
  }
)

export type InputGlobeTranslucencyType = {
  defaultValue: number,
  min: number,
  max: number,
  onChange: (value: number) => void,
  onBlur: (value: number) => void
}

const InputWrapper = styled(Input)`
  padding: 2px;
  font-size: 12px;
  border-bottom: 1px solid #3a3a3a;
  border-radius: 0;
  background-color: #ffffff;
`

const InputGlobeTranslucency = (props: InputGlobeTranslucencyType) => {
  const { defaultValue, min, max, onChange, onBlur } = props

  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  return (
    <InputWrapper
      editable
      width={55}
      style={{ margin: '0 0 0 25px' }}
      type='number'
      min={min}
      max={max}
      step={1}
      value={value}
      onChange={event => {
        setValue(event.target.value)
        const newValue = parseFloat(event.target.value)
        onChange(newValue)
      }}
      onBlur={event => {
        const newValue = parseFloat(event.target.value)
        if (!isNaN(newValue)) {
          const varidateValue =
            newValue < min ? min : newValue > max ? max : newValue
          setValue(varidateValue)
          onBlur(varidateValue)
        } else {
          onBlur(newValue)
        }
      }}
    />
  )
}

export default GlobeTranslucencyMenu
