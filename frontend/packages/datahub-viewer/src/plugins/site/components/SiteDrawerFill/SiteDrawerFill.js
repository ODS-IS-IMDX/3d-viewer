// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { Fill } from '@ehv/react-slots'

export type SiteDrawerFillProps = {
  isMinimum?: boolean
}

export const SiteDrawerFill = React.memo<SiteDrawerFillProps>(props => (
  <Fill {...props} slot='site.drawer' />
))
