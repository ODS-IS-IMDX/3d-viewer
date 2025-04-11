import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Modal from './Modal'
import ModalHeader from './ModalHeader'
import ModalFooter from './ModalFooter'
import ModalContent from './ModalContent'
import ModalController from './ModalController'

storiesOf('Modal', module)
  .addParameters({
    component: Modal,
    subcomponents: { ModalHeader, ModalFooter, ModalContent, ModalController }
  })
  .addDecorator(storyFn => (
    <div style={{ width: '600px', height: '600px' }}>{storyFn()}</div>
  ))
  .add('Default', () => (
    <Modal
      header={<Modal.Header>Header</Modal.Header>}
      footer={<Modal.Footer>Footer</Modal.Footer>}
      variant='default'
      closeButton
      onClose={action('onClose')}
    >
      <div>Content</div>
    </Modal>
  ))
  .add('Variant transparent', () => (
    <Modal
      header={<Modal.Header>Header</Modal.Header>}
      footer={<Modal.Footer>Footer</Modal.Footer>}
      variant='transparent'
      closeButton
      onClose={action('onClose')}
    >
      <div>Content</div>
    </Modal>
  ))
  .add('Variant small', () => (
    <Modal
      header={<Modal.Header>Header</Modal.Header>}
      footer={<Modal.Footer>Footer</Modal.Footer>}
      variant='small'
      closeButton
      onClose={action('onClose')}
    >
      <div>Content</div>
    </Modal>
  ))
  .add('Variant fixed640', () => (
    <Modal
      header={<Modal.Header>Header</Modal.Header>}
      footer={<Modal.Footer>Footer</Modal.Footer>}
      variant='fixed640'
      closeButton
      onClose={action('onClose')}
    >
      <div>Content</div>
    </Modal>
  ))
  .add('Closeボタン非表示', () => (
    <Modal
      header={<Modal.Header>Header</Modal.Header>}
      footer={<Modal.Footer>Footer</Modal.Footer>}
      variant='default'
      closeButton={false}
      onClose={action('onClose')}
    >
      <div>Content</div>
    </Modal>
  ))
  .add('All overflowing', () => (
    <Modal header={<div>Header</div>} footer={<div>Footer</div>}>
      <div style={{ height: '200vh' }}>Content</div>
    </Modal>
  ))
  .add('Simple', () => (
    <Modal>
      <div>Content</div>
    </Modal>
  ))
  .add('Simple overflowing', () => (
    <Modal>
      <div style={{ height: '200vh' }}>Content</div>
    </Modal>
  ))
  .add('Header', () => (
    <Modal header={<div>Header</div>}>
      <div>Content</div>
    </Modal>
  ))
  .add('Header overflowing', () => (
    <Modal header={<div>Header</div>}>
      <div style={{ height: '200vh' }}>Content</div>
    </Modal>
  ))
  .add('Footer', () => (
    <Modal footer={<div>Footer</div>}>
      <div>Content</div>
    </Modal>
  ))
  .add('Footer overflowing', () => (
    <Modal footer={<div>Footer</div>}>
      <div style={{ height: '200vh' }}>Content</div>
    </Modal>
  ))
