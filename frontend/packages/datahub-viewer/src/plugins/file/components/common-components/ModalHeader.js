// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { Box, Button, Flex, Modal, Text } from '@ehv/datahub-components'

type HeaderButton = {|
  color?: string,
  disabled?: boolean,
  label: string,
  onClick: () => void
|}

type ModalHeaderProps = {|
  headerText: string,
  headerButton?: HeaderButton,
  cautionText?: string | null
|}

const ModalHeaderComponent = ({
  headerText,
  headerButton,
  cautionText
}: ModalHeaderProps) => (
  <Modal.Header variant='default' height={80}>
    <Flex>
      <Text fontSize={12} lineHeight={3} fontWeight={600} color='#606770'>
        {headerText}
      </Text>
      <Box flex={1} />
      {headerButton && (
        <Button
          type='button'
          width='200px'
          fontSize={1}
          color={headerButton.color || 'primary'}
          disabled={headerButton.disabled || false}
          onClick={headerButton.onClick || null}
        >
          {headerButton.label}
        </Button>
      )}
    </Flex>
    {cautionText && (
      <Text
        fontSize={12}
        my={-3}
        color='red'
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {cautionText}
      </Text>
    )}
  </Modal.Header>
)

export const ModalHeader = React.memo<ModalHeaderProps>(ModalHeaderComponent)
