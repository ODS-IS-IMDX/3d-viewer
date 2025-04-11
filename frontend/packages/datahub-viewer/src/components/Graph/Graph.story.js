import React from 'react'
import { storiesOf } from '@storybook/react'
import Graph from './Graph'
import type { GraphDataType, GraphSetting, GraphStyle } from './type'
import { GraphColorList } from './Const'

/** グラフデータ */
export const data: GraphDataType = [
  {
    key0: '2023/5/1 0:00',
    key1: 5.107137463,
    key2: 8.446310669,
    key3: 3.945486417,
    key4: -9.325505602
  },
  {
    key0: '2023/5/2 0:00',
    key1: 6.94167047,
    key2: -3.00867073,
    key3: 5.266236258,
    key4: -3.137190824
  },
  {
    key0: '2023/5/3 0:00',
    key1: 3.699663632,
    key2: 2.054747332,
    key3: 5.47848768,
    key4: -3.631479151
  },
  {
    key0: '2023/5/4 0:00',
    key1: -0.593582088,
    key2: 1.76955866,
    key3: 7.219984668,
    key4: -7.753995662
  },
  {
    key0: '2023/5/5 0:00',
    key1: 2.84363913,
    key2: -6.419086159,
    key3: 0.164771802,
    key4: -8.711042903
  },
  {
    key0: '2023/5/6 0:00',
    key1: 6.222553805,
    key2: -5.348450219,
    key3: 5.317059122,
    key4: -9.572282312
  },
  {
    key0: '2023/5/7 0:00',
    key1: 5.163533842,
    key2: 5.531902187,
    key3: 8.432687696,
    key4: -0.307621791
  },
  {
    key0: '2023/5/8 0:00',
    key1: -1.319790849,
    key2: -7.211035446,
    key3: 4.027481003,
    key4: -5.631307182
  },
  {
    key0: '2023/5/9 0:00',
    key1: 9.031326989,
    key2: -3.972646637,
    key3: 5.833273452,
    key4: -3.347468148
  },
  {
    key0: '2023/5/10 0:00',
    key1: 0.635054288,
    key2: -4.688557813,
    key3: 0.251251007,
    key4: -6.616357186
  }
]

/** グラフ設定(折れ線グラフ) */
export const optionsLine: GraphSetting[] = [
  {
    type: 'LINE',
    displayKey2Value: {
      key1: 'A',
      key2: 'B',
      key3: 'C',
      key4: 'D'
    },
    labelY: '縦軸',
    refereces: [
      {
        value: 5,
        color: '#ff8000',
        label: '参照線'
      }
    ],
    style: {
      colors: GraphColorList
    }
  }
]
/** グラフ設定(棒グラフ) */
export const optionsBar: GraphSetting[] = [
  {
    type: 'BAR',
    displayKey2Value: {
      key1: 'A',
      key2: 'B',
      key3: 'C',
      key4: 'D'
    },
    labelY: '縦軸',
    refereces: [
      {
        value: 5,
        color: '#fff000',
        label: '参照線'
      }
    ],
    style: {
      colors: GraphColorList
    }
  }
]
/** グラフ設定(面グラフ) */
export const optionsArea: GraphSetting[] = [
  {
    type: 'AREA',
    displayKey2Value: {
      key1: 'A',
      key2: 'B',
      key3: 'C',
      key4: 'D'
    },
    labelY: '縦軸',
    refereces: [
      {
        value: 5,
        color: '#fff000',
        label: '参照線'
      }
    ],
    style: {
      colors: GraphColorList
    }
  }
]
/** グラフ設定(積み上げグラフ) */
export const optionsStack: GraphSetting[] = [
  {
    type: 'STACKED_BAR',
    displayKey2Value: {
      key1: 'A',
      key2: 'B',
      key3: 'C',
      key4: 'D'
    },
    labelY: '縦軸',
    refereces: [
      {
        value: 5,
        color: '#fff000',
        label: '参照線'
      }
    ],
    style: {
      colors: GraphColorList
    }
  }
]
/** グラフ設定(ごちゃ混ぜ) */
export const optionsComposed: GraphSetting[] = [
  {
    type: 'BAR',
    displayKey2Value: { key1: '棒' },
    labelY: '棒の縦軸',
    refereces: [
      {
        value: -1.5,
        color: GraphColorList[4],
        label: '棒の参照線(-1.5)'
      }
    ],
    style: {
      colors: [GraphColorList[0]],
      orientation: 'left'
    }
  },
  {
    type: 'AREA',
    displayKey2Value: { key2: '面' },
    labelY: '面の縦軸',
    refereces: [
      {
        value: 1.5,
        color: GraphColorList[5],
        label: '面の参照線(1.5)'
      }
    ],
    style: {
      colors: [GraphColorList[1]],
      orientation: 'left'
    }
  },
  {
    type: 'LINE',
    displayKey2Value: { key3: '折れ線1', key4: '折れ線2' },
    labelY: '折れ線の縦軸',
    refereces: [
      {
        value: 5,
        color: GraphColorList[6],
        label: '折れ線の参照線(5)'
      }
    ],
    style: {
      colors: GraphColorList.slice(2, 4),
      orientation: 'right'
    }
  }
]

export const style: GraphStyle = {
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  axisStyle: { fontSize: 15 },
  labelXStyle: {
    offset: 0,
    position: 'bottom',
    style: { fontSize: 15 }
  },
  labelYStyle: {
    offset: -20,
    angle: -90,
    position: 'center',
    style: {
      textAnchor: 'middle',
      fontSize: 15
    }
  },
  legendStyle: { top: 10, fontSize: 15 },
  legendPosition: 'top',
  tooltipStyle: { fontSize: 15 },
  referenceStyle: {
    fontSize: 15
  }
}

storiesOf('Graph', module)
  .addParameters({ component: Graph })
  .add('LINE', () => (
    <Graph
      data={data}
      options={optionsLine}
      keyX='key0'
      labelX='横軸'
      isTooltip
      style={style}
    />
  ))
  .add('BAR', () => (
    <Graph
      data={data}
      options={optionsBar}
      keyX='key0'
      labelX='横軸'
      isTooltip
      style={style}
    />
  ))
  .add('AREA', () => (
    <Graph
      data={data}
      options={optionsArea}
      keyX='key0'
      labelX='横軸'
      isTooltip
      style={style}
    />
  ))
  .add('STACKED_BAR', () => (
    <Graph
      data={data}
      options={optionsStack}
      keyX='key0'
      labelX='横軸'
      isTooltip
      style={style}
    />
  ))
  .add('Composed', () => (
    <Graph
      data={data}
      options={optionsComposed}
      keyX='key0'
      labelX='横軸'
      isTooltip
      style={style}
    />
  ))
