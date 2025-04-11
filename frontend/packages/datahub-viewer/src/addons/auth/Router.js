// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { Router } from '@reach/router'

import AuthCallback from './components/AuthCallback'

class AuthRouter extends React.PureComponent {
  render () {
    return (
      <Router>
        <AuthCallback path='/callback' />
      </Router>
    )
  }
}

export default AuthRouter
