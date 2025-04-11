// Copyright (c) 2025 NTT InfraNet
// @flow

export const isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints

export const isMobile = !!navigator.userAgent.match(/iPhone|Android.+Mobile/)

export const isIOS: boolean =
  !!navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ||
  !!navigator.userAgent.match(/(iPad).*OS\s([\d_]+)/) ||
  !!navigator.userAgent.match(/(Macintosh)/)
