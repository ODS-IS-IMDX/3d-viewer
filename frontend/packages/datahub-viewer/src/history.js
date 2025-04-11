// Copyright (c) 2025 NTT InfraNet
import { reachify } from 'redux-first-history'
import store, { createReduxHistory } from './store'

export const routerHistory = reachify(createReduxHistory(store))

export default routerHistory
