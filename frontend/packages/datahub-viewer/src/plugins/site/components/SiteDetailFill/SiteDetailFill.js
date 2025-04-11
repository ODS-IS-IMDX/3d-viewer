// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import { Fill } from '@ehv/react-slots'

type SiteDetailFillProps = {}

export const SiteDetailFill = React.memo<SiteDetailFillProps>(props => (
  <Fill {...props} slot='site.detail' />
))
