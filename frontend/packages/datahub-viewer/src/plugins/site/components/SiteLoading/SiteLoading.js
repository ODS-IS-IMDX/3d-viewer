// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'

import { AnimatedLoading } from '@ehv/datahub-components'

type SiteLoadingProps = {
  isLoading: boolean
}

const SiteLoading = (props: SiteLoadingProps) => {
  const { isLoading } = props

  if (!isLoading) {
    return null
  }

  return <AnimatedLoading />
}

export default SiteLoading
