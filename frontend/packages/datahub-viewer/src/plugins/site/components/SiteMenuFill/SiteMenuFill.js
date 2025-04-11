// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import { Fill } from '@ehv/react-slots'

type SiteMenuFillProps = {
  order?: number,
  type?: string
}

export const SiteMenuFill = React.memo<SiteMenuFillProps>(props => (
  <Fill {...props} slot='site.menu' />
))
