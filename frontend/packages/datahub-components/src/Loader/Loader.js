// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Node } from 'react'

export type LoaderProps = {
  loading?: boolean,
  loadingLabel: string,
  children?: () => Node
}

export const Loader = ({ loading, loadingLabel, children }: LoaderProps) =>
  loading ? <>{loadingLabel}</> : children ? children() : null
