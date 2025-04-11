// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { withNamespaces, type WithNamespaces } from 'react-i18next'
import styled from 'styled-components'
import { Absolute, Box, ClickOutside } from '@ehv/datahub-components'
import {
  IconFolder,
  IconFolderG,
  IconUser,
  IconUserG,
  IconCog,
  IconCogG
} from '@ehv/datahub-icons'
import SiteUserContextMenu from '../SiteUserContextMenu'
import { SIDE_BAR_ICON_NAME } from 'plugins/site/constants'
import CameraControlModal, {
  type FormValues as CameraControlValues
} from '../CameraControlModal'
import { MapControlMouseType, MapControlKeyType } from '../../types'
import SettingContextMenu from '../SettingContextMenu'
import type { UserProfile } from '../../../../addons/auth/reducers'

export type SideBarProps = WithNamespaces & {
  isPublishedMode: boolean,
  activeIconName?: string | null,
  isManagementModalOpen: boolean,
  mapControlMouseSettings: MapControlMouseType,
  mapControlKeySettings: MapControlKeyType,
  isMobile: boolean,
  isNotificationsSetting: boolean,
  setActiveSideBarIconName: (activeIcon: string | null) => void,
  setMapControlMouseSettings: (
    horizontal?: Array<string> | null,
    rotate?: Array<string> | null,
    zoom?: Array<string> | null
  ) => void,
  setMapControlKeySettings: (
    zoomIn?: string,
    zoomOut?: string,
    moveUp?: string,
    moveDown?: string,
    moveFoward?: string,
    moveBackward?: string,
    moveLeft?: string,
    moveRight?: string,
    rotateUp?: string,
    rotateDown?: string,
    rotateLeft?: string,
    rotateRight?: string,
    twistLeft?: string,
    twistRight?: string
  ) => void,
  setNotificatinosIsOpen: (isOpen: boolean) => void,
  userProfile: UserProfile,
  getSiteGraphSettingList: (isMonitoring?: boolean) => void,
  chartSettingList: any[]
}

const SideBarWrapper = styled(Box)`
  width: 70px;
  height: 100vh;
`
const IconWrapper = styled(Box)`
  width: 50px;
  height: 50px;
  margin: 10px;
  cursor: pointer;
  position: relative;
  color: #393a3a;

  &:hover {
    background-color: #f5f5f4;

    .description {
      display: flex;
      justify-content: center;
      top: 10px;
      left: 60px;
    }
  }
`

const Tooltip = styled.div`
  display: none;
  position: absolute;
  padding: 8px;
  font-size: 12px;
  line-height: 1.6em;
  color: #fff;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.8);
  z-index: 2147483647;
  white-space: nowrap;
`

