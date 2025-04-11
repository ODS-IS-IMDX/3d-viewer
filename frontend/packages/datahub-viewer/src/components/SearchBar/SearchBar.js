// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { Flex, Input } from '@ehv/datahub-components'
import { IconSearch } from '@ehv/datahub-icons'

type SearchBarProps = {
  inputStringList: Array<string>,
  placeholder?: string,
  setOutputStringList?: (Array<string>) => void,
  handleChange?: (SyntheticEvent<HTMLInputElement>) => void,
  customFilter?: string => void
}

const SearchBarWrapper = styled(Flex)`
  border: 1px solid #c4c4c4;
  border-radius: 50px;
  height: 50px;
`
const StyledIconSearch = styled(IconSearch)`
  transform: scale(1.5);
`
const StyledInput = styled(Input)`
  background-color: transparent;
  font-size: 12px;
  width: calc(100% - 75px);

  &:hover {
    border-bottom: 0px;
  }
  &:focus {
    border-bottom: 0px;
  }
`

const SearchBarComponent = (props: SearchBarProps) => {
  const {
    inputStringList,
    placeholder,
    setOutputStringList,
    handleChange,
    customFilter,
    ...rest
  } = props

  if (!setOutputStringList && !customFilter) {
    // SearchBarを使用する時に、setOutputStringListまたはcustomFilterどちらの一つが必須
    // どちらも存在しない場合、該当コンポーネントの検索機能が作動しないため非表示にする
    return null
  }

  const filterList = (keyword: string) => {
    setOutputStringList &&
      setOutputStringList(
        inputStringList.filter(inputString =>
          inputString.toLowerCase().includes(keyword.toLowerCase())
        )
      )
  }

  return (
    <SearchBarWrapper {...rest}>
      <StyledIconSearch width={25} height={25} />
      <StyledInput
        placeholder={placeholder}
        onChange={event => {
          if (customFilter) {
            customFilter(event.target.value)
          } else {
            filterList(event.target.value)
          }
          handleChange && handleChange(event)
        }}
      />
    </SearchBarWrapper>
  )
}

export const SearchBar = React.memo<SearchBarProps>(SearchBarComponent)
