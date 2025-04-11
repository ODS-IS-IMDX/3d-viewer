// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { Box, Flex, Checkbox } from '@ehv/datahub-components'

export class PluginList extends React.PureComponent {
  onChange = name => event => {
    if (event.target.checked) {
      this.props.load(name)
    } else {
      this.props.unload(name)
    }
  }

  render () {
    return (
      <Box>
        <Flex>
          <Box width={1} px={2}>
            Name
          </Box>
          <Box width={50} px={2}>
            Loaded
          </Box>
        </Flex>
        {this.props.plugins.map((plugin, index) => (
          <Flex key={index}>
            <Box width={1} px={2}>
              {plugin.name}
            </Box>
            <Box width={50} px={2}>
              <Checkbox
                checked={plugin.loaded}
                onChange={this.onChange(plugin.name)}
              />
            </Box>
          </Flex>
        ))}
      </Box>
    )
  }
}
