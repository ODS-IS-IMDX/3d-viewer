// Copyright (c) 2025 NTT InfraNet
// @flow
import { PureComponent } from 'react'
import _pick from 'lodash/pick'

const FORMAT_OPTIONS = [
  'weekday',
  'era',
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second',
  'timeZoneName',
  'timeZone',
  'hour12',
  'hourCycle',
  'formatMatcher',
  'localeMatcher'
]

export const DATE_FORMAT_OPTIONS = {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
}

type FormattedDateProps = {
  weekday?: 'narrow' | 'short' | 'long',
  era?: 'narrow' | 'short' | 'long',
  year?: 'numeric' | '2-digit',
  month?: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long',
  day?: 'numeric' | '2-digit',
  hour?: 'numeric' | '2-digit',
  minute?: 'numeric' | '2-digit',
  second?: 'numeric' | '2-digit',
  timeZoneName?: 'short' | 'long',
  timeZone?: string,
  hour12?: boolean,
  hourCycle?: 'h11' | 'h12' | 'h23' | 'h24',
  formatMatcher?: 'basic' | 'best fit',
  localeMatcher?: 'lookup' | 'best fit',
  value: Date | string
}

export class FormattedDate extends PureComponent<FormattedDateProps> {
  formatter = this.buildFormatter()

  buildFormatter () {
    const {
      i18n: { language = 'default' }
    } = this.props

    const formatOptions = _pick(this.props, FORMAT_OPTIONS)

    return Intl.DateTimeFormat(language, formatOptions)
  }

  componentDidUpdate (oldProps) {
    if (oldProps.i18n.language !== this.props.i18n.language) {
      this.formatter = this.buildFormatter()
    }
  }

  render () {
    const { value } = this.props

    if (typeof value === 'string') {
      return this.formatter.format(Date.parse(value))
    }
    return this.formatter.format(value)
  }
}
