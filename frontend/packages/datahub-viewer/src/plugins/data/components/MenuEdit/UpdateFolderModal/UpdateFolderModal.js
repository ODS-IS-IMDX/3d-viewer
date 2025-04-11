// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useState } from 'react'
import styled from 'styled-components'
import type { TFunction } from 'react-i18next'
import {
  Flex,
  Modal,
  Text,
  Box,
  Button,
  Input as InputComponent
} from '@ehv/datahub-components'
import type { SelectedItemData } from '../../types'

type UpdateFolderModalProps = {
  onSave: (name: string, isAddFolder: boolean) => void,
  onClose: () => void,
  chkDuplicateName: (name: string) => boolean,
  isAddFolder: boolean,
  selectedNodeData: SelectedItemData,
  selectedItemData: SelectedItemData,
  t: TFunction
}

const FlexWrapper = styled(Flex)`
  background-color: #ecf0f3;
  border-radius: 6px;
  label {
    margin-top: 20px;
  }
`
const Message = styled(Text)`
  white-space: pre-wrap;
`

type InputProps = {
  editable: boolean,
  name: string,
  type?: string,
  step?: string,
  value: number | string,
  placeholder?: string,
  style?: string,
  // $FlowFixMe
  onChange?: (event: React.SyntheticEvent<HTMLInputElement>) => void,
  // $FlowFixMe
  onBlur?: (event: React.SyntheticEvent<HTMLInputElement>) => void,
  // $FlowFixMe
  onInput?: (event: React.SyntheticEvent<HTMLInputElement>) => void
}
const Input = ({
  editable,
  name,
  type,
  step,
  value,
  placeholder,
  style,
  onChange,
  onBlur,
  onInput,
  ...restProps
}: InputProps) => {
  const StyledInput = style
    ? styled(InputComponent)`
        ${style}
      `
    : InputComponent
  const disableFlag = !!(!editable && type === 'color')
  return (
    <Flex flex={1} mb={1} mx={1}>
      <StyledInput
        {...restProps}
        name={name}
        type={type}
        step={step}
        variant={editable ? 'default' : 'readonly'}
        fontSize={1}
        flex={1}
        value={value}
        disabled={disableFlag}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        onInput={onInput}
      />
    </Flex>
  )
}

const UpdateFolderModal = ({
  onSave,
  onClose,
  chkDuplicateName,
  isAddFolder,
  selectedNodeData,
  selectedItemData,
  t
}: UpdateFolderModalProps) => {
  const [folderNameValue, setFolderNameValue] = useState(
    selectedItemData && selectedItemData.name && !isAddFolder
      ? selectedItemData.name
      : ''
  )
  const [errorMessage, setErrorMessage] = useState()
  const onSaveClick = () => {
    const folderNameTrimValue = folderNameValue.trim()
    if (folderNameTrimValue === '') {
      setErrorMessage(t('dataAdmin.errors.emptyFolderName'))
      return
    } else if (
      selectedNodeData &&
      selectedNodeData.item &&
      'children' in selectedNodeData.item &&
      selectedNodeData.item['children'].length > 0 &&
      chkDuplicateName(folderNameTrimValue, selectedNodeData.item['children'])
    ) {
      setErrorMessage(t('dataAdmin.errors.duplicateFolderName'))
      return
    } else {
      setErrorMessage(null)
    }
    onSave(folderNameTrimValue, isAddFolder)
  }

  return (
    <Modal variant='noPadding' onClose={onClose} zIndex={99999} isBackground>
      <FlexWrapper
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        mx={20}
        my={32}
        p={20}
      >
        <Message mx={2} my={2} fontSize={2} textAlign='center'>
          {isAddFolder
            ? t('dataAdmin.modal.addFolder')
            : t('dataAdmin.modal.renameFolder')}
        </Message>
      </FlexWrapper>
      <Box mt={0} mb={4}>
        <Input
          editable
          name={'folderName'}
          placeholder={''}
          // $FlowFixMe
          onChange={(event: React.SyntheticEvent<HTMLInputElement>) => {
            setFolderNameValue(event.target.value)
          }}
          value={folderNameValue}
        />
        {errorMessage && (
          <Text fontSize={2} color='#FF0000'>
            {errorMessage}
          </Text>
        )}
      </Box>

      <Modal.Footer variant='default'>
        <Flex>
          <Button
            width='200px'
            fontSize={1}
            variant='outline'
            onClick={onClose}
          >
            {t('dataAdmin.modal.cancel')}
          </Button>
          <Box flex={1} />
          <Button width='200px' fontSize={1} onClick={onSaveClick}>
            {isAddFolder ? t('dataAdmin.modal.add') : t('dataAdmin.modal.save')}
          </Button>
        </Flex>
      </Modal.Footer>
    </Modal>
  )
}
export default UpdateFolderModal
