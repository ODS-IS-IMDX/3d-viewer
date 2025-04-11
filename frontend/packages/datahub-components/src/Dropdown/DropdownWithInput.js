// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Box, Input as DesignSystemInput } from '@ehv/design-system'
import { Dropdown, type DropdownProps } from './Dropdown'

type DropdownWithInputProps = {
  ...DropdownProps,
  value: {
    label: string,
    value: number
  },
  onChange: (inputValue: string) => void
}

// $FlowFixMe[infererror]
const DropdownWithInputWrapper = styled(Box)`
  position: relative;
`
const Input = styled(DesignSystemInput)`
  position: absolute;
  top: 1px;
  left: 1px;
  width: 640px;
  padding: 10px;
  border-radius: 5px 0 0 5px;
  background-color: #f8f8f8;
`

const Component = ({ value, onChange, ...props }: DropdownWithInputProps) => {
  const [inputValue, setInputValue] = useState(
    value && value.label ? value.label : ''
  )
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    onChange(inputValue)
  }, [onChange, inputValue])

  const inputRef = useRef<HTMLInputElement>()

  return (
    <DropdownWithInputWrapper>
      <Dropdown
        {...props}
        menuIsOpen={isOpen}
        value={value}
        onClick={event => setIsOpen(!isOpen)}
        onChange={selectedOption => setInputValue(selectedOption.label)}
      />
      <Input
        ref={inputRef}
        value={inputValue}
        // FIXME すぐDropdownを閉じると選択した値が反映されなくなるので、一旦setTimeoutを使用
        onBlur={event => {
          setTimeout(() => {
            inputRef.current && setIsOpen(false)
          }, 200)
        }}
        onClick={() => {
          setIsOpen(true)
          // $FlowFixMe[infererror]: select()はDOMから提供された関数のため、エラー抑制
          inputRef.current.select()
        }}
        onChange={event => {
          setInputValue(event.target.value)
          setIsOpen(true)
        }}
      />
    </DropdownWithInputWrapper>
  )
}

export const DropdownWithInput = React.memo<DropdownWithInputProps>(Component)
