import React from 'react'
import { storiesOf } from '@storybook/react'
import { toast } from 'react-toastify'

import { NotificationContainer } from './NotificationContainer'

storiesOf('components/NotificationContainer', module)
  .addParameters({ component: NotificationContainer })
  .add('Default', () => (
    <>
      <NotificationContainer />
      <button onClick={notify}>Notify</button>
    </>
  ))

const notify = () => toast('NotificationContainer')
