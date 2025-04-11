// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { type Node } from 'react'
import styled, { css, type ThemedStyledFunction } from 'styled-components'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import { Flex, FormInput } from '@ehv/datahub-components'

export const StyledDatetime: ThemedStyledFunction = styled(Datetime)`
  input.form-control {
    border: none;
    border-bottom: 1px solid #000;
    height: 40px;
    padding-left: 20px;
    background-color: #f8f8f8;
    color: #3a4248;
  }

  .rdtPicker {
    padding: 20px;

    ${({ pickerPosition }) => {
      if (!pickerPosition) {
        return
      }
      const { top, right, bottom, left } = pickerPosition
      let cssString = ''
      if (top !== undefined) {
        cssString += isNaN(top) ? ` top: ${top};` : ` top: ${top}px;`
      }
      if (right !== undefined) {
        cssString += isNaN(right) ? ` right: ${right};` : ` right: ${right}px;`
      }
      if (bottom !== undefined) {
        cssString += isNaN(bottom)
          ? ` bottom: ${bottom};`
          : ` bottom: ${bottom}px;`
      }
      if (left !== undefined) {
        cssString += isNaN(left) ? ` left: ${left};` : ` left: ${left}px;`
      }
      return css`
        ${cssString}
      `
    }}
  }

  .rdtPicker td {
    vertical-align: middle;
  }

  .rdtPicker td.rdtActive,
  .rdtPicker td.rdtActive:hover {
    border-radius: 100px;
    background-color: #16abe3;
    text-shadow: none;
  }

  .rdtSwitch {
    vertical-align: middle;
  }
`

export type DateTimePickerProps = {
  onChange: Date => void,
  onOpen?: String => void,
  onClose?: String => void,
  customDataTimeInput?: (param: any) => Node | Node,
  clearDataTimeButton?: (param: any) => Node | Node,
  pickerPosition?: {
    top?: number | string,
    right?: number | string,
    bottom?: number | string,
    left?: number | string
  },
  value?: Date,
  /* dateFormatとtimeFormatの使い方
   *   - stringの場合(例えば'YYYY/MM/DD')は日付時間表示フォーマットの設定
   *   - booleanの場合は
   *     - true: デフォルトフォーマットを使用して表示する
   *     - false: 非表示
   *   - nullの場合は非表示
   *   - undefinedの場合はデフォルトフォーマットを使用して表示する */
  dateFormat?: string | boolean | null,
  timeFormat?: string | boolean | null
}

const DateTimePicker = ({
  customDataTimeInput,
  clearDataTimeButton,
  pickerPosition,
  onChange,
  onOpen,
  onClose,
  value,
  dateFormat,
  timeFormat
}: DateTimePickerProps) => {
  const DateTimePickerInput = ({ className, ...props }, openCalendar) => (
    <Flex>
      {customDataTimeInput ? (
        typeof customDataTimeInput === 'function' ? (
          customDataTimeInput({ openCalendar, props })
        ) : (
          <React.Fragment {...props} onClick={openCalendar}>
            {customDataTimeInput}
          </React.Fragment>
        )
      ) : (
        <FormInput {...props} onClick={openCalendar} />
      )}
      {clearDataTimeButton &&
        (typeof clearDataTimeButton === 'function' ? (
          clearDataTimeButton(props.onChange)
        ) : (
          <React.Fragment
            onClick={() => props.onChange({ target: { value: '' } })}
          >
            {clearDataTimeButton}
          </React.Fragment>
        ))}
    </Flex>
  )

  return (
    <StyledDatetime
      value={value}
      onChange={value => {
        if (typeof value === 'object') {
          onChange(value.toDate())
        }
      }}
      renderInput={DateTimePickerInput}
      dateFormat={dateFormat === undefined ? 'YYYY/MM/DD' : dateFormat}
      timeFormat={timeFormat}
      onOpen={onOpen}
      onClose={onClose}
      pickerPosition={pickerPosition}
    />
  )
}

export default DateTimePicker
