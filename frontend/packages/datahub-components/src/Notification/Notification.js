// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { IconCaution } from '@ehv/datahub-icons'
import { Flex, Text, themed } from '@ehv/design-system'
import { NotificationButton } from './NotificationButton'
import { NotificationMessage } from './NotificationMessage'
import {
  infoNotificationTheme,
  errorNotificationTheme,
  successNotificationTheme,
  updateNotificationTheme
} from './theme'

export type NotificationProps = {
  className: string,
  onClose: (SyntheticEvent<>) => void,
  message: string,
  dismissLabel: string
}

const Notification = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 380px;
  min-height: 48px;
`

const BlackIconCaution = styled(IconCaution)`
  path:last-child {
    fill: #000;
  }
`

const ChildMessage = styled(Text).attrs({
  size: 1
})`
  color: inherit;
  overflow: hidden;
`

export const ErrorNotificationWrapper = styled(Notification)`
  ${// $FlowFixMe
  themed('ErrorNotification', errorNotificationTheme)}
`

export const InfoNotificationWrapper = styled(Notification)`
  ${// $FlowFixMe
  themed('InfoNotification', infoNotificationTheme)}
`

export const SuccessNotificationWrapper = styled(Notification)`
  ${// $FlowFixMe
  themed('SuccessNotification', successNotificationTheme)}
`

export const UpdateNotificationWrapper = styled(Notification)`
  ${// $FlowFixMe
  themed('UpdateNotification', updateNotificationTheme)}
`

export const ErrorNotification = ({
  className,
  onClose,
  message,
  dismissLabel
}: NotificationProps): React.Node => {
  return (
    <ErrorNotificationWrapper>
      <IconCaution
        width={20}
        height={20}
        style={{ margin: '0 6px 0 12px', minWidth: '40px' }}
      />
      <NotificationMessage className={className} message={message} />
      <NotificationButton
        className={className}
        onClick={onClose}
        text={dismissLabel}
      />
    </ErrorNotificationWrapper>
  )
}

export const InfoNotification = ({
  className,
  onClose,
  message,
  dismissLabel
}: NotificationProps): React.Node => {
  return (
    <InfoNotificationWrapper>
      <BlackIconCaution
        width={20}
        height={20}
        style={{ margin: '0 6px 0 12px', minWidth: '40px' }}
      />
      <NotificationMessage className={className} message={message} />
      <NotificationButton
        className={className}
        onClick={onClose}
        text={dismissLabel}
      />
    </InfoNotificationWrapper>
  )
}

export const SuccessNotification = ({
  className,
  onClose,
  message,
  dismissLabel
}: NotificationProps): React.Node => {
  return (
    <SuccessNotificationWrapper>
      <IconCaution
        width={20}
        height={20}
        style={{ margin: '0 6px 0 12px', minWidth: '40px' }}
      />
      <NotificationMessage className={className} message={message} />
      <NotificationButton
        className={className}
        onClick={onClose}
        text={dismissLabel}
      />
    </SuccessNotificationWrapper>
  )
}

export const UpdateNotification = ({
  className,
  onClose,
  title,
  message,
  dismissLabel
}: NotificationProps): React.Node => {
  return (
    <UpdateNotificationWrapper>
      <IconCaution
        width={20}
        height={20}
        style={{ margin: '0 6px 0 12px', minWidth: '40px' }}
      />
      <NotificationMessage
        className={className}
        message={
          <Flex
            flexDirection='column'
            alignItems='start'
            style={{ whiteSpace: 'normal' }}
          >
            <ChildMessage style={{ marginBottom: 4 }}>{title}</ChildMessage>
            <ChildMessage>{message}</ChildMessage>
          </Flex>
        }
      />
      <NotificationButton
        className={className}
        onClick={onClose}
        text={dismissLabel}
      />
    </UpdateNotificationWrapper>
  )
}
