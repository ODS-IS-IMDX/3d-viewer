// Copyright (c) 2025 NTT InfraNet
import get from 'lodash/get'

import config from 'config'

const validateCCRS = async (ccrsFile, units) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async () => {
      const data = btoa(reader.result)

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: data, units })
      }

      try {
        const response = await fetch(
          config.skyApiRoutes.ccrs.calibration,
          options
        )
        const { data: { controlPoints, matrix } = {} } = await response.json()
        resolve({ controlPoints, matrix })
      } catch (e) {
        reject(get(e, 'response.data.error', { message: 'Server error' }))
      }
    }

    reader.readAsBinaryString(ccrsFile.file)
  })
}
export default validateCCRS
