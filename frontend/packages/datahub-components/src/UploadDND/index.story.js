import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'

import UploadDND from '.'

const UploadContainer = styled.div`
  box-sizing: border-box;
  flex-direction: column;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-self: flex-start;
  width: 600px;
  height: 400px;
  border-radius: 20px;
  border: dashed 2px #ffffff;
  background-color: #3b4247;
`

UploadContainer.displayName = 'UploadDND'

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  font-size: 21px;
  opacity: 0.8;
  text-align: center;
  margin-top: 19px;
  font-weight: 600;
  color: #f6f6f6;
`

const DNDViewComponent = () => (
  <UploadContainer>
    <TextContainer>
      <Title>Drag and drop your files.</Title>
    </TextContainer>
  </UploadContainer>
)

storiesOf('UploadDND', module)
  .addDecorator(storyFn => (
    <div
      style={{
        margin: '10px',
        minHeight: '800px',
        padding: '10px',
        backgroundColor: '#3b4247'
      }}
    >
      {storyFn()}
    </div>
  ))
  .addParameters({ component: UploadDND })
  .add('Simple layout', () => (
    <UploadDND>
      <DNDViewComponent />
    </UploadDND>
  ))
  .add('with drag and drop handler function', () => (
    <UploadDND
      onDND={action('We got some files')}
      onError={action('We got got and error')}
      directory
    >
      <DNDViewComponent />
    </UploadDND>
  ))
  .add('with drag and drop handler function and overlay', () => (
    <UploadDND
      onDND={action('We got some files')}
      onError={action('We got got and error')}
      directory
      overlay={({ visible }) =>
        visible ? <div>This is an overlay</div> : false
      }
    >
      <DNDViewComponent />
    </UploadDND>
  ))
