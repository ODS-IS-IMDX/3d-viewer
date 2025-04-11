// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'

import { TERMS_OF_SERVICE_URL } from '../../constants'

const TermsOfService = styled.a`
  font-size: 10px;
  color: #fff;
  text-shadow: 0 0 2px #000;

  &:hover {
    color: #48b;
  }
`

const SiteTermsOfService = ({ t, ...props }) => {
  return (
    TERMS_OF_SERVICE_URL && (
      <TermsOfService
        href={TERMS_OF_SERVICE_URL}
        target='_blank'
        rel='noopener noreferrer'
      >
        {t('termsOfService')}
      </TermsOfService>
    )
  )
}

export default SiteTermsOfService
