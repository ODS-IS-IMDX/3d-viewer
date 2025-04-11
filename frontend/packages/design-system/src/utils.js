// Copyright (c) 2025 NTT InfraNet
// @flow
import { type StandardProperties } from 'csstype'

export type Styles = StandardProperties<string | number>

export type Named = {
  [selector: string]: Styles
}

export type Names = {
  [selector: string]: string
}

export type States = {
  [state: string]: Styles & {
    named?: Named
  }
}

export type Variants = {
  [variant: string]: Styles & {
    states?: States,
    named?: Named
  }
}

export type Colors = {
  [color: string]: Styles & {
    states?: States,
    named?: Named
  }
}

export type Sizes = Array<
  Styles & {
    as?: string,
    named?: Named,
    states?: States
  }
>

export type Theme = Styles & {
  sizes?: Sizes,
  named?: Named,
  states?: States,
  variants?: Variants,
  colors?: Colors
}

type Props = {
  size: number,
  variant: string,
  color: string,
  theme: {
    [name: string]: Theme
  }
}

export const themedVariants = (
  variants: Variants = {},
  props: Props = {},
  names: Names
) => {
  const name = props.variant
  const { states = {}, named = {}, ...variant } = variants[name] || {}
  return {
    ...variant,
    ...themedStates(states, props, names),
    ...themedNamed(named, names)
  }
}

export const themedColors = (
  colors: Colors = {},
  props: Props = {},
  names: Names
) => {
  const name = props.color
  const { states = {}, named = {}, ...color } = colors[name] || {}
  return {
    ...color,
    ...themedStates(states, props, names),
    ...themedNamed(named, names)
  }
}

export const themedSizes = (
  sizes: Sizes = [],
  props: Props = {},
  names: Names
) => {
  const number = props.size || 0
  const { states = {}, named = {}, ...size } = sizes[number] || {}
  return {
    ...size,
    ...themedStates(states, props, names),
    ...themedNamed(named, names)
  }
}

export const themedStates = (
  states: States = {},
  props: Props = {},
  names: Names
) => {
  return Object.keys(states).reduce((result, name) => {
    const { named = {}, ...state } = states[name] || {}
    return {
      ...result,
      ...(props[name]
        ? {
            ...state,
            ...themedNamed(named, names)
          }
        : {}),
      [`&:${name}`]: {
        ...state,
        ...themedNamed(named, names)
      }
    }
  }, {})
}

export const themedNamed = (named: Named = {}, names: Names = {}) => {
  return Object.keys(named).reduce(
    (result, name) => ({
      ...result,
      [names[name]]: named[name] || {}
    }),
    {}
  )
}

export const themed = (
  key: string,
  fallback: Theme = {},
  names: Names = {}
) => (props: Props) => {
  const {
    sizes = [],
    variants = {},
    colors = {},
    states = {},
    named = {},
    ...styles
  } = props.theme[key] || fallback

  return {
    ...styles,
    ...themedSizes(sizes, props, names),
    ...themedVariants(variants, props, names),
    ...themedColors(colors, props, names),
    ...themedStates(states, props, names),
    ...themedNamed(named, names)
  }
}
