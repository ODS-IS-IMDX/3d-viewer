// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import { Box, Text } from '@ehv/datahub-components'

type ErrorMessageProps = {
  children?: React.Node
}

export const ErrorMessage = ({ children }: ErrorMessageProps) => (
  <Box height='2rem'>
    <Text flex={1} px={2} py={2} fontSize={1} color='warning'>
      {children}
    </Text>
  </Box>
)
