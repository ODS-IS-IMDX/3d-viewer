// Copyright (c) 2025 NTT InfraNet
import { Component } from 'react'
import type { WithNamespaces } from 'react-i18next'

export type StoreUpdaterProps = WithNamespaces & {
  siteId: string,
  checkSite: any
}

export class StoreUpdater extends Component {
  componentDidMount () {
    this.props.checkSite(this.props.siteId)
  }

  componentDidUpdate (prevProps, prevState) {
    this.props.checkSite(this.props.siteId)
  }

  render () {
    return null
  }
}
