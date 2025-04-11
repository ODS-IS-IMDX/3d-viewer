// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { memo, useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { knockout, HeadingPitchRoll } from 'cesium'
import { cloneDeep } from 'lodash'
import Slider, { createSliderWithTooltip } from 'rc-slider'
import { Button, Flex, Text } from '@ehv/datahub-components'
import DateTimePicker from 'components/DateTimePicker'
import { roundDecimal } from 'utils/math'
import { COORDINATE_DIGIT_AFTER_DECIMAL_POINT } from 'plugins/asset/constants'
import {
  ErrorMessage,
  HeaderText,
  Input,
  Label,
  RequiredMark,
  XSpacer
} from './StyledComponents'
import { FIELD_NAME_INPUT } from './AssetEditDrawer'

import type { NamedExoticComponent } from 'react'
import type { TFunction } from 'react-i18next'
import type { Rotate } from 'plugins/asset/reducer'

type DrawerHeaderProps = {|
  isButtonEnabled: boolean,
  headerText: string,
  Icon: React.StatelessFunctionalComponent<{}>,
  onCancelClick: () => void,
  setAllInputFocusOff: () => void,
  t: TFunction
|}

export const DrawerHeader = React.memo<DrawerHeaderProps>(
  (props: DrawerHeaderProps) => {
    const {
      isButtonEnabled,
      headerText,
      icon,
      onCancelClick,
      setAllInputFocusOff,
      t
    } = props

    return (
      <Flex alignItems='center'>
        <Flex mr={2}>{icon}</Flex>
        <HeaderText>{headerText}</HeaderText>
        <Button
          type='reset'
          variant='outline'
          mx={2}
          width='150px'
          onMouseEnter={setAllInputFocusOff}
          onClick={onCancelClick}
        >
          {t('drawer.header.cancel')}
        </Button>
        <Button
          type='submit'
          variant='primary'
          width='150px'
          disabled={!isButtonEnabled}
          onMouseEnter={setAllInputFocusOff}
        >
          {t('drawer.header.save')}
        </Button>
      </Flex>
    )
  }
)

type NameInputProps = {|
  formName: string,
  value: string,
  errorMessage: ?string,
  onBlur: (annotation: AnnotationToBeEdited) => void,
  t: TFunction
|}
export const NameInput = React.memo<NameInputProps>((props: NameInputProps) => {
  const { formName, value, errorMessage, onBlur, t } = props
  const [name, setName] = React.useState(value)

  return (
    <Flex flexDirection='column' flex='1 1 auto'>
      <Flex flexDirection='row'>
        <Label>{t('drawer.panel.name.label')}</Label>
        <RequiredMark>*</RequiredMark>
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </Flex>
      <Input
        editable
        name={formName}
        value={name}
        placeholder={t('drawer.panel.name.placeholder')}
        // $FlowFixMe
        onChange={(event: React.SyntheticEvent<HTMLInputElement>) => {
          setName(event.target.value)
        }}
        // $FlowFixMe
        onBlur={(event: React.SyntheticEvent<HTMLInputElement>) => {
          onBlur({ [FIELD_NAME_INPUT]: name })
        }}
      />
    </Flex>
  )
})

