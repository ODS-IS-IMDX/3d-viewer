// Copyright (c) 2025 NTT InfraNet
// @flow
export type fileType = {
  lastModified: number,
  lastModifiedDate: {},
  size: number,
  name: string,
  type: string,
  webkitRelativePath: string
}

const getFilesFromFiles = async (files: Array<fileType>) => {
  if (!files || files.length === 0) {
    return []
  }

  const result = []

  for (let i = 0; i < files.length; i++) {
    result.push({
      file: files[i],
      name: files[i].name,
      type: files[i].type,
      size: files[i].size,
      fullPath: files[i].name,
      fileSystemName: null
    })
  }

  return result
}

export { getFilesFromFiles }
