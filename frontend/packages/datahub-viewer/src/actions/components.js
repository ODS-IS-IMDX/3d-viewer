// Copyright (c) 2025 NTT InfraNet
export const COMPONENTS_INJECT = 'COMPONENTS_INJECT'
export const COMPONENTS_REMOVE = 'COMPONENTS_REMOVE'

export const inject = (component, slot, order) => {
  return {
    type: COMPONENTS_INJECT,
    slot,
    order,
    component
  }
}

export const remove = (component, slot) => {
  return {
    type: COMPONENTS_REMOVE,
    slot,
    component
  }
}
