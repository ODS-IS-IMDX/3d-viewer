// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useState, useEffect } from 'react'
import { withNamespaces } from 'react-i18next'
import { Dropdown } from '@ehv/datahub-components'
import {
  ColorSelectorOptions,
  type ColorSelectorOptionsType
} from './ColorSelectorOptions'

type ColorSelectorProps = {
  /** 上部に表示するラベル */
  label?: string,
  name?: string,
  /** 選択する項目（#FFFFFF） */
  value?: string,
  /** 項目選択時イベント */
  onChange: (color: string) => void
}

/**
 * カラーセレクター
 */
const ColorSelectorComponent = React.memo<ColorSelectorProps>(
  (props: ColorSelectorProps) => {
    const { t, label, name = '', value = null, onChange } = props

    /** 選択中の項目 */
    const [selected, setSelected] = useState(ColorSelectorOptions(t)[0])

    useEffect(() => {
      const defaultOption = ColorSelectorOptions(t).find(
        option => option.value === value
      )
      if (defaultOption) {
        setSelected(defaultOption)
      }
    }, [value, t])

    return (
      <Dropdown
        label={label}
        name={name}
        options={ColorSelectorOptions(t)}
        value={selected}
        onChange={(option: ColorSelectorOptionsType) => {
          setSelected(option)
          onChange(option.value)
        }}
      />
    )
  }
)

export const ColorSelector = withNamespaces()(ColorSelectorComponent)
