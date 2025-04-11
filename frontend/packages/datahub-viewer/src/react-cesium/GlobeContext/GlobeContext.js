// Copyright (c) 2025 NTT InfraNet
import React from 'react'

import EllipsoidContext from '../EllipsoidContext'

export const GlobeContext = React.createContext()

const Consumer = GlobeContext.Consumer

const Provider = ({ value: globe, children }) => (
  <GlobeContext.Provider value={globe}>
    <EllipsoidContext.Provider value={globe ? globe.ellipsoid : null}>
      {children}
    </EllipsoidContext.Provider>
  </GlobeContext.Provider>
)

export const GlobeContextContainer = {
  Provider,
  Consumer
}
