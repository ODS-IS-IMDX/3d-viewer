// Copyright (c) 2025 NTT InfraNet
import config from 'config'

const loadGeoidModels = async ({ lat, lng }) => {
  try {
    const options = {
      method: 'GET'
    }

    const url = new URL(config.skyApiRoutes.geoids)
    const params = { lat, lon: lng }

    Object.keys(params).forEach(key =>
      url.searchParams.append(key, params[key])
    )

    const response = await fetch(url, options)
    return (await response.json()).data
  } catch (error) {
    throw error
  }
}

export default loadGeoidModels
