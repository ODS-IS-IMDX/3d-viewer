// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import { Fill, type FillProps } from '@ehv/react-slots'

type Props = {
  ...$Exact<FillProps>
}

export const SiteCesiumFill = React.memo<Props>(props => (
  <Fill {...props} slot='site.cesium' />
))
