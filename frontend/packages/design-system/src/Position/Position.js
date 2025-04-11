// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'
import { position, zIndex, top, right, bottom, left } from 'styled-system'

import Box from '../Box'

export const Position = styled(Box)(position, zIndex, top, right, bottom, left)

Position.propTypes = {
  ...position.propTypes,
  ...zIndex.propTypes,
  ...top.propTypes,
  ...right.propTypes,
  ...bottom.propTypes,
  ...left.propTypes
}
