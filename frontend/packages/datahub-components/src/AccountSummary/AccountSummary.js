// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { Text, themed } from '@ehv/design-system'

import theme from './theme'

type AccountSummaryProps = {
  className: string,
  email: string,
  name: string,
  linkLabel: string
}

const AccountSummaryWrapper = styled.div`
  height: 78px;
  width: 240px;
`

const AccountLink = styled(Text)`
  margin-top: 8px;
  ${// $FlowFixMe
  themed('AccountLink', theme)}
`

export const AccountSummary = ({
  className,
  email,
  name,
  linkLabel
}: AccountSummaryProps) => {
  return (
    <AccountSummaryWrapper className={className}>
      <Text mt='20px' size={4}>
        {name}
      </Text>
      <Text mt='4px' size={1}>
        {email}
      </Text>
      <AccountLink size={1}>{linkLabel}</AccountLink>
    </AccountSummaryWrapper>
  )
}

export default AccountSummary
