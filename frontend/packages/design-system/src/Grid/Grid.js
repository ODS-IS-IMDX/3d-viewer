// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'

import Box from '../Box'
import { themed } from '../utils'

import {
  gridGap,
  gridColumnGap,
  gridRowGap,
  gridColumn,
  gridRow,
  gridAutoFlow,
  gridAutoColumns,
  gridAutoRows,
  gridTemplateColumns,
  gridTemplateRows,
  gridTemplateAreas,
  gridArea
} from 'styled-system'

export const Grid = styled(Box)(
  {
    display: 'grid'
  },
  gridGap,
  gridColumnGap,
  gridRowGap,
  gridColumn,
  gridRow,
  gridAutoFlow,
  gridAutoColumns,
  gridAutoRows,
  gridTemplateColumns,
  gridTemplateRows,
  gridTemplateAreas,
  gridArea,
  themed('Grid')
)

Grid.propTypes = {
  ...gridGap.propTypes,
  ...gridColumnGap.propTypes,
  ...gridRowGap.propTypes,
  ...gridColumn.propTypes,
  ...gridRow.propTypes,
  ...gridAutoFlow.propTypes,
  ...gridAutoColumns.propTypes,
  ...gridAutoRows.propTypes,
  ...gridTemplateColumns.propTypes,
  ...gridTemplateRows.propTypes,
  ...gridTemplateAreas.propTypes,
  ...gridArea.propTypes
}
