import React from 'react'
import { storiesOf } from '@storybook/react'
import ComposedGraph from './ComposedGraph'
import type { LatestInfo } from './type'
import { GraphColorList } from './Const'
import { data, optionsComposed, style } from './Graph.story'

/** グラフデータのキーと表示ラベル */
const key2Value = optionsComposed
  .map(option => option.displayKey2Value)
  .reduce((previous, current) => ({ ...previous, ...current }))
/** 最新値情報(データの最後尾) */
const latestInfos: LatestInfo[] = Object.keys(key2Value).map((key, i) => ({
  label: `${key2Value[key]}：${data[data.length - 1][key]}`,
  color: GraphColorList[i]
}))

storiesOf('ComposedGraph', module)
  .addParameters({ component: ComposedGraph })
  .add('Default', () => (
    <ComposedGraph
      data={data}
      options={optionsComposed}
      keyX='key0'
      labelX='横軸'
      isTooltip
      style={style}
      name='グラフ名'
      latest={{
        title: '最新値',
        values: latestInfos
      }}
    />
  ))
