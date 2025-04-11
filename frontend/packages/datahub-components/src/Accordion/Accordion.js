// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { themed } from '@ehv/design-system'
import { BaseStyle } from '../Style'

import theme from './theme'

import AccordionItem from './AccordionItem'
import { isBoolean } from '../utils'

export const AccordionWrapper = styled.div`
  ${props =>
    !props.isMobile ? BaseStyle : 'overflow-x: overlay; overflow-y: overlay;'}

  display: flex;
  flex-direction: column;
  ${// $FlowFixMe
  themed('Accordion', theme)}
`

export type AccordionProps = {
  variant?: 'default' | 'menu' | 'submenu',
  /** 複数のAccordionが同時に開くことを許可する場合はtrue */
  multiple?: boolean,
  children: React.ChildrenArray<React.Element<typeof AccordionItem>>
}

type State = {
  expanded: Array<boolean>
}

export class Accordion extends React.PureComponent<AccordionProps, State> {
  static Item = AccordionItem

  static defaultProps = {
    variant: 'default'
  }

  static getDerivedStateFromProps (props: AccordionProps, state: State) {
    if (React.Children.count(props.children) !== state.expanded.length) {
      // const active = React.Children.toArray(props.children).map(child => child.props.active || false)
      // if (!props.multiple && active.filter(value => value).length > 2) {
      //   throw new Error('Accordion cannot have multiple `active` items when `multiple` is false')
      // }
      return {
        // Weird flow bug
        // $FlowFixMe
        expanded:
          React.Children.map(
            props.children,
            child => child.props.expanded || false
          ) || []
      }
    }
    return null
  }

  // When children expanded props are changing, rerender the accordion to display accordingly
  componentDidUpdate (prevProps: AccordionProps, prevState: State) {
    const newExpanded =
      React.Children.map(
        this.props.children,
        child => child.props.expanded || false
      ) || []
    const prevPropsExpanded =
      React.Children.map(
        prevProps.children,
        child => child.props.expanded || false
      ) || []

    if (
      JSON.stringify(newExpanded) !== JSON.stringify(prevState.expanded) &&
      JSON.stringify(newExpanded) !== JSON.stringify(prevPropsExpanded)
    ) {
      this.setState({ expanded: newExpanded })
    }
  }

  state = {
    // $FlowFixMe
    expanded:
      React.Children.map(
        this.props.children,
        child => child.props.expanded || false
      ) || []
  }

  onClick = (index: number, externalValue?: boolean) => {
    const expanded = this.props.multiple
      ? this.state.expanded.slice(0)
      : new Array(this.state.expanded.length).fill(false)
    expanded[index] = isBoolean(externalValue)
      ? !!externalValue
      : !expanded[index]
    this.setState({ expanded })
  }

  render () {
    const { props } = this
    const { children, variant } = this.props
    const { expanded } = this.state

    return (
      <AccordionWrapper {...props} expanded={expanded.some(value => value)}>
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            variant,
            expanded: expanded[index],
            onClick: () => this.onClick(index),
            setExpanded: value => this.onClick(index, value)
          })
        })}
      </AccordionWrapper>
    )
  }
}

export default Accordion
