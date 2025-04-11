// Copyright (c) 2025 NTT InfraNet
// @flow

export function generateCSV (array: []) {
  return array
    .map(line =>
      line
        .map((item = '') =>
          item.toString().includes(',') ? `"${item}"` : item
        )
        .join(',')
    )
    .join('\n')
}

export function generateTSV (array: []) {
  return array.map(line => line.join('\t')).join('\n')
}

export function exportCSV (array: [], filename: string) {
  const blob = new Blob([generateCSV(array)], { type: 'text/csv' })

  exportFile(blob, filename)
}

export function copyTSV (array: []) {
  return copyToClipboard(generateTSV(array))
}

export function exportFile (blob: Blob, filename: string) {
  if (window.navigator.msSaveOrOpenBlob) {
    // for IE and Edge
    window.navigator.msSaveBlob(blob, filename)
  } else {
    const element = document.createElement('a')
    element.href = URL.createObjectURL(blob)
    element.style.display = 'none'
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
}

export function copyToClipboard (text: string): boolean {
  const textArea = document.createElement('textarea')
  textArea.style.position = 'absolute'
  textArea.style.left = '-1000px'
  textArea.style.top = '-1000px'
  textArea.value = text

  document.body.appendChild(textArea)

  textArea.select()

  const copied = document.execCommand('copy')

  document.body.removeChild(textArea)

  if (!copied) {
    throw new Error('Copy failed')
  }

  return copied
}
