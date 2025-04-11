// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { AnimatedLoading } from '@ehv/datahub-components'

type SiteNotificationsLoadingProps = {
  isLoading: boolean
}

const SiteNotificationsLoading: React.FC<SiteNotificationsLoadingProps> = (
  props: SiteNotificationsLoadingProps
) => {
  const { isLoading } = props

  return isLoading ? <AnimatedLoading /> : null
}

export default SiteNotificationsLoading
