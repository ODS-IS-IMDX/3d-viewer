// Copyright (c) 2025 NTT InfraNet
// @flow
import styled from 'styled-components'

// $FlowFixMe
export const SiteMenuResizer = styled.div`
  background-color: #fafafa;
  width: 10px;
  height: 100%;
  flex-shrink: 0;
  cursor: col-resize;

  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    display: inline-block;
    width: 4px;
    height: 69px;
    border-radius: 6px;
  }

  &:hover {
    &::after {
      background-color: #e2e2e2;
    }
  }
`

export default SiteMenuResizer
