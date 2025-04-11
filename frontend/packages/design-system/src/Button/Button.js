// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'
import {
  fontWeight,
  borders,
  borderColor,
  borderRadius,
  buttonStyle
} from 'styled-system'

import Box from '../Box'
import { themed } from '../utils'

export const theme = {
  color: '#ffffff',
  fontFamily: 'Source Sans Pro',
  states: {
    disabled: {
      backgroundColor: '#e0e3e5'
    },
    loading: {
      backgroundColor: '#606770'
    }
  },
  variants: {
    primary: {
      backgroundColor: '#16abe3',
      states: {
        hover: {
          backgroundColor: '#0084b5'
        }
      }
    },
    secondary: {
      backgroundColor: '#ffffff',
      color: '#3a4248',
      states: {
        hover: {
          backgroundColor: '#cccccc'
        }
      }
    },
    dark: {
      backgroundColor: '#ecf0f3',
      color: '#757e86',
      states: {
        hover: {
          backgroundColor: '#ecf0f3'
        }
      }
    },
    outline: {
      border: 'solid 2px #16abe3',
      backgroundColor: '#ffffff',
      color: '#16abe3',
      states: {
        hover: {
          border: 'solid 2px #0084b5',
          backgroundColor: '#eeeeee',
          color: '#0084b5'
        }
      }
    },
    round: {
      borderRadius: 50,
      backgroundColor: '#16abe3',
      states: {
        hover: {
          backgroundColor: '#0084b5'
        }
      }
    },
    icon: {
      borderRadius: 50,
      color: '#3a4248',
      backgroundColor: 'white',
      display: 'flex',
      width: 40
    },
    minimal: {
      backgroundColor: 'inherit',
      color: 'inherit',
      font: 'inherit',
      cursor: 'inherit'
    }
  },
  colors: {
    success: {
      backgroundColor: '#16abe3',
      color: '#ffffff',
      states: {
        hover: {
          backgroundColor: '#0084b5'
        }
      }
    },
    warning: {
      backgroundColor: '#ed5b66',
      color: '#ffffff',
      states: {
        hover: {
          backgroundColor: '#c91625'
        }
      }
    },
    info: {
      backgroundColor: '#ffffff',
      color: '#3a4248',
      states: {
        hover: {
          backgroundColor: '#cccccc'
        }
      }
    }
  }
}

export const Button = styled(Box)`
  height: 40px;
  cursor: pointer;
  appearance: none;
  display: inline-block;
  text-align: center;
  line-height: inherit;
  text-decoration: none;
  outline: none;

  border-radius: 2px;

  &:disabled {
    cursor: not-allowed;
  }

  &[loading] {
    cursor: wait;
  }

  ${fontWeight}
  ${borders}
  ${borderColor}
  ${borderRadius}
  ${buttonStyle}
  ${themed('Button', theme)}
`

Button.propTypes = {
  ...fontWeight.propTypes,
  ...borders.propTypes,
  ...borderColor.propTypes,
  ...borderRadius.propTypes,
  ...buttonStyle.propTypes
}

Button.defaultProps = {
  as: 'button',
  variant: 'primary',
  fontSize: 14,
  px: 4,
  py: 2,
  border: 0
}
