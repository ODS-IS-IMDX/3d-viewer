// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { connect } from 'react-redux'
import { LocationProvider, Router } from '@reach/router'
import { Slot } from '@ehv/react-slots'
import { Box } from '@ehv/datahub-components'

import history from './history'
import { ProtectedRoute, AuthRouter } from './addons/auth'
import { redirect } from './addons/auth/actions'

const HomeBase = ({ redirect }) => {
  React.useEffect(() => {
    redirect()
  }, [redirect])
  return null
}

const Home = connect(null, { redirect })(HomeBase)

const RouterSlot = () => <Slot name='core.router' />

class App extends React.PureComponent {
  render () {
    return (
      <Box height='100vh'>
        <LocationProvider history={history}>
          <Router style={{ height: '100vh' }}>
            <AuthRouter path='/auth/*' />
            <ProtectedRoute component={Home} path='/' />
            <ProtectedRoute default component={RouterSlot} />
          </Router>
        </LocationProvider>
        <Slot name='root' />
      </Box>
    )
  }
}

export default App
