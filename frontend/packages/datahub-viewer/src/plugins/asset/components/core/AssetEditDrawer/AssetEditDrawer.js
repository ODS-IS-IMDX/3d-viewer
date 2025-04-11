// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'

import { knockout } from 'cesium'
import { Box, Flex } from '@ehv/datahub-components'
import {
  IconFile3DModel,
  IconFileDesignFile,
  IconFileImagery,
  IconFileOverlay,
  IconFileTopography
} from '@ehv/datahub-icons'
import { convertCartesian3ToCoordinates } from 'utils/cesium'
import { roundDecimal } from 'utils/math'
import { COORDINATE_DIGIT_AFTER_DECIMAL_POINT } from 'plugins/asset/constants'
import { SUB_FILE_TYPE } from 'plugins/data/constants'
import { SiteDrawerFill } from 'plugins/site'
import { DrawerHeader, NameInput, TimePeriodSelect } from './FormComponents'

import type { AssetMetaData, AssetEditingData } from 'plugins/asset/reducer'

export type AssetEditDrawerProps = {
  asset: AssetMetaData,
  transformEditor: any,
  editingData: AssetEditingData,
  isDrawerOpen: boolean,
  isDrawerButtonEnabled: boolean,
  updateEditingData: (editingData: AssetEditingData) => void,
  editAsset: (param: AssetEditingData) => void,
  cancelEditAsset: () => void,
  disableDrawerButton: () => void,
  enableDrawerButton: () => void,
  t: TFunction
}

const ItemContainer = styled(Flex).attrs(props => ({
  flexDirection: props.flexDirection || 'column',
  mb: 3
}))``

const Icon = props => {
  const { subFileType, color } = props
  const iconStyle = {
    width: '30px',
    margin: 'auto 0px',
    color
  }
  switch (subFileType) {
    case SUB_FILE_TYPE.ASSET.TOPOGRAPHY:
      return <IconFileTopography style={iconStyle} />
    case SUB_FILE_TYPE.ASSET.IMAGERY:
      return <IconFileImagery style={iconStyle} />
    case SUB_FILE_TYPE.ASSET.MODEL3D:
      return <IconFile3DModel style={iconStyle} />
    case SUB_FILE_TYPE.ASSET.DESIGNFILE:
      return <IconFileDesignFile style={iconStyle} />
    case SUB_FILE_TYPE.ASSET.OVERLAY:
      return <IconFileOverlay style={iconStyle} />
    default:
      return null
  }
}

export const FIELD_NAME_INPUT = 'displayName'
export const FIELD_START_DATE_TIME_SELECT = 'startDateTime'
export const FIELD_END_DATE_TIME_SELECT = 'endDateTime'

