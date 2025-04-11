// Copyright (c) 2025 NTT InfraNet
// @flow
export type SelectedItemData = {
  id: string,
  name: string,
  node: any,
  file: any,
  isDirectory: boolean,
  isOrigin: boolean,
  enableDelete: boolean
}

export type DeleteItem = {
  asset: any[],
  folder: any[]
}
