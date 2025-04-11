// Copyright (c) 2025 NTT InfraNet
export function sanitize (pathname) {
  return pathname.endsWith('/') ? pathname : pathname + '/'
}
