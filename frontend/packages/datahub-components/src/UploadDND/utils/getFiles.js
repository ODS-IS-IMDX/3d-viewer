// Copyright (c) 2025 NTT InfraNet
// @flow
export type UploadDNDFileType = {
  fileSystemName: ?string,
  fullPath: string,
  size: number,
  name: string,
  type: string,
  file: {}
}

export type FileEntryType = {
  filesystem: { name: string },
  fullPath: string,
  isDirectory: boolean,
  isFile: boolean,
  name: string,
  file: ((any) => ?UploadDNDFileType, (any) => any) => any,
  createReader: () => {
    readEntries: any => Promise<Array<FileEntryType>>
  }
}

export type DataTransferItemType = {
  kind: string,
  type: string,
  getAsEntry: () => FileEntryType,
  webkitGetAsEntry: () => FileEntryType
}

export type FileType = {
  lastModified: number,
  lastModifiedDate: Date,
  name: string,
  size: number,
  type: string,
  webkitRelativePath: string
}

export type ParseEntryOptionType = {
  maxDepth: number
}

type ParseFilesFuncType = (
  ?FileEntryType,
  ParseEntryOptionType,
  number
) => Promise<Array<UploadDNDFileType>>

export type GetFilesFuncType = (
  DataTransferItemType,
  ParseEntryOptionType
) => Promise<Array<UploadDNDFileType>>

const fileToEntry = (file: DataTransferItemType): ?FileEntryType =>
  file.getAsEntry
    ? file.getAsEntry()
    : file.webkitGetAsEntry
    ? file.webkitGetAsEntry()
    : null

const getFilesInDirectory = async (entry: FileEntryType) => {
  const reader = entry.createReader()
  let entries = []
  let hasEntries = true
  while (hasEntries) {
    /* eslint-disable promise/param-names */
    const results = await new Promise(readerResolve =>
      reader.readEntries(readerResolve)
    )

    /* eslint-enable promise/param-names */
    if (results && results.length) {
      entries = entries.concat(results)
    } else {
      hasEntries = false
    }
  }

  return entries
}

const entryToFile = (entry: FileEntryType): Promise<?FileType> =>
  new Promise((resolve: any => ?UploadDNDFileType, reject: any => any) => {
    entry.file ? entry.file(resolve, reject) : resolve(null)
  }).catch(() => {})

export const parseEntry: ParseFilesFuncType = async (
  entry,
  options = { maxDepth: 1 },
  level
) => {
  if (!entry || options.maxDepth < level) {
    return []
  }
  let returnList = []
  if (entry.isDirectory) {
    const files = await getFilesInDirectory(entry)

    for (const file of files) {
      returnList = returnList.concat(await parseEntry(file, options, level + 1))
    }
  } else {
    const fileToAdd = await entryToFile(entry)
    if (fileToAdd) {
      returnList.push({
        file: fileToAdd,
        name: entry.name,
        type: fileToAdd.type,
        size: fileToAdd.size,
        fullPath: entry.fullPath,
        fileSystemName: entry.filesystem.name
      })
    }
  }

  return returnList
}

const getFiles: GetFilesFuncType = (item, options) => {
  return parseEntry(fileToEntry(item), options, 0)
}

export default getFiles
