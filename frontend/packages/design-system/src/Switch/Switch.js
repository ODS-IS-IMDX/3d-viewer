// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'
import { themed } from '../utils'

export const theme = {
  backgroundColor: '#dedede',
  states: {
    checked: {
      backgroundColor: '#82bdeb'
    }
  },
  named: {
    slider: {
      backgroundColor: '#bdbdbd'
    },
    checkedSlider: {
      backgroundColor: '#2196f3'
    }
  }
}

export const Switch = styled.input.attrs({
  type: 'checkbox'
})`
  cursor: pointer;
  position: relative;
  display: inline-block;
  appearance: none;
  outline: none;

  border: 0;
  margin: 0;
  padding: 0;

  width: 34px;
  height: 14px;
  border-radius: 50px;
  transition: 0.4s;

  &:checked::after {
    transform: translateX(17px) translateY(-50%);
  }

  &::after {
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    transition: 0.4s;
    border-radius: 100%;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateX(-3px) translateY(-50%);
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);
  }

  ${themed('Switch', theme, {
    slider: '&::after',
    checkedSlider: '&:checked::after'
  })}
`
