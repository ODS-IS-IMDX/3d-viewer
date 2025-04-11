// Copyright (c) 2025 NTT InfraNet
// @flow

/** グラフ形式 */
export type GraphType =
  | 'LINE' // 折れ線グラフ
  | 'BAR' // 棒グラフ
  | 'AREA' // 面グラフ
  | 'STACKED_BAR' // 積み上げグラフ

/**
 * グラフデータ表示用独自データ定義
 * { key0: "data1", key1: "data2"... }[]
 */
export type GraphDataType = { [string]: string }[]

/** 閾値設定 */
export type ThresholdSetting = {
  /** 閾値名 */
  name?: string,
  /** 閾値 */
  threshold: number,
  /** 閾値を関連付けた縦軸 */
  targetAxis?: {
    /** 縦軸(インデックス) */
    value?: number,
    /** 縦軸名 */
    name?: string
  },
  /** 閾値判定条件(上回る下回る) */
  condition: 'ENABLED' | 'INVALID',
  /** アクション一覧 */
  actions: {
    /** アクション種別 */
    type: 'NOTICE' | 'MODEL',
    /** アクション対象アセット一覧 */
    targetAssetIds?: string[],
    /** アクション実行オプション */
    options: any
  }[],
  /** 閾値判定結果 */
  isTriggered?: boolean
}

/** 必要な情報を抽出したグラフ設定 */
export type GraphExtractSetting = {
  /** グラフ名 */
  name: string,
  /** グラフ形式 */
  type: GraphType,
  /** 横軸のキー */
  keyX?: string | null,
  /** 横軸のラベル */
  labelX?: string | null,
  /** 縦軸のキー */
  keysY?: string[][] | null,
  /** 縦軸のラベル（2軸の可能性があるので配列） */
  labelsY?: string[] | null,
  /** 縦軸のデータ表示範囲（2軸の可能性があるので配列） */
  displayRangesY?: Array<Array<string>> | null,
  /** CSVデータの先頭レコードをヘッダーとして扱うかどうか */
  useCsvHeader: boolean,
  /** 縦軸の単位 */
  unit?: string | null,
  /** 取得上限数 */
  limitCount?: number | null,
  /** 絞り込み開始日付 */
  startDateTime?: Date | null,
  /** 絞り込み終了日付 */
  endDateTime?: Date | null,
  /** データ更新頻度 */
  updateInterval: number | null,
  /** 閾値設定 */
  monitorList?: ThresholdSetting[] | null
}

/** グラフスタイル設定 */
export type GraphStyle = {
  /** グラフの横幅 */
  width?: string | number,
  /** グラフの余白 */
  margin?: {
    top?: number,
    right?: number,
    bottom?: number,
    left?: number
  },
  /** 縦横軸のスタイル */
  axisStyle?: any | null,
  /** 横軸ラベルのスタイル */
  labelXStyle?: any | null,
  /** 縦軸ラベルのスタイル **/
  labelYStyle?: any | null,
  /**
   *  縦軸ラベル(右)のスタイル
   * (orientation='right'の時に適用)
   */
  labelYRightStyle?: any | null,
  /** 凡例のスタイル */
  legendStyle?: any,
  /** 凡例位置 */
  legendPosition?: 'top' | 'bottom' | 'middle',
  /** ツールチップのスタイル */
  tooltipStyle?: any,
  /** 参照線のスタイル */
  referenceStyle?: any
}

/** 各グラフ単位のスタイル設定 */
export type GraphElementStyle = {
  /** グラフ色(配列順に適用) */
  colors?: string[],
  /** 縦軸の位置 */
  orientation?: 'left' | 'right'
}

/** 参考線の設定 */
export type GraphReferenceSetting = {
  value: number,
  label?: string,
  color?: string | number
}

/** グラフの描画設定 */
export type GraphSetting = {
  type: GraphType,
  labelY?: string,
  displayKey2Value: { [string]: string },
  domain: Array<string | number>,
  refereces?: GraphReferenceSetting[],
  style?: GraphElementStyle
}

/** 最新値情報 */
export type LatestInfo = {
  /** 最新値情報 */
  label: string,
  /** 表示文字色 */
  color?: string | number
}
