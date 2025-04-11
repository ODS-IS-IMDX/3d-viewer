// Copyright (c) 2025 NTT InfraNet
import React from 'react'

const SvgMapPointCircle = props => (
  <svg viewBox='0 0 100 100' {...props}>
    <path d='M0 0h100v100H0z' fill='none' />
    <circle cx={50} cy={45} r={12} fill='#566adf' />
  </svg>
)

export default SvgMapPointCircle
