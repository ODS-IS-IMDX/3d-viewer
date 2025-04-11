import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { Compass } from './Compass'
import { CompassInnerTargetRing } from './CompassInnerTarget'
import { CompassOuterRing } from './CompassOuterRing'
import { HomeButton } from './HomeButton'
import { ZoomInOut } from './ZoomInOut'
import { ZoomIn } from './ZoomIn'
import { ZoomOut } from './ZoomOut'
import { CurrentLocationButton } from './CurrentLocationButton'
import { MobileMapNavigator } from './MobileMapNavigator'
import { MapNavigator } from './MapNavigator'

const homeButtonClickedAction = action('home button clicked')
const zoomInClickedAction = action('zoom in clicked')
const zoomOutClickedAction = action('zoom out clicked')
const currentLocationButtonClickedAction = action(
  'current location button clicked'
)
const resetViewClickedAction = action('reset view clicked')
const rotate = action('rotate')
const tiltStart = action('tiltStart')
const tiltMove = action('tiltMove')
const tiltEnd = action('tiltEnd')

storiesOf('MapNavigator', module)
  .addParameters({
    component: MapNavigator,
    subcomponents: {
      Compass,
      CompassInnerTargetRing,
      CompassOuterRing,
      HomeButton,
      ZoomInOut,
      ZoomIn,
      ZoomOut,
      MobileMapNavigator
    }
  })
  .addDecorator(story => (
    <div
      style={{
        backgroundColor: 'grey',
        height: '100vh',
        width: '100vw',
        padding: '20px'
      }}
    >
      {story()}
    </div>
  ))
  .add('HomeButton', () => <HomeButton onClick={homeButtonClickedAction} />)
  .add('ZoomInOut', () => (
    <ZoomInOut
      onZoomInClick={zoomInClickedAction}
      onZoomOutClick={zoomOutClickedAction}
    />
  ))
  .add('ZoomIn', () => <ZoomIn onClick={zoomInClickedAction} />)
  .add('ZoomOut', () => <ZoomOut onClick={zoomOutClickedAction} />)
  .add('CurrentLocation', () => (
    <CurrentLocationButton onClick={currentLocationButtonClickedAction} />
  ))
  .add('MapNavigator', () => (
    <MapNavigator
      onHomeButtonClick={homeButtonClickedAction}
      onZoomInClick={zoomInClickedAction}
      onZoomOutClick={zoomOutClickedAction}
      onCurrentLocationClick={currentLocationButtonClickedAction}
      onResetViewDoubleClick={resetViewClickedAction}
      onRotate={rotate}
      onTiltStart={tiltStart}
      onTiltMove={tiltMove}
      onTiltEnd={tiltEnd}
    />
  ))
  .add('MobileMapNavigator', () => (
    <MobileMapNavigator onClick={action('mobile navigator clicked')} />
  ))
