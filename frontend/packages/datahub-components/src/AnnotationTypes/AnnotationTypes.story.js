import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { AnnotationTypes } from './AnnotationTypes'

storiesOf('AnnotationTypes', module)
  .addParameters({ component: AnnotationTypes })
  .add('point', () => (
    <AnnotationTypes annotationType='point' onClick={arg => action(arg)} />
  ))
  .add('line', () => (
    <AnnotationTypes annotationType='line' onClick={arg => action(arg)} />
  ))
  .add('arrow', () => (
    <AnnotationTypes annotationType='arrow' onClick={arg => action(arg)} />
  ))
  .add('polygon', () => (
    <AnnotationTypes annotationType='polygon' onClick={arg => action(arg)} />
  ))
  .add('label', () => (
    <AnnotationTypes annotationType='label' onClick={arg => action(arg)} />
  ))
