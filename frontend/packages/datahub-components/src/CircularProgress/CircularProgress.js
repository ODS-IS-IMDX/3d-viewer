// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

type UploadFileBoxType = {
  progress: number
}

export const CircularWidget = styled.div`
  line-height: 0;
  .CircularProgressbar .CircularProgressbar-text {
    dominant-baseline: central;
    text-anchor: middle;
  }
`

export const CircularProgress = ({ progress }: UploadFileBoxType) => (
  <CircularWidget>
    <CircularProgressbar
      value={progress}
      text={`${progress}%`}
      strokeWidth={5}
      styles={buildStyles({
        strokeLinecap: 'butt',
        textSize: '28px',
        pathTransitionDuration: 0.5,
        pathColor: `#16abe3`,
        textColor: '#3a4248',
        trailColor: '#606770',
        backgroundColor: '#3e98c7'
      })}
    />
  </CircularWidget>
)
