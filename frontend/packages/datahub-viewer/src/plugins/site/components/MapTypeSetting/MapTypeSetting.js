// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { Formik, Form } from 'formik'
import { Radio, RadioGroup, Flex, Text } from '@ehv/datahub-components'
import MapSettingsMenuItem from '../MapSettingsMenuItem/MapSettingsMenuItem'

export type MapTypeSettingProps = {
  className: string,
  t: string => string
}

const RadioGroupWrapper = styled(Flex)`
  width: 100%;
  font-size: 12px;
`

const RadioLabelWrapper = styled.label`
  width: calc(100% / 3);
  display: flex;
  align-items: center;
`

const RadioWrapper = styled(Radio)`
  margin-right: 8px;
`

const MapTypeSetting = ({ label, onChange, t, value, site, ...props }) => {
  return (
    <Formik
      initialValues={{
        mapType: value
      }}
      enableReinitialize
    >
      {props => {
        const { handleChange, values } = props
        return (
          <Form>
            <MapSettingsMenuItem>
              <Text fontWeight={600}>{t('site:mapMore.baseMap')}</Text>
            </MapSettingsMenuItem>
            <MapSettingsMenuItem>
              <RadioGroupWrapper>
                <RadioGroup
                  value={values.mapType}
                  onChange={event => {
                    handleChange(event)
                    onChange(event.target.value)
                  }}
                >
                  <RadioLabelWrapper>
                    <RadioWrapper
                      name='mapType'
                      value='openStreetMap'
                      checked
                    />
                    電子地図
                  </RadioLabelWrapper>
                </RadioGroup>
              </RadioGroupWrapper>
            </MapSettingsMenuItem>
          </Form>
        )
      }}
    </Formik>
  )
}

export default MapTypeSetting