type CoordinatesInputProps = {|
  formName: string,
  coordinates: Coordinates,
  errorMessageOrArray: ?string | ?Array<Array<string>>,
  isButtonEnabled: boolean,
  onResetClick: () => void,
  updateCoordinates: (coordinates: Coordinates) => void,
  onBlur: (annotation: AnnotationToBeEdited) => void,
  t: TFunction
|}
export const CoordinatesInput = React.memo<CoordinatesInputProps>(
  (props: CoordinatesInputProps) => {
    const {
      formName,
      coordinates,
      errorMessageOrArray,
      isButtonEnabled,
      onResetClick,
      updateCoordinates,
      onBlur,
      t
    } = props

    const errorMessage = Array.isArray(errorMessageOrArray)
      ? errorMessageOrArray.flat().find(value => value)
      : errorMessageOrArray

    return (
      <>
        <Flex flexDirection='row'>
          <Label>{t('drawer.panel.coordinate.label')}</Label>
          <RequiredMark>*</RequiredMark>
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </Flex>
        <Flex flexDirection='column'>
          <Flex flexDirection='row' mb={1} px={2}>
            <Label flex={1}>{t('drawer.panel.coordinate.longitude')}</Label>
            <Label flex={1}>{t('drawer.panel.coordinate.latitude')}</Label>
            <Label flex={1}>{t('drawer.panel.coordinate.height')}</Label>
            <div style={{ width: 150 }} />
          </Flex>

          {/* 新規描画中は座標値の入力欄を非表示 */}
          {coordinates.map((coordinate: Coordinate, indexParent: number) => (
            <Flex key={indexParent} flexDirection='row' mb={1} px={2}>
              {coordinate.map(
                (value: ?number | ?string, indexChild: number) => (
                  <React.Fragment key={indexChild}>
                    <Input
                      name={`${formName}[${indexParent}][${indexChild}]`}
                      type='number'
                      step={String(
                        1 / Math.pow(10, COORDINATE_DIGIT_AFTER_DECIMAL_POINT)
                      )}
                      value={value || ''}
                      placeholder={t('drawer.panel.coordinate.placeholder')}
                      // $FlowFixMe
                      onChange={(
                        event: React.SyntheticEvent<HTMLInputElement>
                      ) => {
                        const value = event.target.value
                        const newCoordinates = cloneDeep(coordinates)
                        // $FlowFixMe
                        newCoordinates[indexParent][indexChild] = !value
                          ? undefined
                          : roundDecimal(
                              Number(value),
                              COORDINATE_DIGIT_AFTER_DECIMAL_POINT
                            )
                        updateCoordinates(newCoordinates)
                      }}
                      // $FlowFixMe
                      onBlur={(
                        event: React.SyntheticEvent<HTMLInputElement>
                      ) => {
                        const newCoordinates = cloneDeep(coordinates)
                        onBlur({ coordinates: newCoordinates })
                      }}
                    />
                    <XSpacer />
                  </React.Fragment>
                )
              )}
              <Button
                type='reset'
                variant='outline'
                width='150px'
                disabled={!isButtonEnabled}
                onClick={onResetClick}
              >
                {t('drawer.panel.coordinate.reset')}
              </Button>
            </Flex>
          ))}
        </Flex>
      </>
    )
  }
)

type TimePeriodSelectProps = {|
  startDateTime: string | null,
  endDateTime: string | null,
  errorMessage: string,
  labelText: string,
  updateEditingData: (param: {
    startDateTime?: Date | null,
    endDateTime?: Date | null
  }) => void
|}
export const TimePeriodSelect: React.FC<TimePeriodSelectProps> = React.memo<TimePeriodSelectProps>(
  (props: TimePeriodSelectProps) => {
    const {
      startDateTime,
      endDateTime,
      errorMessage,
      labelText,
      updateEditingData
    } = props

    return (
      <>
        <Flex flexDirection='row'>
          <Label>{labelText}</Label>
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </Flex>
        <Flex mx={1} width={480}>
          <DateTimePicker
            value={startDateTime ? new Date(startDateTime) : undefined}
            onChange={(value: Date | null) =>
              updateEditingData({ startDateTime: value })
            }
            clearDataTimeButton={onButtonChange => (
              <Button
                type='button'
                color='primary'
                fontSize={1}
                width='50px'
                style={{ height: '43px' }}
                onClick={() => {
                  onButtonChange({ target: { value: '' } })
                  updateEditingData({ startDateTime: null })
                }}
              >
                &#x2716;
              </Button>
            )}
          />
          <Text
            size={4}
            p={2}
            alignItems='center'
            fontWeight='bold'
            color='#3a4248'
          >
            &#65374;
          </Text>
          <DateTimePicker
            value={endDateTime ? new Date(endDateTime) : undefined}
            onChange={(value: Date | null) =>
              updateEditingData({ endDateTime: value })
            }
            clearDataTimeButton={onButtonChange => (
              <Button
                type='button'
                color='primary'
                fontSize={1}
                width='50px'
                style={{ height: '43px' }}
                onClick={() => {
                  onButtonChange({ target: { value: '' } })
                  updateEditingData({ endDateTime: null })
                }}
              >
                &#x2716;
              </Button>
            )}
          />
        </Flex>
      </>
    )
  }
)

