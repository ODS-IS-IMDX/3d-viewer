// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Button, Flex, themed } from '@ehv/design-system'

import theme from './theme'
import CarouselItem from './CarouselItem'

export type ItemsCarouselProps = {
  children: Array<typeof CarouselItem>,
  defaultSelected?: number,
  onChange?: number => void
}

type State = {
  selected: number
}

const ItemsCarouselWrapper = styled(Flex)`
  align-items: center;
  ${// $FlowFixMe
  themed('ItemsCarousel', theme)}
`

const ButtonWrapper = styled(Button)`
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 2px;
  border: solid 1px #ecf0f3;
  cursor: pointer;
  height: 24px;
  padding: 0;
  width: 24px;
`

const GotoPrevious = styled.i`
  border: solid black;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(135deg);
  margin-left: 4px;
`

const GotoNext = styled.i`
  border: solid black;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(-45deg);
  margin-right: 4px;
`

export class ItemsCarousel extends React.PureComponent<
  ItemsCarouselProps,
  State
> {
  state = {
    selected: this.props.defaultSelected || 0
  }

  static Item = CarouselItem

  goToNext = () => {
    const { selected } = this.state
    const { onChange, children } = this.props
    if (selected < children.length - 1) {
      const nextIndex = selected + 1
      this.setState({ selected: nextIndex })
      onChange && onChange(nextIndex)
    }
  }

  goToPrevious = () => {
    const { selected } = this.state
    const { onChange } = this.props
    if (selected > 0) {
      const prevIndex = selected - 1
      this.setState({ selected: prevIndex })
      onChange && onChange(prevIndex)
    }
  }

  render () {
    const { children, ...props } = this.props
    const { selected } = this.state

    return (
      <ItemsCarouselWrapper {...props}>
        <ButtonWrapper
          variant='minimal'
          onClick={this.goToPrevious}
          disabled={selected === 0}
        >
          <GotoPrevious width={24} height={24} />
        </ButtonWrapper>
        {React.Children.map(
          children,
          (child, index) =>
            child &&
            React.cloneElement(child, {
              visible: selected === index
            })
        )}
        <ButtonWrapper
          variant='minimal'
          onClick={this.goToNext}
          disabled={selected === children.length - 1}
        >
          <GotoNext />
        </ButtonWrapper>
      </ItemsCarouselWrapper>
    )
  }
}

export default ItemsCarousel
