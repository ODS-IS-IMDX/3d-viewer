// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'

import Box from '../Box'
import { themed } from '../utils'

export const Image = styled(Box).attrs({ as: 'img' })(themed('Image'))

Image.propTypes = {}
