// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import styled from 'styled-components'
import { ToastContainer } from 'react-toastify'

const StyledNotificationContainer = styled(ToastContainer).attrs({
  className: 'toast-container',
  toastClassName: 'toast',
  bodyClassName: 'body',
  progressClassName: 'progress'
})`
  /* .toast-container */

  width: auto;
  max-height: 365px;
  overflow-x: hidden;
  overflow-y: hidden;
  padding: 0;
  z-index: 99999;

  &:hover {
    /* overlayに設定した場合枠内に表示される */
    overflow-y: auto;
  }

  .toast {
    box-shadow: none;
    margin: 0;
    padding: 0;
    cursor: auto;

    width: 380px;
    min-height: 48px;

    &:not(:first-child) {
      position: relative;

      button {
        visibility: hidden;
      }

      &::before {
        content: '';
        display: block;
        position: absolute;
        width: 344px;
        height: 1px;
        top: -1;
        left: 18px;
        background-color: rgba(255, 255, 255, 0.3);
      }
    }

    &:first-child {
      border-radius: 4px 4px 0 0;
    }

    &:last-child {
      border-radius: 0 0 4px 4px;
    }

    &:first-child:last-child {
      border-radius: 4px;
    }
  }

  .body {
    display: grid;
    align-items: center;
  }

  ${({ isMobile }) =>
    isMobile &&
    `
  /* .toast-container */

  @media only screen and (max-width: 480px) {
    left: auto;
  }
  right: 0px;
  top: 90px;

  .toast {
    /*幅の指定*/
    max-width: 340px;
  }

  .body {
    div {
      /*幅の指定*/
      max-width: 340px;
      /*icon*/
      svg {
        display: none;
      }
      /*文字*/
      div {
        padding-left: 20px;
      }
      button {
        div {
          svg {
            display: flex;
            padding: 6px;
          }
        }
      }
    }
  }
  `}
`

type Props = {
  isMobile: boolean
}

export class NotificationContainer extends React.PureComponent<Props> {
  render () {
    return (
      <StyledNotificationContainer
        autoClose={false}
        closeButton={false}
        closeOnClick
        draggable
        hideProgressBar
        newestOnTop={false}
        pauseOnHover
        pauseOnVisibilityChange
        isMobile={this.props.isMobile}
        position={this.props.isMobile ? 'top-right' : 'bottom-left'}
        rtl={false}
      />
    )
  }
}
