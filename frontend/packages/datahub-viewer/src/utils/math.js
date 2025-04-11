// Copyright (c) 2025 NTT InfraNet
// @flow
// 小数点以下の指定桁数で四捨五入をする
// 例： roundDecimal(100.123456, 4) => 100.1235
export const roundDecimal = (decimal: number, digit: number): number => {
  if (!decimal || typeof decimal !== 'number') {
    return 0
  }

  return Math.round(decimal * Math.pow(10, digit)) / Math.pow(10, digit)
}

/**
 * 線形補間用関数
 * @param value1 データ欠損部分を接する片方の値
 * @param value2 データ欠損部分を接するもう片方の値
 * @param count 欠損データの個数
 * @returns 補完した欠損データの配列
 */
export const linearInterpolation = (
  value1: number,
  value2: number,
  count: number
): Array<number> => {
  const results = new Array<number>(count)
  for (let index = 0; index < count; index++) {
    const amt = (index + 1) / (count + 1)
    results[index] = (1 - amt) * value1 + amt * value2
  }

  return results
}

/**
 * 角度や時間の度分秒を十進に変換する
 * @param degree 度(整数)
 * @param minute 分(整数, 0 <= minute < 60)
 * @param second 秒(整数や小数, 0 <= second < 60)
 * @returns 変換された十進数
 */
export const convertDmsToDecimal = ({
  degree = 0,
  minute = 0,
  second = 0
}: {
  degree: number,
  minute: number,
  second: number
}): number => degree + minute / 60 + second / 3600
