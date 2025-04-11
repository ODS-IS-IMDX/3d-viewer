// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import { Text } from '@ehv/design-system'

export type DropdownPlaceholderProps = {
  children: React.Node
}

const DropdownPlaceholder = ({ children }: DropdownPlaceholderProps) => (
  <Text size={14}>{children}</Text>
)

export default DropdownPlaceholder
