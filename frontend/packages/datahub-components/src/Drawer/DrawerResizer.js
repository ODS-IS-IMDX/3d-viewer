// Copyright (c) 2025 NTT InfraNet
// @flow
import styled from 'styled-components'

export const DrawerResizer = styled.div`
  background-color: white;
  width: 100%;
  height: 10px;
  flex-shrink: 0;
  cursor: row-resize;

  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    display: block;
    width: 69px;
    height: 4px;
    border-radius: 6px;
  }

  &:hover {
    &::after {
      background-color: #e2e2e2;
    }
  }
`

export default DrawerResizer
