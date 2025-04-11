// Copyright (c) 2025 NTT InfraNet
// @flow
// https://stackoverflow.com/a/12043228/4541966
function tooDark (hex: string) {
  var color = hex.substring(1) // strip #
  var rgb = parseInt(color, 16) // convert rrggbb to decimal

  const r = (rgb >> 16) & 0xff // extract red
  const g = (rgb >> 8) & 0xff // extract green
  const b = (rgb >> 0) & 0xff // extract blue

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709

  if (luma < 40) {
    return true
  }
  return false
}

export function contrastingForeground (hex: string) {
  if (tooDark(hex)) {
    return '#ffffff' // white
  }

  return '#3a4248' // dark gray
}
