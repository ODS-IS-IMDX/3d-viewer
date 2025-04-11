// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useEffect, useState } from 'react'
import type { WithNamespaces } from 'react-i18next'
import styled from 'styled-components'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { Flex, Text, Switch, Input } from '@ehv/datahub-components'
import MapSettingsMenuItem from '../MapSettingsMenuItem/MapSettingsMenuItem'
import { ColorSelector } from '../../../../components/ColorSelector'

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

const TextItemWrapper = styled(MapSettingsMenuItem)`
  padding-bottom: 6px;
`
const ColorSelectorWrapper = styled(MapSettingsMenuItem)`
  width: 240px;
`

export type GlobeContourMenuProps = WithNamespaces & {
  width?: number,
  onClose: () => void,
  position: {
    top: number,
    left: number,
    right: number,
    bottom: number
  },
  onClickOutside: () => void,
  /** 等高線の表示 */
  isEnableContour?: boolean,
  /** 等高線表示切替時イベント */
  onChangeEnableContour: (enable: boolean) => void,
  /** 等高線の間隔 */
  spacing?: number,
  /** 等高線間隔変更イベント */
  onChangeSpacing: (space: number) => void,
  /** 等高線の色（#FFFFFF） */
  color?: string,
  /** 等高線の色変更イベント */
  onChangeColor: (color: string) => void
}

/**
 * 等高線表示メニュー
 */
const GlobeContourMenu = ({
  t,
  width = 400,
  onClose,
  position,
  onClickOutside,
  isEnableContour = false,
  onChangeEnableContour,
  spacing = 100,
  onChangeSpacing,
  color = '',
  onChangeColor,
  ...props
}: GlobeContourMenuProps) => {
  /** 等高線表示状態 */
  const [enable, setEnable] = useState(isEnableContour)
  /** 等高線間隔（レンジバーによるもの） */
  const [spaceByRange, setSpaceByRange] = useState(spacing)
  /** 等高線間隔（手入力によるもの） */
  const [spaceByInput, setSpaceByInput] = useState(null)

  const minValue = 10
  const maxValue = 500

  useEffect(() => {
    // 手入力の値が反映された後、レンジバーを動かせるようにするためにnullを代入
    setSpaceByInput(null)
  }, [spaceByInput])

  return (
    <Flex flexDirection='column'>
      {/** 等高線表示 */}
      <MapSettingsMenuItem variant='normal' justifyContent='space-between'>
        <Text fontWeight={600}>{t('globeContour.show')}</Text>
        <Flex style={{ margin: '0 100px 0 0' }}>
          <Switch
            checked={enable}
            onChange={event => {
              const checked = event.target.checked
              setEnable(checked)
              onChangeEnableContour(checked)
            }}
          />
        </Flex>
      </MapSettingsMenuItem>
      {/** 間隔 */}
      <TextItemWrapper>
        <Text>{t('globeContour.spacing')}</Text>
      </TextItemWrapper>
      <MapSettingsMenuItem variant='normal' flexDirection='column'>
        <Flex alignItems='center'>
          <RangeContourSpace
            min={minValue}
            max={maxValue}
            step={10}
            defaultValue={spacing}
            value={spaceByInput}
            onAfterChange={(value: number) => {
              setSpaceByRange(value)
              onChangeSpacing(value)
            }}
          />
          <InputContourSpace
            defaultValue={spaceByRange}
            min={minValue}
            max={maxValue}
            // onChange={onChangeSpacing} // 変更時にフォーカスが外れてしまうのでonBlurでonChangeSpacingを発火
            onChange={value => {}}
            onBlur={(value: number) => {
              setSpaceByInput(value)
              onChangeSpacing(value)
            }}
          />
          <Text style={{ margin: '0 0 0 10px' }}>m</Text>
        </Flex>
      </MapSettingsMenuItem>
      {/** 色 */}
      <TextItemWrapper>
        <Text>{t('globeContour.color')}</Text>
      </TextItemWrapper>
      <ColorSelectorWrapper variant='normal' flexDirection='column'>
        <ColorSelector value={color} onChange={onChangeColor} />
      </ColorSelectorWrapper>
    </Flex>
  )
}

type RangeContourSpaceType = {
  min: number,
  max: number,
  step: number,
  defaultValue: number | null,
  value: number | null,
  onAfterChange: (value: number) => void
}

/**
 * 等高線間隔入力レンジバー
 */
const RangeContourSpace = (props: RangeContourSpaceType) => {
  const {
    min,
    max,
    step,
    defaultValue = min,
    value = null,
    onAfterChange
  } = props

  return (
    // valueを指定すると手動で変更できなくなるので使い分ける
    value != null ? (
      <Range
        handleStyle={handleStyle}
        railStyle={railStyle}
        className='slider'
        min={min}
        max={max}
        step={step}
        value={value < min ? min : value > max ? max : value}
        included={false}
        onAfterChange={onAfterChange}
      />
    ) : (
      <Range
        handleStyle={handleStyle}
        railStyle={railStyle}
        className='slider'
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        included={false}
        onAfterChange={onAfterChange}
      />
    )
  )
}

type InputContourSpaceType = {
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

/**
 * 等高線間隔入力欄
 * メニュー内で定義すると入力ごとに再レンダリングが走ってしまうので別定義
 */
const InputContourSpace = (props: InputContourSpaceType) => {
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
      step={0.1}
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

export default GlobeContourMenu
