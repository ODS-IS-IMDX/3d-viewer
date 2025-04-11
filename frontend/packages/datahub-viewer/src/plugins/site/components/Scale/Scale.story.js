import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Scale from './Scale'
import {
  Viewer,
  CameraContext,
  CanvasContext,
  SceneContext
} from '../../../../react-cesium'

storiesOf('Site/Scale', module)
  .addParameters({ component: Scale })
  .add('default', () => <Scale barWidth={100} distanceLabel='SCALE' />)
  .add('context', () => (
    <Viewer
      style={{ position: 'relative', height: '100%' }}
      onMount={action('onMount')}
      onUnmount={action('onUnmount')}
      animation={false}
      timeline={false}
      fullscreenButton={false}
      baseLayerPicker={false}
      imageryProvider={false} // disable default imagery provider
      geocoder={false}
      homeButton={false}
      sceneModePicker={false}
      requestRenderMode={false} // reduce cpu load by only rendering when things change - may require manual rendering in some places.
      maximumRenderTimeChange={Infinity} // time changes will never cause re-renders - may need to change this is we add time sensitive features.
      selectionIndicator={false}
      navigationHelpButton={false}
      targetFrameRate={30}
    >
      <CameraContext.Consumer>
        {camera => (
          <CanvasContext.Consumer>
            {canvas => (
              <SceneContext.Consumer>
                {scene => (
                  <Scale scene={scene} camera={camera} canvas={canvas} />
                )}
              </SceneContext.Consumer>
            )}
          </CanvasContext.Consumer>
        )}
      </CameraContext.Consumer>
    </Viewer>
  ))
