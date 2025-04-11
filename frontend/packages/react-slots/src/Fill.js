// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import {
  Consumer,
  type FillProps,
  type MountFunc,
  type UpdateFunc,
  type UnmountFunc
} from './Context'

type Props = {
  slot: string,
  mount: MountFunc,
  update: UpdateFunc,
  unmount: UnmountFunc,
  ...$Exact<FillProps>
}

export class Fill extends React.PureComponent<Props> {
  id: number

  componentDidMount () {
    const { slot, mount, update, unmount, ...props } = this.props
    this.id = mount(slot, props)
  }

  componentDidUpdate () {
    const { slot, mount, update, unmount, ...props } = this.props
    update(this.id, slot, props)
  }

  componentWillUnmount () {
    const { unmount } = this.props
    unmount(this.id)
  }

  render () {
    return null
  }
}

export default (props: { slot: string }) => (
  <Consumer>
    {({ mount, update, unmount }) => (
      <Fill {...props} mount={mount} update={update} unmount={unmount} />
    )}
  </Consumer>
)
