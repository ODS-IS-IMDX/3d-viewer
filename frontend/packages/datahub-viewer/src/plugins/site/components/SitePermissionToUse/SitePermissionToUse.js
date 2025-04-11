// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import {
  SITE_PERMISSION_TEXT,
  OPEN_STREET_MAP_PERMISSION
} from '../../constants'

const PermissionToUse = styled.div`
  font-size: 10px;
  color: #fff;
  text-shadow: 0 0 2px #000;
`

const PermissionLink = styled.a`
  color: white;
  font-size: 10px;
`

const SitePermissionToUse = ({ t, ...props }) => {
  return (
    <>
      <PermissionToUse>
        <p>{SITE_PERMISSION_TEXT}</p>
        <PermissionLink href={OPEN_STREET_MAP_PERMISSION.URL}>
          {OPEN_STREET_MAP_PERMISSION.TEXT}
        </PermissionLink>
      </PermissionToUse>
    </>
  )
}

export default SitePermissionToUse
