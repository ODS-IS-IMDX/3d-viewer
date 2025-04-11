// Copyright (c) 2025 NTT InfraNet
// @flow
import type { GraphStyle } from './type'

/** グラフ描画色一覧 */
export const GraphColorList = [
  '#FF0000',
  '#0000FF',
  '#000000',
  '#008000',
  '#800080',
  '#FFA500',
  '#2fff00',
  '#FF1493',
  '#5800d3',
  '#9400D3',
  '#40E0D0',
  '#A52A2A',
  '#90EE90',
  '#FFD700',
  '#5F9EA0'
]

/** グラフの標準スタイル */
export const DefaultGraphStyle: GraphStyle = {
  margin: { top: 20, bottom: 20, left: 0, right: 0 },
  axisStyle: { fontSize: 10 },
  labelXStyle: {
    position: 'bottom',
    style: { fontSize: 12 }
  },
  labelYStyle: {
    angle: -90,
    dx: -10,
    position: 'center',
    style: {
      textAnchor: 'middle',
      fontSize: 12
    }
  },
  labelYRightStyle: {
    angle: -90,
    dx: 10,
    position: 'center',
    style: {
      textAnchor: 'middle',
      fontSize: 12
    }
  },
  legendStyle: {
    top: 10,
    fontSize: 10
  },
  legendPosition: 'top',
  tooltipStyle: { fontSize: 12 },
  referenceStyle: {
    fontSize: 12
  }
}
