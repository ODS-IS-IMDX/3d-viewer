// Copyright (c) 2025 NTT InfraNet
import React from 'react'

import GlobeContext from '../GlobeContext'
import PrimitivesContext from '../PrimitivesContext'
import ImageryLayersContext from '../ImageryLayersContext'

export const SceneContext = React.createContext()

const Consumer = SceneContext.Consumer

const Provider = ({ value: scene, children }) => (
  <SceneContext.Provider value={scene}>
    <GlobeContext.Provider value={scene.globe}>
      <PrimitivesContext.Provider value={scene.primitives}>
        <ImageryLayersContext.Provider value={scene.imageryLayers}>
          {children}
        </ImageryLayersContext.Provider>
      </PrimitivesContext.Provider>
    </GlobeContext.Provider>
  </SceneContext.Provider>
)

export const SceneContextContainer = {
  Provider,
  Consumer
}
