// Copyright (c) 2025 NTT InfraNet
// @flow
import { format } from 'date-fns'

export const generateLocalizedFullName = (
  firstName: string,
  lastName: string,
  locale: string
): string => {
  if (locale === 'ja') {
    return lastName + ' ' + firstName
  } else {
    return firstName + ' ' + lastName
  }
}

/**
 * 時刻の表示フォーマットを変換する
 * new Date()にて、OSで設定されたタイムゾーンに設定される
 *
 * @param date ISO 8601形式 例：2020-09-14T05:47:44.746Z
 * @param dateFormat https://date-fns.org/v2.16.1/docs/format
 * @return dateFormatted  フォーマットされた日付の文字列
 */
export const generateLocalizedDate = (
  date: string,
  dateFormat: string
): string => {
  if (!date || !dateFormat) {
    return ''
  }

  const dateFormatted = format(new Date(date), dateFormat)
  return dateFormatted
}
