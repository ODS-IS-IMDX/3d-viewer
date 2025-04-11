// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Formik, Form, type FormikProps } from 'formik'
import type { WithNamespaces, TFunction } from 'react-i18next'
import * as Yup from 'yup'
import {
  Button,
  Dropdown,
  Modal,
  ModalFooter,
  ModalHeader,
  // $FlowFixMe
  Tabs
} from '@ehv/datahub-components'
import MouseCameraSettingsMenu from './MouseCameraSettingsMenu'
import KeyCameraSettingsMenu from './KeyCameraSettingsMenu'
import { Presets, PresetType } from './Const'
import usePrevious from './usePrevious'

// styles

const FooterWrapper = styled(ModalFooter)`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: flex-end;
`
const TabPanelWrapperMouse = styled(Tabs.TabPanel)`
  min-height: 250px;
`

const TabPanelWrapper = styled(Tabs.TabPanel)`
  height: 250px;
`

const ModalContentStyle = `
  overflow-x: unset;
  overflow-y: unset;

  &:hover {
    overflow-x: unset;
    overflow-y: unset;
  }
`

// types

export type FormValues = {
  // マウス操作（JSON配列）
  horizontal: string,
  rotate: string,
  zoom: string,
  // キー操作
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
}
export type CameraControlModalProps = WithNamespaces & {
  onClose: () => void,
  onSubmit: (values: FormValues) => void,
  initialValues?: FormValues
}
type PresetOption = {
  label: string,
  value: number
}
type FormikFormProps = {
  t: TFunction,
  initialValues: FormValues,
  values: FormValues,
  errors: any,
  isValid: boolean,
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
  setIsSubmitDisabled: (disabled: boolean) => void,
  onChangeTab: (index: number) => void,
  tabIndex: number
}

// components

const FORM_ID = 'cameraControlSettingsForm'

/**
 * カメラコントロールモーダルメニュー
 */
const CameraControlModal = ({
  t,
  onClose,
  onSubmit,
  initialValues = Presets['default']
}: CameraControlModalProps) => {
  /** プリセット選択項目 */
  const presetOptions: Array<PresetOption> = [
    {
      label: t('cameraConfig.preset.default'),
      value: PresetType.DEFAULT
    },
    {
      label: t('cameraConfig.preset.arcGis'),
      value: PresetType.ARC_GIS
    }
  ]

  // マウス操作バリデーションチェック
  const validationMouseSettings = (value: any, context: any) => {
    let result = true
    const { horizontal, rotate, zoom } = context.from[0].value

    // 重複チェック
    let dupCount = 0
    if (value === horizontal) dupCount++
    if (value === rotate) dupCount++
    if (value === zoom) dupCount++

    if (dupCount > 1) result = false
    return result
  }
  // キー操作バリデーションチェック
  const validationKeySettings = (value: any, context: any) => {
    let result = true
    const {
      zoomIn,
      zoomOut,
      moveUp,
      moveDown,
      moveFoward,
      moveBackward,
      moveLeft,
      moveRight,
      rotateUp,
      rotateDown,
      rotateLeft,
      rotateRight,
      twistLeft,
      twistRight
    } = context.from[0].value

    // 重複チェック
    if (value != null && value !== '') {
      // 割り当てなしは重複可
      let dupCount = 0
      if (value === zoomIn) dupCount++
      if (value === zoomOut) dupCount++
      if (value === moveUp) dupCount++
      if (value === moveDown) dupCount++
      if (value === moveFoward) dupCount++
      if (value === moveBackward) dupCount++
      if (value === moveLeft) dupCount++
      if (value === moveRight) dupCount++
      if (value === rotateUp) dupCount++
      if (value === rotateDown) dupCount++
      if (value === rotateLeft) dupCount++
      if (value === rotateRight) dupCount++
      if (value === twistLeft) dupCount++
      if (value === twistRight) dupCount++

      if (dupCount > 1) result = false
    }

    return result
  }
  // バリデーションチェック定義
  const validationSchema = Yup.object().shape({
    // マウス操作
    horizontal: Yup.string().test(
      'duplicate',
      t('cameraConfig.mouse.errors.duplicate'),
      validationMouseSettings
    ),
    rotate: Yup.string().test(
      'duplicate',
      t('cameraConfig.mouse.errors.duplicate'),
      validationMouseSettings
    ),
    zoom: Yup.string().test(
      'duplicate',
      t('cameraConfig.mouse.errors.duplicate'),
      validationMouseSettings
    ),
    // キー操作
    zoomIn: Yup.string().test(
      'duplicate',
      t('cameraConfig.key.errors.duplicate'),
      validationKeySettings
    ),
    zoomOut: Yup.string().test(
      'duplicate',
      t('cameraConfig.key.errors.duplicate'),
      validationKeySettings
    ),
    moveUp: Yup.string().test(
      'duplicate',
      t('cameraConfig.key.errors.duplicate'),
      validationKeySettings
    ),
    moveDown: Yup.string().test(
      'duplicate',
      t('cameraConfig.key.errors.duplicate'),
      validationKeySettings
    ),
    moveFoward: Yup.string().test(
      'duplicate',
      t('cameraConfig.key.errors.duplicate'),
      validationKeySettings
    ),
    moveBackward: Yup.string().test(
      'duplicate',
      t('cameraConfig.key.errors.duplicate'),
      validationKeySettings
    ),
    moveLeft: Yup.string().test(
      'duplicate',
      t('cameraConfig.key.errors.duplicate'),
      validationKeySettings
    ),
    moveRight: Yup.string().test(
      'duplicate',
      t('cameraConfig.key.errors.duplicate'),
      validationKeySettings
    ),
    rotateUp: Yup.string().test(
      'duplicate',
      t('cameraConfig.key.errors.duplicate'),
      validationKeySettings
    ),
    rotateDown: Yup.string().test(
      'duplicate',
      t('cameraConfig.key.errors.duplicate'),
      validationKeySettings
    ),
    rotateLeft: Yup.string().test(
      'duplicate',
      t('cameraConfig.key.errors.duplicate'),
      validationKeySettings
    ),
    rotateRight: Yup.string().test(
      'duplicate',
      t('cameraConfig.key.errors.duplicate'),
      validationKeySettings
    ),
    twistLeft: Yup.string().test(
      'duplicate',
      t('cameraConfig.key.errors.duplicate'),
      validationKeySettings
    ),
    twistRight: Yup.string().test(
      'duplicate',
      t('cameraConfig.key.errors.duplicate'),
      validationKeySettings
    )
  })

  /**
   * プリセット変更イベント
   */
  const handlePresetChange = (option: PresetOption) => {
    setPresetValue(option)
    // プリセットの内容を適用
    let preset: FormValues | null = null
    switch (option.value) {
      case PresetType.DEFAULT:
        preset = Presets['default']
        break
      case PresetType.ARC_GIS:
        preset = Presets['arcGis']
        break
      default:
        break
    }
    if (
      preset != null &&
      formikRef.current != null &&
      formikRef.current.setFieldValue
    ) {
      const setFieldValue = formikRef.current.setFieldValue
      for (const [key, value] of Object.entries(preset)) {
        setFieldValue(key, value, true)
      }
    }
  }

  const formikRef = React.useRef(null)
  // プリセット
  const [presetValue, setPresetValue] = React.useState(presetOptions[0])
  // 適用ボタンの活性状態
  const [isSubmitDisable, setIsSubmitDisabled] = React.useState(false)

  const [tabIndex, setTabIndex] = React.useState(0)

  return (
    <Modal
      onClose={onClose}
      modalContentStyled={tabIndex === 0 ? ModalContentStyle : null}
      backgroundColor='#ecf0f3'
      header={() => <ModalHeader>{t('cameraConfig.title')}</ModalHeader>}
      footer={() => (
        <FooterWrapper>
          <Dropdown
            flex={0.7}
            marginRight={'10px'}
            label={t('cameraConfig.preset.label')}
            name={'preset'}
            options={presetOptions}
            value={presetValue}
            onChange={handlePresetChange}
          />
          <Button
            flex={0.1}
            type='submit'
            form={FORM_ID}
            disabled={isSubmitDisable}
          >
            {t('cameraConfig.submit')}
          </Button>
        </FooterWrapper>
      )}
    >
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={values => {
          onSubmit(values)
          onClose()
        }}
      >
        {(props: FormikProps<FormValues>) => {
          return (
            <FormikForm
              t={t}
              initialValues={initialValues}
              values={props.values}
              errors={props.errors}
              isValid={props.isValid}
              setFieldValue={props.setFieldValue}
              setIsSubmitDisabled={setIsSubmitDisabled}
              onChangeTab={setTabIndex}
              tabIndex={tabIndex}
            />
          )
        }}
      </Formik>
    </Modal>
  )
}

