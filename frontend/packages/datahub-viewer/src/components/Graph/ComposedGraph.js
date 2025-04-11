// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
// $FlowFixMe
import styled from 'styled-components'
// $FlowFixMe
import { Text, Flex, Box } from '@ehv/datahub-components'
import type { LatestInfo } from './type'
import Graph from './Graph'
import type { GraphProps } from './Graph'

const FlexWrapper = styled(Flex)`
  flex-wrap: wrap;
`

const LatestTextWrapper = styled(Text)`
  padding: 5px 15px;
  text-decoration: underline;
  font-size: 14px;
`

const LatestText = styled(Text)`
  font-size: 14px;
`

const GraphNameText = styled(Text)`
  margin: 10px 0 0;
  font-size: 14px;
`

/** Graphコンポーネントのprops＋独自引数 */
export type ComposedGraphProps = GraphProps & {
  /** グラフ名 */
  name?: string,
  /** 最新値情報 */
  latest?: {
    /** 最新値のタイトル */
    title?: string,
    /** 値 */
    values?: LatestInfo[]
  },
  width?: string | number,
  height?: string | number
}

/**
 * 拡張版グラフコンポーネント
 * グラフ名と最新値の表示を追加
 */
const ComposedGraph = (props: ComposedGraphProps): React.Element<any> => {
  const {
    data,
    options,
    keyX,
    labelX,
    style,
    isTooltip,
    name,
    latest,
    width = '100%',
    height = '100%'
  } = props

  return (
    <Box width={width} height={height}>
      {latest && latest.values && latest.values.length > 0 && (
        <>
          <LatestText>{latest.title || ''}</LatestText>
          <FlexWrapper>
            {latest.values.map((value, index) => (
              <LatestTextWrapper key={index} color={value.color}>
                {value.label}
              </LatestTextWrapper>
            ))}
          </FlexWrapper>
        </>
      )}
      <GraphNameText>{name}</GraphNameText>
      <Graph
        data={data}
        options={options}
        keyX={keyX}
        labelX={labelX}
        style={style}
        isTooltip={isTooltip}
      />
    </Box>
  )
}

export default ComposedGraph
