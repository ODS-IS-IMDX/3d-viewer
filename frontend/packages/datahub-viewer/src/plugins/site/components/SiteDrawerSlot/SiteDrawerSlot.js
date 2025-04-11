// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { Drawer } from '@ehv/datahub-components'
import { Slot } from '@ehv/react-slots'

export default class SiteDrawerSlots extends React.PureComponent {
  drawer = React.createRef()

  state = {
    drawerHeight: null
  }

  onFills = () => {
    const content = this.drawer.current && this.drawer.current.content
    const resizer =
      this.drawer.current &&
      this.drawer.current.resizer.current.getBoundingClientRect()

    if (content && content.current && content.current.hasChildNodes()) {
      const height = content.current.childNodes[0].scrollHeight + resizer.height
      this.setState({ drawerHeight: height })
    } else {
      this.setState({ drawerHeight: 0 })
    }
  }

  render () {
    const { drawerHeight } = this.state

    return (
      <Slot name='site.drawer' onFills={this.onFills}>
        {fills =>
          fills &&
          !!fills.length && (
            <Drawer
              ref={this.drawer}
              snapping={[1, 0.5, 0.2, 0]}
              height={drawerHeight}
              isMinimum={
                (fills &&
                  fills[fills.length - 1] &&
                  fills[fills.length - 1].props.isMinimum) ??
                false
              }
            >
              {fills &&
                fills[fills.length - 1] &&
                fills[fills.length - 1].render()}
            </Drawer>
          )
        }
      </Slot>
    )
  }
}
