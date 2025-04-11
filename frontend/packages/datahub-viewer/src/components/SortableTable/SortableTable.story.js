// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'

import { SortableTable } from './SortableTable'

const headerNameList = ['ID', 'テキスト', '数字', '英字']
const dataList = [
  { ID: '003', テキスト: 'アアア', 数字: 5, 英字: 'b' },
  { ID: '001', テキスト: 'イイイ', 数字: 1, 英字: 'c' },
  { ID: '002', テキスト: 'ウウウ', 数字: 4, 英字: 'a' },
  { ID: '005', テキスト: 'エエエ', 数字: 3, 英字: 'd' },
  { ID: '004', テキスト: 'オオオ', 数字: 2, 英字: 'e', dummy: '123456' }
]

storiesOf('SortableTable', module)
  .addParameters({ component: SortableTable })
  .add('default', () => (
    <SortableTable headerNameList={headerNameList} dataList={dataList} />
  ))
