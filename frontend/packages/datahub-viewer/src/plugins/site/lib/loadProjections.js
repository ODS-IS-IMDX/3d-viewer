// Copyright (c) 2025 NTT InfraNet
import config from 'config'

const loadProjections = async ({ lat, lng }) => {
  try {
    const options = {
      method: 'GET'
    }

    const url = new URL(config.skyApiRoutes.projections)
    const params = { lat, lon: lng }
    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    )

    const response = await fetch(url, options)
    const data = await response.json()

    return data.data
  } catch (error) {
    throw error
  }
}

export default loadProjections
