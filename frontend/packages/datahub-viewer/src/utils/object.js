// Copyright (c) 2025 NTT InfraNet
// @flow

/** 空のオブジェクトかどうか判定 */
export const isEmpty = (object: any) => {
  let result = false
  if (Object.keys(object).length === 0) {
    result = true
  }
  return result
}
