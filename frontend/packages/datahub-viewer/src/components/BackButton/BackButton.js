// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import styled from 'styled-components'
import { Button } from '@ehv/datahub-components'
import { IconActionGotoPrevious } from '@ehv/datahub-icons'

const ButtonWrapper = styled(Button)`
  align-items: center;
  color: #3a4248;
  cursor: pointer;
  display: flex;
  padding: 0;
`

const BackButton = ({ label, ...props }) => (
  <ButtonWrapper {...props}>
    <IconActionGotoPrevious />
    {label}
  </ButtonWrapper>
)

export default BackButton
