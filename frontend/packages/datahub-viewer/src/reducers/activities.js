// Copyright (c) 2025 NTT InfraNet
import { START_ACTIVITY, START_SUB_ACTIVITY } from '../actions/activities'

const initialState = {
  activity: null,
  subActivities: []
}

function activities (state = initialState, action) {
  switch (action.type) {
    case START_ACTIVITY:
      return {
        ...state,
        activity: action.activity
      }
    case START_SUB_ACTIVITY:
      return {
        ...state,
        subActivities: [...state.subActivities, action.subActivity]
      }
    default:
      return state
  }
}

export default activities
