// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import type { WithNamespaces } from 'react-i18next'
import styled from 'styled-components'

import { Flex, Modal, Text, Box, Button } from '@ehv/datahub-components'

type DeleteModalProps = WithNamespaces & {
  message: string,
  cancelButtonLabel?: string,
  deleteButtonLabel?: string,
  onCancelClick: () => void,
  onDeleteClick: () => void,
  zIndex?: number
}

const FlexWrapper = styled(Flex)`
  justify-content: flex-start;
  background-color: #ecf0f3;
  border-radius: 6px;
  label {
    margin-top: 20px;
  }
  max-height: 300px;
  overflow-y: auto;
`

const Message = styled(Text)`
  white-space: pre-wrap;
`

export const DeleteModal = (props: DeleteModalProps) => {
  const {
    message,
    cancelButtonLabel,
    deleteButtonLabel,
    onCancelClick,
    onDeleteClick,
    zIndex,
    t
  } = props

  return (
    <Modal variant='noPadding' closeButton={false} zIndex={zIndex}>
      <FlexWrapper
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        mx={20}
        my={32}
        p={20}
      >
        <Message mx={2} my={2} fontSize={2} textAlign='center'>
          {message}
        </Message>
      </FlexWrapper>

      <Modal.Footer variant='default'>
        <Flex>
          <Button
            width='200px'
            fontSize={1}
            variant='outline'
            mx={2}
            onClick={onCancelClick}
          >
            {cancelButtonLabel || t('buttons.cancel')}
          </Button>
          <Box flex={1} />
          <Button
            width='200px'
            fontSize={1}
            color='warning'
            onClick={onDeleteClick}
          >
            {deleteButtonLabel || t('buttons.delete')}
          </Button>
        </Flex>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteModal
