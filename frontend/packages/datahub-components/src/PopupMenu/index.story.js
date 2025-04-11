import React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { Text } from '../index'
import PopupMenu from './PopupMenu'
import PopupMenuContent from './PopupMenuContent'

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`

storiesOf('PopupMenu', module)
  .addParameters({
    component: PopupMenu,
    subcomponents: { PopupMenuContent }
  })
  .addDecorator(storyFn => (
    <div style={{ width: '500px', height: '300px' }}>{storyFn()}</div>
  ))
  .add('Default', () => (
    <PopupMenu
      position={{ top: '10px', left: '10px' }}
      onClose={action('onClose')}
    >
      <PopupMenuContent>
        <RowContainer>
          <Text>設計ファイル</Text>
        </RowContainer>
        <RowContainer>
          <Text>登録日　2020/08/05</Text>
        </RowContainer>
        <RowContainer>
          <Text>登録者　山田太郎</Text>
        </RowContainer>
      </PopupMenuContent>
    </PopupMenu>
  ))
  .add('With styles', () => (
    <PopupMenu
      position={{ top: '10px', left: '10px' }}
      onClose={action('onClose')}
    >
      <PopupMenuContent width='300px' height='300px'>
        <RowContainer>
          <Text>width='300px' height='300px'</Text>
        </RowContainer>
        <RowContainer>
          <Text>設計ファイル</Text>
        </RowContainer>
        <RowContainer>
          <Text>登録日　2020/08/05</Text>
        </RowContainer>
        <RowContainer>
          <Text>登録者　山田太郎</Text>
        </RowContainer>
      </PopupMenuContent>
    </PopupMenu>
  ))
