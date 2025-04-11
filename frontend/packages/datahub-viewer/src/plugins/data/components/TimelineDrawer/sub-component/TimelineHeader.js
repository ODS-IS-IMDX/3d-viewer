// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { memo, useState } from 'react'
import type { TFunction } from 'react-i18next'
import {
  Button as ButtonComponent,
  Flex,
  Input as InputComponent,
  Text as TextComponent
} from '@ehv/design-system'
import { CustomRadioGroup } from '@ehv/datahub-components'
import { IconPlaySolid, IconStopSolid } from '@ehv/datahub-icons'
import styled from 'styled-components'
import { TEXT_RADIO_DEFAULT_VALUE } from '../TimelineDrawer'

import type { DataCloseDrawerAction } from 'plugins/asset/actions'

const Input = styled(InputComponent)`
  margin: 0 10px;
  width: 60px;
  -webkit-box-sizing: border-box;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`
const Text = styled(TextComponent)`
  line-height: 40px;
  white-space: nowrap;
`
const Button = styled(ButtonComponent)`
  position: absolute;
  right: 10px;
`

const HeaderComponentWrapper = styled(Flex)`
  height: 80px;
`
const ControllerWrapper = styled(Flex)`
  padding: 10px 20px;
  height: 100%;
  align-items: center;
`
const TextRadioWrapper = styled(Flex)`
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 30px;
  right: 70px;
`
const CloseButton = styled(Button)`
  position: absolute;
  top: 30px;
  right: 0;
`
const IconWrapper = styled(Flex)`
  height: 16px;
  width: 16px;
  margin: 0 10px;
  color: grey;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
`

type TextRadioProps = {
  displayInterval: number,
  onTextRadioChange: number => void,
  t: TFunction
}
const TextRadio = (props: TextRadioProps) => {
  const { displayInterval, onTextRadioChange, t } = props
  const [value, setValue] = useState(displayInterval)
  const onChangeDisplayIntervalValue = displayInterval => {
    onTextRadioChange(displayInterval)
    setValue(displayInterval)
  }
  return (
    <CustomRadioGroup value={value} onChange={onChangeDisplayIntervalValue}>
      <CustomRadioGroup.Item
        label={t('drawer.textRadioLabel.day1')}
        value={86400000}
      />
      <CustomRadioGroup.Item
        label={t('drawer.textRadioLabel.day3')}
        value={86400000 * 3}
      />
      <CustomRadioGroup.Item
        label={t('drawer.textRadioLabel.week1')}
        value={86400000 * 7}
      />
      <CustomRadioGroup.Item
        label={t('drawer.textRadioLabel.week2')}
        value={TEXT_RADIO_DEFAULT_VALUE}
      />
      <CustomRadioGroup.Item
        label={t('drawer.textRadioLabel.month1')}
        value={86400000 * 30}
      />
      <CustomRadioGroup.Item
        label={t('drawer.textRadioLabel.month6')}
        value={86400000 * 183}
      />
      <CustomRadioGroup.Item
        label={t('drawer.textRadioLabel.year1')}
        value={86400000 * 365}
      />
    </CustomRadioGroup>
  )
}

type HeaderProps = {
  closeDrawer: () => DataCloseDrawerAction,
  defaultDisplayInterval: number,
  defaultSpeedPerSecond: number,
  onPlay: () => void,
  onStop: () => void,
  outputSpeed: number => void,
  onTextRadioChange: number => void,
  t: TFunction
}
const HeaderComponent = (props: HeaderProps) => {
  const {
    closeDrawer,
    defaultDisplayInterval,
    defaultSpeedPerSecond,
    onPlay,
    onStop,
    outputSpeed,
    onTextRadioChange,
    t
  } = props

  const [isRolling, setIsRolling] = useState(false)

  const onPlayHandler = () => {
    setIsRolling(true)
    onPlay()
  }
  const onStopHandler = () => {
    setIsRolling(false)
    onStop()
  }

  return (
    <HeaderComponentWrapper>
      <ControllerWrapper>
        <IconWrapper>
          {isRolling ? (
            <IconStopSolid onClick={onStopHandler} />
          ) : (
            <IconPlaySolid onClick={onPlayHandler} />
          )}
        </IconWrapper>
        <Input
          type='number'
          defaultValue={defaultSpeedPerSecond}
          onBlur={(event: { target: HTMLInputElement }) =>
            typeof outputSpeed === 'function' &&
            outputSpeed(parseInt(event.target.value))
          }
        />
        <Text fontSize={14}>{t('drawer.unit')}</Text>
      </ControllerWrapper>
      <TextRadioWrapper>
        <Text fontSize={14}>{t('drawer.displayInterval')}</Text>
        <TextRadio
          displayInterval={defaultDisplayInterval}
          onTextRadioChange={onTextRadioChange}
          t={t}
        />
      </TextRadioWrapper>
      <CloseButton variant='outline' mx={2} onClick={closeDrawer}>
        &#x2716;
      </CloseButton>
    </HeaderComponentWrapper>
  )
}

export const Header = memo<HeaderProps>(HeaderComponent)
