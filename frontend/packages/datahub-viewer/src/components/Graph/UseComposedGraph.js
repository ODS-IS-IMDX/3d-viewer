// Copyright (c) 2025 NTT InfraNet
// @flow
import { useEffect, useMemo, useState } from 'react'
import { ANNOTAION_GRAPH_X_AXIS_UNIT_OPTIONS_VALUE } from '../../plugins/annotation/constants'
import type {
  GraphDataType,
  GraphExtractSetting,
  GraphSetting,
  LatestInfo,
  GraphReferenceSetting
} from './type'

export type UseCreateGraphObjectProps = {
  /** 2次元配列で表現されたCSVデータ */
  data: string[][] | null,
  /** グラフ設定 */
  setting: GraphExtractSetting,
  /** スタイル設定 */
  style?: {
    /** グラフ色 */
    colors?: string[]
  }
}

/** CSVデータと設定値から、グラフ描画用のオブジェクトを生成する */
export const useCreateGraphObject = (
  props: UseCreateGraphObjectProps
): {
  graphData: GraphDataType,
  displayGraphData: GraphDataType,
  options: GraphSetting[],
  labelsKey2Value: { [string]: string },
  latestInfo: LatestInfo[]
} => {
  const { data, setting, style } = props

  const [graphData, setGraphData] = useState<GraphDataType>([]) //  CSVの各レコード値を、カラムごとに独自のkeyで管理しているオブジェクト
  const [displayGraphData, setDisplayGraphData] = useState<GraphDataType>([]) //  graphDataを表示用に最適化（ソートや絞り込み）したデータ
  const [options, setOptions] = useState<GraphSetting[]>([]) // Graphコンポーネントに渡すための表示設定
  const [labelsKey2Value, setLabelsKey2Value] = useState<{ [string]: string }>(
    {}
  ) // 各カラムの表示ラベル
  const [displayKey2Values, setDisplayKey2Values] = useState<
    { [string]: string }[]
  >([]) // 実際に表示に利用するカラムのみの表示ラベル
  const [latestInfo, setLatestInfo] = useState<LatestInfo[]>([]) // 最新値

  /** 表示するKeyを1次元配列で取得 */
  const displayKeys = useMemo(() => {
    // $FlowFixMe
    return displayKey2Values.map(key2Value => Object.keys(key2Value)).flat()
  }, [displayKey2Values])

  useEffect(() => {
    // CSVデータを独自キーによる管理構造に変換 ({ key0: data1, key2: data2... }[])
    const newGraphData: GraphDataType = []
    if (data) {
      for (const row of data) {
        const rowData = {}
        row.forEach((value, i) => {
          const key = `key${i}`
          const newValue = !isNaN(Number(value)) ? Number(value) : value // 基本は数値で保持
          rowData[key] = newValue
        })
        newGraphData.push(rowData)
      }
    }
    setGraphData(newGraphData)
  }, [data])

  useEffect(() => {
    // カラムごとのラベル定義
    let newLabels = {}
    if (graphData && graphData.length > 0) {
      if (setting.useCsvHeader) {
        // グラフデータの先頭レコードをラベルとして扱う
        newLabels = { ...graphData[0] }
      } else {
        // 各カラムに標準ラベル（ローマ字）を割り当てる
        const alphabets = [...Array(26)].map((_, i) =>
          (10 + i).toString(36).toUpperCase()
        )
        for (let i = 0; i < Object.keys(graphData[0]).length; i++) {
          const key = `key${i}`
          newLabels[key] = alphabets[i]
        }
      }
    }
    if (JSON.stringify(labelsKey2Value) !== JSON.stringify(newLabels)) {
      // Object内容が変化していれば更新する
      setLabelsKey2Value(newLabels)
    }

    // グラフデータを表示用に最適化する
    let newDisplayGraphData = setting.useCsvHeader
      ? [...graphData.slice(1)]
      : [...graphData]
    if (newDisplayGraphData.length > 0) {
      if (
        setting.unit &&
        setting.unit !== ANNOTAION_GRAPH_X_AXIS_UNIT_OPTIONS_VALUE.OTHERS
      ) {
        // 単位がその他以外（=日付）なら降順ソートする
        const keyX = setting.keyX
        if (keyX) {
          newDisplayGraphData.sort((a, b) => {
            let result = 0
            const dateA = new Date(a[keyX])
            const dateB = new Date(b[keyX])
            if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
              result = dateA.getTime() - dateB.getTime()
            }
            return result
          })

          // 期間による絞り込み
          let from: Date | null = null
          let to: Date | null = null
          if (
            setting.limitCount != null &&
            setting.startDateTime == null &&
            setting.endDateTime == null
          ) {
            // 最新値から
            const limitCount = setting.limitCount || 0
            const lastDate = new Date(
              newDisplayGraphData[newDisplayGraphData.length - 1][keyX]
            )
            if (!isNaN(lastDate.getTime())) {
              to = new Date(lastDate)
              switch (setting.unit) {
                case ANNOTAION_GRAPH_X_AXIS_UNIT_OPTIONS_VALUE.HOUR: // 時間
                  from = new Date(
                    lastDate.setHours(lastDate.getHours() - limitCount)
                  )
                  break
                case ANNOTAION_GRAPH_X_AXIS_UNIT_OPTIONS_VALUE.DAY: // 日
                  from = new Date(
                    lastDate.setDate(lastDate.getDate() - limitCount)
                  )
                  break
                case ANNOTAION_GRAPH_X_AXIS_UNIT_OPTIONS_VALUE.WEEK: // 週
                  from = new Date(
                    lastDate.setDate(lastDate.getDate() - limitCount * 7)
                  )
                  break
                case ANNOTAION_GRAPH_X_AXIS_UNIT_OPTIONS_VALUE.MONTH: // ヶ月
                  from = new Date(
                    lastDate.setMonth(lastDate.getMonth() - limitCount)
                  )
                  break
                default:
                  // デフォルトは時間とする
                  from = new Date(
                    lastDate.setHours(lastDate.getHours() - limitCount)
                  )
                  break
              }
            }
          } else if (
            setting.startDateTime != null &&
            setting.endDateTime != null
          ) {
            // 期間選択
            from = setting.startDateTime
            to = setting.endDateTime
          }
          // 期間が設定されていなければ、絞り込みは実施しない
          if (
            from != null &&
            !isNaN(from.getTime()) &&
            to != null &&
            !isNaN(to.getTime())
          ) {
            newDisplayGraphData = [...newDisplayGraphData].filter(row => {
              const date = new Date(row[keyX])
              return from && to && from <= date && date <= to
            })
          }
        }
      }
    }
    if (
      JSON.stringify(displayGraphData) !== JSON.stringify(newDisplayGraphData)
    ) {
      // Object内容が変化していれば更新する
      setDisplayGraphData(newDisplayGraphData)
    }
  }, [graphData, setting, labelsKey2Value, displayGraphData])

  useEffect(() => {
    // 表示するデータのキーを設定する。
    const newDisplayKey2Value: { [string]: string }[] = []
    const keysY = setting.keysY
    if (keysY) {
      for (const keys of keysY) {
        const key2Value = {}
        for (const numberKey of keys) {
          const key = `key${numberKey}` // 設定値としてはデータのインデックスしか保持していないので、キー値に変換
          key2Value[key] = labelsKey2Value[key]
        }
        newDisplayKey2Value.push(key2Value)
      }
    }
    if (
      JSON.stringify(displayKey2Values) !== JSON.stringify(newDisplayKey2Value)
    ) {
      // Object内容が変化していれば更新する
      setDisplayKey2Values(newDisplayKey2Value)
    }
  }, [labelsKey2Value, setting, displayKey2Values])

  useEffect(() => {
    // 最新値情報設定
    const newLatest: LatestInfo[] = []
    if (displayGraphData.length > 0 && displayKeys.length > 0) {
      const latestData = displayGraphData[displayGraphData.length - 1]
      const styleColors: string[] | null =
        style && style.colors ? style.colors : null
      let colors: string[] | null = null
      if (styleColors && styleColors.length > 0) {
        colors = [...styleColors]
        while (displayKeys.length > colors.length) {
          // 色が不足しないように繰り返し結合する
          colors = colors.concat(styleColors)
        }
      }
      displayKeys.forEach((key, i) => {
        newLatest.push({
          label: `${labelsKey2Value[key]}：${latestData[key]}`,
          color: colors ? colors[i] : undefined
        })
      })
    }
    if (JSON.stringify(latestInfo) !== JSON.stringify(newLatest)) {
      // Object内容が変化していれば更新する
      setLatestInfo(newLatest)
    }
  }, [labelsKey2Value, displayKeys, displayGraphData, style, latestInfo])

  useEffect(() => {
    // Graphコンポーネントに渡すための設定値を生成する
    const newOptions: GraphSetting[] = []
    const propsColors = style ? style.colors : null
    let colors: string[] | null = null
    if (propsColors && propsColors.length > 0) {
      colors = propsColors
      while (displayKeys.length > colors.length) {
        // 色が不足しないように繰り返し結合する
        colors = colors.concat(propsColors)
      }
    }
    let colorIndex = 0
    for (let i = 0; i < displayKey2Values.length; i++) {
      const targetKey2Value = displayKey2Values[i]
      const keysCount = Object.keys(targetKey2Value).length
      // この縦軸に紐づく閾値設定を取得
      let refereces: GraphReferenceSetting[] = []
      if (setting.monitorList) {
        refereces = setting.monitorList
          .filter(monitor => {
            return (
              monitor.targetAxis &&
              monitor.targetAxis.value != null &&
              Object.keys(targetKey2Value).includes(
                `key${monitor.targetAxis.value}`
              )
            )
          })
          .map(monitor => {
            return {
              value: monitor.threshold,
              label: monitor.name,
              color: undefined
            }
          })
      }
      newOptions.push({
        type: setting.type,
        labelY: setting.labelsY ? setting.labelsY[i] : undefined,
        displayKey2Value: targetKey2Value,
        domain:
          setting.displayRangesY && Array.isArray(setting.displayRangesY[i])
            ? setting.displayRangesY[i].map(value =>
                isNaN(value) ? value : Number.parseFloat(value)
              )
            : ['auto', 'auto'],
        refereces,
        style: {
          colors: colors
            ? colors.slice(colorIndex, colorIndex + keysCount)
            : undefined, // 前のグラフの色に続くように切り出す
          orientation: i === 0 ? 'left' : 'right'
        }
      })
      colorIndex += keysCount
    }
    if (JSON.stringify(options) !== JSON.stringify(newOptions)) {
      // Object内容が変化していれば更新する
      setOptions(newOptions)
    }
  }, [displayKey2Values, setting, options, displayKeys, style])

  return {
    graphData,
    displayGraphData,
    options,
    labelsKey2Value,
    latestInfo
  }
}

