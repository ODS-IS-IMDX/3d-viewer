// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { type AbstractComponent } from 'react'
import { connect } from 'react-redux'
import { Redirect } from '@reach/router'

import { isAuthenticated, isRenewing } from '../selectors'

type Props = {
  children: any,
  isAuthenticated?: boolean,
  isRenewing?: boolean,
  component: AbstractComponent<any>,
  location: {
    pathname: string,
    search: string
  }
}

const ProtectedRouteBase = (props: Props) => {
  const {
    component: Component,
    isAuthenticated,
    isRenewing,
    location,
    ...rest
  } = props
  if (!isAuthenticated) {
    // NOTE: Redirectコンポーネントでリダイレクトされると、クエリパラメータを引き継いでくれるので、初回アクセス時のURLを引き継ぐだけでよい
    const redirectURL =
      location.pathname !== '/' ? `/?redirect=${location.pathname}` : '/'

    return isRenewing ? false : <Redirect noThrow from='*' to={redirectURL} />
  }

  return <Component {...rest} />
}

export const ProtectedRoute = connect(state => ({
  isAuthenticated: isAuthenticated(state),
  isRenewing: isRenewing(state)
}))(ProtectedRouteBase)
