import React from 'react'
import { storiesOf } from '@storybook/react'
import { SearchBar } from './SearchBar'

const inputStringList = ['aaa', 'aab', 'abc', 'bbc', 'bcc', 'ccc']
let outputStringList = []

storiesOf('SearchBar', module)
  .addParameters({ component: SearchBar })
  .add('use setOutputStringList props', () => (
    <SearchBar
      placeholder='検索結果はブラウザのコンソールに出力される'
      inputStringList={inputStringList}
      setOutputStringList={newOutputStringList => {
        outputStringList = newOutputStringList
      }}
      handleChange={() => {
        console.log('The outputStringList is ', outputStringList)
      }}
    />
  ))
  .add('use customFilter props', () => (
    <SearchBar
      placeholder='検索結果はブラウザのコンソールに出力される'
      inputStringList={inputStringList}
      customFilter={keyword => {
        outputStringList = inputStringList.filter(inputString =>
          inputString.toLowerCase().includes(keyword.toLowerCase())
        )
        console.log('The outputStringList is ', outputStringList)
      }}
    />
  ))
  .add('Error: not use setOutputStringList and customFilter props', () => (
    <SearchBar
      placeholder='setOutputStringListとcustomFilterどちらも定義していないため、エラー'
      inputStringList={inputStringList}
    />
  ))
