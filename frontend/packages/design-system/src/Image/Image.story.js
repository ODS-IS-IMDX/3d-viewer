import React from 'react'
import { storiesOf } from '@storybook/react'

import { Image } from './Image'

storiesOf('Image', module)
  .addParameters({ component: Image })
  .add('default', () => (
    <Image src='https://github.githubassets.com/favicons/favicon.svg' />
  ))
