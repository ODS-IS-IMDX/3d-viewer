// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import { FormInput } from '@ehv/datahub-components'

export const StyledDatetime = styled(Datetime)`
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
  }

  .rdtPicker td {
    vertical-align: middle;
  }

  .rdtPicker td.rdtActive,
  .rdtPicker td.rdtActive:hover {
    border-radius: 50px;
    background-color: #16abe3;
    text-shadow: none;
  }

  .rdtSwitch {
    vertical-align: middle;
  }
`

export const TdWrapper = styled.td`
  border: solid 1px #16abe3;
`

type MarkedDateTimePickerProps = {
  onChange: String => void,
  value: Date,
  existDevicesDate: any,
  startCollectHistoricalCalendarData: any,
  deviceId: any,
  currentCalendarDate: any,
  setHistoricalCalendarCurrentData: any
}

const MarkedDateTimePicker = ({
  onChange,
  value,
  existDevicesDate,
  startCollectHistoricalCalendarData,
  deviceId,
  currentCalendarDate,
  setHistoricalCalendarCurrentData
}: MarkedDateTimePickerProps) => {
  const open = (openCalendar, value) => {
    const startDate = new Date(value.toString())
    const year = startDate.getFullYear()
    // 月は0~11で表現されるため調整（https://www.npmjs.com/package/react-datetime）
    const month = startDate.getMonth() + 1

    if (currentCalendarDate === null) {
      setHistoricalCalendarCurrentData({ year, month })
      const lastDay = new Date(year, month, 0).getDate()
      startCollectHistoricalCalendarData(
        deviceId,
        format(year.toString(), month.toString()) + '-01',
        format(year.toString(), month.toString()) + '-' + lastDay
      )
    }
    openCalendar()
  }

  const MarkedDateTimePickerInput = ({ className, ...props }, openCalendar) => {
    return (
      <FormInput
        {...props}
        onClick={() => {
          open(openCalendar, props.value)
        }}
      />
    )
  }

  // 日にちのレンダー処理
  // 履歴データが存在する日にちの場合、印を付ける
  const renderDay = (props, currentDate, selectedDate) => {
    const existDate = existDevicesDate

    if (currentDate !== undefined || null) {
      currentDate = new Date(currentDate)
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth() + 1
      const currentDay = currentDate.getDate()

      let isExist = false
      existDate.forEach(exDate => {
        if (exDate.year !== currentYear) {
          return
        }
        if (exDate.month !== currentMonth) {
          return
        }
        if (exDate.day !== currentDay) {
          return
        }
        isExist = true
      })

      if (isExist) {
        return <TdWrapper {...props}>{currentDay}</TdWrapper>
      } else {
        return <td {...props}>{currentDay}</td>
      }
    }
  }

  // 月移動によって表示が切り替わった際に表示データを更新する処理
  const executeCollectByNextStep = (month, year) => {
    if (year === 'months') {
      let nextYear = currentCalendarDate.year
      let nextMonth = currentCalendarDate.month + month
      if (nextMonth === 0) {
        nextYear = currentCalendarDate.year + month
        nextMonth = 12
      }
      if (nextMonth === 13) {
        nextYear = currentCalendarDate.year + month
        nextMonth = 1
      }
      setHistoricalCalendarCurrentData({ year: nextYear, month: nextMonth })

      const lastDay = new Date(nextYear, nextMonth, 0).getDate()
      startCollectHistoricalCalendarData(
        deviceId,
        format(nextYear.toString(), nextMonth.toString()) + '-01',
        format(nextYear.toString(), nextMonth.toString()) + '-' + lastDay
      )
    }
  }

  // 0埋めなど行い、フォーマットを揃える
  const format = (year, month) => {
    let formatDate = year + '-'
    if (month !== '10' && month !== '11' && month !== '12') {
      month = '0' + month
    }
    return formatDate + month
  }

  // スケール選択によって表示が切り替わった際に表示データを更新する処理
  const executeCollectBySelect = selectedDate => {
    const selectedYear = selectedDate.getFullYear()
    const selectedMonth = selectedDate.getMonth() + 1
    setHistoricalCalendarCurrentData({
      year: selectedYear,
      month: selectedMonth
    })
    const lastDay = new Date(selectedYear, selectedMonth, 0).getDate()
    startCollectHistoricalCalendarData(
      deviceId,
      format(selectedYear.toString(), selectedMonth.toString()) + '-01',
      format(selectedYear.toString(), selectedMonth.toString()) + '-' + lastDay
    )
  }

  return (
    <StyledDatetime
      onBeforeNavigate={(nextView, currentView, viewDate) => {
        if (nextView === 'days') {
          executeCollectBySelect(viewDate._d)
        }
        return nextView
      }}
      onNavigateForward={(month, year) => {
        executeCollectByNextStep(month, year)
      }}
      onNavigateBack={(month, year) => {
        executeCollectByNextStep(-month, year)
      }}
      renderDay={renderDay}
      value={value}
      onChange={value => {
        if (typeof value === 'object') {
          onChange(value.toDate())
        }
      }}
      renderInput={MarkedDateTimePickerInput}
      dateFormat={'YYYY/MM/DD'}
    />
  )
}

export default MarkedDateTimePicker
