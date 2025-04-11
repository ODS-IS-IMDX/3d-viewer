// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Box, Flex, Text } from '@ehv/datahub-components'
import { COLOR_LIST } from './Const'

export type ColorSelectorOptionsType = {
  label: React.Element<any>,
  value: string
}

const BoxWrapper: any = styled(Box)`
  width: 20px;
  height: 20px;
  ${({ color }) => `
    background-color: ${color};
    border-color: black;
    border-width: thin;
    border-style: solid;
  `}
`
const TextWrapper = styled(Text)`
  margin-left: 16px;
`

/**
 * カラーセレクターオプションリスト
 */
export const ColorSelectorOptions: Array<ColorSelectorOptionsType> = t =>
  COLOR_LIST.map(({ key, value }: { key: string, value: string }) => {
    const options: ColorSelectorOptionsType = {
      // カラーアイコンをラベルの位置に表示
      label: (
        <Flex alignItems='center'>
          <BoxWrapper color={value} />
          <TextWrapper>{t(`colors.${key}`)}</TextWrapper>
        </Flex>
      ),
      value: value
    }
    return options
  })
