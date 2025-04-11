// Copyright (c) 2025 NTT InfraNet
// @flow
import _orderBy from 'lodash/orderBy'

import { HEIGHT_ABOVE_ELLIPSOID } from '../constants'

const mapGeoidModelsToOptions = geoidModels => [
  { value: HEIGHT_ABOVE_ELLIPSOID, label: 'Height Above the Ellipsoid' },
  ..._orderBy(
    geoidModels.map(item => {
      const key = Object.keys(item)[0]
      return {
        value: key,
        label: key
      }
    }),
    'label'
  )
]

export default mapGeoidModelsToOptions
