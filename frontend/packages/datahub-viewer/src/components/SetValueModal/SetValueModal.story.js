import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import SetValueModal from './SetValueModal'

storiesOf('SetValueModal', module)
  .addParameters({ component: SetValueModal })
  .add('default', () => (
    <SetValueModal
      t={param => action(`t param=${param}`)}
      type='type'
      value={30}
      step={50}
      title='TITLE'
      onChange={param => action(`onChange param=${param}`)}
      onClose={action('onClose')}
    />
  ))
