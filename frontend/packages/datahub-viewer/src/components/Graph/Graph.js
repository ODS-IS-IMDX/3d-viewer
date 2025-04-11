// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import {
  ResponsiveContainer,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ComposedChart,
  Area,
  Tooltip,
  ReferenceLine
  // $FlowFixMe
} from 'recharts'
import type { GraphType, GraphSetting, GraphStyle, GraphDataType } from './type'

export type GraphElementProps = {
  /** グラフ種別  */
  type: GraphType,
  /** 参照するデータのキー */
  dataKey: string,
  /** キーの表示名 */
  name?: string,
  /** 描画色 */
  color?: string,
  /** 2軸用ID */
  yAxisId: string
}

/** グラフ要素 */
const GraphElement = (props: GraphElementProps) => {
  const { type, dataKey, name, color, yAxisId } = props

  return type === 'LINE' ? (
    // 折れ線グラフ
    <Line
      type='linear'
      dataKey={dataKey}
      name={name}
      stroke={color}
      activeDot={{ r: 5 }}
      yAxisId={yAxisId}
    />
  ) : type === 'AREA' ? (
    // 面グラフ
    <Area
      type='monotone'
      dataKey={dataKey}
      name={name}
      fill={color}
      stroke={color}
      fillOpacity={0.3}
      activeDot={{ r: 5 }}
      yAxisId={yAxisId}
    />
  ) : type === 'BAR' ? (
    // 棒グラフ
    <Bar dataKey={dataKey} name={name} fill={color} yAxisId={yAxisId} />
  ) : type === 'STACKED_BAR' ? (
    // 積み上げグラフ
    <Bar
      dataKey={dataKey}
      name={name}
      fill={color}
      stackId={`stack_${yAxisId}`} // 同じstackId同士が積み上がる
      yAxisId={yAxisId}
    />
  ) : (
    <></>
  )
}

export type GraphProps = {
  /** グラフデータ */
  data: GraphDataType,
  /** 描画設定 */
  options: GraphSetting[],
  /** 横軸のキー */
  keyX: string,
  /** 横軸のラベル */
  labelX?: string,
  /** グラフスタイル設定 */
  style?: GraphStyle,
  /** ツールチップ表示 */
  isTooltip?: boolean
}

/** グラフコンポーネント  */
const Graph = (props: GraphProps): React.Element<any> => {
  const { data, options, keyX, labelX, style, isTooltip = true } = props

  return (
    <ResponsiveContainer width={style ? style.width : undefined} aspect={2}>
      <ComposedChart data={data} margin={style ? style.margin : undefined}>
        {/* 共通設定 */}
        <CartesianGrid strokeDasharray={'3 3'} />
        <XAxis
          dataKey={keyX}
          name={
            options.length > 0 ? options[0].displayKey2Value[keyX] : undefined
          } // 先頭の描画設定から横軸の表示について取得
          label={style ? { ...style.labelXStyle, value: labelX } : labelX}
          style={style ? style.axisStyle : undefined}
        />
        <Legend
          iconSize={6}
          verticalAlign={style ? style.legendPosition : undefined}
          align={'center'}
          wrapperStyle={style ? style.legendStyle : undefined}
        />
        {isTooltip && (
          <Tooltip contentStyle={style ? style.tooltipStyle : undefined} />
        )}
        {/* グラフごと(縦軸ごと)の設定 */}
        {options.map((option, i) => {
          const axisId = `axis${i}` // 縦軸と紐づけるためのID
          const { domain } = option
          const labelYStyle = style
            ? option.style && option.style.orientation === 'right'
              ? style.labelYRightStyle || style.labelYStyle
              : style.labelYStyle
            : undefined
          return (
            <React.Fragment key={i}>
              {/*  縦軸 */}
              <YAxis
                label={
                  labelYStyle
                    ? { ...labelYStyle, value: option.labelY }
                    : option.labelY
                }
                orientation={
                  option.style ? option.style.orientation : undefined
                }
                style={style ? style.axisStyle : undefined}
                yAxisId={axisId}
                domain={domain}
                allowDataOverflow
              />
              {/* 上記の縦軸に紐づく各グラフ */}
              {Object.keys(option.displayKey2Value).map((key, ii) => {
                const color =
                  option.style && option.style.colors
                    ? option.style.colors[ii]
                    : undefined
                return (
                  <React.Fragment key={`${i}_${ii}`}>
                    {GraphElement({
                      type: option.type,
                      dataKey: key,
                      name: option.displayKey2Value[key],
                      color,
                      yAxisId: axisId
                    })}
                  </React.Fragment>
                )
              })}
              {/* 閾値線 */}
              {option.refereces &&
                option.refereces.map((reference, ii) => (
                  <ReferenceLine
                    key={`reference${i}_${ii}`}
                    y={reference.value}
                    label={
                      style
                        ? { ...style.referenceStyle, value: reference.label }
                        : reference.label
                    }
                    stroke={reference.color}
                    isFront
                    yAxisId={axisId}
                  />
                ))}
            </React.Fragment>
          )
        })}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default Graph
