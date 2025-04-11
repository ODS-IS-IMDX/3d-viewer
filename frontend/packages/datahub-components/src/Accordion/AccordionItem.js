// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { themed } from '@ehv/design-system'

import theme from './theme'

import AccordionItemHeader from './AccordionItemHeader'
import AccordionItemContent from './AccordionItemContent'

type HeaderProps = {
  variant: string,
  expanded?: boolean,
  onClick?: () => void
}

type AccordionItemProps = {
  variant: string,
  expanded?: boolean,
  header: React.Node | ((props: HeaderProps) => React.Node),
  onClick?: () => void,
  setExpanded: (value: boolean) => void,
  children: React.Node
}

export const AccordionItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${// $FlowFixMe
  ({ expanded }) => !expanded && `flex-shrink: 0`}
  ${// $FlowFixMe
  themed('Accordion.Item', theme.Item)}
`

export class AccordionItem extends React.PureComponent<AccordionItemProps> {
  static Header = AccordionItemHeader

  static defaultProps = {
    variant: 'default'
  }

  setExpanded (expanded: boolean) {
    if (this.props.setExpanded) {
      this.props.setExpanded(expanded)
    }
  }

  render () {
    const { header, children, onClick, ...props } = this.props

    return (
      <AccordionItemWrapper {...props}>
        {typeof header === 'function' ? (
          header({ ...props, onClick })
        ) : (
          <AccordionItemHeader {...props} onClick={onClick}>
            {header}
          </AccordionItemHeader>
        )}
        <AccordionItemContent {...props}>{children}</AccordionItemContent>
      </AccordionItemWrapper>
    )
  }
}

export default AccordionItem
