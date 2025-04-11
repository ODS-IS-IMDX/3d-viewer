// Copyright (c) 2025 NTT InfraNet
// @flow
import { withNamespaces } from 'react-i18next'
import CameraControlModal, { type FormValues } from './CameraControlModal'

export default withNamespaces('site')(CameraControlModal)
export type { FormValues }