const SideBarComponent = (props: SideBarProps) => {
  const {
    t,
    activeIconName,
    isPublishedMode,
    isManagementModalOpen,
    isMobile,
    isNotificationsSetting,
    setActiveSideBarIconName,
    setMapControlMouseSettings,
    setMapControlKeySettings,
    setNotificatinosIsOpen
  } = props

  const [isOpenCameraControllModal, setIsOpenCameraControllModal] = useState(
    false
  ) // 操作設定モーダル表示制御
  const [isOpenUserContextMenu, setIsOpenUserContextMenu] = useState(false) // ユーザメニュー表示制御
  const [onHoverIconName, setOnHoverIconName] = useState(null) // カーソルが当たっているアイコン
  const [activeMenuIconName, setActiveMenuIconName] = useState(null) // 表示中のメニュー(サイドメニューとは別)
  const [isOpenSettingContextMenu, setIsOpenSettingContextMenu] = useState(
    false
  ) // 設定メニュー表示制御
  const userIconRef = useRef<HTMLDivElement>(null)
  const settingIconRef = useRef<HTMLDivElement>(null)

  useEffect(
    preProps => {
      if (!isManagementModalOpen) {
        setActiveMenuIconName(null)
      }
    },
    [isManagementModalOpen]
  )

  const makeIcon = Icon => {
    const { OnHoverIcon, iconName } = (() => {
      switch (Icon) {
        case IconFolder:
          return {
            OnHoverIcon: IconFolderG,
            iconName: SIDE_BAR_ICON_NAME.FILE
          }
        case IconUser:
          return {
            OnHoverIcon: IconUserG,
            iconName: SIDE_BAR_ICON_NAME.USER
          }
        case IconCog:
          return {
            OnHoverIcon: IconCogG,
            iconName: SIDE_BAR_ICON_NAME.COG
          }
        default:
          return {
            OnHoverIcon: null,
            iconName: ''
          }
      }
    })()

    const isHoverIcon =
      onHoverIconName === iconName ||
      activeIconName === iconName ||
      activeMenuIconName === iconName

    return isHoverIcon && OnHoverIcon ? (
      <OnHoverIcon
        onMouseEnter={() => setOnHoverIconName(iconName)}
        onMouseLeave={() => setOnHoverIconName(null)}
        onClick={() => {
          // 選択中のアイコンが再度クリックされたら未選択状態にする
          switch (iconName) {
            // コンテキストメニュー・モーダルメニュー
            case SIDE_BAR_ICON_NAME.LOGO:
            case SIDE_BAR_ICON_NAME.COG:
            case SIDE_BAR_ICON_NAME.USER:
              setActiveMenuIconName(
                activeMenuIconName !== iconName ? iconName : null
              )
              break
            // サイドメニュー
            case SIDE_BAR_ICON_NAME.FILE:
              setActiveSideBarIconName(
                activeIconName !== iconName ? iconName : null
              )
              break
            default:
              break
          }
        }}
      />
    ) : (
      <Icon onMouseEnter={() => setOnHoverIconName(iconName)} />
    )
  }

  /** ユーザアイコンクリックイベント */
  const handleClickUserIcon = useCallback(() => {
    setIsOpenUserContextMenu(!isOpenUserContextMenu)
  }, [isOpenUserContextMenu])

  /** 設定アイコンクリックイベント */
  const handleClickCogIcon = useCallback(() => {
    setIsOpenSettingContextMenu(!isOpenSettingContextMenu)
  }, [isOpenSettingContextMenu])

  /** 操作設定openイベント */
  const handleOpenCameraControlModal = useCallback(() => {
    setIsOpenCameraControllModal(!isOpenCameraControllModal)
  }, [isOpenCameraControllModal])

  /** 通知設定openイベント */
  const handleOpenNotificationsModal = useCallback(() => {
    setNotificatinosIsOpen(!isNotificationsSetting)
  }, [isNotificationsSetting, setNotificatinosIsOpen])

  /** 操作設定終了時イベント */
  const handleCloseCameraControlModal = useCallback(() => {
    setIsOpenCameraControllModal(false)
    setActiveMenuIconName(null)
  }, [setActiveMenuIconName])

  /** コンテキストメニュー外クリックイベント */
  const handleClickOutside = useCallback(
    (event: PointerEvent) => {
      // クリックされた箇所がアイコン内だった場合、アイコンのクリックイベントで処理するのでここでは何もしない
      let isInIcon = false
      // $FlowFixMe
      if (
        isOpenUserContextMenu &&
        userIconRef &&
        userIconRef.current &&
        // $FlowFixMe
        !userIconRef.current.contains(event.target)
      ) {
        setIsOpenUserContextMenu(false)
        isInIcon = true
      } else if (
        isOpenSettingContextMenu &&
        settingIconRef &&
        settingIconRef.current &&
        // $FlowFixMe
        !settingIconRef.current.contains(event.target)
      ) {
        setIsOpenSettingContextMenu(false)
        isInIcon = true
      }
      if (isInIcon) {
        setActiveMenuIconName(null)
      }
    },
    [isOpenUserContextMenu, isOpenSettingContextMenu, setActiveMenuIconName]
  )

  /**
   * カメラ操作設定適用イベント
   */
  const handleSubmitCameraControlModal = useCallback(
    (values: CameraControlValues) => {
      // マウス操作
      if (!isMobile) {
        const horizontal = JSON.parse(values.horizontal)
        const rotate = JSON.parse(values.rotate)
        const zoom = JSON.parse(values.zoom)
        setMapControlMouseSettings(
          Array.isArray(horizontal) ? horizontal : null,
          Array.isArray(rotate) ? rotate : null,
          Array.isArray(zoom) ? zoom : null
        )
      }
      // キーボード操作
      setMapControlKeySettings(
        values.zoomIn,
        values.zoomOut,
        values.moveUp,
        values.moveDown,
        values.moveFoward,
        values.moveBackward,
        values.moveLeft,
        values.moveRight,
        values.rotateUp,
        values.rotateDown,
        values.rotateLeft,
        values.rotateRight,
        values.twistLeft,
        values.twistRight
      )
    },
    [isMobile, setMapControlKeySettings, setMapControlMouseSettings]
  )

  return isMobile ? (
    <></>
  ) : (
    <SideBarWrapper>
      <IconWrapper>
        {makeIcon(IconFolder)}
        <Tooltip className='description'>{t('sideBarToolTip.file')}</Tooltip>
      </IconWrapper>
      <Absolute bottom={0}>
        <IconWrapper ref={settingIconRef} onClick={handleClickCogIcon}>
          {makeIcon(IconCog)}
          <Tooltip className='description'>
            {t('sideBarToolTip.config')}
          </Tooltip>
        </IconWrapper>
        {/* 公開画面として表示の時に、ログイン情報のコンテキストメニューを表示しない */}
        {!isPublishedMode && (
          <IconWrapper ref={userIconRef} onClick={handleClickUserIcon}>
            {makeIcon(IconUser)}
            <Tooltip className='description'>
              {t('sideBarToolTip.user')}
            </Tooltip>
          </IconWrapper>
        )}
      </Absolute>
      {/* 設定コンテキストメニュー */}
      {isOpenSettingContextMenu && (
        <ClickOutside onClickOutside={handleClickOutside}>
          <SettingContextMenu
            position={
              isPublishedMode
                ? { left: 70, bottom: 12 }
                : { left: 70, bottom: 55 }
            }
            handleOpenCameraControlModal={handleOpenCameraControlModal}
            handleOpenNotificationsModal={handleOpenNotificationsModal}
          />
        </ClickOutside>
      )}
      {/* 操作設定モーダル */}
      {isOpenCameraControllModal && (
        <CameraControlModal
          onSubmit={handleSubmitCameraControlModal}
          onClose={handleCloseCameraControlModal}
          initialValues={{
            horizontal: JSON.stringify(
              props.mapControlMouseSettings.horizontal
            ),
            rotate: JSON.stringify(props.mapControlMouseSettings.rotate),
            zoom: JSON.stringify(props.mapControlMouseSettings.zoom),
            ...props.mapControlKeySettings
          }}
        />
      )}
      {/* ユーザ情報メニュー */}
      {isOpenUserContextMenu && (
        <ClickOutside onClickOutside={handleClickOutside}>
          <SiteUserContextMenu position={{ left: 70, bottom: 4 }} />
        </ClickOutside>
      )}
    </SideBarWrapper>
  )
}

export const SideBar = React.memo<SideBarProps>(
  withNamespaces('site')(SideBarComponent)
)
