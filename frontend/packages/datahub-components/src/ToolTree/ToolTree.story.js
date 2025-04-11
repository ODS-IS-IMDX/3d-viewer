import React from 'react'
import { storiesOf } from '@storybook/react'

import {
  ToolTreeItem,
  ToolTreeItemText,
  ToolTreeDisabledItemText,
  ToolTreeTools,
  ToolTreeLine,
  IconUploader,
  IconViewer
} from './ToolTree'

storiesOf('ToolTree', module)
  .addParameters({
    subcomponents: {
      ToolTreeItem,
      ToolTreeItemText,
      ToolTreeDisabledItemText,
      ToolTreeTools,
      ToolTreeLine,
      IconUploader,
      IconViewer
    }
  })
  .add('ToolTreeItem', () => (
    <ToolTreeItem>
      <div>ToolTreeItem</div>
    </ToolTreeItem>
  ))
  .add('ToolTreeItemText', () => (
    <ToolTreeItemText>
      <div>ToolTreeItemText</div>
    </ToolTreeItemText>
  ))
  .add('ToolTreeDisabledItemText', () => (
    <ToolTreeDisabledItemText>
      <div>ToolTreeDisabledItemText</div>
    </ToolTreeDisabledItemText>
  ))
  .add('ToolTreeTools', () => (
    <ToolTreeTools>
      <div>ToolTreeTools</div>
    </ToolTreeTools>
  ))
  .add('ToolTreeLine', () => (
    <ToolTreeLine>
      <div>ToolTreeLine</div>
    </ToolTreeLine>
  ))
  .add('IconUploader', () => (
    <IconUploader>
      <div>IconUploader</div>
    </IconUploader>
  ))
  .add('IconViewer', () => (
    <IconViewer>
      <div>IconViewer</div>
    </IconViewer>
  ))
