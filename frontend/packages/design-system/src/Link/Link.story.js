import React from 'react'
import { storiesOf } from '@storybook/react'

import { Link } from './Link'

storiesOf('Link', module)
  .addParameters({ component: Link })
  .add('<a> (default)', () => (
    <Link href='https://example.com'>https://example.com</Link>
  ))
  .add('<div>', () => <Link as='div'>https://example.com</Link>)
