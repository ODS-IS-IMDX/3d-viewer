// Copyright (c) 2025 NTT InfraNet
import SparkMD5 from 'spark-md5'

const checksum = async file => {
  return new Promise((resolve, reject) => {
    const chunkSize = 2097152 // Read in chunks of 2MB
    const chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()

    fileReader.onload = function (e) {
      // console.log("read chunk nr", currentChunk + 1, "of", chunks);
      spark.append(e.target.result) // Append array buffer
      currentChunk++

      if (currentChunk < chunks) {
        // next
        return loadNext()
      }
      // end
      const rawHash = spark.end(true)
      const base64Hash = btoa(rawHash)

      return resolve(base64Hash)
    }

    fileReader.onerror = function (err) {
      fileReader.abort()
      reject(err)
    }

    function loadNext () {
      const start = currentChunk * chunkSize
      const end = Math.min(start + chunkSize, file.size)

      fileReader.readAsArrayBuffer(file.slice(start, end))
    }

    loadNext()
  })
}

export default checksum
