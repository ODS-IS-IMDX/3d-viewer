// Copyright (c) 2025 NTT InfraNet
// @flow
import Encoding from 'encoding-japanese'

export const decodeFile = (response: Response): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    response.arrayBuffer().then(buf => {
      const result = Encoding.convert(new Uint8Array(buf), {
        to: 'UNICODE',
        type: 'string'
      })
      resolve(result)
    })
  })
}