/**
 * Form本体
 * isValidをFormik外へ伝搬するためにuseEffectを用いるので、別でコンポーネントを定義
 */
const FormikForm = ({
  t,
  initialValues,
  values,
  errors,
  isValid,
  setFieldValue,
  setIsSubmitDisabled,
  onChangeTab,
  tabIndex
}: FormikFormProps) => {
  // フォームに表示させる値
  const [formValues, setFormValues] = React.useState(initialValues)
  // 変更前の値
  const prevValues = usePrevious(values)

  React.useEffect(() => {
    // フォームの値変更を検知して、画面上にも適用する
    if (JSON.stringify(values) !== JSON.stringify(prevValues)) {
      setFormValues(values)
    }
  }, [values, prevValues, setFieldValue])

  React.useEffect(() => {
    // 画面上の値をフォーム値にも反映させる
    for (const [key, value] of Object.entries(formValues)) {
      setFieldValue(key, value, true)
    }
  }, [formValues, setFieldValue])

  React.useEffect(() => {
    // Submitの活性切替を親コンポーネントに通知
    setIsSubmitDisabled(!isValid)
  }, [setIsSubmitDisabled, isValid])

  // タブメニュー
  const tabs: Array<{ name: string, component: any }> = [
    {
      // マウス操作
      name: t('cameraConfig.mouse.tab'),
      component: (
        <MouseCameraSettingsMenu
          initialValue={formValues}
          errors={errors}
          setFieldValue={setFieldValue}
        />
      )
    },
    {
      // キー操作
      name: t('cameraConfig.key.tab'),
      component: (
        <KeyCameraSettingsMenu
          initialValue={formValues}
          errors={errors}
          setFieldValue={setFieldValue}
        />
      )
    }
  ]

  return (
    <Form
      id={FORM_ID}
      autoComplete='off' // キー入力の妨げになるので自動補完はOFF
    >
      <Tabs
        defaultIndex={0}
        onSelect={index => onChangeTab(index)}
        tabs={tabs.map((tab, i) => (
          <Tabs.Tab key={i}>{tab.name}</Tabs.Tab>
        ))}
      >
        {tabs.map((tab, i) => {
          return tabIndex === 0 ? (
            <TabPanelWrapperMouse key={i}>{tab.component}</TabPanelWrapperMouse>
          ) : (
            <TabPanelWrapper key={i}>{tab.component}</TabPanelWrapper>
          )
        })}
      </Tabs>
    </Form>
  )
}

export default CameraControlModal
