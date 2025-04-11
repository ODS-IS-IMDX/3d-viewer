// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'

import { AnimatedLoading } from '@ehv/datahub-components'

type MenuItemDeleteLoadingProps = {
  isLoading: boolean
}

const MenuItemDeleteLoading = (props: MenuItemDeleteLoadingProps) => {
  const { isLoading } = props

  if (!isLoading) {
    return null
  }

  return <AnimatedLoading />
}

export default MenuItemDeleteLoading
