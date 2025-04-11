import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'
import { Box, Flex } from '@ehv/datahub-components'
import AssetEditDrawer from '.'
import { mockStore } from 'plugins/asset/components/__storybook__/mockData'
import { action } from '@storybook/addon-actions'
import SiteDrawerSlot from 'plugins/site/components/SiteDrawerSlot'

storiesOf('asset/Core/AssetEditDrawer', module)
  .addParameters({ component: AssetEditDrawer })
  .addDecorator(story => (
    <Provider store={mockStore}>
      <Flex height='100vh'>
        <Box
          flex={1}
          style={{ position: 'relative', height: '100%', overflow: 'hidden' }}
        >
          <SiteDrawerSlot />
        </Box>
        {story()}
      </Flex>
    </Provider>
  ))
  .add('Default', () => (
    <AssetEditDrawer
      isDrawerOpen
      isDrawerButtonEnabled
      updateEditingData={action('updateEditingData')}
      editAsset={action('editAsset')}
      cancelEditAsset={action('cancelEditAsset')}
      disabledDrawerButton={action('disabledDrawerButton')}
    />
  ))
