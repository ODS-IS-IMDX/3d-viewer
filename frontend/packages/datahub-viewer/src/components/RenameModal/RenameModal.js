// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import * as Yup from 'yup'
import { Formik, Field, Form } from 'formik'
import { Flex, Modal, Button, FormInput } from '@ehv/datahub-components'

export type RenameModalProps = {
  name: string,
  title: string,
  onClose: () => void,
  onSubmit: () => void
}

const RenameModal = ({
  t,
  onClose,
  onSubmit,
  title,
  name
}: RenameModalProps) => (
  <Modal onClose={onClose}>
    <Formik
      initialValues={{
        name
      }}
      onSubmit={({ name }) => {
        onSubmit(name)
        onClose()
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required('Required')
      })}
    >
      {({ errors, touched, isValid, isSubmitting }) => (
        <Form>
          <Flex alignItems='flex-end'>
            <Field
              name='name'
              render={({ field }) => (
                <FormInput
                  {...field}
                  flex={1}
                  touched={touched.name}
                  label={title}
                  error={errors.name ? errors.name : null}
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

export default RenameModal
