// Copyright (c) 2025 NTT InfraNet
import React from 'react'

import DataSourcesContext from '../DataSourcesContext'
import SceneContext from '../SceneContext'
import CameraContext from '../CameraContext'
import CanvasContext from '../CanvasContext'
import EntitiesContext from '../EntitiesContext'
import ImageryLayersContext from '../ImageryLayersContext'

export const ViewerContext = React.createContext()

const Consumer = ViewerContext.Consumer

const Provider = ({ value: viewer, children }) => (
  <ViewerContext.Provider value={viewer}>
    <DataSourcesContext.Provider value={viewer.dataSources}>
      <SceneContext.Provider value={viewer.scene}>
        <CameraContext.Provider value={viewer.camera}>
          <CanvasContext.Provider value={viewer.canvas}>
            <EntitiesContext.Provider value={viewer.entities}>
              <ImageryLayersContext.Provider value={viewer.imageryLayers}>
                {children}
              </ImageryLayersContext.Provider>
            </EntitiesContext.Provider>
          </CanvasContext.Provider>
        </CameraContext.Provider>
      </SceneContext.Provider>
    </DataSourcesContext.Provider>
  </ViewerContext.Provider>
)

export const ViewerContextContainer = {
  Provider,
  Consumer
}
