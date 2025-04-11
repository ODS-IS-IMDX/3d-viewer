// Copyright (c) 2025 NTT InfraNet
import { configure } from '@storybook/react'

// automatically import all files ending in *.stories.js
const req = require.context('..', true, /.story.js$/)
function loadStories () {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
