// Copyright (c) 2025 NTT InfraNet
export const detectUpdates = () => {
  if (window.performance) {
    const peList = performance.getEntriesByType('navigation')
    if (peList.length && peList[0].type === 'reload') {
      return true
    }
  }
}
