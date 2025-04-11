// Copyright (c) 2025 NTT InfraNet
import { configure, addDecorator } from '@storybook/react'
import { withPropsTable } from 'storybook-addon-react-docgen'

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /.story.js$/)
function loadStories () {
  req.keys().forEach(filename => req(filename))
}

addDecorator(withPropsTable)
configure(loadStories, module)
