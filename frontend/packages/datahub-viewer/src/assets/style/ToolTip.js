// Copyright (c) 2025 NTT InfraNet
import { css } from 'styled-components'

export const ToolTip = css`
  .rootTooltip {
    position: relative;
    cursor: pointer;
    display: inline-block;
  }
  .tooltip {
    display: none;
    position: absolute;
    padding: 10px;
    font-size: 12px;
    line-height: 1.6em;
    color: #000;
    border-radius: 5px;
    background: #fff;
    width: 250px;
    z-index: 1;
    border: 1px solid;
    white-space: pre-line;
  }
  .rootTooltip:hover .tooltip {
    display: inline-block;
    top: 30px;
    left: -20px;
  }
`
