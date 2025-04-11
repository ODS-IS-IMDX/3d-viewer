// Copyright (c) 2025 NTT InfraNet
function loadSettings (dataType) {
  const settings = localStorage.getItem(dataType + 'Settings')
  return settings ? JSON.parse(settings) : []
}
function saveSettings ({
  dataType,
  id,
  isVisible,
  isClampToSurface,
  isBackFaceDisplay,
  pointSize,
  style,
  isInTimeline
}) {
  const currentSettings = JSON.parse(
    localStorage.getItem(dataType + 'Settings')
  )
  let tmpCurrentSetting = {
    id: id,
    isVisible: isVisible,
    isClampToSurface: isClampToSurface,
    isBackFaceDisplay: isBackFaceDisplay,
    pointSize: pointSize,
    style,
    isInTimeline
  }
  // idが存在している場合はundefinedではないプロパティを更新
  if (currentSettings) {
    if (id in currentSettings) {
      tmpCurrentSetting = currentSettings[id]
      if (typeof isVisible !== 'undefined') {
        tmpCurrentSetting.isVisible = isVisible
      }
      if (typeof isClampToSurface !== 'undefined') {
        tmpCurrentSetting.isClampToSurface = isClampToSurface
      }
      if (typeof isBackFaceDisplay !== 'undefined') {
        tmpCurrentSetting.isBackFaceDisplay = isBackFaceDisplay
      }
      if (typeof pointSize !== 'undefined') {
        tmpCurrentSetting.pointSize = pointSize
      }
      if (typeof style !== 'undefined') tmpCurrentSetting.style = style
      if (typeof isInTimeline !== 'undefined') {
        tmpCurrentSetting.isInTimeline = isInTimeline
      }
    }
  }
  const newSettings = {
    ...currentSettings,
    [id]: tmpCurrentSetting
  }
  localStorage.setItem(dataType + 'Settings', JSON.stringify(newSettings))
}
export { loadSettings, saveSettings }
