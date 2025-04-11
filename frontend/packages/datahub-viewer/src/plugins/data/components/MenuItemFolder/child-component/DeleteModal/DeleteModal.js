// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import type { WithNamespaces } from 'react-i18next'

import { stopPropagation } from 'utils/events'
import { DeleteModal as DefaultDeleteModal } from 'components'
import type { SelectedItemData } from '../../../../types'

type OwnProps = {|
  selectedItemData: SelectedItemData,
  closeModal: () => void
|}
type DeleteModalProps = {|
  ...WithNamespaces,
  ...OwnProps,
  deleteFolder: (id: string) => void
|}

export const DeleteModal = (props: DeleteModalProps) => {
  const { selectedItemData, closeModal, deleteFolder, t } = props

  const handleDeleteClick = () => {
    deleteFolder(selectedItemData.id)
    closeModal()
  }

  const modalMessage = `${selectedItemData.name}\n\n${t(
    'dataAdmin.deleteModal.confirmFileDeleteMessage'
  )}`

  return (
    <DefaultDeleteModal
      zIndex={99999}
      message={modalMessage}
      onCancelClick={stopPropagation(closeModal)}
      onDeleteClick={stopPropagation(handleDeleteClick)}
    />
  )
}

export default DeleteModal
