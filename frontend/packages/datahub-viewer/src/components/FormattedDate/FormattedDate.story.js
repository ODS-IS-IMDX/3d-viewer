import React from 'react'
import { storiesOf } from '@storybook/react'

import { FormattedDate } from './FormattedDate'

const i18n = {
  language: 'default'
}

storiesOf('FormattedDate', module)
  .addParameters({ component: FormattedDate })
  .add('default', () => (
    <FormattedDate
      i18n={i18n}
      value={new Date(Date.UTC(2020, 11, 20, 3, 23, 16, 738))}
      language='en-US'
    />
  ))
  .add('weekday,era=narrow, numeric', () => (
    <FormattedDate
      weekday='narrow'
      era='narrow'
      year='numeric'
      month='numeric'
      day='numeric'
      hour='numeric'
      minute='numeric'
      second='numeric'
      timeZonaName='short'
      timeZone='jst'
      hour12
      hourCycle='h11'
      formatMatcher='basic'
      localMatcher='lookup'
      i18n={i18n}
      value={new Date(Date.UTC(2020, 11, 20, 3, 23, 16, 738))}
      language='en-US'
    />
  ))
  .add('weekly,era=short, 2digit', () => (
    <FormattedDate
      weekday='short'
      era='short'
      year='2-digit'
      month='2-digit'
      day='2-digit'
      hour='2-digit'
      minute='2-digit'
      second='2-digit'
      timeZonaName='long'
      timeZone='jst'
      hour12={false}
      hourCycle='h12'
      formatMatcher='best fit'
      localMatcher='best fit'
      i18n={i18n}
      value={new Date(Date.UTC(2020, 11, 20, 3, 23, 16, 738))}
      language='ja_JP'
    />
  ))
  .add('weekday,long=long, month=narrow', () => (
    <FormattedDate
      weekday='long'
      era='long'
      month='narrow'
      timeZone='jst'
      hourCycle='h23'
      i18n={i18n}
      value={new Date(Date.UTC(2020, 11, 20, 3, 23, 16, 738))}
      language='ja_JP'
    />
  ))
  .add('month=short', () => (
    <FormattedDate
      month='short'
      timeZone='jst'
      hourCycle='h24'
      i18n={i18n}
      value={new Date(Date.UTC(2020, 11, 20, 3, 23, 16, 738))}
      language='ja_JP'
    />
  ))
