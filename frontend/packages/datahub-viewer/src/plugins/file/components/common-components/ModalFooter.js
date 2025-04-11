// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { Box, Button, Flex, Modal } from '@ehv/datahub-components'

import type { FileAction } from 'plugins/file/actions'

type ButtonProps = {|
  disabled?: boolean,
  label: string,
  variant?: string,
  width?: string,
  onClick: () => void | FileAction
|}

type ModalFooterProps = {|
  leftButton?: ButtonProps,
  rightButton?: ButtonProps
|}

const ModalFooterComponent = ({
  leftButton,
  rightButton
}: ModalFooterProps) => (
  <Modal.Footer variant='default'>
    <Flex>
      {leftButton && (
        <Button
          type='button'
          width={leftButton.width || '200px'}
          fontSize={1}
          variant={leftButton.variant || 'outline'}
          disabled={leftButton.disabled || false}
          onClick={leftButton.onClick || null}
        >
          {leftButton.label}
        </Button>
      )}
      <Box flex={1} />
      {rightButton && (
        <Button
          type='button'
          width={rightButton.width || '200px'}
          fontSize={1}
          variant={rightButton.variant || 'primary'}
          disabled={rightButton.disabled || false}
          onClick={rightButton.onClick || null}
        >
          {rightButton.label}
        </Button>
      )}
    </Flex>
  </Modal.Footer>
)

export const ModalFooter = React.memo<ModalFooterProps>(ModalFooterComponent)
