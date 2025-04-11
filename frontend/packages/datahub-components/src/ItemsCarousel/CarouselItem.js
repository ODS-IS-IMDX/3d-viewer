// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Flex, themed } from '@ehv/design-system'

import theme from './theme'

type CarouselItemProps = {
  children: string,
  visible: boolean
}

const CarouselItemWrapper = styled(Flex)`
  margin: 0 5px;
  ${// $FlowFixMe
  themed('ItemsCarousel.Item', theme.Item)}
`

export const CarouselItem = ({
  children,
  visible,
  ...props
}: CarouselItemProps) =>
  visible && <CarouselItemWrapper {...props}>{children}</CarouselItemWrapper>

export default CarouselItem
