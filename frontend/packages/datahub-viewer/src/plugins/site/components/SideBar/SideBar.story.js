import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'
import { SideBar } from './SideBar'
import { action } from '@storybook/addon-actions'
import { SIDE_BAR_ICON_NAME } from 'plugins/site/constants'
import { mockSiteStore } from 'plugins/site/components/__storybook__/mockData'

const mouseSettings = {
  horizontal: JSON.stringify([0]),
  rotate: JSON.stringify([1]),
  zoom: JSON.stringify([3, 4])
}
const keySettings = {
  zoomIn: '',
  zoomOut: '',
  moveUp: '',
  moveDown: '',
  moveFoward: '',
  moveBackward: '',
  moveLeft: '',
  moveRight: '',
  rotateUp: '',
  rotateDown: '',
  rotateLeft: '',
  rotateRight: '',
  twistLeft: '',
  twistRight: ''
}

const userProfileNomal = mockSiteStore.getUserProfileNomal()

storiesOf('Site/SideBar', module)
  .addDecorator(story => <Provider store={mockSiteStore}>{story()}</Provider>)
  .addParameters({ component: SideBar })
  .add('No icon active', () => (
    <SideBar
      isPublishedMode={false}
      isManagementModalOpen={false}
      activeIconName={null}
      mapControlMouseSettings={mouseSettings}
      mapControlKeySettings={keySettings}
      setActiveSideBarIconName={action('setActiveSideBarIconName')}
      openManagementModal={action('openManagementModal')}
      setMapControlMouseSettings={action('setMapControlMouseSettings')}
      setMapControlKeySettings={action('setMapControlKeySettings')}
      setModalPhase={action('setModalPhase')}
      userProfile={userProfileNomal}
      getSiteGraphSettingList={action('getSiteGraphSettingList')}
    />
  ))
  .add('Logo icon active', () => (
    <SideBar
      isPublishedMode={false}
      isManagementModalOpen={false}
      activeIconName={SIDE_BAR_ICON_NAME.LOGO}
      mapControlMouseSettings={mouseSettings}
      mapControlKeySettings={keySettings}
      setActiveSideBarIconName={action('setActiveSideBarIconName')}
      openManagementModal={action('openManagementModal')}
      setMapControlMouseSettings={action('setMapControlMouseSettings')}
      setMapControlKeySettings={action('setMapControlKeySettings')}
      setModalPhase={action('setModalPhase')}
      userProfile={userProfileNomal}
      getSiteGraphSettingList={action('getSiteGraphSettingList')}
    />
  ))
  .add('File icon active', () => (
    <SideBar
      isPublishedMode={false}
      isManagementModalOpen={false}
      activeIconName={SIDE_BAR_ICON_NAME.FILE}
      mapControlMouseSettings={mouseSettings}
      mapControlKeySettings={keySettings}
      setActiveSideBarIconName={action('setActiveSideBarIconName')}
      openManagementModal={action('openManagementModal')}
      setMapControlMouseSettings={action('setMapControlMouseSettings')}
      setMapControlKeySettings={action('setMapControlKeySettings')}
      setModalPhase={action('setModalPhase')}
      userProfile={userProfileNomal}
      getSiteGraphSettingList={action('getSiteGraphSettingList')}
    />
  ))
  .add('User icon active', () => (
    <SideBar
      isPublishedMode={false}
      isManagementModalOpen={false}
      activeIconName={SIDE_BAR_ICON_NAME.USER}
      mapControlMouseSettings={mouseSettings}
      mapControlKeySettings={keySettings}
      setActiveSideBarIconName={action('setActiveSideBarIconName')}
      openManagementModal={action('openManagementModal')}
      setMapControlMouseSettings={action('setMapControlMouseSettings')}
      setMapControlKeySettings={action('setMapControlKeySettings')}
      setModalPhase={action('setModalPhase')}
      userProfile={userProfileNomal}
      getSiteGraphSettingList={action('getSiteGraphSettingList')}
    />
  ))
  .add('Mobile mode', () => (
    <SideBar
      isPublishedMode={false}
      isManagementModalOpen={false}
      activeIconName={null}
      mapControlMouseSettings={mouseSettings}
      mapControlKeySettings={keySettings}
      setActiveSideBarIconName={action('setActiveSideBarIconName')}
      openManagementModal={action('openManagementModal')}
      setMapControlMouseSettings={action('setMapControlMouseSettings')}
      setMapControlKeySettings={action('setMapControlKeySettings')}
      setModalPhase={action('setModalPhase')}
      userProfile={userProfileNomal}
      getSiteGraphSettingList={action('getSiteGraphSettingList')}
      isMobile
    />
  ))
