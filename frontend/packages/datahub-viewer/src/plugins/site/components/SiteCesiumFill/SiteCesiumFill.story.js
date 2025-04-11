import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withNamespaces } from 'react-i18next'
import { Box, Flex } from '@ehv/datahub-components'
import {
  mockSiteStore,
  site
} from 'plugins/site/components/__storybook__/mockData'
import { SiteViewer as SiteViewerComponent } from '../../../site/components/SiteViewer/SiteViewer'
import { SiteCesiumFill } from './SiteCesiumFill'

const SiteViewer = withNamespaces('site')(SiteViewerComponent)

storiesOf('Site/SiteCesiumFill', module)
  .addDecorator(story => <Provider store={mockSiteStore}>{story()}</Provider>)
  .addParameters({ component: SiteCesiumFill })
  .add('default', () => (
    <Flex height='100vh'>
      <Box flex={1} style={{ position: 'relative', height: '100%' }}>
        <SiteViewer
          site={site}
          setViewer={action('setViewer')}
          unsetViewer={action('unsetViewer')}
          notifyInit={action('notifyInit')}
        />
        <SiteCesiumFill>
          <div>SiteCesiumFill</div>
        </SiteCesiumFill>
      </Box>
    </Flex>
  ))
