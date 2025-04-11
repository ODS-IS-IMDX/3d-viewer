// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import * as Yup from 'yup'
import { Formik, Field, Form } from 'formik'
import { Flex, Modal, Button, FormInput } from '@ehv/datahub-components'

export type SetValueModalProps = {
  t: string => string,
  type: string,
  value: string | number,
  step?: string | number,
  title: string,
  onClose: () => void,
  onChange: (string | number) => void,
  validationSchema: {}
}

export const SetValueModal = ({
  t,
  onClose,
  value,
  prefix,
  suffix,
  type,
  step = 'any',
  onChange,
  title,
  validationSchema
}: SetValueModalProps) => (
  <Modal onClose={onClose}>
    <Formik
      validateOnChange
      isInitialValid
      initialValues={{
        value
      }}
      onSubmit={({ value }) => {
        onChange(value)
        onClose()
      }}
      validationSchema={Yup.object().shape({
        value: validationSchema
      })}
    >
      {({ errors, touched, isValid, isSubmitting }) => (
        <Form>
          <Flex alignItems='flex-end'>
            <Field
              name='value'
              render={({ field }) => (
                <FormInput
                  {...field}
                  flex={1}
                  type={type}
                  step={step}
                  prefix={prefix}
                  suffix={suffix}
                  label={title}
                  touched={touched.value}
                  error={errors.value ? errors.value : null}
                  autoFocus
                />
              )}
            />
            <Button ml={3} type='submit' disabled={!isValid || isSubmitting}>
              {t('buttons.done')}
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  </Modal>
)

export default SetValueModal
