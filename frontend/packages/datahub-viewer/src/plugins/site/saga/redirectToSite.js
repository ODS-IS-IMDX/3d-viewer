// Copyright (c) 2025 NTT InfraNet
import { select } from 'redux-saga/effects'
import { redirect } from 'utils/saga'
import routes from '../routes'
import { getSite } from '../selectors'
import loadSelectedSaga from './loadSelected'

function * redirectToSite (props) {
  const { id } = (yield select(getSite)) || {}
  // If the site id is the same the route is not called and should be forced here
  if (id !== props.siteId) {
    yield redirect(routes.site)(props)
  } else {
    yield loadSelectedSaga(props)
  }
}

export default redirectToSite
