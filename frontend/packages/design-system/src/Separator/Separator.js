// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'
import { themed } from '../utils'

const theme = {
  borderTopColor: '#e2e2e2'
}

export const Separator = styled.div`
  border-top: 1px solid black;
  margin-top: 30px;
  margin-bottom: 30px;
  ${themed('Separator', theme)}
`
