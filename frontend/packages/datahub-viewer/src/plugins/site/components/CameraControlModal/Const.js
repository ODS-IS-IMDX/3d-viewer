// Copyright (c) 2025 NTT InfraNet
// @flow
import { type FormValues } from './CameraControlModal'
import { CameraEventType } from 'cesium'

/** プリセット種別 */
export const PresetType = {
  DEFAULT: 0,
  ARC_GIS: 1
}

/** プリセット */
export const Presets: { [string]: FormValues } = {
  default: {
    horizontal: JSON.stringify([CameraEventType.LEFT_DRAG]),
    rotate: JSON.stringify([CameraEventType.MIDDLE_DRAG]),
    zoom: JSON.stringify([CameraEventType.WHEEL, CameraEventType.PINCH]),
    zoomIn: '',
    zoomOut: '',
    moveUp: '',
    moveDown: '',
    moveFoward: '',
    moveBackward: '',
    moveLeft: '',
    moveRight: '',
    rotateUp: '',
    rotateDown: '',
    rotateLeft: '',
    rotateRight: '',
    twistLeft: '',
    twistRight: ''
  },
  arcGis: {
    horizontal: JSON.stringify([CameraEventType.LEFT_DRAG]),
    rotate: JSON.stringify([CameraEventType.RIGHT_DRAG]),
    zoom: JSON.stringify([CameraEventType.WHEEL, CameraEventType.PINCH]),
    zoomIn: 'Semicolon',
    zoomOut: 'Minus',
    moveUp: 'ArrowUp',
    moveDown: 'ArrowDown',
    moveFoward: 'KeyU',
    moveBackward: 'KeyJ',
    moveLeft: 'ArrowLeft',
    moveRight: 'ArrowRight',
    rotateUp: 'KeyW',
    rotateDown: 'KeyS',
    rotateLeft: 'KeyA',
    rotateRight: 'KeyD',
    twistLeft: '',
    twistRight: ''
  }
}

/**
 * ユーザのキー設定自由入力で、設定対象とするキーのコード
 */
export const SelectableKeys: Array<string> = [
  // A~Z
  'KeyA',
  'KeyB',
  'KeyC',
  'KeyD',
  'KeyE',
  'KeyF',
  'KeyG',
  'KeyH',
  'KeyI',
  'KeyJ',
  'KeyK',
  'KeyL',
  'KeyM',
  'KeyN',
  'KeyO',
  'KeyP',
  'KeyQ',
  'KeyR',
  'KeyS',
  'KeyT',
  'KeyU',
  'KeyV',
  'KeyW',
  'KeyX',
  'KeyY',
  'KeyZ',
  // 0~9
  'Digit0',
  'Digit1',
  'Digit2',
  'Digit3',
  'Digit4',
  'Digit5',
  'Digit6',
  'Digit7',
  'Digit8',
  'Digit9',
  // その他
  'Minus', // -
  'Equal', // ^
  'IntlYen', // \
  'BracketLeft', // @
  'BracketRight', // [
  'Semicolon', // ;
  'Quote', // :
  'Backslash', // ]
  'Comma', // ,
  'Period', // .
  'Slash', // /
  'IntlRo', // \
  // 十字キー
  'ArrowUp', // ↑
  'ArrowDown', // ↓
  'ArrowLeft', // ←
  'ArrowRight' // →
]

/**
 * 入力されたコードと表示用のコードのマッピング
 */
export const MappingCode2Display: Array<Array<string>> = [
  ['Minus', '－'],
  ['Equal', '^'],
  ['IntlYen', '￥'],
  ['BracketLeft', '＠'],
  ['BracketRight', '［'],
  ['Semicolon', '＋'],
  ['Quote', '：'],
  ['Backslash', '］'],
  ['Comma', ','],
  ['Period', '.'],
  ['Slash', '/'],
  ['IntlRo', '_'],
  ['ArrowUp', '↑'],
  ['ArrowDown', '↓'],
  ['ArrowLeft', '←'],
  ['ArrowRight', '→']
]
