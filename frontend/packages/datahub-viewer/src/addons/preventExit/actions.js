// Copyright (c) 2025 NTT InfraNet
// @flow
export const PREVENT_EXIT_ADD = 'PREVENT_EXIT_ADD'
export const PREVENT_EXIT_REMOVE = 'PREVENT_EXIT_REMOVE'

export type PreventExitPayload = {
  key: string
}

export type PreventExitAddAction = {
  type: 'PREVENT_EXIT_ADD',
  payload: PreventExitPayload
}

export type PreventExitRemoveAction = {
  type: 'PREVENT_EXIT_REMOVE',
  payload: PreventExitPayload
}

export type PreventExitActions = PreventExitAddAction | PreventExitRemoveAction

export const preventExitAdd = (key: string): PreventExitAddAction => ({
  type: PREVENT_EXIT_ADD,
  payload: { key }
})

export const preventExitRemove = (key: string): PreventExitAddAction => ({
  type: PREVENT_EXIT_REMOVE,
  payload: { key }
})
