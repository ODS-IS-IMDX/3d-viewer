// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import { connect } from 'react-redux'

import { logout } from '../actions'
import { isAuthenticated } from '../selectors'

type Props = {
  isAuthenticated: boolean,
  logout: () => void
}

const AuthLogoutBase = ({ isAuthenticated, logout }: Props) => (
  <React.Fragment>
    <div>Login status: {isAuthenticated ? 'Logged in' : 'Not logged in'}</div>
    {isAuthenticated && <button onClick={logout}>Logout</button>}
  </React.Fragment>
)

export const AuthLogout = connect(
  state => ({
    isAuthenticated: isAuthenticated(state)
  }),
  { logout }
)(AuthLogoutBase)