/** APIから得られる設定情報から、必要な情報を抽出 */
export const useExtractSetting = (setting: any): GraphExtractSetting => {
  const initialSetting: GraphExtractSetting = useMemo(() => {
    return {
      name: '',
      type: 'LINE',
      keyX: null,
      labelX: null,
      keysY: null,
      labelsY: null,
      displayRangesY: null,
      useCsvHeader: false,
      unit: null,
      limitCount: null,
      startDateTime: null,
      endDateTime: null,
      updateInterval: null,
      thresholdSettings: null
    }
  }, [])
  const [extractSetting, setExtractSetting] = useState<GraphExtractSetting>(
    initialSetting
  )

  useEffect(() => {
    // 初期値
    const newExtractSetting: GraphExtractSetting = { ...initialSetting }

    if (setting) {
      /// 基本情報
      // グラフ名
      if (setting.name) {
        newExtractSetting.name = setting.name
      }
      // グラフ形式
      if (setting.type) {
        newExtractSetting.type = setting.type
      }
      // 更新間隔
      if (setting.updateInterval != null) {
        newExtractSetting.updateInterval = setting.updateInterval
      }

      /// リソース関連
      const resourceInfo = setting.resourceInfo
      if (resourceInfo) {
        // ヘッダー有無
        newExtractSetting.useCsvHeader = resourceInfo.useCsvHeader || false
      }

      /// 横軸関連
      const horizontal = setting.horizontal
      if (horizontal) {
        // 選択された横軸
        if (horizontal.axis != null) {
          newExtractSetting.keyX = `key${horizontal.axis}`
        }
        // 横軸ラベル
        if (horizontal.label != null) {
          newExtractSetting.labelX = horizontal.label
        }
        // 単位
        if (horizontal.unit != null) {
          newExtractSetting.unit = horizontal.unit
        }
        // 取得上限数
        if (horizontal.limitCount != null) {
          newExtractSetting.limitCount = Number(horizontal.limitCount)
        }
        // 絞り込み開始日付
        if (horizontal.startDateTime != null) {
          newExtractSetting.startDateTime = new Date(horizontal.startDateTime)
        }
        // 絞り込み終了日付
        if (horizontal.endDateTime != null) {
          newExtractSetting.endDateTime = new Date(horizontal.endDateTime)
        }
      }

      /// 縦軸関連
      const verticalList = setting.verticalList
      if (verticalList && verticalList.length > 0) {
        const newKeysY = [] // 選択された縦軸
        const newLabelsY = [] // 縦軸のラベル
        for (const vertical of verticalList) {
          if (vertical.axisList && vertical.label) {
            newKeysY.push(vertical.axisList)
            newLabelsY.push(vertical.label)
          }
        }
        newExtractSetting.keysY = newKeysY
        newExtractSetting.labelsY = newLabelsY
        newExtractSetting.displayRangesY = verticalList.map(
          vertical => vertical.displayRange || ['auto', 'auto']
        )
      }

      /// 閾値設定
      if (setting.monitorList) {
        newExtractSetting.monitorList = setting.monitorList
      }
    }

    if (JSON.stringify(extractSetting) !== JSON.stringify(newExtractSetting)) {
      // Object内容が変化していれば更新する
      setExtractSetting(newExtractSetting)
    }
  }, [setting, extractSetting, initialSetting])

  return extractSetting
}
