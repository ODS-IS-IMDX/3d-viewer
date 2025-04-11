// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { Formik, Form, type FormikProps } from 'formik'
import { Dropdown, Text, ContextMenu } from '@ehv/datahub-components'
import {
  BASE_TERRAIN_CWT_ID,
  BASE_TERRAIN_GIS_ID
} from 'plugins/file/constants'
import MapSettingsMenuItem from '../MapSettingsMenuItem'

export type BaseTerrainSelectorMenuProps = {
  className: string,
  t: string => string,
  value: string | null,
  baseTerrainList: any,
  onChange: (baseTerrain: number, baseTerrainName: string) => void
}

const TitleWrapper = styled(Text)`
  font-weight: 600;
`
const StyledDropdown = styled(Dropdown)`
  width: 100%;
`
const MapSettingsDivider = styled(ContextMenu.Divider)`
  margin: 12px 16px;
  border-top: solid 1px #c4c4c4;
`

const FIELD_BASE_TERRAIN = 'baseTerrain'
type FormValues = {
  baseTerrain: {
    label: string,
    value: number
  }
}

const BaseTerrainSelectorMenu = ({
  onChange,
  t,
  value,
  baseTerrainList,
  ...props
}) => {
  const _baseTerrainList =
    baseTerrainList && baseTerrainList.length > 0 ? baseTerrainList : []

  const displayOptions = [
    ..._baseTerrainList.map(
      item =>
        item.ionAssetId && {
          label: item.name,
          value: item.ionAssetId
        }
    ),
    {
      label: t('file:fileRegisterModal.optionLabel.baseTerrainDefault'),
      value: BASE_TERRAIN_GIS_ID
    },
    {
      label: t('file:fileRegisterModal.optionLabel.baseTerrainCWT'),
      value: BASE_TERRAIN_CWT_ID
    }
  ]
  const initialValues: FormValues = {
    baseTerrain: value
      ? displayOptions.find(option => option.value === value) ||
        displayOptions[0]
      : displayOptions[0]
  }

  return (
    BASE_TERRAIN_GIS_ID &&
    BASE_TERRAIN_CWT_ID && (
      <>
        <MapSettingsDivider />
        <Formik initialValues={initialValues}>
          {(formik: FormikProps<FormValues>) => (
            <Form>
              <MapSettingsMenuItem>
                <TitleWrapper>{t('site:mapMore.baseTerrain')}</TitleWrapper>
              </MapSettingsMenuItem>
              <MapSettingsMenuItem>
                <StyledDropdown
                  name={FIELD_BASE_TERRAIN}
                  options={displayOptions}
                  value={formik.values[FIELD_BASE_TERRAIN]}
                  onChange={value => {
                    formik.setFieldValue(FIELD_BASE_TERRAIN, value)
                    onChange(value.value, value.label)
                  }}
                />
              </MapSettingsMenuItem>
            </Form>
          )}
        </Formik>
      </>
    )
  )
}

export default BaseTerrainSelectorMenu
