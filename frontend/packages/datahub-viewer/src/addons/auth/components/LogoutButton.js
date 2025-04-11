// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import styled from 'styled-components'

import { logout } from '../actions'

type Props = {
  logout: () => void,
  t: string => string
}

const Link = styled.a`
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: normal;
  color: #ed4f5b;
  cursor: pointer;
`
const LogoutButton = ({ logout, t, ...props }: Props) => (
  <Link {...props} onClick={logout}>
    {t('logout.button')}
  </Link>
)

export default connect(null, { logout })(withNamespaces('auth')(LogoutButton))
