// Copyright (c) 2025 NTT InfraNet
// @flow
import DHUnitConverter from '@ehv/datahub-unit-converter'

import type { SiteCCRS } from '../plugins/site/reducer'

export type UnitConverter = {
  areaUnit: string,
  lengthUnit: string,
  degreeUnit: string,
  length: (valueToConvert: number, unit: string) => string,
  area: (valueToConvert: number, unit?: string) => string,
  position: (lon, lat, height) => {}
}

const UNIT_DEG = 'deg'
export const UNIT_US_FEET = 'us-ft'
export const UNIT_INTL_FEET = 'ft'

export const unitConverter = (
  { measurementSystem, transform, parameters, geoidHeight }: SiteCCRS,
  toFixed: number = 3
): UnitConverter => {
  /*
  米国測量フィートを表す際に、Viewerで使用しているdatahub-unit-converterというライブラリではus-ftという文字列で表している。
  一方でSite APIからはftUSという文字列が返却される。
  そのため、Site APIからの返却値をViewerで扱えるようにするため、ftUSからus-ftからへの文字列の変換をする。

  なお、本来であればdatahub-unit-converterを修正してftUSという文字列を扱えるようにする方が適切である。
  しかしながら、以下の理由により、暫定的に本ファイル内で修正を行うこととした。
  ・ライブラリの修正は影響範囲が大きいため
  ・本修正を行う時点でライブラリの仕様を把握しているものがいないため
  */
  if (measurementSystem.length === 'ftUS') {
    measurementSystem.length = 'us-ft'
  }
  if (measurementSystem.position === 'ftUS') {
    measurementSystem.position = 'us-ft'
  }

  const converter = new DHUnitConverter({
    outputMeasurementSystem: measurementSystem,
    transform,
    parameters,
    geoidHeight
  })

  const {
    length: lengthUnit,
    area: areaUnit,
    volume: volumeUnit,
    density: densityUnit,
    mass: massUnit
  } = converter.outputMeasurementSystem

  return {
    areaUnit,
    massUnit,
    lengthUnit,
    volumeUnit,
    densityUnit,
    degreeUnit: UNIT_DEG,
    instance: converter,
    length: (valueToConvert: number) =>
      converter
        .length(valueToConvert)
        .toNumeric()
        .toFixed(toFixed),
    area: (valueToConvert: number) =>
      converter
        .area(valueToConvert)
        .toNumeric()
        .toFixed(toFixed),
    volume: (valueToConvert: number) =>
      converter
        .volume(valueToConvert)
        .toNumeric()
        .toFixed(toFixed),
    density: (valueToConvert: number) =>
      converter
        .density(valueToConvert)
        .toNumeric()
        .toFixed(toFixed),
    mass: (valueToConvert: number) =>
      converter
        .mass(valueToConvert)
        .toNumeric()
        .toFixed(toFixed),
    position: (lon, lat, height) => converter.position(lon, lat, height)
  }
}
