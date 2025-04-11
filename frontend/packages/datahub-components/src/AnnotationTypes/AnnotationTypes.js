// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'

import { Flex, themed } from '@ehv/design-system'
import {
  IconAnalyticArrowBlack,
  IconAnalyticArrowWhite,
  IconMarkupLine,
  IconLine,
  IconMarkupPoint,
  IconPoint,
  IconMarkupPolygon,
  IconPolygon,
  IconLabel,
  IconMarkupLabel
} from '@ehv/datahub-icons'

import theme from './theme'

type AnnotationTypesProps = {
  annotationType: string,
  onClick: string => void
}

const AnnotationTypesWrapper = styled(Flex)`
  border-radius: 4px;
  height: 40px;

  svg:first-child {
    border-radius: 4px 0px 0px 4px;
  }

  svg:last-child {
    border-radius: 0px 4px 4px 0px;
  }

  ${// $FlowFixMe
  themed('AnnotationTypes.Wrapper', theme.Wrapper)}
`

const LineIcon = styled(IconMarkupLine)`
  ${// $FlowFixMe
  themed('AnnotationTypes.Icon', theme.Icon)}
`

const LineSelectedIcon = styled(IconLine)`
  ${// $FlowFixMe
  themed('AnnotationTypes.SelectedIcon', theme.SelectedIcon)}
`

const Line = ({ isSelected, ...props }) => {
  if (!isSelected) {
    return <LineIcon {...props} />
  }
  return <LineSelectedIcon {...props} />
}

const ArrowIcon = styled(IconAnalyticArrowBlack)`
  ${// $FlowFixMe
  themed('AnnotationTypes.Icon', theme.Icon)}
`

const ArrowSelectedIcon = styled(IconAnalyticArrowWhite)`
  ${// $FlowFixMe
  themed('AnnotationTypes.SelectedIcon', theme.SelectedIcon)}
`

const Arrow = ({ isSelected, ...props }) => {
  if (!isSelected) {
    return <ArrowIcon {...props} />
  }
  return <ArrowSelectedIcon {...props} />
}

const PointIcon = styled(IconMarkupPoint)`
  ${// $FlowFixMe
  themed('AnnotationTypes.Icon', theme.Icon)}
`

const PointSelectedIcon = styled(IconPoint)`
  ${// $FlowFixMe
  themed('AnnotationTypes.SelectedIcon', theme.SelectedIcon)}
`

const Point = ({ isSelected, ...props }) => {
  if (!isSelected) {
    return <PointIcon {...props} />
  }
  return <PointSelectedIcon {...props} />
}

const PolygonIcon = styled(IconMarkupPolygon)`
  ${// $FlowFixMe
  themed('AnnotationTypes.Icon', theme.Icon)}
`

const PolygonSelectedIcon = styled(IconPolygon)`
  ${// $FlowFixMe
  themed('AnnotationTypes.SelectedIcon', theme.SelectedIcon)}}
`

const Polygon = ({ isSelected, ...props }) => {
  if (!isSelected) {
    return <PolygonIcon {...props} />
  }

  return <PolygonSelectedIcon {...props} />
}

const LabelIcon = styled(IconMarkupLabel)`
  ${// $FlowFixMe
  themed('AnnotationTypes.Icon', theme.Icon)}
`

const LabelSelectedIcon = styled(IconLabel)`
  ${// $FlowFixMe
  themed('AnnotationTypes.Icon', theme.SelectedIcon)}
`

const Label = ({ isSelected, ...props }) => {
  if (!isSelected) {
    return <LabelIcon {...props} />
  }

  return <LabelSelectedIcon {...props} />
}

export const AnnotationTypes = ({
  annotationType,
  onClick
}: AnnotationTypesProps) => {
  const isSelectedType = type => annotationType === type
  return (
    <AnnotationTypesWrapper>
      <Point
        isSelected={isSelectedType('point')}
        onClick={() => onClick('point')}
      />
      <Line
        isSelected={isSelectedType('line')}
        onClick={() => onClick('line')}
      />
      <Arrow
        isSelected={isSelectedType('arrow')}
        onClick={() => onClick('arrow')}
      />
      <Polygon
        isSelected={isSelectedType('polygon')}
        onClick={() => onClick('polygon')}
      />
      <Label
        isSelected={isSelectedType('label')}
        onClick={() => onClick('label')}
      />
    </AnnotationTypesWrapper>
  )
}
