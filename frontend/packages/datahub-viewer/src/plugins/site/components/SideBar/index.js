// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import {
  setActiveSideBarIconName,
  setMapControlMouseSettings,
  setMapControlKeySettings
} from 'plugins/site/actions'
import { setNotificatinosIsOpen } from 'plugins/site/actions/notifications'
import {
  getActiveSideBarIconName,
  getIsMobile,
  getMapControlMouseSettings,
  getMapControlKeySettings
} from 'plugins/site/selectors'
import { SideBar as SideBarComponent } from './SideBar'
import { getNotificationsIsOpen } from '../../selectors/notifications'
import { getUserProfile } from '../../../../addons/auth/selectors'

const mapStateToProps = state => ({
  activeIconName: getActiveSideBarIconName(state),
  mapControlMouseSettings: getMapControlMouseSettings(state),
  mapControlKeySettings: getMapControlKeySettings(state),
  isMobile: getIsMobile(state),
  isNotificationsSetting: getNotificationsIsOpen(state),
  userProfile: getUserProfile(state)
})

const mapDispatchToProps = {
  setActiveSideBarIconName,
  setMapControlMouseSettings,
  setMapControlKeySettings,
  setNotificatinosIsOpen
}

export const SideBar: any = compose(
  withNamespaces('site'),
  connect(mapStateToProps, mapDispatchToProps)
)(SideBarComponent)
