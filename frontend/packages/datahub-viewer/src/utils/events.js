// Copyright (c) 2025 NTT InfraNet
// @flow

export const stopPropagation = (fn: (?any) => void) => (event: Event) => {
  event.stopPropagation()
  fn(event)
}

export const persistEvent = (fn: (?any) => void) => (event: SyntheticEvent) => {
  event.persist && event.persist()
  fn(event)
}
