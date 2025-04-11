// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { Formik, Form } from 'formik'
import { Radio, RadioGroup, Flex, Text } from '@ehv/datahub-components'
import type { WithNamespaces } from 'react-i18next'
import MapSettingsMenuItem from '../MapSettingsMenuItem/MapSettingsMenuItem'

export type MapTypeSettingProps = WithNamespaces & {
  className: string
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

const RenderQualityModal = ({ label, onChange, t, value, ...props }) => {
  return (
    <Formik
      initialValues={{
        renderQuality: value
      }}
    >
      {props => {
        const { handleChange, values } = props
        return (
          <Form>
            <MapSettingsMenuItem>
              <Text fontWeight='600'>{t('renderQuality.label')}</Text>
            </MapSettingsMenuItem>
            <MapSettingsMenuItem>
              <RadioGroupWrapper>
                <RadioGroup
                  value={values.renderQuality}
                  onChange={event => {
                    handleChange(event)
                    onChange(event.target.value)
                  }}
                >
                  <RadioLabelWrapper>
                    <RadioWrapper name='renderQuality' value='low' />
                    {t('renderQuality.low')}
                  </RadioLabelWrapper>
                  <RadioLabelWrapper>
                    <RadioWrapper name='renderQuality' value='standard' />
                    {t('renderQuality.standard')}
                  </RadioLabelWrapper>
                  <RadioLabelWrapper>
                    <RadioWrapper name='renderQuality' value='high' />
                    {t('renderQuality.high')}
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

export default RenderQualityModal
