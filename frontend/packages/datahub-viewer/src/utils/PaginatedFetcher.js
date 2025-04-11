// Copyright (c) 2025 NTT InfraNet
// @flow
import { PureComponent, type Node } from 'react'

type State = {
  items: Array<{}>,
  limit: number,
  offset: number,
  isLoading: boolean,
  more: () => void,
  next: () => void,
  previous: () => void
}

export type PaginatedFetcherProps = {
  loader: ({ limit: number, offset: number }) => {
    limit: number,
    offset: number,
    items: Array<*>
  },
  children: (state: State) => Node
}

export class PaginatedFetcher extends PureComponent<
  PaginatedFetcherProps,
  State
> {
  more = () => {
    this.fetch(this.state.offset + this.state.limit, true)
  }

  next = () => {
    this.fetch(this.state.offset + this.state.limit)
  }

  previous = () => {
    this.fetch(this.state.offset - this.state.limit)
  }

  state = {
    items: [],
    limit: 20,
    offset: 0,
    isLoading: true,
    more: this.more,
    next: this.next,
    previous: this.previous
  }

  async fetch (offset: number, append: boolean = false) {
    if (!this.state.isLoading) {
      this.setState({
        isLoading: true
      })
    }
    const result = await this.props.loader({ limit: this.state.limit, offset })
    this.setState({
      isLoading: false,
      items: append ? [...this.state.items, ...result.items] : result.items,
      limit: result.limit,
      offset: result.offset
    })
  }

  componentDidMount () {
    this.fetch(this.state.offset)
  }

  render () {
    return this.props.children(this.state)
  }
}
