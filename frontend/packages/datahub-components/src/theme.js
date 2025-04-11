// Copyright (c) 2025 NTT InfraNet
// @flow
import { accordionTheme as Accordion, type AccordionTheme } from './Accordion'
import { dropdownTheme as Dropdown, type DropdownTheme } from './Dropdown'
import {
  contextMenuTheme as ContextMenu,
  type ContextMenuTheme
} from './ContextMenu'
import { gridTheme as Grid, type GridTheme } from './Grid'
import { initialsTheme as Initials, type InitialsTheme } from './Initials'
import {
  inputWithLabelTheme as InputWithLabel,
  type InputWithLabelTheme
} from './InputWithLabel/theme'
import { listTheme as List, type ListTheme } from './List'
import { mapMoreTheme as MapMore, type MapMoreTheme } from './MapMore'
import {
  mapNavigatorTheme as MapNavigator,
  type MapNavigatorTheme
} from './MapNavigator'
import { modalTheme as Modal, type ModalTheme } from './Modal'
import {
  selectListTheme as SelectList,
  type SelectListTheme
} from './SelectList'

export type Theme = {
  Accordion: AccordionTheme,
  ContextMenu: ContextMenuTheme,
  Dropdown: DropdownTheme,
  Grid: GridTheme,
  Initials: InitialsTheme,
  InputWithLabel: InputWithLabelTheme,
  List: ListTheme,
  MapMore: MapMoreTheme,
  MapNavigator: MapNavigatorTheme,
  Modal: ModalTheme,
  SelectList: SelectListTheme
}

export const theme: Theme = {
  Accordion,
  ContextMenu,
  Dropdown,
  Grid,
  Initials,
  InputWithLabel,
  List,
  MapMore,
  MapNavigator,
  Modal,
  SelectList,
  space: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40]
}
