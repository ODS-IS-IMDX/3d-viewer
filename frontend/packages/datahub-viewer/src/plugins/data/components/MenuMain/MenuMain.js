// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { MenuEdit } from '../MenuEdit'
import { MenuShow } from '../MenuShow'
import { MENU_MODE } from 'plugins/data/constants'

type MenuMainProps = {
  enableClickOutsideCloseMenuEdit: boolean,
  menuMode: string
}
const Menu = (props: MenuMainProps) => {
  const { enableClickOutsideCloseMenuEdit, menuMode } = props

  return menuMode === MENU_MODE.SHOW ? (
    <MenuShow />
  ) : (
    <MenuEdit
      enableClickOutsideCloseMenuEdit={enableClickOutsideCloseMenuEdit}
    />
  )
}

export const MenuMain = React.memo<MenuMainProps>(Menu)
