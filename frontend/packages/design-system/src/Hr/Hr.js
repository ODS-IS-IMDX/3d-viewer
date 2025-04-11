// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { space } from 'styled-system'

export const Hr = styled.hr`
  ${space};
  border-color: ${({ color = '#f2f2f2' }) => `${color}`};
  border-width: 0.5px;
`

Hr.propTypes = {
  color: PropTypes.string,
  ...space.propTypes
}
