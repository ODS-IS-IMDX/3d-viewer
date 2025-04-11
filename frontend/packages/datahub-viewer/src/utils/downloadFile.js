// Copyright (c) 2025 NTT InfraNet
const downloadFile = url => {
  const element = document.createElement('a')
  element.setAttribute('href', url)

  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export default downloadFile
