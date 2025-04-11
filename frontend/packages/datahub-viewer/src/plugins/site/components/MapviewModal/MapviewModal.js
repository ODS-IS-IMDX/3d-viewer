// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { Formik, Form } from 'formik'
import { Radio, RadioGroup, Flex, Text } from '@ehv/datahub-components'
import MapSettingsMenuItem from '../MapSettingsMenuItem/MapSettingsMenuItem'

const TitleWrapper = styled(Text)`
  font-weight: 600;
`

const RadioGroupWrapper = styled(Flex)`
  width: 100%;
  font-size: 12px;
  display: flex;
  flex-wrap: wrap;
`

const RadioLabelWrapper = styled.label`
  width: calc(100% / 3);
  display: flex;
  align-items: center;
  margin-bottom: 7px;
`

const RadioSpacer = styled(Flex)`
  width: 100%;
`

const RadioWrapper = styled(Radio)`
  margin-right: 8px;
`

const mapviewModal = ({ label, onChange, t, value, userProfile, ...props }) => {
  return (
    <Formik
      initialValues={{
        mapview: value
      }}
    >
      {props => {
        const { handleChange, values } = props
        return (
          <Form>
            <MapSettingsMenuItem>
              <TitleWrapper>{t('mapview.label')}</TitleWrapper>
            </MapSettingsMenuItem>
            <MapSettingsMenuItem>
              <RadioGroupWrapper>
                <RadioGroup
                  value={values.mapview}
                  onChange={event => {
                    handleChange(event)
                    onChange(event.target.value)
                  }}
                >
                  <RadioLabelWrapper>
                    <RadioWrapper name='mapview' value='d3' />
                    {t('mapview.d3')}
                  </RadioLabelWrapper>
                  <RadioLabelWrapper>
                    <RadioWrapper name='mapview' value='notD3' />
                    {t('mapview.notD3')}
                  </RadioLabelWrapper>
                  <RadioSpacer />
                </RadioGroup>
              </RadioGroupWrapper>
            </MapSettingsMenuItem>
          </Form>
        )
      }}
    </Formik>
  )
}

export default mapviewModal
