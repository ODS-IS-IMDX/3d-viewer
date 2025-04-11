// Copyright (c) 2025 NTT InfraNet
// @flow
/**
 * 指定したURLのタグ内のテキストを取得
 * @param {string} url 取得したいURL
 * @param {string} targetElementTagName 取得したいタグ名
 * @param {number} index 複数の同名タグが存在した場合、取得対象のindex
 * @returns テキストを含むPromise
 */
export const getTextFromWebsite = async ({
  url,
  targetElementTagName,
  index = 0
}: {
  url: string,
  targetElementTagName: string,
  index: number
}): Promise<string> => {
  const noCacheUrl =
    url.slice(-1) === '/'
      ? `${url}?_timestamp=${Date.now()}`
      : `${url}/?_timestamp=${Date.now()}`
  try {
    const response: Response = await fetch(noCacheUrl)
    const htmlText = await response.text()
    const dom = await new DOMParser().parseFromString(htmlText, 'text/html')
    const elements = dom.getElementsByTagName(targetElementTagName)
    const elementsLength = (elements && elements.length) || 0

    return elementsLength >= index + 1 ? elements[index].innerHTML : ''
  } catch {
    return ''
  }
}
