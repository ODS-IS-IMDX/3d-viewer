// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { withNamespaces, type WithNamespaces } from 'react-i18next'
import {
  Flex,
  // $FlowFixMe
  InputWithLabel
} from '@ehv/datahub-components'
import { ErrorMessage } from './ErrorMessage'
import { SelectableKeys, MappingCode2Display } from './Const'
import usePrevious from './usePrevious'

// styles

const InputWithLabelWrapper = styled(InputWithLabel)`
  margin-top: 10px;
`

const TabPanelBox = styled(Flex)`
  flex-direction: column;
  padding: 10px;
  background-color: white;
`

// types

export type KeyCameraSettingsMenuProps = WithNamespaces & {
  initialValue: {
    zoomIn: string,
    zoomOut: string,
    moveUp: string,
    moveDown: string,
    moveFoward: string,
    moveBackward: string,
    moveLeft: string,
    moveRight: string,
    rotateUp: string,
    rotateDown: string,
    rotateLeft: string,
    rotateRight: string,
    twistLeft: string,
    twistRight: string
  },
  errors?: any,
  /** formik.setFieldValue */
  setFieldValue: (
    fieldName: string,
    value: any,
    shouldValidate?: boolean
  ) => void
}

// components

/**
 * キーボード設定メニュー
 */
