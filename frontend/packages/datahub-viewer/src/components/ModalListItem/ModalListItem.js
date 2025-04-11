// Copyright (c) 2025 NTT InfraNet
import styled, { css } from 'styled-components'
import { List } from '@ehv/datahub-components'

export const ModalListItem = styled(List.Item)`
  height: 56px;
  border-radius: 6px;

  &:not(:last-of-type) {
    margin-bottom: 12px;
  }

  ${({ selected }) =>
    selected &&
    css`
      border: solid 1px rgba(22, 171, 227, 0.27);
      background-color: #e7f7fc;

      &:hover {
        background-color: #e7f7fc;
      }
    `}
`

export default ModalListItem
