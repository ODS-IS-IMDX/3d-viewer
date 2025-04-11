// Copyright (c) 2025 NTT InfraNet
// @flow
import _orderBy from 'lodash/orderBy'

const mapProjectionsToOptions = projections =>
  _orderBy(
    Object.entries(projections).map(([key, projection]) => ({
      value: key,
      label: `${key.replace('EPSG:', '')} - ${projection.name}`
    })),
    'label'
  )

export default mapProjectionsToOptions
