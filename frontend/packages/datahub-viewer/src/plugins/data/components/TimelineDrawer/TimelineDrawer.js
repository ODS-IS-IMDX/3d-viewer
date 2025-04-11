// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { memo, useEffect, useRef } from 'react'
/**
 * Timelineのドキュメント
 * vis-timeline: https://visjs.github.io/vis-timeline/docs/timeline/
 */
import { Timeline } from '@ehv/datahub-components'
import { Header } from './sub-component/TimelineHeader'
import { Box } from '@ehv/design-system'
import {
  FILE_TYPE,
  TIMELINE_MARKER_ID as MARKER_ID,
  TIMELINE_INFO_LOCAL_STORAGE_KEY
} from 'plugins/data/constants'

import type { VisTimeline } from 'plugins/data/reducer'

import './style/AssetTimeline.css'

type Range = {
  start: any,
  end: any
}

type DrawerProps = {|
  setAssetVisibilityFunctionList: Array<
    (id: AssetID, isVisible: boolean) => void
  >,
  closeDrawer: () => DataCloseDrawerAction,
  removeVisTimeline: (visTimelineInstance: any) => DataRemoveVisTimelineAction,
  setTimelineShowData: () => DataSetTimelineShowDataAction,
  setVisTimeline: (visTimeline: VisTimeline) => DataSetVisTimelineAction,
  viewer: any,
  t: TFunction
|}

// ツールチップのテンプレートを返す
const tooltipTemplate = item => {
  const { start, end } = item
  const yyyymmddhhmmss = date =>
    `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${String(
      date.getHours()
    ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(
      date.getSeconds()
    ).padStart(2, '0')}`
  return `${yyyymmddhhmmss(start)} ~ ${yyyymmddhhmmss(end)}`
}

// 表示間隔のデフォルト値
export const TEXT_RADIO_DEFAULT_VALUE = 86400000 * 14

// 自動ロール時、1秒当たり何回タイムラインを移動するか
const MOVE_TIMES_PER_SECOND = 50
// timelineのオプション設定
const options = {
  // ラベルの書式フォーマット指定
  format: {
    majorLabels: {
      millisecond: 'HH:mm:ss',
      second: 'YYYY-MM-DD HH:mm',
      minute: 'YYYY-MM-DD',
      hour: 'YYYY-MM-DD',
      weekday: 'YYYY-MM',
      day: 'YYYY-MM',
      week: 'YYYY-MM',
      month: 'YYYY',
      year: ''
    },
    minorLabels: {
      millisecond: 'SSS',
      second: 's',
      minute: 'HH:mm',
      hour: 'HH:mm',
      weekday: 'DD',
      day: 'DD',
      week: 'w',
      month: 'MMM',
      year: 'YYYY'
    }
  },
  groupHeightMode: 'fixed',
  // margin各種
  margin: {
    // 横軸のmarginを5に設定(5にしないと一行目のみ縦幅が違う)
    axis: 5
  },
  // マイナーラベル刻みの細かさ指定(数値小さい => 細かい)
  maxMinorChars: 4,
  // タイムラインの横バーを選択できないように設定
  selectable: false,
  // ラベルを上に表示
  orientation: 'top',
  // 縦スクロール可能
  verticalScroll: true,
  // マオススクロールによりズーム機能を使用禁止
  zoomable: false,
  // ズームインとズームアウトの限界(単位: ミリセカンド): (max: 1年; min: 1日)
  zoomMax: 31536000000,
  zoomMin: 86400000,
  tooltip: {
    overflowMethod: 'cap',
    template: item => tooltipTemplate(item)
  }
}

