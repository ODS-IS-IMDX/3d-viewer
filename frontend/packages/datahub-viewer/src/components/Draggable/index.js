// Copyright (c) 2025 NTT InfraNet
import { SceneContext, CameraContext } from 'react-cesium'
import { DraggableContainer } from './Draggable'
import { withContext } from 'utils/context'

export default withContext({
  camera: CameraContext.Consumer,
  scene: SceneContext.Consumer
})(DraggableContainer)
