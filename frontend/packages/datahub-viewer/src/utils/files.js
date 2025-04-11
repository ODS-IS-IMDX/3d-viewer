// Copyright (c) 2025 NTT InfraNet
// @flow
import * as zip from '@zip.js/zip.js'

export const isExtensionAllowed = (
  extension: string,
  allowedExtensions: Array<string> = []
): boolean => allowedExtensions.includes(extension)

export const getExtension = (filename: string): string =>
  filename
    .split('.')
    .pop()
    .toLowerCase()

/**
 * zip内の各ファイルの取得
 * @param {*} zipFile 圧縮されたzipファイル
 * @returns zip内の各ファイル
 */
export const getFileListInZip = (zipFile: File) => {
  return new zip.ZipReader(new zip.BlobReader(zipFile)).getEntries({
    filenameEncoding: 'utf-8'
  })
}

/**
 * zip内の各ファイルの情報の取得
 * @param {*} zipFile 圧縮されたzipファイル
 * @returns zip内の各ファイルの情報
 */
export const getFileInfoListInZip = async (zipFile: File) => {
  const filesInZip = await getFileListInZip(zipFile)
  // fileInZip.filename: filenameという名付けだが、実際に読み取ったのはzip内のファイルの相対パス
  const filePathListInZip = filesInZip.map(fileInZip => fileInZip.filename)
  const fileNameListInZip = filePathListInZip.map(filePathInZip =>
    filePathInZip.split('/').pop()
  )
  return {
    filePathListInZip,
    fileNameListInZip
  }
}

/**
 * json形式の文字列をjsonに変換する(json形式ではない場合nullを返却)
 * @param {string | null} jsonString 変換対象の文字列
 * @returns {object | null}
 */
export const getJsonFromString = (
  jsonString?: string | null
): Object | null => {
  if (!jsonString) {
    return null
  }
  try {
    return JSON.parse(jsonString)
  } catch {
    return null
  }
}