const Drawer = (props: DrawerProps) => {
  const drawRef = useRef<HTMLDivElement>()
  // サイズ変更監視用オブジェクト
  const resizeObserver = new ResizeObserver(elementList => {
    const newDrawerHeight = Math.ceil(elementList[0].contentRect.height)
    const timelineItemsHeight = newDrawerHeight - 90
    timelineItemsHeight > 0 &&
      timelineInstance.setOptions({
        maxHeight: timelineItemsHeight
      })
  })

  const {
    setAssetVisibilityFunctionList,
    closeDrawer,
    removeVisTimeline,
    setVisTimeline,
    setTimelineShowData,
    viewer,
    t
  } = props

  // 現在表示中のtimelineの始点終点を取得する関数定義
  const getTimeFromWindow = () =>
    ({
      startTime: timelineInstance.getWindow().start.valueOf(),
      endTime: timelineInstance.getWindow().end.valueOf()
    }: {
      startTime: number,
      endTime: number
    })

  // ドロアがタイムラインのインスタンスを取得用関数
  let timelineInstance
  const outputInstance = instance => {
    timelineInstance = instance
    setVisTimeline({ visTimelineInstance: instance })
  }
  // 表示間隔
  let displayInterval = TEXT_RADIO_DEFAULT_VALUE
  // ドロアがヘッダのロール速度を取得用関数
  let speedPerSecond = 12 * 3600000
  const outputSpeed = hour => {
    speedPerSecond = hour * 3600000
  }
  // local storageからドロアのパラメータ取得して設定
  const {
    startTime: defaultStartTime,
    endTime: defaultEndTime,
    markerTime = new Date(),
    rollSpeedPerSecond = speedPerSecond,
    textRadioValue = displayInterval
  } = localStorage.getItem(TIMELINE_INFO_LOCAL_STORAGE_KEY)
    ? JSON.parse(localStorage.getItem(TIMELINE_INFO_LOCAL_STORAGE_KEY))
    : {}
  outputSpeed(rollSpeedPerSecond / 3600000)
  displayInterval = textRadioValue

  useEffect(() => {
    // markerを指定位置に追加
    timelineInstance.addCustomTime(markerTime, MARKER_ID)
    const drawerElement =
      drawRef.current && drawRef.current.parentElement
        ? drawRef.current.parentElement
        : null
    if (drawerElement) {
      // ドロアのサイズ変更を監視する
      resizeObserver.observe(drawerElement)
      // タイムライン自身がスクロール機能を持っているため、ドロアの縦スクロールを無効化
      drawerElement.setAttribute('style', 'overflow-y: hidden')
    }
    // タイムラインの開始終了位置設定
    timelineInstance.setWindow({
      start: defaultStartTime || markerTime.getTime() - displayInterval / 2,
      end: defaultEndTime || markerTime.getTime() + displayInterval / 2,
      animation: false
    })
    // stateに保持しているtimeline表示アイテムを反映する
    setTimelineShowData()
    // timelineに設定した各データの初期表示非表示状態を設定する
    const dataList = timelineInstance.itemsData.get()
    dataList &&
      dataList.forEach(data => {
        const isShouldVisible =
          new Date(data.start).getTime() <= markerTime &&
          markerTime <= new Date(data.end).getTime()
        setVisibility(data, isShouldVisible)
      })
    return () => {
      // ドロア閉じる時に、タイムラインに追加したアイテムの表示状態をタイムライン表示前に戻す
      const dataList =
        timelineInstance && timelineInstance.itemsData
          ? timelineInstance.itemsData.get()
          : []
      const { memorizedVisibleMap } = timelineInstance
      dataList &&
        dataList.forEach(item => {
          item.isVisible !== memorizedVisibleMap.get(item.id) &&
            toggleVisibility(item)
        })
      // ドロア閉じる時に、local storageにドロアのパラメータ保存
      localStorage.setItem(
        TIMELINE_INFO_LOCAL_STORAGE_KEY,
        JSON.stringify({
          ...getTimeFromWindow(),
          markerTime: timelineInstance.getCustomTime(MARKER_ID).getTime(),
          rollSpeedPerSecond: speedPerSecond,
          textRadioValue: displayInterval
        })
      )
      if (drawerElement) {
        resizeObserver.unobserve(drawerElement)
        drawerElement.setAttribute('style', 'overflow-y: auto')
      }
      window.clearInterval(intervalId)
    }
  })

  const setVisibility = (data, isVisible) => {
    switch (data.fileType) {
      case FILE_TYPE.ASSET:
        setAssetVisibilityFunctionList[data.subFileType](data.id, isVisible)
        break
      default:
        return
    }
    // classNameでタイムラインの中の横バー色変更
    if (isVisible) {
      timelineInstance.itemsData.update({
        ...data,
        isVisible,
        className: 'visible-in-map'
      })
    } else {
      timelineInstance.itemsData.update({
        ...data,
        isVisible,
        className: 'invisible-in-map'
      })
    }
  }
  const toggleVisibility = data => {
    setVisibility(data, !data.isVisible)
  }

  const timeChangeHandler = timestamp => {
    const dataList = timelineInstance.itemsData.get()
    if (!dataList || dataList.length === 0) {
      return
    }
    dataList.forEach(data => {
      const isShouldVisible =
        new Date(data.start).getTime() <= timestamp &&
        timestamp <= new Date(data.end).getTime()
      data.isVisible !== isShouldVisible && toggleVisibility(data)
    })
    viewer.scene.requestRenderMode && viewer.scene.requestRender()
  }

  // マーカーの位置を表す。値: [0 ~ 1]。0: timeline始点; 1: timeline終点。
  let markerPosition = 0.5
  const event = {
    // rangeが変わる時(timelineのスクロール, 表示間隔変更)のイベント
    rangechange: props => {
      // マーカーの位置を計算しなおす
      const { startTime, endTime } = getTimeFromWindow()
      const markerTime = (endTime - startTime) * markerPosition + startTime
      timelineInstance.setCustomTime(markerTime, MARKER_ID)
      // 時間変更によってアセット表示非表示
      timeChangeHandler(markerTime)
    },
    // マーカーを手動調整時のイベント
    timechange: props => {
      const { startTime, endTime } = getTimeFromWindow()
      const markerTime = props.time.valueOf()
      markerPosition = (markerTime - startTime) / (endTime - startTime)
      // 時間変更によってアセット表示非表示
      timeChangeHandler(markerTime)
    }
  }

  let intervalId: number

  const onPlay = () => {
    if (!timelineInstance) {
      return
    }
    // playボタンを連打して複数のIntervalを発生させないように、とりあえず既存のIntervalをクリア
    window.clearInterval(intervalId)
    // 関数clearIntervalとsetIntervalの前にwindowを付ける理由：Flow(incompatible-type)エラー回避
    intervalId = window.setInterval(() => {
      const range: Range = timelineInstance.getWindow()
      timelineInstance.setWindow({
        start: range.start.valueOf() + speedPerSecond / MOVE_TIMES_PER_SECOND,
        end: range.end.valueOf() + speedPerSecond / MOVE_TIMES_PER_SECOND,
        animation: false
      })
    }, 1000 / MOVE_TIMES_PER_SECOND)
  }
  const onStop = () => {
    window.clearInterval(intervalId)
  }
  // テキストラジオの選択ハンドラ
  const onTextRadioChange = (textRadioValue: number) => {
    displayInterval = textRadioValue
    const { startTime, endTime } = getTimeFromWindow()
    const newStartTime =
      startTime - (textRadioValue - (endTime - startTime)) / 2
    const newEndTime = endTime + (textRadioValue - (endTime - startTime)) / 2
    timelineInstance.setWindow({
      start: newStartTime,
      end: newEndTime,
      animation: false
    })
  }
  const onDrawerClose = () => {
    removeVisTimeline(timelineInstance)
    closeDrawer()
  }

  return (
    <Box ref={drawRef}>
      <Header
        closeDrawer={onDrawerClose}
        defaultDisplayInterval={displayInterval}
        defaultSpeedPerSecond={speedPerSecond / 3600000}
        outputSpeed={outputSpeed}
        onPlay={onPlay}
        onStop={onStop}
        onTextRadioChange={onTextRadioChange}
        t={t}
      />
      <Timeline
        event={event}
        outputInstance={outputInstance}
        options={options}
      />
    </Box>
  )
}

export const TimelineDrawer = memo<DrawerProps>(Drawer)