export const AssetEditDrawer = (props: AssetEditDrawerProps) => {
  const {
    asset,
    transformEditor,
    editingData,
    isDrawerOpen,
    isDrawerButtonEnabled,
    updateEditingData,
    editAsset,
    cancelEditAsset,
    disableDrawerButton,
    enableDrawerButton,
    t
  } = props

  const { assetId, subFileType, name } = asset
  const { displayName, startDateTime, endDateTime } = editingData

  const divRef = React.useRef<HTMLDivElement>(null)

  const initialValues = {
    [FIELD_NAME_INPUT]: displayName,
    [FIELD_START_DATE_TIME_SELECT]: startDateTime || null,
    [FIELD_END_DATE_TIME_SELECT]: endDateTime || null
  }

  const validationSchema = Yup.object().shape({
    coordinates: Yup.array()
      .of(
        Yup.array()
          .of(
            Yup.number().required(t('drawer.panel.coordinate.errors.required'))
          )
          .length(3, t('drawer.panel.coordinate.errors.required'))
      )
      .length(1, t('drawer.panel.coordinate.errors.required'))
  })

  const validate = values => {
    const errors = {}

    if (
      values[FIELD_START_DATE_TIME_SELECT] &&
      values[FIELD_END_DATE_TIME_SELECT]
    ) {
      const startDateTime = values[FIELD_START_DATE_TIME_SELECT]
      const endDateTime = values[FIELD_END_DATE_TIME_SELECT]
      if (startDateTime >= endDateTime) {
        errors.datetime = t('drawer.panel.datetime.errors.default')
      }
    } else if (
      !!values[FIELD_START_DATE_TIME_SELECT] ^
      !!values[FIELD_END_DATE_TIME_SELECT]
    ) {
      errors.datetime = t('drawer.panel.datetime.errors.required')
    }

    // 表示名長さが255文字超えまた表示名が半角スペースと全角スペースのみの場合、該当表示名が無効
    if (values[FIELD_NAME_INPUT].length > 255) {
      errors[FIELD_NAME_INPUT] = t('drawer.panel.name.errors.maxlength')
    }
    if (
      values[FIELD_NAME_INPUT].replace(/\u0020/g, '').replace(/\u3000/g, '')
        .length === 0
    ) {
      errors[FIELD_NAME_INPUT] = t('drawer.panel.name.errors.required')
    }

    return errors
  }

  const setAllInputFocusOff = () => {
    if (!divRef.current || !divRef.current.firstChild) {
      return
    }

    const formElement: HTMLCollection<HTMLElement> = divRef.current.firstChild
    for (let index = 0; index < formElement.length; ++index) {
      if (
        formElement[index].tagName === 'INPUT' ||
        formElement[index].tagName === 'TEXTAREA'
      ) {
        formElement[index].blur()
      }
    }
  }

  const handleCancelClick = React.useCallback(() => {
    cancelEditAsset()
  }, [cancelEditAsset])

  const saveAsset = values => {
    const displayName = values[FIELD_NAME_INPUT]
    const startDateTime = values[FIELD_START_DATE_TIME_SELECT]
    const endDateTime = values[FIELD_END_DATE_TIME_SELECT]
    editAsset({ assetId, displayName, startDateTime, endDateTime })
    cancelEditAsset()
    enableDrawerButton()
  }

  React.useEffect(() => {
    if (transformEditor) {
      knockout.track(transformEditor.viewModel)
      const subscription = knockout
        .getObservable(transformEditor.viewModel, 'position')
        .subscribe(newValue => {
          const position = convertCartesian3ToCoordinates(newValue).map(
            coordinate => {
              return roundDecimal(
                coordinate,
                COORDINATE_DIGIT_AFTER_DECIMAL_POINT
              )
            }
          )
          updateEditingData({
            coordinates: [position]
          })
        })
      return () => {
        subscription.dispose()
      }
    }
  }, [transformEditor, updateEditingData])

  return isDrawerOpen ? (
    <SiteDrawerFill>
      <Flex ref={divRef} flexDirection='column' p={3}>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          validate={validate}
          onSubmit={values => {
            disableDrawerButton()
            saveAsset(values)
          }}
        >
          {(formik: FormikProps<FormValues>) => (
            <Form>
              <DrawerHeader
                isButtonEnabled={isDrawerButtonEnabled}
                headerText={name}
                icon={<Icon subFileType={subFileType} color={'#3a4248'} />}
                onCancelClick={handleCancelClick}
                setAllInputFocusOff={setAllInputFocusOff}
                t={t}
              />
              <Box my={2} />
              <ItemContainer flexDirection='row'>
                <NameInput
                  formName={FIELD_NAME_INPUT}
                  value={formik.values[FIELD_NAME_INPUT]}
                  errorMessage={formik.errors[FIELD_NAME_INPUT]}
                  onBlur={updateEditingData}
                  t={t}
                />
              </ItemContainer>
              <ItemContainer>
                <TimePeriodSelect
                  errorMessage={formik.errors.datetime}
                  labelText={t('drawer.panel.datetime.label')}
                  startDateTime={formik.values[FIELD_START_DATE_TIME_SELECT]}
                  endDateTime={formik.values[FIELD_END_DATE_TIME_SELECT]}
                  updateEditingData={updateEditingData}
                />
              </ItemContainer>
            </Form>
          )}
        </Formik>
      </Flex>
    </SiteDrawerFill>
  ) : null
}

export default AssetEditDrawer