const KeyCameraSettingsMenu = ({
  t,
  initialValue,
  errors = {},
  setFieldValue
}: KeyCameraSettingsMenuProps) => {
  const prevInitialValue = usePrevious(initialValue)
  /** キーコードとその表示用の値を取得 */
  const getDisplayKeyCode = (
    code: string
  ): { code: string | null, displayCode: string | null } => {
    let result = {
      code: null,
      displayCode: null
    }

    if (code === 'Backspace') {
      // BackSpaceで未割り当てにする
      result = { code: '', displayCode: '' }
    } else {
      // 設定可能なキーのみ対象
      if (SelectableKeys.indexOf(code) !== -1) {
        // キーのコードを表示用に整える
        let displayCode = code
        if (code.indexOf('Key') !== -1) {
          displayCode = code.replace('Key', '')
        } else if (code.indexOf('Digit') !== -1) {
          displayCode = code.replace('Digit', '')
        } else {
          for (const code2Display of MappingCode2Display) {
            if (code === code2Display[0]) {
              displayCode = code2Display[1]
              break
            }
          }
        }

        result = {
          code,
          displayCode
        }
      } else {
        // 対象外の場合は設定しない
        result = { code: null, displayCode: null }
      }
    }

    return result
  }

  /**
   * KeyDownイベント
   * @param event onKeyDownイベントオブジェクト
   * @param target formikのname
   * @param setValue 表示用の値を適用するメソッド
   */
  const onHandleKeyDown = (
    // $FlowFixMe
    event: React.KeyboardEvent<HTMLInputElement>,
    target: string,
    setValue: (value: string) => void
  ) => {
    const { code, displayCode } = getDisplayKeyCode(event.nativeEvent.code)
    if (code != null && displayCode != null) {
      // 画面とフォーム値に適用
      setValue(displayCode)
      setFieldValue(target, code)
    }
  }

  // 各項目値
  const [zoomInValue, setZoomInValue] = useState('')
  const [zoomOutValue, setZoomOutValue] = useState('')
  const [moveUpValue, setMoveUpValue] = useState('')
  const [moveDownValue, setMoveDownValue] = useState('')
  const [moveFowardValue, setMoveFowardValue] = useState('')
  const [moveBackwardValue, setMoveBackwardValue] = useState('')
  const [moveLeftValue, setMoveLeftValue] = useState('')
  const [moveRightValue, setMoveRightValue] = useState('')
  const [rotateUpValue, setRotateUpValue] = useState('')
  const [rotateDownValue, setRotateDownValue] = useState('')
  const [rotateLeftValue, setRotateLeftValue] = useState('')
  const [rotateRightValue, setRotateRightValue] = useState('')
  const [twistLeftValue, setTwistLeftValue] = useState('')
  const [twistRightValue, setTwistRightValue] = useState('')

  useEffect(() => {
    if (JSON.stringify(initialValue) !== JSON.stringify(prevInitialValue)) {
      // 初期値の変更(コンポーネント外からの変更)を検知して画面に反映
      setZoomInValue(getDisplayKeyCode(initialValue.zoomIn).displayCode ?? '')
      setZoomOutValue(getDisplayKeyCode(initialValue.zoomOut).displayCode ?? '')
      setMoveUpValue(getDisplayKeyCode(initialValue.moveUp).displayCode ?? '')
      setMoveDownValue(
        getDisplayKeyCode(initialValue.moveDown).displayCode ?? ''
      )
      setMoveFowardValue(
        getDisplayKeyCode(initialValue.moveFoward).displayCode ?? ''
      )
      setMoveBackwardValue(
        getDisplayKeyCode(initialValue.moveBackward).displayCode ?? ''
      )
      setMoveLeftValue(
        getDisplayKeyCode(initialValue.moveLeft).displayCode ?? ''
      )
      setMoveRightValue(
        getDisplayKeyCode(initialValue.moveRight).displayCode ?? ''
      )
      setRotateUpValue(
        getDisplayKeyCode(initialValue.rotateUp).displayCode ?? ''
      )
      setRotateDownValue(
        getDisplayKeyCode(initialValue.rotateDown).displayCode ?? ''
      )
      setRotateLeftValue(
        getDisplayKeyCode(initialValue.rotateLeft).displayCode ?? ''
      )
      setRotateRightValue(
        getDisplayKeyCode(initialValue.rotateRight).displayCode ?? ''
      )
      setTwistLeftValue(
        getDisplayKeyCode(initialValue.twistLeft).displayCode ?? ''
      )
      setTwistRightValue(
        getDisplayKeyCode(initialValue.twistRight).displayCode ?? ''
      )
    }
  }, [initialValue, prevInitialValue])

  return (
    <TabPanelBox>
      {/** ズームイン */}
      <InputWithLabelWrapper
        editable
        label={t('cameraConfig.key.zoomIn')}
        name='zoomIn'
        type='text'
        placeholder={t('cameraConfig.key.placeholder')}
        value={zoomInValue}
        onChange={() => {}}
        onKeyDown={event => onHandleKeyDown(event, 'zoomIn', setZoomInValue)}
      />
      {errors.zoomIn != null && <ErrorMessage>{errors.zoomIn}</ErrorMessage>}
      {/** ズームアウト */}
      <InputWithLabelWrapper
        editable
        label={t('cameraConfig.key.zoomOut')}
        name='zoomOut'
        type='text'
        placeholder={t('cameraConfig.key.placeholder')}
        value={zoomOutValue}
        onChange={() => {}}
        onKeyDown={event => onHandleKeyDown(event, 'zoomOut', setZoomOutValue)}
      />
      {errors.zoomOut != null && <ErrorMessage>{errors.zoomOut}</ErrorMessage>}
      {/** 視点上昇 */}
      <InputWithLabelWrapper
        editable
        label={t('cameraConfig.key.moveUp')}
        name='moveUp'
        type='text'
        placeholder={t('cameraConfig.key.placeholder')}
        value={moveUpValue}
        onChange={() => {}}
        onKeyDown={event => onHandleKeyDown(event, 'moveUp', setMoveUpValue)}
      />
      {errors.moveUp != null && <ErrorMessage>{errors.moveUp}</ErrorMessage>}
      {/** 視点下降 */}
      <InputWithLabelWrapper
        editable
        label={t('cameraConfig.key.moveDown')}
        name='moveDown'
        type='text'
        placeholder={t('cameraConfig.key.placeholder')}
        value={moveDownValue}
        onChange={() => {}}
        onKeyDown={event =>
          onHandleKeyDown(event, 'moveDown', setMoveDownValue)
        }
      />
      {errors.moveDown != null && (
        <ErrorMessage>{errors.moveDown}</ErrorMessage>
      )}
      {/** 視点前進 */}
      <InputWithLabelWrapper
        editable
        label={t('cameraConfig.key.moveFoward')}
        name='moveFoward'
        type='text'
        placeholder={t('cameraConfig.key.placeholder')}
        value={moveFowardValue}
        onChange={() => {}}
        onKeyDown={event =>
          onHandleKeyDown(event, 'moveFoward', setMoveFowardValue)
        }
      />
      {errors.moveFoward != null && (
        <ErrorMessage>{errors.moveFoward}</ErrorMessage>
      )}
      {/** 視点後退 */}
      <InputWithLabelWrapper
        editable
        label={t('cameraConfig.key.moveBackward')}
        name='moveBackward'
        type='text'
        placeholder={t('cameraConfig.key.placeholder')}
        value={moveBackwardValue}
        onChange={() => {}}
        onKeyDown={event =>
          onHandleKeyDown(event, 'moveBackward', setMoveBackwardValue)
        }
      />
      {errors.moveBackward != null && (
        <ErrorMessage>{errors.moveBackward}</ErrorMessage>
      )}
      {/** 視点左移動 */}
      <InputWithLabelWrapper
        editable
        label={t('cameraConfig.key.moveLeft')}
        name='moveLeft'
        type='text'
        placeholder={t('cameraConfig.key.placeholder')}
        value={moveLeftValue}
        onChange={() => {}}
        onKeyDown={event =>
          onHandleKeyDown(event, 'moveLeft', setMoveLeftValue)
        }
      />
      {errors.moveLeft != null && (
        <ErrorMessage>{errors.moveLeft}</ErrorMessage>
      )}
      {/** 視点右移動 */}
      <InputWithLabelWrapper
        editable
        label={t('cameraConfig.key.moveRight')}
        name='moveRight'
        type='text'
        placeholder={t('cameraConfig.key.placeholder')}
        value={moveRightValue}
        onChange={() => {}}
        onKeyDown={event =>
          onHandleKeyDown(event, 'moveRight', setMoveRightValue)
        }
      />
      {errors.moveRight != null && (
        <ErrorMessage>{errors.moveRight}</ErrorMessage>
      )}
      {/** 視点上回転 */}
      <InputWithLabelWrapper
        editable
        label={t('cameraConfig.key.rotateUp')}
        name='rotateUp'
        type='text'
        placeholder={t('cameraConfig.key.placeholder')}
        value={rotateUpValue}
        onChange={() => {}}
        onKeyDown={event =>
          onHandleKeyDown(event, 'rotateUp', setRotateUpValue)
        }
      />
      {errors.rotateUp != null && (
        <ErrorMessage>{errors.rotateUp}</ErrorMessage>
      )}
      {/** 視点下回転 */}
      <InputWithLabelWrapper
        editable
        label={t('cameraConfig.key.rotateDown')}
        name='rotateDown'
        type='text'
        placeholder={t('cameraConfig.key.placeholder')}
        value={rotateDownValue}
        onChange={() => {}}
        onKeyDown={event =>
          onHandleKeyDown(event, 'rotateDown', setRotateDownValue)
        }
      />
      {errors.rotateDown != null && (
        <ErrorMessage>{errors.rotateDown}</ErrorMessage>
      )}
      {/** 視点左回転 */}
      <InputWithLabelWrapper
        editable
        label={t('cameraConfig.key.rotateLeft')}
        name='rotateLeft'
        type='text'
        placeholder={t('cameraConfig.key.placeholder')}
        value={rotateLeftValue}
        onChange={() => {}}
        onKeyDown={event =>
          onHandleKeyDown(event, 'rotateLeft', setRotateLeftValue)
        }
      />
      {errors.rotateLeft != null && (
        <ErrorMessage>{errors.rotateLeft}</ErrorMessage>
      )}
      {/** 視点右回転 */}
      <InputWithLabelWrapper
        editable
        label={t('cameraConfig.key.rotateRight')}
        name='rotateRight'
        type='text'
        placeholder={t('cameraConfig.key.placeholder')}
        value={rotateRightValue}
        onChange={() => {}}
        onKeyDown={event =>
          onHandleKeyDown(event, 'rotateRight', setRotateRightValue)
        }
      />
      {errors.rotateRight != null && (
        <ErrorMessage>{errors.rotateRight}</ErrorMessage>
      )}
      {/** 視点左ひねり */}
      <InputWithLabelWrapper
        editable
        label={t('cameraConfig.key.twistLeft')}
        name='twistLeft'
        type='text'
        placeholder={t('cameraConfig.key.placeholder')}
        value={twistLeftValue}
        onChange={() => {}}
        onKeyDown={event =>
          onHandleKeyDown(event, 'twistLeft', setTwistLeftValue)
        }
      />
      {errors.twistLeft != null && (
        <ErrorMessage>{errors.twistLeft}</ErrorMessage>
      )}
      {/** 視点右ひねり */}
      <InputWithLabelWrapper
        editable
        label={t('cameraConfig.key.twistRight')}
        name='twistRight'
        type='text'
        placeholder={t('cameraConfig.key.placeholder')}
        value={twistRightValue}
        onChange={() => {}}
        onKeyDown={event =>
          onHandleKeyDown(event, 'twistRight', setTwistRightValue)
        }
      />
      {errors.twistRight != null && (
        <ErrorMessage>{errors.twistRight}</ErrorMessage>
      )}
    </TabPanelBox>
  )
}

export default withNamespaces('site')(KeyCameraSettingsMenu)
