import React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import styled from 'styled-components'
import { Text } from '@ehv/design-system'

import UploadFileBox from '.'

const Link = styled(Text)`
  cursor: pointer;
`

const acceptedTypes = ['.las', '.laz', '.tif', '.kml', '.kmz']

storiesOf('UploadFileBox', module)
  .addDecorator(storyFn => <div style={{ margin: '10px' }}>{storyFn()}</div>)
  .addParameters({ component: UploadFileBox })
  .add('Default', () => (
    <UploadFileBox
      onAddFiles={action('Add file')}
      acceptedTypes={acceptedTypes.join(',')}
      renderContent={() => (
        <>
          <Text size={2} color='#8e96a0'>
            {`ファイルをドロップ(${acceptedTypes.join(',')}) or `}
          </Text>
          <Link size={2} ml={1} color='#16ABE3'>
            クリックしてファイルを選択
          </Link>
        </>
      )}
    />
  ))
  .add('With width and height', () => (
    <UploadFileBox
      onAddFiles={action('Add file')}
      height='150px'
      width='100%'
      acceptedTypes={acceptedTypes.join(',')}
      renderContent={() => (
        <>
          <Text size={2} color='#8e96a0'>
            {`ファイルをドロップ(${acceptedTypes.join(',')}) or `}
          </Text>
          <Link size={2} ml={1} color='#16ABE3'>
            クリックしてファイルを選択
          </Link>
        </>
      )}
    />
  ))
  .add('複数ファイルの選択', () => (
    <UploadFileBox
      onAddFiles={action('Add file')}
      multiple
      acceptedTypes={acceptedTypes.join(',')}
      renderContent={() => (
        <>
          <Text size={2} color='#8e96a0'>
            {`複数ファイルをドロップ(${acceptedTypes.join(',')}) or `}
          </Text>
          <Link size={2} ml={1} color='#16ABE3'>
            クリックしてファイルを選択
          </Link>
        </>
      )}
    />
  ))
