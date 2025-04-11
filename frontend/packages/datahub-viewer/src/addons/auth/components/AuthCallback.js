// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import * as queryString from 'query-string'
import { connect } from 'react-redux'
import { Location } from '@reach/router'

import type { QueryParameters } from 'query-string'

import { handleAuthentication, handleRenew } from '../actions'

type Props = {
  handleAuthentication: QueryParameters => void,
  handleRenew: QueryParameters => void,
  location: {
    search: string
  }
}

class AuthCallbackBase extends React.Component<Props> {
  async componentDidMount () {
    const queryParams = queryString.parse(this.props.location.search)
    queryParams.renewSession === '1'
      ? this.props.handleRenew(queryParams)
      : this.props.handleAuthentication(queryParams)
  }

  render () {
    return (
      <div>
        <p>Loading profile...</p>
      </div>
    )
  }
}

const AuthCallback = connect(null, { handleAuthentication, handleRenew })(
  props => (
    <Location>
      {({ location }) => <AuthCallbackBase {...props} location={location} />}
    </Location>
  )
)

export default AuthCallback
