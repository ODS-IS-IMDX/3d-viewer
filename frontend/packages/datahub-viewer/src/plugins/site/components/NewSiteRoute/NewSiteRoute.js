// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { PureComponent } from 'react'
import SiteRoute from '../SiteRoute'

export type NewSiteProps = {
  isAdmin: Boolean
}

export class NewSiteRoute extends PureComponent<NewSiteProps> {
  render () {
    const { isAdmin } = this.props

    return <SiteRoute isAdmin={isAdmin} />
  }
}
