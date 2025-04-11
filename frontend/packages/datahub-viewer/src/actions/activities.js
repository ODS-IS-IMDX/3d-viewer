// Copyright (c) 2025 NTT InfraNet
export const START_ACTIVITY = 'START_ACTIVITY'
export const START_SUB_ACTIVITY = 'START_SUB_ACTIVITY'
export const ACTIVITIES_REGISTER = 'ACTIVITIES_REGISTER'

export const startActivity = activity => (dispatch, getState) => {
  if (
    getState().activities.activity &&
    // eslint-disable-next-line no-restricted-globals
    !confirm('Would you like to cancel the current activity?')
  ) {
    return
  }
  return dispatch({
    type: START_ACTIVITY,
    activity
  })
}

export const startSubActivity = subActivity => dispatch => {
  return dispatch({
    type: START_SUB_ACTIVITY,
    subActivity
  })
}

export const register = (name, placements) => {
  // activities.register
}
