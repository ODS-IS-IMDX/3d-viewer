// Copyright (c) 2025 NTT InfraNet
// @flow
import getFiles, {
  type UploadDNDFileType,
  type GetFilesFuncType,
  type DataTransferItemType
} from './getFiles'

const removeDotFiles = (
  files: Array<UploadDNDFileType>
): Array<UploadDNDFileType> => files.filter(file => !file.name.startsWith('.'))

/**
 * Get the file(s) from the HTML 5 data transfer items
 * @param {object} dataTransfer the needed data transfer usually obtained from drag and drop via HTML 5 Files System API
 * @param {Function}[filesGetter] an optional override to get file items from dataTransfer via HTML 5 Files System API
 * @return {Array<Object>} an array of files useful for further processing with dot flies removed by default
 */
const getFilesFromFileDataTransfer = async (
  dataTransfer: { items: Array<DataTransferItemType> },
  filesGetter: GetFilesFuncType = getFiles
) => {
  if (!dataTransfer || !dataTransfer.items || dataTransfer.items.length === 0) {
    return []
  }

  const allFiles = []

  for (const dtItem of dataTransfer.items) {
    allFiles.push(filesGetter(dtItem, { maxDepth: Number.MAX_SAFE_INTEGER }))
  }

  const files = await Promise.all(allFiles)
  return removeDotFiles([].concat(...files))
}

export { getFilesFromFileDataTransfer }
