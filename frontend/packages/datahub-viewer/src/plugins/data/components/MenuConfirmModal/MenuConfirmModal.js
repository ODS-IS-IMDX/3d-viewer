// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import type { WithNamespaces } from 'react-i18next'
import styled from 'styled-components'
import {
  Modal,
  ModalHeader,
  ModalFooter,
  Button,
  Text,
  Box
} from '@ehv/datahub-components'

type MenuConfirmModalProps = {
  ...WithNamespaces,
  isOpen: boolean,
  handleModalClose: () => void,
  handleOnClickSave: () => void,
  handleOnClickNotSave: () => void
}

const Message = styled(Text)`
  white-space: pre-wrap;
`

const FooterWrapper = styled(ModalFooter)`
  padding: 15px 20px;
`

const ModalBox = styled(Box)`
  background-color: #ffffff;
  padding: 40px 0px;
`

const FooterBox = styled(Box)`
  position: relative;
  height: 40px;
`

const FooterNotSavelBox = styled(Box)`
  position: absolute;
  left: 0px;
`

const FooterSaveBox = styled(Box)`
  position: absolute;
  right: 0px;
`

/** ファイル管理機能_編集画面破棄確認モーダルコンポーネント */
const MenuConfirmModal = (props: MenuConfirmModalProps) => {
  const {
    t,
    isOpen,
    handleModalClose,
    handleOnClickSave,
    handleOnClickNotSave
  } = props

  return (
    <>
      {isOpen ? (
        <Modal
          modalContentStyled={'padding:0px'}
          backgroundColor='#ecf0f3'
          header={() => (
            <ModalHeader>{t('dataAdmin.confirmModal.title')}</ModalHeader>
          )}
          onClose={() => handleModalClose()}
          footer={() => (
            <FooterWrapper>
              <FooterBox>
                <FooterNotSavelBox>
                  <Button
                    variant={'outline'}
                    onClick={() => handleOnClickNotSave()}
                  >
                    {t('dataAdmin.confirmModal.button.notSave')}
                  </Button>
                </FooterNotSavelBox>
                <FooterSaveBox>
                  <Button onClick={() => handleOnClickSave()}>
                    {t('dataAdmin.confirmModal.button.save')}
                  </Button>
                </FooterSaveBox>
              </FooterBox>
            </FooterWrapper>
          )}
        >
          <ModalBox>
            <Message fontSize={2} textAlign='center'>
              {t('dataAdmin.confirmModal.contentText')}
            </Message>
          </ModalBox>
        </Modal>
      ) : (
        <></>
      )}
    </>
  )
}

export default React.memo<MenuConfirmModalProps>(MenuConfirmModal)
