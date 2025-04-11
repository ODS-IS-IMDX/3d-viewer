// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { NamespacesConsumer } from 'react-i18next'
import { toast } from 'react-toastify'
import {
  SuccessNotification,
  ErrorNotification,
  InfoNotification,
  UpdateNotification
} from '@ehv/datahub-components'
import { IconClose } from '@ehv/datahub-icons'

import i18n from 'i18n'
import styled from 'styled-components'

const CloseIcon = styled(IconClose)`
  path:last-child {
    fill: #fff;
  }
`

export const NOTIFY = 'NOTIFY'
export const NOTIFY_INIT = 'NOTIFY_INIT'

export type NotifyActionPayload = {
  content: string | Function,
  options?: Object
}

export type NotifyAction = {
  type: string,
  payload: NotifyActionPayload
}
export type NotifyInitAction = {
  type: 'NOTIFY_INIT'
}

export const notifyInit = () => {
  return {
    type: NOTIFY_INIT
  }
}

export const notify = (content: any, options: Object): NotifyAction => ({
  type: NOTIFY,
  payload: {
    content,
    options
  }
})

export const notifyError = (message: string, options: Object): NotifyAction => {
  const errorMessage =
    message && message.trim()
      ? message
      : i18n.t('notifications:common.unexpectedError')
  const content = ({ className, closeToast }) => (
    <NamespacesConsumer ns={['notifications']}>
      {t => (
        <ErrorNotification
          onClose={() => {
            toast.dismiss()
          }}
          className={className}
          message={errorMessage}
          dismissLabel={<CloseIcon width={25} height={25} />}
        />
      )}
    </NamespacesConsumer>
  )

  return {
    type: NOTIFY,
    payload: {
      content,
      options: { autoClose: false, ...options }
    }
  }
}

export const notifyInfo = (message: string, options: Object): NotifyAction => {
  const content = ({ className, closeToast }) => {
    setTimeout(() => {
      closeToast()
    }, 5000)
    return (
      <>
        <NamespacesConsumer ns={['notifications']}>
          {t => (
            <InfoNotification
              onClose={() => {
                toast.dismiss()
              }}
              className={className}
              message={message}
              dismissLabel={<IconClose width={25} height={25} />}
            />
          )}
        </NamespacesConsumer>
      </>
    )
  }

  return {
    type: NOTIFY,
    payload: {
      content,
      options
    }
  }
}

export const notifySuccess = (
  message: string,
  options: Object
): NotifyAction => {
  const content = ({ className, closeToast }) => {
    setTimeout(() => {
      closeToast()
    }, 5000)
    return (
      <>
        <NamespacesConsumer ns={['notifications']}>
          {t => (
            <SuccessNotification
              onClose={() => {
                toast.dismiss()
              }}
              className={className}
              message={message}
              dismissLabel={<CloseIcon width={25} height={25} />}
            />
          )}
        </NamespacesConsumer>
      </>
    )
  }
  return {
    type: NOTIFY,
    payload: {
      content,
      options
    }
  }
}

export const notifyUpdate = (
  title: string,
  message: string,
  options: Object
): NotifyAction => {
  const content = ({ className, closeToast }) => (
    <NamespacesConsumer ns={['notifications']}>
      {t => (
        <UpdateNotification
          onClose={() => {
            toast.dismiss()
          }}
          className={className}
          title={title}
          message={message}
          dismissLabel={<CloseIcon width={25} height={25} />}
        />
      )}
    </NamespacesConsumer>
  )
  return {
    type: NOTIFY,
    payload: {
      content,
      options: { autoClose: false, ...options }
    }
  }
}
