// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { Fill } from '@ehv/react-slots'
import { Modal } from '@ehv/datahub-components'
import { Button } from 'rebass'

import PluginList from './components/PluginList'

class PluginsPlugin extends React.PureComponent {
  state = {
    open: false
  }

  onClick = () => {
    this.setState({
      open: true
    })
  }

  onClose = () => {
    this.setState({
      open: false
    })
  }

  render () {
    const { Plugin } = this.props.core
    return (
      <Plugin>
        <Fill slot='core.navbar'>
          {() => (
            <Button mx={2} onClick={this.onClick}>
              Manage Plugins
            </Button>
          )}
        </Fill>
        {this.state.open && (
          <Modal width={1 / 2} onClose={this.onClose}>
            <PluginList />
          </Modal>
        )}
      </Plugin>
    )
  }
}

PluginsPlugin.plugin = {
  name: 'plugins'
}

export default PluginsPlugin