const DegreeInput = styled(Input)`
  width: 80px;
  margin-left: 10px;
`
// 3軸回転設定用スライダー
type RotateInputProps = {|
  formName: string,
  transformEditor: any,
  t: TFunction
|}
export const RotateInput: NamedExoticComponent<RotateInputProps> = memo<RotateInputProps>(
  (props: RotateInputProps) => {
    const { formName, transformEditor, t } = props
    const [rotate, setRotate] = useState({ heading: 0, pitch: 0, roll: 0 })

    const Range = createSliderWithTooltip(Slider)

    useEffect(() => {
      if (!transformEditor) {
        return
      }
      const headingPitchRollSubscription = knockout
        .getObservable(transformEditor.viewModel, 'headingPitchRoll')
        .subscribe((value: Rotate) => {
          const {
            heading: headingRadian,
            pitch: pitchRadian,
            roll: rollRadian
          } = value
          setRotate({
            heading: Math.round((headingRadian / Math.PI) * 180),
            pitch: Math.round((pitchRadian / Math.PI) * 180),
            roll: Math.round((rollRadian / Math.PI) * 180)
          })
        })
      const {
        heading: headingRadian,
        pitch: pitchRadian,
        roll: rollRadian
      } = transformEditor.viewModel.headingPitchRoll
      setRotate({
        heading: Math.round((headingRadian / Math.PI) * 180),
        pitch: Math.round((pitchRadian / Math.PI) * 180),
        roll: Math.round((rollRadian / Math.PI) * 180)
      })

      return () => {
        headingPitchRollSubscription.dispose()
      }
    }, [transformEditor])

    const rotateModel = useCallback(
      (newRotate: Rotate) => {
        const { heading, pitch, roll } = newRotate
        transformEditor.viewModel.headingPitchRoll = HeadingPitchRoll.fromDegrees(
          heading,
          pitch,
          roll
        )
      },
      [transformEditor]
    )

    return (
      <>
        <Label>{t('drawer.panel.rotate.label')}</Label>
        <Flex flexDirection='row'>
          {Object.keys(rotate).map((key: string) => (
            <Flex key={key} px={2} flex={1} flexDirection='column'>
              <Label>{t(`drawer.panel.rotate.${key}`)}</Label>
              <Flex flex={1} flexDirection='row'>
                <Range
                  min={-180}
                  max={180}
                  step={1}
                  style={{
                    alignContent: 'center',
                    height: '40px'
                  }}
                  defaultValue={rotate[key]}
                  included={false}
                  onAfterChange={(degree: number) => {
                    rotateModel({ ...rotate, [key]: degree })
                  }}
                />
                <DegreeInput
                  name={formName}
                  editable
                  type='number'
                  step='1'
                  value={rotate[key]}
                  onChange={(event: React.SyntheticEvent<HTMLInputElement>) => {
                    const degree = Number(event.target.value)
                    if (degree > 180 || degree < -180) {
                      return
                    }
                    rotateModel({
                      ...rotate,
                      [key]: Number(event.target.value)
                    })
                  }}
                />
              </Flex>
            </Flex>
          ))}
          <div style={{ width: 150 }} />
        </Flex>
      </>
    )
  }
)
