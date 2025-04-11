// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { memo, useState } from 'react'
import styled from 'styled-components'

import type { FC, ReactElement } from 'react'

const StyledTable = styled.table`
  border-collapse: collapse;
  margin: 0 auto;
  padding: 0;
  white-space: nowrap;

  tr {
    background-color: #fff;
    border-bottom: 2px solid #fff;
  }
  tr:nth-child(even) {
    background-color: #eee;
  }
  th,
  td {
    padding: 4px 12px;
  }
  thead {
    th {
      font-size: 14px;
      padding: 14px;
      cursor: pointer;
      background-color: #16abe3;
      color: #fff;
      &:hover {
        background-color: #1672ae;
      }
    }
  }
  tbody {
    td {
      text-align: left;
      font-size: 12px;
    }
  }
`

const SORT_MARK = {
  // 黒三角 [▲]
  ASC: '\u25B2',
  // 逆黒三角 [▼]
  DESC: '\u25BC'
}

type SortableTableProps = {|
  headerNameList: Array<string>,
  dataList: Array<{ [key: string]: string | number }>
|}
const Table: FC<SortableTableProps> = (
  props: SortableTableProps
): ReactElement => {
  const { headerNameList, dataList } = props
  const [sortColumnIndex, setSortColumnIndex] = useState(-1)
  /** order => 昇順:1, 降順:-1 */
  const [order, setOrder] = useState(1)

  const sortHeaderName =
    sortColumnIndex >= 0 ? headerNameList[sortColumnIndex] : null
  const sortedDataList = sortHeaderName
    ? [...dataList].sort((dataA, dataB) => {
        const dataAValue = dataA[sortHeaderName] || ''
        const dataBValue = dataB[sortHeaderName] || ''
        // $FlowFixMe[invalid-compare]: 文字列の比較もするため、エラーを無視
        if (dataAValue < dataBValue) {
          return -order
        }
        // $FlowFixMe[invalid-compare]: 文字列の比較もするため、エラーを無視
        if (dataAValue > dataBValue) {
          return order
        }
        return 0
      })
    : dataList

  return (
    <StyledTable>
      <thead>
        <tr>
          {headerNameList.map((headerName, index) => (
            <th
              key={index}
              onClick={() => {
                if (sortColumnIndex === index) {
                  // 同じカラムのヘッダをクリックする場合、昇順=>降順=>並び替えなし=>...の順で切り替え
                  order < 0 && setSortColumnIndex(-1)
                  setOrder(-order)
                } else {
                  setSortColumnIndex(index)
                  setOrder(1)
                }
              }}
            >
              {sortColumnIndex === index
                ? order === 1
                  ? headerName + SORT_MARK.ASC
                  : headerName + SORT_MARK.DESC
                : headerName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedDataList.map((data, dataIndex) => (
          <tr key={dataIndex}>
            {headerNameList.map((headerName, headerIndex) => (
              <td key={headerIndex}>{data[headerName] || ''}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </StyledTable>
  )
}

export const SortableTable: FC<SortableTableProps> = memo<SortableTableProps>(
  Table
)
